// Pure metric helpers shared by the admin roster and user-detail views.

export interface CheckinRow {
  date: string; // YYYY-MM-DD
  score: number | null;
  journal_entry: string | null;
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
