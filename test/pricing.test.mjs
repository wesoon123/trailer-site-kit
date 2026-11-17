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
