import re, os

BASE = 'C:/Users/yousef/Desktop/Files/va-horizon-website/solutions'

CS_LINK = '<a href="/case-studies/" class="mt-6 inline-flex items-center gap-2 text-va-gold hover:text-white transition-colors font-bold text-sm">Read client case studies <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>'

def wcard(title, body):
    return f'''    <div class="why-card">
     <h3 class="font-montserrat font-black text-va-navy text-xl mb-3" style="letter-spacing:-0.02em;">{title}</h3>
     <p class="text-va-dark/75 text-sm leading-relaxed">{body}</p>
    </div>'''

# Per-audience workflow fit cards and proof point improvements
SOLUTIONS = {
 'real-estate-wholesalers': {
  'wf1': ("Outbound volume that doesn't depend on the owner",
          "When the owner is still making calls, the business can't scale. Callers produce 30+ qualified seller leads a month on Readymode — 800-1,000 attempts per shift — so outreach continues even when you're comping, negotiating, or closing deals."),
  'wf2': ("Lead-to-offer handoff that doesn't leak",
          "Every qualified lead lands in HighLevel with motivation, property condition, timeline, price expectation, and the next action. You start a conversation already in progress — not a name and a callback request you have to re-qualify from scratch."),
  'proof_p': "The wholesaler playbook is the core VA Horizon offer: managed callers, Readymode access, HighLevel setup, list coordination, weekly QA, and a minimum 30 qualified leads per month per cold calling engagement. Operators using the full system typically scale from 1-2 deals per month to 3-6 within the first 90 days.",
 },
 'brrrr-investors': {
  'wf1': ("Acquisition outreach while renovations run",
          "When an active rehab is consuming the operator's attention, seller outreach stops. VA Horizon keeps the front end active independently — callers work motivated seller lists, qualified leads land in HighLevel, and the acquisition pipeline stays warm regardless of what's happening on the project side."),
  'wf2': ("BRRRR-specific qualification at handoff",
          "For BRRRR investors, motivation alone isn't enough. Callers capture condition scope, occupancy, rent potential, area, seller timeline, and equity signal before the lead is submitted — so the operator can make a fast buy-decision without re-interviewing the seller."),
  'proof_p': "The BRRRR workflow keeps the front end active while the operator focuses on rehab execution, lender conversations, and refinance milestones. Operators using VA Horizon typically reduce the time between active renovations and the next acquisition conversation from months to weeks.",
 },
 'buy-and-hold-landlords': {
  'wf1': ("Long-cycle seller tracking across months",
          "Buy-and-hold sellers rarely move on first contact — they need time, a trigger event, or a change in their situation. A lead manager tracks where each seller is in their timeline, schedules callbacks at the right intervals, and keeps warm contacts from going cold over weeks and months."),
  'wf2': ("Rental-relevant context at handoff",
          "Property condition, tenant status, current rent rate, owner motivation, and timeline are captured at qualification — so when the operator reviews the lead, the rental underwriting can start immediately without another discovery call with the seller."),
  'proof_p': "The buy-and-hold model rewards operators who stay in consistent contact with motivated sellers over time. VA Horizon structures the caller workflow and follow-up sequences around long sales cycles — so landlord acquisition conversations continue in the background while the operator manages the existing portfolio.",
 },
 'creative-finance-investors': {
  'wf1': ("Seller conversations filtered for structure fit",
          "Creative finance deals require a seller who has equity, flexibility on terms, and a reason to consider something other than a cash sale. Callers screen for these signals at qualification — so the operator doesn't spend time on sellers whose situation can't accommodate a subject-to, seller finance, or lease-option structure."),
  'wf2': ("Structure handoff goes to the operator, not the caller",
          "VA Horizon keeps the calling role intentionally narrow: qualify motivation, capture facts, submit leads. Creative deal structure, legal review, and offer design stay with the operator. That boundary protects the operator from caller overreach and ensures nothing is implied to a seller that the operator hasn't approved."),
  'proof_p': "The VA Horizon model keeps callers focused on qualification and fact capture. Strategy, contracts, and legal review remain with the operator. Creative finance investors using the system typically build a pipeline of 15-25 structure-qualified leads per month within the first 60 days.",
 },
 'fix-and-flippers': {
  'wf1': ("Pre-retail acquisition conversations at scale",
          "Fix-and-flip math depends on buying at the right basis. Callers reach motivated sellers before the property goes to retail market — working distressed, high-equity absentee, and tax delinquent lists — and capture condition and equity signals before the operator spends time on comps and underwriting."),
  'wf2': ("Rehab-relevant details captured at qualification",
          "ARV estimate range, property condition, seller timeline, motivation, and price expectation are captured at the caller stage — so when the operator reviews the lead, the preliminary comp work can start immediately without a second discovery call to fill in what was missing."),
  'proof_p': "The system is not just call volume. It is a way to collect the facts a flipper needs before spending time on comps, contractor walkthroughs, and offer prep. Operators using VA Horizon typically identify 2-3x more off-market acquisition opportunities per month compared to manual outreach or broker-only sourcing.",
 },
 'land-investors': {
  'wf1': ("Parcel-specific qualification, not just motivation",
          "Land buying requires more context than a residential caller typically captures. VA Horizon trains callers on parcel-relevant qualification: size, zoning, road access, utilities, neighboring use, ownership duration, and seller timeline — not just motivation and a callback date."),
  'wf2': ("Multi-county calling managed from a single pipeline",
          "Land investors typically work across multiple counties and states. VA Horizon manages the compliance layer — calling hours by state, DNC scrubbing, carrier registration — so operators can expand their target geography without adding a new management overhead for each county."),
  'proof_p': "For land investors, the value is not just more calls. It is a steady stream of owner conversations with enough context to evaluate whether a parcel is worth pursuing before the operator spends time on due diligence. Operators using the system typically qualify 20-40 parcel opportunities per month per caller seat.",
 },
 'multifamily-investors': {
  'wf1': ("Owner conversations before the broker relationship starts",
          "Most small multifamily deals that reach brokers are already priced for retail. Direct-to-owner calling reaches motivated owners before they list — giving operators the chance to negotiate direct, at their basis, without competing with broker-represented buyers."),
  'wf2': ("Unit count and occupancy captured at qualification",
          "For multifamily underwriting, callers collect unit count, occupancy, gross rents, condition, seller motivation, and timeline before the lead is submitted — so the operator can start preliminary underwriting immediately without scheduling a second discovery call."),
  'proof_p': "More direct-to-owner multifamily conversations means more context before underwriting begins. Operators using VA Horizon's multifamily caller workflow typically build a qualified pipeline of 10-20 small multifamily opportunities per month — properties that never surface on broker lists or LoopNet.",
 },
 'new-real-estate-investors': {
  'wf1': ("Built-in management so new operators don't manage cold",
          "New investors typically have no experience managing a VA — and discovering that the caller isn't producing two months in is an expensive lesson. VA Horizon owns the QA, performance tracking, and weekly reporting so the operator gets output, not a management project."),
  'wf2': ("Start with one role, add as volume grows",
          "The system is designed to start with a single caller and scale to a lead manager or acquisitions manager as deal volume grows — not to overhire before the pipeline can absorb the cost. The first 90 days are structured around getting the first deals closed, not building an org chart."),
  'proof_p': "A launch path that does not require building everything before anything works. New investors using VA Horizon typically have their first qualified leads within 72 hours of the intake call — a faster start than building and training an in-house caller from scratch.",
 },
 'novation-investors': {
  'wf1': ("Qualification filtered for structure fit, not just motivation",
          "Novation deals require a seller with enough equity, a property that can be listed, and a willingness to accept deferred proceeds. Callers screen for these signals at qualification — so the operator enters the conversation knowing the deal structure is viable, not just that the seller is motivated."),
  'wf2': ("Handoff prepared for the listing conversation",
          "When a seller qualifies for a novation, the handoff includes condition, equity range, seller timeline, and what was explained about the process — so the operator can continue the conversation cleanly without re-covering ground the caller already covered."),
  'proof_p': "Structured handoffs for complex offers. Operators running novation strategies with VA Horizon typically build a pipeline of 10-20 structure-qualified leads per month — sellers with the equity, property condition, and flexibility that novation deals require.",
 },
 'property-management-companies': {
  'wf1': ("Investor acquisition separated from PM operations",
          "Property management teams are fully occupied with maintenance, tenant calls, and owner reporting. VA Horizon runs the investor acquisition outreach from a separate pipeline — so acquisition conversations don't compete for the same staff attention as daily PM operations."),
  'wf2': ("Owner conversations happening while PM operations run",
          "The acquisition front end and property management operations work from separate HighLevel pipelines. Callers work investor acquisition lists; PM staff handles tenants and owners. Neither side creates overhead for the other — and the operator sees both pipelines in one dashboard."),
  'proof_p': "Keeps proactive investor acquisition work moving while PM operations handle the day-to-day. Property management companies using VA Horizon typically add 2-4 new investor acquisition conversations per week without adding to their existing staff's workload.",
 },
 'real-estate-agents-and-teams': {
  'wf1': ("Outreach that stays on the right side of licensing rules",
          "Callers work expired, FSBO, and investor lists — creating conversations, not contracts. Licensed activity stays with the agent: pricing, representation, disclosure, and offers. The VA creates opportunities; the agent converts them within their licensed scope."),
  'wf2': ("Team lead generation without compliance overhead",
          "VA Horizon manages the calling workflow within state-specific cold calling rules — calling hours, DNC scrubbing, carrier registration. The agent stays focused on licensed activity without owning the compliance layer for the outreach side of the business."),
  'proof_p': "Clear boundary between VA support and licensed work. Agents and teams using VA Horizon typically see 20-40% more listing or buyer consultation opportunities per month — seller conversations created by the caller, converted by the agent.",
 },
 'reia-groups-and-investor-communities': {
  'wf1': ("Education content backed by operational infrastructure",
          "REIAs teach investors to build systems. VA Horizon provides the infrastructure those systems actually run on — callers, CRM, scripts, management layer. Members go from learning the concept to having a working system, not just more notes to implement."),
  'wf2': ("Referral partnership with visible member outcomes",
          "Group organizers who partner with VA Horizon can track which members launch engagements, offer group pricing, and tie education content directly to operational outcomes. The partnership creates credibility for the group, not just a vendor mention."),
  'proof_p': "An execution layer for education businesses. REIA groups that partner with VA Horizon give members a direct path from concept to running system — not a reading list of tools to evaluate on their own.",
 },
 'scaling-wholesale-teams': {
  'wf1': ("Roles added in sequence, not at random",
          "Adding headcount before the pipeline is ready — CRM not built, no lead manager, acquisition bottleneck undiagnosed — means the new hire either has nothing to work or breaks what was barely working. VA Horizon maps the operation before recommending the next role so the hire lands in a system that can absorb it."),
  'wf2': ("Pipeline visibility across every seat as the team grows",
          "As teams grow from 1 to 5+ VAs, HighLevel is structured to show the operator what each role is producing and where the bottleneck actually is — so the next hiring decision is based on data, not on which seat is the loudest about needing help."),
  'proof_p': "Matches VA Horizon's recommended team sequence: cold caller first, then lead manager or acquisitions manager when lead volume demands it, then dispo when deal flow supports it. Operations that follow the sequence close 3-5x more deals per team member than operations that add roles reactively.",
 },
 'short-term-rental-investors': {
  'wf1': ("Acquisition outreach targeted to STR buy boxes",
          "Short-term rental viability depends on location, HOA status, zoning, and property type. Callers are trained to screen for STR-relevant signals — not just motivation — so the operator only reviews leads with realistic rental upside based on the target market."),
  'wf2': ("Front-end activity during high-season operations",
          "STR operators are busiest managing guests during peak season. VA Horizon keeps the acquisition front end active independently so the pipeline doesn't go cold during peak occupancy periods — leads continue to land whether or not the operator has time to make calls."),
  'proof_p': "Direct outreach for selective buy boxes. STR investors using VA Horizon build a qualified acquisition pipeline without dedicating personal calling time — callers work motivated seller lists while the operator manages the operating portfolio.",
 },
 'virtual-wholesaling-operators': {
  'wf1': ("Remote pipeline visibility built into the CRM",
          "Virtual operators need HighLevel structured so every stage, every lead, and every next action is visible without being in the same room as the caller. VA Horizon builds the pipeline views and reporting specifically for remote oversight — so the operator sees what the team is producing in real time."),
  'wf2': ("Multi-market management without local overhead",
          "VA Horizon manages the caller remotely from the same playbook whether the operator is running one market or five. No local management layer required. Call QA, performance reporting, and market compliance are handled centrally so the operator can expand markets without adding management complexity."),
  'proof_p': "Built for remote pipeline clarity. Virtual wholesaling operators using VA Horizon typically run 2-5 markets simultaneously without a local management layer — callers, CRM, QA, and performance reporting all managed centrally by VA Horizon.",
 },
}

def build_wf_cards(d):
    wf1_title, wf1_body = d['wf1']
    wf2_title, wf2_body = d['wf2']
    return f'''<div class="mt-8 grid gap-5 md:grid-cols-2">
{wcard(wf1_title, wf1_body)}
{wcard(wf2_title, wf2_body)}
   </div>'''

def update_solution(slug, data):
    path = os.path.join(BASE, slug, 'index.html')
    with open(path, encoding='utf-8') as f:
        content = f.read()

    # 1. Replace the two copy-pasted Workflow Fit cards
    new_wf = build_wf_cards(data)
    content = re.sub(
        r'<div class="mt-8 grid gap-5 md:grid-cols-2">.*?</div>\s*</div>\s*</section>',
        new_wf + '\n   </div>\n </section>',
        content,
        flags=re.DOTALL,
        count=1
    )

    # 2. Improve the Proof Point body paragraph
    new_proof_p = data['proof_p']
    content = re.sub(
        r'(<div class="proof-card"><div class="proof-inner">.*?<p class="text-gray-300 text-lg leading-relaxed max-w-3xl">).*?(</p>)',
        r'\g<1>' + new_proof_p + r'\g<2>',
        content,
        flags=re.DOTALL
    )

    # 3. Add case studies link to Proof Point (only if not already present right before proof-card closes)
    if CS_LINK not in content:
        content = content.replace(
            '</p>\n  </div></div>\n  </div>\n </section>',
            '</p>\n   ' + CS_LINK + '\n  </div></div>\n  </div>\n </section>',
            1
        )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated: {slug}')

for slug, data in SOLUTIONS.items():
    update_solution(slug, data)

print('All 15 solution pages updated.')
