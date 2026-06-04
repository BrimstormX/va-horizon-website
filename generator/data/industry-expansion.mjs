function faqFor(industry, firstRole) {
  return [
    { q: `Who is this ${industry} page for?`, a: `This page is for ${industry.toLowerCase()} who want a managed VA operating layer for outbound prospecting, seller follow-up, CRM hygiene, and appointment or lead handoff.` },
    { q: `What VA role usually comes first for ${industry.toLowerCase()}?`, a: `${firstRole} is usually the first role to evaluate because it creates or protects lead flow before the operator adds more specialized roles.` },
    { q: 'Does VA Horizon replace licensed or local professional work?', a: 'No. VA Horizon supports outreach, CRM, follow-up, and operational handoff. Licensed advice, legal review, pricing decisions, and final contracts stay with qualified local professionals and the client.' },
    { q: 'How fast can the system launch?', a: 'Most managed VA workflows are built around a 48 to 72 hour launch window after intake, access, scripts, campaign direction, and CRM requirements are ready.' },
  ];
}

function rec({ slug, industry, title, description, h1, heroSubhead, stat, marketNeed, operatingModel, roles, proof, firstRole }) {
  return {
    slug,
    industry,
    title,
    description,
    h1,
    heroSubhead,
    stat,
    marketNeed,
    operatingModel,
    roles,
    proof: { title: proof[0], body: proof[1] },
    faq: faqFor(industry, firstRole),
  };
}

export const expandedIndustryRecords = [
  rec({
    slug: 'real-estate-agents',
    industry: 'Real Estate Agents and Teams',
    title: 'Virtual Assistants for Real Estate Agents and Teams | VA Horizon',
    description: 'VA Horizon helps real estate agents and teams run outbound prospecting, old-lead follow-up, seller appointment routing, and HighLevel CRM workflows.',
    h1: 'Virtual Assistants for Real Estate Agents and Teams',
    heroSubhead: 'Keep prospecting, database follow-up, and seller appointment routing moving while licensed agents focus on advice, listing strategy, negotiation, and closings.',
    stat: { value: 'GHL', label: 'CRM Routing' },
    marketNeed: 'Real estate agents and teams often have enough names in the database but not enough disciplined follow-up. Past inquiries, expired conversations, old seller leads, open-house contacts, referral lists, and sphere records lose value when every touch depends on the agent finding a spare hour. VA Horizon gives the team a managed outbound layer that creates conversations, updates records, books qualified next steps, and escalates the right opportunities to licensed agents.',
    operatingModel: 'The operating boundary matters. VAs can prospect, qualify interest, gather basic seller context, and route appointments, but licensed agents remain responsible for agency advice, pricing guidance, representation, and contracts. VA Horizon builds the scripts, CRM stages, task rules, and escalation notes around that boundary so the VA supports production without wandering into licensed work.',
    roles: [
      { title: 'Outbound Prospecting VA', body: 'Works seller lists, old leads, database records, and follow-up campaigns to create qualified appointment opportunities.' },
      { title: 'Lead Manager', body: 'Keeps warm prospects moving, re-confirms timing and motivation, and routes strong conversations to the right agent.' },
      { title: 'HighLevel CRM Support', body: 'Organizes stages, tasks, source tags, appointment status, and follow-up rules so agents know where to focus.' },
    ],
    proof: ['Prospecting should not disappear during closings', 'When active transactions get busy, daily outreach is usually the first thing to slip. The VA Horizon system protects prospecting consistency while agents stay focused on licensed, high-trust work.'],
    firstRole: 'An outbound prospecting VA',
  }),
  rec({
    slug: 'fix-and-flip-investors',
    industry: 'Fix-and-Flip Investors',
    title: 'Virtual Assistants for Fix-and-Flip Investors | VA Horizon',
    description: 'VA Horizon helps fix-and-flip investors source direct-to-seller opportunities, collect property condition notes, and manage rehab lead follow-up.',
    h1: 'Virtual Assistants for Fix-and-Flip Investors',
    heroSubhead: 'Build a direct-to-seller acquisition layer for rehab projects without making the operator chase every cold list, callback, and condition note alone.',
    stat: { value: '800+', label: 'Daily Dials' },
    marketNeed: 'Fix-and-flip investors need discounted opportunities before every buyer in the market has already seen the property. Public listings and buyer-list deals can still work, but direct outreach gives a flipper a chance to speak with owners before a deal is packaged. The challenge is that rehab operators are often busy with contractors, draws, permits, inspections, and project decisions, which makes consistent seller outreach hard to protect.',
    operatingModel: 'VA Horizon structures the front end around property facts that actually affect rehab decisions: condition, occupancy, access, seller timeline, visible distress, price expectation, and motivation. The VA does not estimate repairs or make investment decisions. The VA creates and documents the conversation so the operator, acquisitions manager, or contractor can decide whether the project deserves deeper analysis.',
    roles: [
      { title: 'Cold Calling VA', body: 'Calls absentee, high-equity, vacant, and distress lists to surface owners open to selling directly.' },
      { title: 'Lead Manager', body: 'Captures missing condition and access details, protects callback timing, and keeps possible future projects warm.' },
      { title: 'CRM Workflow Support', body: 'Keeps rehab opportunities organized by market, property condition, appointment status, offer stage, and nurture timing.' },
    ],
    proof: ['Better intake before the walkthrough', 'The right VA process helps a flipper decide where to spend attention. Clear seller notes reduce wasted walkthroughs and keep future rehab leads alive while current projects are moving.'],
    firstRole: 'A cold calling VA',
  }),
  rec({
    slug: 'brrrr-investors',
    industry: 'BRRRR Investors',
    title: 'Virtual Assistants for BRRRR Investors | VA Horizon',
    description: 'VA Horizon helps BRRRR investors source rental acquisition leads, follow up with tired landlords, and organize owner conversations in HighLevel.',
    h1: 'Virtual Assistants for BRRRR Investors',
    heroSubhead: 'Create a steadier acquisition pipeline for buy, rehab, rent, refinance, repeat operators who need direct seller conversations and disciplined follow-up.',
    stat: 'BRRRR',
    marketNeed: 'BRRRR investors need more than a cheap purchase price. The property must fit a rental strategy after rehab, leasing, and refinance assumptions. That makes lead intake more demanding than a generic cash-offer campaign. Sellers may be tired landlords, out-of-state owners, high-equity owners, vacant-property owners, or owners with deferred maintenance who are not ready today but could become strong opportunities after repeated follow-up.',
    operatingModel: 'VA Horizon builds the workflow around buy-box fit, rent potential, condition notes, occupancy, owner motivation, and follow-up timing. The VA does not underwrite the refinance or advise on lending assumptions. The VA keeps the seller conversation organized so the investor can decide whether the property fits the BRRRR model before spending time on deeper analysis.',
    roles: [
      { title: 'Cold Calling VA', body: 'Works rental-owner, absentee, high-equity, and vacant-property lists to open seller conversations.' },
      { title: 'Lead Manager', body: 'Keeps long-cycle owners organized by timing, tenant status, motivation, and next action.' },
      { title: 'HighLevel CRM Support', body: 'Creates stages and fields that separate rental-fit leads from properties that are too far, too expensive, or too repair-heavy.' },
    ],
    proof: ['Follow-up is the acquisition advantage', 'Many rental owners do not sell on the first call. A managed VA and CRM system keeps the future opportunity visible until timing, repairs, tenant issues, or owner fatigue creates an opening.'],
    firstRole: 'A cold calling VA',
  }),
];
