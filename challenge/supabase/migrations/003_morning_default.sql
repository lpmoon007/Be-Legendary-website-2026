-- ============================================================================
-- Align the default morning send time with the design (8:00 a.m.).
-- Optional: the app now sets morning_time explicitly on every insert, so this
-- only matters for rows created outside the app. Safe to run.
-- Existing participants are unchanged — edit their time on the detail page.
-- ============================================================================
ALTER TABLE users ALTER COLUMN morning_time SET DEFAULT '08:00';
