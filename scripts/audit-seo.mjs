import { promises as fs } from 'fs';
import path from 'path';

const rootDir = process.cwd();
const siteOrigin = 'https://www.vahorizon.site';

const excludedDirs = new Set([
  '.agents',
  '.claude',
  '.git',
  '.github',
  '.vscode',
  '_site',
  'content',
  'docs',
  'node_modules',
  'src',
]);

const excludedRootFiles = new Set([
  'index_formatted.html',
  'lighthouse-report.html',
]);

const expectedFaqRoutes = new Set([
  '/ai-automations/',
  '/crm/',
  '/industries/real-estate/',
  '/meet-your-va/',
  '/tools/cold-call-volume-calculator/',
  '/tools/mao-calculator/',
  '/tools/sms-compliance-checker/',
  '/tools/va-vs-in-house-cost-calculator/',
  '/tools/wholesale-deal-roi-calculator/',
  '/tools/wholesaling-startup-budget-calculator/',
]);

const htmlFiles = [];
const issues = [];
const warnings = [];
const sitemapRoutes = new Set();
const canonicalRoutes = new Set();

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function routeFromRelative(relativePath) {
  const rel = toPosix(relativePath);
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

function getAttr(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, 'i');
  return tag.match(pattern)?.[2] ?? '';
}

function firstMatch(html, regex) {
  return html.match(regex)?.[1]?.trim() ?? '';
}

function routeFromUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname.endsWith('/') ? parsed.pathname : `${parsed.pathname}/`;
  } catch {
    return '';
  }
}

function sourcePathForRoute(route) {
  if (route === '/') return path.join(rootDir, 'index.html');
  return path.join(rootDir, route.replace(/^\/|\/$/g, ''), 'index.html');
}

function hasNoindex(html) {
  const robotsTags = html.match(/<meta\b[^>]*(?:name|property)=["']robots["'][^>]*>/gi) ?? [];
  return robotsTags.some(tag => /content=["'][^"']*noindex/i.test(tag));
}

function isRefreshRedirect(html) {
  return /<meta\b[^>]*http-equiv=["']refresh["'][^>]*>/i.test(html);
}

function isLikelyBrandImage(src, alt, tag) {
  const haystack = `${src} ${alt} ${tag}`.toLowerCase();
  return [
    'logo',
    'va-horizon.png',
    'tagline',
    'favicon',
    'apple-touch-icon',
  ].some(token => haystack.includes(token));
}

function auditLinks(html, rel) {
  const anchors = html.match(/<a\b[^>]*>/gi) ?? [];
  for (const anchor of anchors) {
    const target = getAttr(anchor, 'target').toLowerCase();
    if (target !== '_blank') continue;

    const relAttr = getAttr(anchor, 'rel').toLowerCase();
    if (!relAttr.split(/\s+/).includes('noopener')) {
      issues.push(`${rel}: target="_blank" link is missing rel="noopener"`);
    }
  }
}

function auditImages(html, rel) {
  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  for (const image of images) {
    const src = getAttr(image, 'src');
    if (!src || src.startsWith('data:')) continue;
    if (getAttr(image, 'id') === 'lightbox-img') continue;

    const alt = getAttr(image, 'alt');
    if (isLikelyBrandImage(src, alt, image)) continue;
    if (/\bloading\s*=|fetchpriority\s*=/i.test(image)) continue;

    warnings.push(`${rel}: content image ${src} has no loading or fetchpriority signal`);
  }
}

function auditJsonLd(html, rel) {
  const scripts = html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const parsed = [];

  for (const [index, match] of Array.from(scripts).entries()) {
    const body = match[1].trim();
    if (!body) {
      issues.push(`${rel}: JSON-LD script ${index + 1} is empty`);
      continue;
    }

    try {
      parsed.push(JSON.parse(body));
    } catch (error) {
      issues.push(`${rel}: JSON-LD script ${index + 1} is invalid JSON (${error.message})`);
    }
  }

  return parsed;
}

function hasInteractiveFaq(html) {
  const hasFaqAnchor = /\bid=["']faq["']/i.test(html);
  const hasAccordionControl = /data-slot=["']accordion-trigger["']/i.test(html)
    || /<details\b/i.test(html)
    || /<button\b[^>]*class=["'][^"']*\bfaq-trigger\b/i.test(html);

  return hasFaqAnchor && hasAccordionControl;
}

function auditPage(html, filePath) {
  const rel = toPosix(path.relative(rootDir, filePath));
  const route = routeFromRelative(rel);
  const expectedCanonical = `${siteOrigin}${route}`;
  const noindex = hasNoindex(html);
  const redirect = isRefreshRedirect(html);
  const jsonLd = auditJsonLd(html, rel);

  if (redirect && !noindex) {
    issues.push(`${rel}: redirect page is missing noindex`);
  }

  auditLinks(html, rel);
  auditImages(html, rel);

  if (noindex || redirect) return;

  const canonical = firstMatch(html, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  const ogUrl = firstMatch(html, /<meta\b[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/i);

  if (!canonical) {
    issues.push(`${rel}: canonical URL is missing`);
  } else if (canonical !== expectedCanonical) {
    issues.push(`${rel}: canonical URL ${canonical} does not match route ${expectedCanonical}`);
  } else {
    canonicalRoutes.add(route);
  }

  if (!ogUrl) {
    issues.push(`${rel}: og:url is missing`);
  } else if (canonical && ogUrl !== canonical) {
    issues.push(`${rel}: og:url ${ogUrl} does not match canonical ${canonical}`);
  }

  if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html)) {
    issues.push(`${rel}: meta description is missing`);
  }

  if (!/<meta\b[^>]*name=["']twitter:card["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html)) {
    issues.push(`${rel}: Twitter card is missing`);
  }

  if (!/<meta\b[^>]*property=["']og:image["'][^>]*content=["'][^"']+["'][^>]*>/i.test(html)) {
    issues.push(`${rel}: OG image is missing`);
  }

  if (route !== '/' && !hasSchemaType(jsonLd, 'BreadcrumbList')) {
    issues.push(`${rel}: BreadcrumbList schema is missing`);
  }

  // FAQPage rich results have been restricted to gov/health sites since Aug 2023.
  // The schema is inert-not-harmful and still aids AEO parsing, so it is no longer
  // mandated by the build gate (de-coupled). Informational warning only.
  if (expectedFaqRoutes.has(route) && !hasSchemaType(jsonLd, 'FAQPage')) {
    warnings.push(`${rel}: FAQPage schema not present (no longer required)`);
  }

  if (expectedFaqRoutes.has(route) && !hasInteractiveFaq(html)) {
    warnings.push(`${rel}: dynamic FAQ accordion markup not present`);
  }
}

function getSchemaNodes(node) {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(getSchemaNodes);

  const nodes = [node];
  if (Array.isArray(node['@graph'])) nodes.push(...node['@graph'].flatMap(getSchemaNodes));
  return nodes;
}

function hasSchemaType(jsonLd, schemaType) {
  return jsonLd
    .flatMap(getSchemaNodes)
    .some(node => {
      const type = node['@type'];
      return Array.isArray(type) ? type.includes(schemaType) : type === schemaType;
    });
}

async function auditSitemap() {
  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  let xml;
  try {
    xml = await fs.readFile(sitemapPath, 'utf8');
  } catch {
    issues.push('sitemap.xml: file is missing');
    return;
  }

  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map(match => match[1].trim());
  const seen = new Set();

  for (const loc of locs) {
    if (seen.has(loc)) issues.push(`sitemap.xml: duplicate URL ${loc}`);
    seen.add(loc);

    if (!loc.startsWith(`${siteOrigin}/`) && loc !== `${siteOrigin}/`) {
      issues.push(`sitemap.xml: URL is not on ${siteOrigin}: ${loc}`);
      continue;
    }

    const route = routeFromUrl(loc);
    if (!route || !route.endsWith('/')) {
      issues.push(`sitemap.xml: URL must use a trailing slash: ${loc}`);
      continue;
    }

    sitemapRoutes.add(route);

    try {
      await fs.access(sourcePathForRoute(route));
    } catch {
      issues.push(`sitemap.xml: ${loc} has no matching source index.html`);
    }
  }
}

async function auditRobots() {
  const robotsPath = path.join(rootDir, 'robots.txt');
  let robots;
  try {
    robots = await fs.readFile(robotsPath, 'utf8');
  } catch {
    issues.push('robots.txt: file is missing');
    return;
  }

  if (!new RegExp(`^Sitemap:\\s*${siteOrigin.replace(/\./g, '\\.')}\\/sitemap\\.xml\\s*$`, 'mi').test(robots)) {
    issues.push('robots.txt: Sitemap directive is missing or does not match the canonical sitemap URL');
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(rootDir, fullPath);
    const parts = relative.split(path.sep);

    if (parts.some(part => excludedDirs.has(part))) continue;
    if (parts.length === 1 && excludedRootFiles.has(entry.name)) continue;

    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

await auditSitemap();
await auditRobots();
await walk(rootDir);

for (const filePath of htmlFiles.sort()) {
  const html = await fs.readFile(filePath, 'utf8');
  auditPage(html, filePath);
}

for (const route of [...canonicalRoutes].sort()) {
  if (!sitemapRoutes.has(route)) {
    issues.push(`${route}: canonical route is missing from sitemap.xml`);
  }
}

for (const route of [...sitemapRoutes].sort()) {
  if (!canonicalRoutes.has(route)) {
    issues.push(`sitemap.xml: ${route} is not represented by a matching canonical source page`);
  }
}

if (warnings.length) {
  console.warn(`SEO audit warnings (${warnings.length}):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (issues.length) {
  console.error(`SEO audit failed with ${issues.length} blocking issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`SEO audit passed: checked ${htmlFiles.length} HTML files with 0 blocking issues.`);
