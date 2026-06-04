// Location page template: data record -> full standalone HTML document.
// Owns head + body + page-type JSON-LD. The visible breadcrumb and the
// VAH_INTERNAL_LINKS block are intentionally NOT emitted here; the existing
// scripts/generate-internal-links.mjs post-processor injects those from sitemap.xml.
import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, canonicalFromSlug, routeFromSlug, SITE_ORIGIN } from '../lib/html.mjs';

const STYLE_BLOCK = ` .hero-location {
 background: linear-gradient(135deg, #082541 0%, #0a2e52 100%);
 position: relative;
 overflow: hidden;
 }
 .hero-location::before {
 content: '';
 position: absolute;
 inset: 0;
 background-image: radial-gradient(circle, rgba(212,160,47,0.08) 1px, transparent 1px);
 background-size: 28px 28px;
 pointer-events: none;
 }
 .stat-card {
 background: rgba(255,255,255,0.07);
 border: 1px solid rgba(212,160,47,0.25);
 border-radius: 12px;
 padding: 20px 24px;
 text-align: center;
 }
 .feature-grid {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
 gap: 20px;
 }
 .feature-card {
 background: #fff;
 border: 1px solid #E2E8F0;
 border-radius: 12px;
 padding: 22px;
 }
 .step-card {
 background: #F6F1E8;
 border-radius: 12px;
 padding: 24px;
 position: relative;
 }
 .step-number {
 width: 40px;
 height: 40px;
 background: #D4A02F;
 color: #082541;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-weight: 800;
 font-size: 1rem;
 margin-bottom: 14px;
 }
 .faq-item details summary {
 cursor: pointer;
 list-style: none;
 padding: 18px 20px;
 font-weight: 700;
 color: #082541;
 display: flex;
 justify-content: space-between;
 align-items: center;
 }
 .faq-item details summary::-webkit-details-marker { display: none; }
 .faq-item details summary::after {
 content: '+';
 font-size: 1.4rem;
 color: #D4A02F;
 font-weight: 400;
 flex-shrink: 0;
 margin-left: 12px;
 }
 .faq-item details[open] summary::after { content: '\\2212'; }
 .faq-item details .faq-body {
 padding: 0 20px 18px;
 color: #3a4a5c;
 font-size: 0.95rem;
 line-height: 1.7;
 }
 .faq-item { border-bottom: 1px solid #E2E8F0; }
 .faq-item:last-child { border-bottom: none; }
 .cta-glow {
 background: radial-gradient(ellipse at center, rgba(212,160,47,0.15) 0%, transparent 70%), #082541;
 }
 @media (max-width: 760px) {
 .hero-location h1 { font-size: 2.65rem; line-height: 1.08; overflow-wrap: anywhere; }
 .hero-location p { overflow-wrap: anywhere; }
 }`;

function buildSchema(d, canonical, route) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `${d.service} Services in ${d.city}, ${d.state}`,
        provider: {
          '@type': 'Organization',
          '@id': `${SITE_ORIGIN}/#organization`,
          name: 'VA Horizon',
          url: `${SITE_ORIGIN}/`,
        },
        areaServed: { '@type': 'City', name: d.city, addressRegion: d.state },
        description: d.schemaDescription || d.description,
        url: canonical,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Real Estate VAs', item: `${SITE_ORIGIN}/industries/real-estate/` },
          { '@type': 'ListItem', position: 3, name: `${d.service}s in ${d.city}`, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: d.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  });
}

function whyCards(cards) {
  return cards.map(c => `<div class="feature-card">
 <div class="text-va-gold text-2xl mb-3">&#9650;</div>
 <h3 class="font-montserrat font-black text-va-navy text-base mb-2" style="letter-spacing:-0.02em;">${esc(c.title)}</h3>
 <p class="text-va-dark text-sm leading-relaxed">${esc(c.body)}</p>
 </div>`).join('\n ');
}

function targetAreas(areas) {
  return areas.map(a => `<li class="flex items-start gap-3"><span class="text-va-gold font-bold mt-0.5">&#8594;</span> <span><strong>${esc(a.area)}</strong> - ${esc(a.note)}</span></li>`).join('\n ');
}

function marketConditions(items) {
  return items.map(c => `<li class="flex items-start gap-3"><span class="text-va-gold font-bold mt-0.5">&#8594;</span> <span>${esc(c)}</span></li>`).join('\n ');
}

function faqList(faq) {
  return faq.map(item => `<div class="faq-item">
 <details>
 <summary>${esc(item.q)}</summary>
 <div class="faq-body">${esc(item.a)}</div>
 </details>
 </div>`).join('\n ');
}

export function renderLocation(d) {
  const canonical = canonicalFromSlug('locations', d.slug);
  const route = routeFromSlug('locations', d.slug);
  const marketStatValue = d.marketStatValue || d.medianPrice;
  const marketStatLabel = d.marketStatLabel || `${d.city} Median Home Price`;

  const headHtml = head({
    title: d.title,
    description: d.description,
    twitterDescription: d.twitterDescription,
    canonical,
    styleBlock: STYLE_BLOCK,
    schema: buildSchema(d, canonical, route),
  });

  const body = `<body class="bg-white font-montserrat">
<div id="container">
<div class="tailwind">

 ${nav}

 <main id="main">

<!-- HERO -->
 <section class="hero-location py-20 lg:py-28">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
 <span class="section-label mb-6 inline-flex"><span class="section-label-dot"></span>${esc(d.heroLabel)}</span>
 <h1 class="font-montserrat font-black text-4xl lg:text-5xl text-white mb-6 leading-tight max-w-4xl mx-auto" style="letter-spacing:-0.02em;">
 ${esc(d.h1)}
 </h1>
 <p class="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-10">
 ${esc(d.heroSubhead)}
 </p>
 <div class="flex flex-col sm:flex-row gap-4 justify-center">
 <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Get Your VA</a>
 <a href="/industries/real-estate/" class="btn btn-xl btn-secondary">See Pricing</a>
 </div>
 </div>
 </section>

 <!-- STATS BAR -->
 <section class="bg-va-navy py-10 border-b border-white/10">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
 <div class="stat-card">
 <p class="text-va-gold font-black text-3xl" style="letter-spacing:-0.02em;">${esc(marketStatValue)}</p>
 <p class="text-gray-300 text-sm mt-1">${esc(marketStatLabel)}</p>
 </div>
 <div class="stat-card">
 <p class="text-va-gold font-black text-3xl" style="letter-spacing:-0.02em;">800-1k</p>
 <p class="text-gray-300 text-sm mt-1">Dials Per 8-Hour Shift</p>
 </div>
 <div class="stat-card">
 <p class="text-va-gold font-black text-3xl" style="letter-spacing:-0.02em;">8-15%</p>
 <p class="text-gray-300 text-sm mt-1">Typical Contact Rate Range</p>
 </div>
 <div class="stat-card">
 <p class="text-va-gold font-black text-3xl" style="letter-spacing:-0.02em;">48 hrs</p>
 <p class="text-gray-300 text-sm mt-1">Onboarding to First Dial</p>
 </div>
 </div>
 </div>
 </section>

 <!-- WHY THIS MARKET NEEDS COLD CALLING VAS -->
 <section class="py-20 bg-white">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
 <span class="section-label mb-4 inline-flex"><span class="section-label-dot"></span>Market Context</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-6" style="letter-spacing:-0.02em;">
 Why ${esc(d.city)} Wholesalers Need Cold Calling VAs
 </h2>
 <p class="text-va-dark text-lg mb-10 max-w-3xl leading-relaxed">
 ${esc(d.marketIntro)}
 </p>
 <div class="feature-grid">
 ${whyCards(d.whyCards)}
 </div>
 </div>
 </section>

 <!-- HOW IT WORKS -->
 <section class="py-20 bg-va-smoke border-t border-va-divider">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
 <span class="section-label mb-4 inline-flex"><span class="section-label-dot"></span>Process</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-12 text-center" style="letter-spacing:-0.02em;">How VA Horizon Works</h2>
 <div class="grid md:grid-cols-3 gap-8">
 <div class="step-card">
 <div class="step-number">1</div>
 <h3 class="font-montserrat font-black text-va-navy text-lg mb-3" style="letter-spacing:-0.02em;">Hire</h3>
 <p class="text-va-dark text-sm leading-relaxed">Book a 15-minute intake call. We match you with a pre-vetted Egyptian cold caller with no-accent English and proven real estate wholesaling experience. No interviewing, no sourcing.</p>
 </div>
 <div class="step-card">
 <div class="step-number">2</div>
 <h3 class="font-montserrat font-black text-va-navy text-lg mb-3" style="letter-spacing:-0.02em;">Train &amp; Configure</h3>
 <p class="text-va-dark text-sm leading-relaxed">We configure your HighLevel CRM, build your wholesaling pipeline, load your motivated seller lists, set up the Readymode predictive dialer, and QA your VA's scripts before dial day one.</p>
 </div>
 <div class="step-card">
 <div class="step-number">3</div>
 <h3 class="font-montserrat font-black text-va-navy text-lg mb-3" style="letter-spacing:-0.02em;">Dial</h3>
 <p class="text-va-dark text-sm leading-relaxed">Your VA goes live within 48 to 72 hours. They call, qualify, and submit leads directly into your CRM. You get weekly KPI reports and a performance dashboard, no micromanagement needed.</p>
 </div>
 </div>
 </div>
 </section>

 <!-- WHAT'S INCLUDED -->
 <section class="py-20 bg-white border-t border-va-divider">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
 <span class="section-label mb-4 inline-flex"><span class="section-label-dot"></span>What's Included</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-12 text-center" style="letter-spacing:-0.02em;">Everything Your Pipeline Needs</h2>
 <div class="feature-grid">
 <div class="feature-card">
 <p class="text-va-gold font-bold text-sm uppercase tracking-wider mb-2">Dial Volume</p>
 <p class="text-va-navy font-black text-2xl mb-1" style="letter-spacing:-0.02em;">800+/day</p>
 <p class="text-va-dark text-sm">Readymode predictive dialer, 150&#8211;200 live connections daily</p>
 </div>
 <div class="feature-card">
 <p class="text-va-gold font-bold text-sm uppercase tracking-wider mb-2">Scripts</p>
 <p class="text-va-navy font-black text-2xl mb-1" style="letter-spacing:-0.02em;">Included</p>
 <p class="text-va-dark text-sm">Wholesaling-specific motivated seller scripts and objection handling</p>
 </div>
 <div class="feature-card">
 <p class="text-va-gold font-bold text-sm uppercase tracking-wider mb-2">CRM</p>
 <p class="text-va-navy font-black text-2xl mb-1" style="letter-spacing:-0.02em;">HighLevel</p>
 <p class="text-va-dark text-sm">Fully configured wholesaling pipeline, SMS follow-ups, lead intake automations</p>
 </div>
 <div class="feature-card">
 <p class="text-va-gold font-bold text-sm uppercase tracking-wider mb-2">Reporting</p>
 <p class="text-va-navy font-black text-2xl mb-1" style="letter-spacing:-0.02em;">Weekly</p>
 <p class="text-va-dark text-sm">KPI dashboard covering dials, connections, qualified leads, and pipeline value</p>
 </div>
 <div class="feature-card">
 <p class="text-va-gold font-bold text-sm uppercase tracking-wider mb-2">Guarantee</p>
 <p class="text-va-navy font-black text-2xl mb-1" style="letter-spacing:-0.02em;">30 Leads</p>
 <p class="text-va-dark text-sm">30 qualified leads per month, backed by continued dialing or added caller support</p>
 </div>
 <div class="feature-card">
 <p class="text-va-gold font-bold text-sm uppercase tracking-wider mb-2">Contract</p>
 <p class="text-va-navy font-black text-2xl mb-1" style="letter-spacing:-0.02em;">Month-to-Month</p>
 <p class="text-va-dark text-sm">30-day cancellation notice. No annual lock-in or long-term commitments</p>
 </div>
 </div>
 </div>
 </section>

 <!-- CITY-SPECIFIC MARKET INSIGHTS -->
 <section class="py-20 bg-va-smoke border-t border-va-divider">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
 <span class="section-label mb-4 inline-flex"><span class="section-label-dot"></span>Market Insights</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-8" style="letter-spacing:-0.02em;">${esc(d.city)} Wholesaling Market Breakdown</h2>
 <div class="grid md:grid-cols-2 gap-10">
 <div>
 <h3 class="font-montserrat font-black text-va-navy text-xl mb-4" style="letter-spacing:-0.02em;">Top Target Areas</h3>
 <ul class="space-y-3 text-va-dark text-sm">
 ${targetAreas(d.targetAreas)}
 </ul>
 </div>
 <div>
 <h3 class="font-montserrat font-black text-va-navy text-xl mb-4" style="letter-spacing:-0.02em;">Market Conditions</h3>
 <ul class="space-y-3 text-va-dark text-sm">
 ${marketConditions(d.marketConditions)}
 </ul>
 </div>
 </div>
 </div>
 </section>

 <!-- FAQ -->
 <section class="py-20 bg-white border-t border-va-divider">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
 <span class="section-label mb-4 inline-flex"><span class="section-label-dot"></span>FAQ</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-10 text-center" style="letter-spacing:-0.02em;">Frequently Asked Questions</h2>
 <div class="border border-va-divider rounded-xl overflow-hidden">
 ${faqList(d.faq)}
 </div>
 </div>
 </section>

 <!-- CTA -->
 <section class="py-24 cta-glow text-white text-center">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="w-16 h-1 bg-va-gold mx-auto mb-8 rounded-full"></div>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-4" style="letter-spacing:-0.02em;">Start Getting Deals in ${esc(d.city)}</h2>
 <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Book a 15-minute call. We'll show you exactly what your VA will be doing in the ${esc(d.city)} market from day one: dial volume, CRM setup, script approach, and what qualified leads look like.</p>
 <div class="flex flex-col sm:flex-row gap-6 justify-center">
 <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 <a href="/case-studies/" class="btn btn-xl btn-secondary">See Client Results</a>
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
