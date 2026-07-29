-- ============================================================================
-- 007 — Capture the participant's "why" (their reason the commitment matters).
--
-- Actionable 2025 (Factor #1): a deep-enough reason drives daily practice and
-- higher engagement. Optional, free-text. Not collected in private mode.
-- Run in Supabase → SQL Editor, after 006.
-- ============================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS why text;
