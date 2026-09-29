// A named preset commitment: a short memorable title, an optional one-line blurb
// shown under it, and the full "when I / instead of / I will" rep. The title and
// blurb are display-only; the `text` is what becomes the stored commitment and the
// daily reminder. When `blurb` is omitted the card shows the full `text`.
export type PresetChoice = { title: string; blurb?: string; text: string };

// Default lead-measure presets shown on the enrollment page.
// Overridable per campaign later; kept in one place so the API and UI agree.
export const PRESET_BEHAVIORS: string[] = [
  "Each day, say the risky thing I'd normally soften.",
  "Publicly back one person who took a real swing.",
  "Do one thing I'd do today if I couldn't look bad.",
];
