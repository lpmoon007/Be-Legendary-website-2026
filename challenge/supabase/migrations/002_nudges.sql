-- ============================================================================
-- Be Legendary — 30-Day Challenge : auto-nudge for silent participants
-- Run this AFTER 001_schema.sql (Supabase → SQL Editor → paste → Run).
--
-- due_nudges() returns active participants who should get a gentle re-engagement
-- text right now: they've gone >= 3 local days with no score, it's their local
-- noon, and they haven't already been nudged this silent streak. Same DST-safe
-- Postgres timezone approach as due_messages(). The scheduler (/api/send) sends
-- and logs the result.
-- ============================================================================
CREATE OR REPLACE FUNCTION due_nudges()
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
      users.created_at,
      (now() AT TIME ZONE users.timezone) AS local_ts
    FROM users
    WHERE users.active = true
  ),
  last_score AS (
    SELECT c.user_id, MAX(c.date) AS last_scored
    FROM checkins c
    WHERE c.score IS NOT NULL
    GROUP BY c.user_id
  )
  SELECT u.id, u.phone, u.name, u.timezone, (u.local_ts)::date
  FROM u
  LEFT JOIN last_score l ON l.user_id = u.id
  WHERE
    -- Fire in the local noon minute.
    (u.local_ts)::time >= time '12:00'
    AND (u.local_ts)::time <  time '12:01'
    -- Silent for >= 3 local days since the last score, or since enrollment if
    -- they've never scored. (The "streak anchor".)
    AND (u.local_ts)::date
        - COALESCE(l.last_scored, (u.created_at AT TIME ZONE u.timezone)::date) >= 3
    -- Once per streak: no nudge already sent after the streak anchor.
    AND NOT EXISTS (
      SELECT 1 FROM sms_log s
      WHERE s.user_id = u.id
        AND s.direction = 'outbound'
        AND s.body LIKE '%quiet days%'
        AND (s.sent_at AT TIME ZONE u.timezone)::date
            > COALESCE(l.last_scored, (u.created_at AT TIME ZONE u.timezone)::date)
    );
$$;

GRANT EXECUTE ON FUNCTION due_nudges() TO service_role;
