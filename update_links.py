import os
import re

base_dir = r"C:\Users\yousef\Desktop\Files\va-horizon-website"

for root, dirs, files in os.walk(base_dir):
    if '.git' in root or 'VAHorizonWebsiteStyle' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # 1. Update Services links
            content = re.sub(r'href="[^"]*?#services"', 'href="/industries/real-estate/"', content)
            
            # 2. Convert relative paths to absolute paths
            content = re.sub(r'href="\.\./\.\./', 'href="/', content)
            content = re.sub(r'href="\.\./', 'href="/', content)
            content = re.sub(r'src="\.\./\.\./', 'src="/', content)
            content = re.sub(r'src="\.\./', 'src="/', content)
            
            # Also in index.html, convert links to absolute
            if root == base_dir:
                # Top level file
                content = re.sub(r'href="apply/"', 'href="/apply/"', content)
                content = re.sub(r'href="services/cold-calling/"', 'href="/services/cold-calling/"', content)
                content = re.sub(r'href="industries/real-estate/"', 'href="/industries/real-estate/"', content)
                content = re.sub(r'href="case-studies/"', 'href="/case-studies/"', content)
                content = re.sub(r'href="blog/"', 'href="/blog/"', content)
                content = re.sub(r'href="ai-automations/"', 'href="/ai-automations/"', content)
                content = re.sub(r'href="crm/"', 'href="/crm/"', content)
                content = re.sub(r'src="logo\.png"', 'src="/logo.png"', content)
                content = re.sub(r'src="va-horizon\.png"', 'src="/va-horizon.png"', content)
                content = re.sub(r'src="tagline\.png"', 'src="/tagline.png"', content)
                content = re.sub(r'src="buttons\.js"', 'src="/buttons.js"', content)
                content = re.sub(r'href="fonts\.css"', 'href="/fonts.css"', content)
                content = re.sub(r'href="cards\.css(.*?)"', r'href="/cards.css\1"', content)
                content = re.sub(r'href="css/va-custom\.css"', 'href="/css/va-custom.css"', content)

            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

print("Links updated successfully!")
