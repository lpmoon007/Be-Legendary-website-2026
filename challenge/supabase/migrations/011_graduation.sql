-- ============================================================================
-- 011 — Day-30 graduation (the challenge actually ends).
--
-- Until now the scheduler sent morning/afternoon texts to any active user with
-- no end date, so "Your 30-Day Challenge" ran forever. This migration makes day
-- 30 a hard finish, counting from the ENROLLMENT date (users.created_at), in the
-- participant's own timezone:
--
--   1. due_messages() is capped so morning/afternoon nudges only go out on days
--      1–30 (local_date < enroll_date + 30). This is the hard guarantee — no
--      daily text ever lands after day 30, regardless of the active flag.
--   2. due_graduations() finds anyone who has completed 30 days and is still
--      active, at their morning send time, so /api/send can text them one closing
--      message and set them inactive.
--
-- Run in Supabase → SQL Editor, after 010.
-- ============================================================================

-- ── 1. Cap the daily sends at 30 days (from enrollment) ─────────────────────
DROP FUNCTION IF EXISTS due_messages();
CREATE FUNCTION due_messages()
RETURNS TABLE (
  user_id      uuid,
  phone        text,
  name         text,
  commitment   text,
  timezone     text,
  is_private   boolean,
  message_type text,   -- 'morning' | 'afternoon'
  local_date   date
)
LANGUAGE sql
STABLE
AS $$
  WITH u AS (
    SELECT
      users.id,
      users.phone,
      users.name,
      users.commitment,
      users.timezone,
      users.is_private,
      users.morning_time,
      users.afternoon_time,
      (users.created_at AT TIME ZONE users.timezone)::date AS enroll_date,
      (now() AT TIME ZONE users.timezone) AS local_ts
    FROM users
    WHERE users.active = true
  )
  SELECT u.id, u.phone, u.name, u.commitment, u.timezone, u.is_private,
         'morning'::text, (u.local_ts)::date
  FROM u
  WHERE (u.local_ts)::time >= u.morning_time
    AND (u.local_ts)::time <  u.morning_time + interval '1 minute'
    AND (u.local_ts)::date  <  u.enroll_date + 30   -- days 1–30 only
    AND NOT EXISTS (
      SELECT 1 FROM sms_log s
      WHERE s.user_id = u.id
        AND s.direction = 'outbound'
        AND s.body LIKE 'Morning.%'
        AND (s.sent_at AT TIME ZONE u.timezone)::date = (u.local_ts)::date
    )
  UNION ALL
  SELECT u.id, u.phone, u.name, u.commitment, u.timezone, u.is_private,
         'afternoon'::text, (u.local_ts)::date
  FROM u
  WHERE (u.local_ts)::time >= u.afternoon_time
    AND (u.local_ts)::time <  u.afternoon_time + interval '1 minute'
    AND (u.local_ts)::date  <  u.enroll_date + 30   -- days 1–30 only
    AND NOT EXISTS (
      SELECT 1 FROM sms_log s
      WHERE s.user_id = u.id
        AND s.direction = 'outbound'
        AND (s.body LIKE 'Check-in%' OR s.body LIKE 'It''s 4 p.m.%')
        AND (s.sent_at AT TIME ZONE u.timezone)::date = (u.local_ts)::date
    );
$$;

GRANT EXECUTE ON FUNCTION due_messages() TO service_role;

-- ── 2. Who has finished their 30 days and still needs the closing text ──────
-- Fires at the participant's morning send time on day 31+ (30 full days done).
-- Deduped on the "You did it" prefix so a failed deactivate never re-sends.
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
    );
$$;

GRANT EXECUTE ON FUNCTION due_graduations() TO service_role;
