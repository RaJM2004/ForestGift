import PyPDF2
import sys
import json

def extract_pdf(path):
    try:
        text = ""
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for i, page in enumerate(reader.pages):
                text += f"\n--- Page {i+1} ---\n"
                text += page.extract_text()
        return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    paths = [
        r"d:\Projects\ForestGift\ForestGift\client\public\booklet for individuals_11zon.pdf",
        r"d:\Projects\ForestGift\ForestGift\client\public\booklet for industries_11zon.pdf",
        r"d:\Projects\ForestGift\ForestGift\client\public\booklet for institution_11zon.pdf"
    ]
    
    results = {}
    for p in paths:
        results[p] = extract_pdf(p)
        
    print(json.dumps(results, indent=2))
