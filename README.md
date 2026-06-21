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

## Analytics (GA4)
Set `PUBLIC_GA_ID` (your `G-XXXXXXXXXX` Measurement ID) in `.env` (see
`.env.example`) — it's read at **build time**, so rebuild after setting it.
Analytics load only when it's set, so the site ships clean until then.

Conversion events fired:
| Event | When |
|---|---|
| `book_calibration_call` | Any click on the single booking CTA, site-wide (event delegation) |
| `generate_lead` | Break-Point Report form submit (includes the computed `break_point`) |
| `newsletter_signup` | Newsletter form submit |
| `assessment_completed` | The assessment result is revealed (includes `break_point`) |

In the GA4 UI, mark `book_calibration_call` and `generate_lead` as **key events**
to count them as conversions. Wiring lives in `src/components/Analytics.astro`
(loader + CTA delegation) and the form components.

## Integrations (HubSpot — region `na2`, portal `20276071`)
- Calibration Call scheduling: `https://meetings.hubspot.com/jcarter28`
- Break-Point Report form: `8e01345a-ccef-43b8-8598-e3bb6d7397f1`
  (the assessment posts the computed break-point discipline + per-discipline scores)
- Newsletter form: `f744639b-16b8-4f45-a141-1637e135cdc7`

Forms POST to `api.hsforms.com/submissions/v3/integration/submit/{portal}/{guid}`.
**Before launch:** verify CORS/region from the live domain and test both forms end-to-end.

## Copy & terminology conventions (keep exact)
- **Never use "Team LFS" / "LFS" / "Leadership Failure Simulation" in public copy** —
  those are internal/conversation-stage names. Where the ELFS fee credit is described,
  the approved wording is **"applies toward your full team engagement."** (The named
  product **ELFS** — and its expansion *Executive Leadership Failure Simulation (ELFS)* —
  stays; it's the public second-door product.)
- **One CTA only:** *Book a Calibration Call* → `meetings.hubspot.com/jcarter28`. The ELFS
  page's primary CTA is the softer *Request your ELFS* (a qualifying touch, same booking link).

## SEO / AEO / GEO notes (do not regress)
- Everything is server-rendered, including JSON-LD; entity `@id`s cross-reference
  (`#org`, `#james`, `#flagmodel`) so the graph resolves.
- **Entity graph injected site-wide** by `BaseLayout` (`siteGraph`, default on;
  homepage opts out, it defines the full versions): every inner page emits the
  canonical `Organization` + founder `Person` (with `sameAs`) + `WebSite` + a
  per-page `WebPage` node, and articles' `author`/`publisher` resolve to
  `#james`/`#org` — consolidating author authority across the content cluster.
- Each page has unique title/description/canonical/OG (incl. `og:image:alt`,
  `og:locale`) + Twitter card, `theme-color`, favicons + `site.webmanifest`, and
  question-format headings with answer-first "short answer" boxes.
- **Images** go through `astro:assets` (`<Image>`, WebP, explicit dimensions):
  homepage image payload ~230 KB (was ~2 MB). Display images live in `src/assets`;
  `logo.png`/`share-card.png` stay in `/public` (schema/OG reference them by URL).
- `sitemap.xml` is generated at build time (`src/pages/sitemap.xml.ts`) so
  `<lastmod>` is always current; curated per-route priorities live there.
- Custom branded `404` page (noindex).
- The homepage's internal "strategy band" (a note to the client) is intentionally
  **not** shipped.

## Pre-launch checklist (still to confirm with the client)
- [ ] Test both HubSpot forms end-to-end from the live domain (region `na2`).
- [ ] Generate real favicons from `logo.png` (currently the PNG is referenced directly).
- [ ] Optimize/convert images to WebP/AVIF (keep originals as fallback).
- [ ] Wire GA4 (or chosen analytics) with conversion events on CTA clicks + form submits.
- [ ] Have counsel review the Privacy Policy (template) before launch.
- [ ] Update `sitemap.xml` `lastmod` at launch.
