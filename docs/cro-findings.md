# CRO / Human-Buying-Behavior Audit — Findings

Review of the money/conversion pages for the "human online buying value" lens —
what an EA or CEO needs to see to trust and act. 2026-08. Findings + a clear
split of what I can fix now vs. what needs real assets from James.

## Working well ✅
- **CTA consistency:** "Calibration Call" is the consistent primary CTA across the
  money pages (Executive Immersion uses "Design Call" and the brief uses "Start a
  conversation" — intentional, on-message). Low friction, one clear next step.
- **Price transparency:** the public ladder (free call → $7.5K ELFS → $28–35K LFS →
  $35K immersion → $45–65K sprint → $25–500K retreat → $75K+ partnership) is a real
  differentiator and pre-qualifies buyers.
- **Proof on the top pages:** home, executive-team-development, and how-we-work-together
  carry the ResultsBand; most money pages carry the press strip.
- **Human imagery** on home (6), Executive Immersion (6), retreats (2), sailing (2).

## Findings

### 1. Testimonials are thin and scattered — the #1 conversion gap. NEEDS JAMES.
For a premium advisory, named social proof is the single biggest trust driver, and
right now there are only **two** named quotes on the whole site — Larry Quinlan
(Global CIO, Deloitte) and Ronn Page (former CEO, Eagle Manufacturing) — scattered
across pages; `src/lib/testimonials.ts` holds just one. Most critically, there is
**no EA / chief-of-staff quote** — the exact buyer we're optimizing for. The
Testimonials wall component exists but runs on a single quote.
→ *Needs real, attributable quotes from James (see list below). I can wire the wall
and consolidate the two existing ones now.*

### 2. The flagship LFS page has zero proof and zero humans. FIXABLE NOW.
`/teams/team-lfs/` — the diagnostic everyone is funneled to — has **no ResultsBand,
no press strip, no testimonial, and no human imagery.** It's all abstract text on
the highest-intent product page.
→ *Add ResultsBand + press now; a real team photo needs James.*

### 3. Proof-thin / human-thin money pages. PARTIALLY FIXABLE NOW.
- `executive-team-alignment-consultant` — no proof, no humans, no press.
- `teams/` hub — has the client roster but no ResultsBand/press.
- `executive-team-building` — no ResultsBand (it does have the 209% stat inline).
- No human imagery on `executive-team-development`, `how-we-work-together`,
  `team-lfs`, `alignment-consultant` — buyers want to see real executive teams.
→ *Add ResultsBand/press where natural now; reuse existing retreat/off-road/EI
photos on the human-light pages where honest; net-new team photos need James.*

### 4. Client roster needs verification (carried from audit #2). NEEDS JAMES.
`TrustedBy.astro`: "Trusted by leadership teams at American Express, Johnson &
Johnson, Caterpillar, Bayer, Siemens." Confirm all five are genuine team clients,
and reconcile Siemens (framed elsewhere as a keynote audience, not a team client).

## The "Needs-James" list (can't be done without you)
1. **Real testimonials — priority: an EA or chief-of-staff quote.** Plus any other
   named client quotes we can attribute (we only have Quinlan + Page).
2. **Confirm/edit the client roster** (Amex, J&J, Caterpillar, Bayer, Siemens) and
   the Siemens client-vs-keynote framing.
3. **Real photos of executive teams in the work** — for team-lfs, executive-team-
   development, how-we-work-together (the human-light pages).
4. **(Optional) a strong James headshot** if the current `james.jpg` is weak.

## Proposed fix batches (fixable now, no new assets)
- **Batch E — Proof scaffolding.** ✅ **DONE (2026-08).** Added ResultsBand + press
  strip to the flagship `team-lfs` page (was zero proof); ResultsBand to the teams
  hub (before TrustedBy), `executive-team-building` (firm-level band beside the 209%
  story), and `executive-team-alignment-consultant` (+ press) before its CTA. Every
  money page now carries firm-level proof.
- **Batch F — Consolidate testimonials.** ✅ **DONE (2026-08).** Added Ronn Page
  (Eagle Manufacturing CEO) to `testimonials.ts` alongside Larry Quinlan, so the
  Testimonials wall now shows two real named quotes (and adds a 2nd Review schema
  node). Fixed the component to render exactly two as a balanced 2-up grid instead
  of a sparse 3-column masonry. Surfaced the wall on how-we-work-together (the main
  conversion hub) right before the CTA. Broader placement on other money pages
  waits for more quotes — especially the EA/chief-of-staff quote — to avoid a
  thin two-quote section repeated everywhere.
- **Batch G — Reuse existing human photos** on the human-light money pages
  (honest reuse of retreat/off-road/EI imagery), pending James's net-new team
  photos. ☐
