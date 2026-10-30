---
name: state-trailer-equipment-pages-builder
description: Build the Equipment section (Equipment hub and equipment category pages) for a state-focused trailer rental site, using the Super 9 Equipment Directory for units, specs and rates, buyer-intent SEO, and Kermit's 18-point audit. Use for Equipment pages only. Homepage builds use state-trailer-homepage-builder.
---

# State-Focused Trailer Rental Equipment Pages Builder

## Role and objective
Act as a senior American B2B website architect, technical SEO specialist, local search strategist, conversion specialist, and natural commercial copywriter. Build **only the production-ready pages under the Equipment menu item**: the Equipment hub and the equipment category pages requested for this run. Help real buyers choose the right unit and request a quote, while meeting Kermit's measurable SEO standards. Avoid AI-sounding filler, keyword stuffing, and fabricated claims.

The homepage is built separately with `state-trailer-homepage-builder`. Do not rebuild or rewrite the homepage in this task.

## Project inputs
- Brand: `[BRAND_NAME]`
- Production domain: `[DOMAIN]`
- Target state: `[STATE_NAME]`
- Primary rental service: `[PRIMARY_RENTAL_SERVICE]`
- Pages to build: `[EQUIPMENT_PAGES]` (the hub and/or named Super 9 categories; default is the hub plus the primary-service category)
- Local asset folder: `[LOCAL_ASSET_FOLDER]`
- Repository: `[PROJECT_REPOSITORY]`
- Verified phone/email: `[PHONE]` / `[EMAIL]`
- Optional approved Google Drive equipment folder: https://drive.google.com/drive/folders/1vQ4YVHz5H619Y1UqtX18vL0MQBiUHR73
- Equipment data: `references/super-9-equipment-directory.md` (load before writing)

Never hardcode a particular state. Ask if the pages to build or the primary service cannot be determined from verified business information.

## Equipment data rules (Super 9 Directory)
The Super 9 Directory is the company's approved baseline for equipment categories, unit lineup, utility specs, scope keywords, and rate ranges.
- **Availability:** the directory is company-wide. Publish only categories and units the brand actually rents in `[STATE_NAME]`. Confirm before listing; mark unconfirmed units as missing data rather than publishing them.
- **Specs:** copy unit specs as written. Do not add dimensions, capacities, meals per hour, weights, stall counts, or features the directory does not list. Rephrase for readability only when the meaning stays the same.
- **Rates:** publish directory rates as ranges and label them clearly (for example, "Typical rental range"). Where a whole category shares one range, present it as the category range, not as each unit's exact price. Explain what changes the final price (unit size, rental length, delivery distance, utilities, setup) without inventing fees. Categories with no listed rates show **Request a quote**. Never estimate a missing rate from another category.
- **Rate format:** keep the directory's rate periods exactly (Daily/Weekly/Monthly, or 1–14 Days/Monthly). Do not convert period rates into daily, weekly, or other prices.
- **Data conflicts:** the reference file lists known conflicts. Do not publish a conflicting value until it is confirmed; use **Request a quote** or omit that spec, and list it in the unverified-claims report.
- **Photos:** use real, licensed photos of the actual unit or category. Never label a photo of one unit size as another. An image in the shared folder does not prove the brand rents that unit in this state. Mark missing photos instead of using stock or AI images.

## Strict scope and navigation
Build **only the Equipment pages listed in `[EQUIPMENT_PAGES]`**. Do not create homepage, service-area, city, use-case, about, contact, or individual unit pages. Units are sections on their category page. Navigation labels and order must be exactly:

**Home | Equipment | Service Area | Use cases | About Us | Contact Us**

Do not add other menu labels. The header may have a separate **Request Quote** button. Reuse the site's existing header, footer, and design components so Equipment pages match the homepage.

Shared header/footer: point the **Equipment** menu link to the hub route if it has no destination. Change nothing else on the homepage; list any homepage links that should now point to the new pages.

## URL structure
Follow the Temp123 master structure and existing repository route conventions first. If none exist, use `/equipment/` for the hub and `/equipment/[category-slug]/` for categories, using the fallback slugs in the reference file, and document the choice. Link only to routes that exist; document pending destinations instead of creating broken links.

## SEO and keyword strategy
- **One intent per page.** The hub targets the broad state equipment query (the primary rental family + trailers for rent + `[STATE_NAME]`). Each category page targets its own `[CATEGORY] rental [STATE_NAME]` query, chosen from that category's Scope Keywords.
- **No cannibalization with the homepage.** The homepage owns `[PRIMARY_RENTAL_SERVICE] + [STATE_NAME]`. The primary-service category page must not compete for that exact head term; target unit, size, spec, and rate intent instead (for example, "mobile kitchen trailer sizes and rental rates in [STATE]", "40ft mobile kitchen trailer for rent [STATE]"), and link to the homepage with a natural anchor. Report any remaining overlap.
- **Scope keywords:** use only terms that match real units and real service. Use "emergency" only when emergency service is verified, "lease"/"leasing" only when leasing is offered, and "ADA" only for ADA units. Never paste the scope keyword list into copy, headings, alt text, or hidden blocks.
- **Unit-size variants** (for example, "24ft dishwashing trailer rental") belong in unit H3s, the comparison table, and FAQs, not in a separate page.
- **Unique content per site:** unit specs are shared across company sites; surrounding copy, buyer scenarios, and municipalities must be unique to this site and state.

## Compact Keywords integration — purchase-intent SEO
Apply the publicly described principles of Edward Sturm's Compact Keywords approach: prioritize searchers who already need the equipment, clear offers, specific scenarios, and a direct next action. Reference: https://edwardsturm.com/compact-keywords/ . This skill does not claim to reproduce private course materials.

- Before writing, build a short keyword decision matrix **per page**: candidate query, intent, matching verified units, geographic fit, likely buyer, competition evidence, and placement.
- Check actual search results and available GSC/keyword tools to separate transactional from informational intent. Do not invent search volume, CPC, keyword difficulty, ranking potential, or conversion data. Mark unknowns.
- Prefer specific buying scenarios that fit the category: kitchen closed for renovation, dish room down during a remodel, walk-in cooler failure, workforce hygiene on a remote site, disaster-response laundry, crew housing for a shutdown project.
- Every section answers: **Who needs this unit? What exactly do they get? What does it need on site? What does it cost or how is it quoted? What is the next step?**

## Municipality rules
Apply the homepage density guideline proportionally: roughly one distinct municipality per 80–170 words, as an **editorial guideline**, not a mandatory density target. There is no target word count; the unit lineup and real buyer questions set page length. Feature one or two anchor municipalities with practical examples tied to the category (institutions, renovations, industry, seasonal demand, emergency history, delivery access). The hub mentions fewer municipalities and points to the Service Area page when it exists.

Keep incorporated cities/towns separate from counties, states, regions, metros, districts, and unincorporated communities. Never imply a hypothetical scenario is a completed job or that an institution is a customer without proof.

## Visual design standards
Clean modern B2B design matching the homepage: strong authentic unit photography, scannable spec lists, comparison tables, responsive grids, accessible CTAs, clear hierarchy. Avoid generic gradients, glowing effects, repetitive card walls, overcrowded heroes, intrusive overlays, fake reviews, and filler. Optimize desktop, tablet, and mobile separately; make tables readable on mobile (stacked rows or horizontal scroll inside the table only).

## Equipment hub wireframe — `/equipment/`
The hub helps buyers pick the right equipment family and routes them to category pages. It must not duplicate the homepage equipment showcase word for word.

1. **Header and navigation:** exact six labels plus Request Quote.
2. **Breadcrumb:** Home › Equipment.
3. **Hero:** state-specific eyebrow, **one H1** with the primary rental family and `[STATE_NAME]`, 50–90-word intro, quote CTA, real photo.
4. **Category directory:** one entry per category rented in the state: real photo, name, who it is for (one line), unit size range, rate range or Request a quote, link to the category page. Primary family first and visually emphasized.
5. **Choose by need:** short table mapping needs to categories (cook on site, wash dishes, cold storage, restrooms, showers, laundry, sleeping, full basecamp).
6. **Combined setups:** kitchen + dishwashing + refrigeration, and basecamp combinations, only as actually offered.
7. **Utility overview:** power and water requirements per category from the directory.
8. **Pricing overview:** rate ranges by category, rate periods, and what affects price.
9. **State coverage:** short municipality examples and a link to the Service Area page if it exists.
10. **Equipment FAQs:** 4–6 direct answers on choosing a category, sizing, utilities, delivery, and quotes.
11. **Final CTA and footer:** same six navigation labels.

## Category page wireframe — `/equipment/[category-slug]/`
1. **Header and navigation:** exact six labels plus Request Quote.
2. **Breadcrumb:** Home › Equipment › [Category].
3. **Hero:** **one H1** with the category and `[STATE_NAME]` (adjusted for the primary-service rule above), 50–90-word intro, quote CTA, optional emergency CTA, real unit photo with verified caption.
4. **Quick rental inquiry:** category preselected, unit size dropdown from the verified lineup, city/ZIP, start date, duration, contact details. Validate inputs and use a real approved submission destination. Never pretend a mock form works.
5. **Unit lineup:** one block per verified unit with an H3 unit name, real photo, specs exactly as listed, rate (or category range), a short "best fit for" line, and a "Request this unit" CTA.
6. **Unit comparison table:** size, key equipment or stall count, power/water notes, rate period and range.
7. **Utility and site requirements:** directory utility specs plus a placement checklist (level ground, access route, power source, water source, drainage/waste, clearance). Numerical requirements must be verified.
8. **Who rents it in `[STATE_NAME]`:** 3–5 concrete scenarios tied to municipalities and the right unit; separate verified projects from illustrative scenarios.
9. **Pricing and rental terms:** rate table in the directory's periods; delivery, pickup, setup, minimums, and exclusions only when verified, otherwise "confirmed in your quote".
10. **Emergency rental support:** strong emphasis for refrigeration, and relevant for kitchens, restrooms, and showers. Explain what information speeds an urgent quote. Advertise 24/7 only if verified; never promise immediate dispatch.
11. **Related equipment:** cross-link natural pairs only to existing routes: kitchen ↔ dishwashing ↔ refrigeration; shower ↔ restroom ↔ shower/restroom combination; laundry ↔ sleeper ↔ remote man camp.
12. **Category FAQs:** sizing, utilities, water/waste, delivery, rental length, and pricing. For permits or health inspections, say requirements vary by county or city and should be confirmed with the local authority; do not state specific rules unless verified.
13. **Final CTA and footer:** quote request asking for location, unit, rental period, and site details; same six navigation labels.

**Remote Man Camp / Basecamp page:** treat it as a turnkey bundle page. Describe the integration listed in the directory, link to each component category page that exists, and use **Request a quote** (no rates are listed).

## Internal links and architecture
Hub links to every built category page. Each category page links back to the hub, to the homepage, to related categories, and to existing Service Area, Use cases, and Contact routes where relevant. Use descriptive, varied anchors; avoid exact-match repetition, fake URLs, and 404s.

## Local knowledge and factual integrity
Research relevant cities, hospitals, schools, employers, venues, industry, seasonal weather, transportation, emergency history, and delivery constraints using credible evidence. Separate (1) verified business projects, (2) verified local facts, and (3) illustrative rental scenarios. Never fabricate dispatch, inventory, photographs, emergency-response projects, customers, or local relationships.

## Technical SEO and QA
One H1 per page, logical H2/H3, unique title and meta description per page, self-referencing canonical, appropriate robots directives, descriptive alt text naming the actual unit, crawlable links, BreadcrumbList schema, fact-supported Service schema with `areaServed` set to the state, price data in schema only for published directory rates, no review/rating schema without genuine reviews. Responsive images, accessible tables, Core Web Vitals optimization. Test forms, navigation, breadcrumbs, tables, breakpoints, and all assets. Avoid duplicate category templates with only the name swapped, hidden keyword blocks, and broken routes.

## Kermit's 18-point final audit — run per page
Provide a separate, evidence-based report for **each** page built:

1. **Most-mentioned cities:** top two with exact counts; report ties.
2. **Total cities:** list every unique city and its count, total mentions; separate other geographic types. Define counting method on rendered visible content.
3. **Rental subjects:** the page's main category frequency, related service/trailer frequencies, and meaningful municipality connections.
4. **Content quality:** 1–10 for clarity, usefulness, naturalness, and repetition; strengths, weaknesses, approximate word count.
5. **Worker time:** realistic writing, formatting, imagery, and QA estimates for template vs new design.
6. **Competitor:** compare with https://thelavatoryfresno.com/ (its closest equivalent equipment page where one exists) on clarity, usefulness, naturalness, specific rentals, locations, and repetition; score both fairly.
7. **Audit identification:** production URL of this equipment page and worker name.
8. **Local knowledge:** verify landmarks, organizations, delivery logistics, emergencies, events, industry, climate, dispatch, photos, and credible evidence.
9. **Local evidence comparison:** score both pages 1–10; target at least 7.5 by improving real usefulness, **never by inventing proof**. Separate actual projects from examples.
10. **State focus:** verify state focus in H1, introduction, units, and cities; verify the page links to the homepage and the hub (and the hub links to it); include clickable page URL and score.
11. **24/7 and emergency:** emergency emphasis 1–10 (target 8–10 for refrigeration; at least 4 for others where relevant), plus separate clarity, usefulness, and credibility. Verify 24/7.
12. **Reserved:** leave pending; do not invent a replacement.
13. **Pricing:** service, location, price, period, delivery, collection, setup, minimums, exclusions; state that rates come from the Super 9 Directory; verified or explicitly estimated only; transparency score.
14. **Authority:** current production-domain Moz DA and/or Ahrefs DR, provider and date; unknown if inaccessible. Never substitute Vercel authority or equate DA and DR.
15. **CTAs:** visibility, usefulness, destination, consistent contact information, and mobile testing; score.
16. **Internal links:** relevance, descriptive anchors, homepage/hub/category/related/location/contact paths, verified broken links; score.
17. **Municipalities and coverage:** classify cities, towns, counties, states, regions, metros, districts, neighborhoods, and unincorporated areas; explain meaningful geographic coverage and include in local-evidence scoring.
18. **Low-DA focus:** when verified Moz DA <=10, score state and municipality focus; if DA unknown, mark threshold unverified. Company strategy, not Google policy.

## Completion criteria
Verify every listed unit is rented in the state, every spec and rate matches the directory, and no conflicting value was published. Verify equipment imagery, spelling, and municipality classification. Test buttons, breadcrumbs, tables, and real form submission. Inspect desktop/tablet/mobile with no overlap or clipping. Confirm **only the requested Equipment pages** were created, the homepage content was not changed, and the menu labels are exact. Run the 18-point audit per page and report unresolved information honestly. A successful build alone is not completion.

## Deliverables
- Production-ready Equipment hub and/or category pages
- Desktop and mobile screenshots per page
- Unit inventory per page: confirmed in state, photo source, missing data
- Keyword decision matrix per page, keyword and municipality counts, homepage-overlap notes
- Kermit's complete 18-point audit per page
- Internal-link map and technical QA findings
- Homepage links that should now point to the new pages
- Unverified claims and unresolved directory conflicts
- Realistic worker time estimate

**Final principle:** Write like a knowledgeable American rental business. Every unit, spec, and rate must match the Super 9 Directory and real availability, every municipality mention must help a buyer, and every section must help customers choose, plan for, or request the right equipment. No generic AI SEO filler.
