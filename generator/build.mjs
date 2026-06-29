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
import { renderLocationsHub } from './templates/locations-hub.mjs';
import { renderGlossaryTerm } from './templates/glossary-term.mjs';
import { renderGlossaryHub } from './templates/glossary-hub.mjs';
import { renderPersona, renderPersonaHub } from './templates/persona.mjs';
import { renderComparison, renderAlternativesHub } from './templates/comparison.mjs';
import { renderService, renderServiceHub } from './templates/service.mjs';
import { renderIndustry } from './templates/industry.mjs';
import { expandedLocationRecords } from './data/location-expansion.mjs';
import { expandedGlossaryRecords } from './data/glossary-expansion.mjs';
import { expandedPersonaRecords } from './data/persona-expansion.mjs';
import { expandedComparisonRecords } from './data/comparison-expansion.mjs';
import { expandedServiceRecords } from './data/service-expansion.mjs';
import { expandedIndustryRecords } from './data/industry-expansion.mjs';

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
    hub: { render: renderLocationsHub },
    requiredFields: ['slug', 'city', 'state', 'title', 'description', 'h1', 'heroSubhead', 'medianPrice', 'whyCards', 'targetAreas', 'marketConditions', 'faq'],
    minWords: 600,
    // City-specific signal: at least this many target areas + conditions + FAQ entries.
    minTargetAreas: 3,
    minFaq: 5,
  },
  glossary: {
    dataFile: 'glossary.json',
    outDir: 'glossary',
    render: renderGlossaryTerm,
    // Hub page (/glossary/index.html) rendered from the full record set.
    hub: { render: renderGlossaryHub },
    requiredFields: ['slug', 'term', 'title', 'description', 'shortDefinition', 'longExplanation'],
    minWords: 230,
    minTargetAreas: 0,
    minFaq: 0,
  },
  personas: {
    dataFile: 'personas.json',
    outDir: 'solutions',
    render: renderPersona,
    hub: { render: renderPersonaHub },
    requiredFields: ['slug', 'audience', 'title', 'description', 'h1', 'heroSubhead', 'painPoints', 'workflowFit', 'roles', 'faq'],
    minWords: 600,
    minTargetAreas: 0,
    minFaq: 4,
  },
  comparisons: {
    records: () => expandedComparisonRecords,
    outDir: 'compare',
    render: renderComparison,
    hub: { render: renderAlternativesHub, outDir: 'alternatives' },
    requiredFields: ['slug', 'route', 'title', 'description', 'h1', 'category', 'alternativeName', 'bestFor', 'summary', 'comparisonRows', 'reasons', 'tradeoffs', 'faq'],
    minWords: 650,
    minTargetAreas: 0,
    minFaq: 4,
  },
  services: {
    records: () => expandedServiceRecords,
    outDir: 'services',
    render: renderService,
    hub: { render: renderServiceHub },
    requiredFields: ['slug', 'service', 'title', 'description', 'h1', 'heroSubhead', 'price', 'bestFor', 'deliverables', 'workflow', 'proof', 'faq'],
    minWords: 650,
    minTargetAreas: 0,
    minFaq: 4,
  },
  industries: {
    records: () => expandedIndustryRecords,
    outDir: 'industries',
    render: renderIndustry,
    requiredFields: ['slug', 'industry', 'title', 'description', 'h1', 'heroSubhead', 'marketNeed', 'operatingModel', 'roles', 'proof', 'faq'],
    minWords: 650,
    minTargetAreas: 0,
    minFaq: 4,
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

function sitemapBlock(route, lastmod) {
  return `  <url>
    <loc>https://www.vahorizon.site${route}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
}

function routeFor(outDir, slug) {
  return `/${outDir}/${slug}/`;
}

function routeForRecord(cfg, record) {
  return record.route || routeFor(record.outDir || cfg.outDir, record.slug);
}

function removeRouteBlocks(xml, routes) {
  let next = xml;
  for (const route of routes) {
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\s*<url>\\s*<loc>https://www\\.vahorizon\\.site${escaped}<\\/loc>\\s*<lastmod>[^<]+<\\/lastmod>\\s*<\\/url>`, 'g');
    next = next.replace(re, '');
  }
  return next;
}

async function syncSitemap(entries) {
  if (!entries.length) return;

  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  const today = new Date().toISOString().slice(0, 10);
  const routes = entries.flatMap(entry => entry.routes);
  const byType = new Map();

  for (const entry of entries) {
    if (!byType.has(entry.type)) byType.set(entry.type, []);
    byType.get(entry.type).push(...entry.routes);
  }

  let xml = await fs.readFile(sitemapPath, 'utf8');
  xml = removeRouteBlocks(xml, routes);

  const blocks = [...byType.entries()].map(([type, typeRoutes]) => {
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    return `  <!-- Generated ${label} pages -->\n${typeRoutes.map(route => sitemapBlock(route, today)).join('\n')}`;
  }).join('\n');

  xml = xml.replace(/\s*<\/urlset>\s*$/i, `\n${blocks}\n</urlset>\n`);
  await fs.writeFile(sitemapPath, xml, 'utf8');
  console.log(`Updated sitemap.xml with ${routes.length} generated route(s).`);
}

async function buildType(type) {
  const cfg = registry[type];
  if (!cfg) throw new Error(`Unknown page type: ${type}`);

  let records;
  if (cfg.records) {
    records = cfg.records();
  } else {
    const raw = await fs.readFile(path.join(dataDir, cfg.dataFile), 'utf8');
    records = JSON.parse(raw);
  }
  if (type === 'locations') {
    const existing = new Set(records.map(record => record.slug));
    records = records.concat(expandedLocationRecords.filter(record => !existing.has(record.slug)));
  }
  if (type === 'glossary') {
    const existing = new Set(records.map(record => record.slug));
    records = records.concat(expandedGlossaryRecords.filter(record => !existing.has(record.slug)));
  }
  if (type === 'personas') {
    const existing = new Set(records.map(record => record.slug));
    records = records.concat(expandedPersonaRecords.filter(record => !existing.has(record.slug)));
  }

  const failures = [];
  const rendered = [];

  for (const record of records) {
    const errs = validate(type, cfg, record);
    if (errs.length) {
      failures.push(`[${type}/${record.slug || '?'}] ${errs.join('; ')}`);
      continue;
    }
    const html = cfg.render({ ...record, collectionCount: records.length });
    const words = wordCount(html);
    if (words < cfg.minWords) {
      failures.push(`[${type}/${record.slug}] thin content: ${words} words < ${cfg.minWords}`);
      continue;
    }
    rendered.push({ slug: record.slug, route: record.route, html, words });
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
    const route = r.route || routeFor(cfg.outDir, r.slug);
    const outPath = path.join(rootDir, route.slice(1), 'index.html');
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, r.html, 'utf8');
  }

  console.log(`Generated ${rendered.length} ${type} page(s):`);
  for (const r of rendered) console.log(`  ${r.route || `/${cfg.outDir}/${r.slug}/`}  (${r.words} words)`);

  // Optional hub page rendered from the full (valid) record set.
  let hubCount = 0;
  if (cfg.hub) {
    const validRecords = records.filter(rec => !validate(type, cfg, rec).length);
    const hubHtml = cfg.hub.render(validRecords);
    const hubOutDir = cfg.hub.outDir || cfg.outDir;
    const hubPath = path.join(rootDir, hubOutDir, 'index.html');
    await fs.mkdir(path.dirname(hubPath), { recursive: true });
    await fs.writeFile(hubPath, hubHtml, 'utf8');
    hubCount = 1;
    console.log(`  /${hubOutDir}/  (hub, ${validRecords.length} pages listed)`);
  }

  const routes = rendered.map(r => routeForRecord(cfg, r));
  if (cfg.hub) routes.unshift(`/${cfg.hub.outDir || cfg.outDir}/`);

  return { count: rendered.length + hubCount, routes };
}

async function main() {
  const types = only ? [only] : Object.keys(registry);
  let total = 0;
  const sitemapEntries = [];
  for (const t of types) {
    const result = await buildType(t);
    total += result.count;
    sitemapEntries.push({ type: t, routes: result.routes });
  }
  await syncSitemap(sitemapEntries);
  console.log(`\nDone. ${total} page(s) generated. Run \`npm run internal-links\` to refresh breadcrumb + internal links.`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
