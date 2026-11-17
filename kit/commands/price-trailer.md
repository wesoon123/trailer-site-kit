---
description: Refresh trailer prices from the price sheet and rebuild the pricing data and page
---

Use the `state-trailer-pricing-builder` skill (in `.agents/skills/`). Follow its run order: pull the public tabs of the price sheet, fall back to the saved snapshot if the sheet cannot be read, rewrite `pricing-source.md`, rebuild `src/data/pricing.json`, then update the `/pricing/` page. Print what changed. Ask me about any open question the skill lists before wording a rate.
