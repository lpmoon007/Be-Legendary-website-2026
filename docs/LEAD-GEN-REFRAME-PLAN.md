# Lead-Gen Reframe Plan — Be Legendary

**Date:** 2026-10-16
**Author:** James Carter (founder) + Claude
**Status:** Draft for alignment. No pages change until the direction here is approved.

---

## The problem in one sentence

The site is an authority asset **optimized to be right** (the Flag Model, the
disciplines, FlagScore, the book, "there is no lightswitch"), when leads come from
a product **optimized to be bought** — an easy, desirable first step that delivers
an early win.

Right now a cold visitor who searched "executive retreat" lands on a hero that says
their past purchases failed, there's no easy fix, and the real work is hard, slow,
and expensive. We meet the desire for a quick win with homework and a warning. That
is the right message for someone already sold on James and the book, and the wrong
message for the stranger we need to start a conversation with.

## What the numbers say (Oct 2026)

- **Organic traffic:** ~30/day a year ago → brief post-revamp bump (~41/day early
  July) → steady decline to **3–6/day now**. Tracked keywords 105 (July) → 61.
- **Money pages don't rank:** "executive retreat" #47, "executive leadership
  retreat" #55, "leadership retreats for executives" #62, "executive team
  development company" #46 — all page 5–9. Only brand terms rank page 1. The site
  ranks for zero-intent trivia (gapology, drexler/sibbet, cogs ladder) nobody buys
  from.
- **Conversion is near-zero:** Clarity, trailing 12 months — ~1,559 human sessions,
  but only **5 "Contact us" events, 6 outbound clicks, 9 reads past 60%**.
  Pages/session 1.45, scroll depth 39%, active time 77s.
- **Demand is landing on the right doors anyway:** top pages after home (458) are
  **/teams/retreats/ (107)**, /how-we-work-together/ (86),
  **/executive-team-building/ (77)**, the LFS demo (50), break-point (44). The
  retreat and team interest arrives — and the framing turns it away.
- **Technical drag:** INP = **960ms** (Google "poor" is >500ms). The site feels
  laggy to interact with, compounding the bounce.

## The strategic shift: land-and-expand

Lead with the win they already want. Deliver it. **Earn** the long engagement.

- **Land** = an easy, enjoyable, high-value first purchase a team can say yes to
  without a transformation decision: an **executive retreat**, or a **Team LFS**
  session that is genuinely good on its own.
- **Expand** = the Performance Partnership (the hard, lucrative, 12-month back-end)
  comes *after* a real result and a real relationship, not on day one from cold.

The Flag Model, the book, the research, and the "it's hard and it's measured"
honesty all stay — but as the **proof layer underneath**, not the front door. We
are re-prioritizing the front end, not deleting the authority work. Fully
reversible, and it keeps the book-launch asset intact for later.

## The new offer ladder (front-to-back)

| Rung | Role | Framing shift |
|---|---|---|
| **Executive Retreat** | Front door #1 | From "diagnose your dysfunction first" → "an offsite your team will remember, built around one outcome." Easy inquiry. |
| **Team LFS** | Front door #2 | From "the instrumented read on how you break" → "a 90-minute experience your team enjoys that also hands every leader a personal, data-backed read." A thing you just *book*. |
| Break-Point / Calibration Call | Free top-of-funnel | Keep, but as a low-friction entry, not the only CTA. |
| Executive Team Diagnostic | Mid | Stays as the bridge to the Partnership (already reconciled). |
| Performance Partnership | Back-end | Stays. Stop front-loading it on cold traffic. |

Credit rule unchanged: every paid step credits 50% toward the next.

## Page-by-page changes, in priority order

### P0 — fastest lead unlock (traffic is already here)

1. **Homepage hero + primary CTA** (`src/pages/index.astro`)
   - Replace the "no lightswitch / it's hard" hero as the *opening* with a
     product-led hero that leads with the retreat + LFS and an easy first step.
   - Keep "The truth no one sells you" section, but move it **below** the offer so
     depth-seekers still get it; it no longer greets cold traffic.
   - Primary CTA shifts from only "Book a 15-minute call" (a call to be diagnosed)
     to a desirable action: *Plan a retreat* / *Book an LFS session*, with the call
     as the secondary.
   - Direction (not final copy): *"An executive offsite your team will actually
     want — and a 90-minute session that shows you how they really perform."*

2. **Retreats front door** (`src/pages/teams/retreats/index.astro`)
   - Lead with experience + outcome + place, not diagnosis.
   - Add a dead-simple inquiry path (team size / timeframe / destination →
     "plan my retreat"), so the #2-traffic page converts instead of routing into
     the Partnership funnel.

3. **LFS reframe** (`src/pages/teams/team-lfs.astro`)
   - Reposition from clinical "instrumented read" to "a team session that's
     genuinely engaging **and** hands you the data." Fun + insight + a shareable
     report as the headline; keep the behavioral rigor as the proof.
   - Make it bookable as a standalone, with the deeper work as the optional next
     step.

### P1 — supports the reframe

4. **Primary nav** — surface **Executive Retreats** and **Team LFS** as top-level,
   desirable products (today retreats is one top item; LFS is buried under a
   dropdown). (`src/components/SiteHeader.astro`, `index.astro` homeLinks)
5. **CTA audit** — only 5 "Contact us" events in a year means the conversion path
   itself is failing. Make every money page end in one low-friction, desirable
   action, not a generic "book a call."
6. **/executive-team-building/** — it pulls 77 sessions; point it at the retreat +
   LFS wedges rather than the framework.

### P2 — slower, compounding

7. **Rankings:** the retreat money pages sit page 5–9. Strengthen `/teams/retreats/`
   and the destination/luxury pages for real buyer terms ("executive retreat,"
   "leadership offsite," "executive team building"). Stop feeding zero-intent
   glossary bait in `/resources/`.
8. **Performance:** fix INP (960ms). Likely heavy inline JS / main-thread work on
   interaction; worth a profiling pass.

## What stays exactly as-is (the proof layer)

The Flag Model pages, FlagScore, the research report, Field Notes, the book pages,
James's authority/press, and the Diagnostic → Partnership back-end. None of this is
removed. It moves from "the first thing cold traffic reads" to "the reason to
believe, once they're interested."

## How we'll know it's working

Watch these in Clarity / GSC / GA4, baselined against today:

- **Retreat inquiries** and **LFS bookings** (add explicit smart events for each).
- **"Contact us" / form-submit events** (currently ~5/yr — any real movement is
  signal).
- Scroll depth and active time on the homepage and `/teams/retreats/`.
- Organic position of the retreat buyer terms (slow; P2).

## Sequencing with the book

Pivot the **front end** to lead-gen now; keep the **authority/book layer** intact
underneath for after launch. This plan touches positioning and CTAs, not the book
or framework content.

## Open decisions for James

1. **How far does the homepage pivot go?** Full product-led hero (recommended), or
   a lighter touch that keeps the current hero and just adds a product-led band
   above the fold?
2. **Which wedge leads** — retreats, LFS, or both side-by-side on the homepage?
3. **Retreat inquiry:** a real availability/inquiry form, or keep routing to the
   Calibration Call but reworded as "plan your retreat"?
4. **Scope of this pass:** P0 only (homepage + retreats + LFS), or P0 + P1 together?

---

*Next step after approval: I draft the P0 page changes as proposals (you see the
new voice before anything deploys), starting with whichever wedge you pick.*
