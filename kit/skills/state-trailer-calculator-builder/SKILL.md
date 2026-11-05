---
name: state-trailer-calculator-builder
description: Build the rental calculator page (/rental-calculator/) and the floating estimate modal for a trailer rental site. Starting prices come only from the published price list (the Super 9 equipment directory plus the Extra rates and Delivery rates in site-inputs.md), ordered by the site's primary and secondary trailer focus. Also use to update prices only when the price list changes. Use for the calculator only.
---

# Trailer Rental Calculator Builder

## Role and objective
Act as a senior American B2B web developer and conversion specialist. Build the **Rental calculator** page and the **floating estimate modal** that open from every page. Visitors pick a state, city, equipment, trailer length, people, and dates, and see a **preliminary starting estimate** built only from published prices. It is a planning aid, not a quote. No invented prices, no hidden fees, no promises.

Follow `NEW-SITE-PROMPT.md` Part C (section 7b) and `DESIGN.md` section 7b for the layout. Reuse the shared layout and components. Build only the calculator; the homepage, Equipment pages, and Service Area pages have their own skills.

## Project inputs
- Brand, phone, "Phone answered 24/7": from `site-inputs.md`
- Primary and secondary rental service (the trailer focus): from `site-inputs.md`
- Units we rent and where: from `site-inputs.md`
- Extra rates and Delivery rates: from `site-inputs.md`
- Price list: `.agents/skills/state-trailer-equipment-pages-builder/references/super-9-equipment-directory.md` (read it there; do not make a third copy)
- Service area data for city lists: `src/data/service-areas/[state].json`
- Price data to write: `src/data/pricing.json`

## Price rules (the most important part)
1. **One source of truth.** Every number comes from the directory, Extra rates, or Delivery rates. Never hardcode a price in a component. Components read `src/data/pricing.json` only.
2. **Starting price** for a category = the lowest published figure of its **shortest listed period**, shown with the period exactly as the directory writes it (for example "from $1,250 / day"). Never convert Daily, Weekly, and Monthly into each other.
3. **No rate listed = "Request a quote".** Never estimate a missing rate from another category. Man camp, shower, restroom, laundry, sleeper and others with no listed rate show the quote message and a phone link.
4. **Delivery** comes only from "Delivery rates" in `site-inputs.md` (by trailer length). None given means "Delivery quoted per job" and no delivery number.
5. **Preliminary total** appears only when both an equipment starting price and a delivery price exist. Label it "Starting total: first [period] plus delivery". Otherwise show the line items that exist and no total.
6. **Dates and people do not change the number.** Say so on the page ("Dates do not change the estimate; rental-period pricing needs a quote").
7. **Confirmed units only.** A category offered in the equipment list must be rented per "Units we rent and where". If the chosen state is not confirmed for that category, show "Inquiry only: request a quote" instead of a price.
8. **Disclaimer on every result:** starting prices exclude final rental length, taxes, permits, utilities, site preparation, setup, servicing, mileage, and other project charges unless confirmed in writing.
9. **Show "Prices updated [date]"** from `pricing.json`.

## Variants (ADA, luxury, VIP)
Where the directory lists ADA, luxury, or VIP units with their own rates (for example the ADA combination trailers, the luxury combination trailers, the VIP sleeper), offer each as its own equipment option, grouped under its category, with its own starting price. Do not fold them into a category average. If two variants share one range, say so; if the directory flags a conflict for them, show "Request a quote" until it is resolved.

## Trailer focus
Order the equipment select with the primary service first, the secondary second, then the other rented Super 9 categories. Tag the first two "Most requested" only if that is true (otherwise no tag). The published-prices table on the page uses the same order.

## `src/data/pricing.json`
```json
{
  "updated": "YYYY-MM-DD",
  "source": "super-9-equipment-directory.md + site-inputs.md",
  "focus": ["primary-category-slug", "secondary-category-slug"],
  "categories": [
    { "super9": 7, "label": "Laundry Trailer", "slug": "laundry-trailers", "rented": true, "focusRank": 1,
      "starting": { "amount": 1250, "period": "Daily", "basis": "low end of published range" },
      "lengths": ["24 ft"], "statesConfirmed": ["FL"],
      "variants": [ { "label": "ADA Combination Trailer", "starting": null } ] }
  ],
  "delivery": [ { "length": "20 ft", "amount": 995 } ],
  "notes": []
}
```
`starting` is `null` when the directory lists no rate. The generator creates a skeleton with `focusRank`; this skill fills the rest from the directory.

## Update prices only
When the price list changes (directory, Extra rates, or Delivery rates): re-read them, rewrite `pricing.json`, update "Prices updated", and rebuild nothing else. List every number that changed.

## Page and modal
- **Page** `/rental-calculator/`: hero (breadcrumb, H1, short intro, "Planning estimate, not a final quote" notice); two columns: form card (eyebrow "STARTING ESTIMATE", H2 "Tell us what your site needs.") and a sticky "Preliminary total" card; then the optional exact-quote form; then "Published starting prices" tables (server-rendered); FAQs (3–4); CTA band. No state or city coverage lists.
- **Form fields:** State, City (from the state's service-area manifest, with a typed fallback), ZIP (optional), Equipment type, Trailer length (lengths listed in the directory for that category), Number of people, Rental start and end dates. Button "Calculate Starting Estimate →". After calculating: "Starting estimate calculated. No contact information was sent."
- **Exact-quote form** (optional, below the result): name, phone, email, industry, project details (optional), honeypot field, consent checkbox with the Privacy Notice link. Saved only when "Request Exact Quote" is selected. Real validation, approved destination, honest success and failure messages.
- **Estimate modal:** the same `EstimateForm`, opened from the floating "Calculate estimate" pill (bottom left, every page except the calculator page), the homepage hero secondary button, and the mobile bottom bar. A dialog with focus trap, Esc to close, focus returned to the opener, never opens by itself, and a link "Open the full calculator →".
- **Accessibility and SEO:** labels on every field, error text tied to fields, results in an `aria-live="polite"` region, 44px targets. Page title, description, canonical, `app/sitemap.ts` entry. The price tables render on the server. No fake ratings or structured data.

## Quality gate
- Every number on the page traces to the directory, Extra rates, or Delivery rates.
- A category with no rate never shows a price or a total.
- Dates and people do not change the number, and the page says so.
- The modal and the page give the same result for the same inputs.
- Keyboard-only run-through works, and the sticky contact elements do not cover the form.

## Deliverables
- The page, `EstimateForm`, `EstimateModal`, and the floating pill wired into the shared layout.
- `src/data/pricing.json` filled from the price list.
- A short report: which categories have starting prices, which show "Request a quote", the delivery table status, and anything blocked.
