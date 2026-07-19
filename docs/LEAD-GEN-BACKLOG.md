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

### Batch 3 — CTA name standardization
- [x] **One name, one duration, sitewide: "Book a Calibration Call · 15 min."**
  Replaced "Strategy Call" (10 retreat/teams pages) and "Legendary Intent Call"
  (2 leaders pages) — all pointed to the same booking link — and unified the
  "20 minutes / twenty minutes" call copy to 15. (Left untouched: the 90–120-min
  diagnostic simulation and the "Legendary Intent" concept page/link.)

### Batch 4 — on-domain booking page
- [x] **`/book/` page embeds the scheduler** (`meetings-na2.hubspot.com/jcarter28`)
  with the "15 min · no pitch · whether or not we work together" copy + a
  "what to expect" bridge. All 98 sitewide CTAs now point to `/book/` instead of
  throwing visitors to a raw HubSpot tab. `CTA_URL='/book/'`, `BOOKING_URL` = the
  real scheduler (used by the embed, PDFs, and Organization schema). GA
  `book_calibration_call` conversion re-wired to fire on `/book/` clicks. Page is
  noindex + out of the sitemap (thin embed content).

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

### 2. ~~Standardize the CTA name~~  ·  ✅ DONE (Batch 3)
Unified to "Book a Calibration Call · 15 min" sitewide.
**One follow-up on your side:** rename the HubSpot meeting itself to "Calibration
Call · 15 minutes" so the scheduler page matches what the buttons promise.

### 3. ~~Embed the scheduler on-domain~~  ·  ✅ DONE (Batch 4)
`/book/` embeds the calendar with reassurance + "what to expect"; all CTAs route
there. **Verify on the live site** that the embedded calendar renders (if a server
CSP `frame-src` blocks it, allow `https://meetings-na2.hubspot.com`). The page has
a built-in "open in a new tab" fallback if the embed ever fails.

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
