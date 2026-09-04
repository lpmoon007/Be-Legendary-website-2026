// Partner / cohort registry — a "skin" of the challenge for a specific client
// event (a summit, a workshop, a cohort). Each entry drives a branded landing
// page at /<slug> that reuses the exact same enrollment engine, seeded with that
// partner's own three lead-measure commitments and an attribution tag.
//
// To add a partner: add an entry here (and, optionally, drop a logo in
// public/partners/<slug>.svg|png and set `logo`). No other code changes needed —
// the /<slug> route and its metadata are generated from this map.

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
   * The three lead-measure commitments offered on this page, in the habit-science
   * format: "When I ___, instead of ___, I will ___." Participants pick one or
   * write their own. Swap these when the client finalizes their summit-aligned set.
   */
  presets: string[];
}

export const PARTNERS: Record<string, Partner> = {
  ledgebrook: {
    slug: "ledgebrook",
    name: "Ledgebrook",
    event: "Ledgebrook People Leadership Summit",
    // logo: "/partners/ledgebrook.svg", // drop the file in public/partners/ and uncomment
    headline: "The summit ends.",
    headlineAccent: "The habit begins.",
    intro:
      "You spent these days becoming a stronger leader of people. Now pick one thing to carry forward — a single small rep — and for the next thirty days we hold you to it by text. A morning nudge, an afternoon check-in, and a line on how it went. No app to download.",
    source: "ledgebrook",
    // Summit-aligned SAMPLES (swap for Bre's finalized three). People-leadership
    // reps in the "when / instead of / I will" format.
    presets: [
      "When I start a conversation with someone on my team, instead of half-listening while I plan my reply, I will put down what I'm doing and hear them out fully before I respond.",
      "When I notice someone doing good work, instead of moving on without a word, I will tell them specifically what I saw and why it mattered.",
      "When someone brings me a problem, instead of jumping in with the answer, I will ask one question that helps them find their own next step.",
    ],
  },
};

export function getPartner(slug: string): Partner | null {
  return PARTNERS[slug] ?? null;
}
