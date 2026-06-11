import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

FIXES = {
    'compare/va-horizon-vs-onlinejobs-ph/index.html': [
        ('looks like - no fluff, just specifics.', 'looks like, with exact numbers.'),
    ],
    'compare/va-horizon-vs-reva-global/index.html': [
        ('looks like - no fluff, just specifics.', 'looks like, with exact numbers.'),
    ],
    'compare/va-horizon-vs-upwork-cold-callers/index.html': [
        ('looks like - no fluff, just specifics.', 'looks like, with exact numbers.'),
    ],
    'glossary/seller-financing/index.html': [
        ('It can unlock deals where', 'It can make deals work where'),
    ],
    'guides/highlevel-custom-fields-wholesalers/index.html': [
        ('Custom fields unlock conditional logic', 'Custom fields enable conditional logic'),
    ],
    'guides/where-to-find-real-estate-vas/index.html': [
        ('<span class="section-label">The Landscape</span>', '<span class="section-label">Where to Look</span>'),
    ],
    'guides/sms-blast-real-estate/index.html': [
        ("Whether you're setting up SMS for the first time or trying to improve a campaign that's been getting blocked, every answer is in this hub.",
         "First campaign or one that keeps getting blocked, every answer is in this hub."),
    ],
    'guides/sms-blast-response-rates-real-estate/index.html': [
        ("Sending during peak windows isn't just about open rate - it's about catching sellers when they have mental bandwidth to engage with a non-urgent request.",
         "Peak windows matter beyond open rate: you catch sellers when they have the mental bandwidth to engage with a non-urgent request."),
    ],
    'services/acquisition-manager/index.html': [
        ("This isn't just a VA placement. It's a managed acquisitions role, vetting, CRM, handoff rules, and weekly performance management included from day one.",
         "This is a managed acquisitions role: vetting, CRM, handoff rules, and weekly performance management included from day one."),
    ],
    'services/cold-calling/index.html': [
        ("This isn't just a VA placement. It's the full operating setup, dialer, CRM, scripts, management. Here's what's actually in scope.",
         "This is the full operating setup: dialer, CRM, scripts, and management. Here's what's actually in scope."),
    ],
    'services/sms-blast-campaigns/index.html': [
        ("SMS outreach isn't just sending messages. It's compliance registration, list segmentation, message strategy, and response handling. Here's what a properly run SMS campaign actually includes.",
         "SMS outreach at volume means compliance registration, list segmentation, message strategy, and response handling. Here's what a properly run campaign actually includes."),
    ],
    'solutions/buy-and-hold-landlords/index.html': [
        ('The goal is not just a cash offer. It is finding rentals that match your long-term hold strategy.',
         'The goal is rentals that fit your long-term hold strategy, not just a quick cash offer.'),
    ],
}

applied = 0
missed = 0
for fname, pairs in FIXES.items():
    with open(fname, encoding='utf-8', newline='') as fh:
        s = fh.read()
    for old, new in pairs:
        n = s.count(old)
        if n == 0:
            print(f'MISS  [{fname}]  {old[:60]!r}')
            missed += 1
        else:
            s = s.replace(old, new)
            applied += n
    with open(fname, 'w', encoding='utf-8', newline='') as fh:
        fh.write(s)

print(f'Applied {applied}, missed {missed}.')
