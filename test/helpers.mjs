import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const KIT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const BASE_INPUTS = {
  brand: 'Test Co',
  domain: 'testco.example',
  homeState: 'Florida',
  primary: 1,
};

export function createSite(overrides = {}) {
  const tmp = mkdtempSync(join(tmpdir(), 'trailer-kit-'));
  const inputs = join(tmp, 'inputs.json');
  writeFileSync(inputs, JSON.stringify({ ...BASE_INPUTS, ...overrides }));
  const dir = join(tmp, 'site');
  execFileSync(process.execPath, [join(KIT_ROOT, 'bin', 'new-site.mjs'), 'create', dir, '--inputs', inputs], {
    stdio: 'pipe',
  });
  return {
    dir,
    read: (rel) => readFileSync(join(dir, rel), 'utf8'),
    exists: (rel) => existsSync(join(dir, rel)),
  };
}
