import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_ROOT } from './helpers.mjs';

const assetsDir = join(KIT_ROOT, 'kit/assets/equipment');
const slugs = Object.values(JSON.parse(readFileSync(join(KIT_ROOT, 'scripts/equipment-slugs.json'), 'utf8')));

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

test('every mapped unit folder holds at least one webp', () => {
  assert.ok(slugs.length >= 40);
  for (const slug of slugs) {
    const dir = join(assetsDir, slug);
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.webp')) : [];
    assert.ok(files.length > 0, `no webp in ${slug}`);
  }
});

test('asset names are clean', () => {
  const files = walk(join(KIT_ROOT, 'kit/assets'));
  assert.ok(files.length > 0);
  for (const f of files) {
    const name = f.slice(join(KIT_ROOT, 'kit/assets').length + 1);
    assert.ok(!/\.DS_Store|Copy of|\(1\)|[ ()]/.test(name), `unclean name ${name}`);
  }
});

test('asset folder stays under 50 MB', () => {
  const bytes = walk(assetsDir).reduce((n, f) => n + statSync(f).size, 0);
  assert.ok(bytes < 50 * 1024 * 1024, `${(bytes / 1048576).toFixed(1)} MB`);
});

import { createSite } from './helpers.mjs';

test('generated site receives the equipment photos', () => {
  const site = createSite();
  const dir = join(site.dir, 'public/equipment/24ft-mobile-kitchen');
  assert.ok(existsSync(dir));
  assert.ok(readdirSync(dir).some((f) => f.endsWith('.webp')));
});

test('no internal tier wording in asset paths', () => {
  for (const f of walk(join(KIT_ROOT, 'kit/assets'))) assert.ok(!/tier/i.test(f), `tier in ${f}`);
});

test('nested ramp photos and distinct "(1)" photos are kept', () => {
  const bulk = readdirSync(join(assetsDir, '40ft-bulk-kitchen'));
  assert.ok(bulk.filter((f) => f.startsWith('ramps-')).length >= 7, 'ramp photos missing');
  assert.ok(bulk.includes('layout1.webp') && bulk.includes('layout1-2.webp'), 'Layout1 (1) dropped');
  const cmd = readdirSync(join(assetsDir, 'command-center'));
  assert.ok(cmd.includes('mobile-command-center-trailer-exterior-2.webp'), 'exterior (1) dropped');
});
