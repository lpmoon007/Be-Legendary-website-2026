# Content refresh — the freshness system

Google (and AI answer engines) reward pages that are genuinely kept current on
competitive terms. This is the operating rhythm that keeps Be Legendary's top
pages fresh — without gaming dates.

## How it works

Every build runs a **freshness auditor** (`astro.config.mjs` → `freshnessReport`):

- It reads each page's `Article` **`dateModified`** and computes its age.
- It prints a one-line summary to the build log, e.g.
  `[bl-freshness] 42 dated pages · 5 stale (>6mo) · 2 PRIORITY: /flag-model/, …`
- It writes a sortable table to **`reports/content-freshness.md`** (gitignored;
  regenerated each build) — oldest pages first, priority (★) pages flagged.

Run `npm run build` and open `reports/content-freshness.md` to see the list.

## The cadence

**Quarterly**, work the report top-down, starting with the ★ priority pages
(the Flag Model, the pillars, the how-to guides, the research report, the
tools). Target: no priority page older than **6 months**.

## What a real refresh means

Bumping the date without changing anything is worthless (and Google can tell).
A refresh means genuinely improving the page:

1. **Re-read it as a buyer.** Is anything dated, weaker than it could be, or
   missing a question people now ask?
2. **Make ≥1 substantive change** — sharpen the short answer, add or sharpen a
   FAQ, add a new example or stat, tighten a section, add an internal link to a newer
   page, refresh a screenshot.
3. **Then update BOTH:**
   - the visible byline (`Updated <Month> <Year>`), and
   - the Article schema **`dateModified`** (and add today's date).
4. Rebuild — the page drops off the stale list.

## Priority pages (refresh first)

- `/flag-model/` — the pillar hub
- `/strategy-execution-gap/`, `/how-to-align-a-leadership-team/`,
  `/signs-of-a-dysfunctional-leadership-team/` — pillars
- The `how-to-*` guides and `/leadership-team-meeting-agenda/`
- `/state-of-executive-team-execution/` — the research report (also bump the
  year in the title/heading when you refresh the data)
- `/leadership-scorecard/`, `/break-point-self-assessment/`,
  `/cost-of-lost-disciplines-calculator/` — the tools

## Notes

- Undated pages (tools, hubs, index pages) don't carry an `Article` node, so
  they aren't in the report — that's expected; they don't need a "freshness"
  signal the way guides do.
- The threshold lives in `astro.config.mjs` (`STALE_MONTHS`). Six months is a
  sensible default for this category; tighten it if you publish more often.
