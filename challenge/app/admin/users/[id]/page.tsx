import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScoreChart, type ChartPoint } from "./ScoreChart";
import { CommitmentEditor, ActiveToggle } from "./UserControls";
import {
  recentAverage,
  currentStreak,
  consistencyPct,
  scoreColor,
  type CheckinRow,
} from "@/lib/metrics";
import { localDateISO } from "@/lib/timezone";

export const dynamic = "force-dynamic";

interface UserDetail {
  id: string;
  name: string;
  phone: string;
  timezone: string;
  commitment: string;
  morning_time: string;
  afternoon_time: string;
  active: boolean;
}

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: user } = await supabase
    .from("users")
    .select(
      "id, name, phone, timezone, commitment, morning_time, afternoon_time, active"
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!user) notFound();
  const u = user as UserDetail;

  const { data: checkinData } = await supabase
    .from("checkins")
    .select("date, score, journal_entry")
    .eq("user_id", u.id)
    .order("date", { ascending: false });

  const checkins = (checkinData ?? []) as CheckinRow[];
  const today = localDateISO(u.timezone);

  // Build a continuous 30-day series (missed days → null) for the chart.
  const series = build30DaySeries(checkins, today);

  const avg7 = recentAverage(checkins, 7);
  const streak = currentStreak(checkins, today);
  const consistency = consistencyPct(checkins, 30);

  return (
    <div>
      <Link href="/admin" className="text-sm text-ink-light/60 hover:text-ink-light">
        ← Back to roster
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-500 text-ink-light">{u.name}</h1>
        <ActiveToggle userId={u.id} active={u.active} />
      </div>

      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-light/50">
        <span>{u.phone}</span>
        <span>{u.timezone}</span>
        <span>
          Sends {u.morning_time.slice(0, 5)} · {u.afternoon_time.slice(0, 5)}
        </span>
      </div>

      {/* Commitment (inline editable) */}
      <div className="surface mt-6 bg-card-light p-5 shadow-card">
        <span className="text-xs font-700 uppercase tracking-wide text-ink-muted">
          Lead measure
        </span>
        <div className="mt-2">
          <CommitmentEditor userId={u.id} initial={u.commitment} />
        </div>
      </div>

      {/* Metric strip */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <StatTile label="7-day avg" value={avg7 != null ? avg7.toFixed(1) : "—"} />
        <StatTile label="Streak" value={`${streak}🔥`} />
        <StatTile label="Consistency" value={`${consistency}%`} />
      </div>

      {/* Chart */}
      <div className="surface mt-4 bg-card-light p-5 shadow-card">
        <span className="text-xs font-700 uppercase tracking-wide text-ink-muted">
          Last 30 days
        </span>
        <div className="mt-3">
          <ScoreChart data={series} />
        </div>
      </div>

      {/* History table */}
      <div className="surface mt-4 overflow-hidden bg-card-light shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-muted/10 text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-5 py-3 font-600">Date</th>
              <th className="px-5 py-3 font-600">Score</th>
              <th className="px-5 py-3 font-600">Journal entry</th>
            </tr>
          </thead>
          <tbody>
            {checkins.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-6 text-center text-ink-muted">
                  No check-ins yet.
                </td>
              </tr>
            ) : (
              checkins.map((c) => (
                <tr key={c.date} className="border-t border-ink-muted/10">
                  <td className="whitespace-nowrap px-5 py-3 text-ink-body">
                    {c.date}
                  </td>
                  <td className="px-5 py-3 font-700">
                    {c.score != null ? (
                      <span style={{ color: scoreColor(c.score) }}>
                        {c.score}
                      </span>
                    ) : (
                      <span className="text-ink-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink-body/80">
                    {c.journal_entry || (
                      <span className="text-ink-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface bg-card-light p-4 text-center shadow-card">
      <div className="font-serif text-3xl font-500 text-ink-heading">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
        {label}
      </div>
    </div>
  );
}

// 30 continuous days ending today, missed days as null so the line shows gaps.
function build30DaySeries(checkins: CheckinRow[], todayISO: string): ChartPoint[] {
  const map = new Map(checkins.map((c) => [c.date, c.score]));
  const out: ChartPoint[] = [];
  const cursor = new Date(`${todayISO}T00:00:00Z`);
  cursor.setUTCDate(cursor.getUTCDate() - 29);
  for (let i = 0; i < 30; i++) {
    const iso = cursor.toISOString().slice(0, 10);
    const [, m, d] = iso.split("-");
    out.push({
      date: iso,
      label: `${parseInt(m, 10)}/${parseInt(d, 10)}`,
      score: map.get(iso) ?? null,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}
