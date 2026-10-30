# New Trailer Rental Website: Master Prompt

Use this for every new site. It tells Claude or Codex what the site is, how it is built, how it looks, every page it needs, and the order to build them in.

**How to use**
1. Run `new-trailer-site create <folder>` from trailer-site-kit. It puts this file, the skills, `DESIGN.md`, and a filled-in `site-inputs.md` (Part A) in the new repo. Without the kit: put this file in the repo root as `NEW-SITE-PROMPT.md` and the three skills in `.agents/skills/` (Codex) or add them to Claude.
2. Fill in Part A (or the `[FILL IN]` lines in `site-inputs.md`).
3. Run the phases in Part F in order, one phase per session, pasting each phase's prompt as written.

**Order of authority:** Part A facts → skill rules → Part C design. Never invent a fact that Part A or the equipment directory does not give. Ask for it or mark it missing.

---

## Part A: Site inputs (fill for every new site)

```
Brand:
Production domain:
Preview URL:
Site scope:                  national (USA map + every state) | state (one state only)
Home state / abbreviation:   (the state the homepage and Equipment pages focus on)
Verified dispatch locations:
Phone:
Email:
Primary rental service:      (Super 9 category name and #)
Secondary rental service:    (Super 9 category name and #)
Keyword split:               primary / secondary / other   (default 70 / 15 / 15)
Units we rent and where:     (per category: unit names, states where confirmed)
Extra rates:                 (anything not in the equipment directory)
Homepage map:                USA incident map | state map
State build order:           (national sites; default: dispatch state first, then by demand)
Repository:
Real photo folder:
Brand colors / logo:         (optional; otherwise Part C defaults)
Team example pages:
```

### Example: A Linen

```
Brand:                       A Linen Rental & Laundry Services USA
Production domain:           https://aalinenrentalandlaundry.com/
Preview URL:                 https://aalinenrentalandlaundry.vercel.app/
Site scope:                  national
Home state / abbreviation:   Florida / FL
Verified dispatch locations: Miami, FL
Phone:                       (786) 309-9178
Email:                       [EMAIL]
Primary rental service:      Laundry / Mobile Laundry / Portable Laundry (#7)
Secondary rental service:    Commercial Dishwashing (#2)
Keyword split:               60 / 30 / 10
Units we rent and where:     [laundry and dishwashing units confirmed for Florida]
Extra rates:                 [laundry rates, if any]
Homepage map:                USA incident map
State build order:           Florida first, then [next states]
Repository:                  [GITHUB REPO URL]
Real photo folder:           [PATH]
Brand colors / logo:         Part C defaults
Team example pages:          [LOUISVILLE PAGE URL]
```

---

## Part B: Tech stack

- Next.js (App Router) with TypeScript in strict mode. Use the version already in the repo; if starting fresh, use the latest stable.
- Follow the repo's existing folder structure, styling, and components. Don't add new frameworks or UI libraries.
- Every page is statically generated, so search engines get full HTML.
- SEO: `generateMetadata` for each page's title, description, and canonical; JSON-LD in a `<script type="application/ld+json">` tag; `app/sitemap.ts` (live pages only) and `app/robots.ts`.
- Service Area routes come from the data files with `generateStaticParams`: `src/data/us-states.json` and `src/data/service-areas/[state].json`.
- Maps: SVG generated at build time from Census boundary files; place and state lists rendered on the server; only click, hover, and select behavior runs on the client.
- Moved routes get permanent redirects in `next.config`.
- Images: `next/image` with width, height, and descriptive alt text.
- Fonts: Poppins and Inter through `next/font/google`.
- Forms: a route handler or server action posting to the approved destination, with real validation. Never pretend a form works.
- Client components (`'use client'`) only for the menu, maps, form, and carousel.
- Done means `next build`, `tsc --noEmit`, and lint all pass with no errors and no `any` types.

---

## Part C: Design

Save this part as `DESIGN.md` in the repo root if it is not there yet.


Read this file before building any page. It sets the look and feel for every site. The skill rules (homepage, Equipment, Service Area) always win when they conflict with this file.

**Inspiration:** a modern cleaning and restoration homepage (screenshot: `docs/design-inspiration.jpg`, if saved in the repo). Use its **layout patterns and visual rhythm only**. Do not copy its brand name, logo, logo motifs (the dot cluster beside buttons), vehicle wraps, photos, copy, stats, or reviews. If the client has their own brand colors or logo, swap the color tokens below and keep the same roles.

---

### 1. Design direction in one line
Clean, confident B2B service brand: deep navy and white sections that alternate, one bright aqua accent, a soft lime call-to-action color, big real equipment photos, curved wave dividers, and short, scannable copy blocks.

### 2. Design tokens

```css
:root {
  /* Brand roles (swap per client brand) */
  --color-navy-900: #0A172F;      /* deepest backgrounds, top bar, footer */
  --color-navy-800: #162745;      /* main dark sections, headings on light */
  --color-navy-700: #22375C;      /* chips on navy */
  --color-slate-600: #3C4F62;     /* body text on light backgrounds */
  --color-slate-300: #B8C4D6;     /* body text on navy */
  --color-accent: #13D6E0;        /* bright aqua: accents ON NAVY only, icon badges, lines */
  --color-accent-text: #0B8187;   /* aqua for accent TEXT on white (WCAG AA) */
  --color-accent-tint: #E6F6F7;   /* table group rows, light bands */
  --color-cta: #C7FD96;           /* lime pill buttons, always with navy text */
  --color-cta-hover: #B4F276;
  --color-white: #FFFFFF;
  --color-surface: #F7F7F8;       /* cards and alternate sections */
  --color-surface-2: #E9ECEC;     /* table stripes, source chips, research-slot tiles */
  --color-border: #DFDFE2;

  /* Type */
  --font-heading: "Poppins", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;

  /* Shape and depth */
  --radius-card: 16px;
  --radius-input: 12px;
  --radius-pill: 999px;
  --shadow-card: 0 8px 24px rgba(22, 39, 69, 0.08);
  --shadow-card-hover: 0 14px 32px rgba(22, 39, 69, 0.14);

  /* Layout */
  --container: 1200px;
  --gutter: 24px;                 /* 16px under 640px */
  --section-y: 80px;              /* 56px on mobile */
}
```

**Contrast rules (checked):**
| Pair | Ratio | Use |
|---|---|---|
| Navy `#162745` on white | 14.9:1 | Headings, body on light |
| Slate `#3C4F62` on white | 8.4:1 | Body text |
| Navy on lime `#C7FD96` | 12.7:1 | CTA button text |
| Aqua `#13D6E0` on navy | 8.3:1 | Accent words and icons on dark sections |
| Aqua `#13D6E0` on white | **1.8:1, fails** | Never use for text on white |
| Accent-text `#0B8187` on white | 4.7:1 | Accent words on light sections |

#### Typography scale
| Role | Font | Size (mobile → desktop) | Weight | Line height |
|---|---|---|---|---|
| H1 | Heading | `clamp(2.25rem, 4.5vw, 3.25rem)` | 700 | 1.1 |
| H2 | Heading | `clamp(1.75rem, 3vw, 2.25rem)` | 700 | 1.2 |
| H3 | Heading | 1.25–1.375rem | 700 | 1.3 |
| Eyebrow | Heading | 0.8125rem, uppercase, letter-spacing 0.12em | 600 | 1.4 |
| Body | Body | 1.0625rem | 400 | 1.65 |
| Small/caption | Body | 0.8125–0.875rem | 400–600 | 1.5 |

Paragraph max width: 72–75ch. Load fonts with `next/font/google` (no layout shift).

#### Breakpoints
Mobile < 640px · Tablet 640–1023px · Desktop ≥ 1024px. Design each separately; don't just shrink desktop.

### 3. Signature elements
1. **Wave dividers.** Curved SVG edges between navy and white sections. The hero bottom wave has a thin aqua stroke following the curve. Inline SVG, `aria-hidden="true"`, `preserveAspectRatio="none"`, 56–64px tall. One reusable `<WaveDivider position="top|bottom" from="" to="" stroke? />`.
2. **Two-tone headings.** One key phrase per heading in the accent color (aqua on navy, `--color-accent-text` on white). On location pages, the accent phrase is the place name.
3. **Eyebrow above every H2.** Short uppercase label in accent color ("EQUIPMENT IN HIALEAH", "LOCAL CONDITIONS").
4. **Lime pill CTAs.** Navy text, 48px min height, pill radius, a right arrow. Secondary CTA: white 2px outline pill (on navy) for the phone number. One primary CTA per section, max.
5. **Icon badges.** 56–64px aqua circles with a **navy** line icon (white icons on aqua fail contrast).
6. **Numbered timeline.** 52px navy circles with aqua numerals beside white cards; used for the 5 data points.
7. **Section rhythm.** Navy hero → white → light gray → white → light gray … → navy CTA band → navy-900 footer. Never two navy sections in a row.
8. **Card hover.** Surface card turns white, lifts (`--shadow-card-hover`), and shows an aqua bottom border. Respect `prefers-reduced-motion`.

### 4. Shared page chrome (every page)
- **Top bar** (navy-900, 13px): dispatch line on the left (for example "Miami dispatch · U.S. inquiries"; "24/7" only if verified), phone in lime on the right.
- **Header** (white, bottom border): wordmark left; nav exactly **Home | Equipment | Service Area | Use cases | About Us | Contact Us** (active item: 2px aqua underline); lime "Request Quote →" pill right. Wraps cleanly on mobile; accessible mobile menu.
- **Breadcrumb** on every interior page, small, inside the hero.
- **Footer** (navy-900): wordmark, brand line with city/state, phone in lime, the same six nav labels.

### 5. Homepage (homepage skill's 15 sections → pattern)

| # | Skill section | Pattern | Adaptation rules |
|---|---|---|---|
| 01 | Header and navigation | Shared chrome | Exact six labels. |
| 02 | Hero | Full-bleed real photo, navy overlay on the left, eyebrow, H1 with accent phrase, short paragraph, CTA, aqua-stroke wave | Real primary trailer photo. H1 max 4 lines on desktop. |
| 03 | Quick rental inquiry | White card overlapping the hero bottom | Equipment type, city/ZIP, start date, duration, contact. Stacked on mobile. Real submission destination only. |
| 04 | Equipment showcase | Featured card + smaller cards | **Not equal cards.** Primary service gets the large navy featured card, secondary a light card, the rest small linked chips, following the keyword split. |
| 05 | Why choose us | Icon list + photo collage | Verified advantages only. |
| 06 | Testimonials | Review cards | Genuine attributed reviews only; otherwise omit. No autoplay. |
| 07 | Municipality applications | Scenario cards labeled with the place | Before/after slider only with real job photos. |
| 08 | Interactive map | Navy map block | Use the site's **homepage map** input: the USA incident map (section 6) on national sites, or the state map. |
| 09 | Pricing and availability | White rate table on light gray | "Request a quote" where no rate exists. |
| 10 | Industries and use cases | Icon cards | 4–6 cards. |
| 11 | Emergency support | Navy block: circular real photo with aqua ring, 3 icon features, CTA + phone | Badge text verified only. |
| 12 | How rental works | 4 steps on navy | Inquire, select, review site, confirm quote and delivery. |
| 13 | Technical planning guide | Light section | Checklist + spec table. |
| 14 | FAQs | `<details>` accordion, first open | |
| 15 | Final CTA and footer | Wave + navy CTA band, footer | Same six labels. |

**Stats strip:** numbers only when verified. Otherwise factual tiles (for example "Daily, weekly and monthly rentals") or drop it.

### 6. Service Area pages (approved layouts)

#### USA map page `/service-area/` (national sites)
1. Shared chrome.
2. Navy hero: breadcrumb, eyebrow "50 STATES + DC", place-first H1 ("United States [Service] Service Areas", "United States" in aqua), short intro, wave.
3. Map section (white): eyebrow "PICK A STATE", H2 "Real Incidents, State by State". Left: a "Choose a state" select (44px) above the USA map. Right: a white panel (bottom sheet on mobile) with "SELECTED STATE", the state name, a status pill (lime "Confirmed dispatch · [city]" or gray "Inquiry only"), 1–3 incident cards (navy date chip with aqua text, bold title, one-line summary, "Equipment need:" line), a lime CTA, and the small line "Incidents are local context, not a record of our work."
4. Map styling: states with researched incidents in navy, research-slot states in `--color-surface-2`, selected state aqua with navy label, dispatch state with a lime inner ring; legend below. The live site uses the real Census outline (Albers USA with Alaska and Hawaii insets); a tile grid is acceptable only as a mockup.
5. Crawlable list (light gray): every state's incidents in plain text, 3-column cards, each state name linking to its page once live.
6. Footer.

#### State page `/service-area/[state]/`
Navy hero with place-first H1 → state map of every municipality (search, legend: hub / live page / planned; marker popup with name, legal type, county, one sourced fact, link) → regions and hub cities → the 5 data points, statewide (timeline) → statewide local knowledge → FAQs → trailer specifications → CTA band → crawlable municipality list → footer.

#### Hub city and place pages `/service-area/[state]/[city]/` and `/[state]/[city]/[place]/`
In this order:
1. Shared chrome; top bar names the place's county ("Miami dispatch · Serving Hialeah and Miami-Dade County").
2. **Navy hero:** breadcrumb (Home › Service Area › State › Hub › Place), eyebrow "[COUNTY] · [STATE]", H1 with the place first in aqua ("**Hialeah, FL** Mobile Laundry & Dishwashing Trailer Rentals"), 80–120-word intro, lime "Request a [Place] Quote →" + outline phone pill, real photo on the right, aqua-stroke wave.
3. **Facts strip:** four light tiles: legal type, county, population (with Census year), hub city with labeled straight-line distance.
4. **Equipment in [Place]:** primary service as a wide navy featured card (photo, text, size chips, rate or "Request a quote", "specs ↓" link), secondary service as a light card beside it, other Super 9 as linked chips below.
5. **Local conditions:** eyebrow "LOCAL CONDITIONS", H2 "What's Happening Around [Place] That Affects [Service] Rentals", then the numbered timeline 1–5 (emergencies, construction, renovation, routes, pricing). Each card: H3, 150–200-word paragraph, gray source chip. Pricing card holds a navy-header rate table.
6. **Local knowledge:** two bordered cards side by side: landmarks/hospitals/schools/venues, and industrial/specialized worksites.
7. **Site planning:** two white cards on light gray: delivery access, and climate/seasonal needs.
8. **Customer examples:** only when verified; otherwise the section is not rendered.
9. **Nearby:** pill links; the parent hub as a filled navy pill, siblings with their legal type ("Miami Lakes · town"), and "All of [State] →".
10. **FAQs:** 4–6 `<details>`, first open.
11. **Trailer specifications** (`id="specs"`): H2 "[Place] Trailer Specifications", one table with category group rows (`--color-accent-tint`), columns Unit / Key equipment / Rate, specs copied exactly from the directory; then a line linking other equipment.
12. **CTA band:** wave into navy, H2 "Get a [Place] [Service] Quote", lime CTA + outline phone.
13. Footer.

**Research slots** in drafts: dashed `--color-slate-300` boxes with bracketed text. They must be replaced with sourced facts or removed before a page goes live.

**Keyword highlighting** (lime background on keywords, underlined place names) is a review aid in mockups only. **Never style keywords differently on live pages.**

### 7. Interior pages (Equipment)
- **Page hero:** shorter than the homepage hero, breadcrumb above the H1, real photo on the right, wave bottom.
- **Spec lists and comparison tables:** white cards, striped rows, category group rows. On mobile, scroll horizontally inside the table only, with a sticky first column.
- **Long-form text:** 72–75ch max, H3 every 150–250 words, short facts in callout boxes with an icon badge.

### 8. Components to build once (Next.js + TypeScript)
`TopBar`, `SiteHeader` (accessible mobile menu), `Breadcrumbs`, `Hero`, `PageHero`, `PlaceHero`, `WaveDivider`, `SectionHeading` (eyebrow + two-tone heading), `CtaButton`, `IconBadge`, `FactsStrip`, `EquipmentFeature`, `EquipmentChips`, `QuoteForm`, `RateTable`, `SpecTable`, `DataPointTimeline`, `InfoCardPair`, `NearbyPlaces`, `StepList`, `TestimonialCarousel` (renders nothing without real reviews), `UsIncidentMap` + `StatePanel` (client), `StateIncidentList` (server), `StateMap` (client), `PlaceList` (server), `FaqAccordion`, `CtaBand`, `SiteFooter`.

Only the menu, maps, form, and carousel are client components. Everything else renders on the server.

### 9. Do / Don't

**Do**
- Use real, licensed photos of the actual trailers, with descriptive alt text.
- Keep one primary CTA per section and the phone number visible in the top bar, hero, and footer.
- Make tap targets at least 44×44px and show visible focus states.
- Keep hero copy short; let tables and lists carry specs.

**Don't**
- Copy the inspiration's brand, logo motifs, vehicle wraps, photos, stats, or wording.
- Put aqua `#13D6E0` text on white.
- Style keywords differently on live pages.
- Use generic gradients, glows, autoplay carousels, intrusive popups, or fake reviews.
- Build equal-weight card walls for all Super 9 items.
- Show a USA map on state, city, or place pages.

---

## Part D: Every page on the site

| Page | Route | How many | Built with |
|---|---|---|---|
| Homepage | `/` | 1 | `state-trailer-homepage-builder` |
| Equipment hub | `/equipment/` | 1 | `state-trailer-equipment-pages-builder` |
| Equipment categories | `/equipment/[category]/` | 1 per Super 9 category the brand rents | `state-trailer-equipment-pages-builder` |
| USA map (national sites) | `/service-area/` | 1 | `state-trailer-service-area-builder` |
| State pages | `/service-area/[state]/` | 51 on national sites (50 states + DC); 1 on state sites | `state-trailer-service-area-builder` |
| Hub cities | `/service-area/[state]/[city]/` | about 10–40 per state, each holding 10–20 places | `state-trailer-service-area-builder` |
| Place pages | `/service-area/[state]/[city]/[place]/` | every incorporated municipality, plus counties, countryside, and unincorporated areas with real demand | `state-trailer-service-area-builder` |
| Use cases, About Us, Contact Us | existing routes | 1 each | Not covered by the skills yet; link only if they exist |

- **Scale:** the U.S. has 19,489 municipal governments and 3,031 counties (U.S. Census Bureau, 2025). Florida alone has 411 municipalities (267 cities, 123 towns, 21 villages) in 67 counties.
- **Every place gets its own page,** nested under its nearest hub city. Hub cities are chosen by size and demand, not by the words city, town, or village.
- **Routes:** lowercase and hyphenated; add the county only when two places in a state share a name. Breadcrumbs mirror the route.
- **Navigation, every page:** **Home | Equipment | Service Area | Use cases | About Us | Contact Us**, plus a Request Quote button.
- **Data files:** the Super 9 equipment directory and keyword matrix (inside the skills), `src/data/us-states.json` (USA map incidents), `src/data/service-areas/[state].json` (every place in the state), and a research log per location page.

---

## Part E: Content rules for every page

The skills hold the full detail; these are the rules that never change.

1. **Real facts only.** No invented incidents, customers, projects, dispatch times, reviews, stats, photos, or prices. A missing fact stays a bracketed research slot in drafts and is removed or filled before a page goes live.
2. **Equipment and prices** come from the Super 9 directory and Part A. Publish only units confirmed for that state. No rate → "Request a quote". Values with known directory conflicts are not published.
3. **H1 and title: place first, then keyword.** "Hialeah, FL Mobile Laundry & Dishwashing Trailer Rentals".
4. **Keyword split** from Part A, measured by share of body words.
5. **Detail paragraphs:** 150–200 words, 1–3 equipment keywords, at least 1 place name.
6. **Location pages:** about 2,000–2,200 words of body text, and one place + equipment keyword combination per 50 words, written naturally. Never hidden, never in keyword lists.
7. **The 5 data points,** numbered and in order, on every location page: (1) past emergencies, (2) major construction, (3) major renovation, (4) emergency equipment routes, (5) local pricing.
8. **Local knowledge,** researched for every location page: landmarks and organizations; directions and site logistics; emergencies and breakdowns; named emergency-response projects; events, construction, and renovation; military, industrial, and specialized worksites; climate and seasonal needs; verified dispatch and equipment fit; real photos and customer evidence.
9. **USA map:** every state has its own 1–3 dated, sourced incidents. No two states share template text.
10. **Trailer specifications block** at the bottom of every location page.
11. **Quality gate:** a location page goes live only when data points 1–4 each have a sourced fact and at least three local-knowledge categories have real findings. Otherwise the place stays map-only, served by its hub page.
12. **No copy-paste pages:** no reused paragraphs across location pages except pricing, CTA, and specs; rewrite any page that shares more than about 30% of its 5-word phrases with another.
13. **Truthful modifiers:** "emergency", "24/7", "leasing", and "ADA" only when verified.
14. **Kermit's 18-point audit** on every batch, as each skill describes.

---

## Part F: Build order (copy-paste prompts)

In Codex, start each prompt with `$` and the skill name, as written. In Claude, replace the first line with "Use the [skill name] skill."

### Phase 0: Set up the project
```
Read NEW-SITE-PROMPT.md.
1. Set up (or check) the Next.js App Router + TypeScript project from Part B.
2. Save Part C as DESIGN.md and Part A as site-inputs.md in the repo root if they don't exist.
3. Build the design tokens and the shared components in DESIGN.md section 8. No pages yet.
4. List every Part A field that is still blank.
```

### Phase 1: Homepage
```
$state-trailer-homepage-builder
Use site-inputs.md and NEW-SITE-PROMPT.md (Parts B–E). Design: DESIGN.md.
If "Homepage map" in site-inputs.md is "USA incident map", build section 08 as the USA incident map from DESIGN.md section 6 instead of a state map.
Build the homepage only.
```

### Phase 2: Equipment pages
```
$state-trailer-equipment-pages-builder
Use site-inputs.md and NEW-SITE-PROMPT.md (Parts B–E). Design: DESIGN.md.
Pages to build: Equipment hub + the primary and secondary category pages.
```
Repeat with `Pages to build: [category] category page` for each other category the brand rents.

### Phase 3: USA map and state pages
```
$state-trailer-service-area-builder
Use site-inputs.md and NEW-SITE-PROMPT.md (Parts B–E). Design: DESIGN.md.
National sites: build /service-area/ with the USA incident map, researching 1–3 real, dated incidents for every state into src/data/us-states.json. Then build the state pages in batches of [10] states, registering every incorporated municipality for each state in src/data/service-areas/[state].json.
State sites: build the one state page and register every municipality in that state.
List the states still to do at the end.
```

### Phase 4: Hub cities and place pages, one state at a time (repeat)
```
$state-trailer-service-area-builder
Use site-inputs.md and NEW-SITE-PROMPT.md (Parts B–E). Design: DESIGN.md.
State: [STATE] ([ST]).
Pages to build: [hub city, or "choose the hub cities"] and its 10–20 place pages.
Hold back any page that fails the quality gate and list it with what research is missing.
```

### Phase 5: Check and hand off
```
Run Kermit's 18-point audit on the pages built this session: full audit on the USA map, state pages, hub cities, and 3 place pages per hub; batch metrics for the rest.
Run next build, tsc --noEmit, and lint.
List unverified claims, held-back pages, missing photos, and redirect changes.
```

---

## New-site checklist
- [ ] Part A filled in
- [ ] Skills in `.agents/skills/` (Codex) or added to Claude
- [ ] `NEW-SITE-PROMPT.md`, `DESIGN.md`, `site-inputs.md` in the repo root
- [ ] Phases 0–5 run in order
- [ ] Preview shared with Kermit
