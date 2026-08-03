# GEO + Claim-Consistency Audit — Findings

Site-wide crawl of the 153-page build (2026-08). Extends the executive GEO work
(P1–P7) to the whole site and runs a credibility-protecting consistency sweep on
every stat, price, duration, and longevity claim. Findings only — proposed fix at
the bottom.

## Consistency — strong ✅
The site is remarkably self-consistent. Verified clean, no contradictions:
- **Result stats:** 268% (San Juans), 209% (Champion Iron), 178% (auto retailer),
  113% (Everglades) — every occurrence is in the correct context and correctly
  attributed. No wrong variants, no misattribution across pages.
- **Eagle figures:** $1.2B / $350M / "seven rival firms" all consistent.
- **Pricing:** $7,500 (ELFS), $28K–$35K (Team LFS), $35K (Executive Immersion),
  $45K–$65K (Sprint), $25K–$500K+ (Retreat), $75K base + 10x (Partnership),
  $15K–$25K (Audit), $1.1M ceiling — no contradictions.
- **Durations:** ELFS ~30 min and Team LFS ~90 min everywhere; no wrong-duration
  leftovers (the earlier ELFS 90→30 correction held site-wide).
- **Founding / press:** "since 2012" appears only in press/coverage context (no
  page understates the firm's age); firm "founded 2003" consistent; no stray
  "founded 2010".
- **Longevity:** "25 years" / "quarter century" = James's career (consistent);
  "two decades" = the firm's era (2003→now) and the research timespan; the
  "twenty years / 20 years" hits are all the cited Charles Pfeffer research or a
  film reference — legitimate, not firm-age drift.

## GEO coverage — good ✅
- **`llms.txt` already exists** (and robots.txt) — AI-crawler guidance in place.
- **Named primitives** ("Flag Model" on all 153 pages; FlagScore; feedback vacuum;
  Lost Disciplines) are used consistently as citable entities.
- **FAQPage** is present on the informational/how-to/comparison pages; the pages
  "without" it are hubs (CollectionPage/ItemList) and the research-note articles
  (Article + citations), where FAQPage isn't the right schema. Not a gap.

## Findings

### 1. Client roster needs verification — NEEDS JAMES (accuracy, not a fix)
`src/components/TrustedBy.astro` states: **"Trusted by leadership teams at
American Express, Johnson & Johnson, Caterpillar, Bayer, Siemens … over a
25-year career."** Two things to confirm, because it can't be verified from the
codebase and it's a strong public claim:
- Are all five (Amex, J&J, Caterpillar, Bayer, Siemens) **genuine, confirmable
  clients** whose executive teams James worked with?
- **Siemens** is framed elsewhere on the site as a **keynote audience** ("1,000
  leaders at Siemens", "the Siemens main stage"), not necessarily a team
  engagement. Is it a team client *and* a keynote, or should the roster and the
  bio be reconciled so it's not implied to be more than it is?

This is the one item in the audit that touches the "only real, attributable
claims" rule. Recommend James confirms/edits the roster; I won't change it
without direction.

### 2. Trademark ™ usage is inconsistent — MINOR (cosmetic)
- "Flag Model™" appears on 86 pages; "Flag Model" without ™ on the rest.
- "FlagScore™" 6 pages vs "FlagScore" 11; "Lost Disciplines of Leadership™" 6 vs 4.
Not a credibility issue, but standardizing (™ on first mention per page, plain
thereafter) reads more polished and protects the marks. Fixable in one pass.

## Proposed fix batch
- **Batch D — standardize ™** on Flag Model / FlagScore / Lost Disciplines.
  ✅ **DONE (2026-08).** Added ™ to the first visible-prose mention on every page
  (and the full SiteFooter + ArticleEndCTA) that mentioned a mark without one —
  Flag Model™ now on 95 pages (was 86), plus FlagScore™ / Lost Disciplines™
  standardized. Skipped titles, meta, schema, hrefs, alt text, nav-link labels,
  and "Flag Model vs X" comparison names — ™ doesn't belong in those. Caught and
  fixed a double-mark bug where an existing `&trade;` entity collided with the new
  ™ character (6 spots). Remaining plain mentions are all in those intentionally-
  skipped contexts (nav labels, comparison names, slim-footer utility pages).
- **Finding 1 (client roster)** — hold for James's confirmation; no code change
  until then. (Belongs to audit #3 / CRO — surfaced there too.)
