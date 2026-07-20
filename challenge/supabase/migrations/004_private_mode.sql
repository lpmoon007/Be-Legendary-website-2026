-- ============================================================================
-- Private mode: let a participant keep their commitment AND reflections private.
-- The coach supports the effort (the daily 1–10) without ever seeing the
-- behavior or the journal. For private users we send a GENERIC morning nudge
-- (no behavior text), store the commitment as "(private)", and never persist the
-- reflection content. Run after 003.
-- ============================================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;

-- Recreate due_messages() so the sender knows whether to use the generic
-- private morning message. (Adds is_private to the returned columns.)
CREATE OR REPLACE FUNCTION due_messages()
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
        AND s.body LIKE 'It''s 4 p.m.%'
        AND (s.sent_at AT TIME ZONE u.timezone)::date = (u.local_ts)::date
    );
$$;

GRANT EXECUTE ON FUNCTION due_messages() TO service_role;
