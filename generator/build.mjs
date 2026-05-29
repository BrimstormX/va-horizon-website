// VA Horizon page generator.
// Renders data-driven page types into committed static HTML, then the existing
// `npm run internal-links` post-processor decorates breadcrumb + internal links.
//
// Usage:
//   node generator/build.mjs              # build all registered page types
//   node generator/build.mjs --only=locations
//
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderLocation } from './templates/location.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(here, '..');
const dataDir = path.join(here, 'data');

const onlyArg = process.argv.find(a => a.startsWith('--only='));
const only = onlyArg ? onlyArg.split('=')[1] : null;

// Registry: page type -> { dataFile, outDir, render, requiredFields, minWords }
const registry = {
  locations: {
    dataFile: 'locations.json',
    outDir: 'locations',
    render: renderLocation,
    requiredFields: ['slug', 'city', 'state', 'title', 'description', 'h1', 'heroSubhead', 'medianPrice', 'whyCards', 'targetAreas', 'marketConditions', 'faq'],
    minWords: 600,
    // City-specific signal: at least this many target areas + conditions + FAQ entries.
    minTargetAreas: 3,
    minFaq: 5,
  },
};

function wordCount(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(' ').length : 0;
}

// Similarity guard: Jaccard over 3-word shingles. Flags near-duplicate pages.
function shingles(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');
  const set = new Set();
  for (let i = 0; i + 2 < text.length; i += 1) set.add(`${text[i]} ${text[i + 1]} ${text[i + 2]}`);
  return set;
}

function jaccard(a, b) {
  let inter = 0;
  for (const s of a) if (b.has(s)) inter += 1;
  return inter / (a.size + b.size - inter || 1);
}

function validate(type, cfg, record) {
  const errors = [];
  for (const f of cfg.requiredFields) {
    const v = record[f];
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
      errors.push(`missing required field "${f}"`);
    }
  }
  if (Array.isArray(record.targetAreas) && record.targetAreas.length < cfg.minTargetAreas) {
    errors.push(`needs >= ${cfg.minTargetAreas} targetAreas (city-specific signal), has ${record.targetAreas.length}`);
  }
  if (Array.isArray(record.faq) && record.faq.length < cfg.minFaq) {
    errors.push(`needs >= ${cfg.minFaq} FAQ entries, has ${record.faq.length}`);
  }
  return errors;
}

async function buildType(type) {
  const cfg = registry[type];
  if (!cfg) throw new Error(`Unknown page type: ${type}`);

  const raw = await fs.readFile(path.join(dataDir, cfg.dataFile), 'utf8');
  const records = JSON.parse(raw);

  const failures = [];
  const rendered = [];

  for (const record of records) {
    const errs = validate(type, cfg, record);
    if (errs.length) {
      failures.push(`[${type}/${record.slug || '?'}] ${errs.join('; ')}`);
      continue;
    }
    const html = cfg.render(record);
    const words = wordCount(html);
    if (words < cfg.minWords) {
      failures.push(`[${type}/${record.slug}] thin content: ${words} words < ${cfg.minWords}`);
      continue;
    }
    rendered.push({ slug: record.slug, html, words });
  }

  // Near-duplicate detection across this type.
  const sigs = rendered.map(r => ({ slug: r.slug, sig: shingles(r.html) }));
  for (let i = 0; i < sigs.length; i += 1) {
    for (let j = i + 1; j < sigs.length; j += 1) {
      const sim = jaccard(sigs[i].sig, sigs[j].sig);
      if (sim > 0.8) failures.push(`[${type}] near-duplicate: ${sigs[i].slug} ~ ${sigs[j].slug} (${(sim * 100).toFixed(0)}% similar)`);
    }
  }

  if (failures.length) {
    console.error(`\nGenerator gate FAILED for "${type}":`);
    for (const f of failures) console.error(`  - ${f}`);
    throw new Error(`${failures.length} page(s) failed the quality gate; nothing written for "${type}".`);
  }

  // All pages passed; write them.
  for (const r of rendered) {
    const outPath = path.join(rootDir, cfg.outDir, r.slug, 'index.html');
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, r.html, 'utf8');
  }

  console.log(`Generated ${rendered.length} ${type} page(s):`);
  for (const r of rendered) console.log(`  /${cfg.outDir}/${r.slug}/  (${r.words} words)`);
  return rendered.length;
}

const types = only ? [only] : Object.keys(registry);
let total = 0;
for (const t of types) total += await buildType(t);
console.log(`\nDone. ${total} page(s) generated. Run \`npm run internal-links\` to refresh breadcrumb + internal links.`);
