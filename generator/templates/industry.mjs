import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, canonicalFromSlug, SITE_ORIGIN } from '../lib/html.mjs';

const STYLE_BLOCK = ` html, body { overflow-x: hidden; width: 100%; }
 .hero-industry { background: #071e35; position: relative; overflow: hidden; }
 .hero-industry::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 900px 600px at 110% 50%, rgba(212,160,47,0.13) 0%, transparent 65%), radial-gradient(ellipse 600px 800px at -10% 60%, rgba(8,37,65,0.62) 0%, transparent 70%); pointer-events: none; }
 .hero-industry::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; }
 .hero-inner { position: relative; z-index: 2; }
 .hero-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr); gap: clamp(2rem, 5vw, 4rem); align-items: center; text-align: left; }
 .hero-grid > * { min-width: 0; }
 .industry-brief { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.16); border-radius: 18px; padding: clamp(1.4rem, 3vw, 2rem); box-shadow: 0 24px 70px rgba(0,0,0,0.22); backdrop-filter: blur(10px); }
 .brief-kicker { font-size: 0.72rem; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; color: #f0c84a; }
 .industry-brief p { color: rgba(255,255,255,0.78); line-height: 1.7; font-size: 0.95rem; }
 .brief-row { display: grid; grid-template-columns: 1fr; gap: 1rem; border-top: 1px solid rgba(255,255,255,0.14); padding-top: 1rem; margin-top: 1rem; }
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
 .memo-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1px; background: #e8e4dc; border: 1px solid #e8e4dc; border-radius: 18px; overflow: hidden; }
 .memo-card { background: #fff; padding: clamp(1.35rem, 3vw, 1.8rem); }
 .memo-card.primary { background: #082541; color: #fff; }
 .memo-card h3 { color: #082541; font-weight: 900; font-size: 1.15rem; letter-spacing: -0.02em; margin-bottom: 0.7rem; }
 .memo-card.primary h3 { color: #fff; }
 .memo-card p { color: rgba(8,37,65,0.74); line-height: 1.7; font-size: 0.93rem; }
 .memo-card.primary p { color: rgba(255,255,255,0.78); }
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
 @media (max-width: 960px) { .hero-grid, .memo-grid { grid-template-columns: 1fr; } .hero-grid { text-align: center; } .industry-brief { width: 100%; } }
 @media (max-width: 760px) { .hero-industry h1 { font-size: 2.65rem; line-height: 1.08; overflow-wrap: anywhere; } .hero-industry p { overflow-wrap: anywhere; } }
 @media (max-width: 640px) { .stat-item { flex-basis: 50%; border-bottom: 1px solid #e8e4dc; } .stat-item:nth-child(2) { border-right: none; } .stat-item:nth-child(3), .stat-item:nth-child(4) { border-bottom: none; } }`;

function schema(d, canonical) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: d.h1,
        provider: { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'VA Horizon', url: `${SITE_ORIGIN}/`, sameAs: ['https://www.linkedin.com/company/vahorizon', 'https://www.linkedin.com/in/youssef-ahmed-255966380/', 'https://www.trustpilot.com/review/vahorizon.site'] },
        serviceType: `Virtual assistant services for ${d.industry}`,
        audience: { '@type': 'Audience', audienceType: d.industry },
        areaServed: { '@type': 'Country', name: 'United States' },
        description: d.description,
        url: canonical,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Industries', item: `${SITE_ORIGIN}/industries/real-estate/` },
          { '@type': 'ListItem', position: 3, name: d.industry, item: canonical },
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

export function renderIndustry(d) {
  const canonical = canonicalFromSlug('industries', d.slug);
  const headHtml = head({ title: d.title, description: d.description, canonical, styleBlock: STYLE_BLOCK, schema: schema(d, canonical) });
  const stat = typeof d.stat === 'string' ? { value: d.stat, label: 'Industry Fit' } : d.stat;
  const campaignInput = d.campaignInput || `A strong ${d.industry.toLowerCase()} campaign starts with a clear target profile, clean source tracking, and a lead standard the VA can follow on every call. VA Horizon defines which owner or contact records should be worked first, which details must be captured, and how each conversation should be tagged in HighLevel so results can be reviewed by source, stage, and next action.`;
  const handoffStandard = d.handoffStandard || `The handoff is designed to protect the operator's judgment. The VA creates the conversation and organizes the facts, then the client decides pricing, representation, lending assumptions, legal review, and final strategy. That separation keeps the VA system productive without pretending an assistant should own decisions that belong to the business owner or a qualified professional.`;

  return `<!DOCTYPE html>
<html lang="en">
${headHtml}
<body class="bg-white font-montserrat"><div id="container"><div class="tailwind">
${nav}
<main id="main">
 <section class="hero-industry py-24 lg:py-36"><div class="hero-inner container mx-auto px-4 sm:px-6 lg:px-8">
  <div class="hero-grid">
   <div>
    <span class="section-label dark-label"><span class="section-label-dot"></span> Industry VA Systems</span>
    <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight max-w-5xl" style="letter-spacing:-0.02em; text-wrap: balance;">${esc(d.h1)}</h1>
    <p class="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mb-10">${esc(d.heroSubhead)}</p>
    <div class="flex flex-col sm:flex-row gap-4">
     <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
     <a href="/industries/real-estate/" class="btn btn-xl btn-secondary">Main Real Estate Offer</a>
    </div>
   </div>
   <aside class="industry-brief" aria-label="Industry operating brief">
    <p class="brief-kicker">Operating Brief</p>
    <h2 class="font-montserrat font-black text-2xl text-white mt-3 mb-4" style="letter-spacing:-0.02em;">The VA layer must match the business model</h2>
    <p>${esc(d.proof.body)}</p>
    <div class="brief-row">
     <div><p class="brief-kicker">Boundary</p><p>VA Horizon supports outreach, CRM, and follow-up. The client keeps licensed, legal, underwriting, and final business decisions.</p></div>
    </div>
   </aside>
  </div>
 </div></section>
 <div class="stats-bar"><div class="container mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-wrap" style="border-left: 1px solid #e8e4dc;">
  <div class="stat-item"><div class="stat-num">${esc(stat.value)}</div><div class="stat-label">${esc(stat.label)}</div></div>
  <div class="stat-item"><div class="stat-num">48<span>h</span></div><div class="stat-label">Typical Launch</div></div>
  <div class="stat-item"><div class="stat-num">GHL</div><div class="stat-label">CRM Included</div></div>
  <div class="stat-item"><div class="stat-num">QA</div><div class="stat-label">Managed Weekly</div></div>
 </div></div></div>
 <section class="py-20 bg-white"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
  <span class="section-label"><span class="section-label-dot"></span> Market Need</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">Why ${esc(d.industry)} need a managed VA layer</h2>
  <p class="text-va-dark/80 text-lg leading-relaxed max-w-4xl">${esc(d.marketNeed)}</p>
 </div></section>
 <section class="py-20 bg-va-smoke border-y border-va-divider"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
  <span class="section-label"><span class="section-label-dot"></span> Operating Model</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">How the workflow stays inside the right lane</h2>
  <p class="text-va-dark/80 text-lg leading-relaxed max-w-4xl">${esc(d.operatingModel)}</p>
 </div></section>
 <section class="py-20 bg-va-warm"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> Campaign Design</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">What must be defined before the VA starts</h2>
  <div class="memo-grid">
   <div class="memo-card primary"><h3>Campaign inputs</h3><p>${esc(campaignInput)}</p></div>
   <div class="memo-card"><h3>Decision handoff</h3><p>${esc(handoffStandard)}</p></div>
  </div>
 </div></section>
 <section class="py-20 bg-white"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> Role Map</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">The VA roles that usually fit this industry</h2>
  <div class="grid gap-5 md:grid-cols-3">${cards(d.roles)}</div>
 </div></section>
 <section class="py-20 bg-va-smoke border-y border-va-divider"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
  <div class="proof-card"><div class="proof-inner">
   <span class="section-label dark-label"><span class="section-label-dot"></span> Proof Point</span>
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
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-4" style="letter-spacing:-0.02em;">Build the ${esc(d.industry)} VA system</h2>
  <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Book a 15-minute call and we will map the caller, CRM, follow-up, and management layer that fits your current operation.</p>
  <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 </div></section>
</main>
${footer}
</div></div><script src="/buttons.js" defer></script></body></html>`;
}
