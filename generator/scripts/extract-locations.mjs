// One-time bootstrap: reverse-engineer generator/data/locations.json from the
// existing hand-authored /locations/cold-calling-va-*/index.html pages.
// Reads real city data off disk (no invented values), so the generator can take
// over these pages. Run once, review the JSON, then delete or keep for reference.
//
//   node generator/scripts/extract-locations.mjs
//
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here, '..', '..');
const locationsDir = path.join(rootDir, 'locations');
const outFile = path.join(here, '..', 'data', 'locations.json');

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "’");
}

function clean(s) {
  if (s == null) return null;
  return decode(String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

function stripLeadDash(s) {
  return s.replace(/^\s*[-–—]\s*/, '').trim();
}

function one(re, html) {
  const m = html.match(re);
  return m ? m[1] : null;
}

function extract(html, slug) {
  // Structured, reliable bits from the JSON-LD graph.
  const ld = JSON.parse(one(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, html));
  const graph = ld['@graph'] || [];
  const service = graph.find(n => n['@type'] === 'Service') || {};
  const faqNode = graph.find(n => n['@type'] === 'FAQPage') || { mainEntity: [] };
  const city = service.areaServed?.name;
  const state = service.areaServed?.addressRegion;

  const title = clean(one(/<title[^>]*>([\s\S]*?)<\/title>/i, html));
  const description = decode(one(/<meta name="description" content="([^"]*)"/i, html));
  const twitterDescription = decode(one(/<meta name="twitter:description" content="([^"]*)"/i, html) || description);
  const schemaDescription = service.description || null;

  const heroLabel = clean(one(/<span class="section-label mb-6 inline-block">([^<]+)<\/span>/, html));
  const h1 = clean(one(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html));
  const heroSubhead = clean(one(/<p class="text-gray-300 text-xl[^"]*"[^>]*>([\s\S]*?)<\/p>/i, html));
  const medianPrice = clean(one(/<p class="text-va-gold font-black text-3xl"[^>]*>([^<]+)<\/p>/, html));
  const marketIntro = clean(one(/Need Cold Calling VAs\s*<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i, html));

  // Why cards: feature-cards that carry the triangle icon + an <h3> (distinguishes
  // them from the "What's Included" cards, which have no <h3>).
  const whyCards = [];
  const whyRe = /<div class="feature-card">\s*<div class="text-va-gold text-2xl mb-3">[^<]*<\/div>\s*<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/div>/g;
  let m;
  while ((m = whyRe.exec(html)) !== null) {
    whyCards.push({ title: clean(m[1]), body: clean(m[2]) });
  }

  // The two Market Insights lists, in order: [0] target areas, [1] market conditions.
  const uls = [...html.matchAll(/<ul class="space-y-3 text-va-dark text-sm">([\s\S]*?)<\/ul>/g)].map(x => x[1]);
  const targetAreas = [];
  if (uls[0]) {
    const re = /<li[^>]*>\s*<span[^>]*>[^<]*<\/span>\s*<span><strong>([\s\S]*?)<\/strong>([\s\S]*?)<\/span>\s*<\/li>/g;
    let a;
    while ((a = re.exec(uls[0])) !== null) {
      targetAreas.push({ area: clean(a[1]), note: stripLeadDash(clean(a[2])) });
    }
  }
  const marketConditions = [];
  if (uls[1]) {
    const re = /<li[^>]*>\s*<span[^>]*>[^<]*<\/span>\s*<span>([\s\S]*?)<\/span>\s*<\/li>/g;
    let c;
    while ((c = re.exec(uls[1])) !== null) {
      marketConditions.push(clean(c[1]));
    }
  }

  const faq = faqNode.mainEntity.map(q => ({ q: q.name, a: q.acceptedAnswer.text }));

  return {
    slug,
    service: 'Cold Calling VA',
    city,
    state,
    title,
    description,
    twitterDescription,
    schemaDescription,
    heroLabel,
    h1,
    heroSubhead,
    medianPrice,
    marketIntro,
    whyCards,
    targetAreas,
    marketConditions,
    faq,
  };
}

const dirs = (await fs.readdir(locationsDir, { withFileTypes: true }))
  .filter(d => d.isDirectory() && d.name.startsWith('cold-calling-va-'))
  .map(d => d.name)
  .sort();

const records = [];
const warnings = [];
for (const slug of dirs) {
  const html = await fs.readFile(path.join(locationsDir, slug, 'index.html'), 'utf8');
  const rec = extract(html, slug);
  // Sanity: warn on anything that looks under-extracted.
  if (!rec.city || !rec.medianPrice || rec.whyCards.length < 3 || rec.targetAreas.length < 3 || rec.faq.length < 5) {
    warnings.push(`${slug}: city=${rec.city} median=${rec.medianPrice} why=${rec.whyCards.length} areas=${rec.targetAreas.length} faq=${rec.faq.length}`);
  }
  records.push(rec);
}

await fs.writeFile(outFile, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
console.log(`Extracted ${records.length} location records -> ${path.relative(rootDir, outFile)}`);
for (const slug of dirs) console.log(`  - ${slug}`);
if (warnings.length) {
  console.log('\nWARNINGS (review these records):');
  for (const w of warnings) console.log(`  ! ${w}`);
}
