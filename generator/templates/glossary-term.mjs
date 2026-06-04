// Glossary term page template: data record -> full standalone HTML document.
// Owns head + body + DefinedTerm/BreadcrumbList/FAQPage JSON-LD.
// Visible breadcrumb + VAH_INTERNAL_LINKS block are added by the post-processor.
import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, canonicalFromSlug, SITE_ORIGIN } from '../lib/html.mjs';

const GLOSSARY_SET = `${SITE_ORIGIN}/glossary/`;

const STYLE_BLOCK = ` html,
 body {
 overflow-x: hidden;
 width: 100%;
 }
 .hero-term {
 background: #071e35;
 position: relative;
 overflow: hidden;
 }
 .hero-term::before {
 content: '';
 position: absolute;
 inset: 0;
 background:
 radial-gradient(ellipse 900px 600px at 110% 50%, rgba(212,160,47,0.13) 0%, transparent 65%),
 radial-gradient(ellipse 600px 800px at -10% 60%, rgba(8,37,65,0.62) 0%, transparent 70%);
 pointer-events: none;
 }
 .hero-term::after {
 content: '';
 position: absolute;
 inset: 0;
 background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
 background-size: 28px 28px;
 pointer-events: none;
 }
 .hero-term-inner { position: relative; z-index: 2; }
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
 .def-card {
 background: #fff;
 border: 1px solid #e8e4dc;
 border-left: 4px solid #D4A02F;
 border-radius: 16px;
 padding: clamp(1.5rem, 4vw, 2.25rem);
 box-shadow: 0 18px 45px rgba(8,37,65,0.08);
 }
 .term-prose p {
 color: rgba(8,37,65,0.78);
 font-size: 1.075rem;
 line-height: 1.85;
 margin-bottom: 1.25rem;
 }
 .example-card {
 background: #F6F1E8;
 border: 1px solid #e8e4dc;
 border-radius: 16px;
 padding: clamp(1.35rem, 3vw, 2rem);
 }
 .formula-box {
 background: #071e35;
 color: #fff;
 border-radius: 14px;
 padding: 1.35rem 1.6rem;
 font-size: 1rem;
 line-height: 1.7;
 box-shadow: 0 16px 38px rgba(8,37,65,0.16);
 }
 .formula-box code { color: #f0c84a; font-weight: 700; }
 .resource-list {
 border: 1px solid #e8e4dc;
 border-radius: 16px;
 padding: 1.5rem;
 background: #fff;
 }
 .term-chip {
 display: inline-flex;
 align-items: center;
 gap: 0.5rem;
 padding: 0.55rem 1rem;
 background: #fff;
 border: 1px solid #e8e4dc;
 border-radius: 10px;
 font-weight: 600;
 font-size: 0.9rem;
 color: #082541;
 transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
 }
 .term-chip:hover { border-color: rgba(212,160,47,0.6); box-shadow: 0 4px 12px rgba(212,160,47,0.15); transform: translateY(-2px); }
 .term-chip::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #D4A02F; flex-shrink: 0; }
 .faq-item {
 background: #fff;
 border: 1px solid #e8e4dc;
 border-radius: 14px;
 overflow: hidden;
 transition: border-color 0.2s ease, box-shadow 0.2s ease;
 }
 .faq-item.open { border-color: rgba(212,160,47,0.5); box-shadow: 0 4px 20px rgba(212,160,47,0.08); }
 .faq-trigger {
 width: 100%;
 text-align: left;
 padding: 1.4rem 1.75rem;
 display: flex;
 align-items: center;
 justify-content: space-between;
 gap: 1rem;
 cursor: pointer;
 background: none;
 border: none;
 font-family: inherit;
 }
 .faq-trigger-text { font-weight: 800; font-size: 1rem; color: #082541; line-height: 1.4; }
 .faq-icon {
 width: 28px;
 height: 28px;
 border-radius: 50%;
 background: #F6F1E8;
 display: flex;
 align-items: center;
 justify-content: center;
 flex-shrink: 0;
 transition: background 0.2s ease, transform 0.3s ease;
 color: #082541;
 font-weight: 900;
 }
 .faq-item.open .faq-icon { background: #D4A02F; color: #fff; transform: rotate(45deg); }
 .faq-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
 .faq-body.open { max-height: 420px; }
 .faq-body-inner { padding: 0 1.75rem 1.5rem; color: rgba(8,37,65,0.75); font-size: 0.95rem; line-height: 1.75; }
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
 @media (max-width: 760px) {
 .hero-term h1 { font-size: 2.65rem; line-height: 1.08; overflow-wrap: anywhere; }
 .hero-term p { overflow-wrap: anywhere; }
 }
 @media (max-width: 640px) {
 .stat-item { flex-basis: 50%; border-bottom: 1px solid #e8e4dc; }
 .stat-item:nth-child(2) { border-right: none; }
 .stat-item:nth-child(3),
 .stat-item:nth-child(4) { border-bottom: none; }
 }`;

function buildSchema(d, canonical) {
  const graph = [
    {
      '@type': 'DefinedTerm',
      '@id': `${canonical}#term`,
      name: d.term,
      description: d.shortDefinition,
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        '@id': GLOSSARY_SET,
        name: 'VA Horizon Real Estate Wholesaling Glossary',
        url: GLOSSARY_SET,
      },
      url: canonical,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Glossary', item: GLOSSARY_SET },
        { '@type': 'ListItem', position: 3, name: d.term, item: canonical },
      ],
    },
  ];
  if (Array.isArray(d.faq) && d.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: d.faq.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }
  return jsonLd({ '@context': 'https://schema.org', '@graph': graph });
}

function paragraphs(text) {
  return String(text)
    .split('\n\n')
    .map(p => `<p>${esc(p.trim())}</p>`)
    .join('\n ');
}

function relatedTermChips(terms) {
  if (!terms || !terms.length) return '';
  const chips = terms.map(t => `<a href="/glossary/${esc(t.slug)}/" class="term-chip">${esc(t.label)}</a>`).join('\n ');
  return `<section class="py-16 bg-va-smoke border-t border-va-divider">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
 <span class="section-label mb-4 inline-block">Related Terms</span>
 <h2 class="font-montserrat font-black text-2xl lg:text-3xl text-va-navy mb-6" style="letter-spacing:-0.02em;">Keep learning the language of wholesaling</h2>
 <div class="flex flex-wrap gap-3">
 ${chips}
 </div>
 </div>
 </section>`;
}

function relatedResources(resources) {
  if (!resources || !resources.length) return '';
  const items = resources.map(r => `<li><a href="${esc(r.href)}" class="text-va-navy font-semibold hover:text-va-gold transition-colors">${esc(r.label)}</a></li>`).join('\n ');
  return `<div class="resource-list mt-10">
 <h3 class="font-montserrat font-black text-va-navy text-xl mb-4" style="letter-spacing:-0.02em;">Related VA Horizon resources</h3>
 <ul class="space-y-2 list-disc pl-5 text-va-dark/80">
 ${items}
 </ul>
 </div>`;
}

function formulaBox(formula) {
  if (!formula) return '';
  return `<div class="formula-box my-8"><code>${esc(formula)}</code></div>`;
}

function exampleBlock(example) {
  if (!example) return '';
  return `<div class="example-card mt-8">
 <h3 class="font-montserrat font-black text-va-navy text-xl mb-3" style="letter-spacing:-0.02em;">Example</h3>
 <div class="term-prose">
 ${paragraphs(example)}
 </div>
 </div>`;
}

function faqList(faq) {
  if (!faq || !faq.length) return '';
  const items = faq.map((item, index) => `<div class="faq-item${index === 0 ? ' open' : ''}">
 <button class="faq-trigger" aria-expanded="${index === 0 ? 'true' : 'false'}" type="button">
 <span class="faq-trigger-text">${esc(item.q)}</span>
 <span class="faq-icon" aria-hidden="true">+</span>
 </button>
 <div class="faq-body${index === 0 ? ' open' : ''}">
 <div class="faq-body-inner">${esc(item.a)}</div>
 </div>
 </div>`).join('\n ');
  return `<section class="py-20 bg-white border-t border-va-divider">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
 <div class="text-center">
 <span class="section-label mb-4 inline-flex"><span class="section-label-dot"></span> FAQ</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10 text-center" style="letter-spacing:-0.02em;">Frequently Asked Questions</h2>
 </div>
 <div class="space-y-4">
 ${items}
 </div>
 </div>
 </section>`;
}

export function renderGlossaryTerm(d) {
  const canonical = canonicalFromSlug('glossary', d.slug);
  const collectionCount = d.collectionCount || 47;
  const aliasLine = d.aliases && d.aliases.length
    ? `<p class="text-gray-300 text-sm font-semibold mb-5">Also known as: ${esc(d.aliases.join(', '))}</p>`
    : '';

  const headHtml = head({
    title: d.title,
    description: d.description,
    canonical,
    styleBlock: STYLE_BLOCK,
    schema: buildSchema(d, canonical),
  });

  const body = `<body class="bg-white font-montserrat">
<div id="container">
<div class="tailwind">

 ${nav}

 <main id="main">

 <!-- HERO -->
 <section class="hero-term py-24 lg:py-36">
 <div class="hero-term-inner container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="max-w-5xl mx-auto text-center">
 <span class="section-label dark-label mb-6 inline-flex fade-up"><span class="section-label-dot"></span> Wholesaling Glossary${d.category ? ` &middot; ${esc(d.category)}` : ''}</span>
 <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight fade-up delay-1" style="letter-spacing:-0.02em; text-wrap: balance;">
 What Is ${esc(d.term)}?
 </h1>
 ${aliasLine}
 <p class="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed fade-up delay-2">${esc(d.shortDefinition)}</p>
 <div class="flex flex-col sm:flex-row gap-4 justify-center fade-up delay-3">
 <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 <a href="/glossary/" class="btn btn-xl btn-secondary">Browse Glossary</a>
 </div>
 </div>
 </div>
 </section>

 <!-- STATS -->
 <div class="stats-bar">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="flex flex-wrap" style="border-left: 1px solid #e8e4dc;">
 <div class="stat-item">
 <div class="stat-num">${esc(collectionCount)}</div>
 <div class="stat-label">Glossary Terms</div>
 </div>
 <div class="stat-item">
 <div class="stat-num">4</div>
 <div class="stat-label">Deal Stages</div>
 </div>
 <div class="stat-item">
 <div class="stat-num">2</div>
 <div class="stat-label">FAQ Answers</div>
 </div>
 <div class="stat-item">
 <div class="stat-num">1</div>
 <div class="stat-label">Operator Playbook</div>
 </div>
 </div>
 </div>
 </div>

 <!-- DEFINITION -->
 <section class="py-20 bg-white">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
 <div class="def-card mb-10">
 <span class="section-label mb-3 inline-flex"><span class="section-label-dot"></span> Definition</span>
 <p class="text-va-navy text-lg font-semibold leading-relaxed">${esc(d.shortDefinition)}</p>
 </div>
 <span class="section-label mb-4 inline-flex"><span class="section-label-dot"></span> In Depth</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">${esc(d.term)} explained</h2>
 <div class="term-prose">
 ${paragraphs(d.longExplanation)}
 </div>
 ${formulaBox(d.formula)}
 ${exampleBlock(d.example)}
 ${relatedResources(d.relatedResources)}
 </div>
 </section>

 ${relatedTermChips(d.relatedTerms)}

 ${faqList(d.faq)}

 <!-- CTA -->
 <section class="py-24 cta-section text-white text-center">
 <div class="cta-inner container mx-auto px-4 sm:px-6 lg:px-8">
 <span class="gold-rule mx-auto mb-8"></span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-4" style="letter-spacing:-0.02em;">Put the playbook to work</h2>
 <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">VA Horizon places trained cold calling VAs and builds the systems behind ${esc(d.term)} and the rest of your wholesaling pipeline. Book a 15-minute call to see how it works.</p>
 <div class="flex flex-col sm:flex-row gap-6 justify-center">
 <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 <a href="/glossary/" class="btn btn-xl btn-secondary">Browse the Glossary</a>
 </div>
 </div>
 </section>
</main>

 ${footer}


</div>
</div>
<script src="/buttons.js" defer></script>
<script src="/js/glossary-faq.js" defer></script>
</body>
</html>`;

  return `<!DOCTYPE html>
<html lang="en">
${headHtml}
${body}`;
}
