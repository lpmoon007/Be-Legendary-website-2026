# Authority & link play

The on-page work across the retreats and framework-comparison clusters is done.
What's left is the real ceiling: **domain authority**. The site relaunched
~July 2026, and the head terms it should own are *low difficulty* (KD 5–23 for
"leadership retreat," "executive retreats," the "Flag Model vs X" set) — they're
not hard, the domain is just young. That means a **small number of quality
links** moves rankings, not volume. This play is ordered by leverage.

> **Judge results from GSC + Clarity, not GA4.** GA4 is ~70% bot-inflated
> (Singapore/Urumqi data-center traffic). Real referral proof already exists:
> Clarity shows **buildingteams.com sending ~46 sessions/mo** — the sister-site
> link works; the play below is mostly "do more of what already works."

---

## Tier 1 — Activate authority you already own (fastest, highest confidence)

The site is *already* featured in major press and carries rare author
credentials. None of it requires cold outreach — it's reclamation and wiring.

- [ ] **Reclaim / confirm the existing press links.** We cite four real features
  (`src/lib/press.ts`). For each, confirm whether the article links to
  belegendary.org, and if not, email the outlet/author to add one. A single live
  do-follow link from CNN or Business Insider is transformational for a young
  domain.
  - **Business Insider** (2018, Katie Warren) — *"CEOs Are Going on $25,000
    Executive Getaways"* — live URL, high DA. **Highest-value reclaim.**
  - **CNN** (2012) — *"Extreme retreats"* — the longevity anchor; confirm the
    link and that `/extreme-retreats/` on our side resolves (it 301s to the
    retreats hub — verify that 301 fires in production; see the redirect note
    below).
  - **Business Destinations** — *"Risky business"* (quotes James) — confirm link.
  - **CNN Money** (2018) — money.cnn.com was retired; the link is dead (we cite
    the Wayback copy). Nothing to reclaim, but it's still E-E-A-T proof.
- [ ] **Consolidate author authority (Chopra / Blanchard / Covey / Tracy).**
  James co-authored *Discover Your Inner Strength*, *Roadmap to Success* and
  *One Great Idea* with these names. "roadmap to success" already pulls ~698
  GSC impressions/mo off that association — a latent asset.
  - Ensure the **Amazon author page** (`amazon.com/stores/James-Carter/author/
    B009FAZ2NG`) links to belegendary.org.
  - Pursue the co-authors' / publishers' sites for a contributor link where one
    is natural (Insight Publishing anthologies, etc.).
- [ ] **Strengthen sister-site cross-links (100% in your control).**
  buildingteams.com and provecq.com are yours. The buildingteams link already
  drives real traffic — add **contextual, keyword-anchored** links from both
  into our money pages: the retreats hub, the Flag Model, the new
  **[frameworks-compared pillar](/team-execution-frameworks-compared/)**, and
  the Team-LFS diagnostic. Anchor text matters — link "executive leadership
  retreats," not "click here."

---

## Tier 2 — Digital PR from the assets we've already built

We have reference-grade pages that *earn* links when the right people see them.
The job is to put a newsworthy hook in front of them.

- [ ] **Pitch a data story from the research report.** `/state-of-executive-team-
  execution/` (the 2026 report) is a stat asset — journalists cite stats. Pull
  the sharpest number into a one-paragraph pitch ("X% of executive teams can't
  turn strategy into execution") and send it to the curated media list below.
  A cited stat = an authoritative link, and it compounds.
- [ ] **Position the calculator + pillar as citable references.**
  `/cost-of-lost-disciplines-calculator/` and the framework-comparison pillar
  are exactly the pages people link to in "best team-execution framework" /
  "cost of misalignment" articles. Make sure both carry a **"cite / share this"**
  affordance and clean schema (on-site enabler below).
- [ ] **Expert-quote platforms.** James is a genuinely quotable expert (25 yrs,
  Chopra/Blanchard co-author). Two of these are already on the competitor-gap
  list: **featured.com** and **connectively.us** (formerly HARO). Answer 2–3
  relevant queries/week → authoritative editorial links with near-zero cost.
- [ ] **Founder podcast circuit.** Many podcast hosts appear in the competitor
  backlink gap (captivate.fm, libsyn.com, podbean.com, iheart.com). A founder
  with the Chopra/Blanchard story + the "Lost Disciplines" parable is a strong
  guest; show-notes links are easy, on-topic, and often do-follow.

---

## Tier 3 — Targeted outreach (curated from the competitor gap)

Semrush surfaced 352 domains where competitors have links we don't. Most are
noise (scrapers, wikis, unrelated). The credible, relevant targets, grouped:

- **Tier-1 media / business:** forbes.com · inc.com · esquire.com ·
  blackenterprise.com · thriveglobal.com · datadriveninvestor.com ·
  medium.com / substack.com (owned-contributor)
- **Leadership & exec-dev niche:** c-suitenetwork.com · chro.org ·
  strategydriven.com · thefutureorganization.com · ddiworld.com ·
  franklincoveyme.com · gravitasimpact.com · okrinstitute.org ·
  directorprep.com · leaddev.com
- **Executive search (natural fit for "executive team" content):**
  huntscanlon.com · odgersberndtson.com · bryantgrp.com
- **Retreat / offsite / events niche:** offsite.com · meetings-incentives.com ·
  ppai.org · corporatechallenge.com.au
- **Chambers & associations (easy, geo-relevant):** uschamber.com ·
  buffalochamber.org · capemaychamber.com

For each: lead with a *specific* reason they'd link (a stat from the report, the
comparison pillar as a resource, a James quote) — never a generic "please link."

> **Skip:** the scraper/junk domains in the export (namu.wiki, tuberipper.cc,
> kkphim1.com, radiofree.org, iplocation.net, and similar). Links from those
> are worthless or harmful.

---

## On-site enablers (Claude can build these now)

These make the assets above easier to link and concentrate the authority we do
earn onto the money pages:

- [ ] **"Cite this research" block** on `/state-of-executive-team-execution/` —
  a copy-ready stat + canonical URL + suggested attribution, so a writer can
  lift it in one click.
- [ ] **Concentrate internal links.** Ensure the report, the calculator, and the
  frameworks pillar are linked from the highest-authority pages (home,
  `/resources/`, the retreats hub) so inbound equity flows to them and out to
  the money pages.
- [ ] **Schema check** — confirm the research report carries `Article`/`Dataset`
  schema and the calculator a `WebApplication`/`HowTo` where appropriate, so the
  reference assets are machine-citable (helps GEO too).

---

## The redirect prerequisite (blocks Tier 1 value)

Reclaimed links to legacy URLs (`/extreme-retreats/`, `/shakubuku/`, the
WordPress `/blog/*` and `/wp-content/*` paths) only pass equity if the **301s in
`public/.htaccess` actually fire in production**. Our own note in
`redirects/plesk-nginx-compression.conf` says Plesk/nginx serves static files
directly and **bypasses `.htaccess`** — which would mean those redirects are
silently dead, and any reclaimed CNN/BI link would 404. **Verify first:** load
`https://www.belegendary.org/shakubuku/` — if it 404s instead of landing on the
retreats hub, port the `Redirect`/`RedirectMatch` rules into the nginx config
before chasing link reclamation.

---

## Bottom line

For a young domain on low-KD terms, **Tier 1 is 80% of the win** and needs no
cold outreach: reclaim the CNN/BI links you already earned, wire the sister
sites harder, and cash in the Chopra/Blanchard association. Do that first;
Tiers 2–3 compound over the following quarters.
