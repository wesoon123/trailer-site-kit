import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_ROOT, createSite } from './helpers.mjs';

const skillDir = join(KIT_ROOT, 'kit/skills/state-trailer-directories-builder');
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const checks = read(join(skillDir, 'references/directory-checks.md'));

test('directory check file lists all 20 checked directories with a checked date', () => {
  assert.match(checks, /^Checked: \d{4}-\d{2}-\d{2}$/m);
  for (const name of ['2FindLocal', 'MerchantCircle', 'Hotfrog', 'Brownbook', 'Cylex', 'EZlocal', 'YPLocal', 'All.biz', 'Insider Pages', 'ChamberofCommerce.com', 'Manta', 'Yellow Pages', 'Superpages', 'ThreeBestRated', 'Company.com', 'APSense', 'MapQuest', 'HERE', 'Data Axle', 'Kompass']) {
    assert.ok(checks.includes(name), `missing ${name}`);
  }
});

test('only emails literally seen on a directory site are listed', () => {
  const found = checks.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? [];
  assert.deepEqual([...new Set(found)], ['support@merchantcircle.com']);
});

test('skill refuses to claim a no-account directory and never submits', () => {
  const skill = read(join(skillDir, 'SKILL.md'));
  for (const want of ['no account', 'never submit', 'CAPTCHA', 'Cloudflare', 'literally shown']) {
    assert.ok(skill.includes(want), `missing ${want}`);
  }
});

test('/directories-trailer-kit command points to the skill', () => {
  assert.match(read(join(KIT_ROOT, 'kit/commands/directories-trailer-kit.md')), /state-trailer-directories-builder/);
});

test('generated site gets the directories skill and command', () => {
  const site = createSite();
  assert.ok(site.exists('.agents/skills/state-trailer-directories-builder/SKILL.md'));
  assert.ok(site.exists('.claude/commands/directories-trailer-kit.md'));
});
