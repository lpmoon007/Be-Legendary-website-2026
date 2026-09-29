import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  recentAverage,
  currentStreak,
  daysSilent,
  isWeekOne,
  weekOneCheckins,
  scoreColor,
  type CheckinRow,
} from "@/lib/metrics";
import { localDateISO } from "@/lib/timezone";
import { cohortLabel } from "@/lib/partners";

export const dynamic = "force-dynamic";

// Silent for this many local days → flagged "at risk" (matches the nudge threshold).
const AT_RISK_DAYS = 3;
// Week 1 is fragile and predictive (Actionable 2025 Factor #2), so flag silence
// faster during a participant's first 7 days.
const WEEK1_AT_RISK_DAYS = 2;

interface UserRow {
  id: string;
  name: string;
  timezone: string;
  commitment: string;
  active: boolean;
  is_private: boolean;
  created_at: string;
  source: string | null;
}

export default async function RosterPage({
  searchParams,
}: {
  searchParams: { cohort?: string };
}) {
  const supabase = createClient();

  const { data: users } = await supabase
    .from("users")
    .select("id, name, timezone, commitment, active, is_private, created_at, source")
    .order("created_at", { ascending: true });

  const allUsers = (users ?? []) as UserRow[];

  // Distinct cohorts present (for the filter chips), and the active filter.
  const cohorts = [...new Set(allUsers.map((u) => u.source).filter(Boolean))]
    .sort() as string[];
  const activeCohort =
    searchParams.cohort && cohorts.includes(searchParams.cohort)
      ? searchParams.cohort
      : null;
  const roster = activeCohort
    ? allUsers.filter((u) => u.source === activeCohort)
    : allUsers;

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

  const enrolledISOFor = (u: UserRow) =>
    localDateISO(u.timezone, new Date(u.created_at));
  const silentDaysFor = (u: UserRow) =>
    daysSilent(byUser.get(u.id) ?? [], localDateISO(u.timezone), enrolledISOFor(u));
  // Tighter threshold during week 1.
  const riskThreshold = (u: UserRow) =>
    isWeekOne(enrolledISOFor(u), localDateISO(u.timezone))
      ? WEEK1_AT_RISK_DAYS
      : AT_RISK_DAYS;
  const atRiskCount = active.filter(
    (u) => silentDaysFor(u) >= riskThreshold(u)
  ).length;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-500 text-ink-light">Roster</h1>
          <p className="mt-1 text-sm text-ink-light/50">
            {active.length} active · {inactive.length} inactive
            {atRiskCount > 0 && (
              <span className="text-accent-light"> · {atRiskCount} at risk</span>
            )}
          </p>
        </div>
        <Link href="/admin/users/new" className="btn-cta !py-2.5">
          + Add user
        </Link>
      </div>

      {cohorts.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs uppercase tracking-wide text-ink-light/40">
            Cohort
          </span>
          <CohortChip href="/admin" label="All" active={!activeCohort} />
          {cohorts.map((c) => (
            <CohortChip
              key={c}
              href={`/admin?cohort=${encodeURIComponent(c)}`}
              label={cohortLabel(c) ?? c}
              active={activeCohort === c}
            />
          ))}
        </div>
      )}

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
            const silent = silentDaysFor(u);
            const enrolledISO = enrolledISOFor(u);
            const weekOne = u.active && isWeekOne(enrolledISO, today);
            const w1Count = weekOne ? weekOneCheckins(checkins, enrolledISO) : 0;
            const atRisk = u.active && silent >= riskThreshold(u);
            return (
              <Link
                key={u.id}
                href={`/admin/users/${u.id}`}
                className={`surface flex min-w-0 flex-wrap items-center justify-between gap-4 bg-card-light px-5 py-4 shadow-card transition-transform hover:-translate-y-0.5 ${
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
                    {atRisk && (
                      <span className="pill bg-accent/15 text-accent">
                        ⚠ {silent} days silent
                      </span>
                    )}
                    {weekOne && !atRisk && (
                      <span className="pill bg-accent-light/15 text-accent-light">
                        Week 1 · {w1Count} check-in{w1Count === 1 ? "" : "s"}
                      </span>
                    )}
                    {u.source && (
                      <span className="pill border border-ink-muted/40 text-ink-muted">
                        {cohortLabel(u.source)}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-ink-muted">
                    {u.is_private ? "🔒 Private commitment" : u.commitment}
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

function CohortChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`pill border transition-colors ${
        active
          ? "border-accent-light bg-accent-light/15 text-accent-light"
          : "border-ink-light/20 text-ink-light/60 hover:text-ink-light"
      }`}
    >
      {label}
    </Link>
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
