// Pure metric helpers shared by the admin roster and user-detail views.

export interface CheckinRow {
  date: string; // YYYY-MM-DD
  score: number | null;
  journal_entry: string | null;
  journal_received_at?: string | null; // set even for private users (content isn't)
}

/** Score band → semantic color key. 1–4 low, 5–7 mid, 8–10 high. */
export function scoreBand(score: number): "low" | "mid" | "high" {
  if (score <= 4) return "low";
  if (score <= 7) return "mid";
  return "high";
}

export function scoreColor(score: number): string {
  const band = scoreBand(score);
  if (band === "low") return "#C04A26"; // accent (red-orange)
  if (band === "mid") return "#C9A227"; // muted yellow
  return "#4F7A46"; // green
}

/** Average of the most recent `days` scored check-ins. Null if none. */
export function recentAverage(checkins: CheckinRow[], days: number): number | null {
  const scored = checkins
    .filter((c) => c.score != null)
    .sort((a, b) => (a.date < b.date ? 1 : -1)) // newest first
    .slice(0, days);
  if (scored.length === 0) return null;
  const sum = scored.reduce((acc, c) => acc + (c.score as number), 0);
  return Math.round((sum / scored.length) * 10) / 10;
}

/**
 * Consecutive-day streak of scored check-ins ending today or yesterday.
 * `todayISO` is the reference "today" (caller passes the coach/user local date).
 */
export function currentStreak(checkins: CheckinRow[], todayISO: string): number {
  const scored = new Set(
    checkins.filter((c) => c.score != null).map((c) => c.date)
  );
  if (scored.size === 0) return 0;

  const cursor = new Date(`${todayISO}T00:00:00Z`);
  // Allow the streak to "start" at yesterday if today hasn't been scored yet.
  if (!scored.has(iso(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!scored.has(iso(cursor))) return 0;
  }

  let streak = 0;
  while (scored.has(iso(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

/**
 * Whole local days a participant has been silent, measured from their last
 * scored check-in — or from `enrolledISO` if they've never scored. Used for the
 * "at risk" roster flag and mirrors the auto-nudge threshold.
 */
export function daysSilent(
  checkins: CheckinRow[],
  todayISO: string,
  enrolledISO: string
): number {
  const scored = checkins
    .filter((c) => c.score != null)
    .map((c) => c.date)
    .sort();
  const anchor = scored.length ? scored[scored.length - 1] : enrolledISO;
  const diff =
    (Date.parse(`${todayISO}T00:00:00Z`) - Date.parse(`${anchor}T00:00:00Z`)) /
    86_400_000;
  return Math.max(0, Math.round(diff));
}

/**
 * Journaling rate = share of scored check-ins that also included a reflection
 * (0–100). Uses `journal_received_at` so it works for private users too (their
 * reflection content isn't stored, but the fact that they reflected is).
 * Actionable 2025: journaling frequency predicts behavior change.
 */
export function journalingRate(checkins: CheckinRow[]): number | null {
  const scored = checkins.filter((c) => c.score != null);
  if (scored.length === 0) return null;
  const journaled = scored.filter(
    (c) => c.journal_received_at != null || (c.journal_entry ?? "") !== ""
  ).length;
  return Math.round((journaled / scored.length) * 100);
}

/** Whole days since enrollment (day of enrollment = 0). */
export function daysSinceEnroll(enrolledISO: string, todayISO: string): number {
  const diff =
    (Date.parse(`${todayISO}T00:00:00Z`) -
      Date.parse(`${enrolledISO}T00:00:00Z`)) /
    86_400_000;
  return Math.max(0, Math.round(diff));
}

/** Is the participant still in their fragile first 7 days? (Actionable Factor #2) */
export function isWeekOne(enrolledISO: string, todayISO: string): boolean {
  return daysSinceEnroll(enrolledISO, todayISO) <= 6;
}

/** Count of scored check-ins within the first 7 days of enrollment. */
export function weekOneCheckins(
  checkins: CheckinRow[],
  enrolledISO: string
): number {
  const start = Date.parse(`${enrolledISO}T00:00:00Z`);
  const end = start + 7 * 86_400_000;
  return checkins.filter(
    (c) =>
      c.score != null &&
      Date.parse(`${c.date}T00:00:00Z`) >= start &&
      Date.parse(`${c.date}T00:00:00Z`) < end
  ).length;
}

/** Consistency = share of the last `windowDays` days with a check-in (0–100). */
export function consistencyPct(
  checkins: CheckinRow[],
  windowDays = 30
): number {
  const scoredDays = checkins.filter((c) => c.score != null).length;
  return Math.round((Math.min(scoredDays, windowDays) / windowDays) * 100);
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
