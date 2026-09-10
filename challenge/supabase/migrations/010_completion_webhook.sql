-- ============================================================================
-- 010 — Completion webhook support.
--
-- When a participant who arrived via a deep link (migration 009 — they carry a
-- `source` + opaque `source_ref`) finishes their 30 days, we round-trip a small
-- results summary back to the originating system (e.g. TeamLFS, keyed on `ref`).
--
-- This migration adds the "fired once" marker and the `due_completions()` query
-- that decides who has finished and computes the summary in SQL. The actual HTTP
-- POST is done by /api/send, and only when the webhook env vars are configured —
-- so this is inert until then.
-- Run in Supabase → SQL Editor, after 009.
-- ============================================================================

-- Set once, when we've successfully notified the source. NULL = not yet fired.
ALTER TABLE users ADD COLUMN IF NOT EXISTS completion_notified_at timestamptz;

-- Small partial index: the scheduler only ever scans un-notified deep-link users.
CREATE INDEX IF NOT EXISTS idx_users_pending_completion
  ON users (created_at)
  WHERE source_ref IS NOT NULL AND completion_notified_at IS NULL;

-- ============================================================================
-- due_completions() — participants who have finished their 30 days and still
-- need their results sent back to the source.
--
-- "Finished" = 30 local days have elapsed since enrollment (day 1 = enroll date,
-- day 30 = enroll_date + 29; we fire once day 31 begins, i.e. local_date is at
-- least enroll_date + 30). Timezone-safe, like due_messages(): we compare LOCAL
-- dates via `AT TIME ZONE users.timezone`.
--
-- Summary computed in SQL:
--   days_logged — check-ins with a score over the whole challenge
--   week1_avg   — avg score, days 1–7   (enroll_date       .. enroll_date + 6)
--   week4_avg   — avg score, days 22–28 (enroll_date + 21   .. enroll_date + 27)
--
-- Only deep-link users (source_ref IS NOT NULL) that haven't been notified yet
-- are considered. The caller (/api/send) further filters by the channel its
-- configured webhook serves, POSTs, and stamps completion_notified_at on success.
-- ============================================================================
CREATE OR REPLACE FUNCTION due_completions()
RETURNS TABLE (
  user_id     uuid,
  source      text,
  source_ref  text,
  days_logged integer,
  week1_avg   numeric,
  week4_avg   numeric
)
LANGUAGE sql
STABLE
AS $$
  WITH u AS (
    SELECT
      users.id,
      users.source,
      users.source_ref,
      (users.created_at AT TIME ZONE users.timezone)::date AS enroll_date,
      (now()            AT TIME ZONE users.timezone)::date AS local_date
    FROM users
    WHERE users.source_ref IS NOT NULL
      AND users.completion_notified_at IS NULL
  )
  SELECT
    u.id,
    u.source,
    u.source_ref,
    COALESCE(c.days_logged, 0)::integer,
    c.week1_avg,
    c.week4_avg
  FROM u
  LEFT JOIN LATERAL (
    SELECT
      count(*) FILTER (WHERE ch.score IS NOT NULL)                 AS days_logged,
      round(avg(ch.score) FILTER (
        WHERE ch.date >= u.enroll_date
          AND ch.date <  u.enroll_date + 7), 2)                    AS week1_avg,
      round(avg(ch.score) FILTER (
        WHERE ch.date >= u.enroll_date + 21
          AND ch.date <  u.enroll_date + 28), 2)                   AS week4_avg
    FROM checkins ch
    WHERE ch.user_id = u.id
  ) c ON true
  WHERE u.local_date >= u.enroll_date + 30;  -- 30 local days elapsed
$$;

GRANT EXECUTE ON FUNCTION due_completions() TO service_role;
