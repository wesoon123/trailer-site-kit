---
name: state-trailer-pricing-builder
description: Build the /pricing/ page for a trailer rental site and refresh its price data from the team's price sheet. Pulls the public tabs of the sheet (or falls back to the saved snapshot), rewrites the snapshot, and fills the rate and add-on data in src/data/pricing.json. Also run by the /price-trailer command to update prices only. Use for the pricing page and price data only.
---

# Trailer Pricing Builder

## Role and objective
Act as a senior American B2B web developer. Build the **Pricing** page (`/pricing/`) and keep `src/data/pricing.json` in step with the team's price sheet. The page shows published rental rates and add-ons, nothing else. No invented prices, no converted periods, no internal figures.

Follow `NEW-SITE-PROMPT.md` Part D and `DESIGN.md` section 7c for the page. Reuse the shared layout and components. The calculator skill reads the same `pricing.json`; do not change its rules or its `categories[].starting` values.

## Project inputs
- Brand, phone, "Phone answered 24/7", "Form endpoint": from `site-inputs.md`
- Primary and secondary rental service (page order): from `site-inputs.md`
- Price sheet: `https://docs.google.com/spreadsheets/d/1Dyi8hWfgxqyiSUHZ3ji-xs9ktYkNgmxQoE_H19o1Vi4`
- Snapshot: `.agents/skills/state-trailer-pricing-builder/references/pricing-source.md`
- Data to write: `src/data/pricing.json`

## Which tabs publish
- **Published:** Pricelist (Tier 1 list rates only), Most common Add Ons (service, delivery and tank price ranges), Other Add ONS, TurnkeyUnit.
- **Held until the user confirms (conflict C6):** the Basecamp tab's turnkey package prices. Show "Request a quote" for Remote Man Camp.
- **never published:** Government, GSA Pricelist, CANADA (ask first for a Canadian site), Pricelist tiers 2-4, customer-type tiers and promo codes, supply cost and markup tables, Sheet7 and every other internal estimating tab, any note or comment in the sheet.

## Run order (`/price-trailer`)
1. **Pull.** Export the published tabs from the sheet (public link export, or the Drive connector). If the sheet cannot be read, use the snapshot and say exactly: `sheet unreachable, used snapshot dated <date>`. Never stop, and never write an empty `pricing.json`.
2. **Filter** to the published tabs and rows above. Copy text exactly as written (`4995 to 7995`, `3995-5995`). Never compute, convert, add or average a figure.
3. **Rewrite the snapshot** (`pricing-source.md`) when the pull worked, with a new `Snapshot date:` line.
4. **Rebuild `pricing.json`.** Keep every existing field. Fill `snapshot: { "date": "...", "source": "sheet" | "snapshot" }`, each category's `rates: [{ "period": "1-6 Days", "text": "5995 to 7995" }]` (period = the sheet column header), and `addOns: [{ "group": "...", "item": "...", "text": "..." }]`. A category with no sheet row gets `rates: []`.
5. **Report** what changed: prices added, removed or edited since the last snapshot, rows skipped and why, and whether the page needs a rebuild.

## Unit question (ask before wording a rate)
The Pricelist columns are rental lengths (1-6 Days, 8 Days-14 days, 15days-1 month, More than 3 Months) and the figures carry no unit. Ask the user what a figure means (per rental, per week, per month) and write it into `site-inputs.md` Extra rates before any page words it. Until then show the column header and figure only, with the line "Rates depend on rental length and site. Request a quote to confirm."

## Rules
1. **One source of truth.** Components read `src/data/pricing.json` only. Never hardcode a price.
2. **No rate listed = "Request a quote".** Never estimate a missing rate from another row or category.
3. **Unconfirmed prices never publish.** Anything on the directory's "Data conflicts to confirm" list, or marked unconfirmed in `site-inputs.md`, shows "Request a quote".
4. **Order** the categories with the primary service first, then the secondary, then the rest in Super 9 order. Handwashing Trailers comes last.
5. **Show "Prices updated [date]"** from `pricing.json`.
6. **Disclaimer:** rates exclude taxes, permits, utilities, site preparation, setup, servicing, mileage and other project charges unless confirmed in writing.

## Page `/pricing/`
Hero (breadcrumb, eyebrow "PRICING", H1 "[Brand] Trailer Rental Pricing", two-sentence intro), one rate table per category from `pricing.json`, the add-on tables, the "Request a quote" path (phone link; form only when "Form endpoint" is set), FAQs (3-4), CTA band. Tables render on the server and scroll horizontally inside the table only on mobile. Page title, description, canonical and a `app/sitemap.ts` entry.

## Quality gate
- Every number on the page traces to `pricing.json`, and every entry there traces to a published row of the snapshot.
- No Government, GSA, markup, tier or note text appears anywhere on the site.
- A category or unit with no rate never shows a number.

## Deliverables
- `/pricing/` page and its components in the shared layout.
- Updated `pricing-source.md` (when the pull worked) and `src/data/pricing.json`.
- A short report: sheet or snapshot used, what changed, what shows "Request a quote", and any open question (the unit above, Canada, Basecamp).
