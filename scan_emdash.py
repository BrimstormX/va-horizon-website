import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

FILES = [
    'ai-automations/index.html',
    'compare/va-horizon-vs-upwork-cold-callers/index.html',
    'compare/va-horizon-vs-onlinejobs-ph/index.html',
    'compare/va-horizon-vs-in-house-va/index.html',
    'compare/best-cold-calling-va-companies/index.html',
    'guides/vetting-cold-calling-vas/index.html',
    'tools/mao-calculator/index.html',
    'guides/scaling-va-team/index.html',
    'compare/va-horizon-vs-reva-global/index.html',
    'guides/va-performance-kpis/index.html',
    'compare/va-horizon-vs-myoutdesk/index.html',
    'glossary/after-repair-value-arv/index.html',
    'glossary/maximum-allowable-offer-mao/index.html',
    'blog/index.html',
    'tools/cold-call-volume-calculator/index.html',
    'guides/hire-real-estate-va/index.html',
]

total = 0
for f in FILES:
    s = open(f, encoding='utf-8').read()
    head_end = s.find('</head>')
    script_spans = [(m.start(), m.end()) for m in re.finditer(r'(?s)<script\b.*?</script>', s)]
    hits = []
    for m in re.finditer('—|&mdash;', s):
        i = m.start()
        if i < head_end:
            continue
        if any(a <= i < b for a, b in script_spans):
            continue
        ctx = s[max(0, i - 90):i + 90].replace('\n', ' ')
        ctx = re.sub(r'\s+', ' ', ctx)
        hits.append(ctx)
    if hits:
        print(f'\n===== {f} ({len(hits)}) =====')
        for h in hits:
            print('  * ' + h)
        total += len(hits)

print(f'\nTOTAL visible em dashes: {total}')
