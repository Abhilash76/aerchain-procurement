"""
SOW Analysis Server - Powered by Docling + Instructor + Ollama
Provides high-precision vendor document analysis against SOW requirements.
"""

import json
import logging
import os
import re
import tempfile
from pathlib import Path
from typing import Any, Optional

import uvicorn
from docling.document_converter import DocumentConverter
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import ollama

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Aerchain SOW Analysis API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas for Structured Extraction ---

class SOWMapping(BaseModel):
    sowPoint: str = Field(description="The exact SOW line item name (e.g. 'Strategy & Planning')")
    vendorTerm: str = Field(description="The term the vendor used for the same concept")
    finding: str = Field(description="What the vendor specifically said or proposed")
    impact: str = Field(description="The impact on the project (e.g., 'Exceeds scope', 'Gap identified')")
    citation: str = Field(description="Where in the doc this was found (section/page)")
    matchScore: int = Field(description="How closely vendor's term matches the SOW requirement, 0-100", ge=0, le=100)

class VendorAnalysisResult(BaseModel):
    vendorName: str = Field(description="Full name of the vendor/agency")
    documentTitle: str = Field(description="Title or name of the document")
    overallSowAlignment: int = Field(description="Overall SOW alignment percentage 0-100", ge=0, le=100)
    mappings: list[SOWMapping] = Field(description="Precise mapping of each SOW point to vendor proposal")
    scores: dict[str, int] = Field(description="Technical benchmarking scores (1-10) for key categories")
    totalCost: float = Field(description="Total proposed cost as a number")
    missingRequirements: list[str] = Field(description="SOW requirements not addressed by vendor")
    strengths: list[str] = Field(description="Key strengths of this vendor proposal")
    gaps: list[str] = Field(description="Identified gaps or concerns")

# SOW Line Items (mirroring the frontend constants)
SOW_LINE_ITEMS = [
    {"name": "Strategy & Planning", "description": "Integrated marketing strategy for NutriKid SEA launch, target audience analysis, 360-degree campaign framework"},
    {"name": "TVC Production", "description": "TV commercial production for 5-12 age group, 30-sec and 60-sec cuts, regional language adaptations"},
    {"name": "Social Media Management", "description": "Full social media management across Instagram, Facebook, TikTok for 12 months"},
    {"name": "Creative Quality", "description": "Creative direction, concept development, brand identity alignment"},
    {"name": "Compliance & Regulatory", "description": "Kids Advertising & Claims Review compliance for CFBAI SEA guidelines"},
    {"name": "Market Reach", "description": "Geographic coverage across Indonesia, Malaysia, Thailand, Vietnam, Philippines"},
    {"name": "Media Optimization", "description": "Media buying, programmatic advertising, performance marketing"},
    {"name": "Project Governance", "description": "Account management team, reporting cadence, escalation protocols"},
]

def parse_document_with_docling(file_path: str) -> str:
    """Use Docling for layout-aware, high-fidelity document parsing."""
    try:
        logger.info(f"Parsing document with Docling: {file_path}")
        converter = DocumentConverter()
        result = converter.convert(file_path)
        
        # Export to markdown for clean, structured text extraction
        md_text = result.document.export_to_markdown()
        logger.info(f"Docling parsed {len(md_text)} characters from {Path(file_path).name}")
        return md_text
    except Exception as e:
        logger.warning(f"Docling parsing failed for {file_path}: {e}. Falling back to raw text.")
        # Fallback: try reading as plain text
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception:
            raise HTTPException(status_code=422, detail=f"Could not parse document: {e}")

def extract_json_from_response(content: str) -> dict:
    """Robustly extract JSON from LLM response."""
    # Try markdown code block first
    match = re.search(r"```json\s*([\s\S]*?)\s*```", content)
    if match:
        return json.loads(match.group(1))
    # Try raw JSON object
    match = re.search(r"\{[\s\S]*\}", content)
    if match:
        return json.loads(match.group(0))
    raise ValueError("No valid JSON found in model response")

def analyze_with_ollama(document_text: str, filename: str) -> VendorAnalysisResult:
    """Run structured SOW alignment analysis via Ollama."""
    
    sow_items_str = "\n".join([f"- {item['name']}: {item['description']}" for item in SOW_LINE_ITEMS])
    
    # Limit text window to stay within model context
    text_window = document_text[:12000]
    
    prompt = f"""You are a senior procurement analyst. Analyze this vendor proposal against the SOW requirements below.

SCOPE OF WORK (SOW) REQUIREMENTS:
{sow_items_str}

VENDOR DOCUMENT: {filename}
---
{text_window}
---

TASK:
1. For EVERY SOW line item, find the corresponding content in the vendor proposal.
2. Map them precisely, even if the vendor uses different terminology.
3. Score the overall alignment (0-100%) based on coverage and quality.
4. Identify missing requirements and key strengths/gaps.
5. Give technical scores (1-10) for: Strategy, Creative, Speed, Reach, Media, Compliance, Resource, Governance.

Return ONLY valid JSON matching this exact structure:
{{
  "vendorName": "string",
  "documentTitle": "string",
  "overallSowAlignment": 0-100,
  "mappings": [
    {{
      "sowPoint": "SOW line item name",
      "vendorTerm": "term vendor used",
      "finding": "what vendor specifically proposed",
      "impact": "impact assessment",
      "citation": "where in document",
      "matchScore": 0-100
    }}
  ],
  "scores": {{"Strategy": 1-10, "Creative": 1-10, "Speed": 1-10, "Reach": 1-10, "Media": 1-10, "Compliance": 1-10, "Resource": 1-10, "Governance": 1-10}},
  "totalCost": number,
  "missingRequirements": ["list of SOW items not addressed"],
  "strengths": ["key strength 1", "key strength 2"],
  "gaps": ["gap 1", "gap 2"]
}}"""

    logger.info(f"Sending to Ollama for analysis: {filename}")
    
    response = ollama.chat(
        model="kimi-k2-thinking:cloud",
        messages=[{"role": "user", "content": prompt}],
        options={"temperature": 0.1}
    )
    
    content = response["message"]["content"]
    logger.info(f"Received response ({len(content)} chars) for {filename}")
    
    raw = extract_json_from_response(content)
    
    # Normalize totalCost to float
    cost = raw.get("totalCost", 0)
    if isinstance(cost, str):
        cost = float(re.sub(r"[^\d.]", "", cost) or "0")
    raw["totalCost"] = float(cost)
    
    # Ensure all required fields exist with defaults
    raw.setdefault("missingRequirements", [])
    raw.setdefault("strengths", [])
    raw.setdefault("gaps", [])
    raw.setdefault("overallSowAlignment", 0)
    raw.setdefault("documentTitle", filename)
    
    return VendorAnalysisResult(**raw)


@app.get("/health")
def health_check():
    return {"status": "ok", "version": "2.0.0", "engine": "Docling + Ollama"}


@app.post("/analyze")
async def analyze_document(
    file: UploadFile = File(...),
):
    """Analyze a single vendor document against the SOW using Docling + Ollama."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    logger.info(f"Received file for analysis: {file.filename}")

    # Save to temp file for Docling
    suffix = Path(file.filename).suffix
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # Step 1: Parse with Docling
        document_text = parse_document_with_docling(tmp_path)
        
        # Step 2: Structured analysis with Ollama
        result = analyze_with_ollama(document_text, file.filename)
        
        return result.model_dump()
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed for {file.filename}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temp file
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8765, log_level="info")
