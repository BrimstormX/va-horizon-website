import re, os

BASE = 'C:/Users/yousef/Desktop/Files/va-horizon-website/services'

def wcard(t, b):
    return f'<div class="why-card"><h3 class="font-montserrat font-black text-va-navy text-xl mb-3" style="letter-spacing:-0.02em;">{t}</h3><p class="text-va-dark/75 text-sm leading-relaxed">{b}</p></div>'

def faq_item(q, a, first=False):
    o = ' open' if first else ''
    return f'<div class="faq-item">\n <details{o}>\n <summary>{q}</summary>\n <div class="faq-body">{a}</div>\n </details>\n </div>'

def faq_json(q, a):
    return '    {\n     "@type": "Question",\n     "name": "' + q + '",\n     "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "' + a + '"\n     }\n    }'

CS_LINK = '<a href="/case-studies/" class="mt-6 inline-flex items-center gap-2 text-va-gold hover:text-white transition-colors font-bold text-sm">Read client case studies <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>'

SERVICES = {
'acquisition-manager': {
 'deliverables_heading': 'Everything the acquisitions seat covers',
 'deliverables_intro': "This isn't just a VA placement. It's a managed acquisitions role — vetting, CRM, handoff rules, and weekly performance management included from day one.",
 'workflow_heading': 'From intake to first offer conversation in 48 hours',
 'diff_heading': 'Why managed AM outperforms a freelance hire every time',
 'diff_cards': [
  ("You don't manage the AM", "Hiring a freelance AM puts performance management back on you — which is the exact problem you were trying to solve. VA Horizon owns that layer. We track response speed, note quality, follow-up discipline, and whether leads are advancing or stalling. You review deal progress, not the person working the pipeline."),
  ("The bottleneck gets diagnosed, not hidden", "When deal flow slows, most operators guess whether it's lead quality, AM behavior, or their own offer speed. The weekly review answers that with data. If the issue is on the list side, we say so. If it's AM performance, we address it. You get an honest report, not a polished summary that hides the problem."),
 ],
 'results_heading': 'Operators who add a managed AM typically stop losing warm leads to slow follow-up within the first two weeks.',
 'results_body': "That's not from a training program. It's from having a role that owns the gap between caller output and offer conversations. The AM doesn't add overhead — it removes the step that was blocking revenue.",
 'faq': [
  ("Who is this service best for?", "This works best for wholesalers generating 20-30+ qualified seller leads a month whose bottleneck has shifted to follow-up and offer conversations. If the owner is still handling every seller callback personally and deals are stalling because follow-up is slow, that's the signal to add an AM seat."),
  ("How fast can we get to the first offer conversation?", "Most clients are live within 48 hours of the intake call — assuming qualified leads are already in HighLevel or callers are actively producing them. The intake defines what the AM needs to start. Main delays are usually access to HighLevel, deal history context, or confirming the offer ruleset."),
  ("Does this include HighLevel?", "Yes. HighLevel is configured around the AM role before work starts — pipeline stages, handoff from callers, follow-up tasks, notes structure, and reporting. If you have an existing account, we work within your setup. You don't need to build anything yourself."),
  ("What's the difference between an AM and a cold caller?", "Cold callers create qualified leads from motivated seller lists. The AM takes those qualified leads and advances them toward an offer or signed agreement. They're separate roles in the pipeline. If you don't have consistent qualified lead flow — at least 20-30 per month — adding an AM before building callers produces diminishing returns."),
  ("How do I know the AM has real real estate experience?", "VA Horizon doesn't place cold callers doing AM work. Every acquisition manager must have at least 6 months of real estate AM experience and at least 2 verified closed deals before working a live seller. We verify deal history before placement, not just self-reported claims on a resume."),
  ("What happens if the AM underperforms or leaves?", "VA Horizon manages replacements within 5 business days at no additional cost. Because the role scope, CRM, and handoff rules are already documented, a new AM becomes productive much faster than a from-scratch hire would."),
 ],
},
'call-qa-management': {
 'deliverables_heading': 'Everything the QA management seat covers',
 'deliverables_intro': "QA is how you turn caller activity into improving output over time. Without a scoring system, you manage effort, not results. Here's what structured call QA actually includes.",
 'workflow_heading': 'From first call review to recurring performance cadence in 72 hours',
 'diff_heading': 'Why system-based QA outperforms personal call listening every time',
 'diff_cards': [
  ("You don't evaluate calls yourself", "Owner-reviewed QA creates a bottleneck: you can only listen to so many calls, and feedback comes too late to matter. VA Horizon reviews every flagged call on a weekly cycle, scores against a defined standard, and delivers actionable feedback to the caller — without requiring your time on every call."),
  ("Performance improves with system, not motivation", "Telling a caller to try harder doesn't improve lead quality. A calibrated scoring framework tells them exactly where conversations stall — opening, motivation probing, lead capture — and what to fix. That feedback loop separates a caller who improves from one who plateaus."),
 ],
 'results_heading': 'Teams with structured QA see consistent lead quality within 3-4 weeks versus months of guessing.',
 'results_body': "The difference isn't the caller — it's whether they know what a qualified lead actually sounds like and get consistent feedback against that standard. QA creates the feedback loop that makes the difference.",
 'faq': [
  ("Who is call QA management best for?", "Best for operations with at least one active cold caller who has been dialing for 2+ weeks. QA has the most impact during the first 30 days of a new caller's ramp — before bad habits form — and for existing callers whose output has plateaued without an obvious reason."),
  ("How many calls get reviewed each week?", "The review cadence is set during intake based on caller volume and dial shift length. Typically 10-20% of calls get scored weekly — enough to identify patterns without requiring a full audit. Calls that miss the lead standard are always flagged regardless of the sample rate."),
  ("Does this include HighLevel?", "Yes. Call notes, QA scores, and feedback are tracked in HighLevel so performance history is visible over time. The scoring framework is built into the CRM workflow, not kept in a separate spreadsheet."),
  ("What counts as failing QA?", "A call fails QA when the lead standard isn't met — the caller submitted a lead without confirmed motivation, missing property context, or no defined next step. The scoring rubric defines the pass/fail criteria before the first call is reviewed, so callers know exactly what's expected."),
  ("What happens when a caller consistently fails QA benchmarks?", "VA Horizon escalates before it becomes a wasted month. If a caller fails to meet the lead standard after corrective feedback, we flag it to the operator and, if necessary, manage a replacement. The goal is a productive seat, not managing around a problem indefinitely."),
  ("Does QA work for new callers or only experienced ones?", "Both. New callers need QA most in the first 30 days — before bad habits form. Experienced callers whose output has plateaued often have one or two consistent call patterns driving the problem. The calibration process is the same regardless of tenure."),
 ],
},
'disposition-manager': {
 'deliverables_heading': 'Everything the disposition seat covers',
 'deliverables_intro': "Disposition is a sales function, not an admin task. Here's what the managed dispo role actually includes — buyer development, deal packaging, outreach, and closing coordination.",
 'workflow_heading': 'From signed contract to buyer commitments within 72 hours',
 'diff_heading': 'Why managed dispo closes more deals than owner-handled disposition',
 'diff_cards': [
  ("Deal quality determines price. Dispo speed determines whether it closes.", "Most wholesalers with strong deal flow lose to slow dispo — buyers cool, timelines compress, and assignments fall through. A dedicated dispo manager moves at deal speed, not owner availability. You stay on acquisitions while dispo works the buyer side in parallel."),
  ("Buyer relationships compound over time", "A good dispo manager doesn't just blast deals — they track which buyers close, which ones flake, and which ones need a specific deal type to move. That buyer intelligence builds over months. It's why experienced dispo specialists outperform one-off blasts even on identical deal quality."),
 ],
 'results_heading': 'Operators who add a managed dispo seat typically reduce time-to-close by 30-50% within the first 60 days.',
 'results_body': "That's not from working harder on the buyer side — it's from having someone dedicated to that side of the deal while you stay on acquisitions. The pipeline produces more throughput when roles don't share a single person's attention.",
 'faq': [
  ("Who is disposition management best for?", "Best for operators who have signed deals but the owner is personally doing all buyer outreach, packaging, and closing coordination. If you're handling 2+ contracts a month and buyers are going cold between deal blast and close, the dispo role pays for itself on the first deal."),
  ("Do I need an existing buyer list before starting?", "No. VA Horizon builds the target buyer list from your market, deal type, and property profile. If you already have a buyer list, the dispo manager works with it and adds to it over time. List development is part of the role."),
  ("Does this include HighLevel?", "Yes. Buyer contacts, deal packages, follow-up sequences, and closing status are tracked in HighLevel so the entire dispo pipeline is visible. You see where each deal stands without asking the dispo manager for a status update."),
  ("What if buyers don't respond to the initial deal blast?", "A cold blast is the beginning, not the plan. The dispo manager runs a follow-up sequence — phone, email, and SMS — to warm buyers who expressed prior interest and to qualify new ones. The goal is a committed buyer before the closing window, not a one-shot message."),
  ("What's the difference between dispo and an acquisitions manager?", "An AM works the seller side — following up on qualified leads, negotiating, and moving sellers toward contract. A dispo manager works the buyer side — packaging the deal, building buyer relationships, and coordinating the closing. They're separate roles for opposite ends of the transaction."),
  ("Can I start dispo before I have a consistent deal flow?", "You need at least 1-2 deals per month before a dedicated dispo seat makes sense. Below that volume, the owner can handle dispo faster than onboarding a new role. The dispo seat scales best when deal flow is consistent enough that the buyer relationships being built can compound."),
 ],
},
'follow-up-automation': {
 'deliverables_heading': 'Everything the automation setup covers',
 'deliverables_intro': "Automation handles the follow-up volume that shouldn't require a human — no-answer sequences, re-engagement triggers, appointment reminders. Here's what a properly built automation system includes.",
 'workflow_heading': 'From pipeline audit to live sequences running within 48 hours',
 'diff_heading': 'Why automated sequences outperform manual follow-up at any volume',
 'diff_cards': [
  ("Automation removes work, not judgment", "The goal isn't to automate seller conversations — it's to automate everything that doesn't require human judgment so your team focuses on conversations that matter. No-answer sequences, appointment reminders, re-qualification triggers: these run automatically while your callers and AMs work live conversations."),
  ("The sequences are built for your pipeline, not a generic template", "Generic automation templates fail because they don't match your pipeline stages, your lead standard, or your follow-up cadence. VA Horizon builds sequences around your specific CRM structure, your seller profile, and the gaps where warm leads are going cold."),
 ],
 'results_heading': 'Clients with proper follow-up automation typically re-engage 15-25% more leads that manual follow-up would have missed.',
 'results_body': "Those leads were already in the pipeline — they just needed a trigger at the right time. Automation creates the follow-up consistency that human memory can't sustain at volume. The sequence runs whether or not anyone remembers.",
 'faq': [
  ("Who is follow-up automation best for?", "Best for operations generating seller conversations but losing warm leads between contact attempts because follow-up is inconsistent. If you can identify leads that went cold after a promising first call, automation is the right fix. If you don't have a CRM in place, build that first — automation without a pipeline creates a different kind of chaos."),
  ("Does this replace cold callers or lead managers?", "No. Automation handles the mechanical follow-up between human conversations — no-answer sequences, appointment reminders, re-qualification pings. It doesn't replace the judgment required for seller conversations. Proper automation makes callers and lead managers more effective by removing manual task overhead."),
  ("Does this include HighLevel?", "Yes. All sequences are built in HighLevel using your existing pipeline stages and lead structure. If you don't have HighLevel yet, that's a separate setup engagement that should happen before automation is built."),
  ("How long does it take to build the sequences?", "Most automation builds go live within 48 hours of the intake call. Complex builds with multiple branching sequences may take up to 5 business days. The intake maps every trigger, timing, and message before anything is built so there's no back-and-forth after launch."),
  ("What if I want to modify the sequences after launch?", "VA Horizon documents every sequence built — the trigger, timing, message content, and conditions. You can request modifications at any time and we'll update the sequences in HighLevel. You're not locked into the initial build."),
  ("Can automation work with sellers who already opted out?", "No. Opt-outs are permanent — TCPA requires that opted-out contacts are never contacted again via the opted-out channel. VA Horizon builds opt-out handling into every sequence so unsubscribes are automatically removed from future sends and excluded from re-enrollment."),
 ],
},
'highlevel-automation': {
 'deliverables_heading': 'Everything the HighLevel automation build covers',
 'deliverables_intro': "HighLevel automation is most valuable when it removes manual CRM work without removing judgment from seller conversations. Here's what a proper GHL automation build includes.",
 'workflow_heading': 'From GHL audit to live automations within 48 hours',
 'diff_heading': 'Why purpose-built automation outperforms imported snapshots every time',
 'diff_cards': [
  ("Automations are built around your pipeline, not a generic template", "Importing a generic GHL snapshot creates automation debt — triggers that don't match your stages, sequences that don't align with your lead standard, and workflows your team works around instead of with. VA Horizon maps your actual pipeline before building anything, so automations match how you work."),
  ("The bottleneck gets diagnosed before the automation is built", "Most HighLevel problems aren't automation problems — they're stage-definition problems or lead-standard problems that automation would make worse. Before building, VA Horizon identifies where manual work is happening, whether it's happening for a good reason, and whether automation is actually the right fix."),
 ],
 'results_heading': 'Clients typically cut manual CRM task time by 60-70% after a full HighLevel automation build.',
 'results_body': "That time doesn't disappear from the business — it transfers to seller conversations, offer preparation, and deals. The automation is the infrastructure that makes human time count.",
 'faq': [
  ("Who is HighLevel automation best for?", "Best for operations that already have HighLevel but are manually doing what should be automated: tagging leads, sending follow-up messages, updating stages, scheduling appointment reminders. Also works for operators building a new HighLevel account who want automations built correctly from the start."),
  ("Do I need to already have HighLevel?", "Yes. This service builds automations within an existing HighLevel account — it is not a CRM setup service. If you don't have HighLevel yet or need a full pipeline built from scratch, that's the HighLevel CRM Setup service. These are two separate engagements."),
  ("What if I already have automations in my GHL account?", "VA Horizon reviews existing automations before building new ones. If what's there is working, we don't replace it. If it's conflicting, creating loops, or missing key triggers, we document what needs to change and why before making modifications."),
  ("Can automations handle seller conversations?", "No. HighLevel automation handles workflow logic — triggers, stage movement, follow-up sequences, appointment reminders. It doesn't replace the judgment required for seller conversations. Automations keep the pipeline moving between human touchpoints; they don't replace the human touchpoints."),
  ("How complex can the automations get?", "VA Horizon has built multi-branch workflows with conditional logic, time-delay sequences, tag-based enrollment, and cross-pipeline triggers. Complexity is scoped during the intake call. Simple automation builds (5-10 workflows) are typically live within 48 hours. Complex builds may take up to one week."),
  ("Is this a one-time build or ongoing?", "Typically a one-time build scoped to your current pipeline. As your operation grows and you add roles or list types, the automations may need to be extended. VA Horizon offers follow-on builds for new sequences or pipeline changes at a separate scope."),
 ],
},
'highlevel-crm-setup': {
 'deliverables_heading': 'Everything the CRM build covers',
 'deliverables_intro': "A blank HighLevel account produces nothing useful. The pipeline, custom fields, automations, and reporting have to be built for how a wholesaling operation works. Here's what's in scope.",
 'workflow_heading': 'From intake to a working pipeline in 48 hours',
 'diff_heading': 'Why a purpose-built CRM outperforms a generic snapshot every time',
 'diff_cards': [
  ("CRM setup determines whether caller output turns into revenue", "If leads land in a disorganized pipeline with no stage logic, no follow-up automations, and no owner visibility, caller performance doesn't matter — the work disappears. A properly built CRM is what makes the front-end investment in callers, lists, and dialers show up as actual deal flow."),
  ("Built for wholesaling, not adapted from a business template", "Generic CRM imports create technical debt — stages that don't match your operation, automations that fire at wrong times, and custom fields your team doesn't use. VA Horizon builds the pipeline around your seller funnel, lead standard, and team structure from day one."),
 ],
 'results_heading': 'Teams with a properly configured HighLevel CRM close 2-3x more from the same lead volume compared to teams with unused or disorganized pipelines.',
 'results_body': "The leads are the same. The difference is whether there's a system keeping warm sellers warm, tracking follow-up, and giving the owner visibility into where deals stall. That's what a properly built CRM actually delivers.",
 'faq': [
  ("Who is HighLevel CRM setup best for?", "Best for operators starting outbound who need a working CRM before the first VA dials, and for operators who have HighLevel already but it's unused, messy, or built for a different business model. If callers are producing conversations but there's no clean place for them to land and be tracked, this is the right first step."),
  ("Can we migrate from a different CRM or spreadsheet?", "Yes. If you have active leads or deals in another system, VA Horizon can coordinate a migration into HighLevel before going live. We map the data structure, import records, and verify stage assignments. Migrations require an additional scoping call to estimate the work involved."),
  ("Do I need an existing HighLevel account?", "No. VA Horizon can provision a new HighLevel account and build it from scratch. If you already have one — even with prior data or partial automations — we can work within your existing account. You don't need to start fresh unless the existing setup is too disorganized to build on."),
  ("Does this include follow-up automations?", "Yes. The CRM build includes automated SMS follow-up sequences attached to key pipeline stages — no-answer, warm lead re-engagement, appointment reminders. The automations are built for wholesaling workflows, not adapted from generic templates."),
  ("How long does the build take?", "Most CRM setups are live within 48 hours of the intake call. Complex builds with custom integrations, advanced automations, or multi-market pipelines may take up to one week. The intake call maps every requirement before work starts so there are no delays after build begins."),
  ("What ongoing support is included?", "The initial build is a fixed-scope engagement. If you add new roles, list types, or markets that require pipeline changes, VA Horizon can scope a follow-on build. Questions about how to use the system after launch are handled within the first 30 days at no additional cost."),
 ],
},
'lead-manager': {
 'deliverables_heading': 'Everything the lead manager seat covers',
 'deliverables_intro': "The lead manager sits between callers and acquisitions. It prevents warm leads from going cold, keeps pipeline hygiene tight, and creates the triage layer your AM needs to work effectively.",
 'workflow_heading': 'From qualified leads to warm handoffs within 24 hours of arrival',
 'diff_heading': 'Why a dedicated triage role outperforms owner-managed lead review',
 'diff_cards': [
  ("Warm leads stop going cold between roles", "The most common pipeline failure isn't bad callers or bad lists — it's the gap between a lead arriving qualified and someone following up fast enough to keep the seller warm. A lead manager owns that gap. They review leads on arrival, re-qualify context, and prepare the warm handoff before the seller forgets they called."),
  ("Your AM focuses on offer conversations, not re-qualification", "When an AM re-qualifies leads themselves because no triage layer exists, they spend acquisition time on pipeline maintenance. The lead manager keeps that work separate — so the AM's time is spent exclusively on conversations that move toward an offer or signed agreement."),
 ],
 'results_heading': 'Operations that add a lead manager typically see 20-30% more qualified leads advance to offer conversations.',
 'results_body': "Those leads were already in the pipeline. The lead manager creates the triage structure that prevents them from aging out before the AM can get to them. It's not more leads — it's better utilization of the leads you already have.",
 'faq': [
  ("Who is the lead manager seat best for?", "Best for operations with 40-50+ qualified leads per month where the AM or owner can't keep up with callback timing. If warm sellers are going cold between first contact and offer conversation, and the bottleneck is triage speed rather than lead volume, a lead manager is the right next role."),
  ("When do I need a lead manager versus just more callers?", "If your AM or owner is spending time re-qualifying leads already marked qualified by callers, you need a lead manager before more callers. More callers adds volume. A lead manager adds capacity to process volume. Adding callers without the triage layer creates pipeline chaos."),
  ("Does this include HighLevel?", "Yes. Lead manager workflows — triage queues, callback scheduling, re-qualification tasks, handoff notes — are all built in HighLevel. The role works out of a structured pipeline view, not a spreadsheet or memory."),
  ("How is a lead manager different from an acquisitions manager?", "A lead manager keeps warm leads warm and prepares handoffs. An AM advances leads toward an offer and signed agreement. The lead manager is the triage function; the AM is the closing function. At lower volumes, one role can cover both. At higher volumes, they need to be separate."),
  ("How many leads does the lead manager role need to justify itself?", "The typical threshold is 40-50 qualified leads per month — the volume where one person can't manage triage and acquisition simultaneously. Below that, a well-configured HighLevel pipeline and automated follow-up sequences can usually bridge the gap without a dedicated triage role."),
  ("What happens if the lead manager underperforms or leaves?", "VA Horizon manages replacements within 5 business days at no additional cost. Because the role scope, triage criteria, and handoff rules are documented in HighLevel, a replacement can ramp quickly without starting from scratch."),
 ],
},
'list-sourcing': {
 'deliverables_heading': 'Everything the list sourcing service covers',
 'deliverables_intro': "A cold caller without a properly targeted list is a dialer with nowhere productive to go. List quality determines caller output more than any other single variable. Here's what's in scope.",
 'workflow_heading': 'From market intake to skip-traced lists ready to dial within 72 hours',
 'diff_heading': 'Why targeted list strategy outperforms broad data exports every time',
 'diff_cards': [
  ("List quality determines caller output more than caller skill", "The most common explanation for poor cold calling results is that the callers aren't good enough. The actual problem, most of the time, is bad lists — wrong records, wrong market, wrong list type, or records called so many times the sellers are already DNC. VA Horizon sources lists around your target seller profile, not around what's easiest to pull."),
  ("The bottleneck shifts once the list is right", "When callers move from 50 live conversations a day to 150+ — and those conversations are with the right sellers — qualified lead rate improves regardless of caller skill. Good lists make average callers look good. Bad lists make great callers look bad."),
 ],
 'results_heading': 'Teams that switch from broad exports to targeted, skip-traced lists typically see 2-3x improvement in qualified lead rate per calling hour.',
 'results_body': "The dial volume is the same. The difference is who's answering — motivated sellers with the right profile versus random homeowners with no disposition motivation. List targeting is the highest-leverage change most wholesaling operations can make.",
 'faq': [
  ("Who is list sourcing best for?", "Best for operators starting outbound who don't know which list types to prioritize for their market, and for operators currently calling whatever comes out of a broad county export without targeting strategy. If your callers are working hard but qualified leads are inconsistent, list quality is usually the bottleneck."),
  ("Which list types work best for real estate wholesaling?", "It depends on your market and target seller profile. High-equity absentee owners, pre-foreclosure, tax delinquents, and probate are typically the highest-converting list types for motivated sellers. VA Horizon maps the right list priority for your specific market before ordering — not a one-size-fits-all pull."),
  ("Does this include skip tracing?", "Yes. Every list is coordinated through preferred skip trace vendors with verified match rates for real estate motivated seller data. You receive a skip-traced, phone-appended file ready for the dialer — not raw county data that still needs phone numbers appended."),
  ("How often do lists need to be refreshed?", "Most list types go stale within 30-60 days of heavy dialing — records get added to DNC, sellers transact, or the data ages out. VA Horizon builds a re-pull schedule into the list sourcing plan so you're always calling fresh records rather than recycling a fully worked list."),
  ("How do you know which lists to prioritize for my market?", "The intake call maps your market, target seller profile, deal type, and current outbound results. Based on that, VA Horizon recommends list types by priority — not a generic recommendation but a market-specific sequence built around your exit strategy and ARV ranges."),
  ("What if I already have lists from BatchLeads or PropStream?", "VA Horizon can work with existing lists from any source. If they still need skip tracing and DNC scrubbing, that can be coordinated through preferred vendors. If they're already skip-traced, the review checks match rate quality and confirms the records are still fresh enough to call."),
 ],
},
'readymode-dialer-setup': {
 'deliverables_heading': 'Everything the Readymode setup covers',
 'deliverables_intro': "A predictive dialer is only as useful as its configuration. Readymode dialing on a misconfigured account produces compliance risk and poor contact rates. Here's what a proper setup actually includes.",
 'workflow_heading': 'From account provisioning to first live dial session within 48 hours',
 'diff_heading': 'Why properly configured predictive dialing outperforms manual every time',
 'diff_cards': [
  ("Predictive dialing produces 5-10x more live conversations per shift", "On manual dialing, a caller produces 50-80 attempts and 15-20 live conversations per shift. On a properly configured Readymode predictive dialer, the same caller reaches 800-1,000 attempts and 150-200 live conversations. That's not a marginal improvement — it's the difference between a trickle of leads and consistent weekly volume."),
  ("Compliance and call settings prevent account suspension before it happens", "A misconfigured dialer — wrong calling hours, missing DNC scrubbing, incorrect abandonment rate settings — creates compliance exposure that gets numbers flagged or the account suspended. VA Horizon configures every technical setting to current TCPA standards before a single call goes out."),
 ],
 'results_heading': 'A properly configured Readymode dialer produces 800-1,000 call attempts per 8-hour shift versus 100-150 on manual dialing.',
 'results_body': "That's not a projection — it's what happens when predictive dialing is configured correctly with properly skip-traced lists and compliance settings in place. The dialer is the infrastructure that makes the caller's time count.",
 'faq': [
  ("Who is Readymode dialer setup best for?", "Best for operators launching their first cold calling VA who need the dialer configured before day one, and for operations with an existing Readymode account that was set up incorrectly or needs to be rebuilt for a new market or caller. Anyone dialing manually who wants to scale to predictive dialing is a fit."),
  ("Does this include the Readymode subscription cost?", "No. The Readymode subscription is billed directly through Readymode. VA Horizon handles account setup, configuration, list upload structure, compliance settings, and VA training — the subscription cost is separate. For cold calling VAs in the full service package, the dialer is included as a bundled cost."),
  ("Can we use an existing Readymode account?", "Yes. VA Horizon audits existing account settings before making changes, documents every configuration adjustment, and confirms the account is properly configured for the current market and caller. Existing account setups may require a brief audit call before work begins."),
  ("How long does setup take?", "Most Readymode configurations are complete within 24-48 hours of intake. CRM integration with HighLevel is configured in the same window. The VA is trained on the dialer interface before making a live call so the first dial session starts productively."),
  ("What compliance settings are configured?", "VA Horizon configures calling hours by state, abandonment rate settings per TCPA requirements, DNC list integration, call recording disclosure where required, and caller ID management. The compliance configuration is documented and handed off to the operator so it can be audited or reviewed at any time."),
  ("What if we need to add more VAs to the same account?", "Readymode supports multiple agent seats on the same account. VA Horizon can configure additional agent logins, call queues, and reporting views for new callers within the same account structure. Scope depends on how many callers are being added and whether campaign settings need to be duplicated."),
 ],
},
'skip-tracing-coordination': {
 'deliverables_heading': 'Everything the skip tracing coordination covers',
 'deliverables_intro': "Skip trace quality varies more than most operators realize — match rates, data freshness, and DNC scrubbing differ significantly by vendor. Here's what proper skip tracing coordination includes.",
 'workflow_heading': 'From raw list to skip-traced, DNC-scrubbed records ready to dial within 48 hours',
 'diff_heading': 'Why coordinated skip tracing outperforms direct vendor ordering',
 'diff_cards': [
  ("Match rate directly affects how many live calls get made", "A list with a 40% phone match rate produces half the dial volume of a list with an 80% match rate — on the same number of records. Most operators don't track match rates. VA Horizon reviews every batch before it goes to the dialer and escalates batches with poor match rates rather than dialing bad data."),
  ("Vendor selection affects data quality, not just price", "Not all skip trace vendors are equal in accuracy, freshness, or match methodology. VA Horizon uses preferred vendors with proven match rates for real estate motivated seller data — not the cheapest option or the first result. The cost difference between a bad skip trace and a good one is typically recovered in the first week of dialing."),
 ],
 'results_heading': 'Properly skip-traced lists produce 40-60% higher contact rates compared to caller records with unverified or stale phone data.',
 'results_body': "The caller's time is fixed. Better data means more of that time reaches live conversations with motivated sellers rather than dead numbers, voicemails, and disconnected lines. Skip tracing is the lowest-cost, highest-return quality improvement most operations can make.",
 'faq': [
  ("Who is skip tracing coordination best for?", "Best for operators who source their own lists from BatchLeads, PropStream, county records, or other sources and need a reliable skip tracing workflow before the records go to the dialer. Also works for operations that have been ordering skip tracing directly but getting poor match rates or inconsistent delivery timelines."),
  ("Which skip trace vendors does VA Horizon use?", "VA Horizon uses a rotation of preferred vendors selected for match rate accuracy on real estate motivated seller data. We don't publicly list vendor names as the mix adjusts based on batch size, list type, and data freshness. What we commit to is reviewing match rates on every batch before delivery."),
  ("What counts as an acceptable match rate?", "For motivated seller lists, acceptable match rates are typically 65-80%+ for phone number appends. Batches below 50% are flagged and either re-run with a different vendor or returned with documentation of the issue. Match rate varies by list type — probate and tax delinquent lists typically produce lower rates than absentee owner lists."),
  ("Does this include DNC scrubbing?", "Yes. Every batch is scrubbed against the National DNC Registry before delivery. State-specific DNC lists are also checked for markets that require it. The scrubbed file delivered to the dialer is compliant at the time of delivery — ongoing compliance for re-use is the operator's responsibility."),
  ("Can skip tracing be combined with list sourcing?", "Yes, and that's the more common setup. VA Horizon sources the list and coordinates skip tracing as a single workflow — you provide the market and seller profile, receive a skip-traced, DNC-scrubbed file ready for the dialer. The two services are often scoped together for clients starting a new outbound operation."),
  ("How long does skip tracing take?", "Most batches are returned within 24-48 hours of submission. Large batches (10,000+ records) or complex list types may take up to 72 hours depending on vendor queue. Rush processing is available for an additional fee when timelines require it."),
 ],
},
'sms-blast-campaigns': {
 'deliverables_heading': 'Everything the SMS campaign setup covers',
 'deliverables_intro': "SMS outreach isn't just sending messages — it's compliance registration, list segmentation, message strategy, and response handling. Here's what a properly run SMS campaign actually includes.",
 'workflow_heading': 'From A2P registration to first campaign send within 5-7 business days',
 'diff_heading': 'Why compliant targeted SMS outperforms mass blast campaigns every time',
 'diff_cards': [
  ("Compliance registration prevents account shutdown before it starts", "Unregistered SMS campaigns get numbers flagged within days on motivated seller lists. A2P 10DLC registration takes 5-7 business days and is a non-negotiable step before any campaign goes live. VA Horizon handles the registration process, content registration, and carrier approval — so you're not building a campaign on a number that's already in the carrier's fraud queue."),
  ("Response quality depends on message quality, not volume", "Mass blasting without message strategy produces spam flags, opt-outs, and carrier throttling. VA Horizon builds message sequences with compliant language, appropriate sending windows, and response-handling protocols. The goal is qualified seller responses — not maximum send volume."),
 ],
 'results_heading': 'Properly registered and segmented SMS campaigns typically achieve 5-15% response rates on motivated seller lists.',
 'results_body': "That's the range for compliant campaigns with targeted lists and tested messaging. Unregistered or mass-blast campaigns see much lower rates before the account gets flagged. The setup work is what separates a campaign that produces leads from one that produces carrier complaints.",
 'faq': [
  ("Who is SMS blast campaigns best for?", "Best for operators who want a second outbound channel alongside cold calling, and for those targeting motivated sellers in markets where phone answer rates are declining. SMS works best when the list is already segmented by motivation type and the response-handling workflow is in place before the first send."),
  ("How long does A2P 10DLC registration take?", "A2P 10DLC registration typically takes 5-7 business days for carrier approval after submission. This is a mandatory pre-step before any campaign sends. VA Horizon handles brand registration, campaign registration, and content approval — but the timeline is controlled by the carriers, not by VA Horizon."),
  ("Does this include HighLevel?", "Yes. Message sequences, response tracking, opt-out handling, and campaign performance reporting are all built in HighLevel. Responses from motivated sellers land directly in the pipeline for follow-up by callers or lead managers."),
  ("What if I get opt-outs or carrier complaints?", "Opt-outs are processed immediately — TCPA requires unsubscribes to be honored on the first request. VA Horizon builds opt-out handling into the CRM workflow so unsubscribes are automatically excluded from future sends. Carrier complaints are monitored through send metrics; if deliverability drops, VA Horizon adjusts message content or sending cadence."),
  ("Can VAs handle inbound SMS responses?", "Yes. VA Horizon can configure a lead manager or caller to handle inbound SMS responses as part of the same engagement. Responses are routed to a HighLevel inbox, and the VA follows a response script to re-qualify the seller and schedule next steps. Response handling can be scoped as part of the campaign setup."),
  ("How many messages can I send per day?", "Sending limits depend on your A2P registration tier and the number of registered numbers. Standard 10DLC registration typically allows 2,000-4,000 messages per day per registered number. Volume above that requires additional registration or a different sending infrastructure, which VA Horizon can scope separately."),
 ],
},
'wholesale-team-scaling': {
 'deliverables_heading': 'Everything the team scaling engagement covers',
 'deliverables_intro': "Adding roles in the wrong order wastes money and creates management overhead. Here's what a structured team scaling engagement actually includes — from operations audit to the next role launched.",
 'workflow_heading': 'From operations audit to next role launched within two weeks',
 'diff_heading': 'Why sequenced hiring outperforms reactive headcount additions',
 'diff_cards': [
  ("Scaling without sequence creates chaos faster than headcount helps", "Adding roles before the pipeline is ready — CRM not built, no lead manager, acquisition bottleneck undiagnosed — means the new hire either has nothing to work or breaks what was already barely working. VA Horizon maps the operation before recommending the next role so the hire lands in a system that can absorb it."),
  ("The right next role depends on where the bottleneck actually is", "Most operators think they need more callers when the real bottleneck is no lead manager. Or they add an AM when the problem is caller output. VA Horizon identifies where the actual constraint sits before scoping the next hire. Adding the right role in the right order is what creates compounding deal flow — not just adding headcount."),
 ],
 'results_heading': 'Operations that follow a structured hiring sequence close 3-5x more deals per team member than operations that add roles reactively.',
 'results_body': "The difference isn't the talent — it's whether the system each role works in is set up to use them. Sequenced scaling creates compounding leverage. Reactive headcount just adds costs.",
 'faq': [
  ("Who is wholesale team scaling best for?", "Best for operators who are closing 2-4+ deals a month and want to grow without the owner being the bottleneck on every step. If you're doing everything yourself — calling, follow-up, offers, dispo — and deals are slipping because you can't keep up, that's the signal that a structured scale plan is worth mapping."),
  ("How do I know which role to add next?", "VA Horizon maps the bottleneck in your current operation before recommending a hire. The diagnostic looks at where qualified lead volume is being lost — whether it's top-of-funnel, triage, acquisition, or dispo. The next role is always the one that removes the actual constraint, not the one that sounds most impressive."),
  ("Does this include HighLevel?", "Yes. Every role added through the scaling engagement is set up with a defined HighLevel workflow — stages, handoff rules, follow-up tasks, and reporting visibility. The CRM is the connective tissue that makes the roles work together. You don't add a role and hope the system absorbs it."),
  ("Can I scale multiple roles at the same time?", "It depends on your management capacity. Adding more than one role at once requires either an existing management layer or the owner's active involvement in both onboardings simultaneously. VA Horizon typically recommends one role at a time until the operation has enough pipeline hygiene to absorb multiple new VAs without existing seats degrading."),
  ("What does 'scaling' actually cost?", "Each role added through the scaling engagement is priced at the rate for that specific service — cold calling VA, lead manager, AM, dispo manager, etc. The scaling engagement itself is a planning and sequencing layer that ensures you're adding the right role at the right time, not a separate ongoing subscription."),
  ("What if I add the wrong role and it doesn't work out?", "VA Horizon doesn't recommend a role until the operation is ready to absorb it. If a role is added and the output isn't there within the first 30 days, the weekly management review identifies whether the issue is the role setup, list quality, pipeline structure, or owner-side factors — and addresses the bottleneck directly rather than replacing the hire as the first move."),
 ],
},
}

def build_management_layer(data):
    cards = '\n   '.join(wcard(t, b) for t, b in data['diff_cards'])
    return f''' <section class="py-20 bg-va-warm"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> What Makes This Different</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">{data['diff_heading']}</h2>
  <div class="grid gap-6 lg:grid-cols-2">
   {cards}
  </div>
 </div></section>'''

def build_results_section(data):
    return f''' <section class="py-20 bg-va-smoke border-y border-va-divider"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
  <div class="proof-card"><div class="proof-inner">
   <span class="section-label dark-label"><span class="section-label-dot"></span> Real Results</span>
   <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-5" style="letter-spacing:-0.02em;">{data['results_heading']}</h2>
   <p class="text-gray-300 text-lg leading-relaxed max-w-3xl">{data['results_body']}</p>
   {CS_LINK}
  </div></div>
 </div></section>'''

def build_faq_html(faq_items):
    items = [faq_item(q, a, first=(i == 0)) for i, (q, a) in enumerate(faq_items)]
    return '<div class="border border-va-divider rounded-xl overflow-hidden">' + ''.join(items) + '</div>'

def build_faq_json(faq_items):
    entries = [faq_json(q, a) for q, a in faq_items]
    return '"@type": "FAQPage",\n   "mainEntity": [\n' + ',\n'.join(entries) + '\n   ]'

def update_service(slug, data):
    path = os.path.join(BASE, slug, 'index.html')
    with open(path, encoding='utf-8') as f:
        content = f.read()

    # 1. Section label renames
    content = content.replace('> Deliverables</span>', "> What's Included</span>")
    content = content.replace('> Workflow</span>', '> How It Works</span>')
    content = content.replace('> Management Layer</span>', '> What Makes This Different</span>')
    content = content.replace('> Operating Standard</span>', '> Real Results</span>')

    # 2. Deliverables heading: change mb-10 to mb-3 and add intro paragraph
    old_del_h2 = '>What VA Horizon handles</h2>'
    new_del_h2 = f'>{data["deliverables_heading"]}</h2>\n  <p class="text-va-dark/70 text-base leading-relaxed max-w-3xl mb-10">{data["deliverables_intro"]}</p>'
    content = content.replace(
        'class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;"' + old_del_h2,
        'class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-3" style="letter-spacing:-0.02em;"' + new_del_h2
    )

    # 3. Workflow heading
    old_wf = '>How the service plugs into your operation</h2>'
    # highlevel-automation has a different heading
    alt_wf = '>The point is managed output</h2>'
    new_wf = f'>{data["workflow_heading"]}</h2>'
    if old_wf in content:
        content = content.replace(old_wf, new_wf)
    elif alt_wf in content:
        content = content.replace(alt_wf, new_wf)

    # 4. Replace entire Management Layer section (unique bg-va-warm class)
    new_ml = build_management_layer(data)
    content = re.sub(
        r' <section class="py-20 bg-va-warm">.*?</section>',
        new_ml,
        content,
        flags=re.DOTALL
    )

    # 5. Replace Operating Standard proof-card content
    new_results = build_results_section(data)
    # The Operating Standard section is the one containing proof-card
    content = re.sub(
        r' <section class="py-20 bg-va-smoke border-y border-va-divider"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">\s*<div class="proof-card">.*?</section>',
        new_results,
        content,
        flags=re.DOTALL
    )

    # 6. Replace FAQ accordion HTML
    new_faq_html = build_faq_html(data['faq'])
    content = re.sub(
        r'<div class="border border-va-divider rounded-xl overflow-hidden">.*?</div>\s*</div></section>',
        new_faq_html + '\n </div></section>',
        content,
        flags=re.DOTALL,
        count=1  # only the FAQ accordion
    )

    # 7. Update JSON-LD FAQPage schema
    new_faq_json = build_faq_json(data['faq'])
    content = re.sub(
        r'"@type": "FAQPage",\s*"mainEntity": \[.*?\]',
        new_faq_json,
        content,
        flags=re.DOTALL
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated: {slug}')

for slug, data in SERVICES.items():
    update_service(slug, data)

print('All 12 service pages updated.')
