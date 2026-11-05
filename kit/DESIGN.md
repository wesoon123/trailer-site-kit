# DESIGN.md: Visual Direction for Trailer Rental Sites

Read this file before building any page. It sets the look and feel for every site. The skill rules (homepage, Equipment, Service Area) always win when they conflict with this file.

**Inspiration:** a modern cleaning and restoration homepage (screenshot: `docs/design-inspiration.jpg`, if saved in the repo). Use its **layout patterns and visual rhythm only**. Do not copy its brand name, logo, logo motifs (the dot cluster beside buttons), vehicle wraps, photos, copy, stats, or reviews. If the client has their own brand colors or logo, swap the color tokens below and keep the same roles.

---

## 1. Design direction in one line
Clean, confident B2B service brand: deep navy and white sections that alternate, one bright aqua accent, a soft lime call-to-action color, big real equipment photos, curved wave dividers, and short, scannable copy blocks.

## 2. Design tokens

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

### Typography scale
| Role | Font | Size (mobile → desktop) | Weight | Line height |
|---|---|---|---|---|
| H1 | Heading | `clamp(2.25rem, 4.5vw, 3.25rem)` | 700 | 1.1 |
| H2 | Heading | `clamp(1.75rem, 3vw, 2.25rem)` | 700 | 1.2 |
| H3 | Heading | 1.25–1.375rem | 700 | 1.3 |
| Eyebrow | Heading | 0.8125rem, uppercase, letter-spacing 0.12em | 600 | 1.4 |
| Body | Body | 1.0625rem | 400 | 1.65 |
| Small/caption | Body | 0.8125–0.875rem | 400–600 | 1.5 |

Paragraph max width: 72–75ch. Load fonts with `next/font/google` (no layout shift).

### Breakpoints
Mobile < 640px · Tablet 640–1023px · Desktop ≥ 1024px. Design each separately; don't just shrink desktop.

## 3. Signature elements
1. **Wave dividers.** Curved SVG edges between navy and white sections. The hero bottom wave has a thin aqua stroke following the curve. Inline SVG, `aria-hidden="true"`, `preserveAspectRatio="none"`, 56–64px tall. One reusable `<WaveDivider position="top|bottom" from="" to="" stroke? />`.
2. **Two-tone headings.** One key phrase per heading in the accent color (aqua on navy, `--color-accent-text` on white). On location pages, the accent phrase is the place name.
3. **Eyebrow above every H2.** Short uppercase label in accent color ("EQUIPMENT IN HIALEAH", "LOCAL CONDITIONS").
4. **Lime pill CTAs.** Navy text, 48px min height, pill radius, a right arrow. Secondary CTA: white 2px outline pill (on navy) for the phone number. One primary CTA per section, max.
5. **Icon badges.** 56–64px aqua circles with a **navy** line icon (white icons on aqua fail contrast).
6. **Numbered timeline.** 52px navy circles with aqua numerals beside white cards; used for the 5 data points.
7. **Section rhythm.** Navy hero → white → light gray → white → light gray … → navy CTA band → navy-900 footer. Never two navy sections in a row.
8. **Card hover.** Surface card turns white, lifts (`--shadow-card-hover`), and shows an aqua bottom border. Respect `prefers-reduced-motion`.

## 4. Shared page chrome (every page)
- **Top bar** (navy-900, 13px): dispatch line on the left (for example "Miami dispatch · U.S. inquiries"; "24/7" only if verified), phone in lime on the right.
- **Header** (white, bottom border): wordmark left; nav exactly **Home | Equipment | Service Area | Use cases | About Us | Contact Us** (active item: 2px aqua underline); lime "Request Quote →" pill right. Wraps cleanly on mobile; accessible mobile menu.
- **Breadcrumb** on every interior page, small, inside the hero.
- **Footer** (navy-900): wordmark, brand line with city/state, phone in lime, the same six nav labels.

## 5. Homepage (homepage skill's 15 sections → pattern)

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

## 6. Service Area pages (approved layouts)

### USA map page `/service-area/` (national sites)
1. Shared chrome: header with nav (**Home | Equipment | Service Area | Use cases | About Us | Contact Us**, current page underlined) and the dark Request Quote button.
2. Hero (light `--color-surface` background, two columns): breadcrumb "Home › Service Area"; place-first H1 "United States [Primary Service] Service Areas"; a "DESCRIPTION · 2–3 SENTENCES" intro; dark "Get a Quote" and outlined "Call [Phone]" buttons. Right column: feature image, a real trailer photo (dashed placeholder until supplied).
3. **By Region and Featured State** (white): H2, short intro, then two pill rows. **Region:** All, West, Midwest, South, Northeast. **Featured:** the site's focus states (Part A "Focus states"), for example Florida, Texas, Utah, Wyoming.
   - **Left, map card:** eyebrow "STATE / REGION MAP · CLICKABLE", a "State" select at top right (also the mobile and keyboard path), the map, and a legend (In selected region, Other regions, Featured state, Selected).
   - **Right, details card** (outlined; bottom sheet on mobile): eyebrow "DETAILS · [REGION]", the state name, a short description, then four facts in a 2 × 2 grid: **Incorporated places** (Census data), **Hub cities** (places data), **Status** (Confirmed dispatch · [city] / Inquiry only), **Rates** (from the equipment directory, or "Request a quote"). Under them a dashed box with 1–2 researched incidents ("[Researched incident · date · source]"). Then **PAGES**: "[State] service area page →", up to four hub cities, "All [State] places, A–Z →" (link only pages that exist). Last, a dark "Get a quote for [State]" button.
4. **Incidents by State:** 3-column cards, each with the state name and 2 dated incidents. Crawlable plain-text list of every state's incidents, each state name linking to its page once live.
5. **How Delivery Works:** four step cards: 1 Tell us the site, 2 Pick the unit, 3 Site review, 4 Quote and delivery.
6. **Equipment We Rent:** the primary service as the largest card (photo, sizes, link), the secondary service as a card, and a dashed card of "Other Super 9" linked chips, following the keyword split.
7. **FAQs** (accordion, first open): Do you deliver to my state? How is delivery priced? How fast can you deliver? What does the site need?
8. Final CTA band: "Get a quote for your location", Get a Quote and Call [Phone]. Footer: brand, city, state, phone, and the nav links.

**Map behavior and styling (focus states):**
- **Every state starts gray** (`--color-surface-2`). Only the **focus states** are colored, each in the color of its Census division (palette below). Non-focus states stay gray, outlined, and still clickable (they show "Inquiry only" and a quote link).
- **Region pills** filter the map: states in the picked region get a slightly darker gray, other regions stay light, and focus states stay colored. **Featured pills** select a focus state directly. The selected state gets a dark navy fill with a white label; a dispatch state keeps a lime inner ring.
- **Census division colors** (from the approved reference map; use only for focus states): Pacific #FFB800, Mountain #FFA000, West North Central #3F7D3A, East North Central #1E5128, West South Central #4AAFF8, East South Central #0093F0, South Atlantic #1B3A6F, Mid-Atlantic #F26A0F, New England #F52027. Pills map to divisions: West = Pacific + Mountain, Midwest = East + West North Central, South = South Atlantic + East + West South Central, Northeast = New England + Mid-Atlantic.
- Never rely on color alone: every state has a text label or tooltip and a keyboard-focus ring. The live site uses the real Census outline (Albers USA with Alaska and Hawaii insets); a tile grid is acceptable only as a mockup.
- The data comes from `src/data/us-states.json`: each state has `region`, `division`, `focus` (true or false), `status`, and `incidents`.

### State page `/service-area/[state]/`
Navy hero with place-first H1 → state map of every municipality (search, legend: hub / live page / planned; marker popup with name, legal type, county, one sourced fact, link) → regions and hub cities → the 5 data points, statewide (timeline) → statewide local knowledge → FAQs → trailer specifications → CTA band → crawlable municipality list → footer.

### Hub city and place pages `/service-area/[state]/[city]/` and `/[state]/[city]/[place]/`
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

## 7. Interior pages (Equipment)
- **Page hero:** shorter than the homepage hero, breadcrumb above the H1, real photo on the right, wave bottom.
- **Spec lists and comparison tables:** white cards, striped rows, category group rows. On mobile, scroll horizontally inside the table only, with a sticky first column.
- **Long-form text:** 72–75ch max, H3 every 150–250 words, short facts in callout boxes with an icon badge.

## 8. Components to build once (Next.js + TypeScript)
`TopBar`, `SiteHeader` (accessible mobile menu), `Breadcrumbs`, `Hero`, `PageHero`, `PlaceHero`, `WaveDivider`, `SectionHeading` (eyebrow + two-tone heading), `CtaButton`, `IconBadge`, `FactsStrip`, `EquipmentFeature`, `EquipmentChips`, `QuoteForm`, `RateTable`, `SpecTable`, `DataPointTimeline`, `InfoCardPair`, `NearbyPlaces`, `StepList`, `TestimonialCarousel` (renders nothing without real reviews), `UsIncidentMap` + `StatePanel` (client), `StateIncidentList` (server), `StateMap` (client), `PlaceList` (server), `FaqAccordion`, `CtaBand`, `SiteFooter`.

Only the menu, maps, form, and carousel are client components. Everything else renders on the server.

## 9. Do / Don't

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
