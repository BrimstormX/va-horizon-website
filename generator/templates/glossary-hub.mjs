// Glossary hub (/glossary/) template: full term list -> hub HTML document.
// Emits DefinedTermSet schema + a category-grouped index linking every term.
// Visible breadcrumb + VAH_INTERNAL_LINKS block are added by the post-processor.
import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, SITE_ORIGIN } from '../lib/html.mjs';

const CANONICAL = `${SITE_ORIGIN}/glossary/`;

const STYLE_BLOCK = ` html,
 body {
 overflow-x: hidden;
 width: 100%;
 }
 .hero-gloss {
 background: #071e35;
 position: relative;
 overflow: hidden;
 }
 .hero-gloss::before {
 content: '';
 position: absolute;
 inset: 0;
 background:
 radial-gradient(ellipse 900px 600px at 110% 50%, rgba(212,160,47,0.13) 0%, transparent 65%),
 radial-gradient(ellipse 600px 800px at -10% 60%, rgba(8,37,65,0.62) 0%, transparent 70%);
 pointer-events: none;
 }
 .hero-gloss::after {
 content: '';
 position: absolute;
 inset: 0;
 background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
 background-size: 28px 28px;
 pointer-events: none;
 }
 .hero-gloss-inner { position: relative; z-index: 2; }
 .section-label {
 display: inline-flex;
 align-items: center;
 gap: 0.5rem;
 padding: 0.35rem 0.9rem;
 background: rgba(212,160,47,0.1);
 border: 1px solid rgba(212,160,47,0.3);
 border-radius: 999px;
 font-size: 0.7rem;
 font-weight: 700;
 text-transform: uppercase;
 letter-spacing: 0.1em;
 color: #C39A26;
 margin-bottom: 1rem;
 }
 .section-label-dot {
 width: 6px;
 height: 6px;
 border-radius: 50%;
 background: #D4A02F;
 flex-shrink: 0;
 }
 .dark-label {
 background: rgba(212,160,47,0.15);
 border-color: rgba(212,160,47,0.4);
 color: #f0c84a;
 }
 .gold-rule {
 display: block;
 width: 56px;
 height: 3px;
 background: linear-gradient(90deg, #D4A02F, #f0c84a);
 border-radius: 2px;
 }
 .stats-bar {
 background: #fff;
 border-bottom: 1px solid #e8e4dc;
 }
 .stat-item {
 display: flex;
 flex-direction: column;
 align-items: center;
 padding: 1.5rem 1.5rem;
 border-right: 1px solid #e8e4dc;
 flex: 1;
 min-width: 11rem;
 }
 .stat-item:last-child { border-right: none; }
 .stat-num {
 font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif;
 font-size: clamp(2rem, 3.5vw, 2.75rem);
 font-weight: 900;
 color: #082541;
 line-height: 1;
 letter-spacing: -0.02em;
 }
 .stat-num span { color: #D4A02F; }
 .stat-label {
 font-size: 0.75rem;
 font-weight: 700;
 text-transform: uppercase;
 letter-spacing: 0.08em;
 color: rgba(8,37,65,0.62);
 margin-top: 0.45rem;
 text-align: center;
 }
 .gloss-group {
 padding-top: 1rem;
 border-top: 1px solid #e8e4dc;
 }
 .gloss-card {
 display: block;
 background: #fff;
 border: 1px solid #e8e4dc;
 border-radius: 16px;
 padding: 1.35rem 1.45rem;
 min-height: 100%;
 position: relative;
 overflow: hidden;
 transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
 }
 .gloss-card::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 height: 3px;
 background: linear-gradient(90deg, #D4A02F, #f0c84a);
 transform: scaleX(0);
 transform-origin: left;
 transition: transform 0.3s ease;
 }
 .gloss-card:hover { border-color: rgba(212,160,47,0.6); box-shadow: 0 16px 38px rgba(8,37,65,0.1); transform: translateY(-4px); }
 .gloss-card:hover::before { transform: scaleX(1); }
 .gloss-term {
 display: block;
 font-weight: 900;
 color: #082541;
 letter-spacing: -0.02em;
 line-height: 1.25;
 font-size: 1.05rem;
 }
 .gloss-def {
 display: block;
 color: rgba(8,37,65,0.72);
 font-size: 0.9rem;
 line-height: 1.65;
 margin-top: 0.65rem;
 }
 .cta-section {
 background: #071e35;
 position: relative;
 overflow: hidden;
 }
 .cta-section::before {
 content: '';
 position: absolute;
 inset: 0;
 background: radial-gradient(ellipse 800px 500px at 50% 100%, rgba(212,160,47,0.12) 0%, transparent 65%);
 pointer-events: none;
 }
 .cta-section::after {
 content: '';
 position: absolute;
 top: -1px;
 left: 0;
 right: 0;
 height: 3px;
 background: linear-gradient(90deg, transparent 0%, #D4A02F 50%, transparent 100%);
 }
 .cta-inner { position: relative; z-index: 2; }
 @keyframes fadeUp {
 from { opacity: 0; transform: translateY(24px); }
 to { opacity: 1; transform: translateY(0); }
 }
 .fade-up { animation: fadeUp 0.6s ease both; }
 .delay-1 { animation-delay: 0.1s; }
 .delay-2 { animation-delay: 0.2s; }
 .delay-3 { animation-delay: 0.3s; }
 @media (max-width: 640px) {
 .stat-item { flex-basis: 50%; border-bottom: 1px solid #e8e4dc; }
 .stat-item:nth-child(2) { border-right: none; }
 .stat-item:nth-child(3),
 .stat-item:nth-child(4) { border-bottom: none; }
 }`;

function buildSchema(records) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DefinedTermSet',
        '@id': CANONICAL,
        name: 'VA Horizon Real Estate Wholesaling Glossary',
        description: 'Definitions of the key real estate wholesaling terms: valuation, contracts, lead generation, and disposition.',
        url: CANONICAL,
        hasDefinedTerm: records.map(r => ({
          '@type': 'DefinedTerm',
          name: r.term,
          url: `${CANONICAL}${r.slug}/`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Glossary', item: CANONICAL },
        ],
      },
    ],
  });
}

function groupByCategory(records) {
  const groups = new Map();
  for (const r of records) {
    const cat = r.category || 'General';
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(r);
  }
  for (const list of groups.values()) list.sort((a, b) => a.term.localeCompare(b.term));
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function card(r) {
  return `<a href="/glossary/${esc(r.slug)}/" class="gloss-card">
 <span class="gloss-term">${esc(r.term)}</span>
 <span class="gloss-def">${esc(r.shortDefinition)}</span>
 </a>`;
}

export function renderGlossaryHub(records) {
  const title = 'Real Estate Wholesaling Glossary: Key Terms Defined | VA Horizon';
  const description = `Plain-English definitions of ${records.length}+ real estate wholesaling terms, from ARV and MAO to assignment contracts, double closes, and skip tracing.`;

  const headHtml = head({
    title,
    description,
    canonical: CANONICAL,
    styleBlock: STYLE_BLOCK,
    schema: buildSchema(records),
  });

  const groups = groupByCategory(records).map(([cat, list]) => `<div class="gloss-group mb-14">
 <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
 <div>
 <span class="section-label mb-3 inline-flex"><span class="section-label-dot"></span> ${esc(cat)}</span>
 <h2 class="font-montserrat font-black text-2xl lg:text-3xl text-va-navy" style="letter-spacing:-0.02em;">${esc(cat)} terms</h2>
 </div>
 <p class="text-sm font-bold uppercase tracking-[0.12em] text-va-dark/50">${list.length} entries</p>
 </div>
 <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 ${list.map(card).join('\n ')}
 </div>
 </div>`).join('\n ');

  const body = `<body class="bg-white font-montserrat">
<div id="container">
<div class="tailwind">

 ${nav}

 <main id="main">

 <!-- HERO -->
 <section class="hero-gloss py-24 lg:py-36">
 <div class="hero-gloss-inner container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="max-w-5xl mx-auto text-center">
 <span class="section-label dark-label mb-6 inline-flex fade-up"><span class="section-label-dot"></span> Wholesaling Glossary</span>
 <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight fade-up delay-1" style="letter-spacing:-0.02em; text-wrap: balance;">
 The Real Estate Wholesaling Glossary
 </h1>
 <p class="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10 fade-up delay-2">Plain-English definitions of the terms every wholesaler needs, from valuation and contracts to lead generation and disposition. Built by the team that runs these systems for operators every day.</p>
 <div class="flex flex-col sm:flex-row gap-4 justify-center fade-up delay-3">
 <a href="/industries/real-estate/" class="btn btn-xl btn-primary">See Real Estate VA Services</a>
 <a href="/tools/" class="btn btn-xl btn-secondary">Use the Tools</a>
 </div>
 </div>
 </div>
 </section>

 <!-- STATS -->
 <div class="stats-bar">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="flex flex-wrap" style="border-left: 1px solid #e8e4dc;">
 <div class="stat-item">
 <div class="stat-num">${records.length}<span>+</span></div>
 <div class="stat-label">Defined Terms</div>
 </div>
 <div class="stat-item">
 <div class="stat-num">${groupByCategory(records).length}</div>
 <div class="stat-label">Topic Groups</div>
 </div>
 <div class="stat-item">
 <div class="stat-num">2</div>
 <div class="stat-label">FAQ Answers Each</div>
 </div>
 <div class="stat-item">
 <div class="stat-num">100<span>%</span></div>
 <div class="stat-label">Plain-English</div>
 </div>
 </div>
 </div>
 </div>

 <!-- INDEX -->
 <section class="py-20 bg-va-smoke">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
 <div class="max-w-3xl mb-12">
 <span class="section-label mb-4 inline-flex"><span class="section-label-dot"></span> Reference Library</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-4" style="letter-spacing:-0.02em;">Find the term, then connect it to the workflow</h2>
 <p class="text-va-dark/75 text-lg leading-relaxed">Each glossary page explains the definition, shows where the term appears in a wholesale operation, and links back to related guides, tools, and services.</p>
 </div>
 ${groups}
 </div>
 </section>

 <!-- CTA -->
 <section class="py-24 cta-section text-white text-center">
 <div class="cta-inner container mx-auto px-4 sm:px-6 lg:px-8">
 <span class="gold-rule mx-auto mb-8"></span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-4" style="letter-spacing:-0.02em;">Know the terms. Now build the pipeline.</h2>
 <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">VA Horizon places trained cold calling VAs and builds the CRM, dialer, and follow-up systems behind every one of these terms. Book a 15-minute call.</p>
 <div class="flex flex-col sm:flex-row gap-6 justify-center">
 <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 <a href="/industries/real-estate/" class="btn btn-xl btn-secondary">See Pricing</a>
 </div>
 </div>
 </section>
</main>

 ${footer}


</div>
</div>
<script src="/buttons.js" defer></script>
</body>
</html>`;

  return `<!DOCTYPE html>
<html lang="en">
${headHtml}
${body}`;
}
