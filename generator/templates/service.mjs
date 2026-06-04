import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, canonicalFromSlug, SITE_ORIGIN } from '../lib/html.mjs';

const STYLE_BLOCK = ` html, body { overflow-x: hidden; width: 100%; }
 .hero-service { background: #071e35; position: relative; overflow: hidden; }
 .hero-service::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 900px 600px at 110% 50%, rgba(212,160,47,0.13) 0%, transparent 65%), radial-gradient(ellipse 600px 800px at -10% 60%, rgba(8,37,65,0.62) 0%, transparent 70%); pointer-events: none; }
 .hero-service::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; }
 .hero-inner { position: relative; z-index: 2; }
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
 @media (max-width: 640px) { .stat-item { flex-basis: 50%; border-bottom: 1px solid #e8e4dc; } .stat-item:nth-child(2) { border-right: none; } .stat-item:nth-child(3), .stat-item:nth-child(4) { border-bottom: none; } }`;

function schema(d, canonical) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: d.service,
        provider: { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'VA Horizon', url: `${SITE_ORIGIN}/` },
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

export function renderService(d) {
  const canonical = canonicalFromSlug('services', d.slug);
  const headHtml = head({ title: d.title, description: d.description, canonical, styleBlock: STYLE_BLOCK, schema: schema(d, canonical) });
  const handoffCopy = d.handoff || `${d.service} is managed as part of the seller pipeline, not as an isolated task. The first handoff standard is ${d.deliverables[0].title.toLowerCase()}: the VA Horizon team defines what must be captured, where it belongs in HighLevel, and which person owns the next action after the service produces work. That clarity keeps the service tied to revenue work instead of busywork.`;
  const managementCopy = d.management || `Weekly management reviews whether ${d.service.toLowerCase()} is creating useful movement in the pipeline, not just activity. VA Horizon checks notes, task hygiene, response quality, follow-up timing, and the connection between this service and the next role in the operation so the owner can improve the system without managing every detail personally. The review also flags whether the bottleneck is list quality, caller behavior, offer timing, CRM discipline, or owner-side decision speed.`;

  return `<!DOCTYPE html>
<html lang="en">
${headHtml}
<body class="bg-white font-montserrat">
<div id="container"><div class="tailwind">
${nav}
<main id="main">
 <section class="hero-service py-24 lg:py-36"><div class="hero-inner container mx-auto px-4 sm:px-6 lg:px-8 text-center">
  <span class="section-label dark-label"><span class="section-label-dot"></span> VA Horizon Services</span>
  <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight max-w-5xl mx-auto" style="letter-spacing:-0.02em; text-wrap: balance;">${esc(d.h1)}</h1>
  <p class="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">${esc(d.heroSubhead)}</p>
  <div class="flex flex-col sm:flex-row gap-4 justify-center">
   <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
   <a href="/services/" class="btn btn-xl btn-secondary">Browse Services</a>
  </div>
 </div></section>
 <div class="stats-bar"><div class="container mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-wrap" style="border-left: 1px solid #e8e4dc;">
  <div class="stat-item"><div class="stat-num">${esc(d.price)}</div><div class="stat-label">Starting Price</div></div>
  <div class="stat-item"><div class="stat-num">48<span>h</span></div><div class="stat-label">Typical Launch</div></div>
  <div class="stat-item"><div class="stat-num">GHL</div><div class="stat-label">CRM Included</div></div>
  <div class="stat-item"><div class="stat-num">QA</div><div class="stat-label">Managed Weekly</div></div>
 </div></div></div>
 <section class="py-20 bg-white"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
  <span class="section-label"><span class="section-label-dot"></span> Best Fit</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">Who this service is for</h2>
  <p class="text-va-dark/80 text-lg leading-relaxed max-w-4xl">${esc(d.bestFor)}</p>
 </div></section>
 <section class="py-20 bg-va-smoke border-y border-va-divider"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> Deliverables</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">What VA Horizon handles</h2>
  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">${cards(d.deliverables)}</div>
 </div></section>
 <section class="py-20 bg-white"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
  <span class="section-label"><span class="section-label-dot"></span> Workflow</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">How the service plugs into your operation</h2>
  <p class="text-va-dark/80 text-lg leading-relaxed max-w-4xl">${esc(d.workflow)}</p>
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
  <div class="stat-item"><div class="stat-num">30<span>+</span></div><div class="stat-label">Lead Guarantee</div></div>
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
