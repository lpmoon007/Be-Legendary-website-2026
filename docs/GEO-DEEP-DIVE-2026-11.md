# GEO / SEO Deep Dive — November 2026

**Prepared:** 2026-11-10 · **Brand:** Be Legendary (belegendary.org) · **Market:** US
**Windows analyzed:** 90-day (≈ 8/11–11/8) and 14-day (10/26–11/8)

> **How to read this doc.** It's versioned — each pull should be committed against
> the last so we track movement, not just a snapshot. "Negative / watch" items are
> called out explicitly; that's the section to scan first each month.

---

## Data sources & honesty caveats

| Source | What it measures | Caveat |
|---|---|---|
| Otterly brand report (`01M3QH587FH7DHSFX646MG2WVV`) | AI citations + brand mentions across engines, 22 tracked prompts | Report created **9/29**, so its "90-day" history is really ~6 weeks (9/29→11/8) |
| Google Search Console export | Classic Google organic clicks/impressions | — |
| "AI Performance" citations export | AI-surface citations/cited-pages, daily | Independent of Otterly; its tail (11/7 = 0) is a **collection gap**, not a real blackout |
| GA4 Reports snapshot | Sessions/users/pages | **Massively bot-inflated** — strip before reading |
| Microsoft Clarity | Real human sessions, engagement, field Core Web Vitals | Small, internationally-skewed human sample |
| Semrush domain_rank | Authority / organic footprint | — |

---

## Headline: winning the *source* game, still losing the *provider* game — but the gap is closing

Two different GEO metrics tell opposite stories you must hold at once:

| Metric | 90d (9/29–11/8) | 14d (10/26–11/8) | Dir. |
|---|---|---|---|
| **Domain citation share** (cited as a *source*) | 1.7% | 2.1% | ▲ |
| **Domain rank** among ALL cited domains | **#6** | **#6** | hold |
| **Domain coverage** | 12% | 14% | ▲ |
| **Brand coverage** (named as a *provider*) | 2.6% | 4.2% | ▲ |
| **Share of Voice** | 3.8% | 6.8% | ▲▲ |
| **Avg rank when named** | 1.25 | 1.09 (≈1st) | ▲ |
| **Brand-coverage rank** vs 10 competitors | **11th / last** | **11th / last** | ⚠ |

- **As a source, belegendary.org is #6 of every cited domain** — behind only LinkedIn, YouTube, HBR, McKinsey, CCL, and *ahead of* Korn Ferry, Vistage, Gallup, Forbes, Reddit as citation sources. Extraordinary for a domain this small.
- **As a named provider, it's dead last** of 11 brands (14d: CCL 13%, Korn Ferry 13%, McKinsey 9.9% vs Be Legendary 4.2%) — but brand coverage went 2.6→4.2%, SoV 3.8→6.8%, and brand *mentions* are accelerating (71 across the whole 6 weeks vs 51 in just the last 14 days). When named, it ranks ~1st.

**The engines trust the pages as sources; they're beginning — slowly — to name Be Legendary as a provider. Brand coverage is the number to push, and it's moving the right way.**

### Top cited Be Legendary pages
- **90d:** state-of-executive-team-execution (54), flag-model (51), best-executive-team-development-companies (38), executive-team-assessment (31), how-to-fix-a-dysfunctional-leadership-team (30), research-notes/leadership-team-aligned-not-executing (28), glossary (27)
- **14d:** flag-model (**37**, now #1), executive-team-assessment (22), glossary (19), how-to-fix (16), team-execution-frameworks-compared (14)
- **Rotation to note:** `state-of-executive-team-execution` was the 90-day #1 (54) but only 10 in the last 14 days — **cooling, needs a freshness pass.** `flag-model` has taken over.

---

## Negative changes / watch list

1. **Early-November dip — transient, already recovered.** Domain coverage fell 11/2→11/5 (11% → 9.1% → **3.4% trough on 11/4** → 8%), then recovered 11/5→11/8: **8% → 10% → 11% → 14%.** The AI-citations CSV tail (11/7 = 0) is a collection gap — Otterly shows citations those days. Cross-validated as a blip, not structural. *Re-check: coverage should hold ≥10% through the following week.*
2. **`state-of-executive-team-execution` cooling** (see above) — refresh before it fades.
3. **Structural gap persists:** cited as a source, not recommended as a provider. This is an **off-page** problem, not an on-site one.

---

## Classic SEO confirms the model (don't chase it)

- **GSC:** ~0–2 clicks/day, 5–43 impressions/day. Google organic is not the channel.
- **Semrush:** belegendary.org Semrush Rank **7.3M**, **104 organic keywords**, **15 organic visits/mo** — vs CCL (25,570 kw / 192k traffic) and Korn Ferry (23,849 / 69k). ~1/250th their search footprint.
- **The tell (good):** of belegendary's 104 ranking keywords, **100 trigger AI Overviews and 94 trigger People Also Ask.** Nearly the entire (tiny) footprint sits in AI-answer surfaces — built for extraction, not blue links. The GEO strategy working as designed.

---

## Real humans vs bots (Clarity + GA4)

- GA4's "4,537 users" is a mirage — **Clarity: 1,518 human sessions vs 2,860 bot sessions** (bots ~2:1). True human traffic ≈ **17 sessions/day.**
- **Engagement is shallow** (1.27 pages/session, 33% scroll, 42s active) — the AI-referral pattern: land on the cited page, get the answer, leave. Expected for GEO traffic, but on-site conversion paths barely get exercised.
- **AI-referral clicks are real and converting:** ChatGPT 20 users, Copilot 4, Perplexity 1 (GA4 ai-assistant medium). Citations → clicks, at small scale.
- Humans were landing on the **404'ing no-slash retreat URLs** (`/teams/retreats`, `/executive-off-road-immersion`) — now fixed (see below).

---

## Core Web Vitals — measured, not assumed

- **Clarity field:** LCP 4.81s, INP 960ms, CLS 0.003 — looked alarming.
- **Lab (Slow-4G + 4× CPU, mobile), this build:** Homepage **LCP 1.36s / CLS 0.008**; flag-model **LCP 1.24s / CLS 0.** Pages 230–274 KB. **The site is fast; there is no performance bug.** The field numbers reflect a distant, low-end, slow-network audience on a tiny sample.
- **INP:** zero client-side JS islands; analytics (GA + Clarity) lazy-load off the critical path. Nothing in-code to fix — the 960ms is Clarity's own measurement overhead.
- **The one real lever (shipped):** the LCP element is the **H1/H2 italic accent** (Newsreader 500-italic), which wasn't preloaded — so on slow connections the headline's italic half waited on the CSS @font-face chain. **Fix: added the italic preload to BaseLayout** (commit `6cba5ff`, deployed green). Targets exactly the slow-network field case.

---

## Fixes shipped this cycle (commit `6cba5ff`, deploy #426 ✅)

1. **Italic headline font preload** — the one real CWV improvement.
2. **Redirect re-sync** — every legacy 301 in `public/.htaccess` and the Apache paste-file converted from `Redirect 301 /path/` (slash-only prefix) to `RedirectMatch 301 ^/path/?$`, so **both `/path` and `/path/` redirect.** The no-slash form — which AI engines and humans were hitting — previously fell through to the branded 404 (the 404 page was the **#1 page by views: 1,409, 99% bounce**). Now in lockstep with the already-correct `plesk-nginx-redirects.conf`. Behavior-preserving otherwise. *(James had already applied the runtime fix via Plesk Additional directives; this makes the repo source-of-truth durable against future deploys.)*

---

## How to keep winning — action list

1. **Off-page is the whole game** (the only lever that moves "named as provider"). **Correction:** most of Otterly's "content partnership" suggestions are **competitors' own marketing pages** — `leadersadapt.com`, `vistage.co.uk`, `arielgroup.com`, `marklefko.com`, `teams.coach`, `livesimulations.com.au` — you can't get listed on a rival's roundup. The genuinely pitchable, independent targets:
   - Aggregators / comparison sites / personal blogs: **leadersconnect.org, ericpartaker.com, atlaspeople.io, boon-health.com, attuned.ai**
   - Media (via press/HARO kit): technologyrecord.com, HR Economic Times
2. **Counter-move you fully control:** make your own `best-executive-team-development-companies` page (already your #3 cited URL, 38 citations) the definitive, freshest, most-structured roundup in the category — out-cite the competitor listicles (leadersadapt is running the same play).
3. **On-page freshness:** feed `flag-model` (now #1) and `executive-team-assessment` + `glossary` (rising); refresh `state-of-executive-team-execution` (cooling).
4. **"Leadership simulation for executive teams" prompt** — thin competition (only livesimulations.com.au, DDI). Your simulation *content* can earn citations under the descriptive label.
5. **Data gap:** Otterly agent-traffic is `not_connected` (no server-log connector) — wire it up to see which AI crawlers hit the site.

---

## Competitor set — open item

James's note (2026-11-10): **the boutique firms listed on leadersadapt.com are truer competitors than the enterprise giants** (CCL, Korn Ferry, McKinsey). `leadersadapt.com` added as the 11th tracked competitor in Otterly. The full boutique list couldn't be fetched (the egress proxy blocks the domain); **pending James pasting the firm list** to swap the enterprise giants for the real peer set in the report.

---

## Changelog
- **2026-11-10** — First deep dive. Baselined 90d/14d. Shipped italic-preload CWV fix + redirect re-sync. Added leadersadapt as competitor. Open: boutique competitor list; GEO off-page outreach to independent aggregators.
