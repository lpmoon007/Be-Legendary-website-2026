-- ============================================================================
-- 006 — Configurable afternoon check-in time
--
-- The afternoon check-in used to be fixed at 4 p.m., and its message began with
-- "It's 4 p.m." — which the due_messages() duplicate guard matched on. Now that
-- participants choose their own check-in time (users.afternoon_time), the copy is
-- time-neutral ("Check-in — …"), so the guard must key on the new prefix.
--
-- This migration only redefines due_messages(); the afternoon_time column has
-- existed since 001. The afternoon guard matches BOTH the new "Check-in" prefix
-- and the legacy "It's 4 p.m." prefix, so it's safe to run before or after the
-- app deploy — no participant gets a duplicate on the transition day.
--
-- Run in Supabase → SQL Editor (or `supabase db push`), after 005.
-- ============================================================================

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
      (now() AT TIME ZONE users.timezone) AS local_ts
    FROM users
    WHERE users.active = true
  )
  SELECT u.id, u.phone, u.name, u.commitment, u.timezone, u.is_private,
         'morning'::text, (u.local_ts)::date
  FROM u
  WHERE (u.local_ts)::time >= u.morning_time
    AND (u.local_ts)::time <  u.morning_time + interval '1 minute'
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
    AND NOT EXISTS (
      SELECT 1 FROM sms_log s
      WHERE s.user_id = u.id
        AND s.direction = 'outbound'
        AND (s.body LIKE 'Check-in%' OR s.body LIKE 'It''s 4 p.m.%')
        AND (s.sent_at AT TIME ZONE u.timezone)::date = (u.local_ts)::date
    );
$$;

GRANT EXECUTE ON FUNCTION due_messages() TO service_role;
