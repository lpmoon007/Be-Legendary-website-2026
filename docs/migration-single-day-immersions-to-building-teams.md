# Migration map — single-day immersions → Building Teams

**Status: STAGED, not live.** Nothing below has been applied. This is the
plan to flip once the destination pages exist on buildingteams.com.

## Decision

- **Scope:** single-day immersions only. The one-day, off-road experiential
  immersions move to Building Teams. The **multi-day, discipline-rebuilding
  retreats** ($25K–$500K "Leadership Retreat" rung on `/how-we-work-together/`)
  and the entire **diagnostic ladder** (Team LFS, Sprint, Partnership, coaching)
  **stay on belegendary.org**.
- **Timing:** stage first, flip later. We do **not** 301 anything until the
  matching pages are live on buildingteams.com, so we never 301 into a 404.
- **Constraint:** buildingteams.com is a separate site; it is **not** in this
  repo and cannot be edited from here. The destination pages must be built there.

## What moves

| belegendary.org page | What it is | Building Teams destination (confirm exact URL) |
| --- | --- | --- |
| `/denver-executive-leadership-retreat/` | One-day off-road immersion (geo LP) | `https://www.buildingteams.com/executive-team-building/` (or a new `/executive-team-building/off-road-immersion/`) |
| `/sedona-executive-leadership-retreat/` | One-day immersion (geo LP) | same section as above |

> These are the only two belegendary pages that read as single-day activity
> offerings. Everything else in `/teams/…` is multi-day / diagnostic and stays.

## What stays on belegendary (do NOT move)

- `/how-we-work-together/` — the offer ladder (multi-day retreat is a rung here)
- `/teams/` and `/teams/retreats/` + `formats/`, `destinations/`,
  `ways-to-work-together/`, `for-executive-assistants/`
- `/teams/diagnostic/`, and the retreat-idea SEO pages
- All Flag Model / disciplines / Team LFS / coaching / Partnership content

## Positioning — already done, no action needed

Every sitewide "team building" reference on belegendary already attributes it to
Building Teams. No rewrite required. Confirmed spots:

- `src/components/SiteFooter.astro` — "Corporate team-building and charity events
  run as Building Teams →"
- `src/pages/about/index.astro`, `src/pages/about/james-carter.astro` — routes
  team-building work to Building Teams
- `src/pages/executive-team-alignment-consultant.astro`,
  `src/pages/teams/diagnostic.astro` — use "not generic team-building" as
  *contrast* copy (reinforces the split)
- `src/pages/denver-…` and `src/pages/sedona-…` already carry a footer line:
  "Planning corporate give-back team building instead? That's our sister brand,
  Building Teams →"

## Internal inbound links to re-point AT FLIP

When the two pages redirect off-domain, these on-site links should point at the
new Building Teams URLs (not just rely on the 301) so users don't take a hop:

- `src/pages/teams/retreats/destinations.astro:82` → Denver link (`SLUGS.denverImmersion`)
- `src/pages/teams/retreats/destinations.astro:86` → Sedona link (`SLUGS.sedonaImmersion`)
- `src/pages/teams/retreats/formats.astro:56` → Denver deep-link
  ("See it productized in Denver — the Off-Road Immersion")

No header/footer nav links point at these two pages, so nav needs no change.

## Flip-day checklist (run only once Building Teams pages are live)

1. Confirm the two Building Teams destination URLs return 200.
2. Add to `public/.htaccess`:
   ```
   Redirect 301 /denver-executive-leadership-retreat/ https://www.buildingteams.com/executive-team-building/
   Redirect 301 /sedona-executive-leadership-retreat/ https://www.buildingteams.com/executive-team-building/
   ```
   (Swap in the exact destination paths once known.)
3. Delete `src/pages/denver-executive-leadership-retreat.astro` and
   `src/pages/sedona-executive-leadership-retreat.astro` so the build stops
   emitting them (the .htaccess 301 then owns those paths).
4. Re-point the 3 internal links above to the Building Teams URLs.
5. Remove `denverImmersion` / `sedonaImmersion` from `SLUGS` in
   `src/lib/site.ts` (and the sitemap will drop them automatically).
6. `npm run build` to confirm no dangling references, then push.
7. Optional: submit the two changed URLs to IndexNow (the deploy workflow does
   this automatically on push).

## SEO note

The two pages are geo-targeted landing pages ("Denver/Sedona executive
leadership retreat"). Redirecting them hands that ranking authority to
buildingteams.com — intended here, but worth a note so it's a conscious choice.
