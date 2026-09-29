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
        text: "When I pour my first coffee, instead of putting off a conversation that feels uncomfortable, I will take one step toward addressing it directly, with clarity, curiosity, and care.",
      },
    ],
  },

  microsoft: {
    slug: "microsoft",
    name: "Microsoft",
    event: "Microsoft Strategy and Operations",
    // Logo drawn inline (four-color squares + wordmark) via the header lockup —
    // see components/partners/MicrosoftMark.tsx.
    headline: "The meeting ends.",
    headlineAccent: "The challenge begins.",
    intro:
      "Pick one leader's move to carry out of today's session. For the next thirty, we hold you to it by text — one nudge, one check-in, one line on how it went.",
    source: "microsoft",
    // Month-of-Giving commitments — title + landing blurb shown on the card; the
    // behaviorally-strong "when / instead of / I will" habit version is stored and
    // texted as the daily rep.
    presets: [
      {
        title: "Make a Difference",
        blurb: "Do one intentional thing each day that helps someone else.",
        text: "When I sit down at my desk to start the day, instead of diving into my own to-do list, I will do one small thing that helps someone else first.",
      },
      {
        title: "Show Gratitude",
        blurb: "Recognize one person each day for the difference they made.",
        text: "When I finish my workday, instead of immediately closing my laptop, I will send one message of specific gratitude.",
      },
      {
        title: "Create the Ripple",
        blurb:
          "Make one conscious choice each day that creates a positive effect beyond yourself — the tone of a reply-all, who gets the credit, how you frame a hard “no.”",
        text: "When I open my calendar for the day, instead of just scanning what's next, I will pick one decision ahead of me and choose the option that creates the best ripple for the people it touches.",
      },
    ],
  },

  mckesson: {
    slug: "mckesson",
    name: "McKesson",
    event: "McKesson Peak Performance",
    // Logo rendered as a wordmark lockup in the header (see PARTNER_MARKS in the
    // cohort page); swap for the official asset via `logo` when available.
    headline: "The bikes are built.",
    headlineAccent: "The challenge begins.",
    intro:
      "You left it a little better than you found it today. Now carry that forward — pick one small move and for the next thirty days we hold you to it by text: one nudge, one check-in, one line on how it went.",
    source: "mckesson",
    // Commitments anchored to an existing daily habit (habit-stacking) — the
    // "when I <existing habit>, instead of <default>, I will <small action>"
    // structure. No blurb, so the card shows the full anchored sentence.
    presets: [
      {
        title: "No One Wins Alone",
        text: "When I pour my first coffee, instead of scrolling my phone, I will send one message crediting someone whose behind-the-scenes work helped make a recent win happen.",
      },
      {
        title: "Leave It Better",
        text: "When I open my email in the morning, instead of starting with what I need, I will begin with one message that leaves someone better than I found them — a thank-you, an answer they're waiting on, or an intro.",
      },
      {
        title: "See What You'd Miss",
        text: "When I sit down for lunch, instead of reaching for my phone, I will look up and name one person or one thing I'd normally overlook.",
      },
    ],
  },
};

export function getPartner(slug: string): Partner | null {
  return PARTNERS[slug] ?? null;
}

// Friendly display label for a user's `source` (cohort) tag, shown in the admin.
// Prefers a partner's name; falls back to a small map for non-partner sources,
// then a capitalized version of the raw tag.
const SOURCE_LABELS: Record<string, string> = {
  lfs: "TeamLFS",
  workout: "Mindset Workout",
};
export function cohortLabel(source: string | null | undefined): string | null {
  if (!source) return null;
  return (
    PARTNERS[source]?.name ??
    SOURCE_LABELS[source] ??
    source.charAt(0).toUpperCase() + source.slice(1)
  );
}
