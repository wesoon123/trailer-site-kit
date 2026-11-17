// One-time (re-runnable) converter: team photo folders -> kit/assets/equipment/<slug>/*.webp
// Usage: node scripts/build-equipment-assets.mjs "<folder that holds the unit folders>"
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'kit', 'assets', 'equipment');
const source = process.argv[2];
if (!source) {
  console.error('Give the photo folder, e.g. node scripts/build-equipment-assets.mjs "C:/Downloads/Equipments"');
  process.exit(1);
}
const slugs = JSON.parse(await readFile(join(ROOT, 'scripts', 'equipment-slugs.json'), 'utf8'));

const clean = (file) =>
  file
    .slice(0, file.length - extname(file).length)
    .replace(/(^|[\/])Copy of\s+/gi, '$1')
    .replace(/\s*\(\d+\)\s*$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function listImages(dir) {
  const found = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) found.push(...(await listImages(p)));
    else if (/\.(png|jpe?g)$/i.test(e.name)) found.push(p);
  }
  return found.sort();
}

await rm(OUT, { recursive: true, force: true });
let count = 0;
for (const [folder, slug] of Object.entries(slugs)) {
  const root = join(source, folder);
  const hashes = new Set();
  const names = new Set();
  await mkdir(join(OUT, slug), { recursive: true });
  for (const file of await listImages(root)) {
    const hash = createHash('md5').update(await readFile(file)).digest('hex');
    if (hashes.has(hash)) continue; // same picture twice ("Copy of ...", "(1)"): keep one
    hashes.add(hash);
    // nested folders become a name prefix (Ramps/a.png -> ramps-a.webp); a different picture with the same name gets -2, -3
    const base = clean(relative(root, file));
    if (!base) continue;
    let name = base;
    for (let n = 2; names.has(name); n++) name = `${base}-${n}`;
    names.add(name);
    await sharp(file)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(join(OUT, slug, `${name}.webp`));
    count++;
  }
}
console.log(`Wrote ${count} images for ${Object.keys(slugs).length} units to ${OUT}`);
