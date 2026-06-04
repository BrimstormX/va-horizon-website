import os, re

base = 'C:/Users/yousef/Desktop/Files/va-horizon-website/services'

SERVICES = {
    'acquisition-manager': {
        'intro': 'The acquisitions manager seat has the highest leverage per VA dollar in a wholesaling operation — and the highest cost of a bad hire. This is the role that converts qualified leads into signed contracts.',
        'good': 'You are generating 30+ qualified seller leads a month and the bottleneck is now offer conversations and follow-up. The owner is still handling every seller call personally and deals are stalling.',
        'also': 'Operators who had an AM before but got unreliable performance from a hire without real estate AM experience and a proven track record of closings.',
        'not_fit': 'If you do not yet have consistent lead flow — even 20 qualified leads a month — an AM will not have enough to work. Fix the top of the funnel first.'
    },
    'call-qa-management': {
        'intro': 'QA is how you turn caller activity into improving performance over time. Without it, you are managing effort, not output. With it, callers know exactly what the lead standard is and why.',
        'good': 'You have active cold callers producing leads but no systematic way to know if call quality is consistent, whether the lead standard is being applied, or where conversations are stalling.',
        'also': 'Teams scaling to multiple callers who need a management layer that does not require the owner to personally listen to calls and write scorecards.',
        'not_fit': 'If you have one new VA who just started and has not dialed a full week yet — establish baseline performance first, then add QA structure.'
    },
    'disposition-manager': {
        'intro': 'Most wholesalers build the front end first — callers, CRM, leads. Disposition is where deals turn into money, and it is the part that gets manual owner attention when it should not.',
        'good': 'You have deals under contract but you are personally building buyer lists, blasting deal packages, coordinating access, and following up with buyers.',
        'also': 'Operators who have deal flow but buyers go cold because follow-up is slow. Often the issue is not deal quality — it is dispo process speed.',
        'not_fit': 'Pre-revenue operations or new wholesalers who have not closed their first few deals yet. Get the front end working before adding a dispo seat.'
    },
    'follow-up-automation': {
        'intro': 'Automation does not replace acquisition follow-up. It handles work that should not need a human — no-answer sequences, re-engagement triggers, appointment reminders — so your team focuses on conversations that matter.',
        'good': 'You are generating seller conversations but warm leads go cold between contact attempts. Follow-up is inconsistent because it depends on memory or manual reminders.',
        'also': 'Operators adding a lead manager or AM who want automated re-qualification sequences built so the human role starts with warm conversations.',
        'not_fit': 'Teams who do not yet have a CRM in place. Automation without a structured pipeline creates a different kind of chaos.'
    },
    'highlevel-automation': {
        'intro': 'HighLevel automation is most useful when it removes manual CRM work without removing judgment from seller conversations. Less time on repeat tasks, not replacing acquisitions with software.',
        'good': 'You have HighLevel but your team is manually doing what should be automated: tagging leads, sending follow-up messages, updating stages, scheduling appointment reminders.',
        'also': 'Operators building a new HighLevel account who want automations built correctly from the start rather than retrofitting bad workflows later.',
        'not_fit': 'Teams looking for AI to handle seller conversations autonomously. HighLevel automation handles workflow logic, not sales judgment.'
    },
    'highlevel-crm-setup': {
        'intro': 'HighLevel is the CRM of choice for wholesaling operations. But a blank GHL account does nothing useful. The pipeline stages, custom fields, automations, and reporting need to be built for how your operation works.',
        'good': 'You have callers making conversations but no clean place for those conversations to land, be tracked, and be reviewed. Or you have HighLevel already but it is unused or messy.',
        'also': 'Operators starting from scratch who want the CRM built correctly before the first VA starts dialing — so there is no rework after launch.',
        'not_fit': 'Teams who already have a working CRM pipeline they are happy with. This service is for building or rebuilding, not for adding automations to an existing system.'
    },
    'lead-manager': {
        'intro': 'The lead manager sits between callers and acquisitions. They keep warm sellers warm, re-qualify cold ones, and make sure your AM is spending time on deals that are moving — not starting from scratch on every callback.',
        'good': 'Your qualified lead volume is above 40-50 per month and your AM or owner cannot keep up with callback timing. Warm sellers are going cold between first contact and offer conversation.',
        'also': 'Operators where the owner is still doing lead management personally and it is eating into offer and deal-closing time.',
        'not_fit': 'If you do not yet have enough leads to justify a dedicated triage role. At lower volumes, the caller or AM can handle re-qualification directly.'
    },
    'list-sourcing': {
        'intro': 'A cold caller without a list is a dialer with nowhere to go. List sourcing is where most outbound operations fail silently — not because the caller is bad, but because the records are wrong for the market.',
        'good': 'You want to start outbound but do not know which list types to prioritize for your market, or you are currently calling whatever comes out of a broad export without targeting strategy.',
        'also': 'Operators who have tried calling before but got low contact rates and fewer leads than expected. Often the list strategy is the issue, not the caller.',
        'not_fit': 'Teams who already have a proven list strategy that is producing consistent qualified leads. This service is for operators building or fixing their sourcing approach.'
    },
    'readymode-dialer-setup': {
        'intro': 'Readymode is the predictive dialer that makes the math behind cold calling work. Without it, an 8-hour day produces maybe 100 calls. With it, the same shift delivers 800-1,000 attempts and 150-200 live conversations.',
        'good': 'You are adding a cold calling VA and want Readymode configured, loaded with your list, and compliant before they start. Or you have a VA dialing manually who is hitting a volume ceiling.',
        'also': 'Operators with multiple callers who need Readymode set up for team-level dialing with proper seat configuration and reporting.',
        'not_fit': 'Single operators doing their own casual calling. Readymode is designed for dedicated VA cold callers, not owner-operated part-time outreach.'
    },
    'skip-tracing-coordination': {
        'intro': 'Skip tracing turns a list of property addresses into phone numbers you can actually call. Done wrong, your caller spends 40% of their shift hitting dead numbers and wrong contacts.',
        'good': 'You have property lists from BatchLeads, PropStream, or a county database but no process for getting clean, phone-appended records into Readymode before dialing.',
        'also': 'Operators whose callers show high disconnect rates and dead number percentages. That is usually a skip tracing coordination problem, not a caller problem.',
        'not_fit': 'Teams who already have a working skip trace workflow integrated with their list pull and dialer setup.'
    },
    'sms-blast-campaigns': {
        'intro': 'SMS is the second-fastest way to reach motivated sellers behind live calling. When the compliance is handled, the list is segmented, and the response workflow is ready, it surfaces leads that calls alone miss.',
        'good': 'You want to add a second outreach channel alongside cold calling. Your lists are segmented, you understand A2P 10DLC requirements, and you have a plan for responding to inbound texts quickly.',
        'also': 'Operators who tried SMS before, got compliance issues or carrier filtering, and want to rebuild the system correctly with proper registration and send cadences.',
        'not_fit': 'Teams who want to send bulk SMS without TCPA compliance review. Non-compliant campaigns get flagged and burned fast.'
    },
    'wholesale-team-scaling': {
        'intro': 'Adding more VAs without role clarity does not scale — it creates coordination overhead. This consultation is about figuring out what role to add next and in what order, based on where your pipeline is stalling.',
        'good': 'You have a working cold calling operation and want to understand the right sequencing for the next role: lead manager, acquisitions, or disposition.',
        'also': 'Operators who have tried adding roles before and found the new hires created more management work than they solved. Role clarity before hiring fixes that.',
        'not_fit': 'Operators who have not closed their first deal yet. Get the core system working before designing a team structure around it.'
    }
}

pattern = re.compile(
    r'<span class="section-label"><span class="section-label-dot"></span> Best Fit</span>\s*'
    r'<h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0\.02em;">Who this service is for</h2>\s*'
    r'<p class="text-va-dark/80 text-lg leading-relaxed max-w-4xl">.*?</p>\s*'
    r'</div></section>',
    re.DOTALL
)

changed = 0
for slug, data in SERVICES.items():
    fpath = f'{base}/{slug}/index.html'
    if not os.path.exists(fpath):
        print(f'  Missing: {slug}')
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_block = (
        ' <span class="section-label"><span class="section-label-dot"></span> Best Fit</span>\n'
        '  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-3" style="letter-spacing:-0.02em;">Who gets the most from this</h2>\n'
        f'  <p class="text-va-dark/80 text-lg leading-relaxed max-w-4xl mb-8">{data["intro"]}</p>\n'
        '  <div class="grid gap-4 md:grid-cols-3">\n'
        '   <div class="bg-white rounded-xl border border-va-divider p-5">\n'
        '    <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-va-gold mb-2">Good fit</p>\n'
        f'    <p class="text-va-dark/80 text-sm leading-relaxed">{data["good"]}</p>\n'
        '   </div>\n'
        '   <div class="bg-white rounded-xl border border-va-divider p-5">\n'
        '    <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-va-gold mb-2">Also works for</p>\n'
        f'    <p class="text-va-dark/80 text-sm leading-relaxed">{data["also"]}</p>\n'
        '   </div>\n'
        '   <div class="bg-white rounded-xl border border-va-divider p-5">\n'
        '    <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-va-gold mb-2">Not the right fit</p>\n'
        f'    <p class="text-va-dark/80 text-sm leading-relaxed">{data["not_fit"]}</p>\n'
        '   </div>\n'
        '  </div>\n'
        ' </div></section>'
    )

    new_content = pattern.sub(new_block, content)
    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        changed += 1
        print(f'  Updated: {slug}')
    else:
        print(f'  No match: {slug}')

print(f'\nTotal: {changed}')
