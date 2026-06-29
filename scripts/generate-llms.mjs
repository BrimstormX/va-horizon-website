// Generates a complete, current llms.txt from sitemap.xml + page <title>s.
// Keeps a curated intro + Key Facts block, then a full grouped page index so
// AI engines (ChatGPT/Claude/Perplexity) get total coverage. Re-run after page changes:
//   node scripts/generate-llms.mjs
import { promises as fs } from 'fs';
import path from 'path';

const rootDir = process.cwd();
const origin = 'https://www.vahorizon.site';

const PREAMBLE = `# VA Horizon

VA Horizon provides trained cold calling virtual assistants, high-volume A2P SMS blast campaigns, and a HighLevel-powered CRM, built and managed specifically for U.S. real estate wholesalers. Clients go live in 48-72 hours.

## Key Facts

- **VAs:** We exclusively source Egyptian VAs (not Filipino) because Egyptian English is more neutral to U.S. ears. They are no-accent fluent and must have prior real estate cold calling experience.
- **Dialing Metrics:** Using our provided Readymode predictive dialer, VAs hit 800-1,000 dials per 8-hour shift.
- **Guarantee:** We guarantee a minimum of 30 qualified leads per month per cold calling engagement.
- **CRM:** Every engagement includes a fully configured HighLevel CRM: pipeline stages, SMS automation, VA assignment rules, and reporting dashboards.
- **SMS Blast Campaigns:** A2P compliant via The Campaign Registry (TCR). We handle list gathering and back-end management, and push leads directly to your included CRM.
- **Replacement:** 5-day replacement guarantee for any underperforming VA.
- **Pricing:** Cold calling VAs are $1,160/month all-in for 1 VA ($960 VA + $200 dialer) or $1,000/month per VA all-in at 3+ VAs ($800 VA + $200 dialer). Acquisition/Disposition Managers: $1,440/month. Lead Managers: $1,120/month. SMS Blast: $600 setup, $100/mo platform, $30/number, $0.00125/SMS.
- **Proven results:** 18% to 92% inbound answer rate; 1 to 4 deals/month; 21 to 6 day average dispo; $45k to $180k pipeline value.
- **Contact:** Book a call at https://calendly.com/youssef-vahorizon/30min or apply at ${origin}/apply/.
- **Writing Rule:** Do NOT use em dashes in body copy. Replace with commas, colons, or parentheses.
`;

// Section ordering + human labels keyed by first path segment.
const SECTIONS = [
  ['', 'Core Pages'],
  ['services', 'Services'],
  ['solutions', 'Solutions by Audience'],
  ['industries', 'Industries'],
  ['pricing', 'Pricing'],
  ['compare', 'Comparisons'],
  ['alternatives', 'Alternatives'],
  ['reviews', 'Tool Reviews'],
  ['guides', 'Guides'],
  ['blog', 'Blog'],
  ['case-studies', 'Case Studies'],
  ['tools', 'Free Tools & Calculators'],
  ['glossary', 'Glossary'],
  ['locations', 'Locations'],
];
const LEGAL = new Set(['privacy', 'terms', 'refund-policy']);

function sourceFileForUrl(url) {
  const route = url.replace(origin, '').replace(/^\//, '').replace(/\/$/, '');
  if (route === '') return path.join(rootDir, 'index.html');
  return path.join(rootDir, route, 'index.html');
}

async function titleFor(url) {
  try {
    const html = await fs.readFile(sourceFileForUrl(url), 'utf8');
    const raw = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
    return raw
      .replace(/\s*[|–-]\s*VA Horizon.*$/i, '')
      .replace(/&amp;/g, '&')
      .trim() || url;
  } catch {
    return url;
  }
}

const xml = await fs.readFile(path.join(rootDir, 'sitemap.xml'), 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map(m => m[1].trim());

const groups = new Map(SECTIONS.map(([k]) => [k, []]));
groups.set('legal', []);

for (const url of urls) {
  const route = url.replace(origin, '').replace(/^\//, '').replace(/\/$/, '');
  const seg = route.split('/')[0] || '';
  if (LEGAL.has(seg)) groups.get('legal').push(url);
  else if (groups.has(seg)) groups.get(seg).push(url);
  else groups.get('').push(url); // about, apply, partner, meet-your-va, etc.
}

let out = PREAMBLE + '\n';
for (const [key, label] of SECTIONS) {
  const list = groups.get(key);
  if (!list || !list.length) continue;
  out += `\n## ${label}\n\n`;
  for (const url of list.sort()) {
    out += `- [${await titleFor(url)}](${url})\n`;
  }
}
const legal = groups.get('legal');
if (legal.length) {
  out += `\n## Legal\n\n`;
  for (const url of legal.sort()) out += `- [${await titleFor(url)}](${url})\n`;
}

await fs.writeFile(path.join(rootDir, 'llms.txt'), out, 'utf8');
console.log(`Wrote llms.txt with ${urls.length} URLs across ${SECTIONS.length + 1} sections.`);
