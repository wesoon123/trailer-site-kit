// One-time (re-runnable) converter: team photo folders -> kit/assets/equipment/<slug>/*.webp
// Usage: node scripts/build-equipment-assets.mjs "<folder that holds the unit folders>"
import { mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'kit', 'assets', 'equipment');
const source = process.argv[2];
if (!source) {
  console.error('Give the photo folder, e.g. node scripts/build-equipment-assets.mjs "C:\Downloads\Equipments"');
  process.exit(1);
}
const slugs = JSON.parse(await readFile(join(ROOT, 'scripts', 'equipment-slugs.json'), 'utf8'));

const clean = (file) =>
  file
    .slice(0, file.length - extname(file).length)
    .replace(/^Copy of\s+/i, '')
    .replace(/\s*\(\d+\)\s*$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

await rm(OUT, { recursive: true, force: true });
let count = 0;
for (const [folder, slug] of Object.entries(slugs)) {
  const files = (await readdir(join(source, folder))).filter((f) => /\.(png|jpe?g)$/i.test(f));
  const seen = new Set();
  await mkdir(join(OUT, slug), { recursive: true });
  for (const file of files) {
    const name = clean(file);
    if (!name || seen.has(name)) continue; // drops "Copy of ..." and "(1)" duplicates
    seen.add(name);
    await sharp(join(source, folder, file))
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(join(OUT, slug, `${name}.webp`));
    count++;
  }
}
console.log(`Wrote ${count} images for ${Object.keys(slugs).length} units to ${OUT}`);
