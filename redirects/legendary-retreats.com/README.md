# 301 Redirects: legendary-retreats.com → belegendary.org

Version-controlled cross-domain migration map. **48 source URLs** from the old
`legendary-retreats.com` sitemap, each mapped to its closest live
`belegendary.org` equivalent, all **301 (permanent)**.

Three ready-to-deploy forms of the same map live in this directory — use the one
that matches wherever `legendary-retreats.com` is served:

| File | Use when the old domain is served by… |
|---|---|
| `.htaccess` | **Apache / Plesk** (e.g. attached to the same Plesk server as belegendary.org). |
| `nginx.conf` | **nginx** (old domain stays on its own VPS as a redirector). |
| `_redirects` | **Netlify / Vercel** (old domain attached to that host). |

> **Stack note:** belegendary.org itself is an **Astro static site on Plesk /
> Apache** (only the `challenge/` app is on Vercel). So if you point
> legendary-retreats.com at the same Plesk box, use `.htaccess`. The original
> handoff assumed the new site was on Vercel — it isn't; that only affects which
> file you deploy, not the map.

After go-live: submit the old legendary-retreats.com sitemap in Search Console
one last time so Google crawls the 301s, then remove it.

## Corrections applied to the original handoff map
Four destinations in the handoff pointed at paths that don't exist on the live
site. Verified against the current build and retargeted to the real URLs:

| Old path(s) | Handoff target (404) | **Corrected live target** |
|---|---|---|
| `/contact`, `/ways-to-work-together` | `/ways-to-work-together/` | `/teams/retreats/ways-to-work-together/` |
| `/for-executive-assistants` | `/for-executive-assistants/` | `/teams/retreats/for-executive-assistants/` |
| `/offsite-vs-*`, `/team-offsite-ideas`, `/executive-offsite-agenda` | `/executive-offsite-ideas/` | `/teams/executive-offsite-ideas/` |
| `/field-notes/do-leadership-retreats-work`, `/field-notes/what-is-an-experiential-leadership-retreat` | `/leadership-retreat-ideas/` | `/teams/leadership-retreat-ideas/` |

`/field-notes/30-day-reinforcement` → `/leaders/30-day-challenge/` is kept as the
canonical target. That URL had no page on the live site, so a same-domain 301
(`/leaders/30-day-challenge/` → `challenge.belegendary.org`) was added to the
main site's `public/.htaccess` so the target resolves.

## Redirect map (old path → live URL, all 301)

### Home & core
| Old path | → New URL |
|---|---|
| `/` | `.../teams/retreats/` |
| `/about` | `.../about/james-carter/` |
| `/contact` | `.../teams/retreats/ways-to-work-together/` |
| `/ways-to-work-together` | `.../teams/retreats/ways-to-work-together/` |
| `/framework` | `.../flag-model/` |
| `/for-executive-assistants` | `.../teams/retreats/for-executive-assistants/` |

### Retreats, formats & experience
| Old path | → New URL |
|---|---|
| `/leadership-retreats`, `/executive-offsites`, `/experience`, `/is-this-your-team` | `.../teams/retreats/` |
| `/formats/*`, `/sailing-offsites` | `.../teams/retreats/formats/` |

### Destinations (no per-destination pages → hub)
| Old path | → New URL |
|---|---|
| `/destinations`, `/destinations/*` | `.../teams/retreats/destinations/` |

### Offsite SEO cluster
| Old path | → New URL |
|---|---|
| `/offsite-vs-executive-retreat`, `/offsite-vs-team-building`, `/team-offsite-ideas`, `/executive-offsite-agenda` | `.../teams/executive-offsite-ideas/` |
| `/executive-offsite-facilitator` | `.../leadership-team-offsite-facilitator/` |

### Case studies (no per-study routes → hub)
| Old path | → New URL |
|---|---|
| `/case-studies`, `/case-studies/*` | `.../case-studies/` |

### Field notes (closest topical page; rest → hub)
| Old path | → New URL |
|---|---|
| `/field-notes/do-leadership-retreats-work`, `/field-notes/what-is-an-experiential-leadership-retreat` | `.../teams/leadership-retreat-ideas/` |
| `/field-notes/signature-vs-bespoke-retreat` | `.../teams/retreats/formats/` |
| `/field-notes/align-leadership-team`, `/field-notes/newly-formed-post-merger-leadership-team` | `.../executive-team-not-aligned/` |
| `/field-notes/30-day-reinforcement` | `.../leaders/30-day-challenge/` |
| `/field-notes/executive-retreat-cost` | `.../executive-team-coaching-cost/` |
| `/field-notes`, `/field-notes/*`, `/the-connection-deficit` | `.../field-notes/` |

**Catch-all** (anything unlisted): → `.../teams/retreats/` (301).

## Judgment calls to confirm
- **Home `/`** → retreats page (old site was retreat-first). Change the catch-all
  if you'd rather send it to the belegendary homepage or `/leaders/`.
- **Per-destination & per-case-study pages** fold into their hubs (no 1:1 pages
  on the new site). Upgrade those rows to specific targets if you add individual
  routes later, to recover their ranking.
