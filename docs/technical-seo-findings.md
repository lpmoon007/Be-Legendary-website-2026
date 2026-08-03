# Technical SEO + Orphan/Cross-link Audit — Findings

Crawl of the built site (153 pages) on 2026-08. Findings only — no fixes applied
yet. Fix batches proposed at the bottom; work them one at a time and tick off.

## Fundamentals — clean ✅
No action needed on any of these:
- **Titles:** all 153 present, all unique (0 missing, 0 duplicate).
- **Meta descriptions:** all present, all unique (0 missing, 0 duplicate).
- **Canonicals:** all present and on belegendary.org — **0 non-canonical, 0 buildingteams.com leaks.**
- **Headings:** exactly one `<h1>` per page (0 violations).
- **Structured data:** every JSON-LD block parses — **0 invalid.**
- **Open Graph:** `og:image` present on every page.
- **Orphans:** only true orphan is `/404.html` (correct — it shouldn't be linked).

## Findings, by priority

### 1. Weak internal linking (cross-link sweep) — HIGH value
25 real content pages have ≤2 inbound links. The most exposed (only **1** inbound
link each) include several pages we just built:
- `/executive-team-crisis-brief/` — only linked from the essay
- `/field-notes/what-is-the-feedback-vacuum/` — only from the hub
- `/field-notes/why-my-team-tells-me-what-i-want-to-hear/` — only from the hub
- `/how-to-run-a-board-meeting/` — only from the exec-team-meeting page
- `/case-studies/federal-fiscal-leadership-team/`
- `/how-to-fix-a-dysfunctional-leadership-team/`
- `/how-to-set-leadership-team-priorities/`
- `/research-notes/a-priority-is-a-refusal/`, `/research-notes/leadership-team-aligned-not-executing/`
- `/teams/executive-immersion/the-city-never-sleeps/`

At 2 inbound: the three EI sub-pages (city/expedition/ownership), retreats/destinations,
retreats/ways-to-work-together, alaska case study, several `/leaders/*` and research notes,
disagree-and-commit, flag-model-vs-scaling-up, leadership-coaching-questions.

Fix = add contextual links from topically-related pages and the relevant hubs
(case-studies hub → each case study; retreats hub → destinations; a "further reading"
link from the money/comparison pages into the new board-meeting + feedback-vacuum content).

### 2. Over-length meta descriptions — MEDIUM (soft)
43 pages have descriptions >170 chars, so the tail is truncated in search results
(Google shows ~155–160). Not broken, but the important/commercial ones are worth
trimming to ~155. Priority ones to trim:
`executive-team-development` (290), `executive-team-crisis-brief` (279),
`how-we-work-together` (253), `executive-team-building` (223), `teams/team-lfs` (236),
the three feedback-vacuum field notes (241–254), `how-to-run-a-board-meeting` (201),
the EI sub-pages, `signs-of-a-dysfunctional-leadership-team` (237).

### 3. Over-length titles — LOW/MEDIUM
20 pages have titles >65 chars (Google truncates ~60). Trim the worst offenders:
`executive-off-road-immersion` (103), `roadmap-to-success` (95),
`field-notes/the-feedback-vacuum` (89), `executive-team-crisis-brief` (88),
`teams/executive-immersion` (84), `research-notes/leadership-team-aligned-not-executing` (84),
`discover-your-inner-strength` (82), `how-to-run-a-board-meeting` (80).
(Most are pushed over by the descriptive title + " | Be Legendary" suffix.)

### 4. Images missing alt text — LOW (quick)
6 pages have one image each without an `alt` attribute:
`/lost-disciplines/` and its sub-pages (about-james, bulk-and-speaking, praise, the-book),
and `/teams/retreats/`. Add descriptive alt.

## Proposed fix batches (one at a time)
- **Batch A — Cross-linking sweep** (Finding 1). ✅ **DONE (2026-08).** Results below.
- **Batch B — Trim over-length titles + descriptions** on the commercial/important
  pages (Findings 2 & 3). ✅ **DONE (2026-08).** Trimmed 18 genuinely over-length
  titles to ≤60 real chars (the audit's title lengths were inflated by
  entity-encoded apostrophes; source lengths were the truth). Left 3 borderline
  titles at 61–62 (clean keyword titles; trimming would cost clarity for 1 char).
  Tightened the 8 top money-page descriptions to ~155; left the remaining ~35
  long ones (blog/PDF/case-study/research) since Google rewrites most descriptions
  and those are low-ROI.
- **Batch C — the "6 missing alt" images.** ✅ **DONE — no change needed (false
  positive).** They are decorative brand marks (the ldol "b" logo, the maroon
  snail icon) using `alt=""`, which is the *correct* accessibility practice for
  decorative images. Adding alt text would be wrong (redundant screen-reader
  announcements). The audit regex flagged empty-alt as missing.

### Batch A results
Interconnected the under-linked new strategic cluster and tidied the closest
topical matches. Inbound-source counts (before → after):
- `/executive-team-crisis-brief/` 1 → 3 (added from board-meeting + executive-team-development)
- `/field-notes/what-is-the-feedback-vacuum/` 1 → 3 (essay "Read next" + sibling)
- `/field-notes/why-my-team-tells-me-what-i-want-to-hear/` 1 → 3 (essay + sibling)
- `/how-to-run-a-board-meeting/` 1 → 3 (essay + executive-team-development)
- `/teams/executive-immersion/the-city-never-sleeps/` 1 → 2 (from city.astro)
- `/research-notes/a-priority-is-a-refusal/` 1 → 2 (from how-to-set-priorities)
- `/field-notes/the-feedback-vacuum/` now 6 inbound
Edits: feedback-vacuum essay "Read next" block; board-meeting "Keep reading" +
feedback-vacuum & brief cards; executive-team-development "further reading" line;
sibling links between the two mined field notes; city → the-city-never-sleeps;
how-to-set-priorities → a-priority-is-a-refusal.

**Left at 1 inbound on purpose** (each linked from its correct hub/sibling —
reachable, not orphaned; forcing more links would be arbitrary):
`/case-studies/federal-fiscal-leadership-team/` (case-studies hub),
`/how-to-fix-a-dysfunctional-leadership-team/` (signs page),
`/how-to-set-leadership-team-priorities/` (its cluster), and
`/research-notes/leadership-team-aligned-not-executing/` (research-notes hub).

## Method note
Ran via a Python crawl of `dist/`. The description-length check was first run with a
naive quote regex that mis-truncated any description containing an apostrophe (false
"8-char" results); re-run with a delimiter-aware regex — the numbers above are correct.
