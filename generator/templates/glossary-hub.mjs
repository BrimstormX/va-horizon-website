// Glossary hub (/glossary/) template: full term list -> hub HTML document.
// Emits DefinedTermSet schema + a category-grouped index linking every term.
// Visible breadcrumb + VAH_INTERNAL_LINKS block are added by the post-processor.
import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, SITE_ORIGIN } from '../lib/html.mjs';

const CANONICAL = `${SITE_ORIGIN}/glossary/`;

const STYLE_BLOCK = ` .hero-gloss {
 background: linear-gradient(135deg, #082541 0%, #0a2e52 100%);
 position: relative;
 overflow: hidden;
 }
 .hero-gloss::before {
 content: '';
 position: absolute;
 inset: 0;
 background-image: radial-gradient(circle, rgba(212,160,47,0.08) 1px, transparent 1px);
 background-size: 28px 28px;
 pointer-events: none;
 }
 .gloss-card {
 display: block;
 background: #fff;
 border: 1px solid #e8e4dc;
 border-radius: 12px;
 padding: 18px 20px;
 transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
 }
 .gloss-card:hover { border-color: rgba(212,160,47,0.6); box-shadow: 0 6px 18px rgba(8,37,65,0.08); transform: translateY(-2px); }
 .gloss-term { font-weight: 800; color: #082541; letter-spacing: -0.01em; }
 .gloss-def { color: #4a5a6a; font-size: 0.9rem; line-height: 1.5; margin-top: 6px; }`;

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

  const groups = groupByCategory(records).map(([cat, list]) => `<div class="mb-12">
 <h2 class="font-montserrat font-black text-2xl text-va-navy mb-5" style="letter-spacing:-0.02em;">${esc(cat)}</h2>
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
 <section class="hero-gloss py-20 lg:py-28">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-4xl">
 <span class="section-label mb-6 inline-block">Wholesaling Glossary</span>
 <h1 class="font-montserrat font-black text-4xl lg:text-5xl text-white mb-6 leading-tight" style="letter-spacing:-0.02em;">
 The Real Estate Wholesaling Glossary
 </h1>
 <p class="text-gray-200 text-xl leading-relaxed max-w-2xl mx-auto">Plain-English definitions of the terms every wholesaler needs, from valuation and contracts to lead generation and disposition. Built by the team that runs these systems for operators every day.</p>
 </div>
 </section>

 <!-- INDEX -->
 <section class="py-20 bg-va-smoke">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
 ${groups}
 </div>
 </section>

 <!-- CTA -->
 <section class="py-24 cta-glow text-white text-center">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="w-16 h-1 bg-va-gold mx-auto mb-8 rounded-full"></div>
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
