import io
import os
import re
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SKIP = {'_site', 'node_modules', 'output', 'VAHorizonWebsiteStyle', 'vendor', '.git', 'src', '.agents', '.claude', '.github', '.vscode', 'docs', 'content', 'generator'}

WORDS = [
    r'\bleverag(e|es|ed|ing)\b',
    r'not just a\b',
    r"isn't just",
    r'\belevate[sd]?\b',
    r'no fluff',
    r"Whether you're",
    r'\bunlock(s|ed|ing)?\b',
    r'\blandscape\b',
    r'hassle-free',
    r'\bseamless(ly)?\b',
    r'\bsupercharge\b',
    r'game.chang',
    r'\bdelve\b',
    r'\bempower(s|ed|ing)?\b',
    r'\beffortless(ly)?\b',
    r'\brevolutioniz',
]

files = []
for root, dirs, fs in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in SKIP]
    for f in fs:
        if f.endswith('.html'):
            files.append(os.path.join(root, f).replace('\\', '/'))

n = 0
for fname in sorted(files):
    s = open(fname, encoding='utf-8', newline='').read()
    he = s.find('</head>')
    spans = [(m.start(), m.end()) for m in re.finditer(r'(?s)<script\b[^>]*>.*?</script>', s)]
    for w in WORDS:
        for m in re.finditer(w, s, re.I):
            i = m.start()
            if i < he:
                continue
            if any(a <= i < b for a, b in spans):
                continue
            ctx = re.sub(r'\s+', ' ', s[max(0, i - 80):i + 90])
            print(f'{fname} :: {ctx}')
            n += 1
print('TOTAL', n)
