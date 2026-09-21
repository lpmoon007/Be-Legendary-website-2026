-- ============================================================================
-- 012 — Scope the graduation guard to the current enrollment.
--
-- due_graduations() (migration 011) deduped on a lifetime "You did it" message,
-- so a participant who finished once could never graduate again. When someone
-- re-enrolls, /api/enroll now restarts their 30-day clock (resets created_at), so
-- the guard must only count graduation texts sent on/after that new enrollment
-- date — otherwise the old closing text would block their fresh run's finish and
-- the challenge would run forever again.
--
-- Run in Supabase → SQL Editor, after 011.
-- ============================================================================

CREATE OR REPLACE FUNCTION due_graduations()
RETURNS TABLE (
  user_id    uuid,
  phone      text,
  name       text,
  timezone   text,
  local_date date
)
LANGUAGE sql
STABLE
AS $$
  WITH u AS (
    SELECT
      users.id,
      users.phone,
      users.name,
      users.timezone,
      users.morning_time,
      (users.created_at AT TIME ZONE users.timezone)::date AS enroll_date,
      (now() AT TIME ZONE users.timezone) AS local_ts
    FROM users
    WHERE users.active = true
  )
  SELECT u.id, u.phone, u.name, u.timezone, (u.local_ts)::date
  FROM u
  WHERE (u.local_ts)::date >= u.enroll_date + 30      -- 30 full days completed
    AND (u.local_ts)::time >= u.morning_time
    AND (u.local_ts)::time <  u.morning_time + interval '1 minute'
    AND NOT EXISTS (
      SELECT 1 FROM sms_log s
      WHERE s.user_id = u.id
        AND s.direction = 'outbound'
        AND s.body LIKE 'You did it%'
        -- Only this run's closing text counts (a prior run's is before enroll_date).
        AND (s.sent_at AT TIME ZONE u.timezone)::date >= u.enroll_date
    );
$$;

GRANT EXECUTE ON FUNCTION due_graduations() TO service_role;
