import io
import os
import re
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SKIP_DIRS = {'_site', 'node_modules', 'output', 'VAHorizonWebsiteStyle', 'vendor', '.git', 'src', '.agents', '.claude', '.github', '.vscode', 'docs', 'content', 'generator'}

html_files = []
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f).replace('\\', '/'))

visible_hits = []
script_hits = []

for fname in sorted(html_files):
    with open(fname, encoding='utf-8', newline='') as fh:
        s = fh.read()
    head_end = s.find('</head>')

    script_blocks = list(re.finditer(r'(?s)<script\b([^>]*)>(.*?)</script>', s))
    script_spans = [(m.start(), m.end(), 'ld+json' in m.group(1)) for m in script_blocks]

    for m in re.finditer('—|&mdash;', s):
        i = m.start()
        in_script = None
        for a, b, is_ld in script_spans:
            if a <= i < b:
                in_script = (a, b, is_ld)
                break
        ctx = re.sub(r'\s+', ' ', s[max(0, i - 60):i + 60])
        if in_script is not None:
            if not in_script[2]:
                script_hits.append(f'{fname} :: {ctx}')
        elif i >= head_end:
            visible_hits.append(f'{fname} :: {ctx}')

print(f'Scanned {len(html_files)} HTML files')
print(f'\nVISIBLE em dashes: {len(visible_hits)}')
for h in visible_hits[:40]:
    print('  ' + h)
print(f'\nNon-JSON-LD <script> em dashes (may render as visible text): {len(script_hits)}')
for h in script_hits[:40]:
    print('  ' + h)

for extra in ('buttons.js', 'llms.txt'):
    with open(extra, encoding='utf-8', newline='') as fh:
        s = fh.read()
    n = len(re.findall('—|&mdash;', s))
    print(f'\n{extra}: {n} em dashes')
    if n:
        for m in list(re.finditer('—|&mdash;', s))[:15]:
            i = m.start()
            print('  ' + re.sub(r'\s+', ' ', s[max(0, i - 60):i + 60]))
