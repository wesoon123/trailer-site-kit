#!/usr/bin/env node
// new-trailer-site: start or update a trailer rental website repo with the team kit
// (skills, master prompt, design, site inputs, data skeletons). No dependencies; Node 18.17+.

import { createInterface } from 'node:readline/promises';
import process from 'node:process';
import { cp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KIT = join(ROOT, 'kit');
const PKG = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));

const SUPER9 = [
  'Mobile Commercial Kitchen / Portable Kitchen',
  'Commercial Dishwashing / Commercial Dishwashing Machine',
  'Refrigerated / Portable Refrigerated / Walk-in Cooler & Freezer',
  'Shower & Restroom Bathroom Combination',
  'Shower / Mobile Shower / Portable Shower',
  'Restroom Bathroom / Portable Restroom Bathroom',
  'Laundry / Mobile Laundry / Portable Laundry',
  'Sleeper / Bunkbed / Portable Sleeper',
  'Remote Man Camp Basecamp / Remote Workforce Housing',
];

const STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'],
  ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'],
  ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'],
  ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'],
  ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
];

const FILL = '[FILL IN]';

const USAGE = `new-trailer-site ${PKG.version}

Start a new trailer rental website repo, or update an existing one, with the team kit.

Usage:
  new-trailer-site create <folder> [--next] [--inputs <file.json>] [--force]
  new-trailer-site sync <folder> [--design]

create   Make <folder> (or add to an existing project) with:
           .agents/skills/        the three page-building skills
           NEW-SITE-PROMPT.md     master prompt with the build phases
           DESIGN.md              visual direction
           AGENTS.md, CLAUDE.md   tell Codex and Claude to read the kit first
           site-inputs.md         this site's details (asked for, or read from --inputs)
           src/data/...           USA map and service-area data skeletons
         --next     also set up a Next.js App Router + TypeScript project first
         --inputs   read the site details from a JSON file instead of asking
         --force    overwrite an existing site-inputs.md, DESIGN.md and data skeletons

sync     Update an existing site to the latest kit: skills and NEW-SITE-PROMPT.md.
         Never touches site-inputs.md or src/data.
         --design   also replace DESIGN.md (otherwise a customized DESIGN.md is kept)

Examples:
  new-trailer-site create temp123-prompt --next
  new-trailer-site create temp123-prompt --next --inputs examples/temp123-prompt.inputs.json
  new-trailer-site sync ../temp123-prompt
`;

// ---------- helpers ----------

function fail(message) {
  console.error(`\nError: ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const out = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--inputs') {
      out.flags.inputs = argv[i + 1];
      i += 1;
    } else if (a.startsWith('--')) {
      out.flags[a.slice(2)] = true;
    } else if (a === '-h') {
      out.flags.help = true;
    } else {
      out._.push(a);
    }
  }
  return out;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findState(value) {
  const v = String(value || '').trim().toLowerCase();
  return STATES.find(([abbr, name]) => abbr.toLowerCase() === v || name.toLowerCase() === v) || null;
}

function superNumber(value) {
  const n = Number(String(value).trim().replace('#', ''));
  return Number.isInteger(n) && n >= 1 && n <= 9 ? n : null;
}

const FIELDS = [
  { key: 'brand', label: 'Brand name', required: true },
  { key: 'domain', label: 'Production domain (https://...)', required: true },
  { key: 'previewUrl', label: 'Preview URL' },
  {
    key: 'scope',
    label: 'Site scope: national or state',
    def: () => 'national',
    check: (v) => ['national', 'state'].includes(v.toLowerCase()) || 'Type national or state.',
  },
  {
    key: 'homeState',
    label: 'Home state (name or 2-letter code)',
    required: true,
    check: (v) => Boolean(findState(v)) || 'Not a U.S. state or DC.',
  },
  { key: 'dispatch', label: 'Verified dispatch locations (e.g. City, ST)' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  {
    key: 'primary',
    label: 'Primary service, Super 9 number',
    required: true,
    check: (v) => Boolean(superNumber(v)) || 'Type a number from 1 to 9.',
  },
  {
    key: 'secondary',
    label: 'Secondary service, Super 9 number (blank for none)',
    check: (v) => v === '' || Boolean(superNumber(v)) || 'Type a number from 1 to 9, or leave blank.',
  },
  { key: 'split', label: 'Keyword split primary / secondary / other', def: () => '70 / 15 / 15' },
  { key: 'units', label: 'Units you rent and where (blank to fill in later)' },
  { key: 'extraRates', label: 'Rates not in the equipment directory (blank for none)' },
  {
    key: 'homepageMap',
    label: 'Homepage map: USA incident map or state map',
    def: (a) => (a.scope === 'state' ? 'state map' : 'USA incident map'),
  },
  {
    key: 'stateOrder',
    label: 'State build order',
    def: (a) => `${findState(a.homeState)[1]} first, then by demand`,
    skip: (a) => a.scope === 'state',
  },
  { key: 'repository', label: 'Repository URL' },
  { key: 'photos', label: 'Real photo folder' },
  { key: 'brandColors', label: 'Brand colors / logo', def: () => 'Part C defaults' },
  { key: 'examplePages', label: 'Team example pages' },
];

function normalize(raw) {
  const a = {};
  for (const f of FIELDS) {
    const v = raw[f.key];
    a[f.key] = v === undefined || v === null ? '' : String(v).trim();
  }
  a.scope = (a.scope || 'national').toLowerCase();
  for (const f of FIELDS) {
    if (f.skip && f.skip(a)) continue;
    if (a[f.key] !== '' || !f.def) continue;
    if (f.key === 'stateOrder' && !findState(a.homeState)) continue;
    a[f.key] = f.def(a);
  }
  if (a.domain && !/^https?:\/\//i.test(a.domain)) a.domain = `https://${a.domain}`;
  if (a.previewUrl && !/^https?:\/\//i.test(a.previewUrl)) a.previewUrl = `https://${a.previewUrl}`;
  return a;
}

function validate(a) {
  const problems = [];
  for (const f of FIELDS) {
    if (f.skip && f.skip(a)) continue;
    const v = a[f.key];
    if (f.required && !v) {
      problems.push(`${f.key}: required`);
      continue;
    }
    if (f.check && v !== '') {
      const ok = f.check(v);
      if (ok !== true) problems.push(`${f.key}: ${ok}`);
    }
  }
  return problems;
}

async function askAll() {
  if (!process.stdin.isTTY) fail('No terminal to ask questions in. Pass --inputs <file.json> instead.');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  console.log('\nSite details (press Enter to accept the value in brackets).');
  console.log('Super 9: ' + SUPER9.map((s, i) => `${i + 1} ${s.split(' / ')[0]}`).join(' · ') + '\n');
  const a = {};
  try {
    for (const f of FIELDS) {
      const partial = normalize(a);
      if (f.skip && f.skip(partial)) continue;
      const def = f.def ? f.def(partial) : '';
      for (;;) {
        let answer;
        try {
          answer = (await rl.question(`${f.label}${def ? ` [${def}]` : ''}: `)).trim();
        } catch {
          console.log('\nCancelled. Nothing was created.');
          process.exit(1);
        }
        const value = answer || def;
        if (f.required && !value) {
          console.log('  This one is required.');
          continue;
        }
        if (f.check && value !== '') {
          const ok = f.check(value);
          if (ok !== true) {
            console.log(`  ${ok}`);
            continue;
          }
        }
        a[f.key] = value;
        break;
      }
    }
  } finally {
    rl.close();
  }
  return normalize(a);
}

function siteInputsMarkdown(a) {
  const [abbr, stateName] = findState(a.homeState);
  const service = (v) => {
    const n = superNumber(v);
    return n ? `${SUPER9[n - 1]} (#${n})` : 'none';
  };
  const or = (v, fallback = FILL) => (v ? v : fallback);
  const rows = [
    ['Brand:', a.brand],
    ['Production domain:', a.domain],
    ['Preview URL:', or(a.previewUrl)],
    ['Site scope:', a.scope],
    ['Home state / abbreviation:', `${stateName} / ${abbr}`],
    ['Verified dispatch locations:', or(a.dispatch)],
    ['Phone:', or(a.phone)],
    ['Email:', or(a.email)],
    ['Primary rental service:', service(a.primary)],
    ['Secondary rental service:', service(a.secondary)],
    ['Keyword split:', a.split],
    ['Units we rent and where:', or(a.units, `${FILL}: units confirmed per category, and the states they serve`)],
    ['Extra rates:', or(a.extraRates, 'none')],
    ['Homepage map:', a.homepageMap],
    ['State build order:', a.scope === 'state' ? 'n/a (state site)' : a.stateOrder],
    ['Repository:', or(a.repository)],
    ['Real photo folder:', or(a.photos)],
    ['Brand colors / logo:', a.brandColors],
    ['Team example pages:', or(a.examplePages)],
  ];
  const body = rows.map(([k, v]) => `${k.padEnd(29)}${v}`).join('\n');
  const today = new Date().toISOString().slice(0, 10);
  return `# Site inputs

Part A of NEW-SITE-PROMPT.md for this site. Written by new-trailer-site on ${today}; edit any line.
\`${FILL}\` means the build will stop and ask, or mark it missing.

\`\`\`
${body}
\`\`\`
`;
}

function usStatesSkeleton(a) {
  const home = findState(a.homeState)[0];
  return {
    about: 'USA incident map data. Each state needs 1-3 real, dated, sourced incidents before launch. Incident shape: { "title", "date", "summary", "equipmentNeed", "sourceUrl" }.',
    states: STATES.map(([abbr, name]) => ({
      abbr,
      name,
      slug: slugify(name),
      status: abbr === home && a.dispatch ? 'confirmed-dispatch' : 'inquiry',
      statePage: 'planned',
      incidents: [],
    })),
  };
}

function stateManifestSkeleton(a) {
  const [abbr, name] = findState(a.homeState);
  return {
    state: name,
    abbr,
    sources: {
      municipalities: `${FILL}: the state's official municipal list (e.g. its league of cities directory)`,
      coordinates: 'U.S. Census Bureau Gazetteer place files',
    },
    totals: {},
    hubs: [],
    places: [],
  };
}

const AGENT_BLOCK = `<!-- BEGIN:trailer-site-kit -->
## Trailer rental site rules (trailer-site-kit)

Before any work in this repo, read:
1. \`site-inputs.md\`: this site's facts. Never invent a fact that it or the equipment directory does not give; ask or mark it missing.
2. \`NEW-SITE-PROMPT.md\`: the rules, every page on the site, and the build phases (Part F).
3. \`DESIGN.md\`: visual direction and the approved page layouts.

Build pages only with the skills in \`.agents/skills/\`:
- Homepage: \`state-trailer-homepage-builder\`
- Equipment pages: \`state-trailer-equipment-pages-builder\`
- Service Area pages (USA map, states, hub cities, places): \`state-trailer-service-area-builder\`

Navigation on every page: Home | Equipment | Service Area | Use cases | About Us | Contact Us.

Kit files (skills, NEW-SITE-PROMPT.md, this block) are updated with \`new-trailer-site sync\`. Change site facts in \`site-inputs.md\`, not in the skills.
<!-- END:trailer-site-kit -->
`;

// Add or refresh the kit's block in AGENTS.md (read by Codex) without touching anything else in the file.
async function upsertAgentBlock(dir) {
  const file = join(dir, 'AGENTS.md');
  const current = existsSync(file) ? await readFile(file, 'utf8') : '';
  const pattern = /<!-- BEGIN:trailer-site-kit -->[\s\S]*?<!-- END:trailer-site-kit -->\n?/;
  const next = pattern.test(current)
    ? current.replace(pattern, AGENT_BLOCK)
    : `${current}${current && !current.endsWith('\n\n') ? (current.endsWith('\n') ? '\n' : '\n\n') : ''}${AGENT_BLOCK}`;
  if (next !== current) await writeFile(file, next);
}

async function writeIfMissing(file, content, force) {
  if (existsSync(file) && !force) return false;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
  return true;
}

async function copySkills(dir) {
  const target = join(dir, '.agents', 'skills');
  await mkdir(target, { recursive: true });
  const names = (await readdir(join(KIT, 'skills'), { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
  for (const name of names) {
    await rm(join(target, name), { recursive: true, force: true });
    await cp(join(KIT, 'skills', name), join(target, name), { recursive: true });
  }
  return names;
}

function run(cmd, args, cwd) {
  return spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
}

function quiet(cmd, args, cwd) {
  return spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: process.platform === 'win32' });
}

// ---------- commands ----------

async function create(target, flags) {
  if (!target) fail('Name the folder to create, e.g. new-trailer-site create temp123-prompt');
  const dir = resolve(target);
  const exists = existsSync(dir);
  const nonEmpty = exists && (await readdir(dir)).length > 0;

  let answers;
  if (flags.inputs) {
    const file = resolve(flags.inputs);
    if (!existsSync(file)) fail(`Inputs file not found: ${file}`);
    let raw;
    try {
      raw = JSON.parse(await readFile(file, 'utf8'));
    } catch (e) {
      fail(`Inputs file is not valid JSON: ${e.message}`);
    }
    answers = normalize(raw);
  } else {
    answers = await askAll();
  }
  const problems = validate(answers);
  if (problems.length) fail(`Some site details need fixing:\n  ${problems.join('\n  ')}`);

  if (flags.next) {
    if (nonEmpty) fail(`${dir} is not empty. Drop --next to add the kit to an existing project.`);
    console.log('\nSetting up Next.js (App Router + TypeScript)...\n');
    const r = run('npx', [
      '--yes', 'create-next-app@latest', dir,
      '--ts', '--app', '--eslint', '--src-dir', '--import-alias', '@/*',
      '--use-npm', '--no-tailwind', '--disable-git', '--yes',
    ], process.cwd());
    if (r.status !== 0) fail('create-next-app did not finish. Fix the error above, or run without --next.');
  }

  await mkdir(dir, { recursive: true });
  const force = Boolean(flags.force);
  const written = [];

  const skills = await copySkills(dir);
  written.push(...skills.map((s) => `.agents/skills/${s}/`));

  await cp(join(KIT, 'NEW-SITE-PROMPT.md'), join(dir, 'NEW-SITE-PROMPT.md'));
  written.push('NEW-SITE-PROMPT.md');

  await upsertAgentBlock(dir);
  written.push('AGENTS.md (kit rules for Codex)');
  if (await writeIfMissing(join(dir, 'CLAUDE.md'), '@AGENTS.md\n', false)) {
    written.push('CLAUDE.md (points Claude to AGENTS.md)');
  }

  if (await writeIfMissing(join(dir, 'DESIGN.md'), await readFile(join(KIT, 'DESIGN.md'), 'utf8'), force)) {
    written.push('DESIGN.md');
  }
  if (await writeIfMissing(join(dir, 'site-inputs.md'), siteInputsMarkdown(answers), force)) {
    written.push('site-inputs.md');
  } else {
    console.log('Kept the existing site-inputs.md (use --force to replace it).');
  }

  const stateSlug = slugify(findState(answers.homeState)[1]);
  if (answers.scope === 'national') {
    if (await writeIfMissing(join(dir, 'src/data/us-states.json'), `${JSON.stringify(usStatesSkeleton(answers), null, 2)}\n`, force)) {
      written.push('src/data/us-states.json');
    }
  }
  if (await writeIfMissing(join(dir, `src/data/service-areas/${stateSlug}.json`), `${JSON.stringify(stateManifestSkeleton(answers), null, 2)}\n`, force)) {
    written.push(`src/data/service-areas/${stateSlug}.json`);
  }
  if (await writeIfMissing(join(dir, 'src/data/research/README.md'), '# Research logs\n\nOne file per location page: `[state]/[city]/[place].md`, one line per fact: fact, category, source URL, publication date, access date. "None found" is a valid entry; invented facts are not.\n', force)) {
    written.push('src/data/research/README.md');
  }

  // git: start a repo and make the first commit unless the folder is already inside one
  const inRepo = quiet('git', ['rev-parse', '--is-inside-work-tree'], dir).status === 0;
  let gitNote;
  if (quiet('git', ['--version'], dir).status !== 0) {
    gitNote = 'git not found: skipped the first commit.';
  } else if (inRepo) {
    gitNote = 'Already a git repo: review the changes and commit them.';
  } else {
    quiet('git', ['init', '-b', 'main'], dir);
    quiet('git', ['add', '-A'], dir);
    const c = quiet('git', ['commit', '-m', `Start ${answers.brand} site from trailer-site-kit ${PKG.version}`], dir);
    gitNote = c.status === 0
      ? 'Made the first git commit on main.'
      : 'Started a git repo, but the commit failed (set git user.name and user.email, then commit).';
  }

  const blanks = (siteInputsMarkdown(answers).match(/\[FILL IN\]/g) || []).length;
  console.log(`\nDone: ${dir}\n`);
  for (const w of written) console.log(`  + ${w}`);
  console.log(`\n${gitNote}`);
  console.log(`
Next:
  1. Open ${dir} in Codex (or Claude).${blanks ? `\n  2. Fill the ${blanks} [FILL IN] line(s) in site-inputs.md.` : ''}
  ${blanks ? '3' : '2'}. Paste the Phase 0 prompt from NEW-SITE-PROMPT.md (Part F), then run Phases 1-5 in order.
`);
}

async function sync(target, flags) {
  if (!target) fail('Name the site folder to update, e.g. new-trailer-site sync ../temp123-prompt');
  const dir = resolve(target);
  if (!existsSync(dir)) fail(`Folder not found: ${dir}`);

  const skills = await copySkills(dir);
  await cp(join(KIT, 'NEW-SITE-PROMPT.md'), join(dir, 'NEW-SITE-PROMPT.md'));
  console.log(`\nUpdated ${dir}`);
  await upsertAgentBlock(dir);
  for (const s of skills) console.log(`  ~ .agents/skills/${s}/`);
  console.log('  ~ NEW-SITE-PROMPT.md');
  console.log('  ~ AGENTS.md (kit block only)');

  const kitDesign = await readFile(join(KIT, 'DESIGN.md'), 'utf8');
  const siteDesign = join(dir, 'DESIGN.md');
  if (!existsSync(siteDesign)) {
    await writeFile(siteDesign, kitDesign);
    console.log('  + DESIGN.md');
  } else if ((await readFile(siteDesign, 'utf8')) !== kitDesign) {
    if (flags.design) {
      await writeFile(siteDesign, kitDesign);
      console.log('  ~ DESIGN.md (replaced)');
    } else {
      console.log('  = DESIGN.md kept: it differs from the kit (maybe brand colors). Use --design to replace it.');
    }
  }
  console.log('\nsite-inputs.md and src/data were not touched. Review the changes and commit them.\n');
}

// ---------- main ----------

const { _, flags } = parseArgs(process.argv.slice(2));
if (flags.version) {
  console.log(PKG.version);
  process.exit(0);
}
const [command, target] = _;
if (flags.help || !command) {
  console.log(USAGE);
  process.exit(command || flags.help ? 0 : 1);
}
if (command === 'create') await create(target, flags);
else if (command === 'sync') await sync(target, flags);
else fail(`Unknown command "${command}".\n\n${USAGE}`);
