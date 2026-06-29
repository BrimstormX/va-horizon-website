// Locations hub (/locations/) template: full location record set -> hub HTML document.
// Renders a dark hero + dot-grid, stats bar, city grid, and CTA.
// Visible breadcrumb + VAH_INTERNAL_LINKS block are added by the post-processor.
import { head } from '../partials/head.mjs';
import { nav } from '../partials/nav.mjs';
import { footer } from '../partials/footer.mjs';
import { esc, jsonLd, SITE_ORIGIN } from '../lib/html.mjs';

const CANONICAL = `${SITE_ORIGIN}/locations/`;

const STYLE_BLOCK = ` html,
 body {
 overflow-x: hidden;
 width: 100%;
 }
 .hero-lochub {
 background: #071e35;
 position: relative;
 overflow: hidden;
 }
 .hero-lochub::before {
 content: '';
 position: absolute;
 inset: 0;
 background:
 radial-gradient(ellipse 900px 600px at 110% 50%, rgba(212,160,47,0.13) 0%, transparent 65%),
 radial-gradient(ellipse 600px 800px at -10% 60%, rgba(8,37,65,0.62) 0%, transparent 70%);
 pointer-events: none;
 }
 .hero-lochub::after {
 content: '';
 position: absolute;
 inset: 0;
 background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
 background-size: 28px 28px;
 pointer-events: none;
 }
 .hero-lochub-inner { position: relative; z-index: 2; }
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
 .loc-card {
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
 .loc-card::before {
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
 .loc-card:hover { border-color: rgba(212,160,47,0.6); box-shadow: 0 16px 38px rgba(8,37,65,0.1); transform: translateY(-4px); }
 .loc-card:hover::before { transform: scaleX(1); }
 .loc-city {
 display: block;
 font-weight: 900;
 color: #082541;
 letter-spacing: -0.02em;
 line-height: 1.25;
 font-size: 1.05rem;
 }
 .loc-state {
 display: block;
 color: rgba(8,37,65,0.55);
 font-size: 0.8rem;
 font-weight: 700;
 text-transform: uppercase;
 letter-spacing: 0.08em;
 margin-top: 0.35rem;
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
        '@type': 'CollectionPage',
        '@id': CANONICAL,
        name: 'Cold Calling VA Markets | VA Horizon',
        description: 'Browse VA Horizon cold calling VA coverage across US real estate wholesaling markets. Find your city and see market-specific resources.',
        url: CANONICAL,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: records.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `${r.city}, ${r.state}`,
            url: `${SITE_ORIGIN}/locations/${r.slug}/`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Real Estate VAs', item: `${SITE_ORIGIN}/industries/real-estate/` },
          { '@type': 'ListItem', position: 3, name: 'Cold Calling VA Markets', item: CANONICAL },
        ],
      },
    ],
  });
}

function groupByState(records) {
  const groups = new Map();
  for (const r of records) {
    const key = r.state;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  for (const list of groups.values()) list.sort((a, b) => a.city.localeCompare(b.city));
  return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function locCard(r) {
  return `<a href="/locations/${esc(r.slug)}/" class="loc-card">
 <span class="loc-city">${esc(r.city)}</span>
 <span class="loc-state">${esc(r.state)}</span>
 </a>`;
}

export function renderLocationsHub(records) {
  const title = 'Cold Calling VA Markets: US Cities Served | VA Horizon';
  const description = `VA Horizon places trained cold calling VAs in ${records.length}+ US real estate wholesaling markets. Find your city for market-specific resources, target areas, and onboarding details.`;

  const headHtml = head({
    title,
    description,
    canonical: CANONICAL,
    styleBlock: STYLE_BLOCK,
    schema: buildSchema(records),
  });

  const stateGroups = groupByState(records).map(([state, list]) => `<div class="mb-12">
 <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
 <div>
 <span class="section-label mb-3 inline-flex"><span class="section-label-dot"></span>${esc(state)}</span>
 <h2 class="font-montserrat font-black text-2xl lg:text-3xl text-va-navy" style="letter-spacing:-0.02em;">${esc(state)} markets</h2>
 </div>
 <p class="text-sm font-bold uppercase tracking-[0.12em] text-va-dark/50">${list.length} ${list.length === 1 ? 'city' : 'cities'}</p>
 </div>
 <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 ${list.map(locCard).join('\n ')}
 </div>
 </div>`).join('\n ');

  const body = `<body class="bg-white font-montserrat">
<div id="container">
<div class="tailwind">

 ${nav}

 <main id="main">

 <!-- HERO -->
 <section class="hero-lochub py-24 lg:py-36">
 <div class="hero-lochub-inner container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="max-w-5xl mx-auto text-center">
 <span class="section-label dark-label mb-6 inline-flex fade-up"><span class="section-label-dot"></span> Cold Calling VA Markets</span>
 <h1 class="font-montserrat text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight fade-up delay-1" style="letter-spacing:-0.02em; text-wrap: balance;">
 US Real Estate Wholesaling Markets
 </h1>
 <p class="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10 fade-up delay-2">VA Horizon places trained cold calling VAs across ${records.length}+ US markets. Each market page covers local target areas, active zip codes, and the deal dynamics that shape your calling strategy.</p>
 <div class="flex flex-col sm:flex-row gap-4 justify-center fade-up delay-3">
 <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">Book a Free Strategy Call</a>
 <a href="/industries/real-estate/" class="btn btn-xl btn-secondary">See Real Estate VA Services</a>
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
 <div class="stat-label">Markets Covered</div>
 </div>
 <div class="stat-item">
 <div class="stat-num">800<span>-</span>1k</div>
 <div class="stat-label">Dials Per Shift</div>
 </div>
 <div class="stat-item">
 <div class="stat-num">48<span>h</span></div>
 <div class="stat-label">Onboarding to First Dial</div>
 </div>
 <div class="stat-item">
 <div class="stat-num">30<span>+</span></div>
 <div class="stat-label">Qualified Leads Guaranteed</div>
 </div>
 </div>
 </div>
 </div>

 <!-- MARKET GRID -->
 <section class="py-20 bg-va-smoke">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
 <div class="max-w-3xl mb-12">
 <span class="section-label mb-4 inline-flex"><span class="section-label-dot"></span> Market Directory</span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl text-va-navy mb-4" style="letter-spacing:-0.02em;">Find your market</h2>
 <p class="text-va-dark/75 text-lg leading-relaxed">Each city page covers local zip codes, target neighborhoods, market conditions, and the calling approach that fits your deal strategy. Select your market to see the details.</p>
 </div>
 ${stateGroups}
 </div>
 </section>

 <!-- CTA -->
 <section class="py-24 cta-section text-white text-center">
 <div class="cta-inner container mx-auto px-4 sm:px-6 lg:px-8">
 <span class="gold-rule mx-auto mb-8"></span>
 <h2 class="font-montserrat font-black text-3xl lg:text-4xl mb-4" style="letter-spacing:-0.02em;">Your market is ready. Start dialing.</h2>
 <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Book a 15-minute call and we will match you with a pre-vetted cold caller who knows your market, configure HighLevel, and have your VA dialing within 48 hours.</p>
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
