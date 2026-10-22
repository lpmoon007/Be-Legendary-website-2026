# Wikidata Statement Set — belegendary.org

**Date:** 2026-10-22
**Purpose:** Track C (entity graph) of the GEO Authority Playbook, made ready-to-apply. AI engines resolve and trust *entities*; the more corroborated "Be Legendary = executive-team performance firm / James Carter = founder & Flag Model creator / the Flag Model = a named framework" is in structured knowledge, the more confidently models cite belegendary.
**How to use:** Anyone with a Wikidata login (James, a VA, or me on request if given access) applies these. Each statement lists the **property**, the **value**, and a **reference** (every claim should cite a source — Wikidata rejects or deprioritizes unreferenced statements). Values flagged **⚠ CONFIRM** need James's sign-off before they go on; **do not apply those blind.**

> **Two hard rules for the person applying this:**
> 1. **James Carter is a common name** — there are at least two *other* James Carters already holding Wikidata/Crunchbase entities (noted in `site.ts`). Before editing **Q140514540**, confirm on-screen it is *our* James Carter (founder of Be Legendary / author of the books below). Editing the wrong item is worse than editing none.
> 2. **Do NOT add sex/gender (P21) or country of citizenship (P27)** to the James Carter item. We have no sourced, confirmed value, and a guess on a real person is not acceptable. Leave them off. (The books, roles, and website are all we can source.)

---

## Item 1 — Be Legendary · **Q140513581** *(exists — strengthen)*

| Property | Value | Reference / note |
|---|---|---|
| **P31** instance of | *business* (Q4830453) or *consulting firm* (Q6456440) | Pick *consulting firm* if available; else *business*. |
| **P112** founded by | **James Carter (Q140514540)** | **Highest priority** — this is the bidirectional link that resolves person↔company. Reference: belegendary.org/about/james-carter/ |
| **P571** inception | **2003** | Repario Ltd Inc's founding — see **Inception note** below. |
| **P1365** replaces *(optional)* | *The Carter Group* (founded 2000) | predecessor James ran before Repario; add as an item or a note if you want the full lineage visible |
| **P1448** official name | Be Legendary | |
| **P1813** short name / **P4970** also known as | Repario · Building Teams · Repario Ltd Inc | From `site.ts` `alternateName`. Add as aliases on the item too (left-hand "Also known as"). |
| **P856** official website | https://www.belegendary.org/ | ref URL = itself |
| **P452** industry | *management consulting* (Q2142688) / *leadership* | whichever resolves |
| **P159** headquarters location | **Denver** (Q16554) ⚠ CONFIRM | `site.ts` places the entity in Denver, CO (locality-only, no street address). Confirm Denver is correct as HQ city. |
| **P17** country | United States (Q30) | |
| **P856 / P973** described at URL | https://www.belegendary.org/ · https://www.buildingteams.com/ | corroborating domains for the same entity |
| **sameAs / external IDs** | LinkedIn: `company/repario-and-be-legendary` · Crunchbase (verify org page exists) | Mirror the `sameAs` already in our schema so the graph is bidirectional. |

**Inception note — the lineage (confirmed by James, 2026-10-22):**
- **The Carter Group — founded 2000** (James's earlier firm; the 2003 HR Magazine byline in `/press/` still reads "then of The Carter Group").
- **Repario Ltd Inc — founded 2003** (this is the legal entity the Wikidata item **Q140513581** describes; *Be Legendary* and *Building Teams* are its DBAs).
- **Operating under the name "Be Legendary" since 2010** (stated on `/about/james-carter/`).

Cleanest Wikidata modeling:
- **P571 inception = 2003** — Repario Ltd Inc's founding, matching our JSON-LD (`foundingDate: '2003'`). This is the entity's date, so it's correct as-is; no change needed to the site.
- Add **P1448 official name = "Be Legendary"** with qualifier **P580 (start time) = 2010**, so the name history is captured without understating the firm's age.
- Optionally capture **The Carter Group (2000)** as the predecessor (P1365) if you want the full lineage on the graph — but it's a separate firm, not Repario's inception, so it does **not** change the 2003 date.

This avoids a stray "founded 2010" (which the consistency audit specifically checked for and the site is already clean of).

---

## Item 2 — James Carter · **Q140514540** *(exists — strengthen; verify it's the right item first)*

| Property | Value | Reference / note |
|---|---|---|
| **P31** instance of | human (Q5) | should already be set |
| **P735** given name | James (Q677191) | |
| **P734** family name | Carter (Q1075796) | |
| label / alias | "James L. Carter" as an alias | the disambiguating form we use in schema |
| **P106** occupation | *entrepreneur* (Q131524) · *author* (Q482980) · *management consultant* | |
| **P108** employer *or* P1037 director/manager of | **Be Legendary (Q140513581)** | the reciprocal of P112 above — apply both so the link is bidirectional |
| **P800** notable work | the three books (Items 3a–3c below) | add each once its book item exists/linked |
| **P856** official website | https://www.belegendary.org/about/james-carter/ | |
| **sameAs / external IDs** | LinkedIn: `in/jlcarter` · Amazon author: `B009FAZ2NG` · Crunchbase: `person/james-carter-5417` | mirror our schema `sameAs` |
| ~~P21 sex or gender~~ | **— do not add —** | no sourced value; see hard rule #2 |
| ~~P27 country of citizenship~~ | **— do not add —** | no sourced value |

### Book items (link as P800 notable work, and as P50 author on each book item)

These let "author of…" resolve as structured fact. If a Wikidata item already exists for a book, link it; otherwise create it.

**3a — *Discover Your Inner Strength***
- P31 = book (Q571); P50 author = James Carter (Q140514540) + co-authors Brian Tracy, Ken Blanchard, Stephen Covey (link their items if present)
- **P212 ISBN-13 = 978-1-60013-512-5**; P577 publication date = **2009**
- P856/described-at = https://www.belegendary.org/discover-your-inner-strength/ ; Amazon ASIN 1600135129

**3b — *Roadmap to Success***
- P31 = book; P50 author = James Carter + Deepak Chopra, Ken Blanchard (and others on the cover)
- **P212 ISBN-13 = 978-1-60013-921-5**; P577 publication date = **2012**
- described-at = https://www.belegendary.org/roadmap-to-success/ ; Amazon ASIN B00BJAM0SA

**3c — *Lost Disciplines of Leadership* (forthcoming)**
- ⚠ **Hold** — don't create a Wikidata item for an unpublished book (no ISBN/publication date yet; Wikidata notability for a forthcoming title is thin). Add it once it's published with an ISBN. Until then it lives only in our on-site schema.

---

## Item 3 — The Flag Model · **NEW item** *(create)*

Give the framework its own resolvable entity, so "what is the Flag Model" has a knowledge-graph anchor pointing at belegendary, not just a web page.

| Property | Value | Reference / note |
|---|---|---|
| **label** | The Flag Model | |
| **description** | "executive-team performance framework created by James Carter of Be Legendary" | short, entity-defining; matches the `/flag-model/` page copy we already tightened |
| **P31** instance of | *concept* (Q151885) **or** *conceptual framework* (Q2135804) / *management method* | pick the most specific that resolves |
| **P170** creator | **James Carter (Q140514540)** | the key statement — ties the framework to the person |
| **P178 / developer** *(optional)* | Be Legendary (Q140513581) | the firm that develops/applies it |
| **P856 / P973** described at URL | https://www.belegendary.org/flag-model/ | the canonical definition page |
| **P1343** described by source *(optional)* | — | add press/third-party once a source covers it by name |

**Reference for every Flag Model statement:** https://www.belegendary.org/flag-model/ (ref URL) with retrieved = 2026-10-22. As independent coverage of the Flag Model appears (Track A/B), add those as additional references — multiple independent references are what move an item from "self-described" to "corroborated."

**Note on FlagScore:** don't make a separate item yet — it's a measure *within* the Flag Model, better captured as a statement/qualifier on the Flag Model item than as its own entity until it has independent coverage.

---

## After applying

1. **Keep every new profile identical** to the `sameAs` set in `src/lib/site.ts` (NAP + links). The Wikidata item should be first in `sameAs` everywhere (it already is) — it's the anchor the other profiles point back to.
2. **Re-run the Otterly report in 2–4 weeks.** Entity strengthening shows up slowly (engines re-crawl structured sources on their own cadence), but a resolvable Flag Model entity + a bidirectional founder link is exactly the kind of corroboration that lifts "who/what is…" answers.
3. **Wikipedia stays downstream.** Per the playbook, a Wikipedia article is an *outcome* of independent coverage (Track B), not a first move — a self-written one gets deleted. These Wikidata items are the safe, now-doable half of the entity work.

## Open confirmations for James (don't apply until answered)
- ~~Inception date~~ — **settled: 2003 (Repario Ltd Inc), name "Be Legendary" from 2010, predecessor The Carter Group from 2000.**
- **Denver, CO** correct as the HQ city on the item?
- Confirm **Q140514540 is the right James Carter** before any edit (common name; other items exist).
