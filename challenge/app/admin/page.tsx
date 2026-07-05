import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  recentAverage,
  currentStreak,
  scoreColor,
  type CheckinRow,
} from "@/lib/metrics";
import { localDateISO } from "@/lib/timezone";

export const dynamic = "force-dynamic";

interface UserRow {
  id: string;
  name: string;
  timezone: string;
  commitment: string;
  active: boolean;
}

export default async function RosterPage() {
  const supabase = createClient();

  const { data: users } = await supabase
    .from("users")
    .select("id, name, timezone, commitment, active")
    .order("created_at", { ascending: true });

  const roster = (users ?? []) as UserRow[];

  // Pull the last ~30 days of check-ins for everyone in one query.
  const since = new Date();
  since.setDate(since.getDate() - 31);
  const { data: allCheckins } = await supabase
    .from("checkins")
    .select("user_id, date, score, journal_entry")
    .gte("date", since.toISOString().slice(0, 10));

  const byUser = new Map<string, CheckinRow[]>();
  for (const c of (allCheckins ?? []) as (CheckinRow & { user_id: string })[]) {
    const list = byUser.get(c.user_id) ?? [];
    list.push(c);
    byUser.set(c.user_id, list);
  }

  const active = roster.filter((u) => u.active);
  const inactive = roster.filter((u) => !u.active);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-500 text-ink-light">Roster</h1>
          <p className="mt-1 text-sm text-ink-light/50">
            {active.length} active · {inactive.length} inactive
          </p>
        </div>
        <Link href="/admin/users/new" className="btn-cta !py-2.5">
          + Add user
        </Link>
      </div>

      {roster.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-3">
          {[...active, ...inactive].map((u) => {
            const checkins = byUser.get(u.id) ?? [];
            const today = localDateISO(u.timezone);
            const todays = checkins.find((c) => c.date === today);
            const avg7 = recentAverage(checkins, 7);
            const streak = currentStreak(checkins, today);
            return (
              <Link
                key={u.id}
                href={`/admin/users/${u.id}`}
                className={`surface flex flex-wrap items-center justify-between gap-4 bg-card-light px-5 py-4 shadow-card transition-transform hover:-translate-y-0.5 ${
                  u.active ? "" : "opacity-60"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-lg font-700 text-ink-heading">
                      {u.name}
                    </span>
                    {!u.active && (
                      <span className="pill bg-ink-muted/20 text-ink-muted">
                        inactive
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-ink-muted">
                    {u.commitment}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-center">
                  <Metric label="Today">
                    {todays?.score != null ? (
                      <span style={{ color: scoreColor(todays.score) }}>
                        {todays.score}
                      </span>
                    ) : (
                      <span className="text-ink-muted">pending</span>
                    )}
                  </Metric>
                  <Metric label="7-day avg">
                    {avg7 != null ? avg7.toFixed(1) : "—"}
                  </Metric>
                  <Metric label="Streak">{streak}🔥</Metric>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Metric({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-serif text-2xl font-500 text-ink-heading">
        {children}
      </div>
      <div className="text-xs uppercase tracking-wide text-ink-muted">
        {label}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="surface bg-card-light p-10 text-center shadow-card">
      <p className="font-serif text-xl text-ink-heading">No participants yet.</p>
      <p className="mt-2 text-ink-muted">
        Add your first client, or share the enrollment page.
      </p>
      <Link href="/admin/users/new" className="btn-cta mt-6">
        + Add user
      </Link>
    </div>
  );
}
