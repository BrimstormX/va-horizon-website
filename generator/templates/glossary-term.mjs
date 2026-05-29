// Glossary term page template: data record -> full standalone HTML document.
// Owns head + body + DefinedTerm/BreadcrumbList/FAQPage JSON-LD.
// Visible breadcrumb + VAH_INTERNAL_LINKS block are added by the post-processor.
import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, canonicalFromSlug, SITE_ORIGIN } from '../lib/html.mjs';

const GLOSSARY_SET = `${SITE_ORIGIN}/glossary/`;

const STYLE_BLOCK = ` .hero-term {
 background: linear-gradient(135deg, #082541 0%, #0a2e52 100%);
 position: relative;
 overflow: hidden;
 }
 .hero-term::before {
 content: '';
 position: absolute;
 inset: 0;
 background-image: radial-gradient(circle, rgba(212,160,47,0.08) 1px, transparent 1px);
 background-size: 28px 28px;
 pointer-events: none;
 }
 .def-card {
 background: #fff;
 border: 1px solid #E2E8F0;
 border-left: 4px solid #D4A02F;
 border-radius: 12px;
 padding: 28px;
 }
 .formula-box {
 background: #082541;
 color: #fff;
 border-radius: 12px;
 padding: 22px 26px;
 font-size: 1.05rem;
 }
 .formula-box code { color: #f0c84a; font-weight: 700; }
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
 .faq-item details summary { cursor: pointer; list-style: none; padding: 18px 20px; font-weight: 700; color: #082541; display: flex; justify-content: space-between; align-items: center; }
 .faq-item details summary::-webkit-details-marker { display: none; }
 .faq-item details summary::after { content: '+'; font-size: 1.4rem; color: #D4A02F; font-weight: 400; flex-shrink: 0; margin-left: 12px; }
 .faq-item details[open] summary::after { content: '\\2212'; }
 .faq-item details .faq-body { padding: 0 20px 18px; color: #3a4a5c; font-size: 0.95rem; line-height: 1.7; }
 .faq-item { border-bottom: 1px solid #E2E8F0; }
 .faq-item:last-child { border-bottom: none; }
 .cta-glow { background: radial-gradient(ellipse at center, rgba(212,160,47,0.15) 0%, transparent 70%), #082541; }`;

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
    .map(p => `<p class="text-va-dark text-lg leading-relaxed mb-5">${esc(p.trim())}</p>`)
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
  return `<div class="mt-10">
 <h3 class="font-montserrat font-black text-va-navy text-lg mb-3" style="letter-spacing:-0.02em;">Related VA Horizon resources</h3>
 <ul class="space-y-2 list-disc pl-5">
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
  return `<div class="mt-8">
 <h3 class="font-montserrat font-black text-va-navy text-lg mb-3" style="letter-spacing:-0.02em;">Example</h3>
 ${paragraphs(example)}
 </div>`;
}

function faqList(faq) {
  if (!faq || !faq.length) return '';
  const items = faq.map(item => `<div class="faq-item">
 <details>
 <summary>${esc(item.q)}</summary>
 <div class="faq-body">${esc(item.a)}</div>
 </details>
 </div>`).join('\n ');
  return `<section class="py-20 bg-white border-t border-va-divider">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
 <span class="section-label mb-4 inline-block">FAQ</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10 text-center" style="letter-spacing:-0.02em;">Frequently Asked Questions</h2>
 <div class="border border-va-divider rounded-xl overflow-hidden">
 ${items}
 </div>
 </div>
 </section>`;
}

export function renderGlossaryTerm(d) {
  const canonical = canonicalFromSlug('glossary', d.slug);
  const aliasLine = d.aliases && d.aliases.length
    ? `<p class="text-gray-400 text-sm mb-4">Also known as: ${esc(d.aliases.join(', '))}</p>`
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
 <section class="hero-term py-20 lg:py-28">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
 <span class="section-label mb-6 inline-block">Wholesaling Glossary${d.category ? ` &middot; ${esc(d.category)}` : ''}</span>
 <h1 class="font-montserrat font-black text-4xl lg:text-5xl text-white mb-4 leading-tight" style="letter-spacing:-0.02em;">
 What Is ${esc(d.term)}?
 </h1>
 ${aliasLine}
 <p class="text-gray-200 text-xl leading-relaxed mb-8">${esc(d.shortDefinition)}</p>
 <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 </div>
 </section>

 <!-- DEFINITION -->
 <section class="py-20 bg-white">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
 <div class="def-card mb-10">
 <span class="section-label mb-3 inline-block">Definition</span>
 <p class="text-va-navy text-lg font-semibold leading-relaxed">${esc(d.shortDefinition)}</p>
 </div>
 <span class="section-label mb-4 inline-block">In Depth</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">${esc(d.term)} explained</h2>
 ${paragraphs(d.longExplanation)}
 ${formulaBox(d.formula)}
 ${exampleBlock(d.example)}
 ${relatedResources(d.relatedResources)}
 </div>
 </section>

 ${relatedTermChips(d.relatedTerms)}

 ${faqList(d.faq)}

 <!-- CTA -->
 <section class="py-24 cta-glow text-white text-center">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="w-16 h-1 bg-va-gold mx-auto mb-8 rounded-full"></div>
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
</body>
</html>`;

  return `<!DOCTYPE html>
<html lang="en">
${headHtml}
${body}`;
}
