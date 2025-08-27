import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const srcDir = path.resolve('img/src');
const outDir = path.resolve('img/generated');
const widths = [480, 960, 1440];

await fs.mkdir(outDir, { recursive: true });

let totalOriginal = 0;
let totalOptimized = 0;

const files = await fs.readdir(srcDir);
for (const file of files) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const inputPath = path.join(srcDir, file);
  const base = path.parse(file).name;
  const buffer = await fs.readFile(inputPath);
  const originalSize = buffer.length;
  totalOriginal += originalSize * widths.length;

  for (const width of widths) {
    const jpgOut = path.join(outDir, `${base}-${width}.jpg`);
    const webpOut = path.join(outDir, `${base}-${width}.webp`);
    const pipeline = sharp(buffer).resize({ width });
    await Promise.all([
      pipeline.clone().jpeg({ quality: 80 }).toFile(jpgOut),
      pipeline.clone().webp({ quality: 80 }).toFile(webpOut),
    ]);
    const jpgSize = (await fs.stat(jpgOut)).size;
    const webpSize = (await fs.stat(webpOut)).size;
    totalOptimized += Math.min(jpgSize, webpSize);
  }
}

const savedKB = ((totalOriginal - totalOptimized) / 1024).toFixed(1);
console.log(`Total KB saved: ${savedKB}`);

