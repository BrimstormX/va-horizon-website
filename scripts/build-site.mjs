import { promises as fs } from 'fs';
import path from 'path';

const rootDir = process.cwd();
const outDir = path.join(rootDir, '_site');

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
  '.eslintrc.json',
  '.htmlhintrc',
  '.stylelintrc.json',
  'ACTION-PLAN.md',
  'CLAUDE.md',
  'COMPETITOR-ANALYSIS.md',
  'CONTENT-CALENDAR.md',
  'DESIGN_SYSTEM.md',
  'FULL-AUDIT-REPORT.md',
  'GEO-ANALYSIS.md',
  'SEO-STRATEGY.md',
  'SECURITY_HEADERS.md',
  'SITE-STRUCTURE.md',
  'axe-report.json',
  'index_formatted.html',
  'link-report.json',
  'lighthouse-report.html',
  'lighthouse-report.json',
  'lighthouserc.json',
  'package-lock.json',
  'package.json',
  'schema-audit-report.md',
  'tailwind.config.js',
  'update_css.py',
  'update_header.py',
  'update_links.py',
  'va-horizon-operations.md',
]);

const excludedScriptFiles = new Set([
  'build-site.mjs',
  'image-pipeline.mjs',
]);

const requiredRoutes = [
  'index.html',
  'about/index.html',
  'ai-automations/index.html',
  'apply/index.html',
  'blog/index.html',
  'case-studies/index.html',
  'crm/index.html',
  'guides/index.html',
  'industries/real-estate/index.html',
  'tools/index.html',
];

const cspMeta = `<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    base-uri 'self';
    object-src 'none';
    img-src 'self' data: https:;
    script-src 'self' https://plausible.io;
    style-src 'self' 'unsafe-inline' https:;
    font-src 'self' https: data:;
    media-src 'self';
    worker-src 'self';
    connect-src 'self' https://formsubmit.co https://plausible.io;
    form-action 'self' https://formsubmit.co;
  ">`;

const fontPreloads = [
  '<link rel="preload" href="/fonts/montserrat-600-normal.woff2" as="font" type="font/woff2" crossorigin>',
  '<link rel="preload" href="/fonts/montserrat-700-normal.woff2" as="font" type="font/woff2" crossorigin>',
];

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function isExcluded(relativePath, dirent) {
  const parts = relativePath.split(path.sep);
  const fileName = parts.at(-1);

  if (parts.some(part => excludedDirs.has(part))) return true;
  if (parts.length === 1 && excludedRootFiles.has(fileName)) return true;
  if (parts.length === 1 && /^Screenshot\s.+\.png$/i.test(fileName)) return true;
  if (parts.length === 1 && /^.*\.md$/i.test(fileName)) return true;
  if (parts[0] === 'scripts' && excludedScriptFiles.has(fileName)) return true;
  if (dirent.isFile() && fileName.endsWith('.map')) return true;

  return false;
}

function injectBeforeHeadEnd(html, snippet) {
  if (html.includes(snippet)) return html;
  return html.replace(/<\/head>/i, `${snippet}\n</head>`);
}

function normalizeHead(html) {
  let next = html;

  next = next.replace(
    /<link\s+rel=["']preload["']\s+href=["']\/?VAHorizonWebsiteStyle\/_components\/v1\/[^"']+\.js["'][^>]*>\s*/gi,
    '',
  );
  next = next.replace(
    /<link\s+rel=["']preload["']\s+href=["']\/?VAHorizonWebsiteStyle\/_json\/[^"']+\.json["'][^>]*>\s*/gi,
    '',
  );

  next = next.replace(
    /<link\s+rel=["']apple-touch-icon["']\s+sizes=["']180x180["']\s+href=["']\/?apple-touch-icon\.png["']\s*>/gi,
    '<link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png">',
  );

  if (!/http-equiv=["']Content-Security-Policy["']/i.test(next)) {
    next = injectBeforeHeadEnd(next, cspMeta);
  }

  if (next.includes('/fonts.css')) {
    for (const preload of fontPreloads) {
      if (!next.includes(preload)) {
        next = next.replace(/<link\s+rel=["']stylesheet["']\s+href=["']\/fonts\.css["']\s*>/i, `${preload}\n$&`);
      }
    }
  }

  return next;
}

async function removeOutput() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
}

async function copyPublicFiles(currentDir = rootDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  let copiedFiles = 0;
  let copiedHtml = 0;

  for (const entry of entries) {
    const sourcePath = path.join(currentDir, entry.name);
    const relativePath = path.relative(rootDir, sourcePath);

    if (isExcluded(relativePath, entry)) continue;

    const targetPath = path.join(outDir, relativePath);

    if (entry.isDirectory()) {
      const result = await copyPublicFiles(sourcePath);
      copiedFiles += result.copiedFiles;
      copiedHtml += result.copiedHtml;
      continue;
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    if (entry.name.endsWith('.html')) {
      const html = await fs.readFile(sourcePath, 'utf8');
      await fs.writeFile(targetPath, normalizeHead(html), 'utf8');
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
    copiedFiles += 1;
    if (entry.name.endsWith('.html')) copiedHtml += 1;
  }

  return { copiedFiles, copiedHtml };
}

async function assertRequiredRoutes() {
  const missing = [];

  for (const route of requiredRoutes) {
    try {
      await fs.access(path.join(outDir, route));
    } catch {
      missing.push(route);
    }
  }

  if (missing.length) {
    throw new Error(`Generated site is missing required routes: ${missing.join(', ')}`);
  }
}

async function writeBuildManifest(stats) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    publicDir: '_site',
    copiedFiles: stats.copiedFiles,
    copiedHtml: stats.copiedHtml,
    requiredRoutes: requiredRoutes.map(toPosix),
  };

  await fs.writeFile(
    path.join(outDir, 'build-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
}

await removeOutput();
const stats = await copyPublicFiles();
await assertRequiredRoutes();
await writeBuildManifest(stats);

console.log(`Built _site with ${stats.copiedFiles} public files (${stats.copiedHtml} HTML pages).`);
