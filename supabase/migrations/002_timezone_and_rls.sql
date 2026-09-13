-- Migration 002: Add recipient timezone, fix RLS policies
-- This migration is additive and backward-compatible.

-- 1. Add recipient_timezone column with safe default
ALTER TABLE gifts
  ADD COLUMN IF NOT EXISTS recipient_timezone TEXT NOT NULL DEFAULT 'Asia/Manila';

-- 2. Replace overly broad RLS policies with restrictive ones.
--    The service-role key bypasses RLS entirely, so these policies
--    only affect anonymous/authenticated direct access (which we don't want).
--    By using (false), we ensure NO direct client access is possible.
--    All access must go through server-side API routes using the service role.

-- Drop the old permissive policies
DROP POLICY IF EXISTS "Service role can do everything on gifts" ON gifts;
DROP POLICY IF EXISTS "Service role can do everything on care_events" ON care_events;
DROP POLICY IF EXISTS "Service role can do everything on rewards" ON rewards;

-- Create restrictive policies that deny all direct anonymous/authenticated access
-- Service-role bypasses RLS, so server-side API routes still work.
CREATE POLICY "Deny all direct access to gifts"
  ON gifts FOR ALL
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny all direct access to care_events"
  ON care_events FOR ALL
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Deny all direct access to rewards"
  ON rewards FOR ALL
  USING (false)
  WITH CHECK (false);
