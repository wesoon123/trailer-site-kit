# trailer-site-kit

One command to start a new trailer rental website repo with everything the team uses: the three page-building skills, the master prompt, the design, the site's details, and the data skeletons for the USA map and service areas.

## Start a new site

```bash
npx github:[OWNER]/trailer-site-kit create aalinen --next
```

It asks for the site details (brand, domain, home state, services, keyword split, phone, and so on), then builds the folder. Already have the answers in a file?

```bash
npx github:[OWNER]/trailer-site-kit create aalinen --next --inputs aalinen.inputs.json
```

Without GitHub, from a local copy of this repo:

```bash
node trailer-site-kit/bin/new-site.mjs create aalinen --next
```

| Flag | What it does |
|---|---|
| `--next` | Sets up a Next.js App Router + TypeScript project first (needs an empty or new folder) |
| `--inputs <file.json>` | Reads the site details from a file instead of asking (see `examples/a-linen.inputs.json`) |
| `--force` | Replaces an existing `site-inputs.md`, `DESIGN.md` and data skeletons |

Leave out `--next` to add the kit to a project that already exists.

### What lands in the new site

```
aalinen/
├── .agents/skills/
│   ├── state-trailer-homepage-builder/
│   ├── state-trailer-equipment-pages-builder/
│   └── state-trailer-service-area-builder/
├── NEW-SITE-PROMPT.md        master prompt: rules, page map, build phases
├── DESIGN.md                 visual direction and approved page layouts
├── site-inputs.md            this site's details (Part A of the master prompt)
├── AGENTS.md                 tells Codex to read the kit files first (kit block added to any existing file)
├── CLAUDE.md                 points Claude to AGENTS.md
└── src/data/
    ├── us-states.json        USA map: 50 states + DC, incidents to research (national sites)
    ├── service-areas/
    │   └── florida.json      home state's place manifest, to fill
    └── research/README.md    how research logs are kept
```

It also makes the first git commit on `main` (unless the folder is already a git repo).

### Then build the site
1. Open the folder in Codex (or Claude).
2. Fill any `[FILL IN]` lines in `site-inputs.md`.
3. Paste the Phase 0 prompt from `NEW-SITE-PROMPT.md` (Part F), then run Phases 1–5 in order.

## Update an existing site to the latest kit

```bash
npx github:[OWNER]/trailer-site-kit sync ../aalinen
```

Replaces the skills, `NEW-SITE-PROMPT.md` and the kit block in `AGENTS.md` with the kit's versions. It never touches `site-inputs.md` or `src/data`, and keeps a customized `DESIGN.md` unless you add `--design`.

## Changing the kit

Edit the files in `kit/`, then commit and push. Every worker's next `create` uses the new version, and `sync` brings existing sites up to date.

```
kit/
├── skills/            the three skills (each folder = one skill)
├── NEW-SITE-PROMPT.md
└── DESIGN.md
```

- **Equipment, specs and prices:** `kit/skills/*/references/super-9-equipment-directory.md`. The Equipment and Service Area skills each hold a copy; update both together.
- **Keyword lists:** `kit/skills/state-trailer-service-area-builder/references/super-9-keyword-matrix.md`.
- **Version:** bump `version` in `package.json` when you change the kit, so commits show which kit a site started from.

Requires Node 18.17 or newer and git.
