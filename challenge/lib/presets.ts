// A named preset commitment: a short memorable title + the full "when I / instead
// of / I will" rep it stands for. The title is display-only; the `text` is what
// becomes the stored commitment and the daily reminder.
export type PresetChoice = { title: string; text: string };

// Default lead-measure presets shown on the enrollment page.
// Overridable per campaign later; kept in one place so the API and UI agree.
export const PRESET_BEHAVIORS: string[] = [
  "Each day, say the risky thing I'd normally soften.",
  "Publicly back one person who took a real swing.",
  "Do one thing I'd do today if I couldn't look bad.",
];
