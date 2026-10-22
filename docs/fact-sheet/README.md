# Research Fact Sheet — source

The one-page press/outreach asset the Digital-PR Kit (`../GEO-DIGITAL-PR-KIT.md`)
tells senders to attach. Every figure is a **third-party** study, credited to its
original author and linked on the full report
(`/state-of-executive-team-execution/`). This sheet is a synthesis, not Be
Legendary's primary data — keep it that way in any edit (see the honesty rule in
the PR kit).

## Files
- `fact-sheet.html` — the source. Loads Newsreader + Hanken Grotesk from Google
  Fonts, so it opens and previews standalone in any browser. Edit the stats here.
- `embed-fonts.cjs` — base64-embeds the local `@fontsource` brand fonts into
  `fonts.css` (for an offline, pixel-accurate render).
- `render.cjs` — prints a single Letter-page PDF with the embedded fonts.
  (`.cjs` because the project is an ESM package.)

## Regenerate the PDF (from the repo root)
```
node docs/fact-sheet/embed-fonts.cjs docs/fact-sheet
node docs/fact-sheet/render.cjs docs/fact-sheet
```
Output: `Be-Legendary-Research-Fact-Sheet.pdf` (+ `preview.png`). Requires the
project's dev deps (`playwright`, `@fontsource/*`) — i.e. run after `npm install`.
`fonts.css`, `preview.png`, `_render.html` and the PDF are build outputs (gitignored).

## Keep it to one page
The layout is budgeted to exactly 11in. `render.js` prints the content height —
keep it ≤ 1056px. If you add a stat, drop one or tighten spacing.

## Updating for the 2027 edition
When the report adds FlagScore™ primary-data benchmarks, swap the weakest
third-party cells for the new primary stats and relabel the kicker — that edition
can be pitched as original research (see the PR calendar in the kit).
