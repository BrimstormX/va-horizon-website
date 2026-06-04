import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, SITE_ORIGIN } from '../lib/html.mjs';

const STYLE_BLOCK = ` html, body { overflow-x: hidden; width: 100%; }
 .hero-compare { background: #071e35; position: relative; overflow: hidden; }
 .hero-compare::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 900px 600px at 110% 50%, rgba(212,160,47,0.13) 0%, transparent 65%), radial-gradient(ellipse 600px 800px at -10% 60%, rgba(8,37,65,0.62) 0%, transparent 70%); pointer-events: none; }
 .hero-compare::after { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; }
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
 .compare-table { width: 100%; border-collapse: separate; border-spacing: 0; overflow: hidden; border: 1px solid #e8e4dc; border-radius: 14px; background: #fff; }
 .compare-table th { background: #082541; color: #fff; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; padding: 1rem; text-align: left; }
 .compare-table th:nth-child(2) { background: #D4A02F; color: #082541; }
 .compare-table td { padding: 1rem; border-top: 1px solid #e8e4dc; color: rgba(8,37,65,0.76); font-size: 0.92rem; line-height: 1.65; vertical-align: top; }
 .compare-table td:first-child { font-weight: 800; color: #082541; background: #F6F1E8; width: 22%; }
 .compare-table td:nth-child(2) { background: rgba(212,160,47,0.07); color: #082541; font-weight: 600; }
 .why-card { background: #fff; border: 1px solid #e8e4dc; border-radius: 16px; padding: 1.6rem; position: relative; overflow: hidden; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
 .why-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #D4A02F, #f0c84a); transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
 .why-card:hover { transform: translateY(-4px); box-shadow: 0 16px 38px rgba(8,37,65,0.1); border-color: rgba(212,160,47,0.45); }
 .why-card:hover::before { transform: scaleX(1); }
 .source-card { background: #F6F1E8; border: 1px solid #e8e4dc; border-left: 4px solid #D4A02F; border-radius: 14px; padding: 1.25rem 1.5rem; }
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
 @media (max-width: 760px) { .stat-item { flex-basis: 50%; border-bottom: 1px solid #e8e4dc; } .compare-table, .compare-table thead, .compare-table tbody, .compare-table tr, .compare-table th, .compare-table td { display: block; width: 100%; } .compare-table thead { display: none; } .compare-table tr { border-top: 1px solid #e8e4dc; } .compare-table td:first-child { width: 100%; border-top: 0; } .compare-table td::before { display: block; font-size: 0.68rem; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #C39A26; margin-bottom: 0.35rem; } .compare-table td:nth-child(2)::before { content: 'VA Horizon'; } .compare-table td:nth-child(3)::before { content: 'Alternative'; } }`;

function canonicalFor(route) {
  return `${SITE_ORIGIN}${route}`;
}

function hubFor(route) {
  return route.startsWith('/alternatives/') ? { label: 'Alternatives', route: '/alternatives/' } : { label: 'Compare', route: '/compare/' };
}

function buildSchema(d, canonical) {
  const hub = hubFor(d.route);
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: d.title,
        description: d.description,
        url: canonical,
        datePublished: '2026-06-04',
        dateModified: '2026-06-04',
        author: { '@type': 'Person', name: 'Youssef Ahmed', jobTitle: 'Founder, VA Horizon', url: `${SITE_ORIGIN}/about/` },
        publisher: { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'VA Horizon', url: `${SITE_ORIGIN}/`, logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/logo.png` } },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: hub.label, item: `${SITE_ORIGIN}${hub.route}` },
          { '@type': 'ListItem', position: 3, name: d.h1, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: d.faq.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
      },
    ],
  });
}

function rows(d) {
  return d.comparisonRows.map(row => `<tr>
 <td>${esc(row.label)}</td>
 <td>${esc(row.vah)}</td>
 <td>${esc(row.alt)}</td>
 </tr>`).join('\n ');
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

function sourceBlock(d) {
  if (!d.sourceUrl) return '';
  return `<div class="source-card mt-8">
 <p class="text-xs font-extrabold uppercase tracking-[0.14em] text-va-gold mb-2">Public Source Reviewed</p>
 <p class="text-va-dark/75 text-sm leading-relaxed">This comparison uses ${esc(d.alternativeName)}'s public positioning as a reference point, reviewed June 4, 2026. Verify pricing, terms, availability, and guarantees directly before buying.</p>
 <a href="${esc(d.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex mt-3 text-sm font-bold text-va-navy hover:text-va-gold">${esc(d.sourceLabel || d.sourceUrl)}</a>
 </div>`;
}

export function renderComparison(d) {
  const canonical = canonicalFor(d.route);
  const headHtml = head({
    title: d.title,
    description: d.description,
    canonical,
    twitterDescription: d.twitterDescription,
    styleBlock: STYLE_BLOCK,
    schema: buildSchema(d, canonical),
  });

  return `<!DOCTYPE html>
<html lang="en">
${headHtml}
<body class="bg-white font-montserrat">
<div id="container"><div class="tailwind">
${nav}
<main id="main">
 <section class="hero-compare py-24 lg:py-36">
  <div class="hero-inner container mx-auto px-4 sm:px-6 lg:px-8 text-center">
   <span class="section-label dark-label"><span class="section-label-dot"></span> ${esc(d.category)}</span>
   <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight max-w-5xl mx-auto" style="letter-spacing:-0.02em; text-wrap: balance;">${esc(d.h1)}</h1>
   <p class="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">${esc(d.summary)}</p>
   <div class="flex flex-col sm:flex-row gap-4 justify-center">
    <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
    <a href="/compare/" class="btn btn-xl btn-secondary">Browse Comparisons</a>
   </div>
  </div>
 </section>
 <div class="stats-bar"><div class="container mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-wrap" style="border-left: 1px solid #e8e4dc;">
  <div class="stat-item"><div class="stat-num">30<span>+</span></div><div class="stat-label">Lead Guarantee</div></div>
  <div class="stat-item"><div class="stat-num">48<span>h</span></div><div class="stat-label">Launch Window</div></div>
  <div class="stat-item"><div class="stat-num">800<span>+</span></div><div class="stat-label">Dials Per Shift</div></div>
  <div class="stat-item"><div class="stat-num">1</div><div class="stat-label">Managed System</div></div>
 </div></div></div>
 <section class="py-20 bg-white">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
   <span class="section-label"><span class="section-label-dot"></span> Quick Verdict</span>
   <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">When ${esc(d.alternativeName)} makes sense, and when VA Horizon is the better fit</h2>
   <p class="text-va-dark/80 text-lg leading-relaxed max-w-4xl">${esc(d.bestFor)}</p>
   ${sourceBlock(d)}
  </div>
 </section>
 <section class="py-20 bg-va-smoke border-y border-va-divider">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
   <span class="section-label"><span class="section-label-dot"></span> Side-by-Side</span>
   <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">VA Horizon vs ${esc(d.alternativeName)}</h2>
   <table class="compare-table">
    <thead><tr><th>Decision Point</th><th>VA Horizon</th><th>${esc(d.alternativeName)}</th></tr></thead>
    <tbody>${rows(d)}</tbody>
   </table>
  </div>
 </section>
 <section class="py-20 bg-white">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
   <span class="section-label"><span class="section-label-dot"></span> Why Operators Choose VA Horizon</span>
   <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">The difference is the managed wholesaling system</h2>
   <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">${cards(d.reasons)}</div>
  </div>
 </section>
 <section class="py-20 bg-va-smoke border-y border-va-divider">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
   <span class="section-label"><span class="section-label-dot"></span> Tradeoffs</span>
   <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">What to verify before choosing either option</h2>
   <div class="grid gap-5 md:grid-cols-2">${cards(d.tradeoffs)}</div>
  </div>
 </section>
 <section class="py-20 bg-white">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
   <div class="text-center"><span class="section-label"><span class="section-label-dot"></span> FAQ</span><h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">Frequently Asked Questions</h2></div>
   <div class="border border-va-divider rounded-xl overflow-hidden">${faq(d.faq)}</div>
  </div>
 </section>
 <section class="py-24 cta-section text-white text-center"><div class="cta-inner container mx-auto px-4 sm:px-6 lg:px-8">
  <span class="gold-rule mx-auto mb-8"></span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-4" style="letter-spacing:-0.02em;">Choose the system that creates seller conversations</h2>
  <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Book a 15-minute call and we will map the caller, CRM, dialer, scripts, and follow-up process your wholesale team needs.</p>
  <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 </div></section>
</main>
${footer}
</div></div>
<script src="/buttons.js" defer></script>
</body>
</html>`;
}

function altCard(r) {
  return `<a href="${esc(r.route)}" class="why-card block">
 <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-va-gold mb-2">${esc(r.category)}</p>
 <h3 class="font-montserrat font-black text-va-navy text-xl mb-3" style="letter-spacing:-0.02em;">${esc(r.h1)}</h3>
 <p class="text-va-dark/75 text-sm leading-relaxed">${esc(r.summary)}</p>
 </a>`;
}

export function renderAlternativesHub(records) {
  const alternatives = records.filter(r => r.route.startsWith('/alternatives/'));
  const canonical = `${SITE_ORIGIN}/alternatives/`;
  const title = 'VA Horizon Alternatives for Real Estate Wholesalers | VA Horizon';
  const description = 'Compare VA Horizon with agency, freelancer, software, lead generation, coaching, and in-house alternatives for real estate wholesaling teams.';
  const schema = jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: title, description, url: canonical },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` }, { '@type': 'ListItem', position: 2, name: 'Alternatives', item: canonical }] },
    ],
  });

  return `<!DOCTYPE html>
<html lang="en">
${head({ title, description, canonical, styleBlock: STYLE_BLOCK, schema })}
<body class="bg-white font-montserrat"><div id="container"><div class="tailwind">
${nav}
<main id="main">
 <section class="hero-compare py-24 lg:py-36"><div class="hero-inner container mx-auto px-4 sm:px-6 lg:px-8 text-center">
  <span class="section-label dark-label"><span class="section-label-dot"></span> Alternatives</span>
  <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight max-w-5xl mx-auto" style="letter-spacing:-0.02em; text-wrap: balance;">VA Horizon Alternatives</h1>
  <p class="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">Compare the realistic options a wholesaler considers before choosing a managed cold calling VA system: agencies, freelancers, software, lead vendors, coaches, and in-house hiring.</p>
  <a href="/compare/" class="btn btn-xl btn-primary">Browse All Comparisons</a>
 </div></section>
 <div class="stats-bar"><div class="container mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-wrap" style="border-left: 1px solid #e8e4dc;">
  <div class="stat-item"><div class="stat-num">${alternatives.length}</div><div class="stat-label">Alternative Pages</div></div>
  <div class="stat-item"><div class="stat-num">30<span>+</span></div><div class="stat-label">Lead Guarantee</div></div>
  <div class="stat-item"><div class="stat-num">48<span>h</span></div><div class="stat-label">Launch Window</div></div>
  <div class="stat-item"><div class="stat-num">1</div><div class="stat-label">Managed System</div></div>
 </div></div></div>
 <section class="py-20 bg-va-smoke"><div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  <span class="section-label"><span class="section-label-dot"></span> Alternative Library</span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10" style="letter-spacing:-0.02em;">Choose the option you are comparing against</h2>
  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">${alternatives.map(altCard).join('\n ')}</div>
 </div></section>
 <section class="py-24 cta-section text-white text-center"><div class="cta-inner container mx-auto px-4 sm:px-6 lg:px-8">
  <span class="gold-rule mx-auto mb-8"></span>
  <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-4" style="letter-spacing:-0.02em;">Need the decision made plainly?</h2>
  <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">If you want managed seller outreach, HighLevel setup, Readymode dialing, and a lead guarantee in one system, VA Horizon is built for that lane.</p>
  <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 </div></section>
</main>
${footer}
</div></div><script src="/buttons.js" defer></script></body></html>`;
}
