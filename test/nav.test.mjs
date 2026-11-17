import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_ROOT } from './helpers.mjs';

const NEW_NAV = 'Home | Equipment | Pricing | Service Area | Use cases | About Us | Contact Us';
const OLD_NAV = 'Home | Equipment | Service Area | Use cases | About Us | Contact Us';

function textFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'assets') continue;
      out.push(...textFiles(p));
    } else if (/\.(md|mjs|json|yaml)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = [...textFiles(join(KIT_ROOT, 'kit')), ...textFiles(join(KIT_ROOT, 'bin')), join(KIT_ROOT, 'README.md')];

test('the old six-label nav string is gone everywhere', () => {
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    assert.ok(!text.includes(OLD_NAV), `old nav in ${f}`);
    assert.ok(!/(same|exact) six (nav |navigation )?labels/i.test(text), `six-labels wording in ${f}`);
  }
});

test('prompt, design and generator carry the new nav', () => {
  for (const f of ['kit/NEW-SITE-PROMPT.md', 'kit/DESIGN.md', 'bin/new-site.mjs']) {
    assert.ok(readFileSync(join(KIT_ROOT, f), 'utf8').includes(NEW_NAV), `no new nav in ${f}`);
  }
});

test('Part D lists the pricing page and design has a pricing section', () => {
  const prompt = readFileSync(join(KIT_ROOT, 'kit/NEW-SITE-PROMPT.md'), 'utf8');
  const design = readFileSync(join(KIT_ROOT, 'kit/DESIGN.md'), 'utf8');
  assert.match(prompt, /\| Pricing \| `\/pricing\/`/);
  assert.match(prompt, /\| Contact Us \| `\/contact\/`/);
  assert.ok(design.includes('## 7c. Pricing page'));
});
