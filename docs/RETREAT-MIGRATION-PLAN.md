# Retreat Migration Plan — belegendary.org → legendary-retreats.com

**Date:** 2026-10-16
**Decision locked:** Clean split. Retreats move to `legendary-retreats.com`. This is
the FINAL architecture — no reversing (it would be the fourth migration).
**Status:** Plan for approval. No files change until the decisions below are made.

## Reality check on timing

- **Standing up `legendary-retreats.com`: ~60 min (your part).** You have the project + GitHub.
- **The clean migration: a focused half-day (my part).** ~30 pages to port, a redirect
  map, and 146 internal links across 44 files to fix — including the global header,
  footer, and ResultsBand that appear on every page. The domain going live is fast;
  doing it without losing anything is not. I do the heavy surgery.

## The "don't lose anything" guarantees

1. **Port the CURRENT pages from belegendary.org — do NOT just boot the old repo.** The
   Legendary Retreats GitHub is a pre-merge snapshot. The retreat pages here have since
   gained keep-reading rails, LFS cross-links, cost-calculator fixes, destination and
   schema updates. We copy the *live* versions over so none of that is lost.
2. **All assets come too** — every retreat image, and the retreat planning kit PDF
   (`/assets/downloads/complete-retreat-planning-kit.pdf`), which is baked into the
   emailed HubSpot link, so the path must stay stable on the new domain.
3. **The HubSpot retreat-kit form wiring carries over** (form GUID + the follow-up that
   emails the download). Nothing re-built from scratch.
4. **Nothing is deleted on belegendary.org until `legendary-retreats.com` is verified live
   and the 301s are confirmed.** Delete last, never first.

## Inventory: what moves, what stays

### Definitely MOVE to legendary-retreats.com
- `/teams/retreats/` and its children: `destinations/`, `formats/`,
  `ways-to-work-together/`, `for-executive-assistants/`
- `/teams/luxury-executive-retreat/`
- `/teams/corporate-retreat-ideas/`, `/teams/executive-offsite-ideas/`,
  `/teams/leadership-retreat-ideas/`
- `/retreat-planning-kit/` + its PDF + the HubSpot form
- The 5 retreat **case studies**: online-auto-retailer, san-juan-mountains,
  everglades-abundance, federal-fiscal, alaska-executive (all 5 are retreat engagements
  ported from the original legendary-retreats handoff)
- The reframed **homepage preview** becomes `legendary-retreats.com`'s home page.

### Judgment calls — YOUR decision (these set the final scope)
- **D1 — Executive Immersion (5 pages: index, expedition, city, ownership,
  the-city-never-sleeps), Sailing Team Building, Off-Road Immersion.** These are
  experiential "one engineered day" offerings. Three homes possible: legendary-retreats
  (premium experiences), buildingteams.com (team-building), or stay on belegendary.org.
  **My rec:** Immersion + sailing + off-road → `legendary-retreats.com` (they're premium
  experiential, same buyer as retreats). If you see sailing/off-road as team-building,
  they go to buildingteams.com instead.
- **D2 — Retreat how-to guides:** `/how-to-plan-a-leadership-retreat/`,
  `/how-to-plan-an-executive-offsite/`, `/leadership-offsite-agenda/`,
  `/why-leadership-offsites-dont-stick/`, `/leadership-team-offsite-facilitator/`.
  **My rec:** move to `legendary-retreats.com` for topical focus (they feed its SEO and
  match its intent). They can stay on belegendary.org as resources if you prefer — but
  moving them sharpens both sites.
- **D3 — Case studies as proof.** The 5 case studies are retreat stories, so they move.
  belegendary.org then keeps the aggregate **ResultsBand** stats as proof and builds
  coaching/performance case studies over time. Confirm you're OK moving the detailed
  case-study pages off belegendary.org.

### STAYS on belegendary.org
Everything else: the LFS / Team Diagnostic / Executive Team Assessment, the Flag Model and
IP, the book and thought-leadership, all the non-retreat how-to and comparison content, the
`/leaders/` universe, pricing, how-we-work-together, executive-team-building. The LFS stays
— it's the performance read, not a retreat.

## Step-by-step process (ordered for safety)

**Phase 0 — Confirm the old URL structure (prevents equity loss).**
When legendary-retreats.com was first merged in, belegendary.org slugs were chosen to match
the *old* legendary-retreats URLs. To preserve that equity, the NEW legendary-retreats URLs
should match the OLD ones. Easiest path: add the Legendary Retreats GitHub as a source here
so I can read its structure and map 301s exactly. (You can connect it; I'll confirm.)

**Phase 1 — Build legendary-retreats.com (no change to the live site yet).**
1. I port the current retreat pages + assets from belegendary.org into the Legendary
   Retreats project, rewriting their internal links to same-site relative paths.
2. The homepage preview becomes the new home page.
3. Re-wire the HubSpot retreat-kit form + keep the PDF path stable.
4. Set the new site's own sitemap, robots, and llms.txt.

**Phase 2 — Deploy + verify legendary-retreats.com (your ~60 min + my verification).**
5. You deploy the project and point DNS.
6. We verify: every ported page returns 200, the form submits, the PDF downloads, images
   load, nav/footer are retreat-appropriate. Nothing proceeds until this passes.

**Phase 3 — Redirect from belegendary.org (only AFTER Phase 2 passes).**
7. Add permanent 301s in `public/.htaccess` (and the nginx parity conf) mapping every moved
   URL → its legendary-retreats.com equivalent. (Representative map below; full map built
   once Phase 0 confirms the structure.)

**Phase 4 — Fix belegendary.org internal links (146 refs / 44 files).**
8. Update or remove every internal link to a moved page — including the global
   `SiteHeader`, `SiteFooter`, and `ResultsBand`. Where belegendary.org still needs to
   point at retreats, link to the `legendary-retreats.com` absolute URL (new tab, like the
   LFS-demo cross-links).
9. Remove/repoint the retreat slugs in `site.ts`; drop the retreat Offer from the
   OfferCatalog; update `llms.txt` and the sitemap.

**Phase 5 — Remove the moved pages from belegendary.org + rebuild its homepage.**
10. Delete the now-redirected retreat pages (the 301s stay forever).
11. Rebuild belegendary.org's homepage around executive-team-performance (the next task).

**Phase 6 — Verify everything.**
12. Build + crawl checks: moved URLs 301 correctly, zero broken internal links, both
    sitemaps correct, both sites' key pages 200. Submit the new sitemap in GSC for
    legendary-retreats.com; let the 301s do the rest (a partial move doesn't use GSC
    Change of Address).

## Representative 301 map (final map built in Phase 0)
```
/teams/retreats/                         → https://legendary-retreats.com/
/teams/retreats/destinations/            → https://legendary-retreats.com/destinations/
/teams/retreats/formats/                 → https://legendary-retreats.com/formats/
/teams/retreats/ways-to-work-together/   → https://legendary-retreats.com/ways-to-work-together/
/teams/retreats/for-executive-assistants/→ https://legendary-retreats.com/for-executive-assistants/
/teams/luxury-executive-retreat/         → https://legendary-retreats.com/luxury-executive-retreat/
/teams/corporate-retreat-ideas/          → https://legendary-retreats.com/corporate-retreat-ideas/
/teams/executive-offsite-ideas/          → https://legendary-retreats.com/executive-offsite-ideas/
/teams/leadership-retreat-ideas/         → https://legendary-retreats.com/leadership-retreat-ideas/
/retreat-planning-kit/                   → https://legendary-retreats.com/retreat-planning-kit/
/case-studies/<5 retreat cases>/         → https://legendary-retreats.com/case-studies/<same>/
(+ D1/D2 pages once you decide)
```

## What you do vs. what I do
- **You:** make D1/D2/D3 decisions; connect the Legendary Retreats GitHub; deploy the new
  site + DNS; final approval at each phase gate.
- **Me:** port pages + assets, write the full 301 map, fix all 146 internal links, update
  config/sitemap/llms, verify, then rebuild the belegendary.org homepage.

## Expectation setting (SEO/GEO)
Retreat rankings and GEO citations re-home to legendary-retreats.com and take weeks to
rebuild — expected and fine, because retreat demand is mostly direct/referral and the
retreat pages barely rank today. Upside: a retreat-specialist domain is a cleaner entity
for both SEO and GEO, and removing retreats sharpens belegendary.org's focus on the
coaching/performance terms we just built content for.

---
*Next after your D1/D2/D3 answers + GitHub connection: I produce the exact, final redirect
map and begin Phase 1.*
