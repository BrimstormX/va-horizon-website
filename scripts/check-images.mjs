import fs from 'node:fs';
import path from 'node:path';

const siteRoot = path.resolve('_site');
const rasterPattern = /\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;
const remotePattern = /^(?:https?:|mailto:|tel:|data:|#)/i;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
  });
}

function parseAttributes(markup) {
  const attrs = {};
  const attrPattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>]+)))?/g;
  let match;

  while ((match = attrPattern.exec(markup))) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }

  return attrs;
}

if (!fs.existsSync(siteRoot)) {
  console.error('Build output not found. Run npm run build before npm run images:check.');
  process.exit(1);
}

const issues = [];

for (const file of walk(siteRoot)) {
  const html = fs.readFileSync(file, 'utf8');
  const imageMatches = html.matchAll(/<img\b[^>]*>/gi);

  for (const match of imageMatches) {
    const attrs = parseAttributes(match[0]);
    const src = attrs.src || attrs['data-src'] || '';

    if (!src || remotePattern.test(src) || !rasterPattern.test(src)) {
      continue;
    }

    if (!attrs.width || !attrs.height) {
      const relFile = path.relative(siteRoot, file).replaceAll(path.sep, '/');
      issues.push(`${relFile}: local image ${src} is missing width or height`);
    }
  }
}

if (issues.length > 0) {
  console.error(`Found ${issues.length} image dimension issue(s):`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('Image dimension check passed.');
