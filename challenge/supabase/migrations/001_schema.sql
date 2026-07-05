-- ============================================================================
-- Be Legendary — 30-Day Challenge : schema, RLS, and the timezone-safe scheduler
-- Run in Supabase → SQL Editor (or `supabase db push`).
-- ============================================================================

-- ── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pg_cron;    -- minute scheduler
CREATE EXTENSION IF NOT EXISTS pg_net;     -- net.http_post from cron

-- ── Tables ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  phone          text UNIQUE NOT NULL,       -- E.164: +13035551234
  timezone       text NOT NULL,              -- IANA: America/Denver
  commitment     text NOT NULL,              -- The lead measure / daily rep
  morning_time   time NOT NULL DEFAULT '08:00',
  afternoon_time time NOT NULL DEFAULT '16:00',
  active         boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checkins (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid REFERENCES users(id) ON DELETE CASCADE,
  date                 date NOT NULL,         -- Local date in the user's timezone
  score                integer CHECK (score >= 1 AND score <= 10),
  journal_entry        text,
  score_received_at    timestamptz,
  journal_received_at  timestamptz,
  created_at           timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS sms_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES users(id) ON DELETE SET NULL,  -- null = inbound from unknown number
  direction   text CHECK (direction IN ('outbound', 'inbound')),
  body        text NOT NULL,
  twilio_sid  text,
  sent_at     timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation_state (
  user_id      uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  state        text NOT NULL DEFAULT 'idle',  -- idle | awaiting_score | awaiting_journal
  checkin_date date,
  updated_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_log_user_sent   ON sms_log (user_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_checkins_user_date  ON checkins (user_id, date);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Single-admin app: authenticated users (the coach) get full access.
-- The server API routes use the service_role key, which bypasses RLS entirely.
-- The anon key gets NOTHING — the public enrollment page never touches the DB
-- directly; it POSTs to /api/enroll which runs with the service role.
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_log            ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_state ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','checkins','sms_log','conversation_state'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_authenticated ON %I;', t, t);
    EXECUTE format(
      'CREATE POLICY %I_authenticated ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true);',
      t, t
    );
  END LOOP;
END $$;

-- ============================================================================
-- due_messages() — the authoritative "who needs a text right this minute?" query.
--
-- This is where the DST/timezone problem is solved for good. Postgres carries the
-- full IANA tz database, so `now() AT TIME ZONE users.timezone` gives the exact
-- local wall-clock time for each user, DST transitions included. We never store or
-- reason about UTC offsets in application code — Postgres does it.
--
-- Returns each user who is inside their 1-minute morning OR afternoon send window
-- AND has not already been sent that message today (duplicate guard against sms_log,
-- keyed on the LOCAL date). The caller (Edge Function / /api/send) does the actual
-- Twilio send, logs to sms_log, and — for afternoon — flips conversation_state.
-- ============================================================================
CREATE OR REPLACE FUNCTION due_messages()
RETURNS TABLE (
  user_id      uuid,
  phone        text,
  name         text,
  commitment   text,
  timezone     text,
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
      users.morning_time,
      users.afternoon_time,
      (now() AT TIME ZONE users.timezone) AS local_ts
    FROM users
    WHERE users.active = true
  )
  -- Morning window
  SELECT u.id, u.phone, u.name, u.commitment, u.timezone,
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
  -- Afternoon window
  SELECT u.id, u.phone, u.name, u.commitment, u.timezone,
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

-- Let the service role call it via PostgREST RPC.
GRANT EXECUTE ON FUNCTION due_messages() TO service_role;

-- ============================================================================
-- Scheduler wiring (pg_cron → Edge Function → /api/send)
--
-- EDIT the two placeholders below, then run this block once. It fires every
-- minute; the Edge Function forwards to /api/send which calls due_messages().
--
--   1. Replace <PROJECT-REF> with your Supabase project ref.
--   2. Replace <SERVICE_ROLE_KEY> with your service_role key (Settings → API).
--
-- (Left commented so this migration is safe to run as-is. Uncomment to activate.)
-- ============================================================================
-- SELECT cron.unschedule('send-scheduled-messages')
--   WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-scheduled-messages');
--
-- SELECT cron.schedule(
--   'send-scheduled-messages',
--   '* * * * *',
--   $$
--   SELECT net.http_post(
--     url     := 'https://<PROJECT-REF>.supabase.co/functions/v1/send-scheduled-messages',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
--     ),
--     body    := '{}'::jsonb
--   );
--   $$
-- );
