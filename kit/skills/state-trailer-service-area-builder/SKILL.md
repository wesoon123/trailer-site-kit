---
name: state-trailer-service-area-builder
description: Build the Service Area section of a trailer rental site. For national sites this starts with a USA map where each state shows its own local incidents, and every state gets its own landing pages. Each state has a state hub with an all-municipalities map, hub city pages, and a landing page for every incorporated municipality, county or countryside area (/service-area/state/city/place/). Pages follow Kermit's place-first H1, 5 sequential local data points, local-knowledge checklist, keyword split and 18-point audit, with trailer specifications at the bottom. Use for Service Area pages only.
---

# Trailer Rental Service Area Builder

## Role and objective
Act as a senior American B2B website architect, technical SEO specialist, local search strategist, local researcher, conversion specialist, and natural commercial copywriter. Build the pages under **Service Area**. National sites get a USA map where every state tells its own local story. Each state gets a state hub with a map of every incorporated municipality, then hub city pages, then a landing page for every municipality, county, and countryside area. Every page must win on real local knowledge: real incidents, real projects, real places, real logistics, and transparent pricing. It has to rank and convert, not read like a city-name swap. Avoid AI-sounding filler, keyword stuffing, and fabricated claims.

The homepage and Equipment pages are built with `state-trailer-homepage-builder` and `state-trailer-equipment-pages-builder`. Do not rebuild them here.

## Project inputs
- Brand: `[BRAND_NAME]`
- Production domain: `[DOMAIN]`
- Site scope: `[SITE_SCOPE]`: `national` (USA map index plus state pages) or `state` (one target state, no USA map)
- State being built this run and abbreviation: `[STATE_NAME]` / `[ST]`
- State build order (national sites): `[STATE_ORDER]` (default: the dispatch state first, then states ranked by demand evidence)
- Primary rental service: `[PRIMARY_RENTAL_SERVICE]`
- Secondary rental service: `[SECONDARY_RENTAL_SERVICE]`
- Keyword split: `[KEYWORD_SPLIT]` as primary / secondary / other Super 9 (default 70 / 15 / 15; for example A Linen uses 60 laundry / 30 dishwashing / 10 other)
- Pages to build this run: `[SERVICE_AREA_PAGES]` (USA index, a state hub, a hub city with its places, or a named batch)
- Verified dispatch locations: `[DISPATCH_LOCATIONS]` (if unknown, delivery is "quoted per job")
- Local asset folder: `[LOCAL_ASSET_FOLDER]`
- Repository: `[PROJECT_REPOSITORY]`
- Verified phone/email: `[PHONE]` / `[EMAIL]`
- Team example page to match: `[EXAMPLE_PAGE_URL]`
- Outside reference: https://charlestonrestroomtrailerssc.com/south-carolina/abbeville/ (good structure for the 5 data points; do not copy its prices or wording)
- Keyword data: `references/super-9-keyword-matrix.md`
- Equipment, specs and rates: `references/super-9-equipment-directory.md` (copy of the Equipment skill's directory; update both together)

Never hardcode a particular state. Ask if the site scope, services, keyword split, or pages to build cannot be determined from verified business information.

## Every state gets landing pages, built one state at a time
National sites cover **all 50 states plus DC**. Every state gets a state hub, hub city pages, and a landing page for every incorporated municipality. Kermit's "one state at a time" rule sets the **build order**, not the coverage:
- **Phase 1: state pages for every state.** Build all 51 state hubs first. Each has its own state map with every municipality registered, plus its own statewide incidents and local knowledge. Then every state on the USA map opens a real page.
- **Phase 2: hub cities and places, state by state.** Follow `[STATE_ORDER]`. In each state, build the hub cities, then their place pages. Finish that state's planned batch before starting the next state.
- **Scale:** about 19,489 municipal governments and 3,031 counties nationwide (U.S. Census Bureau, 2025). This is a long program; every state's manifest tracks what is registered, planned, and live.
- **No mixing:** never put another state's places or incidents on a state's pages.

State-scope sites cover only `[STATE_NAME]` and skip Level 0.

## Site hierarchy and slugs
Slug rule: **service area › state › city › place**.

| Level | Page | Route | Covers |
|---|---|---|---|
| 0 | USA index (national sites only) | `/service-area/` | USA map; every state has its own incidents and local knowledge |
| 1 | State hub (every state) | `/service-area/[state]/` (e.g. `/service-area/florida/`, `/service-area/texas/`) | Map of every incorporated municipality; regions, hub cities, statewide data points |
| 2 | Hub city | `/service-area/[state]/[city]/` (e.g. `/service-area/florida/miami/`) | A major city and links to its 10–20 nearby places |
| 3 | Place landing page | `/service-area/[state]/[city]/[place]/` (e.g. `/service-area/florida/miami/hialeah/`) | Every other incorporated municipality (city, town, village, borough, township where incorporated), plus counties, regions, countryside, and unincorporated communities, each nested under its nearest hub city |

- **Every incorporated municipality in every state gets its own landing page** over time. Example: Florida has 411 incorporated municipalities (267 cities, 123 towns, 21 villages) across 67 counties. That means 411 municipality pages in Florida alone, plus county and countryside pages where demand evidence exists. Each state uses its own legal types (for example boroughs or townships) from its official list.
- **Hub cities** are chosen by population, demand evidence, and geographic spread. Each hub holds about 10–20 places; if a hub would exceed 20, promote a nearby large municipality to a hub.
- **Legal type does not equal size** (Florida example: Davie is a town of about 106,000; Bal Harbour is a village of about 3,000). Choose hubs by size and demand, not by the words city, town, or village.
- **Slugs:** lowercase and hyphenated. Add the county to the slug only when two places in the state share a name.
- **Breadcrumbs** mirror the route: Home › Service Area › [State] › [Hub city] › [Place].
- **Existing routes:** if the site already uses other routes (for example `/service-area/miami/hialeah`), move them to this structure with permanent (301) redirects and update canonicals, the sitemap, and internal links.
- **Scale:** build in batches. Never publish pages that fail the quality gate just to hit a number.

## Coverage manifest: single source of truth
Create or update one data file **for every state** in the repo, following repo conventions (for example `src/data/service-areas/florida.json`, `src/data/service-areas/texas.json`). It drives the maps, hub lists, nearby links, and progress tracking, so every worker uses the same list. National sites also keep `src/data/us-states.json` for the USA map.

Fields per place: name, slug, legal type (city / town / village / county / CDP / unincorporated / region), incorporated (yes/no), county, region, latitude, longitude, population and source year, level (hub / place / map-only), parent hub slug, map fact (one short sourced local fact), page status (planned / draft / live), research log path, worker, last updated.

Fields per state (USA map): name, abbreviation, incidents (1–3, each with title, date, one-to-two-sentence summary, equipment need, source URL), status (confirmed dispatch / live state page / inquiry only), state hub slug.

- **Register every incorporated municipality** in each state from that state's official municipal list (for example the state league of cities directory), with coordinates from the U.S. Census Bureau Gazetteer place files. Record both sources and the totals by type. Add all counties. Never hand-place coordinates.

## USA incident map (Level 0, national sites only)
Kermit's requirement: a USA map where **every state shows its own, different local incidents and local knowledge**, not the same generic message for every state.
- **Map:** all 50 states plus DC, outline from Census cartographic boundary files, Albers USA projection with Alaska and Hawaii insets, generated at build time.
- **Interaction:** hovering, focusing, or clicking a state opens a panel. Keyboard accessible with visible focus; a state dropdown for mobile.
- **Panel contents:**
  - The state's name.
  - 1–3 dated, sourced incidents or local-knowledge facts from that state, such as hurricanes, floods, wildfires, freezes, a hospital or school system outage, or a major construction or renovation program.
  - The equipment each situation calls for, following the keyword split.
  - A status label: Confirmed dispatch, Live state page, or Inquiry only.
  - A link to the state hub if it is live; otherwise "Request a quote for [State]". Never link to a page that doesn't exist.
- **Every state is different:** no template sentence with only the state name swapped. Prefer the last 10 years: FEMA major disaster declarations, NOAA billion-dollar disaster reports, National Weather Service event summaries, state emergency management, and major news.
- **Integrity:** incidents are local context, not claims that the brand responded. Mark only verified dispatch locations as dispatch. Never imply delivery commitments to inquiry-only states.
- **Crawlable:** render every state's panel text on the server in an HTML list or accordion below the map, so search engines can read it.

## State map (Level 1; mini-map on hub cities)
- Accurate SVG outline of `[STATE_NAME]` only, generated at build time from the manifest with one shared projection (for example d3-geo fitted to a Census cartographic boundary outline).
- **Every registered municipality** gets a marker at its real coordinates with its name. Hubs are always labeled; other names show on hover, focus, or zoom. Use distinct marker styles for hub, live page, and planned, with a legend.
- Clicking a marker opens a small popup with the name, legal type, county, the place's map fact (when one exists), and a link to its page if live, otherwise to its hub.
- Keyboard accessible, touch-friendly, usable on mobile (pan/zoom or tap-to-select), with search by place or county.
- Crawlable HTML list of every municipality grouped by hub or county beside or below the map. This list is excluded from word counts.
- Lightweight: no heavy map library or tile service, no layout shift.

## Keyword and content rules
- **H1 and title: place first, then the keyword.** Examples:
  - "Hialeah, FL Mobile Laundry Trailer Rentals"
  - "Miami Mobile Laundry & Dishwashing Trailer Rentals"
  - State hub: "Florida Mobile Laundry Trailer Service Areas"
  - USA index: "United States Mobile Laundry Trailer Service Areas"
  - Shower or shower/restroom combination sites: put the place first, then shower trailer, shower and restroom combination, and ADA combination shower trailer (Kermit's rule).
- **Keyword split:** follow `[KEYWORD_SPLIT]` (for example 60% laundry, 30% dishwashing, 10% the rest of the Super 9). Measure by share of body words and report it. The "other" share leans on the primary's family (see keyword matrix).
- **Detail paragraphs:** every detail paragraph is **150–200 words**, with **1–3 equipment keywords** and **at least 1 place name** (this page's place or a nearby municipality). This applies to the data points, local knowledge, logistics, and climate sections.
- **Word count:** about 2,000–2,200 words of visible body text per landing page. Exclude navigation, footer, the map's place list, tables, and the trailer specifications block. State the counting method in the audit.
- **Location + keyword density:** one location + equipment keyword combination for every 50 words (about 40–44 per page). One combination = one sentence naming a specific place together with a Super 9 equipment keyword. Vary phrasing naturally. Never put combinations in hidden text, footers, alt-text lists, or keyword blocks. If hitting the ratio makes a sentence unnatural, rewrite the sentence instead of stuffing it. Report the actual ratio.
- **Modifiers:** use only modifiers that are true for the brand: "emergency" only if emergency service is verified, "leasing" only if offered, "ADA" only for ADA units, "24/7" only if verified.
- **Main uses:** laundry, kitchens, and dishwashing are framed around temporary facilities during renovation, construction, outages, and workforce or recovery camps. Refrigeration is framed as emergency (every walk-in failure is an emergency call).

## Local knowledge and real rental situations
For every landing page, research accurate, useful examples in each category below. Use what genuinely exists; write "none found" in the research log instead of inventing anything.

| Category | What to find | Where to look |
|---|---|---|
| Landmarks and organizations | Landmarks, venues, hospitals, schools, universities, local organizations | Official sites, state agency directories, local news |
| Directions and site logistics | Main corridors, key intersections, delivery access limits (causeways, low clearances, gated areas, barrier islands, downtown loading rules) | State DOT, city traffic and permit pages, 511 services |
| Emergencies and breakdowns | Natural disasters, utility outages, facility equipment failures | FEMA declarations, NOAA NCEI Storm Events, NWS, local news |
| Named emergency-response projects | Named recovery or response operations, past or present | FEMA, state emergency management, county EMA reports |
| Events, construction, renovation | Major events, active builds, facility renovations | City and county capital plans, school bond projects, hospital news, permit records |
| Specialized worksites | Military bases, ports, plants, utilities, agriculture, remediation sites | Official base and port sites, economic development agencies |
| Climate and seasonal needs | Hurricane, freeze, wildfire, heat, rainy season, tourist or harvest peaks | NWS climate pages, state climatologist |
| Dispatch and equipment fit | Which verified dispatch location serves the place, and which units fit local needs | Business records only; never assume dispatch |
| Evidence | Real photos, real customer examples, credible sources | Business records and permissions only |

Never imply an institution is a customer, the brand worked on a project, or the brand responded to an event unless verified. Label illustrative scenarios as illustrative.

## The 5 mandatory data points: sequential, numbered, on every page
Every landing page has one H2 section (for example "What's Happening Around [Place] That Affects [Service] Rentals") with these five numbered H3s **in this order**:
1. **Emergency past events and required construction:** real disasters, outages, breakdowns, and named emergency-response projects that forced repairs or temporary facilities.
2. **Major construction projects:** active builds in or near the place, with status and source.
3. **Major renovation projects:** facility upgrades that take laundry rooms, kitchens, dish rooms, cold storage, restrooms, or showers offline.
4. **Emergency equipment routes:** main corridors linking verified dispatch or likely staging areas to the county emergency management agency and the state emergency operations center. Name the real agencies and towns. Label distances as straight-line or road miles. Do not invent official staging areas. This is planning information, not a promised dispatch time.
5. **Local equipment pricing:** rate table using directory rates and periods, delivery parameters (distance from verified dispatch or "quoted per job"), and what changes the price. Never invent place-specific prices or surcharges. Categories without directory rates and values with unresolved conflicts show **Request a quote**.

### Detail paragraph formula
Each 150–200-word paragraph follows this order:
1. **Fact:** what happened or is happening, where, when, and how big, from a cited source.
2. **Facility impact:** what it did or does to laundry, kitchens, dish rooms, cold storage, restrooms, showers, or crew housing.
3. **Equipment fit:** which Super 9 units meet that need and why, following the keyword split.
4. **Next step:** what a facility manager should have ready (location, power, water, drainage, access, dates), then the quote CTA.

Date every event; prefer the last 10 years plus landmark historic events. Every fact must be traceable in the page's research log.

## Page wireframes

### Level 0: USA index (national sites)
1. Header (exact nav: **Home | Equipment | Service Area | Use cases | About Us | Contact Us**, plus Request Quote) and breadcrumb.
2. Hero: place-first H1, 80–120-word intro, quote CTA, phone.
3. USA incident map with state panels and legend.
4. Crawlable state-by-state list with each state's incidents and status.
5. Verified dispatch locations and how out-of-area quotes work.
6. Equipment overview following the keyword split, linking to Equipment pages.
7. FAQs (5–6), final CTA, footer.

### Level 1: State hub
1. Header and breadcrumb.
2. Hero: place-first H1, 80–120-word intro, CTA, phone.
3. State map of every municipality, with search and legend.
4. Regions and hub cities: each region with its hubs, one-line local hooks, and links.
5. The 5 data points, statewide.
6. Statewide local knowledge: climate and seasonal needs, specialized worksites, major corridors.
7. FAQs (5–6).
8. **Trailer specifications** (see below).
9. Final CTA, crawlable municipality list, footer.

### Level 2: Hub city and Level 3: Place
1. Header and breadcrumb.
2. Hero: place-first H1, intro naming the place, county, and state plus the primary and secondary units, CTA. Level 3 intros also state the direction and straight-line distance to the parent hub. Below the hero, a facts strip: legal type, county, population (with Census year), hub city and labeled distance.
3. Equipment available in [Place], following the keyword split, with links to Equipment pages.
4. The 5 data points for this place, never copied from the hub.
5. Local landmarks, hospitals, schools, venues, and organizations, and the equipment needs they suggest.
6. Specialized worksites (military, industrial, ports, agriculture), where relevant.
7. Delivery access and site logistics: corridors, intersections, access limits, verified dispatch.
8. Climate and seasonal rental needs.
9. Customer examples and evidence: only verified ones; omit the section otherwise.
10. Places served from [Hub] (Level 2: all 10–20 places with a local hook each, plus a mini-map) or Nearby areas (Level 3: parent hub and the 3–6 nearest siblings).
11. Local FAQs (4–6).
12. **Trailer specifications** (see below).
13. Final CTA and footer.

## Trailer specifications block (bottom of every landing page)
A clean, consistent block just above the final CTA on every Level 1–3 page:
- **Primary and secondary units:** a comparison table (unit, size, key equipment, utilities, rate period and range or "Request a quote"), followed by one compact spec card per unit, copied exactly from the directory.
- **Only units confirmed for this state.** Mark unconfirmed units as missing data, not published.
- **Other Super 9 categories:** a short linked list to their Equipment pages.
- **Mobile:** spec cards collapse with `<details>`; tables scroll horizontally inside the table only, with a sticky first column.
- **Shared content:** the block is excluded from word counts and from the overlap check.

## Quality gate: real local evidence or no page
Google's spam policies name city pages that funnel to one page (doorway abuse) and mass-produced pages without value (scaled content abuse). Every page must stand on its own evidence:
- Publish a page only when data points 1–4 each have at least one sourced, place-specific fact and at least three local-knowledge categories have real findings. If research cannot support that, keep the place map-only, covered on its hub page, until evidence is found.
- Do not reuse paragraphs across location pages, except the pricing table, CTA block, and trailer specifications block. Check text overlap within each batch and against existing pages; rewrite any page that shares more than about 30% of its 5-word phrases with another (team default; use Kermit's threshold if he sets one).
- No fake local addresses, phone numbers, or "office in [place]" claims. LocalBusiness schema only for verified physical locations.
- Keep a research log per page (fact, category, source URL, publication date, access date) in the repo next to the manifest.

## Internal links
- USA index → every live state hub.
- State hub → every hub city; the state map → every live page.
- Hub city → all its places, 3–5 nearby hubs, the state hub, relevant Equipment category pages, Use cases, Contact.
- Place → parent hub, 3–6 nearest siblings, the state hub, relevant Equipment category pages, Contact.
- Use descriptive, varied anchors and link only to live routes.

## Visual design
Follow `DESIGN.md` in the repo root when present (section 6 holds the approved USA map, state, and place page layouts), and reuse the homepage and Equipment page components. Keyword highlighting is a review aid in mockups only; never style keywords differently on live pages. Clean modern B2B: real photos, readable tables on mobile, clear CTAs. No repetitive card walls, generic gradients, intrusive overlays, fake reviews, or filler. Optimize desktop, tablet, and mobile separately.

## Technical SEO and QA
- One H1 and logical H2/H3 on every page.
- A unique place-first title and meta description per page, plus a self-referencing canonical.
- Schema: BreadcrumbList, and Service schema with `areaServed` set to the specific place and its state. FAQPage markup only when it matches visible FAQs. No review or rating schema without genuine reviews.
- Generate every level's routes from the manifests (for example with `generateStaticParams` in Next.js), so all pages are static HTML.
- The XML sitemap includes only live pages. Add permanent redirects for any moved routes.
- Test both maps, all links, forms, and breakpoints.
- Avoid hidden keyword blocks, broken routes, and duplicate templates with only the place name swapped.

## Kermit's 18-point final audit
Run the full audit on the USA index, the state hub, every hub city, and at least 3 place pages per hub in each batch (or every page Kermit will review). For all other pages, produce batch metrics:
- Word count and location + keyword ratio.
- Keyword split shares.
- Share of detail paragraphs meeting the 150–200-word / 1–3 keyword / 1+ place rule.
- Data points present and sourced, and local-knowledge categories found.
- Trailer specifications block present.
- Overlap % and broken links.

1. **Most-mentioned cities:** top two with exact counts; report ties.
2. **Total cities:** every unique city and its count, total mentions; separate other geographic types. Define the counting method on rendered visible content, excluding map lists and the specifications block.
3. **Rental subjects:** primary, secondary, and other frequencies against `[KEYWORD_SPLIT]`; meaningful place connections.
4. **Content quality:** 1–10 for clarity, usefulness, naturalness, and repetition; strengths, weaknesses, word count.
5. **Worker time:** realistic research, writing, formatting, imagery, and QA estimates per page and per batch.
6. **Competitor:** compare with https://thelavatoryfresno.com/ (its closest equivalent location page where one exists) on clarity, usefulness, naturalness, specific rentals, locations, and repetition; score both fairly.
7. **Audit identification:** production URL of the page and worker name.
8. **Local knowledge:** check each local-knowledge category (landmarks and organizations, logistics, emergencies, named response projects, events and construction, specialized worksites, climate, dispatch, evidence) against the research log.
9. **Local evidence comparison:** score both pages 1–10; target at least 7.5 by improving real usefulness, **never by inventing proof**. Separate actual projects from examples.
10. **Place and state focus:** place-first H1 and title; state in title, intro, and body; verify parent, child, and sibling links; clickable page URL; score.
11. **24/7 and emergency:** emergency emphasis 1–10 (target 8–10 for refrigeration; at least 4 for others where relevant), plus separate clarity, usefulness, and credibility. Verify 24/7.
12. **Reserved:** leave pending; do not invent a replacement.
13. **Pricing:** service, location, price, period, delivery, collection, setup, minimums, exclusions; rates from the Super 9 Directory; verified or explicitly estimated only; transparency score.
14. **Authority:** current production-domain Moz DA and/or Ahrefs DR, provider and date; unknown if inaccessible. Never substitute Vercel authority or equate DA and DR.
15. **CTAs:** visibility, usefulness, destination, consistent contact information, mobile testing; score.
16. **Internal links:** USA/state/hub/place/sibling/equipment/contact paths, descriptive anchors, verified broken links; score.
17. **Municipalities and coverage:** classify cities, towns, villages, counties, states, regions, metros, districts, neighborhoods, and unincorporated areas; confirm the manifest classification and totals match the official list; include in local-evidence scoring.
18. **Low-DA focus:** when verified Moz DA <=10, score state and municipality focus; if DA unknown, mark threshold unverified. Company strategy, not Google policy.

## Completion criteria
- The manifests are complete and sourced: every incorporated municipality in each built state is registered with totals by type, and national sites have every state's incidents, all different and sourced.
- National sites: all 51 state hubs are live before Phase 2 starts, and every state on the USA map opens its own state page.
- Map geometry, marker positions, state panels, and every map link are checked.
- Each built page has a place-first H1, the 5 data points in order, 150–200-word detail paragraphs, sourced local knowledge, correct classification, the trailer specifications block, the keyword split and location + keyword ratio reported, and a passing overlap check.
- Prices match the directory, with no conflicting value published.
- Redirects are in place for any moved routes.
- Buttons, forms, breadcrumbs, and maps are tested on desktop, tablet, and mobile with no overlap or clipping.
- Only the requested Service Area pages were created, and the nav labels are exact.

A successful build alone is not completion.

## Deliverables
- Production-ready Service Area pages for this run
- Updated manifests (sources, totals by type, page status) and per-page research logs
- National progress table: per state, municipalities registered, pages planned, pages live
- Desktop and mobile screenshots, including both maps
- Keyword matrix per page with the location + keyword ratio and keyword split shares
- Kermit's 18-point audit (full and batch metrics as above)
- Overlap check results and pages held back by the quality gate
- Redirect list, internal-link map, and technical QA findings
- Unverified claims and unresolved directory conflicts
- Realistic worker time estimate and next batch plan

**Final principle:** Write like a knowledgeable American rental business that knows each place. Every state on the map tells its own story, every place mention carries a real local fact or a real buyer need, every price matches the directory, and every page helps a facility manager in that place decide and request equipment. No generic AI SEO filler and no place-name swaps.
