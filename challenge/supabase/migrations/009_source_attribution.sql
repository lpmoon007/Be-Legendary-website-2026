-- ============================================================================
-- 009 — Source attribution for deep-linked enrollments.
--
-- Sources that hand off to the main signup (Mindset Workouts, Leadership Failure
-- Simulations, campaigns) can pass ?src=<channel>&ref=<opaque id>. We persist
-- both so the coach roll-up knows the channel and so an opaque `ref` can be
-- round-tripped back to the originating system (e.g. TeamLFS completion webhook).
-- Run in Supabase → SQL Editor, after 008.
-- ============================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS source     text;  -- e.g. 'lfs', 'workout'
ALTER TABLE users ADD COLUMN IF NOT EXISTS source_ref text;  -- opaque id from the source

CREATE INDEX IF NOT EXISTS idx_users_source_ref ON users (source_ref);
