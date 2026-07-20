-- ============================================================================
-- 004 — Workout-driven enrollment (additive, backward-compatible)
--
-- The Mindset Workout "commitment" block on belegendary.org enrolls people into
-- the 30-Day Challenge with a lighter payload than the challenge landing page:
-- it captures a phone, a reminder time, and the daily rep — but NOT a name.
-- It also wants to record which workout drove the enrollment (for the roll-up:
-- workout_id → dimension → ABC bucket → Roadmap stage) and optionally an email
-- to reconcile the SMS record (phone) with the log-it record (email in HubSpot).
--
-- This migration is purely additive. The existing landing-page enroll flow keeps
-- working unchanged. Run it BEFORE the workout pages go live.
-- Run in Supabase → SQL Editor (or `supabase db push`).
-- ============================================================================

-- Name is no longer required — workout enrollments omit it.
ALTER TABLE users ALTER COLUMN name DROP NOT NULL;

-- Which workout drove this enrollment (e.g. 'go-for-it'). Null for landing-page signups.
ALTER TABLE users ADD COLUMN IF NOT EXISTS workout_id text;

-- Optional email, to stitch the SMS record (phone) to the log-it/HubSpot record (email).
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text;

-- Helpful for the per-workout roll-up reporting.
CREATE INDEX IF NOT EXISTS idx_users_workout_id ON users (workout_id);
