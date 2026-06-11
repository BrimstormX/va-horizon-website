"""Rule-based em-dash remover for visible HTML copy, per va-horizon-operations.md rules.

Order per ' — ' in visible text (outside <head> and <script>):
  R1  </strong> — x  /  </code> — x      ->  ': '   (definition lists)
  R2  a — short aside — b                ->  ' (aside) '   (skipped in citation-heavy stats posts)
  R4  — + what/how/whether elaboration   ->  ': '
  R5  — + independent-clause pronoun     ->  '. ' + capitalized
  RC  guarded default                    ->  ', '
  R6  anything left                      ->  reported for manual fix

Usage: python fix_emdash_bulk.py [--apply]
"""
import io
import re
import os
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

APPLY = '--apply' in sys.argv

SKIP_DIRS = {'_site', 'node_modules', 'output', 'VAHorizonWebsiteStyle', 'vendor', '.git', 'src', '.agents', '.claude', '.github', '.vscode', 'docs', 'content', 'generator'}

STATS_FILES = {
    './blog/real-estate-cold-calling-statistics/index.html',
    './blog/real-estate-virtual-assistant-statistics/index.html',
    './blog/real-estate-wholesaling-statistics/index.html',
}

R4_WORDS = ('what', "what's", 'how', 'whether')
R5_WORDS = (
    'they', "they're", "they'll", "they've", 'it', "it's", 'you', "you're", "you'll", "you've",
    'we', "we're", "we'll", 'that', "that's", 'this', 'these', 'those', 'he', 'she', 'i',
)

decisions = []


def fix_segment(seg, fname):
    seg = seg.replace('&mdash;', '—')
    if '—' not in seg:
        return seg

    def r1(m):
        decisions.append((fname, 'R1', m.group(0)[:80]))
        return m.group(1) + ': '
    seg = re.sub(r'(</strong>|</code>)\s+—\s+', r1, seg)

    if fname not in STATS_FILES:
        def r2(m):
            decisions.append((fname, 'R2', m.group(0)[:100]))
            return ' (' + m.group(1).strip() + ') '
        seg = re.sub(r' —\s+([^—<>.!?;:]{10,90}?)\s+— ', r2, seg)

    def dispatch(m):
        following = m.group(1)
        word = following.lower().strip('"“‘($[&')
        ctx = re.sub(r'\s+', ' ', m.group(0)[:80])
        if word in R4_WORDS:
            decisions.append((fname, 'R4', ctx))
            return ': ' + following
        if word in R5_WORDS:
            decisions.append((fname, 'R5', ctx))
            return '. ' + following[0].upper() + following[1:]
        decisions.append((fname, 'RC', ctx))
        return ', ' + following

    # guarded: previous char must be wordish; following token captured
    seg = re.sub(r'(?<=[\w"”’%)\].!?])\s+—\s+(\S+)', dispatch, seg)
    return seg


html_files = []
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f).replace('\\', '/'))

changed_files = 0
for fname in sorted(html_files):
    with open(fname, encoding='utf-8', newline='') as fh:
        s = fh.read()
    if '—' not in s and '&mdash;' not in s:
        continue

    head_end = s.find('</head>')
    if head_end == -1:
        head_end = 0

    boundaries = ([(0, head_end)] if head_end else [])
    boundaries += [(m.start(), m.end()) for m in re.finditer(r'(?s)<script\b[^>]*>.*?</script>', s)]
    boundaries.sort()
    merged = []
    for a, b in boundaries:
        if merged and a <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], b))
        else:
            merged.append((a, b))

    out = []
    pos = 0
    for a, b in merged:
        out.append(fix_segment(s[pos:a], fname))
        out.append(s[a:b])
        pos = b
    out.append(fix_segment(s[pos:], fname))
    new = ''.join(out)

    if new != s:
        changed_files += 1
        if APPLY:
            with open(fname, 'w', encoding='utf-8', newline='') as fh:
                fh.write(new)

from collections import Counter
mode = 'APPLIED' if APPLY else 'DRY RUN'
print(f'[{mode}] files changed: {changed_files}')
print(Counter(r for _, r, _ in decisions))
print()
for fname, rule, ctx in decisions:
    if rule in ('R2', 'R4', 'R5'):
        print(f'{rule:4} {fname} :: {ctx}')
