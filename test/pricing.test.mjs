import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_ROOT } from './helpers.mjs';

const skillDir = join(KIT_ROOT, 'kit/skills/state-trailer-pricing-builder');
const sourcePath = join(skillDir, 'references/pricing-source.md');
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');

test('price snapshot has a snapshot date line', () => {
  assert.match(read(sourcePath), /^Snapshot date: \d{4}-\d{2}-\d{2}$/m);
});

test('price snapshot holds no internal sheet data', () => {
  const text = read(sourcePath);
  for (const bad of ['winning', 'Markup', '47QSMS25D00AM', '$10,998.59', 'PROMO', 'Tier 2', 'Pharmaceutical']) {
    assert.ok(!text.includes(bad), `found ${bad}`);
  }
});

test('price snapshot keeps sheet text exactly as written', () => {
  const text = read(sourcePath);
  for (const want of ['1-6 Days', '8 Days-14 days', '15days-1 month', 'More than 3 Months', '5995 to 7995', '3995-5995']) {
    assert.ok(text.includes(want), `missing ${want}`);
  }
});

test('pricing skill states fallback, quote rule and never-published tabs', () => {
  const text = read(join(skillDir, 'SKILL.md'));
  for (const want of ['sheet unreachable', 'Request a quote', 'Government', 'never published']) {
    assert.ok(text.includes(want), `missing ${want}`);
  }
});

test('/price-trailer command points to the pricing skill', () => {
  const text = read(join(KIT_ROOT, 'kit/commands/price-trailer.md'));
  assert.match(text, /state-trailer-pricing-builder/);
});

import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { createSite } from './helpers.mjs';

test('generated site gets the pricing skill, command and pricing.json fields', () => {
  const site = createSite();
  assert.ok(site.exists('.claude/commands/price-trailer.md'));
  assert.ok(site.exists('.agents/skills/state-trailer-pricing-builder/SKILL.md'));
  const pricing = JSON.parse(site.read('src/data/pricing.json'));
  assert.deepEqual(Object.keys(pricing.snapshot).sort(), ['date', 'source']);
  assert.ok(Array.isArray(pricing.addOns));
  assert.equal(pricing.categories.length, 9);
  for (const c of pricing.categories) assert.ok(Array.isArray(c.rates), `no rates on ${c.label}`);
});

test('sync restores a deleted command and the equipment photos', () => {
  const site = createSite();
  rmSync(join(site.dir, '.claude/commands/price-trailer.md'));
  rmSync(join(site.dir, 'public/equipment'), { recursive: true });
  execFileSync(process.execPath, [join(KIT_ROOT, 'bin', 'new-site.mjs'), 'sync', site.dir], { stdio: 'pipe' });
  assert.ok(site.exists('.claude/commands/price-trailer.md'));
  assert.ok(site.exists('public/equipment/24ft-mobile-kitchen'));
});

test('kit version is 1.7.0', () => {
  assert.equal(JSON.parse(readFileSync(join(KIT_ROOT, 'package.json'), 'utf8')).version, '1.7.0');
});
