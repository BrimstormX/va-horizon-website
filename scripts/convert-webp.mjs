import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const targets = [
  'testimonial-1.png',
  'testimonial-2.png',
  'testimonial-3.png',
  'testimonial-4.png',
  'testimonial-5.png',
  'testimonial-7.png',
  'img/crm-pipeline-view.png',
  'img/lead-details.png',
  'img/acquisition-pipeline.png',
  'img/buyer-pipeline.png',
  'img/partner-premium-look.png',
  'img/ai-inbox.jpg',
];

let before = 0;
let after = 0;
for (const rel of targets) {
  const src = path.resolve(rel);
  const out = src.replace(/\.(png|jpg)$/i, '.webp');
  const stat = await fs.stat(src);
  await sharp(src).webp({ quality: 85, effort: 6 }).toFile(out);
  const outStat = await fs.stat(out);
  before += stat.size;
  after += outStat.size;
  console.log(`${rel}  ${(stat.size / 1024).toFixed(0)}KB -> ${(outStat.size / 1024).toFixed(0)}KB`);
}
console.log(`TOTAL ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (saved ${((before - after) / 1024).toFixed(0)}KB)`);
