# Lead-gen backlog

From the full conversion/GEO review (4 independent audits: CTA path, forms,
money pages, trust/deep-landing). Work the **Pending** list top-down, one at a
time. Check items off as they ship.

---

## ✅ Shipped

### Batch 1 — silent lead loss (urgent)
- [x] **All forms gate on `res.ok`** — success is shown only when HubSpot
  accepts the submission; failures now surface a `mailto:` fallback instead of
  faking success. (newsletter, break-point, scorecard, waitlist, calculator)
- [x] **Bulk & Speaking enquiry** (empty GUID) — real `mailto:` fallback with
  the full enquiry prefilled, so the top B2B path stops discarding submissions.
- [x] **Leadership Scorecard** — was posting 8 custom fields to the plain
  newsletter form (HubSpot 400 → total loss). Now posts email-only to the
  working form; the score still renders on-screen and goes to GA.
- [x] **Workout "Log it" + Gratitude enroll** — were `localStorage`-only. Now
  capture the email to the working newsletter form (local progress unchanged).
- [x] `CONTACT_EMAIL` constant added (`src/lib/site.ts`).

### Batch 2 — friction + missing next-action
- [x] **Contact path** — `mailto:` in both footer variants; privacy page now
  names a real contact email (fixes the GDPR/CCPA "contact us" dead-end).
- [x] **End-of-article block** (`ArticleEndCTA`, 62 pages) now leads with the
  Calibration Call as the primary action; assessment kept as the "not ready?" step.
- [x] **Cost calculator** — "email me my results" capture at peak intent.
- [x] **Leaders glossary** — added the `ArticleEndCTA` trust block (was a dead-end).

---

## ⏳ Pending — needs a decision or an asset from James

Ordered by leverage. Each notes what's blocking it.

### 1. Wire the real HubSpot forms  ·  *needs: HubSpot setup*
The interim fixes above stop the bleeding, but these capture more once real forms exist:
- [ ] **Enquiry form** — create the Bulk/Speaking form (fields: email, firstname,
  company, message, intent), paste GUID into `HUBSPOT.ldolEnquiryFormGuid`. Then
  the mailto fallback is replaced by a real capture automatically.
- [ ] **Scorecard form** — create a form with the 8 score properties so the score
  data is captured (not just the email), then point the scorecard at it.
- [ ] **Workout completion + Gratitude course** — dedicated forms/workflows so
  those leads land in the right lists (not the general newsletter), with real
  nurture sequences.

### 2. Standardize the CTA name  ·  *needs: your decision*
One offer currently has two names: **"Calibration Call" (15 min)** on 46 pages vs
**"Strategy Call" (20 min)** across the teams/retreats cluster (~10 pages) — same
HubSpot link. Decide: unify to "Calibration Call" everywhere, or is the retreat
"Strategy Call" a deliberately different intent? Once decided, it's a one-pass fix
driven from `site.ts`. (Also unify the HubSpot meeting title to match.)

### 3. Embed the scheduler on-domain  ·  *needs: HubSpot embed code*
Every CTA currently opens `meetings.hubspot.com` in a new tab — the visitor leaves
the site at peak intent and the reassurance copy doesn't travel. Build a `/book/`
page with the HubSpot Meetings embed so booking completes on belegendary.org, with
the "15 min · no pitch · whether or not we work together" copy beside the calendar.

### 4. One named C-suite testimonial  ·  *needs: permission/asset*
The exec-team money pages show anonymized case studies + team-building testimonials
(bike charity, councils) + unattributed stats. One named COO/CEO outcome quote would
outconvert all eight. Tie it to a FlagScore/revenue outcome; feature it in `ProofStrip`
on the team money pages.

### 5. Risk reversal on the money pages  ·  *needs: your policy call*
The site coaches buyers to ask a vendor *"what happens if it doesn't work?"* then never
answers it for itself, on a $25K–$500K commitment. Add a "how we de-risk this" element
(outcome commitment / measured-against-baseline / refundable diagnostic). — code once
you decide the wording.

### 6. "What the 30 days actually looks like" module  ·  *needs: your process detail*
"30-day reinforcement" is the #1 differentiator and the answer to "will it stick," but
it's an unexplained slogan. A short module (weekly cadence, the lead measure per person,
the FlagScore re-read) on the retreat/ways-to-work pages = concrete proof. — code once
you give the specifics.

### 7. Team Diagnostic pricing/path  ·  *needs: your pricing decision*
The diagnostic reads like a paid product ("Step one · before any retreat") but shows no
price and no standalone buy path — a black box next to pages that name real numbers.
Decide: bundled into the retreat, or standalone "from $X"? If standalone, it's your best
low-risk first sale — give it its own CTA.

### 8. Persistent CTA on slim pages + `/leaders/` byline  ·  *needs: design nod*
The slim header/footer strip the Book button on deep `/leaders/*` pages, and those pages
have no "who is James" byline above the fold (cold AI-referred landers get no trust + no
next step). Adding a compact CTA to the slim header and a top-of-page byline is a broad
visual change — worth doing, but review the look before shipping.

### 9. Smaller items
- [ ] Teams glossary — adopt `ArticleEndCTA` for author/proof consistency (already has a
  call CTA, so low priority).
- [ ] Link the cost calculator from the retreat pricing pages (reframes the price as
  cheaper than the problem — the reason-to-act-now).
- [ ] Surface the phone number consistently (currently on one page only), or drop it.
- [ ] A People-leader / CHRO champion path with internal-justification materials
  (today only CEO + EA are served).
- [ ] Coaching-cost page: add a "where we fit" line bridging market ranges to the real tiers.
