# GSC Query / Page Opportunity List

From the Search Console export (last 3 months → 2026-08-03). Query-level data is
thin (GSC withholds most queries below its privacy threshold — only 5 of ~35
clicks are attributed at query level), so the **page-level** opportunities below
are the actionable ones. Legacy/redirected URLs excluded.

## Tier 1 — CTR wins: pages ALREADY ranking page 1–2 but earning ~0 clicks
Highest ROI — no waiting for rankings to move; just a more click-worthy title/meta
snippet. (Volumes are small, so treat as directional.)

| Page | Pos | Impr | Clicks | Note |
|---|---|---|---|---|
| `/roadmap-to-success/` | 7.8 | 426 | 0 | **Biggest.** Ranks #8, zero clicks — snippet isn't earning the click. |
| `/state-of-executive-team-execution/` | 9.9 | 162 | 1 | The research report — page 1, ~0 CTR. |
| `/flag-model/` | 14.1 | 136 | 0 | Core concept page, page 2. |
| `/resources/` | 18.2 | 112 | 0 | Hub. |
| `/glossary/` | 7.2 | 95 | 0 | Ranks #7, no clicks. |
| `/case-studies/` | 9.2 | 87 | 0 | Proof hub, page 1. |
| `/leadership-team-offsite-facilitator/` | 14.6 | 88 | 0 | Buyer term ("offsite facilitator"). |
| `/lost-disciplines/` | 6.6 | 76 | 0 | Ranks #7, no clicks. |

## Tier 2 — striking-distance content: buyer pages at pos 25–40 (closest to page 1)
Need on-page term/title work (the retreats-hub treatment) to climb into clickable range.

| Page | Pos | Impr | Buyer term |
|---|---|---|---|
| `/flag-model-vs-4dx/` | 26.5 | 105 | "4dx vs okr" (41 impr) — comparison niche |
| `/teams/executive-offsite-ideas/` | 29.2 | 60 | "executive offsite ideas" |
| `/teams/retreats/` | 37.2 | 83 | "leadership/executive retreats" — **just optimized; watch it climb** |
| `/how-to-plan-an-executive-offsite/` | 33.3 | 58 | "plan an executive offsite" |
| `/how-to-align-a-leadership-team/` | 35.2 | 40 | "align a leadership team" |
| `/how-to-plan-a-leadership-retreat/` | 50.7 | 64 | "plan a leadership retreat" |
| `/leaders/what-is-executive-coaching/` | 56.2 | 147 | "executive coaching" (135 impr) — aligns with the coaching-intercept play |

## Tier 3 — high-demand but deeply buried (pos 55–72): the long climb
Real demand, but page 6–7. No quick fix; the content + backlink work is the path.
- "leadership retreats" (224 impr, pos 69) — retreats hub just optimized.
- "executive leadership retreats" (40, pos 72) — same.
- "leadership" (172, pos 57) — too broad / low-intent; **deprioritize**.
- "executive coaching" (135, pos 56) — competitive; intercept via the coaching pages.

## What already WINS — protect & expand
- `/research-notes/what-decision-paralysis-costs/` — **18% CTR.** Research notes
  punch far above their weight → produce more of them.
- `/about/james-carter/` — 2% CTR, pos 8. The founder/bio + book long-tail
  (Chopra/Blanchard associations) is a genuine, underused asset.
- Home and the `/leaders/workouts/` pages convert at higher CTR than the money pages.

## Recommended order
1. **Tier 1 CTR batch** — ✅ **DONE (2026-08).** Rewrote titles/metas on the
   pages with a clear CTR hook to add, leaving already-strong ones alone:
   - `/roadmap-to-success/` → "Roadmap to Success — Free Chapter, with Chopra &
     Blanchard" (leads with the famous co-authors vs. generic results).
   - `/flag-model/` → "The Flag Model: Find Where Your Team Breaks First"
     (outcome hook, was "The Execution Framework") + benefit-led description.
   - `/case-studies/` → "…Turnarounds, By the Numbers" (proof hook).
   - `/lost-disciplines/` → trimmed the over-long description.
   Left `/state-of-executive-team-execution/`, `/leadership-team-offsite-facilitator/`,
   `/glossary/`, `/resources/` as-is — already well-optimized (and glossary/resources
   are inherently low-CTR intent). Rankings/CTR move over the coming weeks.
2. **Tier 2** — term/title passes on executive-offsite-ideas, flag-model-vs-4dx,
   the offsite/retreat-planning guides.
3. **Double down on research notes** (highest CTR content type).
4. Leave Tier 3 broad terms ("leadership", "executive coaching") to the slow content/link climb.

---

## Follow-ups from the 2026-08-04 GSC snapshot (last 28 days)

- **`/roadmap-to-success/` re-tuned.** The 28-day export showed the real winnable
  queries are the book-specific ones carrying the co-author names — e.g.
  `"roadmap to success" "deepak chopra" "ken blanchard"` at **pos 6, 86 impr, 0
  clicks** (plus a "cyndi savage rice" cluster already at pos 2–5). Title →
  "Roadmap to Success — Free PDF Chapter, Chopra & Blanchard" and description now
  leads with the unique draw vs Amazon/Google Books (full chapter, free, no
  email). Watch those Chopra/Blanchard queries for CTR coming off 0%.
- **`/executive-team-alignment-consultant/` strengthened** (striking distance,
  pos ~10). Broad query `team alignment consultant` (19 impr, pos 11) vs. the
  narrower `executive team alignment consultant` (pos 5.8). Delivered the title's
  unmet "Cost" promise with a "What does a team alignment consultant cost?"
  section (bare phrase in the H2, internal links to `/pricing/` + the cost
  calculator) and added terminology-bridge + cost FAQ entries.
- **Bots dominate GA4** (Singapore/Urumqi/Vietnam data-center traffic, ~98%
  direct, 404 page is #1). Judge real demand from GSC + Clarity, not GA4 totals.

## URLs to submit to GSC for indexing (after deploy)

⚠️ **Deploy `claude/epic-carson-cjyx09` before submitting.** These URLs only
exist once the branch is live; submitting against current production returns
"URL is not on Google / not found." All verified present in `sitemap.xml`;
excludes `/fractional-chief-people-officer/` (301'd to provecq.com) and the two
renamed immersion paths (`…/systems/`, `/teams/one-crazy-day/the-city/`).

GSC caps manual "Request Indexing" at ~10–12/day — if rationing, do Tier 1 +
the two re-index URLs first, and let the sitemap carry the rest.

**Tier 1 — highest-value, brand-new**
- https://www.belegendary.org/pricing/
- https://www.belegendary.org/executive-team-crisis-brief/
- https://www.belegendary.org/teams/executive-immersion/
- https://www.belegendary.org/how-we-work-together/
- https://www.belegendary.org/how-to-run-a-board-meeting/

**Tier 2 — new content assets**
- https://www.belegendary.org/field-notes/the-feedback-vacuum/
- https://www.belegendary.org/field-notes/what-is-the-feedback-vacuum/
- https://www.belegendary.org/field-notes/why-my-team-tells-me-what-i-want-to-hear/
- https://www.belegendary.org/teams/executive-immersion/expedition/
- https://www.belegendary.org/teams/executive-immersion/city/

**Tier 3 — case studies + supporting pages**
- https://www.belegendary.org/case-studies/san-juan-mountains-work-ethic/
- https://www.belegendary.org/case-studies/online-auto-retailer-leadership-team/
- https://www.belegendary.org/case-studies/federal-fiscal-leadership-team/
- https://www.belegendary.org/case-studies/everglades-abundance-mindset/
- https://www.belegendary.org/case-studies/alaska-executive-vulnerability/
- https://www.belegendary.org/retreat-planning-kit/
- https://www.belegendary.org/about/

**Re-index (changed snippets this session — already indexed, just refresh)**
- https://www.belegendary.org/roadmap-to-success/
- https://www.belegendary.org/executive-team-alignment-consultant/

**Then re-submit the sitemap** in GSC (Sitemaps → `https://www.belegendary.org/sitemap.xml`)
after deploy — the most efficient signal for the whole batch, carrying fresh
`lastmod` dates.
