import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_ROOT } from './helpers.mjs';

const a = join(KIT_ROOT, 'kit/skills/state-trailer-equipment-pages-builder/references/super-9-equipment-directory.md');
const b = join(KIT_ROOT, 'kit/skills/state-trailer-service-area-builder/references/super-9-equipment-directory.md');
const text = readFileSync(a, 'utf8');

test('both directory copies are byte-identical', () => {
  assert.ok(readFileSync(a).equals(readFileSync(b)));
});

test('Remote Man Camp stays Super 9 #9', () => {
  assert.match(text, /## 9\. Remote Man Camp Basecamp/);
});

test('Handwashing Trailers is listed as an extra with spec pending units', () => {
  assert.match(text, /Handwashing Trailers/);
  assert.match(text, /Specs: spec pending/);
});

test('directory holds no internal sheet data', () => {
  for (const bad of ['Markup', 'winning', '47QSMS25D00AM']) {
    assert.ok(!text.includes(bad), `found ${bad}`);
  }
});

test('conflicts list records the sheet-versus-directory rate gap and the C6 update', () => {
  assert.match(text, /\*\*C7 /);
  assert.match(text, /per person, per day/);
});
