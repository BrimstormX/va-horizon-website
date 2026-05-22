import { promises as fs } from 'fs';
import path from 'path';

const rootDir = process.cwd();
const fontsCssPath = path.join(rootDir, 'fonts.css');
const fontsDir = path.join(rootDir, 'fonts');

const css = await fs.readFile(fontsCssPath, 'utf8');
const facePattern = /@font-face\s*\{[\s\S]*?\}/g;
const faces = css.match(facePattern) || [];

if (!faces.length) {
  throw new Error('No @font-face declarations found in fonts.css.');
}

await fs.mkdir(fontsDir, { recursive: true });

const nextCss = [];

for (const face of faces) {
  const weight = face.match(/font-weight:\s*([^;]+);/)?.[1]?.trim();
  const style = face.match(/font-style:\s*([^;]+);/)?.[1]?.trim() || 'normal';
  const display = face.match(/font-display:\s*([^;]+);/)?.[1]?.trim() || 'swap';
  const unicodeRange = face.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim();
  const data = face.match(/src:\s*url\(['"]?data:font\/woff2;base64,([^'")]+)['"]?\)\s*format\(['"]woff2['"]\);/);

  if (!weight || !data) {
    throw new Error(`Unable to parse font-face declaration:\n${face}`);
  }

  const fileName = `montserrat-${weight}-${style}.woff2`;
  await fs.writeFile(path.join(fontsDir, fileName), Buffer.from(data[1], 'base64'));

  const lines = [
    '@font-face {',
    "  font-family: 'Montserrat';",
    `  font-style: ${style};`,
    `  font-weight: ${weight};`,
    `  font-display: ${display};`,
    `  src: url('/fonts/${fileName}') format('woff2');`,
  ];

  if (unicodeRange) {
    lines.push(`  unicode-range: ${unicodeRange};`);
  }

  lines.push('}');
  nextCss.push(lines.join('\n'));
}

await fs.writeFile(fontsCssPath, `${nextCss.join('\n\n')}\n`, 'utf8');

console.log(`Extracted ${faces.length} Montserrat font files to /fonts and rewrote fonts.css.`);
