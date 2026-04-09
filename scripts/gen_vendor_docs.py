import os
from docx import Document
from docx.shared import Inches
import pptx
from pptx.util import Inches as PptxInches
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import doc_utils
import random

OUTPUT_DIR = "Vendor documents"

def gen_docx(filename, vendor_name, pages=35):
    print(f"Generating {filename} for {vendor_name}...")
    doc = Document()
    doc.add_heading(f'{vendor_name} - Technical Proposal', 0)
    
    # Ensure every single Line Item is mentioned explicitly in the DOCX
    for idx, item in enumerate(doc_utils.LINE_ITEMS):
        page_num = (idx % pages) + 1
        doc.add_heading(f'Section {page_num}: {item} Implementation', level=1)
        doc.add_paragraph(f"--- INTERNAL MARKER: PAGE {page_num} ---")
        
        # Inject data-heavy finding
        finding = doc_utils.generate_messy_paragraph(vendor_name, include_cost=True, cost_category=item)
        doc.add_paragraph(finding)
        
        # Add supporting jargon
        doc.add_paragraph(f"Our approach to {item} leverages {doc_utils.get_marketing_jargon()} to ensure zero-defect delivery.")
        
    doc.save(os.path.join(OUTPUT_DIR, filename))

def gen_pptx(filename, vendor_name, slides=40):
    print(f"Generating {filename} for {vendor_name}...")
    prs = pptx.Presentation()
    
    title_slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(title_slide_layout)
    slide.shapes.title.text = f"{vendor_name} Strategic Mapping"
    slide.placeholders[1].text = "SOW Alignment & Technical Methodology"
    
    # Ensure every SOW point is a slide
    for i, item in enumerate(doc_utils.LINE_ITEMS):
        slide = prs.slides.add_slide(prs.slide_layouts[1])
        slide.shapes.title.text = f"{item} Framework"
        
        body = slide.placeholders[1].text_frame
        body.text = doc_utils.generate_messy_paragraph(vendor_name, include_cost=True, cost_category=item)
        
        p = body.add_paragraph()
        p.text = f"Key Metric for {item}: {random.randint(85, 99)}% confidence interval."
        
    prs.save(os.path.join(OUTPUT_DIR, filename))

def gen_xlsx(filename, vendor_name, sheets=5):
    print(f"Generating {filename} for {vendor_name}...")
    wb = Workbook()
    profile = doc_utils.VENDOR_PROFILES[vendor_name]
    
    ws = wb.active
    ws.title = "Commercial Mapping"
    ws.append(["SOW Line Item", "Vendor Descriptor", "Total Fee", "Timeline", "Impact Score"])
    
    for item in doc_utils.LINE_ITEMS:
        cost = profile["costs"].get(item, 0)
        ws.append([
            item,
            f"{doc_utils.get_marketing_jargon()} implementation",
            cost + random.randint(-500, 500),
            "12-14 Weeks",
            f"{random.randint(90, 99)}%"
        ])
    
    wb.save(os.path.join(OUTPUT_DIR, filename))

def gen_pdf(filename, vendor_name, pages=45):
    print(f"Generating {filename} for {vendor_name}...")
    c = canvas.Canvas(os.path.join(OUTPUT_DIR, filename), pagesize=letter)
    width, height = letter
    
    for i, item in enumerate(doc_utils.LINE_ITEMS):
        c.setFont("Helvetica-Bold", 14)
        c.drawString(72, height - 72, f"{vendor_name} - {item} Analysis [PAGE {i+1}]")
        
        c.setFont("Helvetica", 10)
        y = height - 120
        
        text = doc_utils.generate_messy_paragraph(vendor_name, include_cost=True, cost_category=item)
        words = text.split()
        lines = [" ".join(words[j:j+10]) for j in range(0, len(words), 10)]
        for line in lines:
            c.drawString(72, y, line)
            y -= 15
            
        c.showPage()
    c.save()

import random # Ensure random is available if not already in doc_utils scope

if __name__ == "__main__":
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    # Generate distinct proposals for each vendor
    gen_docx("Nexus_Technical_Proposal.docx", "Nexus Creative", pages=35)
    gen_pptx("Global_Marketing_Deck.pptx", "Global Media Hub", slides=40)
    gen_xlsx("Velocity_Commercial_Bid.xlsx", "Velocity Studios", sheets=3)
    gen_pdf("Nexus_Compliance_Addendum.pdf", "Nexus Creative", pages=20)
    gen_pdf("Master_Vendor_DeepDive.pdf", "Global Media Hub", pages=45)
    
    print("All multi-vendor test documents generated successfully.")
