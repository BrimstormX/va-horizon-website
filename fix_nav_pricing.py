"""Swap nav 'Contact' (duplicate of the Book a Call CTA) for a 'Pricing' link,
and add a Pricing link to the footer Services column, across all source pages."""
import io
import os
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SKIP_DIRS = {'_site', 'node_modules', 'output', 'VAHorizonWebsiteStyle', 'vendor', '.git', 'src', '.agents', '.claude', '.github', '.vscode', 'docs', 'content', 'generator'}

NAV_OLD = '<a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="text-white hover:text-va-gold font-medium transition-colors">Contact</a>'
NAV_NEW = '<a href="/pricing/" class="text-white hover:text-va-gold font-medium transition-colors">Pricing</a>'

FOOTER_ANCHOR = '<li><a href="/crm/" class="hover:text-va-gold transition-colors">CRM</a></li>'
FOOTER_PRICING = '<li><a href="/pricing/" class="hover:text-va-gold transition-colors">Pricing</a></li>'

nav_swapped = 0
footer_added = 0
files_touched = 0

html_files = []
for root, dirs, fs_ in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for f in fs_:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f).replace('\\', '/'))

for fname in sorted(html_files):
    with open(fname, encoding='utf-8', newline='') as fh:
        s = fh.read()
    orig = s

    if NAV_OLD in s:
        s = s.replace(NAV_OLD, NAV_NEW)
        nav_swapped += 1

    if FOOTER_ANCHOR in s and FOOTER_PRICING not in s:
        # preserve the indentation of the CRM line
        idx = s.index(FOOTER_ANCHOR)
        line_start = s.rfind('\n', 0, idx) + 1
        indent = s[line_start:idx]
        if indent.strip() == '':
            s = s.replace(FOOTER_ANCHOR, FOOTER_ANCHOR + '\n' + indent + FOOTER_PRICING, 1)
            footer_added += 1

    if s != orig:
        with open(fname, 'w', encoding='utf-8', newline='') as fh:
            fh.write(s)
        files_touched += 1

print(f'Files touched: {files_touched} | nav Contact->Pricing: {nav_swapped} | footer Pricing added: {footer_added}')
