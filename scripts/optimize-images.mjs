// One-off web image optimizer.
// Resizes oversized photos and recompresses them IN PLACE (same filenames,
// same formats) so existing references keep working. Run: node scripts/optimize-images.mjs
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const TARGETS = ['public/images/gallery', 'src/assets/images'];
const MAX_WIDTH = 1600; // plenty for full-bleed display + retina
const JPEG_OPTS = { quality: 78, mozjpeg: true, progressive: true };
const PNG_OPTS = { compressionLevel: 9, palette: true };
const WEBP_OPTS = { quality: 78 };

const exts = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const fmt = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`;

let beforeTotal = 0;
let afterTotal = 0;
let count = 0;

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext)) return;

  try {
    const input = await readFile(file); // read fully so no handle is held on the file
    const before = input.length;

    const img = sharp(input, { failOn: 'none' }).rotate(); // honor EXIF orientation
    const meta = await img.metadata();
    if (meta.width && meta.width > MAX_WIDTH) {
      img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    if (ext === '.png') img.png(PNG_OPTS);
    else if (ext === '.webp') img.webp(WEBP_OPTS);
    else img.jpeg(JPEG_OPTS);

    const output = await img.toBuffer();

    // Only keep the optimized version if it is actually smaller.
    if (output.length < before) {
      await writeFile(file, output);
      beforeTotal += before;
      afterTotal += output.length;
      count++;
      console.log(`  ${path.basename(file)}  ${fmt(before)} -> ${fmt(output.length)}`);
    }
  } catch (err) {
    console.warn(`  ! skipped ${path.basename(file)}: ${err.message}`);
  }
}

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else await processFile(full);
  }
}

for (const target of TARGETS) {
  console.log(`\nOptimizing ${target} ...`);
  await walk(target);
}

console.log(
  `\nDone. Optimized ${count} files: ${fmt(beforeTotal)} -> ${fmt(afterTotal)} ` +
    `(saved ${fmt(beforeTotal - afterTotal)})`
);
