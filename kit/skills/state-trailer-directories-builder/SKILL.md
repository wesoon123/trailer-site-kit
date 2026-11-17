---
name: state-trailer-directories-builder
description: Build the free directory listing worklist for a trailer rental site, and re-check which directories still list for free. Reads the site's name, address, phone and website from site-inputs.md and the saved directory checks, and writes a ready-to-paste submission worklist. Run by the /directories-trailer-kit command. Use for directory listings only.
---

# Trailer Directories Builder

## Role and objective
Act as a local-listings specialist. Give the team a clean, ordered worklist for listing a new trailer rental site in free business directories, with the site's details ready to paste. Never claim a directory needs no account unless a page showed that.

## Project inputs
- Brand, domain, phone, email, dispatch locations, primary and secondary service: from `site-inputs.md`
- Saved checks: `.agents/skills/state-trailer-directories-builder/references/directory-checks.md`
- Output: `directories/worklist.md` in the site folder

## Facts to hold
- No directory is known to list with no account, no email and no CAPTCHA. Say "no account" only for a directory whose page showed it, and still report any email, CAPTCHA or review step.
- Directories almost never take listings by email. List an email only when it is literally shown on the directory's own site, and say what it is for (support or listings). Never guess or build an address.
- Core free listings (Google, Bing, Apple, Facebook, Yelp and the rest in the checks file) need an account and verification. They go first.

## Run order (`/directories-trailer-kit`)
1. **Read** `site-inputs.md`. If brand, phone or dispatch location is still `[FILL IN]`, list the gaps and stop. A directory entry must match the website exactly (name, address, phone), so do not paste placeholders.
2. **Read** the saved checks. Group directories: core free (account needed), equipment rental marketplaces, other directories checked, blocked (not read), not free or not a directory.
3. **Re-check (optional, ask first).** Open each add-business page read-only in the browser. Do not fill or submit any form. Never bypass a CAPTCHA or a Cloudflare check: mark the page "blocked, not read". Record only what the page shows (account, email, CAPTCHA, price, selective review). Update the checks file with a new `Checked:` date.
4. **Write `directories/worklist.md`**: one details block (name, address, phone, website, email, categories, a 100-word and a 300-character description from the site's own copy, no invented claims), then one table per group with columns: Directory, Link, Needs (account, email, CAPTCHA, payment, selective), Status (empty), Listed on (empty), Notes.
5. **Report**: counts per group, which directories need only a form, which are blocked, and the one-line caution that listing is manual.

## Rules
1. **Never submit.** The team submits each listing. This skill reads, plans and writes the worklist, and it never submits a directory form, never creates an account, and never enters a password. Do not submit for the team without an explicit yes in chat for that one directory.
2. **Same details everywhere.** One details block, used unchanged for every directory.
3. **No invented facts.** Only the site's real services, areas and phone. No fake reviews, awards or years in business.
4. **Free means free.** A directory with a paid plan on its add page goes under "not free". Note the price the page showed.
5. **Respect blocks.** A Cloudflare or CAPTCHA page is a stop, not a puzzle. Mark it blocked and move on.

## Quality gate
- Every directory row traces to the checks file or a re-check this run.
- Every email in the worklist is literally shown on that directory's own site.
- The details block has no placeholders.

## Deliverables
- `directories/worklist.md`
- Updated `references/directory-checks.md` when a re-check ran
- A short report: what is ready, what is blocked, what is paid, and any detail missing from `site-inputs.md`
