-- ============================================================================
-- 008 — Accountability Partner ("Buddy"), Phase 1
--
-- Social support is the highest-leverage driver of behavior change (Actionable
-- 2025: high social support → 78.8% avg rating change vs 32.3% with none). A
-- participant can name one buddy who, after opting in (double opt-in via SMS),
-- receives a week-1 nudge and at-risk escalations to cheer the participant on.
-- The buddy sees effort/consistency framing only — never the behavior or journal.
--
-- Run in Supabase → SQL Editor, after 007.
-- ============================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS buddy_name       text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS buddy_phone      text;         -- E.164
ALTER TABLE users ADD COLUMN IF NOT EXISTS buddy_status     text;         -- pending | confirmed | declined | stopped
ALTER TABLE users ADD COLUMN IF NOT EXISTS buddy_invited_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_users_buddy_phone ON users (buddy_phone);

-- Which buddies should be nudged right now (local noon), and why. Only fires for
-- CONFIRMED buddies. Duplicate guards key on distinctive phrases in the buddy
-- messages ("just started their 30-day", "has gone quiet") logged to sms_log
-- under the participant's user_id.
CREATE OR REPLACE FUNCTION due_buddy_nudges()
RETURNS TABLE (
  user_id          uuid,
  participant_name text,
  buddy_name       text,
  buddy_phone      text,
  nudge_type       text,   -- 'week1' | 'atrisk'
  local_date       date
)
LANGUAGE sql
STABLE
AS $$
  WITH u AS (
    SELECT
      users.id,
      users.name AS participant_name,
      users.buddy_name,
      users.buddy_phone,
      users.timezone,
      users.created_at,
      (now() AT TIME ZONE users.timezone) AS local_ts
    FROM users
    WHERE users.active = true
      AND users.buddy_status = 'confirmed'
      AND users.buddy_phone IS NOT NULL
  ),
  last_score AS (
    SELECT c.user_id, MAX(c.date) AS last_scored
    FROM checkins c
    WHERE c.score IS NOT NULL
    GROUP BY c.user_id
  )
  -- Week-1 nudge: local day 2 after enrollment, at local noon, once.
  SELECT u.id, u.participant_name, u.buddy_name, u.buddy_phone,
         'week1'::text, (u.local_ts)::date
  FROM u
  WHERE (u.local_ts)::time >= time '12:00'
    AND (u.local_ts)::time <  time '12:01'
    AND (u.local_ts)::date - (u.created_at AT TIME ZONE u.timezone)::date = 2
    AND NOT EXISTS (
      SELECT 1 FROM sms_log s
      WHERE s.user_id = u.id
        AND s.direction = 'outbound'
        AND s.body LIKE '%just started their 30-day%'
    )
  UNION ALL
  -- At-risk escalation: participant silent >= 3 local days, at local noon,
  -- once per silent streak.
  SELECT u.id, u.participant_name, u.buddy_name, u.buddy_phone,
         'atrisk'::text, (u.local_ts)::date
  FROM u
  LEFT JOIN last_score l ON l.user_id = u.id
  WHERE (u.local_ts)::time >= time '12:00'
    AND (u.local_ts)::time <  time '12:01'
    AND (u.local_ts)::date
        - COALESCE(l.last_scored, (u.created_at AT TIME ZONE u.timezone)::date) >= 3
    AND NOT EXISTS (
      SELECT 1 FROM sms_log s
      WHERE s.user_id = u.id
        AND s.direction = 'outbound'
        AND s.body LIKE '%has gone quiet%'
        AND (s.sent_at AT TIME ZONE u.timezone)::date
            > COALESCE(l.last_scored, (u.created_at AT TIME ZONE u.timezone)::date)
    );
$$;

GRANT EXECUTE ON FUNCTION due_buddy_nudges() TO service_role;
