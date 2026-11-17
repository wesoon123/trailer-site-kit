import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_ROOT, createSite } from './helpers.mjs';

test('blank phone and 24/7 fall back to the kit defaults', () => {
  const site = createSite({ phone: '', hours247: '' });
  const inputs = site.read('site-inputs.md');
  assert.match(inputs, /Phone:\s+\+1 \(800\) 443-5212/);
  assert.match(inputs, /Phone answered 24\/7:\s+yes/);
});

test('a given phone beats the default', () => {
  const site = createSite({ phone: '+1 (555) 010-0000' });
  const inputs = site.read('site-inputs.md');
  assert.match(inputs, /Phone:\s+\+1 \(555\) 010-0000/);
  assert.ok(!inputs.includes('443-5212'));
});

test('an explicit 24/7 no is respected', () => {
  const site = createSite({ hours247: 'no' });
  assert.match(site.read('site-inputs.md'), /Phone answered 24\/7:\s+no/);
});

test('form endpoint defaults to none and accepts a URL', () => {
  assert.match(createSite().read('site-inputs.md'), /Form endpoint:\s+none/);
  const withUrl = createSite({ formEndpoint: 'https://forms.example/submit' });
  assert.match(withUrl.read('site-inputs.md'), /Form endpoint:\s+https:\/\/forms\.example\/submit/);
});

test('master prompt and design explain the endpoint rule', () => {
  const prompt = readFileSync(join(KIT_ROOT, 'kit/NEW-SITE-PROMPT.md'), 'utf8');
  const design = readFileSync(join(KIT_ROOT, 'kit/DESIGN.md'), 'utf8');
  assert.match(prompt, /^Form endpoint:/m);
  assert.ok(prompt.includes('no form renders without a Form endpoint'));
  assert.ok(design.includes('no form renders without a Form endpoint'));
});
