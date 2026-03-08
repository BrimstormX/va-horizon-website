import os
import re

base_dir = r"C:\Users\yousef\Desktop\Files\va-horizon-website"

# 1. Update ai-automations/index.html
ai_file = os.path.join(base_dir, "ai-automations", "index.html")
with open(ai_file, "r", encoding="utf-8") as f:
    c = f.read()
c = re.sub(r"[\t ]*<style>.*?DARK LUXURY.*?</style>\n*", '    <link rel="stylesheet" href="../css/ai-automations.css">\n', c, flags=re.DOTALL)
c = c.replace('<body class="font-montserrat', '<body class="ai-automations font-montserrat')
with open(ai_file, "w", encoding="utf-8") as f:
    f.write(c)

# 2. Update blog/index.html
blog_file = os.path.join(base_dir, "blog", "index.html")
with open(blog_file, "r", encoding="utf-8") as f:
    cb = f.read()
cb = re.sub(r"[\t ]*<style>\s*\.hero-blog \{.*?</style>\n*", '', cb, flags=re.DOTALL)
with open(blog_file, "w", encoding="utf-8") as f:
    f.write(cb)

# 3. Update case-studies/index.html
cs_file = os.path.join(base_dir, "case-studies", "index.html")
with open(cs_file, "r", encoding="utf-8") as f:
    cs = f.read()
cs = re.sub(r"[\t ]*<style>\s*\.hero-case-studies \{.*?</style>\n*", '', cs, flags=re.DOTALL)
with open(cs_file, "w", encoding="utf-8") as f:
    f.write(cs)

# 4. Append shared CSS to va-custom.css
shared_css = """

/* ============================================================
   SHARED BLOG & CASE STUDIES & MOBILE MENU
   ============================================================ */

.hero-blog, .hero-case-studies {
    background: linear-gradient(135deg, #082541 0%, #0a2e52 100%);
    color: white;
}

.blog-card, .cs-card {
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.cs-card {
    border: 1px solid var(--va-divider);
}

.blog-card:hover, .cs-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px -10px rgba(8, 37, 65, 0.15);
    border-color: #C5A059;
}

.result-tag {
    background: rgba(197, 160, 89, 0.1);
    color: #C5A059;
    font-weight: 700;
}

/* Base Mobile Menu Styling (Extracted from buttons.js & inline styles) */
#mobile-menu {
    display: none;
    position: fixed !important;
    top: 62px !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    border-radius: 0 0 0.75rem 0.75rem !important;
    padding: 1.25rem 1.5rem 2rem !important;
    background-color: var(--va-navy, #0a224e) !important;
    color: white;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
    border-top: 2px solid rgba(197,160,89,0.35) !important;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 50;
}

#mobile-menu.show { 
    display: flex !important; 
}

#mobile-menu button,
#mobile-menu a,
#mobile-menu span {
    color: white;
    text-align: left;
    display: block !important;
    padding: 0.75rem 0 !important;
    font-size: 0.95rem !important;
    border-bottom: 1px solid rgba(255,255,255,0.06) !important;
    width: 100% !important;
}

#mobile-menu button:hover,
#mobile-menu a:hover {
    color: var(--va-gold, #eab308);
}

/* Extracted from buttons.js interactive elements CSS */
.va-btn {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.va-btn:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 15px rgba(0,0,0,0.15);
}
.pricing-toggle {
    position: relative;
    overflow: hidden;
    border-radius: 9999px;
}
.pricing-toggle button {
    position: relative;
    z-index: 1;
    transition: background-color 0.3s ease, color 0.3s ease,
                transform 0.3s ease, box-shadow 0.3s ease;
}
.pricing-toggle .toggle-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    transition: transform 0.3s ease;
    border-radius: inherit;
    z-index: 0;
}
.pricing-toggle.full .toggle-indicator {
    transform: translateX(100%);
}
"""

va_custom_file = os.path.join(base_dir, "css", "va-custom.css")
with open(va_custom_file, "a", encoding="utf-8") as f:
    f.write(shared_css)

print("CSS extractions and HTML cleanups complete!")
