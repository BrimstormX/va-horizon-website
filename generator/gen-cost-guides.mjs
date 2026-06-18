// One-shot generator for Batch 5b: 5 cost/MAO guide pages.
// Mirrors the existing /guides/ template (head, nav, footer, prose, <details> FAQ).
// Run: node generator/gen-cost-guides.mjs   then: npm run internal-links && node scripts/build-site.mjs
import { promises as fs } from 'fs';
import path from 'path';

const ORIGIN = 'https://www.vahorizon.site';
const TODAY = '2026-06-17';
const ROOT = process.cwd();

const NAV = `<header id="main-nav" class="site-header fixed top-0 w-full z-[100] bg-[#071e35] shadow-sm border-b border-white/10 py-4">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="flex items-center justify-between">
 <div class="flex items-center">
 <a href="/" class="flex items-center space-x-2">
 <img src="/logo.png" alt="VA Horizon logo" width="90" height="57" fetchpriority="high">
 <div class="flex flex-col items-start leading-none">
 <img src="/va-horizon.png" alt="VA Horizon" width="200" height="22">
 <img src="/tagline.png" alt="Trained Virtual Assistants" width="250" height="12" class="mt-1">
 </div>
 </a>
 </div>
 <nav class="nav hidden md:flex items-center gap-8 whitespace-nowrap" aria-label="Main navigation">
 <a href="/services/" class="text-white hover:text-va-gold font-medium transition-colors">Services</a>
 <a href="/case-studies/" class="text-white hover:text-va-gold font-medium transition-colors">Case Studies</a>
 <a href="/blog/" class="text-white hover:text-va-gold font-medium transition-colors">Blog</a>
 <a href="/guides/" class="text-white hover:text-va-gold font-medium transition-colors">Guides</a>
 <a href="/ai-automations/" class="text-white hover:text-va-gold font-medium transition-colors">SMS &amp; Automations</a>
 <a href="/tools/" class="text-white hover:text-va-gold font-medium transition-colors">Tools</a>
 <a href="/pricing/" class="text-white hover:text-va-gold font-medium transition-colors">Pricing</a>
 </nav>
 <div class="hidden md:flex ml-8 mr-8">
 <a href="https://calendly.com/youssef-vahorizon/30min" target="_blank" rel="noopener noreferrer" data-slot="button" class="btn btn-lg btn-primary">Book a Call Today</a>
 </div>
 <div class="md:hidden">
 <button aria-label="Menu" aria-controls="mobile-menu" aria-expanded="false" data-slot="button" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all h-8 rounded-md gap-1.5 px-3 text-white hover:text-va-gold">
 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16"></path><path d="M4 18h16"></path><path d="M4 6h16"></path></svg>
 </button>
 </div>
 </div>
 </div>
</header>
<div id="mobile-menu" role="dialog" aria-label="Mobile menu"></div>`;

const FOOTER = `<footer class="bg-va-navy text-white border-t border-white/10">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
  <div class="py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
   <div>
    <div class="flex items-center justify-start mb-4 space-x-2">
     <img src="/logo.png" alt="VA Horizon logo" width="90" height="57" loading="lazy">
     <div class="flex flex-col items-start leading-none">
      <img src="/va-horizon.png" alt="VA Horizon" width="200" height="22" loading="lazy">
      <img src="/tagline.png" alt="Trained Virtual Assistants" width="250" height="12" class="mt-1" loading="lazy">
     </div>
    </div>
    <p class="text-gray-300 leading-relaxed text-sm">VA Horizon provides virtual assistant services for real-estate wholesalers.</p>
    <div class="mt-5 flex items-center gap-3" aria-label="Social links">
     <a href="https://www.linkedin.com/company/vahorizon" target="_blank" rel="noopener noreferrer" aria-label="VA Horizon on LinkedIn" class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-gray-300 transition-colors hover:border-va-gold hover:text-va-gold">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.1 20.45H3.54V9H7.1v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"></path></svg>
     </a>
    </div>
   </div>
   <div>
    <h4 class="font-semibold mb-4"><a href="/services/" class="text-va-gold hover:text-white transition-colors">Services</a></h4>
    <ul class="space-y-3 text-sm text-gray-300">
     <li><a href="/industries/real-estate/" class="hover:text-va-gold transition-colors">Cold Calling VAs</a></li>
     <li><a href="/ai-automations/" class="hover:text-va-gold transition-colors">SMS &amp; Automations</a></li>
     <li><a href="/crm/" class="hover:text-va-gold transition-colors">CRM</a></li>
     <li><a href="/pricing/" class="hover:text-va-gold transition-colors">Pricing</a></li>
     <li><a href="/case-studies/" class="hover:text-va-gold transition-colors">Case Studies</a></li>
     <li><a href="/apply/" class="hover:text-va-gold transition-colors text-va-gold font-bold">Apply</a></li>
    </ul>
   </div>
   <div>
    <h4 class="font-semibold mb-4 text-va-gold">Contact</h4>
    <ul class="space-y-3 text-sm text-gray-300">
     <li><a href="mailto:youssef@vahorizon.site" class="hover:text-va-gold transition-colors">youssef@vahorizon.site</a></li>
     <li><a href="mailto:malak@vahorizon.site" class="hover:text-va-gold transition-colors">malak@vahorizon.site</a></li>
     <li><a href="tel:+15125805821" class="hover:text-va-gold transition-colors">+1 (512) 580-5821</a></li>
    </ul>
   </div>
   <div>
    <h4 class="font-semibold mb-4 text-va-gold">Legal</h4>
    <ul class="space-y-3 text-sm text-gray-300">
     <li><a href="/terms/" class="hover:text-va-gold transition-colors">Terms of Service</a></li>
     <li><a href="/privacy/" class="hover:text-va-gold transition-colors">Privacy Policy</a></li>
     <li><a href="/refund-policy/" class="hover:text-va-gold transition-colors">Return Policy</a></li>
    </ul>
   </div>
  </div>
  <div class="border-t border-gray-600 py-8 text-gray-400 text-sm">
   <div class="flex flex-col lg:flex-row justify-between gap-4">
    <p>&copy; 2026 VA Horizon LLC. All rights reserved.</p>
    <p class="max-w-3xl lg:text-right">By contacting us you agree to our <a href="/terms/" class="hover:text-va-gold transition-colors text-gray-300">Terms</a>. Your payment information is securely processed through Stripe and is never stored on our servers.</p>
   </div>
  </div>
 </div>
</footer>`;

const STYLE = `<style>
 .prose h2 { font-size: 1.75rem; font-weight: 800; color: #082541; margin-top: 2.5rem; margin-bottom: 1rem; }
 .prose h3 { font-size: 1.25rem; font-weight: 700; color: #082541; margin-top: 1.75rem; margin-bottom: 0.75rem; }
 .prose p { color: rgba(26,26,26,0.85); line-height: 1.8; margin-bottom: 1.25rem; font-size: 1.05rem; }
 .prose ul, .prose ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
 .prose ul li, .prose ol li { color: rgba(26,26,26,0.85); line-height: 1.8; margin-bottom: 0.5rem; font-size: 1.05rem; }
 .prose ul li { list-style-type: disc; }
 .prose ol li { list-style-type: decimal; }
 .prose a { color: #C5A059; font-weight: 600; }
 .prose a:hover { text-decoration: underline; }
 .callout-box { background: rgba(197,160,89,0.08); border-left: 4px solid #C5A059; padding: 1.25rem 1.5rem; border-radius: 0 0.75rem 0.75rem 0; margin: 1.5rem 0; }
 .callout-box p { margin-bottom: 0.4rem; }
 .stat-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 1rem; padding: 1.5rem; text-align: center; }
 .hub-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 1rem; padding: 1.25rem; transition: box-shadow 0.2s; }
 .hub-card:hover { box-shadow: 0 4px 20px rgba(8,37,65,0.1); }
 .bench-table { border-collapse: collapse; width: 100%; }
 .bench-table th { background: #082541; color: #fff; padding: 0.75rem 1rem; text-align: left; font-weight: 700; font-size: 0.9rem; }
 .bench-table td { padding: 0.65rem 1rem; border-bottom: 1px solid #E2E8F0; font-size: 0.95rem; color: rgba(26,26,26,0.85); }
 .bench-table tr:nth-child(even) td { background: #F8F9FA; }
 .bench-table td:first-child { font-weight: 700; color: #082541; }
</style>`;

function faqHtml(faq) {
  return faq.map(f => `<details class="bg-white group">
 <summary class="cursor-pointer font-semibold text-va-navy p-5 hover:bg-va-smoke transition-colors list-none flex items-center justify-between">${f.q}<span class="text-va-gold text-xl leading-none select-none">+</span></summary>
 <div class="px-5 pb-5 text-va-dark text-sm leading-relaxed">${f.a}</div>
</details>`).join('\n');
}

function relatedHtml(items) {
  return items.map(r => `<a href="${r.href}" class="hub-card block"><p class="text-xs text-va-gold font-bold uppercase tracking-wide mb-2">${r.tag}</p><p class="font-bold text-va-navy text-sm leading-snug mb-2">${r.title}</p><p class="text-xs text-va-dark/70">${r.desc}</p></a>`).join('\n');
}

function statsHtml(stats) {
  return stats.map(s => `<div class="stat-card"><div class="text-va-gold text-3xl font-black mb-1" style="letter-spacing:-0.02em;">${s.n}</div><div class="text-gray-300 text-sm font-medium">${s.l}</div></div>`).join('\n');
}

function buildPage(d) {
  const url = `${ORIGIN}/guides/${d.slug}/`;
  const graph = [
    {
      "@type": "Article",
      "headline": d.h1,
      "description": d.description,
      "url": url,
      "datePublished": TODAY,
      "dateModified": TODAY,
      "author": { "@type": "Person", "name": "Youssef Ahmed", "jobTitle": "Founder, VA Horizon", "url": ORIGIN + "/about/" },
      "publisher": { "@type": "Organization", "@id": ORIGIN + "/#organization", "name": "VA Horizon", "url": ORIGIN + "/", "logo": { "@type": "ImageObject", "url": ORIGIN + "/logo.png" } },
      "image": ORIGIN + "/social/va-horizon-og.png",
      "articleSection": "Real Estate Wholesaling"
    }
  ];
  if (d.howto) {
    graph.push({
      "@type": "HowTo",
      "name": d.howto.name,
      "description": d.howto.description,
      "step": d.howto.steps.map((s, i) => ({ "@type": "HowToStep", "position": i + 1, "name": s.name, "text": s.text }))
    });
  }
  graph.push({
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": ORIGIN + "/" },
      { "@type": "ListItem", "position": 2, "name": "Guides", "item": ORIGIN + "/guides/" },
      { "@type": "ListItem", "position": 3, "name": d.crumb, "item": url }
    ]
  });
  graph.push({
    "@type": "FAQPage",
    "mainEntity": d.faq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a.replace(/<[^>]+>/g, '') } }))
  });
  const jsonld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 1);

  return `<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <title>${d.title}</title>
 <meta name="description" content="${d.description}">
 <link rel="canonical" href="${url}">
 <meta property="og:title" content="${d.title}">
 <meta property="og:description" content="${d.description}">
 <meta property="og:url" content="${url}">
 <meta property="og:type" content="article">
 <meta property="og:image" content="${ORIGIN}/social/va-horizon-og.png">
 <meta name="twitter:card" content="summary_large_image">
 <meta name="twitter:title" content="${d.title}">
 <meta name="twitter:description" content="${d.description}">
 <meta name="twitter:image" content="${ORIGIN}/social/va-horizon-og.png">
 <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
 <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
 <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png">
 <link rel="stylesheet" href="/fonts.css">
 <link rel="stylesheet" href="/VAHorizonWebsiteStyle/_components/v1/93bdfffda6e0bf9a7fd91429ea912af65458e738.css?v=3">
 <link rel="stylesheet" href="/cards.css?v=3">
 <link rel="stylesheet" href="/css/va-custom.css?v=navfix-20260525">
 <link rel="stylesheet" href="/css/tailwind.min.css">
 ${STYLE}
 <script type="application/ld+json">
${jsonld}
 </script>
</head>
<body class="bg-white font-montserrat">
<div id="container">
<div class="tailwind">
${NAV}
<main id="main">
<!-- VAH_BREADCRUMB_START -->
<div class="bg-[#F6F1E8] border-y border-[#e8e4dc] py-3">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <nav class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em]" aria-label="Breadcrumb">
      <a href="/" class="font-bold text-va-navy/75 transition-colors hover:text-va-gold">Home</a>
      <span class="text-va-gold font-black">/</span>
      <a href="/guides/" class="font-bold text-va-navy/75 transition-colors hover:text-va-gold">Guides</a>
      <span class="text-va-gold font-black">/</span>
      <span class="inline-flex max-w-full items-center whitespace-normal break-words rounded-full border border-va-gold/30 bg-white px-3 py-1 font-extrabold text-va-navy shadow-sm">${d.crumb}</span>
    </nav>
  </div>
</div>
<!-- VAH_BREADCRUMB_END -->
 <section style="background: linear-gradient(135deg, #082541 0%, #0a2e52 100%);" class="py-16 lg:py-24">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
 <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-va-gold/20 text-va-gold border border-va-gold/30 mb-6 tracking-wide uppercase">${d.heroLabel}</span>
 <h1 class="font-montserrat text-3xl lg:text-5xl font-black text-white mb-6 leading-tight" style="letter-spacing:-0.02em;">${d.h1}</h1>
 <div class="flex items-center gap-4 text-gray-400 text-sm flex-wrap"><span>By Youssef Ahmed</span><span>&bull;</span><span>June 2026</span><span>&bull;</span><span>VA Horizon</span></div>
 </div>
 </section>
 <section style="background: #071e35;" class="py-8 border-b border-white/10">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
 <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
${statsHtml(d.stats)}
 </div>
 </div>
 </section>
 <section class="py-16">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
 <div class="bg-va-navy/5 border border-va-navy/10 rounded-2xl p-6 mb-10">
 <h2 class="text-lg font-extrabold text-va-navy mb-3">Quick answer</h2>
 <p class="text-va-dark text-sm leading-relaxed">${d.answer}</p>
 </div>
 <div class="prose max-w-none">
${d.body}
 </div>
 </div>
 </section>
 <section class="py-16 bg-white border-t border-va-divider" id="faq">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
 <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-va-gold/20 text-va-gold border border-va-gold/30 mb-4 tracking-wide uppercase">FAQ</span>
 <h2 class="text-2xl font-extrabold text-va-navy mb-8" style="letter-spacing:-0.02em;">Frequently Asked Questions</h2>
 <div class="divide-y divide-va-divider border border-va-divider rounded-xl overflow-hidden">
${faqHtml(d.faq)}
 </div>
 </div>
 </section>
 <section class="py-16 bg-va-smoke border-t border-va-divider">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
 <h2 class="text-2xl font-extrabold text-va-navy mb-8" style="letter-spacing:-0.02em;">Related Reading</h2>
 <div class="grid md:grid-cols-3 gap-6">
${relatedHtml(d.related)}
 </div>
 </div>
 </section>
 <section class="py-24 bg-va-navy text-white text-center">
 <div class="container mx-auto px-4 sm:px-6 lg:px-8">
 <h2 class="text-3xl lg:text-4xl font-extrabold mb-4" style="letter-spacing:-0.02em;">${d.cta.h}</h2>
 <p class="text-gray-300 text-xl mb-10 max-w-2xl mx-auto">${d.cta.p}</p>
 <div class="flex flex-col sm:flex-row gap-6 justify-center">
 <a href="/apply/" class="btn btn-xl btn-primary">Apply Now</a>
 <a href="/pricing/" class="btn btn-xl btn-secondary">View Pricing</a>
 </div>
 </div>
 </section>
<!-- VAH_INTERNAL_LINKS_START --><!-- VAH_INTERNAL_LINKS_END -->
</main>
${FOOTER}
</div>
</div>
<script src="/buttons.js" defer></script>
</body>
</html>
`;
}

const guides = [
  {
    slug: 'real-estate-cold-calling-va-cost',
    title: 'How Much Does a Real Estate Cold Calling VA Cost? (2026) | VA Horizon',
    description: 'Real estate cold calling VA cost in 2026: freelance rates, agency all-in pricing, and the hidden costs most operators miss. VA Horizon is $1,160 per month all-in.',
    heroLabel: 'Cost Guide',
    h1: 'How Much Does a Real Estate Cold Calling VA Cost?',
    crumb: 'Real Estate Cold Calling VA Cost',
    answer: 'A real estate cold calling VA costs roughly $5 to $15 per hour as a freelancer, or about $1,000 to $1,160 per month all-in through a managed agency. VA Horizon charges $1,160 per month for one cold calling VA ($960 for the VA plus $200 for the Readymode dialer) and $1,000 per month per VA at three or more seats. That managed price includes the dialer, HighLevel CRM buildout, skip tracing coordination, weekly QA, and a 30 qualified leads per month guarantee, which a raw freelance hourly rate does not.',
    stats: [{n:'$1,160',l:'All-In, 1 VA / Mo'},{n:'$1,000',l:'Per VA at 3+ Seats'},{n:'30+',l:'Leads Guaranteed / Mo'},{n:'48h',l:'Onboarding'}],
    body: `<h2 id="what-drives-cost">What actually drives the cost of a cold calling VA</h2>
<p>The hourly rate is the number most wholesalers fixate on, and it is the least useful. A cold calling VA only produces deals when four other things are in place: a quality skip-traced list, a predictive dialer, a CRM that captures and follows up on every lead, and someone reviewing call quality. When you compare prices, you are really comparing how much of that stack is included and how much you have to build and manage yourself.</p>
<p>There are three common ways to hire, and they price very differently once you account for the full stack.</p>
<h2 id="three-models">Freelance vs agency vs in-house: the real numbers</h2>
<table class="bench-table my-6"><thead><tr><th>Model</th><th>Headline Price</th><th>What You Still Pay For</th><th>Practical All-In</th></tr></thead><tbody>
<tr><td>Freelance VA (Upwork, OnlineJobs)</td><td>$5 to $15 / hr</td><td>Dialer, CRM, list and skip tracing, training, management, no guarantee</td><td>$1,300 to $2,000+ / mo</td></tr>
<tr><td>Managed agency (VA Horizon)</td><td>$1,160 / mo (1 VA)</td><td>Nothing extra: dialer, CRM, QA, and guarantee are included</td><td>$1,160 / mo, or $1,000 each at 3+</td></tr>
<tr><td>In-house US cold caller</td><td>$3,500 to $5,500 / mo</td><td>Payroll tax, benefits, desk, dialer, software, management time</td><td>$4,500 to $6,500 / mo</td></tr>
</tbody></table>
<p>A freelance VA at $6 per hour for 160 hours is $960 per month, which looks cheaper than an agency until you add the things a freelancer cannot provide. A single operator usually cannot meet the <a href="/glossary/predictive-dialer/">predictive dialer</a> seat minimum, so the freelancer dials manually at a fraction of the volume. You buy the CRM, build the pipeline, source the lists, scrub them, train the caller, and review the calls yourself. If the freelancer quits, you start over.</p>
<h2 id="hidden-costs">The hidden costs of the cheap option</h2>
<p>The reason a $6 per hour freelancer often costs more than a managed VA is that the cheap line item creates expensive gaps:</p>
<ul>
<li><strong>Dialer access:</strong> Readymode requires a 3 to 5 seat minimum, so a solo freelancer cannot get on it. Manual or single-line dialing produces a fraction of the 800 to 1,000 dials per 8 hour shift a managed VA hits.</li>
<li><strong>Your time:</strong> Every hour you spend pulling lists, scrubbing numbers, fixing the CRM, and reviewing calls is an hour you are not spending on offers and closings.</li>
<li><strong>Turnover:</strong> A freelancer who leaves takes your training with them. A managed placement is backed by a replacement process.</li>
<li><strong>No accountability:</strong> Nobody guarantees output on a freelance hire. VA Horizon guarantees a minimum of 30 qualified leads per month per cold calling engagement.</li>
</ul>
<div class="callout-box"><p class="font-bold text-va-navy">What is included in the $1,160</p><p class="text-sm">One trained Egyptian cold calling VA with no-accent-fluent English and prior real estate cold calling experience, the Readymode predictive dialer, HighLevel CRM buildout, list sourcing coordination, skip tracing workflow, weekly call QA, and the 30 qualified leads per month guarantee. See the full breakdown on the <a href="/pricing/">pricing page</a>.</p></div>
<h2 id="when-each-makes-sense">When each option makes sense</h2>
<p>Dialing yourself makes sense at the very start, when you have no budget and need to learn the script. A freelancer can work if you already own the dialer seats, the CRM, and the time to manage them. A managed agency makes sense when you want consistent output without becoming the operations manager, which is the position most wholesalers actually want to be in. For a direct head-to-head, see <a href="/compare/va-horizon-vs-freelancer/">VA Horizon vs hiring a freelancer</a>, and to size a full team see the <a href="/services/wholesaling-virtual-assistant/">wholesaling virtual assistant</a> roles.</p>`,
    faq: [
      {q:'How much does a real estate cold calling VA cost per month?',a:'Through VA Horizon, one cold calling VA is $1,160 per month all-in, made up of $960 for the VA and $200 for the Readymode dialer. At three or more VAs the price drops to $1,000 per month per VA. Freelance VAs advertise $5 to $15 per hour, but that rate excludes the dialer, CRM, lists, QA, and any guarantee.'},
      {q:'Why is an agency VA sometimes cheaper than a freelancer?',a:'Because the headline freelance rate excludes the dialer, CRM, list sourcing, skip tracing, management time, and replacement coverage. Once you add those, a freelance setup commonly runs $1,300 to $2,000 or more per month, while VA Horizon includes all of it for $1,160.'},
      {q:'Is there a setup fee or contract?',a:'VA Horizon cold calling placements have no setup fee and are month to month with 30 days notice to cancel. SMS campaigns are priced separately and do carry a one-time setup fee.'},
      {q:'What does the $200 dialer cost cover?',a:'It covers the Readymode predictive dialer seat. Readymode requires a 3 to 5 seat minimum that individual operators cannot meet on their own, so agency access is one of the main reasons wholesalers use a managed VA instead of hiring freelance.'},
      {q:'How many leads will the VA produce for the cost?',a:'Each cold calling engagement includes a minimum of 30 qualified leads per month. If that target is missed, VA Horizon keeps dialing at no extra charge until it is reached, or adds support inside the original timeframe.'}
    ],
    related: [
      {tag:'Pricing',title:'VA Horizon Pricing',desc:'Transparent monthly pricing for VAs, managers, and SMS',href:'/pricing/'},
      {tag:'Compare',title:'VA Horizon vs Freelancer',desc:'Managed VA vs hiring a cold caller on Upwork or OnlineJobs',href:'/compare/va-horizon-vs-freelancer/'},
      {tag:'Service',title:'Cold Calling VAs',desc:'How VA Horizon places and manages cold calling VAs',href:'/services/cold-calling/'}
    ],
    cta: {h:'Want a trained cold caller without building the stack yourself?',p:'Get a VA, Readymode dialer, and HighLevel CRM set up and calling within 48 to 72 hours, with 30 qualified leads per month guaranteed.'}
  },
  {
    slug: 'real-estate-virtual-assistant-cost',
    title: 'How Much Does a Real Estate Virtual Assistant Cost? (2026) | VA Horizon',
    description: 'Real estate virtual assistant cost by role in 2026: cold callers, acquisition managers, disposition managers, and lead managers. Transparent monthly VA Horizon pricing.',
    heroLabel: 'Cost Guide',
    h1: 'How Much Does a Real Estate Virtual Assistant Cost?',
    crumb: 'Real Estate Virtual Assistant Cost',
    answer: 'Real estate virtual assistant cost depends on the role. Through VA Horizon, a cold calling VA is $1,160 per month all-in (or $1,000 each at three or more), an acquisition manager or disposition manager is $1,440 per month, and a lead manager is $1,120 per month. Every price includes HighLevel CRM buildout and managed QA. The same roles hired in-house in the United States typically cost three to five times more once salary, benefits, and software are included.',
    stats: [{n:'$1,000+',l:'Cold Caller / Mo'},{n:'$1,440',l:'Acq or Dispo Mgr / Mo'},{n:'$1,120',l:'Lead Manager / Mo'},{n:'GHL',l:'CRM Included'}],
    body: `<h2 id="cost-by-role">Real estate VA cost by role</h2>
<p>There is no single price for a real estate virtual assistant because the role defines the cost. A cold caller who dials lists all day is priced differently from an acquisition manager who runs comps, makes offers, and negotiates contracts. Here is what each role costs through VA Horizon, all-in and month to month.</p>
<table class="bench-table my-6"><thead><tr><th>Role</th><th>VA Horizon Price / Mo</th><th>What They Do</th><th>US In-House Equivalent</th></tr></thead><tbody>
<tr><td>Cold Calling VA (1 seat)</td><td>$1,160</td><td>Calls lists, qualifies sellers, submits leads</td><td>$3,500 to $5,500 / mo</td></tr>
<tr><td>Cold Calling VA (3+ seats)</td><td>$1,000 each</td><td>Same role at team pricing</td><td>$3,500 to $5,500 / mo each</td></tr>
<tr><td>Acquisition Manager</td><td>$1,440</td><td>Re-qualifies, comps, offers, negotiates, closes</td><td>$3,500 to $6,000 / mo or $60k to $80k / yr</td></tr>
<tr><td>Disposition Manager</td><td>$1,440</td><td>Builds buyers list, markets contracts</td><td>$3,500 to $6,000 / mo</td></tr>
<tr><td>Lead Manager</td><td>$1,120</td><td>Warms and re-qualifies leads for the senior closer</td><td>$2,500 to $4,000 / mo</td></tr>
</tbody></table>
<h2 id="whats-included">What is included at every price</h2>
<p>The monthly price is not just labor. Every VA Horizon placement includes the HighLevel CRM built and configured for wholesaling, managed performance and weekly QA, and onboarding inside 48 to 72 hours. Cold calling seats also include the Readymode predictive dialer, which individual operators cannot access on their own because of the 3 to 5 seat minimum.</p>
<h2 id="how-to-budget">How to budget as you scale</h2>
<p>Most operations do not hire every role at once. The common path is one cold caller first, then three cold callers when lead volume justifies the team discount, then an <a href="/guides/acquisition-manager-salary-cost/">acquisition manager</a> to close the volume, then a <a href="/guides/disposition-manager-salary-cost/">disposition manager</a> to move contracts faster. A lead manager is added when one acquisition manager can no longer keep up with qualified lead flow.</p>
<p>For the detailed cost of each role, see the dedicated guides: <a href="/guides/real-estate-cold-calling-va-cost/">cold calling VA cost</a>, <a href="/guides/acquisition-manager-salary-cost/">acquisition manager salary and cost</a>, and <a href="/guides/disposition-manager-salary-cost/">disposition manager salary and cost</a>. To map roles to your stage, see the <a href="/services/wholesaling-virtual-assistant/">wholesaling virtual assistant</a> hub.</p>
<div class="callout-box"><p class="font-bold text-va-navy">The team-pricing tipping point</p><p class="text-sm">The cold calling discount starts at three seats ($1,000 each instead of $1,160), which is also the minimum for Readymode access. Three callers on a predictive dialer generate enough qualified leads that one acquisition manager becomes the next logical hire.</p></div>`,
    faq: [
      {q:'How much does a real estate virtual assistant cost?',a:'It depends on the role. Through VA Horizon a cold calling VA is $1,160 per month (or $1,000 each at three or more seats), an acquisition or disposition manager is $1,440 per month, and a lead manager is $1,120 per month. All prices include HighLevel CRM buildout and managed QA.'},
      {q:'Is real estate VA pricing different for teams?',a:'Yes. Cold calling VAs drop from $1,160 to $1,000 per month per VA once you reach three or more seats. The three-seat point is also the minimum for Readymode dialer access.'},
      {q:'Why are VA Horizon VAs cheaper than US hires?',a:'VA Horizon sources trained Egyptian VAs with no-accent-fluent English. The same roles hired in-house in the United States carry US salaries, payroll taxes, benefits, and software costs, which typically run three to five times higher for comparable output.'},
      {q:'Do all roles include the CRM?',a:'Yes. HighLevel CRM buildout is included at no extra cost on every placement, including pipeline stages, lead tags, shared inbox, and SMS follow-up.'},
      {q:'Which role should I hire first?',a:'Most wholesalers start with one cold calling VA, then scale to three, then add an acquisition manager once qualified lead volume outpaces their own capacity to close.'}
    ],
    related: [
      {tag:'Pricing',title:'VA Horizon Pricing',desc:'Full monthly pricing for every role',href:'/pricing/'},
      {tag:'Service',title:'Wholesaling Virtual Assistant',desc:'Choose the right role for your pipeline stage',href:'/services/wholesaling-virtual-assistant/'},
      {tag:'Cost',title:'Cold Calling VA Cost',desc:'The detailed cost of a cold calling VA',href:'/guides/real-estate-cold-calling-va-cost/'}
    ],
    cta: {h:'Build the right team for your stage, not a generic VA.',p:'VA Horizon places cold callers, acquisition managers, disposition managers, and lead managers with the CRM and dialer included.'}
  },
  {
    slug: 'acquisition-manager-salary-cost',
    title: 'Real Estate Acquisitions Manager Salary and Cost (2026) | VA Horizon',
    description: 'What a real estate acquisitions manager costs in 2026: US salary ranges versus a trained VA Horizon acquisition manager at $1,440 per month. Hiring criteria included.',
    heroLabel: 'Cost Guide',
    h1: 'Real Estate Acquisitions Manager Salary and Cost',
    crumb: 'Acquisitions Manager Salary and Cost',
    answer: 'A US-based real estate acquisitions manager typically costs $3,500 to $6,000 per month, or $60,000 to $80,000 per year as a W2 employee once benefits are included, and many are paid base plus commission. A trained VA Horizon acquisition manager is $1,440 per month with no payroll tax or benefits overhead. VA Horizon only places acquisition managers who have at least one year of cold calling experience, six or more months of vetted acquisition management experience, and a minimum of two closed deals.',
    stats: [{n:'$1,440',l:'VA Horizon AM / Mo'},{n:'$60-80k',l:'US W2 / Yr'},{n:'2+',l:'Closed Deals Required'},{n:'1 yr',l:'Cold Calling Required'}],
    body: `<h2 id="what-an-am-costs">What an acquisitions manager costs</h2>
<p>An acquisition manager is the person who turns qualified leads into signed contracts. They re-qualify the lead, build rapport, run comps, present offers, negotiate, and follow up until the deal closes. Because the role directly drives revenue, it is one of the most expensive hires in a wholesale operation when hired locally.</p>
<table class="bench-table my-6"><thead><tr><th>Option</th><th>Cost</th><th>Notes</th></tr></thead><tbody>
<tr><td>US W2 acquisition manager</td><td>$60,000 to $80,000 / yr</td><td>Plus payroll tax, benefits, and often commission on closed deals</td></tr>
<tr><td>US contractor</td><td>$3,500 to $6,000 / mo</td><td>Frequently base plus commission, variable monthly cost</td></tr>
<tr><td>VA Horizon acquisition manager</td><td>$1,440 / mo</td><td>Flat, month to month, no benefits or payroll overhead</td></tr>
</tbody></table>
<h2 id="hiring-criteria">Why the hiring criteria matter to the cost</h2>
<p>A cheap acquisition manager who cannot close is the most expensive hire you can make, because they burn the leads your cold callers worked hard to generate. That is why VA Horizon does not place acquisition managers who are learning the role on client deals. Every acquisition manager must meet all three criteria:</p>
<ul>
<li><strong>One year or more of cold calling experience,</strong> so they understand seller psychology from the caller seat.</li>
<li><strong>Six or more months of vetted acquisition management experience</strong> in real estate, managing leads from first contact through a signed contract.</li>
<li><strong>A minimum of two closed deals</strong> on their track record, verified rather than self-reported.</li>
</ul>
<p>Candidates who do not meet all three are not placed. The $1,440 price buys a manager who has actually closed deals, not a trainee.</p>
<div class="callout-box"><p class="font-bold text-va-navy">When to add an acquisition manager</p><p class="text-sm">The trigger is usually three cold callers producing roughly 90 or more qualified leads per month, which is more than a solo operator can work while still sourcing deals and running the business. See the <a href="/services/acquisition-manager/">acquisition manager service</a> for the full scope.</p></div>
<h2 id="am-vs-doing-it-yourself">Acquisition manager vs closing deals yourself</h2>
<p>Early on, the operator is the acquisition manager, and that is fine while volume is low. The role pays for itself when the number of qualified leads exceeds what you can personally follow up on, because every lead that goes cold is lost revenue. At $1,440 per month, one closed wholesale deal usually covers the manager for many months. To plan the full team, see the <a href="/services/wholesaling-virtual-assistant/">wholesaling virtual assistant</a> roles and compare with <a href="/guides/disposition-manager-salary-cost/">disposition manager cost</a>.</p>`,
    faq: [
      {q:'How much does a real estate acquisitions manager cost?',a:'A US-based acquisition manager typically costs $3,500 to $6,000 per month, or $60,000 to $80,000 per year as a W2 hire with benefits. A trained VA Horizon acquisition manager is $1,440 per month flat, with no benefits or payroll overhead.'},
      {q:'What experience does a VA Horizon acquisition manager have?',a:'Every acquisition manager VA Horizon places has at least one year of cold calling experience, six or more months of vetted acquisition management experience in real estate, and a minimum of two verified closed deals. Trainees are not placed on client deals.'},
      {q:'Is the acquisition manager paid commission?',a:'The VA Horizon price is a flat $1,440 per month. US acquisition managers are frequently paid a base salary plus commission on closed deals, which makes their true monthly cost higher and variable.'},
      {q:'When should I hire an acquisition manager?',a:'Typically once three cold callers are generating around 90 or more qualified leads per month, which is more than a solo operator can close while still running acquisitions and the business.'},
      {q:'Does the acquisition manager price include the CRM?',a:'Yes. HighLevel CRM buildout and managed QA are included with every VA Horizon placement, including acquisition managers.'}
    ],
    related: [
      {tag:'Service',title:'Acquisition Manager VAs',desc:'Scope, vetting, and how the role works',href:'/services/acquisition-manager/'},
      {tag:'Cost',title:'Disposition Manager Cost',desc:'What a dispo manager costs and when to add one',href:'/guides/disposition-manager-salary-cost/'},
      {tag:'Pricing',title:'VA Horizon Pricing',desc:'Flat monthly pricing for every role',href:'/pricing/'}
    ],
    cta: {h:'Add a closer who has actually closed deals.',p:'VA Horizon acquisition managers are vetted for real closing experience and priced at $1,440 per month, with the CRM included.'}
  },
  {
    slug: 'disposition-manager-salary-cost',
    title: 'Disposition Manager Salary and Cost for Wholesalers (2026) | VA Horizon',
    description: 'What a real estate disposition manager costs in 2026: US salary ranges versus a VA Horizon disposition manager at $1,440 per month. What the dispo role actually does.',
    heroLabel: 'Cost Guide',
    h1: 'Disposition Manager Salary and Cost for Wholesalers',
    crumb: 'Disposition Manager Salary and Cost',
    answer: 'A US-based disposition manager typically costs $3,500 to $6,000 per month, often with a base plus a fee per assigned contract. A trained VA Horizon disposition manager is $1,440 per month flat, the same rate as an acquisition manager. The disposition manager builds and works the cash buyers list, markets contracts, and feeds buyer demand data back to acquisitions so offers are priced to move.',
    stats: [{n:'$1,440',l:'VA Horizon Dispo / Mo'},{n:'$3.5-6k',l:'US Dispo / Mo'},{n:'GHL',l:'CRM Included'},{n:'48h',l:'Onboarding'}],
    body: `<h2 id="what-dispo-costs">What a disposition manager costs</h2>
<p>Disposition is the other half of a wholesale deal. Once a contract is signed, someone has to find the buyer and assign the contract quickly, before the inspection window closes. A disposition manager owns that process: building the buyers list, marketing contracts, fielding buyer questions, and closing the assignment.</p>
<table class="bench-table my-6"><thead><tr><th>Option</th><th>Cost</th><th>Notes</th></tr></thead><tbody>
<tr><td>US disposition manager</td><td>$3,500 to $6,000 / mo</td><td>Often base plus a fee per assigned contract</td></tr>
<tr><td>VA Horizon disposition manager</td><td>$1,440 / mo</td><td>Flat, month to month, CRM included</td></tr>
</tbody></table>
<h2 id="what-dispo-does">What the disposition manager actually does</h2>
<p>The role is frequently underrated because new wholesalers assume any contract will sell itself. It will not, especially in a slower market. A disposition manager:</p>
<ul>
<li>Builds and maintains the cash buyers list, segmented by buy box, area, and price band.</li>
<li>Markets each contract to the buyers most likely to close it, instead of blasting everyone.</li>
<li>Gathers buyer feedback on pricing and condition so the next offer is sharper.</li>
<li>Works closely with the <a href="/services/acquisition-manager/">acquisition manager</a> so dispo knows what buyers will pay and acquisitions knows what to offer.</li>
</ul>
<p>For a deeper look at the day-to-day, see <a href="/blog/what-does-disposition-manager-do-wholesaling/">what a disposition manager does in wholesaling</a>.</p>
<div class="callout-box"><p class="font-bold text-va-navy">Why separate dispo from acquisitions</p><p class="text-sm">When one person does both acquisition and disposition, each gets done at half quality. Splitting the roles lets both specialize, which usually shortens the time from signed contract to assigned contract. A VA Horizon disposition manager is $1,440 per month, the same as an acquisition manager.</p></div>
<h2 id="when-to-add-dispo">When to add a disposition manager</h2>
<p>The disposition manager is usually the fourth hire, after the team has cold callers and an acquisition manager and is signing enough contracts that moving them quickly matters. To map the full sequence, see the <a href="/services/wholesaling-virtual-assistant/">wholesaling virtual assistant</a> roles and the related <a href="/guides/acquisition-manager-salary-cost/">acquisition manager cost</a> guide.</p>`,
    faq: [
      {q:'How much does a disposition manager cost?',a:'A US-based disposition manager typically costs $3,500 to $6,000 per month, often base plus a fee per assigned contract. A VA Horizon disposition manager is $1,440 per month flat, the same rate as an acquisition manager, with the CRM included.'},
      {q:'What does a disposition manager do?',a:'They build and work the cash buyers list, market signed contracts to the right buyers, collect buyer feedback on pricing, and coordinate with acquisitions so offers are priced to assign quickly.'},
      {q:'When should I hire a disposition manager?',a:'Usually after you have cold callers and an acquisition manager and are signing enough contracts that speed of assignment affects your margin. Separating dispo from acquisitions lets both roles specialize.'},
      {q:'Is the disposition manager price the same as acquisitions?',a:'Yes. Both the acquisition manager and disposition manager roles are $1,440 per month through VA Horizon.'},
      {q:'Does the price include the CRM?',a:'Yes. HighLevel CRM buildout and managed QA are included with every VA Horizon placement.'}
    ],
    related: [
      {tag:'Service',title:'Disposition Manager VAs',desc:'How the disposition role works and what it includes',href:'/services/disposition-manager/'},
      {tag:'Blog',title:'What a Dispo Manager Does',desc:'The day-to-day of disposition in wholesaling',href:'/blog/what-does-disposition-manager-do-wholesaling/'},
      {tag:'Cost',title:'Acquisition Manager Cost',desc:'What an acquisition manager costs',href:'/guides/acquisition-manager-salary-cost/'}
    ],
    cta: {h:'Move contracts faster with a dedicated dispo manager.',p:'VA Horizon disposition managers build your buyers list and assign contracts for $1,440 per month, with the CRM included.'}
  },
  {
    slug: 'how-to-calculate-mao-real-estate',
    title: 'How to Calculate MAO (Maximum Allowable Offer) for Wholesaling (2026) | VA Horizon',
    description: 'How to calculate MAO (Maximum Allowable Offer) for real estate wholesaling: the formula, a worked example, and the free MAO calculator. ARV times 70 percent minus repairs minus fee.',
    heroLabel: 'How-To Guide',
    h1: 'How to Calculate MAO (Maximum Allowable Offer)',
    crumb: 'How to Calculate MAO',
    answer: 'Maximum Allowable Offer (MAO) is the most a wholesaler should offer for a property and still leave room for the end buyer to profit. The common formula is MAO equals ARV times 0.70, minus estimated repairs, minus your wholesale fee. For a house with a $300,000 after-repair value, $40,000 in repairs, and a $15,000 fee: $300,000 times 0.70 is $210,000, minus $40,000 is $170,000, minus $15,000 is a $155,000 maximum offer. The 70 percent figure is a starting convention, not a rule, and tighter or looser margins apply by market.',
    stats: [{n:'70%',l:'Common ARV Rule'},{n:'ARV',l:'Starts With Comps'},{n:'MAO',l:'Your Ceiling'},{n:'Free',l:'MAO Calculator'}],
    body: `<h2 id="what-is-mao">What MAO means and why it matters</h2>
<p>MAO, or Maximum Allowable Offer, is the highest price a wholesaler can offer a seller while still leaving enough spread for the end buyer to renovate, hold, or resell at a profit, and for the wholesaler to earn a fee. Offer above your MAO and the deal will not sell to a cash buyer. Knowing your MAO before you negotiate is what keeps a wholesaler from tying up contracts nobody will buy. The term is defined further in our <a href="/glossary/maximum-allowable-offer-mao/">MAO glossary entry</a>.</p>
<h2 id="the-formula">The MAO formula</h2>
<p>The standard wholesaling formula is:</p>
<p><strong>MAO = (ARV x 0.70) minus estimated repairs minus your wholesale fee</strong></p>
<p>Each input matters:</p>
<ul>
<li><strong>ARV (After Repair Value):</strong> what the home is worth fully renovated, based on comparable sales. This is the foundation, so it has to come from real comps, not a Zestimate. See <a href="/glossary/after-repair-value-arv/">after repair value</a>.</li>
<li><strong>The percentage:</strong> 70 percent is the common convention because it leaves the end buyer roughly 30 percent of ARV to cover purchase costs, holding, and profit. In hot, low-inventory markets buyers may accept 75 or even 80 percent. In slower or higher-risk markets, 65 percent is safer.</li>
<li><strong>Estimated repairs:</strong> a realistic rehab budget. Underestimating repairs is the most common way new wholesalers blow a deal.</li>
<li><strong>Your wholesale fee:</strong> the assignment fee you intend to earn, subtracted so your offer still leaves the buyer their margin.</li>
</ul>
<h2 id="worked-example">A worked example</h2>
<p>The numbers below are an illustrative example, not a guaranteed result. Assume:</p>
<ul>
<li>ARV from comps: $300,000</li>
<li>Estimated repairs: $40,000</li>
<li>Target wholesale fee: $15,000</li>
</ul>
<p>Step by step: $300,000 times 0.70 equals $210,000. Subtract $40,000 in repairs to get $170,000. Subtract your $15,000 fee to get a Maximum Allowable Offer of <strong>$155,000</strong>. That is your ceiling. You can and should try to get the property under contract below $155,000, which widens both your fee and the buyer margin.</p>
<div class="callout-box"><p class="font-bold text-va-navy">Run your own numbers</p><p class="text-sm">Use the free <a href="/tools/mao-calculator/">MAO calculator</a> to plug in ARV, repairs, and your fee and get the maximum offer instantly, then sanity check the percentage against your local buyer demand.</p></div>
<h2 id="common-mistakes">Common mistakes that break the math</h2>
<ul>
<li><strong>Inflated ARV:</strong> using the highest comp on the street instead of the realistic median pulls the whole offer too high.</li>
<li><strong>Light repair estimates:</strong> always budget for what the home actually needs, including the items you cannot see on a quick walkthrough.</li>
<li><strong>Ignoring the local percentage:</strong> 70 percent is a starting point. Confirm what your cash buyers actually pay before you anchor to it.</li>
<li><strong>Forgetting the fee:</strong> if you do not subtract your assignment fee, you leave yourself no room to get paid.</li>
</ul>
<h2 id="how-this-fits">How MAO fits the wholesaling workflow</h2>
<p>MAO is the bridge between a qualified lead and a signed contract. Your cold callers and acquisition team gather the property condition and price expectation, you build an ARV from comps, and the MAO formula tells you the number to negotiate toward. To learn how the lead gets to that point, see the <a href="/guides/cold-calling-real-estate-wholesaling/">cold calling guide</a> and the <a href="/services/wholesaling-virtual-assistant/">wholesaling virtual assistant</a> roles that feed the pipeline.</p>`,
    howto: {
      name: 'How to Calculate Maximum Allowable Offer (MAO)',
      description: 'Calculate the maximum a wholesaler should offer for a property using the ARV-based MAO formula.',
      steps: [
        {name:'Determine the ARV', text:'Establish the After Repair Value from comparable sales of fully renovated homes in the same area.'},
        {name:'Apply the percentage', text:'Multiply the ARV by 0.70 (or your market-adjusted percentage) to set the combined buyer-and-wholesaler ceiling.'},
        {name:'Subtract estimated repairs', text:'Subtract a realistic renovation budget for the property from the result.'},
        {name:'Subtract your wholesale fee', text:'Subtract the assignment fee you intend to earn. The remaining number is your Maximum Allowable Offer.'}
      ]
    },
    faq: [
      {q:'What is the MAO formula for wholesaling?',a:'MAO equals ARV times 0.70, minus estimated repairs, minus your wholesale fee. The 0.70 leaves the end buyer roughly 30 percent of ARV for purchase costs, holding, and profit.'},
      {q:'Why 70 percent?',a:'It is a common convention that leaves enough margin for a cash buyer to renovate and profit. In hot low-inventory markets buyers may accept 75 to 80 percent; in slower markets 65 percent is safer. Confirm what your local buyers actually pay.'},
      {q:'What is a worked MAO example?',a:'For a $300,000 ARV with $40,000 in repairs and a $15,000 fee: $300,000 times 0.70 is $210,000, minus $40,000 is $170,000, minus $15,000 is a $155,000 maximum offer. This is an illustrative example, not a guaranteed result.'},
      {q:'Where does ARV come from?',a:'From comparable sales of fully renovated homes in the same area, not from an automated estimate. A reliable ARV is the foundation of an accurate MAO.'},
      {q:'Is there a free MAO calculator?',a:'Yes. VA Horizon offers a free MAO calculator where you enter the ARV, repairs, and fee to get the maximum allowable offer instantly.'}
    ],
    related: [
      {tag:'Tool',title:'MAO Calculator',desc:'Free maximum allowable offer calculator',href:'/tools/mao-calculator/'},
      {tag:'Glossary',title:'After Repair Value (ARV)',desc:'The foundation of the MAO formula',href:'/glossary/after-repair-value-arv/'},
      {tag:'Guide',title:'Cold Calling Guide',desc:'How leads reach the offer stage',href:'/guides/cold-calling-real-estate-wholesaling/'}
    ],
    cta: {h:'Spend less time on math and more time on deals.',p:'VA Horizon places trained cold callers and acquisition support so qualified seller conversations reach your desk ready to underwrite.'}
  }
];

const written = [];
for (const g of guides) {
  const dir = path.join(ROOT, 'guides', g.slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'index.html'), buildPage(g), 'utf8');
  written.push('/guides/' + g.slug + '/');
}
console.log('Wrote ' + written.length + ' guides:');
written.forEach(u => console.log('  ' + u));
