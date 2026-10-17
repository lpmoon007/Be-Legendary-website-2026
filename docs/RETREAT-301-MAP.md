# belegendary.org → legendary-retreats.com — 301 map (DRAFT, apply after the retreat site is live)

**Date:** 2026-10-17
**Rule:** drop the `/teams/` prefix, keep the leaf; target host `www.legendary-retreats.com`
with a trailing slash; single hop, no chains.
**DO NOT APPLY until legendary-retreats.com is deployed and verified** — these would
otherwise redirect live traffic to a dark site. Applied together with the internal-link
cleanup, page removal, and homepage rebuild in one pass.

## A. New retreat 301s (add to public/.htaccess + nginx parity)
```apache
Redirect 301 /teams/retreats/                           https://www.legendary-retreats.com/
Redirect 301 /teams/retreats/destinations/              https://www.legendary-retreats.com/destinations/
Redirect 301 /teams/retreats/formats/                   https://www.legendary-retreats.com/formats/
Redirect 301 /teams/retreats/ways-to-work-together/     https://www.legendary-retreats.com/ways-to-work-together/
Redirect 301 /teams/retreats/for-executive-assistants/  https://www.legendary-retreats.com/for-executive-assistants/
Redirect 301 /teams/luxury-executive-retreat/           https://www.legendary-retreats.com/luxury-executive-retreat/
Redirect 301 /teams/corporate-retreat-ideas/            https://www.legendary-retreats.com/corporate-retreat-ideas/
Redirect 301 /teams/executive-offsite-ideas/            https://www.legendary-retreats.com/executive-offsite-ideas/
Redirect 301 /teams/leadership-retreat-ideas/           https://www.legendary-retreats.com/leadership-retreat-ideas/
Redirect 301 /teams/executive-immersion/                https://www.legendary-retreats.com/executive-immersion/
# (executive-immersion children are covered by the prefix line above — Apache Redirect appends the suffix)
Redirect 301 /sailing-team-building/                    https://www.legendary-retreats.com/sailing-team-building/
Redirect 301 /executive-off-road-immersion/             https://www.legendary-retreats.com/executive-off-road-immersion/
Redirect 301 /how-to-plan-a-leadership-retreat/         https://www.legendary-retreats.com/how-to-plan-a-leadership-retreat/
Redirect 301 /how-to-plan-an-executive-offsite/         https://www.legendary-retreats.com/how-to-plan-an-executive-offsite/
Redirect 301 /leadership-offsite-agenda/                https://www.legendary-retreats.com/leadership-offsite-agenda/
Redirect 301 /why-leadership-offsites-dont-stick/       https://www.legendary-retreats.com/why-leadership-offsites-dont-stick/
Redirect 301 /leadership-team-offsite-facilitator/      https://www.legendary-retreats.com/leadership-team-offsite-facilitator/
Redirect 301 /retreat-planning-kit/                     https://www.legendary-retreats.com/retreat-planning-kit/
```
Note: `Redirect 301 /teams/retreats/` is prefix-matching, so it also covers
`/teams/retreats/destinations/` etc. — the explicit child lines above make the intent
readable and let any child retarget individually if ever needed. Same for
`/teams/executive-immersion/` covering its four children.

## B. Case studies (5 move; index too) + the kit PDF
```apache
Redirect 301 /case-studies/online-auto-retailer-leadership-team/  https://www.legendary-retreats.com/case-studies/online-auto-retailer-leadership-team/
Redirect 301 /case-studies/san-juan-mountains-work-ethic/         https://www.legendary-retreats.com/case-studies/san-juan-mountains-work-ethic/
Redirect 301 /case-studies/everglades-abundance-mindset/          https://www.legendary-retreats.com/case-studies/everglades-abundance-mindset/
Redirect 301 /case-studies/federal-fiscal-leadership-team/        https://www.legendary-retreats.com/case-studies/federal-fiscal-leadership-team/
Redirect 301 /case-studies/alaska-executive-vulnerability/        https://www.legendary-retreats.com/case-studies/alaska-executive-vulnerability/
RedirectMatch 301 ^/case-studies/?$                               https://www.legendary-retreats.com/case-studies/
# The HubSpot kit follow-up email links to this PDF on belegendary.org — must redirect:
Redirect 301 /assets/downloads/complete-retreat-planning-kit.pdf  https://www.legendary-retreats.com/assets/downloads/complete-retreat-planning-kit.pdf
```
Index handled with `RedirectMatch ^/case-studies/?$` (exact) rather than a prefix, so a
FUTURE belegendary.org coaching case study at a new slug won't be caught. **Proof-gap note:**
belegendary.org then has no case-study pages — it keeps the aggregate ResultsBand stats, and
we build performance/coaching case studies as a follow-up.

## C. Repoint EXISTING redirects to flatten chains (edit these lines in place)
These currently point at retreat pages that are moving. Carry real backlink equity — must
go straight to the new domain, one hop.
```apache
# was → /teams/retreats/
Redirect 301 /shakubuku/                        https://www.legendary-retreats.com/   # Business Insider backlink, ranked ~#5
Redirect 301 /extreme-retreats/                 https://www.legendary-retreats.com/   # CNN backlink, ranked ~#3
Redirect 301 /experiential-leadership-retreats/ https://www.legendary-retreats.com/
# was → /executive-off-road-immersion/
Redirect 301 /denver-executive-leadership-retreat/  https://www.legendary-retreats.com/executive-off-road-immersion/
Redirect 301 /sedona-executive-leadership-retreat/  https://www.legendary-retreats.com/executive-off-road-immersion/
# was → /leadership-team-offsite-facilitator/  (~38 external links)
Redirect 301 /effective-facilitator-workshop/   https://www.legendary-retreats.com/leadership-team-offsite-facilitator/
# was → /case-studies/
Redirect 301 /hvac_case_study/                  https://www.legendary-retreats.com/case-studies/
```

## D. Internal-link cleanup (separate from the 301s — Phase 4)
146 retreat-slug references across 44 files, including the global `SiteHeader`, `SiteFooter`,
and `ResultsBand`. For each: remove, or where belegendary.org genuinely should point at
retreats, link to the `www.legendary-retreats.com` absolute URL in a new tab. **Keep ONE**
understated cross-link ("Executive retreats → legendary-retreats.com") in the nav/footer —
the reciprocal of the retreat site's single Flag Model link — so the entities stay clean but
connected. Remove the retreat Offer from the OfferCatalog; drop retreat slugs from site.ts;
update llms.txt and the sitemap.

## E. Also on the founder side (HubSpot)
Update the retreat-kit follow-up workflow's download link to point at the new
legendary-retreats.com PDF URL directly, so future emails don't rely on the 301 (the 301
above covers already-sent emails).

## Apply order (the safety rule)
1. legendary-retreats.com deployed + verified live.
2. Apply A + B + C to belegendary.org .htaccess (+ nginx parity).
3. Phase 4 internal-link cleanup + page removal.
4. Rebuild belegendary.org homepage for performance/coaching.
5. Verify: curl each moved URL → single 301 to the right target; no chains; no broken
   internal links; both sitemaps correct.
