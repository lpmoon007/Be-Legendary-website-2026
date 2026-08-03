// Real client testimonials (single source of truth for both the visual
// Testimonials section and the Review JSON-LD). Verbatim quotes.
export interface Testimonial {
  quote: string;
  name: string;
  role: string; // title / organization
}

// Curated to executive-level proof only. The prior list mixed in
// team-building / workshop / charity-event quotes (China Syndrome, Team
// Shackles, the bicycle build, a shire-council facilitator guide) that
// mispositioned the advisory as an events vendor to a skeptical CEO — and
// turned into that many 5-star Review nodes about activities. Those live on
// buildingteams.com, where they fit. Additional named executive references
// are being gathered; add them here as they land.
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'James helped us turn seven groups of rivals into one leadership team. By the time US Holdings became Eagle Manufacturing Group and I moved from COO to CEO, we were no longer seven companies protecting our own territory — we were one company working toward the same outcome.',
    name: 'Ronn Page',
    role: 'former CEO, Eagle Manufacturing Group',
  },
  {
    quote:
      'This truly resonated and will have a lasting influence on us as we work to create a technology organization where the best and brightest choose to be.',
    name: 'Larry Quinlan',
    role: 'Global CIO, Deloitte',
  },
];
