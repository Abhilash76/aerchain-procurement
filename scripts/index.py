"""
Aerchain SOW Analysis Server v2.2.0
Features: Docling (Parsing) + Instructor (Structured AI) + /health endpoint
"""

import os
import re
import logging
import tempfile
from pathlib import Path
from typing import List, Dict, Any, Optional

import uvicorn
import instructor
from openai import OpenAI
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from docling.document_converter import DocumentConverter

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Aerchain SOW Analysis API", version="2.2.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Normalization Constants ---
COST_SYNONYMS = [
    "Investment", "Total Fee", "Commercial Bid", "Price", "Quote", 
    "Grand Total", "Financial Proposal", "Outlay", "Contract Value"
]

# --- Pydantic Models (with robust defaults to prevent validation crashes) ---

class SOWMapping(BaseModel):
    sowPoint: str = Field(default="Unmapped", description="SOW line item name")
    vendorTerm: str = Field(default="N/A", description="Term used by vendor")
    finding: str = Field(default="No specific data found", description="Evidence from doc")
    impact: str = Field(default="Neutral", description="Gap or Match analysis")
    citation: str = Field(default="Unknown", description="Page/Section reference")
    matchScore: int = Field(default=0, ge=0, le=100)

class VendorAnalysisResult(BaseModel):
    vendorName: str = Field(default="Unknown Vendor")
    documentTitle: str = Field(default="Unknown Document")
    overallSowAlignment: int = Field(default=0)
    totalCost: float = Field(default=0.0)
    currency: str = Field(default="USD")
    mappings: List[SOWMapping] = Field(default_factory=list)
    scores: Dict[str, int] = Field(default_factory=dict)
    strengths: List[str] = Field(default_factory=list)
    gaps: List[str] = Field(default_factory=list)

    @field_validator('totalCost', mode='before')
    @classmethod
    def clean_and_normalize_cost(cls, v: Any) -> float:
        """Normalizes various currency strings into a clean float."""
        if isinstance(v, (int, float)):
            return float(v)
        if isinstance(v, str):
            # Strips symbols like $, ₹, commas, and letters
            clean = re.sub(r"[^\d.]", "", v)
            try:
                return float(clean)
            except ValueError:
                return 0.0
        return 0.0

# --- Core Processing Logic ---

def analyze_document_content(text: str, filename: str) -> VendorAnalysisResult:
    """Uses Instructor to force the AI to follow the schema and normalize terms."""
    
    # Initialize the instructor-wrapped client
    client = instructor.from_openai(
        OpenAI(
            base_url=f"{os.getenv('OLLAMA_HOST', 'http://localhost:11434')}/v1",
            api_key="ollama", # Dummy key for local Ollama
        ),
        mode=instructor.Mode.JSON,
    )

    # Context window limit
    prompt_text = text[:15000]

    system_msg = (
        "You are a Senior Procurement Analyst. Extract data with high precision. "
        f"IMPORTANT: Normalize any financial terms (like {', '.join(COST_SYNONYMS)}) "
        "to the 'totalCost' field. Map vendor concepts to SOW requirements semantically."
    )

    try:
        return client.chat.completions.create(
            model="kimi-k2-thinking:cloud",
            response_model=VendorAnalysisResult,
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": f"File: {filename}\n\nContent:\n{prompt_text}"}
            ],
            temperature=0
        )
    except Exception as e:
        logger.error(f"AI Extraction Error: {e}")
        return VendorAnalysisResult(documentTitle=filename, gaps=[f"AI processing failed: {str(e)}"])

# --- API Endpoints ---

@app.get("/health")
def health_check():
    """CRITICAL: Keep this for Docker/Vercel health checks."""
    return {
        "status": "healthy",
        "engine": "Docling + Instructor",
        "model": "kimi-k2-thinking:cloud"
    }

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    """The main entry point for document analysis."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename found")

    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        # Step 1: High-fidelity parsing with Docling
        converter = DocumentConverter()
        doc_result = converter.convert(tmp_path)
        md_text = doc_result.document.export_to_markdown()

        if not md_text:
            raise HTTPException(status_code=500, detail="Docling failed to extract text.")

        # Step 2: AI Analysis
        analysis = analyze_document_content(md_text, file.filename)
        return analysis.model_dump()

    except Exception as e:
        logger.error(f"Global failure for {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

if __name__ == "__main__":
    # Note: Running on 8765 as per your original Docker config
    uvicorn.run(app, host="0.0.0.0", port=8765)