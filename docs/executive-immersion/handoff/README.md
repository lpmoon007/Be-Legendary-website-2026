# Executive Immersion — Handoff Notes

Four pages, built to be handed to Claude Code for implementation.

**Domain: `belegendary.org`.** All canonicals, breadcrumbs and structured data on these four pages already point there. (Note: older archived files elsewhere in the project reference `buildingteams.com` — a legacy domain. Nothing in this set uses it.)

| Page | File | Purpose |
|---|---|---|
| Hub | `Be Legendary - Executive Immersion.dc.html` | The argument, method, pricing, CTA. Entry point. |
| Expedition | `Be Legendary - One Crazy Day Expedition.dc.html` | Sedona → Grand Canyon narrative + 16 problems |
| City | `Be Legendary - One Crazy Day City.dc.html` | New York narrative + 8-stage arc + safeguards |
| Systems | `Be Legendary - One Crazy Day Systems.dc.html` | Reno narrative + 9 patterns + 15 conditions |

Suggested URLs:

- `https://www.belegendary.org/teams/executive-immersion/`
- `https://www.belegendary.org/teams/executive-immersion/expedition/`
- `https://www.belegendary.org/teams/executive-immersion/city/`
- `https://www.belegendary.org/teams/executive-immersion/systems/`

Canonicals are already set to these exact URLs.

Shared dependencies to ship alongside: `support.js`, `assets/snail-maroon.png`, `assets/snail-cream.png`, `assets/favicon-snail.png`. Fonts load from Google Fonts (Newsreader, Hanken Grotesk).

---

## 1. Open — needs James

**Investment figure.** Currently **$35,000** minimum, shown on the hub only. Set as a tweakable value (`minimumFee`), so it changes in one place.

**Format naming.** Reno is currently published as **One Crazy Day: Systems**. Under consideration. Alternatives: The Handoff, Ownership, or absorbing it as a second City example.

**Photography.** 17 labelled slots across the four pages, each stating what belongs in it. Priority three: the desert table (Sedona), the rotating kitchen (Reno), the hammock or survival structures (Everglades).

**Proof.** Only "250+ days run" is used. No client names, quotes, or outcome figures — none available yet. One anonymous quote per format ("CEO, industrial manufacturer") would be the highest-value addition when available.

---

## 2. Unanswered questions to add to the FAQ

The hub answers four: weather/flight failure, whether the CEO can participate, how it connects to business goals, and what stops it evaporating. These six are known asks and are **not yet answered anywhere**:

1. **Lead time** — how long from signed to delivered?
2. **Group size** — minimum and maximum, and what changes at each end?
3. **Physical ability and accessibility** — how is a day designed so nobody is excluded or exposed?
4. **Insurance and liability** — carriers, limits, who holds what, what the client's risk team receives.
5. **Multi-language and international groups** — translation, cultural adaptation, jurisdiction.
6. **Budget approval** — what the client submits to procurement when there is no vendor category for this.

Each should follow the existing FAQ pattern: the question in the buyer's own words, answered plainly enough to forward without editing.

---

## 3. Site integration (not yet done)

Nothing currently links to these pages — they are orphans.

- Add **Executive Immersion** to the For Teams navigation.
- Cross-link from `Be Legendary - Team Retreats.dc.html` and `Be Legendary - Retreat Formats.dc.html` (a retreat is multi-day and breathing; an immersion is one engineered day — the pages should point at each other and explain the difference).
- Footer link groups on all four pages currently list Retreats / Formats / Destinations / Case Studies only.

---

## 4. In development — named on the hub, no pages behind them

Listed as chips in the platform section, taken from the source material: Innovation, Crisis, Customer, Legacy, Reinvention, The Merger, The City Never Sleeps. Each is a future format, not an existing example. Remove any that are not real intentions.

---

## 5. Editorial decisions already made

- **Naming:** Executive Immersion is the category; One Crazy Day is the format inside it. Both appear throughout.
- **Audience:** written for the chief of staff or EA who has to find, book and defend the day.
- **Intensity:** "one day, engineered end to end" — the full scale is revealed on the call, not the page.
- **Off-the-shelf pieces:** described by effect rather than activity in the hub's "instruments" section. Named activities (Shelter Box, Ronald McDonald House) do appear inside the specific case narratives. Deliberate.
- **The Game (1997):** referenced on the hub as buyer shorthand, immediately qualified — in the film nobody consents; here the team knows the day is designed and nobody is endangered or deceived.
- **Safeguards:** nine-item list lives in full on the City page; the hub carries a condensed version linking to it.
- **Convictions:** four universal ones on the hub. Two conditional ones ("they are not yet a team", "diversity is visible, inclusion is the work") sit on the City page as design notes with their conditions stated.

---

## 6. Technical notes

- Every page is a self-contained Design Component; the only shared dependency is `support.js`.
- Type: Newsreader (serif display) + Hanken Grotesk (UI/body). Palette: `#64010a` maroon, `#C04A26` rust, `#EFE9DD` / `#F6F1E7` creams, `#2A0507` near-black, `#3A0A0C` body text.
- All styling is inline. No stylesheets, no CSS classes.
- The expedition page's 16 problems are a 4-cluster tab component; the tab state lives in the logic class.
- CTA on all four pages points to `https://meetings-na2.hubspot.com/jcarter28` — confirm this is the right calendar for immersion enquiries.
- Structured data: `Service` + `BreadcrumbList` JSON-LD on the hub.
