import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSite } from './helpers.mjs';

test('generator creates a site with inputs, prompt and calculator skill', () => {
  const site = createSite();
  assert.ok(site.exists('site-inputs.md'));
  assert.ok(site.exists('NEW-SITE-PROMPT.md'));
  assert.ok(site.exists('.agents/skills/state-trailer-calculator-builder/SKILL.md'));
});
