# Design: Pricing page + `/price-trailer`, Super 9 equipment refresh, contact form and 24/7 call

Date: 2026-11-17. Status: draft, awaiting approval. Size: project (three parts).

## Intent and why

Every site made from `trailer-site-kit` should ship with (1) its own `/pricing/` page fed by the team's price sheet, (2) an equipment set that matches the current Temporary123 equipment lineup, with the team's new photos, and (3) a contact form plus a 24/7 emergency call. The point is that a worker creating a new site gets all three without hand work, and prices stay in step with the sheet.

## Goals

- `/pricing/` page in every new site, built from one data file, `src/data/pricing.json`.
- Slash command `/price-trailer` that refreshes prices from the sheet.
- Equipment directory: Super 9 in this order, with #9 = Remote Man Camp/Basecamp, plus Handwashing Trailers listed as an extra unit outside the 9. Specs and photos updated.
- Contact form and 24/7 emergency call in the shared layout of every site, default number +1 (800) 443-5212.

## Non-goals

- No copy of Temporary123 layout, colors or code. Only its contact structure (phone at entry, quote path, action still reachable after scroll).
- No publishing of the Government, GSA or markup tabs, or any internal note from the sheet.
- No new equipment categories beyond the Super 9 plus Handwashing.

## Anti-goals (failure even if it "works")

- An internal figure (markup %, "winning price" note, GSA contract price) appears on a public page.
- A price is invented, converted between periods, or estimated from another category (kit rule 15).
- A form that looks live but sends nowhere.

## Constraints

- Source sheet: `https://docs.google.com/spreadsheets/d/1Dyi8hWfgxqyiSUHZ3ji-xs9ktYkNgmxQoE_H19o1Vi4`. Tabs: Pricelist, Government, GSA Pricelist, Most common Add Ons Restroom/Shower, Other Add ONS, Basecamp, Turnkey/Unit, Sheet7, CANADA.
- Kit rules already in force: no quote form without an approved submission destination; "24/7" only when verified. The user has now verified 24/7 and default number; the form destination stays a per-site input.
- The Equipment and Service Area skills each hold a copy of `super-9-equipment-directory.md`; both must change together.
- Photo folder: `C:\Users\user2\Downloads\Equipments-20261110T140600Z-1-001\Equipments`, 45 unit folders, 256 PNG + 8 JPG, no spec files.
- Existing data conflicts C1–C6 in the directory stay open until the team resolves them; do not publish affected values.

## Approaches considered

1. **Live pull each run.** Always fresh, but fails if the worker cannot open the sheet.
2. **Snapshot in the kit.** Works offline and is reviewable in git, but goes stale.
3. **Hybrid (picked by recommendation, approved in conversation).** `/price-trailer` pulls the sheet, rewrites the kit snapshot, and rebuilds the site's `pricing.json`. If the sheet is unreachable it uses the snapshot and says so.

## Design

### Part 1: Pricing page and `/price-trailer`

- New kit skill `kit/skills/state-trailer-pricing-builder/` (SKILL.md, `references/pricing-source.md` snapshot) and a slash command `/price-trailer` that runs it.
- **Public tabs only:** Pricelist (rental ranges by duration: 1–6 days, 8–14 days, 15 days–1 month, 3+ months; "Starts at"), Most common Add Ons (water and waste service ranges, delivery ranges), Other Add ONS (grease trap, fire inspector and swap fees, health permit assistance), Basecamp (per person per day), Turnkey/Unit (per day and per week), Sheet7 add-on weekly estimates. **Never published:** Government, GSA Pricelist, CANADA (unless the site is Canadian; builder's call, ask), the 20/25/30% markup columns, and any note in the sheet.
- Output: `src/data/pricing.json` (shared with the calculator) and the `/pricing/` page: rate tables by category and duration, add-ons, "Prices updated [date]", "Request a quote" where no rate exists, call and form links.
- Calculator skill reads the same `pricing.json`; its rule that published starting prices come only from the price list is unchanged.
- Order of equipment follows the site's primary and secondary trailer focus.
- Snapshot behavior: sheet reachable → overwrite snapshot and `pricing.json`, print a diff summary; unreachable → use snapshot, print "sheet unreachable, used snapshot dated X".
- Sheet access method (public link export vs Drive connector) is the builder's call; document the one chosen in the skill.
- Add a "Pricing" nav item to the nav string everywhere it is defined (see Part 3 checklist).

### Part 2: Super 9 equipment

Order: 1 Mobile Commercial Kitchen, 2 Commercial Dishwashing, 3 Refrigerated, 4 Shower and Restroom Combination, 5 Shower, 6 Restroom, 7 Laundry, 8 Sleeper, 9 Remote Man Camp/Basecamp. Extra (outside the 9): Handwashing Trailers (Portable and Hands-Free), matching the live page.

- Update the unit lists to match the live page sub-links (kitchen 24/26/28/38/40ft, 40ft combination, 40ft bulk combination; dishwashing 22/24/26/38ft; refrigeration 12/20ft trailers and 40ft container; shower 22ft 10-stall and 20ft 5-stall container; restroom 12/14/20/30ft; combination 13/22/30ft plus ADA variants; sleeper 20ft shared/contractor/VIP plus containerized; laundry 20ft container, 24ft, 26–27ft, 30ft).
- Specs: the folder has none, so keep existing directory specs; for units that exist only in the photo folder (for example Command Center, Generator Trailer, Water Tank, Bladder Bag, Dining Hall, stairs) write no spec; mark "spec pending" and list them in a gaps report. Do not invent specs.
- Rates in the directory are updated from the new sheet's Pricelist where they differ; the sheet wins. Old ranges that conflict are listed in the conflict section, not silently replaced.
- Photos: convert PNG to WebP, one folder per unit under `kit/assets/equipment/<slug>/`, copied into each new site's `public/equipment/<slug>/`. Alt text from unit name. Remove `.DS_Store`. Folders whose names contain "Copy of" files: keep one of each duplicate.
- Both copies of `super-9-equipment-directory.md` change in the same commit.
- `bin/new-site.mjs` copies the assets and the new skill; `sync` updates them.

### Part 3: Contact form and 24/7 emergency call

- Shared-layout component set, built once: header call button, quote form (drawer/section), emergency 24/7 call control, mobile bottom bar. Original design from the site's `DESIGN.md`; it keeps Temporary123's structure only. No two fixed controls fight for the same viewport.
- Phone: default `+1 (800) 443-5212`, set from a `Phone` and `Phone answered 24/7` input in `site-inputs.md`; default yes for this kit.
- Form fields: name, phone, email, project location, facility type, rental dates, duration, details, consent line, bot protection. Posts to `Form endpoint:` in `site-inputs.md`. Blank endpoint → the form is not rendered; the call-first prompt shows instead. This keeps the "no dead form" rule.
- Update: `kit/DESIGN.md` section 4, `kit/NEW-SITE-PROMPT.md` (Part A input, Part C section 4, Part F Phase 1), the kit's README sticky-contact section, `examples/temp123-prompt.inputs.json`, and `bin/new-site.mjs` prompts.
- Checklist for nav: grep every place the nav string "Home | Equipment | Service Area | Use cases | About Us | Contact Us" appears and add Pricing consistently.

### Versioning and docs

- Bump `package.json` to 1.7.0. Update README (pricing, `/price-trailer`, equipment assets).

## Left to the builder

- Exact table layout of `/pricing/` within `DESIGN.md` tokens; sheet access method; WebP quality; file naming of slugs; whether CANADA tab is offered as an option for Canadian sites.

## Risks and open items

- Form endpoint is a per-site input; no default destination exists. A site without one has no form, only the call path.
- Photo set is large; WebP keeps the kit repo small enough. If still over about 50 MB, move images to a release asset instead.
- Directory conflicts C1–C6 remain open and may overlap with new sheet prices. The builder reports each overlap.
