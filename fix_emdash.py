import io
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

EM = '—'

FIXES = {
    'compare/va-horizon-vs-myoutdesk/index.html': [
        (f'real estate market {EM} agents, property managers, brokers.', 'real estate market: agents, property managers, brokers.'),
        (f'Readymode predictive {EM} 800', 'Readymode predictive: 800'),
        (f'General real estate {EM} not wholesaling-specific', 'General real estate, not wholesaling-specific'),
        (f'Not publicly listed {EM} contact for quote', 'Not publicly listed (contact for quote)'),
        (f'Not included {EM} VA adapts to your existing system', 'Not included (VA adapts to your existing system)'),
        (f'Available {EM} verify current terms directly', 'Available (verify current terms directly)'),
        (f'Terms vary {EM} check before purchasing', 'Terms vary (check before purchasing)'),
        (f'details may change {EM} confirm directly', 'details may change. Confirm directly'),
        (f"These aren't marketing points {EM} they're the practical", "These aren't marketing points. They're the practical"),
        (f'distressed seller conversations {EM} not generic real estate scripts', 'distressed seller conversations, not generic real estate scripts'),
        (f'live conversations {EM} not 100 manual calls', 'live conversations, not 100 manual calls'),
        (f'real estate prospecting {EM} calling expired listings', 'real estate prospecting: calling expired listings'),
        (f"they'll make calls {EM} but the training isn't", "they'll make calls, but the training isn't"),
        (f'submits fewer leads {EM} not because of effort', 'submits fewer leads, not because of effort'),
        (f'the infrastructure {EM} scripts, CRM stages, dialer, QA process {EM} already exists', 'the infrastructure (scripts, CRM stages, dialer, QA process) already exists'),
        (f'system integration {EM} typically 2', 'system integration, typically 2'),
        (f"not a flaw in their model {EM} it's what full-service", "not a flaw in their model. It's what full-service"),
        (f'replaces them {EM} no additional placement fee', 'replaces them: no additional placement fee'),
        (f'replacement processes {EM} which is worth knowing', 'replacement processes, which is worth knowing'),
        (f"comparison isn't close {EM} and it's worth being honest", "comparison isn't close, and it's worth being honest"),
        (f'are here</a> {EM} no anonymized metrics', 'are here</a>: no anonymized metrics'),
        (f'matter to you {EM} and for some buyers, they genuinely should {EM} MyOutDesk', 'matter to you (and for some buyers, they genuinely should), MyOutDesk'),
        (f"VA Horizon {EM} if you're wholesaling and need outbound now", "VA Horizon: if you're wholesaling and need outbound now"),
        (f"MyOutDesk {EM} if you're an agent, broker, or property manager", "MyOutDesk: if you're an agent, broker, or property manager"),
        (f'admin, or marketing support {EM} not wholesaling-specific outreach', 'admin, or marketing support, not wholesaling-specific outreach'),
        (f'flex-shrink-0">{EM}</span>', 'flex-shrink-0">•</span>'),
    ],
    'ai-automations/index.html': [
        ('qualifies and books them &mdash; both wired into', 'qualifies and books them, both wired into'),
        ('are handled end to end &mdash; interested sellers land', 'are handled end to end. Interested sellers land'),
        ('a booked call &mdash; on its own.', 'a booked call, on its own.'),
        ('to HighLevel automatically &mdash; no rep touches the keyboard.', 'to HighLevel automatically. No rep touches the keyboard.'),
        ('Hi Linda &mdash; saw you own 1423 Oak St. Any thought of selling? &mdash; Jordan, Cash Offers', 'Hi Linda, saw you own 1423 Oak St. Any thought of selling? - Jordan, Cash Offers'),
        ('Cash, as-is &mdash; no repairs, no fees.', 'Cash, as-is: no repairs, no fees.'),
        ('post into HighLevel automatically &mdash; tagged, timestamped', 'post into HighLevel automatically, tagged, timestamped'),
        ('&ldquo;No problem &mdash; I&rsquo;ll follow up at 7 PM.', '&ldquo;No problem. I&rsquo;ll follow up at 7 PM.'),
        ('property on Oak Street &mdash; are you still open to an offer?', 'property on Oak Street. Are you still open to an offer?'),
        ('manager on with you &mdash; one moment.', 'manager on with you. One moment.'),
        ('ends in the right place &mdash; handled.', 'ends in the right place. Handled.'),
        (f'HERO {EM} centered, conversion-first', 'HERO: centered, conversion-first'),
        (f'SHOWCASE {EM} live SMS conversation', 'SHOWCASE: live SMS conversation'),
    ],
    'blog/index.html': [
        ('Skip Genie, and TLO &mdash; mobile hit rates', 'Skip Genie, and TLO: mobile hit rates'),
    ],
}

total_applied = 0
total_missed = 0
for fname, pairs in FIXES.items():
    with open(fname, encoding='utf-8', newline='') as fh:
        s = fh.read()
    for old, new in pairs:
        n = s.count(old)
        if n == 0:
            print(f'MISS  [{fname}]  {old[:70]!r}')
            total_missed += 1
        else:
            s = s.replace(old, new)
            total_applied += n
    with open(fname, 'w', encoding='utf-8', newline='') as fh:
        fh.write(s)
    print(f'OK    {fname}')

print(f'\nApplied {total_applied} replacements, {total_missed} misses.')
