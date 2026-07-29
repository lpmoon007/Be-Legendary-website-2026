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

> **Update:** the two near-duplicate geo pages (Denver + Sedona) have been
> **consolidated** into one location-neutral page. So only **one** URL now moves
> to Building Teams; the two old URLs already 301 to it on belegendary.

| belegendary.org page | What it is | Building Teams destination (confirm exact URL) |
| --- | --- | --- |
| `/executive-off-road-immersion/` | One-day off-road immersion, both settings (Colorado + Sedona) on one page | `https://www.buildingteams.com/executive-team-building/` (or a new `/executive-team-building/off-road-immersion/`) |

Already redirecting to the consolidated page (leave as-is; they'll chain through
to Building Teams at flip, or update them to point straight there):

- `/denver-executive-leadership-retreat/` → `/executive-off-road-immersion/`
- `/sedona-executive-leadership-retreat/` → `/executive-off-road-immersion/`

> This is the only belegendary page that reads as a single-day activity
> offering. Everything else in `/teams/…` is multi-day / diagnostic and stays.

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

When the consolidated page redirects off-domain, these on-site links should point
at the new Building Teams URL (not just rely on the 301) so users don't take a hop:

- `src/pages/teams/retreats/destinations.astro` → the two "pick your terrain"
  cards (`SLUGS.offRoadImmersion#colorado` / `#sedona`)
- `src/pages/teams/retreats/formats.astro` → the Off-Road Immersion deep-link
  (`SLUGS.offRoadImmersion`)

No header/footer nav links point at this page, so nav needs no change.

## Flip-day checklist (run only once the Building Teams page is live)

1. Confirm the Building Teams destination URL returns 200.
2. In `public/.htaccess`, point the consolidated page (and the two legacy geo
   URLs, which currently 301 to it) at Building Teams:
   ```
   Redirect 301 /executive-off-road-immersion/ https://www.buildingteams.com/executive-team-building/
   Redirect 301 /denver-executive-leadership-retreat/ https://www.buildingteams.com/executive-team-building/
   Redirect 301 /sedona-executive-leadership-retreat/ https://www.buildingteams.com/executive-team-building/
   ```
   (Swap in the exact destination path once known.)
3. Delete `src/pages/executive-off-road-immersion.astro` so the build stops
   emitting it (the .htaccess 301 then owns the path).
4. Re-point the internal links above to the Building Teams URL.
5. Remove `offRoadImmersion` from `SLUGS` in `src/lib/site.ts`.
6. `npm run build` to confirm no dangling references, then push.
7. Optional: submit the changed URLs to IndexNow (the deploy workflow does this
   automatically on push).

## SEO note

The two pages are geo-targeted landing pages ("Denver/Sedona executive
leadership retreat"). Redirecting them hands that ranking authority to
buildingteams.com — intended here, but worth a note so it's a conscious choice.
