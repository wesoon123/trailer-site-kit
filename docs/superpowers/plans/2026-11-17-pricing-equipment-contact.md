# Pricing page, Super 9 refresh, contact defaults: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship kit 1.7.0: a `/pricing/` page and `/price-trailer` command fed by the price sheet, a refreshed Super 9 directory with the new photos, and contact defaults (phone, 24/7, form endpoint) in every new site.

**Architecture:** The kit generates skills, a master prompt and data skeletons; it contains no site code. So each change is files in `kit/` plus `bin/new-site.mjs` wiring, verified by `node:test` tests that run the generator into a temp folder and assert on the output. Prices flow sheet → `kit/.../pricing-source.md` snapshot → site `src/data/pricing.json` → pricing page and calculator.

**Tech Stack:** Node 18.17+ ESM, `node:test`, `sharp` (dev only, for the one-time image conversion script).

**Spec:** `docs/superpowers/specs/2026-11-17-pricing-equipment-contact-design.md`

## Global Constraints

- Source sheet: `https://docs.google.com/spreadsheets/d/1Dyi8hWfgxqyiSUHZ3ji-xs9ktYkNgmxQoE_H19o1Vi4`.
- Super 9 order: 1 Mobile Commercial Kitchen, 2 Commercial Dishwashing, 3 Refrigerated, 4 Shower & Restroom Combination, 5 Shower, 6 Restroom, 7 Laundry, 8 Sleeper, 9 Remote Man Camp/Basecamp. Handwashing Trailers is an extra outside the 9. `SUPER9` in `bin/new-site.mjs` stays 9 entries.
- Public sheet tabs only: Pricelist, Most common Add Ons Restroom/Shower, Other Add ONS, Basecamp, Turnkey/Unit, Sheet7. Never published: Government, GSA Pricelist, CANADA (unless Task 3 decides otherwise), the 20%/25%/30% markup columns, any sheet note (for example "winning price").
- Never invent, convert or estimate prices or specs (kit rule 15). No rate means "Request a quote". Units with photos but no spec are marked "spec pending".
- Default phone `+1 (800) 443-5212`; `Phone answered 24/7` defaults to `yes`; no form renders without a `Form endpoint:` value.
- Both `super-9-equipment-directory.md` copies stay byte-identical.
- Kit version `1.7.0` in `package.json`. The generator keeps zero runtime dependencies.
- Commit after each task. Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Sheet cells in mixed formats (`4995 to 8995`, `3995-5995`, ` 7,995.00 `, blank): the snapshot keeps the text as written, never a computed number. Test in Task 3.
2. A Government, GSA or markup figure leaking into `pricing-source.md` or the skill. Test in Task 3 greps for `winning`, `Markup`, `47QSMS25D00AM`, `$10,998.59`.
3. Sheet unreachable: the skill must fall back to the snapshot and say so, not stop or write an empty `pricing.json`. Test in Task 3 checks the SKILL.md states this and the skeleton carries `snapshot` metadata.
4. `--inputs` file with blank `phone` and `hours247`: must produce the default number and `yes`; a given phone must win over the default. Test in Task 5.
5. Photo folders with spaces, parentheses, `(1)` and `Copy of` duplicates: slugs must be clean and duplicates dropped. Test in Task 4.

## Open item to settle with the user before Task 3 publishes values

**O1.** The Pricelist columns (1–6 days, 8–14 days, 15 days–1 month, 3+ months) hold figures such as `4995 to 7995` with no unit. They conflict in size with the directory's Daily/Weekly/Monthly ranges. Task 3 stores them as "as written, bracket = column header, unit unconfirmed" and the pricing skill must ask the user for the unit before wording them on a page. Do not convert them.

---

### Task 1: Test harness

**Files:**
- Create: `test/helpers.mjs`, `test/smoke.test.mjs`
- Modify: `package.json` (add `"test": "node --test test/"` to scripts)

**Interfaces:**
- Produces: `createSite(overrides?: object): { dir: string, read(rel: string): string, exists(rel: string): boolean }` in `test/helpers.mjs`. It writes an inputs file (brand `Test Co`, domain `testco.example`, homeState `Florida`, primary `1`, plus `overrides`), runs `node bin/new-site.mjs create <tmp>/site --inputs <file>` with `execFileSync`, and returns helpers rooted at the site folder. Temp folders come from `fs.mkdtempSync(os.tmpdir())`.
- Produces: `KIT_ROOT` (absolute path of the repo) export.

- [ ] **Step 1: Write the failing test** `test/smoke.test.mjs`: `createSite()` returns a folder where `exists('site-inputs.md')`, `exists('NEW-SITE-PROMPT.md')` and `exists('.agents/skills/state-trailer-calculator-builder/SKILL.md')` are true.
- [ ] **Step 2: Run** `npm test`. Expected: FAIL, `helpers.mjs` not found.
- [ ] **Step 3: Implement** `test/helpers.mjs` as described above.
- [ ] **Step 4: Run** `npm test`. Expected: PASS (1 test).
- [ ] **Step 5: Commit** `test: add generator smoke-test harness`.

### Task 2: Directory, Super 9 and extras (both copies)

**Files:**
- Modify: `kit/skills/state-trailer-equipment-pages-builder/references/super-9-equipment-directory.md`
- Modify: `kit/skills/state-trailer-service-area-builder/references/super-9-equipment-directory.md` (same content)
- Test: `test/directory.test.mjs`

**Interfaces:**
- Produces: a directory whose table keeps rows 1–9 as today and adds a row labelled `Extra` for Handwashing Trailers (slug `handwashing-trailers`, rates `No: Request a quote`); plus a section `## Additional equipment (photos only, specs pending)` listing the photo-only units from the spec: Command Center, Generator Trailer, Water Tank, Bladder Bag, Dining Hall, Stairs, Dining/Office/Sleeper/Shower & Restroom multi-use trailers as named by the photo folders, each with the text `Specs: spec pending`.

- [ ] **Step 1: Write the failing tests** in `test/directory.test.mjs`: (a) the two directory files are byte-identical; (b) the file contains `## 9. Remote Man Camp Basecamp`; (c) it contains `Handwashing Trailers` and `Specs: spec pending`; (d) it does not contain `Markup`, `winning`, `47QSMS25D00AM`.
- [ ] **Step 2: Run** `npm test -- test/directory.test.mjs`. Expected: FAIL on (c).
- [ ] **Step 3: Edit the directory**: add the Extra row and the Handwashing section (units: Portable Handwashing Stations, Hands-Free Handwashing Stations; no specs, no rates), add the photo-only section, then copy the file over the other copy. Do not touch rates or conflicts C1–C6 here (rates are Task 3).
- [ ] **Step 4: Run** the test again. Expected: PASS.
- [ ] **Step 5: Commit** `feat(kit): add Handwashing extra and photo-only equipment to directory`.

### Task 3: Pricing skill, snapshot and `/price-trailer`

**Files:**
- Create: `kit/skills/state-trailer-pricing-builder/SKILL.md`, `kit/skills/state-trailer-pricing-builder/agents/openai.yaml`, `kit/skills/state-trailer-pricing-builder/references/pricing-source.md`, `kit/commands/price-trailer.md`
- Test: `test/pricing.test.mjs`

**Interfaces:**
- Consumes: `createSite` from Task 1 (it must copy the new skill and command; wiring is Task 7).
- Produces: skill name `state-trailer-pricing-builder`; command file with front matter `description:` and body that says to run the skill; `pricing-source.md` with a header line `Snapshot date: YYYY-MM-DD` and one table per public tab, values as written in the sheet.
- Produces: the `pricing.json` extension (written by the skill, skeleton in Task 7): top-level `snapshot: { date: string, source: "sheet" | "snapshot" }`, per category `rates: Array<{ period: string, text: string }>`, and top-level `addOns: Array<{ group: string, item: string, text: string }>`.

- [ ] **Step 1: Write the failing tests** in `test/pricing.test.mjs`: (a) `pricing-source.md` exists and matches `/^Snapshot date: \d{4}-\d{2}-\d{2}$/m`; (b) it does not contain `winning`, `Markup`, `47QSMS25D00AM`, `$10,998.59`; (c) it contains the column headers `1-6 Days`, `8 Days-14 days`, `15days-1 month`, `More than 3 Months` and the text `4995 to 7995` exactly as written; (d) `SKILL.md` contains the phrases `sheet unreachable`, `Request a quote`, `Government`, `never published`; (e) `kit/commands/price-trailer.md` exists and mentions `state-trailer-pricing-builder`.
- [ ] **Step 2: Run** `npm test -- test/pricing.test.mjs`. Expected: FAIL, files missing.
- [ ] **Step 3: Read the full sheet** with the Drive connector (`read_file_content`) or a public CSV export per tab. Write `pricing-source.md` from the six public tabs only, text as written, plus the line `Unit of Pricelist figures: unconfirmed (see O1)`.
- [ ] **Step 4: Write `SKILL.md`** (frontmatter `name`, `description` in the style of the calculator skill). It must define: the tab allow-list and the never-published list from Global Constraints; the run order (pull sheet, else snapshot with the message "sheet unreachable, used snapshot dated X"; rewrite snapshot; rebuild `src/data/pricing.json` with the extension fields above; print a diff summary); the `/pricing/` page layout per Task 6's DESIGN section; the rule to ask the user for the unit (O1) before wording Pricelist figures; the Canada tab question (ask for Canadian sites only). Write `agents/openai.yaml` by copying the calculator skill's file and changing names. Write the command file.
- [ ] **Step 5: Run** the tests. Expected: PASS.
- [ ] **Step 6: Commit** `feat(kit): pricing skill, price snapshot and /price-trailer command`.

### Task 4: Equipment images

**Files:**
- Create: `scripts/equipment-slugs.json`, `scripts/build-equipment-assets.mjs`, `kit/assets/equipment/<slug>/*.webp`
- Modify: `package.json` (devDependency `sharp`; script `"build:assets": "node scripts/build-equipment-assets.mjs"`)
- Test: `test/assets.test.mjs`

**Interfaces:**
- Produces: `equipment-slugs.json` mapping each of the 45 source folder names to a slug (lowercase, hyphens, no parentheses; for example `24ft Mobile Kitchen` → `24ft-mobile-kitchen`, `Basecamp, mancamp or workforce housing` → `basecamp-workforce-housing`, `Logo and Favicon` → `logo-and-favicon`).
- Produces: `build-equipment-assets.mjs <sourceDir>`: for each mapped folder converts `.png/.jpg` to `.webp` (quality 80, max width 1600) into `kit/assets/equipment/<slug>/<clean-name>.webp`; skips `.DS_Store`; skips files named `Copy of *` and `*(1).*` when the same name without that marker exists.

- [ ] **Step 1: Write the failing tests** in `test/assets.test.mjs`: (a) every slug in `equipment-slugs.json` has a folder under `kit/assets/equipment/` with at least one `.webp`; (b) no file under `kit/assets/` is named `.DS_Store` or contains `Copy of`, `(1)`, a space or a parenthesis; (c) total size of `kit/assets/equipment` is under 50 MB.
- [ ] **Step 2: Run** `npm test -- test/assets.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** the slug map and the script; run `npm install` then `npm run build:assets -- "C:\Users\user2\Downloads\Equipments-20261110T140600Z-1-001\Equipments"`.
- [ ] **Step 4: Run** the tests. Expected: PASS. If (c) fails, lower quality or width and rerun; if it still fails, stop and report (the spec's fallback is a release asset).
- [ ] **Step 5: Commit** `feat(kit): add converted equipment photos`.

### Task 5: Contact defaults and form endpoint

**Files:**
- Modify: `bin/new-site.mjs` (`FIELDS`, `siteInputsMarkdown`), `kit/NEW-SITE-PROMPT.md` (Part A block, Part B "Forms" bullet, Part C section 4, Phase 1 prompt), `kit/DESIGN.md` (section 4), `examples/temp123-prompt.inputs.json`
- Test: `test/contact.test.mjs`

**Interfaces:**
- Produces: `FIELDS` entry `{ key: 'formEndpoint', label: 'Quote form endpoint URL (blank = no form, call-first only)' }`; `phone` gets `def: () => '+1 (800) 443-5212'`; `hours247` `def` becomes `() => 'yes'`; `siteInputsMarkdown` adds the row `['Form endpoint:', or(a.formEndpoint, 'none (no form; call-first)')]` after `Email:`.

- [ ] **Step 1: Write the failing tests** in `test/contact.test.mjs`: (a) `createSite({ phone: '', hours247: '' })` → `site-inputs.md` matches `/Phone:\s+\+1 \(800\) 443-5212/` and `/Phone answered 24\/7:\s+yes/`; (b) `createSite({ phone: '+1 (555) 010-0000' })` keeps that number; (c) default site has `/Form endpoint:\s+none/`; (d) `createSite({ formEndpoint: 'https://forms.example/submit' })` has that URL after `Form endpoint:`; (e) `NEW-SITE-PROMPT.md` contains `Form endpoint:` in Part A and the text `no form renders without a Form endpoint`.
- [ ] **Step 2: Run** `npm test -- test/contact.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** the `bin/new-site.mjs` changes above.
- [ ] **Step 4: Update the docs**: Part A block gains the `Form endpoint:` line and the phone/24-7 defaults; Part B "Forms" bullet and DESIGN section 4 "Quote drawer" say the drawer and a form section on the Contact Us page render only when `Form endpoint:` is set, and otherwise show the call-first prompt with the phone link; DESIGN section 4 states the emergency call is on by default for this kit; add `formEndpoint` to the example inputs JSON.
- [ ] **Step 5: Run** the tests. Expected: PASS.
- [ ] **Step 6: Commit** `feat(kit): default phone, 24/7 and form endpoint input`.

### Task 6: Pricing and Contact in nav, pages and design

**Files:**
- Modify: `kit/NEW-SITE-PROMPT.md` (Part C nav sections, Part D table and nav line, Part F new Phase 2c), `kit/DESIGN.md` (nav strings; new section `7c. Pricing page`), all four `kit/skills/*/SKILL.md` where the old nav string appears
- Test: `test/nav.test.mjs`

**Interfaces:**
- Produces: the new nav string, exactly **Home | Equipment | Pricing | Service Area | Use cases | About Us | Contact Us**, replacing the six-label string everywhere; Part D rows `Pricing | /pricing/ | 1 | state-trailer-pricing-builder` and `Contact Us | /contact/ | 1 | contact form section plus emergency call (DESIGN section 4)`; Phase 2c prompt "Run /price-trailer, then build /pricing/ from src/data/pricing.json".

- [ ] **Step 1: Write the failing tests** in `test/nav.test.mjs`: walk `kit/` and `README.md`; (a) no file contains `Home | Equipment | Service Area | Use cases | About Us | Contact Us` or the phrase `same six nav labels`; (b) `kit/NEW-SITE-PROMPT.md` and `kit/DESIGN.md` contain the new nav string; (c) Part D contains `/pricing/`; (d) `DESIGN.md` contains `## 7c. Pricing page`.
- [ ] **Step 2: Run** `npm test -- test/nav.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Replace** the nav string and "six" wording with `Grep` to find every occurrence, then add Part D rows, Phase 2c, and DESIGN 7c. 7c holds: breadcrumb, hero with eyebrow "PRICING", rate tables per category and duration, add-ons tables, "Prices updated [date]", "Request a quote" rows, call link and quote path, white cards on light gray, mobile horizontal scroll inside tables only.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(kit): add Pricing and Contact pages to nav, Part D and DESIGN`.

### Task 7: Wire assets, command and pricing skeleton; docs; version

**Files:**
- Modify: `bin/new-site.mjs` (`pricingSkeleton`, new `copyCommandsAndAssets(dir)`, `create`, `sync`, help text), `package.json` (`"version": "1.7.0"`, add `kit/**` already covered by `files`), `README.md`, `.gitignore` if `node_modules` is missing
- Test: extend `test/pricing.test.mjs`, `test/assets.test.mjs`

**Interfaces:**
- Consumes: skill, command and asset paths from Tasks 3–4; the `pricing.json` extension from Task 3.
- Produces: `copyCommandsAndAssets(dir: string): Promise<string[]>`: copies `kit/commands/*.md` to `<dir>/.claude/commands/` and `kit/assets/equipment` to `<dir>/public/equipment`, returns written paths; both `create` and `sync` call it and print the paths. `pricingSkeleton` gains `snapshot: { date: '', source: 'snapshot' }`, `addOns: []`, and `rates: []` on every category; its `source` string mentions `pricing-source.md`.

- [ ] **Step 1: Write the failing tests**: (a) `createSite()` has `.claude/commands/price-trailer.md`, `.agents/skills/state-trailer-pricing-builder/SKILL.md`, and at least one `public/equipment/24ft-mobile-kitchen/*.webp`; (b) `JSON.parse(read('src/data/pricing.json'))` has `snapshot`, `addOns` and every category has `rates`, with 9 categories; (c) running `node bin/new-site.mjs sync <site>` on an existing site restores a deleted `.claude/commands/price-trailer.md`; (d) `package.json` version is `1.7.0`.
- [ ] **Step 2: Run** `npm test`. Expected: FAIL on the new tests only.
- [ ] **Step 3: Implement** the wiring above and bump the version.
- [ ] **Step 4: Update `README.md`**: add `/price-trailer` and the `/pricing/` page under a "Pricing" heading (hybrid behavior, public-tab rule), update the tree in "What lands in the new site", the sticky-contact paragraph (default phone, `Form endpoint:`), and the equipment paragraph (Handwashing extra, photos, `npm run build:assets`).
- [ ] **Step 5: Run** `npm test`. Expected: all PASS. Then run `node bin/new-site.mjs create` into a temp folder by hand and confirm the printed list shows the command, skill and assets.
- [ ] **Step 6: Commit** `feat(kit): wire pricing command, assets and skeleton; kit 1.7.0`.

---

## Self-review notes

- Spec coverage: Part 1 → Tasks 3, 6, 7; Part 2 → Tasks 2, 4; Part 3 → Task 5 (the sticky call, rail, drawer and mobile bar already exist in DESIGN section 4; this plan changes defaults and the endpoint rule only); versioning/docs → Task 7. Nav checklist → Task 6.
- Known gap: the spec's "rates updated from the sheet where they differ" is blocked by O1. Task 3 stores the sheet figures; the directory's old Daily/Weekly/Monthly ranges stay until the user confirms the Pricelist unit.
