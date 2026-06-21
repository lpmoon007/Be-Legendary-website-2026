# Be Legendary — Marketing & SEO/AEO Website

The marketing site for **Be Legendary** (alt. name *Repario*), an executive-team
performance firm founded by **James Carter**. Built from the design handoff as a
**static-generated Astro** site — the entire SEO/AEO strategy depends on crawlers
and AI answer-engines seeing fully-rendered HTML + JSON-LD without running JS.

The site sells one thing through one action: booking a free 15-minute, CEO-only
**Calibration Call** (`https://meetings.hubspot.com/jcarter28`). There is exactly
one primary CTA across the entire site by design.

## Stack
- **Astro 4** (static output, `trailingSlash: 'always'`, directory build format).
- **Self-hosted fonts** via `@fontsource` (Newsreader display / Hanken Grotesk body)
  — replaces hotlinked Google Fonts for Core Web Vitals + privacy.
- No UI framework. The three interactive tools are vanilla-JS islands that
  server-render their full default state (SEO-safe) and hydrate on load.

## Develop
```bash
npm install
npm run dev      # local dev server
npm run build    # static build → dist/
npm run preview  # preview the production build
```

## Structure
```
public/
  assets/             images (headshot, logo, share card, book covers)
  robots.txt          allows all crawlers incl. named AI bots; points to sitemap
  llms.txt            AI-crawler site summary
  sitemap.xml         all 24 production URLs
src/
  layouts/BaseLayout.astro   <head>: per-page meta/canonical/OG/Twitter + JSON-LD
  components/
    Header.astro Footer.astro            global chrome (single CTA)
    FlagDiagram.astro                    interactive Flag Model diagram (homepage)
    BreakPointAssessment.astro           10-question scored assessment + HubSpot
    CostCalculator.astro                 5-slider cost calculator
    NewsletterSignup.astro Faq.astro     reusable islands
  lib/site.ts          CTA URL, HubSpot IDs, slug map (single source of truth)
  pages/               one file per production slug
  styles/global.css    fonts, design tokens, responsive layer, reduced-motion
```

## Pages (25) → production slugs
Home `/` · Flag Model `/flag-model/` · About `/about/james-carter/` ·
Assessment `/break-point-self-assessment/` · Calculator `/cost-of-lost-disciplines-calculator/` ·
ELFS `/elfs/` · Research `/state-of-executive-team-execution/` · Case studies `/case-studies/` ·
Glossary `/glossary/` · Resources `/resources/` · Field Notes `/field-notes/` ·
8 Field Notes articles · 3 framework comparisons · 3 buyer's guides · Privacy `/privacy/`.

### Cross-tool carry-over (Assessment → Calculator)
The Break-Point Self-Assessment result links to the Cost Calculator with
`?from=assessment&break=<discipline>&waste=<n>` (a referral card + the email
success state). The Calculator reads those params client-side on load: it
pre-sets the meeting-waste slider and shows a "From your snapshot" banner naming
the carried break point. Revenue/headcount/rate/hours keep their defaults (the
assessment never collects them). With no params, the Calculator shows no banner.
Keep the param names (`from`, `break`, `waste`) and discipline keys stable.

## Integrations (HubSpot — region `na2`, portal `20276071`)
- Calibration Call scheduling: `https://meetings.hubspot.com/jcarter28`
- Break-Point Report form: `8e01345a-ccef-43b8-8598-e3bb6d7397f1`
  (the assessment posts the computed break-point discipline + per-discipline scores)
- Newsletter form: `f744639b-16b8-4f45-a141-1637e135cdc7`

Forms POST to `api.hsforms.com/submissions/v3/integration/submit/{portal}/{guid}`.
**Before launch:** verify CORS/region from the live domain and test both forms end-to-end.

## SEO / AEO notes (do not regress)
- Everything is server-rendered, including JSON-LD; entity `@id`s cross-reference
  (`#org`, `#james`, `#flagmodel`) so the graph resolves.
- Each page has a unique title/description/canonical/OG/Twitter and question-format
  headings with answer-first "short answer" boxes.
- The homepage's internal "strategy band" (a note to the client) is intentionally
  **not** shipped.

## Pre-launch checklist (still to confirm with the client)
- [ ] Test both HubSpot forms end-to-end from the live domain (region `na2`).
- [ ] Generate real favicons from `logo.png` (currently the PNG is referenced directly).
- [ ] Optimize/convert images to WebP/AVIF (keep originals as fallback).
- [ ] Wire GA4 (or chosen analytics) with conversion events on CTA clicks + form submits.
- [ ] Have counsel review the Privacy Policy (template) before launch.
- [ ] Update `sitemap.xml` `lastmod` at launch.
