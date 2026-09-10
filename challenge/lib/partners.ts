// Partner / cohort registry — a "skin" of the challenge for a specific client
// event (a summit, a workshop, a cohort). Each entry drives a branded landing
// page at /<slug> that reuses the exact same enrollment engine, seeded with that
// partner's own three lead-measure commitments and an attribution tag.
//
// To add a partner: add an entry here (and, optionally, drop a logo in
// public/partners/<slug>.svg|png and set `logo`). No other code changes needed —
// the /<slug> route and its metadata are generated from this map.

import type { PresetChoice } from "@/lib/presets";

export interface Partner {
  slug: string;
  /** Client name, e.g. "Ledgebrook". Used for the wordmark when no logo is set. */
  name: string;
  /** Event name shown as the page eyebrow, e.g. "Ledgebrook People Leadership Summit". */
  event: string;
  /** Optional logo at /partners/<slug>.svg|png. Falls back to a serif wordmark of `name`. */
  logo?: string;
  /** Hero headline — plain lead-in. */
  headline: string;
  /** Hero headline — the emphasized (italic accent) close. */
  headlineAccent: string;
  /** Hero paragraph. */
  intro: string;
  /** Attribution tag stored on each enrollment from this page (users.source). */
  source: string;
  /**
   * The lead-measure commitments offered on this page, each in the habit-science
   * format "When I ___, instead of ___, I will ___." A plain string is shown as-is;
   * a { title, text } gives the card a short memorable name over the full rep.
   * Participants pick one or write their own.
   */
  presets: (string | PresetChoice)[];
}

export const PARTNERS: Record<string, Partner> = {
  ledgebrook: {
    slug: "ledgebrook",
    name: "Ledgebrook",
    event: "Ledgebrook People Leadership Summit",
    // Logo drawn inline (blue waves + wordmark) via the header lockup — see
    // components/partners/LedgebrookMark.tsx.
    headline: "The summit ends.",
    headlineAccent: "The habit begins.",
    intro:
      "Pick one leader's move to carry out of these two days. For the next thirty, we hold you to it by text — one nudge, one check-in, one line on how it went.",
    source: "ledgebrook",
    // The three finalized summit commitments, in the "when / instead of / I will" format.
    presets: [
      {
        title: "Turn the wrench on someone else first",
        text: "When I open my laptop to start work, instead of starting on my own list, I will send one message that hands something to a person on my team — a decision they can make, a task they can own, or a question instead of my answer.",
      },
      {
        title: "Name the turn you saw",
        text: "When I close my laptop at the end of the day, instead of just shutting it, I will send one message to someone naming the specific thing they did today that made the difference.",
      },
      {
        title: "Say it without the cushion",
        text: "When I pour my first coffee, instead of easing into the day, I will send the one message I've been softening because the person used to be my peer.",
      },
    ],
  },
};

export function getPartner(slug: string): Partner | null {
  return PARTNERS[slug] ?? null;
}
