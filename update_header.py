import os
import re

base_dir = r"C:\Users\yousef\Desktop\Files\va-horizon-website"

# Read index.html to extract the standard header
index_path = os.path.join(base_dir, "index.html")
with open(index_path, "r", encoding="utf-8") as f:
    index_content = f.read()

header_match = re.search(r'(<header class="site-header.*?</header>)', index_content, re.DOTALL)
if not header_match:
    print("Could not find header in index.html")
    exit(1)

standard_header = header_match.group(1)
print("Found standard header (length: %d)" % len(standard_header))

# Iterate through all HTML files
for root, dirs, files in os.walk(base_dir):
    if '.git' in root or 'VAHorizonWebsiteStyle' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            # Skip index.html itself
            if filepath == index_path:
                continue
                
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace the existing header with the standard header
            new_content, count = re.subn(r'<header class="site-header.*?</header>', standard_header, content, flags=re.DOTALL)
            
            if count > 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated header in {filepath}")
            else:
                print(f"No existing header matched in {filepath}")

print("Done standardizing navbar.")
