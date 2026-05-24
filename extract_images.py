import fitz
import os

pdf_files = {
    "individuals": r"d:\Projects\ForestGift\ForestGift\client\public\booklet for individuals_11zon.pdf",
    "industries": r"d:\Projects\ForestGift\ForestGift\client\public\booklet for industries_11zon.pdf",
    "institutes": r"d:\Projects\ForestGift\ForestGift\client\public\booklet for institution_11zon.pdf"
}

output_dir = r"d:\Projects\ForestGift\ForestGift\client\public\booklets"
os.makedirs(output_dir, exist_ok=True)

# Generate images at 2x resolution (144 dpi) for high quality
zoom = 2.0
mat = fitz.Matrix(zoom, zoom)

for name, path in pdf_files.items():
    print(f"Processing {name}...")
    target_dir = os.path.join(output_dir, name)
    os.makedirs(target_dir, exist_ok=True)
    
    doc = fitz.open(path)
    for i in range(len(doc)):
        page = doc[i]
        pix = page.get_pixmap(matrix=mat, alpha=False)
        img_path = os.path.join(target_dir, f"page_{i + 1}.jpg")
        pix.save(img_path)
    print(f"Saved {len(doc)} pages for {name}")

print("Done extracting images.")
