import { promises as fs } from 'fs';
import path from 'path';

const CALENDLY = 'https://calendly.com/youssef-vahorizon/30min';
const VA_SEAT = 'https://buy.stripe.com/4gMfZafNHgMIfn4dn1aMU04';
const LEAD_MANAGER = 'https://buy.stripe.com/7sY14g1WRfIEb6Oer5aMU05';
const ACQUISITION_MANAGER = 'https://buy.stripe.com/28EaEQgRL5404Iq2InaMU06';
const DISPOSITION_MANAGER = 'https://buy.stripe.com/7sY7sE6d7eEA1weciXaMU07';
const PRICING = '/pricing/';

const targets = [
  ['services/cold-calling', VA_SEAT],
  ['services/wholesaling-virtual-assistant', VA_SEAT],
  ['services/lead-manager', LEAD_MANAGER],
  ['services/acquisition-manager', ACQUISITION_MANAGER],
  ['services/disposition-manager', DISPOSITION_MANAGER],
  ['solutions/brrrr-investors', PRICING],
  ['solutions/buy-and-hold-landlords', PRICING],
  ['solutions/creative-finance-investors', PRICING],
  ['solutions/fix-and-flippers', PRICING],
  ['solutions/land-investors', PRICING],
  ['solutions/multifamily-investors', PRICING],
  ['solutions/new-real-estate-investors', PRICING],
  ['solutions/novation-investors', PRICING],
  ['solutions/property-management-companies', PRICING],
  ['solutions/real-estate-agents-and-teams', PRICING],
  ['solutions/real-estate-wholesalers', PRICING],
  ['solutions/reia-groups-and-investor-communities', PRICING],
  ['solutions/scaling-wholesale-teams', PRICING],
  ['solutions/short-term-rental-investors', PRICING],
  ['solutions/virtual-wholesaling-operators', PRICING],
  ['compare/best-ai-cold-calling-real-estate', PRICING],
  ['compare/best-cold-calling-va-companies', PRICING],
  ['compare/best-crm-for-real-estate-wholesalers', PRICING],
  ['compare/best-dialer-real-estate-cold-calling', PRICING],
  ['compare/best-lead-list-software-wholesalers', PRICING],
  ['compare/best-real-estate-cold-calling-services', PRICING],
  ['compare/best-real-estate-virtual-assistant-companies', PRICING],
  ['compare/best-sms-platform-real-estate-wholesalers', PRICING],
  ['compare/highlevel-vs-podio-wholesalers', PRICING],
  ['compare/resimpli-vs-highlevel-wholesalers', PRICING],
  ['compare/va-horizon-vs-ai-voice-agent', PRICING],
  ['compare/va-horizon-vs-ak-callers', PRICING],
  ['compare/va-horizon-vs-answering-service', PRICING],
  ['compare/va-horizon-vs-call-motivated-sellers', PRICING],
  ['compare/va-horizon-vs-call-porter', PRICING],
  ['compare/va-horizon-vs-cold-calling-software-alone', PRICING],
  ['compare/va-horizon-vs-diy-list-pulling', PRICING],
  ['compare/va-horizon-vs-freelancer', PRICING],
  ['compare/va-horizon-vs-getcallers', PRICING],
  ['compare/va-horizon-vs-in-house-va', PRICING],
  ['compare/va-horizon-vs-lead-generation-services', PRICING],
  ['compare/va-horizon-vs-lead-mining-pros', PRICING],
  ['compare/va-horizon-vs-myoutdesk', PRICING],
  ['compare/va-horizon-vs-no-accent-callers', PRICING],
  ['compare/va-horizon-vs-onlinejobs-ph', PRICING],
  ['compare/va-horizon-vs-real-estate-coaching', PRICING],
  ['compare/va-horizon-vs-reva-global', PRICING],
  ['compare/va-horizon-vs-stealth-agents', PRICING],
  ['compare/va-horizon-vs-televista', PRICING],
  ['compare/va-horizon-vs-text-blasting-only', PRICING],
  ['compare/va-horizon-vs-upwork-cold-callers', PRICING],
  ['compare/va-horizon-vs-virtual-latinos', PRICING],
];

const bookBtn = (cls) =>
  `<a href="${CALENDLY}" target="_blank" rel="noopener noreferrer" class="${cls}">Book a Call Today</a>`;
const payBtn = (cls, href) => `<a href="${href}" class="${cls}">Get Started</a>`;

// Anchor matchers (used inside an already-isolated section block).
const CALENDLY_PRIMARY = /<a href="https:\/\/calendly\.com\/youssef-vahorizon\/30min" target="_blank" rel="noopener noreferrer" class="btn btn-xl btn-primary">[^<]+<\/a>/;
const APPLY_PRIMARY = /<a href="\/apply\/" class="btn btn-xl btn-primary">[^<]+<\/a>/;
const SECONDARY_ANY = /<a href="[^"]+" class="btn btn-xl btn-secondary">[^<]+<\/a>/;
const PRIMARY_ANY = /<a href="[^"]+" class="btn btn-xl btn-primary">[^<]+<\/a>/;

function extractFirstSection(html, classNeedle, fromIdx = 0) {
  const openRe = new RegExp(`<section class="[^"]*${classNeedle}[^"]*"[^>]*>`);
  const rest = html.slice(fromIdx);
  const openMatch = rest.match(openRe);
  if (!openMatch) return null;
  const startIdx = fromIdx + openMatch.index;
  const afterOpenIdx = startIdx + openMatch[0].length;
  const closeIdx = html.indexOf('</section>', afterOpenIdx);
  if (closeIdx === -1) return null;
  const endIdx = closeIdx + '</section>'.length;
  return { startIdx, endIdx, block: html.slice(startIdx, endIdx) };
}

// Hero: must end up with exactly [Get Started primary, Book a Call secondary].
function normalizeHero(block, payHref) {
  const primaryPairRe = new RegExp(`(${CALENDLY_PRIMARY.source}|${APPLY_PRIMARY.source})(\\s+)${SECONDARY_ANY.source}`);
  let m = block.match(primaryPairRe);
  if (m) {
    const ws = m[2];
    const replacement = `${payBtn('btn btn-xl btn-primary', payHref)}${ws}${bookBtn('btn btn-xl btn-secondary')}`;
    return { block: block.replace(primaryPairRe, replacement), mode: 'swapped-pair' };
  }

  const singlePrimaryRe = new RegExp(`${CALENDLY_PRIMARY.source}|${APPLY_PRIMARY.source}`);
  m = block.match(singlePrimaryRe);
  if (m) {
    const replacement = `${payBtn('btn btn-xl btn-primary', payHref)}\r\n      ${bookBtn('btn btn-xl btn-secondary')}`;
    return { block: block.replace(singlePrimaryRe, replacement), mode: 'swapped-single' };
  }

  // No CTA button at all in hero: insert a new row inside the deepest
  // enclosing div, right before that div's own closing tag (works regardless
  // of how many divs the hero template nests before its closing </section>).
  const heroTailRe = /(\s*<\/div>\s*<\/section>)$/;
  m = block.match(heroTailRe);
  if (m) {
    const row = `\r\n <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">\r\n  ${payBtn('btn btn-xl btn-primary', payHref)}\r\n  ${bookBtn('btn btn-xl btn-secondary')}\r\n </div>`;
    return { block: block.replace(heroTailRe, `${row}$1`), mode: 'inserted' };
  }

  return { block, mode: 'none' };
}

// Bottom CTA section: must end up with exactly one [Get Started] button.
function normalizeCta(block, payHref) {
  const primaryPairRe = new RegExp(`(${CALENDLY_PRIMARY.source}|${APPLY_PRIMARY.source})(\\s+)${SECONDARY_ANY.source}`);
  let m = block.match(primaryPairRe);
  if (m) {
    return { block: block.replace(primaryPairRe, payBtn('btn btn-xl btn-primary', payHref)), mode: 'pair->single' };
  }

  const singlePrimaryRe = new RegExp(`${CALENDLY_PRIMARY.source}|${APPLY_PRIMARY.source}|${PRIMARY_ANY.source}`);
  m = block.match(singlePrimaryRe);
  if (m) {
    return { block: block.replace(singlePrimaryRe, payBtn('btn btn-xl btn-primary', payHref)), mode: 'single->single' };
  }

  return { block, mode: 'none' };
}

function fixParagraphCopy(html) {
  return html
    .replace(/Book a 15-minute call and we will map/g, 'Get started today and we will map')
    .replace(/Book a 15-minute call\. We'll walk you through/g, "Get started today. We'll walk you through")
    .replace(/Apply now and VA Horizon will map/g, 'Get started today and VA Horizon will map');
}

let report = [];

for (const [rel, payHref] of targets) {
  const file = path.join(process.cwd(), rel, 'index.html');
  let html = await fs.readFile(file, 'utf8');

  const heroSection = extractFirstSection(html, 'hero');
  if (!heroSection) {
    report.push(`SKIP (no hero section found): ${rel}`);
    continue;
  }
  const ctaSection =
    extractFirstSection(html, 'cta-section', heroSection.endIdx) ||
    extractFirstSection(html, 'bg-va-navy text-white text-center', heroSection.endIdx);
  if (!ctaSection) {
    report.push(`SKIP (no cta-section found): ${rel}`);
    continue;
  }

  const heroResult = normalizeHero(heroSection.block, payHref);
  const ctaResult = normalizeCta(ctaSection.block, payHref);

  const newHtml =
    html.slice(0, heroSection.startIdx) +
    heroResult.block +
    html.slice(heroSection.endIdx, ctaSection.startIdx) +
    ctaResult.block +
    html.slice(ctaSection.endIdx);

  const finalHtml = fixParagraphCopy(newHtml);

  await fs.writeFile(file, finalHtml, 'utf8');
  report.push(`OK: ${rel} hero=${heroResult.mode} cta=${ctaResult.mode}`);
}

console.log(report.join('\n'));
