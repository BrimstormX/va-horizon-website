import { promises as fs } from 'fs';
import path from 'path';

const rootDir = process.cwd();
const htmlFiles = [];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(rootDir, fullPath);
    const parts = relative.split(path.sep);

    if (parts.some(part => ['.git', '_site', 'node_modules'].includes(part))) continue;

    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

function hardenHtml(html, filePath) {
  let next = html;
  const rel = path.relative(rootDir, filePath).split(path.sep).join('/');
  const route = rel === 'index.html'
    ? '/'
    : rel.endsWith('/index.html')
      ? `/${rel.slice(0, -'index.html'.length)}`
      : `/${rel}`;

  next = next.replaceAll('"url": "https://www.vahorizon.site"', '"url": "https://www.vahorizon.site/"');
  next = next.replaceAll('"url":"https://www.vahorizon.site"', '"url":"https://www.vahorizon.site/"');

  next = next.replaceAll(
    '"@type":"Organization","name":"VA Horizon"',
    '"@type":"Organization","@id":"https://www.vahorizon.site/#organization","name":"VA Horizon"',
  );
  next = next.replaceAll(
    '"@type": "Organization", "name": "VA Horizon"',
    '"@type": "Organization", "@id": "https://www.vahorizon.site/#organization", "name": "VA Horizon"',
  );
  next = next.replaceAll(
    '"@type": "Organization",\n          "name": "VA Horizon"',
    '"@type": "Organization",\n          "@id": "https://www.vahorizon.site/#organization",\n          "name": "VA Horizon"',
  );

  if (rel.startsWith('blog/')) {
    next = next.replaceAll(
      '"author": { "@type": "Organization", "name": "VA Horizon", "url": "https://www.vahorizon.site/" }',
      '"author": { "@type": "Person", "name": "Youssef Ahmed", "url": "https://www.vahorizon.site/about/", "sameAs": "https://www.linkedin.com/in/youssef-ahmed-255966380/" }',
    );
    next = next.replaceAll('By VA Horizon Team', 'By Youssef Ahmed');
    next = next.replaceAll('By VA Horizon', 'By Youssef Ahmed');
  }

  if (rel.startsWith('locations/') && rel.endsWith('/index.html')) {
    const canonicalUrl = `https://www.vahorizon.site${route}`;
    next = next.replace(
      /https:\/\/www\.vahorizon\.site\/industries\/real-estate\/cold-calling-va-([^/"<]+)\//g,
      canonicalUrl,
    );
    next = next.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][^"']+["']\s*>/i,
      `<link rel="canonical" href="${canonicalUrl}">`,
    );
    next = next.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][^"']+["']\s*>/i,
      `<meta property="og:url" content="${canonicalUrl}">`,
    );
  }

  next = next.replaceAll('xmlns="http://www.w3.org/1999/xhtml" ', '');

  return next;
}

async function cleanSitemap() {
  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  let xml = await fs.readFile(sitemapPath, 'utf8');
  xml = xml
    .replace(/^\s*<changefreq>.*?<\/changefreq>\r?\n/gm, '')
    .replace(/^\s*<priority>.*?<\/priority>\r?\n/gm, '');
  await fs.writeFile(sitemapPath, xml, 'utf8');
}

await walk(rootDir);

let changed = 0;
for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  const next = hardenHtml(html, file);
  if (next !== html) {
    await fs.writeFile(file, next, 'utf8');
    changed += 1;
  }
}

await cleanSitemap();

console.log(`SEO hardening updated ${changed} HTML files and cleaned sitemap.xml.`);
