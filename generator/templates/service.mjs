import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, canonicalFromSlug, SITE_ORIGIN } from '../lib/html.mjs';

const STYLE_BLOCK = ` html, body { overflow-x: hidden; width: 100%; }
 .hero-service { background: #071e35; position: relative; overflow: hidden; }
 .hero-service::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 900px 600px at 110% 50%, rgba(212,160,47,0.13) 0%, transparent 65%), radial-gradient(ellipse 600px 800px at -10% 60%, rgba(8,37,65,0.62) 0%, transparent 70%); pointer-events: none; }
 .hero-service::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; }
 .hero-inner { position: relative; z-index: 2; }
 .hero-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr); gap: clamp(2rem, 5vw, 4rem); align-items: center; text-align: left; }
 .hero-grid > * { min-width: 0; }
 .service-brief { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.16); border-radius: 18px; padding: clamp(1.4rem, 3vw, 2rem); box-shadow: 0 24px 70px rgba(0,0,0,0.22); backdrop-filter: blur(10px); }
 .brief-row { display: grid; grid-template-columns: 1fr; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.14); padding-top: 1rem; margin-top: 1rem; }
 .brief-kicker { font-size: 0.72rem; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; color: #f0c84a; }
 .service-brief p { color: rgba(255,255,255,0.78); line-height: 1.7; font-size: 0.95rem; }
 .section-label { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.9rem; background: rgba(212,160,47,0.1); border: 1px solid rgba(212,160,47,0.3); border-radius: 999px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #C39A26; margin-bottom: 1rem; }
 .section-label-dot { width: 6px; height: 6px; border-radius: 50%; background: #D4A02F; flex-shrink: 0; }
 .dark-label { background: rgba(212,160,47,0.15); border-color: rgba(212,160,47,0.4); color: #f0c84a; }
 .stats-bar { background: #fff; border-bottom: 1px solid #e8e4dc; }
 .stat-item { display: flex; flex-direction: column; align-items: center; padding: 1.5rem; border-right: 1px solid #e8e4dc; flex: 1; min-width: 11rem; }
 .stat-item:last-child { border-right: none; }
 .stat-num { font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif; font-size: clamp(2rem, 3.5vw, 2.75rem); font-weight: 900; color: #082541; line-height: 1; letter-spacing: -0.02em; }
 .stat-num span { color: #D4A02F; }
 .stat-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(8,37,65,0.62); margin-top: 0.45rem; text-align: center; }
 .why-card { background: #fff; border: 1px solid #e8e4dc; border-radius: 16px; padding: 1.6rem; position: relative; overflow: hidden; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
 .why-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #D4A02F, #f0c84a); transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
 .why-card:hover { transform: translateY(-4px); box-shadow: 0 16px 38px rgba(8,37,65,0.1); border-color: rgba(212,160,47,0.45); }
 .why-card:hover::before { transform: scaleX(1); }
 .boundary-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; background: #e8e4dc; border: 1px solid #e8e4dc; border-radius: 18px; overflow: hidden; }
 .boundary-card { background: #fff; padding: clamp(1.35rem, 3vw, 1.8rem); min-height: 100%; }
 .boundary-card:nth-child(2) { background: #082541; color: #fff; }
 .boundary-card h3 { font-size: 1.1rem; font-weight: 900; color: #082541; letter-spacing: -0.02em; margin-bottom: 0.7rem; }
 .boundary-card:nth-child(2) h3 { color: #fff; }
 .boundary-card p { color: rgba(8,37,65,0.74); line-height: 1.7; font-size: 0.93rem; }
 .boundary-card:nth-child(2) p { color: rgba(255,255,255,0.78); }
 .workflow-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; border: 1px solid #e8e4dc; border-radius: 18px; overflow: hidden; background: #e8e4dc; }
 .workflow-step { background: #fff; padding: 1.5rem; }
 .workflow-step-num { display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 999px; background: #082541; color: #D4A02F; font-weight: 900; font-size: 0.8rem; margin-bottom: 1rem; }
 .workflow-step h3 { color: #082541; font-weight: 900; font-size: 1.05rem; letter-spacing: -0.02em; margin-bottom: 0.55rem; }
 .workflow-step p { color: rgba(8,37,65,0.72); line-height: 1.65; font-size: 0.9rem; }
 .proof-card { background: #071e35; border-radius: 18px; padding: clamp(1.75rem, 4vw, 2.5rem); color: #fff; position: relative; overflow: hidden; }
 .proof-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 500px 260px at 85% 15%, rgba(212,160,47,0.18), transparent 70%); pointer-events: none; }
 .proof-inner { position: relative; z-index: 2; }
 .faq-item details summary { cursor: pointer; list-style: none; padding: 18px 20px; font-weight: 800; color: #082541; display: flex; justify-content: space-between; align-items: center; }
 .faq-item details summary::-webkit-details-marker { display: none; }
 .faq-item details summary::after { content: '+'; font-size: 1.4rem; color: #D4A02F; font-weight: 400; flex-shrink: 0; margin-left: 12px; }
 .faq-item details[open] summary::after { content: '\\2212'; }
 .faq-item details .faq-body { padding: 0 20px 18px; color: rgba(8,37,65,0.75); font-size: 0.95rem; line-height: 1.7; }
 .faq-item { border-bottom: 1px solid #e8e4dc; }
 .faq-item:last-child { border-bottom: none; }
 .cta-section { background: #071e35; position: relative; overflow: hidden; }
 .cta-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 800px 500px at 50% 100%, rgba(212,160,47,0.12) 0%, transparent 65%); pointer-events: none; }
 .cta-section::after { content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent 0%, #D4A02F 50%, transparent 100%); }
 .cta-inner { position: relative; z-index: 2; }
 .gold-rule { display: block; width: 56px; height: 3px; background: linear-gradient(90deg, #D4A02F, #f0c84a); border-radius: 2px; }
 @media (max-width: 960px) { .hero-grid, .boundary-grid, .workflow-grid { grid-template-columns: 1fr; } .hero-grid { text-align: center; } .service-brief { width: 100%; } }
 @media (max-width: 760px) { .hero-service h1 { font-size: 2.65rem; line-height: 1.08; overflow-wrap: anywhere; } .hero-service p { overflow-wrap: anywhere; } }
 @media (max-width: 640px) { .stat-item { flex-basis: 50%; border-bottom: 1px solid #e8e4dc; } .stat-item:nth-child(2) { border-right: none; } .stat-item:nth-child(3), .stat-item:nth-child(4) { border-bottom: none; } }`;

function schema(d, canonical) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: d.service,
        provider: { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'VA Horizon', url: `${SITE_ORIGIN}/`, sameAs: ['https://www.linkedin.com/company/vahorizon', 'https://www.linkedin.com/in/youssef-ahmed-255966380/', 'https://www.trustpilot.com/review/vahorizon.site'] },
        serviceType: d.service,
        areaServed: { '@type': 'Country', name: 'United States' },
        audience: { '@type': 'Audience', audienceType: 'Real estate wholesalers and investors' },
        offers: { '@type': 'Offer', price: d.priceValue || d.price.replace(/[^0-9.]/g, ''), priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
        description: d.description,
        url: canonical,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_ORIGIN}/services/` },
          { '@type': 'ListItem', position: 3, name: d.service, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: d.faq.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
      },
    ],
  });
}

function cards(items) {
  return items.map(item => `<div class="why-card">
 <h3 class="font-montserrat font-black text-va-navy text-xl mb-3" style="letter-spacing:-0.02em;">${esc(item.title)}</h3>
 <p class="text-va-dark/75 text-sm leading-relaxed">${esc(item.body)}</p>
 </div>`).join('\n ');
}

function faq(items) {
  return items.map((item, i) => `<div class="faq-item">
 <details${i === 0 ? ' open' : ''}>
 <summary>${esc(item.q)}</summary>
 <div class="faq-body">${esc(item.a)}</div>
 </details>
 </div>`).join('\n ');
}

function boundaryFor(d) {
  const defaults = {
    va: `${d.service} produces the specific operating output described on this page, then records it in the shared workflow so the next person can act.`,
    horizon: 'VA Horizon defines the process, configures HighLevel, reviews quality, manages handoffs, and watches the bottlenecks that affect output.',
    client: 'The client keeps final business judgment: pricing, offers, legal review, contracts, seller decisions, and closing strategy.',
  };

  const bySlug = {
    'cold-calling': {
      va: 'The VA has one job: call seller records, qualify motivation, capture property context, and submit qualified leads. The caller does not build lists, skip trace, tag CRM records, or manage admin work.',
      horizon: 'VA Horizon handles list sourcing coordination, skip tracing workflow, Readymode setup, HighLevel buildout, scripts, QA, follow-up sequences, and weekly performance management.',
      client: 'The client reviews qualified leads, makes offer decisions, handles legal and contract review, and closes the deal or routes it to acquisitions.',
    },
    'acquisition-manager': {
      va: 'The AM re-qualifies warm seller leads, builds rapport, supports comps and offer preparation, negotiates under the operator rules, and moves qualified opportunities toward agreement.',
      horizon: 'VA Horizon only places AMs with prior phone experience, real estate AM experience, and verified deal exposure. The management layer watches follow-up quality and handoff discipline.',
      client: 'The client keeps final pricing authority, legal review, contract approval, seller decision rules, and closing strategy.',
    },
    'disposition-manager': {
      va: 'The disposition manager organizes buyer outreach, buyer feedback, deal package communication, showing or access notes, and assignment-side follow-up.',
      horizon: 'VA Horizon defines the handoff between acquisitions and disposition so buyer feedback can inform offer strategy instead of living in scattered texts.',
      client: 'The client owns contract terms, buyer approval, pricing strategy, title coordination decisions, and final assignment terms.',
    },
    'lead-manager': {
      va: 'The lead manager protects warm seller follow-up, re-qualifies motivation, fills missing notes, books next steps, and escalates the strongest conversations.',
      horizon: 'VA Horizon keeps the CRM stages, tasks, callback rules, and escalation standards clean so warm leads are not left to memory.',
      client: 'The client or senior AM owns offer strategy, negotiation decisions, legal review, and final seller commitments.',
    },
  };

  return bySlug[d.slug] || defaults;
}

function boundaryCards(d) {
  const boundary = boundaryFor(d);
  const cards = [
    { title: 'What the role does', body: boundary.va },
    { title: 'What VA Horizon manages', body: boundary.horizon },
    { title: 'What the client still owns', body: boundary.client },
  ];

  return cards.map(item => `<div class="boundary-card">
 <h3>${esc(item.title)}</h3>
 <p>${esc(item.body)}</p>
 </div>`).join('\n ');
}

function workflowSteps(d) {
  const steps = [
    { title: 'Intake and role rules', body: `We define where ${d.service.toLowerCase()} sits in the pipeline, what counts as useful output, and which handoff rules matter before work starts.` },
    { title: 'CRM and tool setup', body: 'HighLevel stages, tags, fields, tasks, notes, and reporting views are aligned to the role so work is visible and reviewable.' },
    { title: 'Weekly performance loop', body: 'Output is reviewed against the bottleneck: lead volume, note quality, response speed, handoff quality, or owner-side decision speed.' },
  ];

  return steps.map((step, index) => `<div class="workflow-step">
 <span class="workflow-step-num">${String(index + 1).padStart(2, '0')}</span>
 <h3>${esc(step.title)}</h3>
 <p>${esc(step.body)}</p>
 </div>`).join('\n ');
}

export function renderService(d) {
  const canonical = canonicalFromSlug('services', d.slug);
  const headHtml = head({ title: d.title, description: d.description, canonical, styleBlock: STYLE_BLOCK, schema: schema(d, canonical) });
  const handoffCopy = d.handoff || `${d.service} is managed as part of the seller pipeline, not as an isolated task. The handoff standard defines what must be captured, where it belongs in HighLevel, and which person owns the next action after the service produces work. That clarity keeps the service tied to revenue work instead of busywork.`;
  const managementCopy = d.management || `Weekly management reviews whether ${d.service.toLowerCase()} is creating useful movement in the pipeline, not just activity. VA Horizon checks notes, task hygiene, response quality, follow-up timing, and the connection between this service and the next role in the operation so the owner can improve the system without managing every detail personally. The review also flags whether the bottleneck is list quality, caller behavior, offer timing, CRM discipline, or owner-side decision speed.`;

  return `<!DOCTYPE html>
<html lang="en">
${headHtml}
<body class="bg-white font-montserrat">
<div id="container"><div class="tailwind">
${nav}
<main id="main">
 <section class="hero-service py-24 lg:py-36"><div class="hero-inner container mx-auto px-4 sm:px-6 lg:px-8">
  <div class="hero-grid">
   <div>
    <span class="section-label dark-label"><span class="section-label-dot"></span> VA Horizon Services</span>
    <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight max-w-5xl" style="letter-spacing:-0.02em; text-wrap: balance;">${esc(d.h1)}</h1>
    <p class="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mb-10">${esc(d.heroSubhead)}</p>
    <div class="flex flex-col sm:flex-row gap-4">
     <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
     <a href="/services/" class="btn btn-xl btn-secondary">Browse Services</a>
    </div>
   </div>
   <aside class="service-brief" aria-label="Service brief">
    <p class="brief-kicker">Service Brief</p>
    <h2 class="font-montserrat font-black text-2xl text-white mt-3 mb-4" style="letter-spacing:-0.02em;">The point is managed output</h2>
    <p>${esc(d.bestFor)}</p>
    <div class="brief-row">
     <div><p class="brief-kicker">Starting Point</p><p>${esc(d.price)}${d.price === 'Included' ? ' inside eligible VA Horizon packages' : ' before any custom scope changes'}</p></div>
     <div><p class="brief-kicker">Operating Layer</p><p>HighLevel workflow, handoff rules, QA, and weekly management are part of the system.</p></div>
    </div>
   </aside>
  </div>
 </div></section>
 <div class="stats-bar"><div class="container mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-wrap" style="border-left: 1px solid #e8e4dc;">
  <div class="stat-item"><div class="stat-num">${esc(d.price)}</div><div class="stat-label">Starting Price</div></div>
  <div class="stat-item"><div class="stat-num">48<span>h</span></div><div class="stat-label">Typical Launch</div></div>
  <div class="stat-item"><div class="stat-num">GHL</div><div class="stat-label">CRM Included</div></div>
  <div class="stat-item"><div class="stat-num">QA</div><div class="stat-label">Managed Weekly</div></div>
 </div></div></div>
 <section class="py-20 bg-white"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> Role Boundaries</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">What this service does and does not own</h2>
  <div class="boundary-grid">${boundaryCards(d)}</div>
 </div></section>
 <section class="py-20 bg-va-smoke border-y border-va-divider"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
  <span class="section-label"><span class="section-label-dot"></span> Best Fit</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">Who this service is for</h2>
  <p class="text-va-dark/80 text-lg leading-relaxed max-w-4xl">${esc(d.bestFor)}</p>
 </div></section>
 <section class="py-20 bg-white"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> Deliverables</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">What VA Horizon handles</h2>
  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">${cards(d.deliverables)}</div>
 </div></section>
 <section class="py-20 bg-va-smoke border-y border-va-divider"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> Workflow</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">How the service plugs into your operation</h2>
  <p class="text-va-dark/80 text-lg leading-relaxed max-w-4xl mb-10">${esc(d.workflow)}</p>
  <div class="workflow-grid">${workflowSteps(d)}</div>
 </div></section>
 <section class="py-20 bg-va-warm"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> Management Layer</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">How VA Horizon keeps the work accountable</h2>
  <div class="grid gap-6 lg:grid-cols-2">
   <div class="why-card"><h3 class="font-montserrat font-black text-va-navy text-xl mb-3" style="letter-spacing:-0.02em;">Handoff rules</h3><p class="text-va-dark/75 text-sm leading-relaxed">${esc(handoffCopy)}</p></div>
   <div class="why-card"><h3 class="font-montserrat font-black text-va-navy text-xl mb-3" style="letter-spacing:-0.02em;">Weekly review</h3><p class="text-va-dark/75 text-sm leading-relaxed">${esc(managementCopy)}</p></div>
  </div>
 </div></section>
 <section class="py-20 bg-va-smoke border-y border-va-divider"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
  <div class="proof-card"><div class="proof-inner">
   <span class="section-label dark-label"><span class="section-label-dot"></span> Operating Standard</span>
   <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-5" style="letter-spacing:-0.02em;">${esc(d.proof.title)}</h2>
   <p class="text-gray-300 text-lg leading-relaxed max-w-3xl">${esc(d.proof.body)}</p>
  </div></div>
 </div></section>
 <section class="py-20 bg-white"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
  <div class="text-center"><span class="section-label"><span class="section-label-dot"></span> FAQ</span><h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">Frequently Asked Questions</h2></div>
  <div class="border border-va-divider rounded-xl overflow-hidden">${faq(d.faq)}</div>
 </div></section>
 <section class="py-24 cta-section text-white text-center"><div class="cta-inner container mx-auto px-4 sm:px-6 lg:px-8">
  <span class="gold-rule mx-auto mb-8"></span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-4" style="letter-spacing:-0.02em;">Build the right VA system around this service</h2>
  <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Book a 15-minute call and we will map the role, CRM, dialer, scripts, and follow-up process that fits your current lead volume.</p>
  <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 </div></section>
</main>
${footer}
</div></div><script src="/buttons.js" defer></script></body></html>`;
}

function serviceCard(r) {
  return `<a href="/services/${esc(r.slug)}/" class="why-card block">
 <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-va-gold mb-2">${esc(r.price)}</p>
 <h3 class="font-montserrat font-black text-va-navy text-xl mb-3" style="letter-spacing:-0.02em;">${esc(r.service)}</h3>
 <p class="text-va-dark/75 text-sm leading-relaxed">${esc(r.heroSubhead)}</p>
 </a>`;
}

export function renderServiceHub(records) {
  const canonical = `${SITE_ORIGIN}/services/`;
  const title = 'Real Estate VA Services for Wholesalers | VA Horizon';
  const description = 'Browse VA Horizon services for real estate wholesalers: cold calling VAs, acquisition managers, disposition managers, lead managers, CRM setup, SMS campaigns, QA, and team scaling.';
  const schemaBlock = jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: title, description, url: canonical },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` }, { '@type': 'ListItem', position: 2, name: 'Services', item: canonical }] },
    ],
  });
  return `<!DOCTYPE html>
<html lang="en">
${head({ title, description, canonical, styleBlock: STYLE_BLOCK, schema: schemaBlock })}
<body class="bg-white font-montserrat"><div id="container"><div class="tailwind">
${nav}
<main id="main">
 <section class="hero-service py-24 lg:py-36"><div class="hero-inner container mx-auto px-4 sm:px-6 lg:px-8 text-center">
  <span class="section-label dark-label"><span class="section-label-dot"></span> Services</span>
  <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight max-w-5xl mx-auto" style="letter-spacing:-0.02em; text-wrap: balance;">Real Estate VA Services for Wholesalers</h1>
  <p class="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">Choose the managed VA role or operating layer that removes your next bottleneck: seller conversations, follow-up, offers, disposition, CRM, SMS, or team scaling.</p>
  <a href="/industries/real-estate/" class="btn btn-xl btn-primary">See Main Real Estate Offer</a>
 </div></section>
 <div class="stats-bar"><div class="container mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-wrap" style="border-left: 1px solid #e8e4dc;">
  <div class="stat-item"><div class="stat-num">${records.length}</div><div class="stat-label">Service Pages</div></div>
  <div class="stat-item"><div class="stat-num">48<span>h</span></div><div class="stat-label">Typical Launch</div></div>
  <div class="stat-item"><div class="stat-num">30<span>+</span></div><div class="stat-label">Cold Calling Guarantee</div></div>
  <div class="stat-item"><div class="stat-num">GHL</div><div class="stat-label">CRM Included</div></div>
 </div></div></div>
 <section class="py-20 bg-va-smoke"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> Service Library</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">Pick the service that matches your bottleneck</h2>
  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">${records.map(serviceCard).join('\n ')}</div>
 </div></section>
 <section class="py-24 cta-section text-white text-center"><div class="cta-inner container mx-auto px-4 sm:px-6 lg:px-8">
  <span class="gold-rule mx-auto mb-8"></span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-4" style="letter-spacing:-0.02em;">Not sure which service comes first?</h2>
  <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Book a call and we will map your current pipeline to the VA seat or system layer that removes the biggest bottleneck.</p>
  <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 </div></section>
</main>
${footer}
</div></div><script src="/buttons.js" defer></script></body></html>`;
}
