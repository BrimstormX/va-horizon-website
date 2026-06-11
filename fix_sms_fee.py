import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

FIXES = {
    'va-horizon-operations.md': [
        ('**Implementation:** $450 one-time setup fee', '**Implementation:** $600 one-time setup fee'),
    ],
    'llms.txt': [
        ('SMS Blast: $450 setup', 'SMS Blast: $600 setup'),
    ],
    'services/index.html': [
        ('$450 setup', '$600 setup'),
    ],
    'services/sms-blast-campaigns/index.html': [
        ('"price": "450"', '"price": "600"'),
        ('$450 setup before any custom scope changes', '$600 setup before any custom scope changes'),
        ('<div class="stat-num">$450 setup</div>', '<div class="stat-num">$600 setup</div>'),
    ],
    'tools/wholesale-deal-roi-calculator/index.html': [
        ('SMS Blast adds $450 setup', 'SMS Blast adds $600 setup'),
    ],
    'blog/sms-blast-real-estate-wholesaling/index.html': [
        ('$450 one-time', '$600 one-time'),
    ],
}

for f, pairs in FIXES.items():
    s = open(f, encoding='utf-8', newline='').read()
    for old, new in pairs:
        n = s.count(old)
        print(f'{f} :: {old[:55]!r} x{n}')
        s = s.replace(old, new)
    open(f, 'w', encoding='utf-8', newline='').write(s)
print('done')
