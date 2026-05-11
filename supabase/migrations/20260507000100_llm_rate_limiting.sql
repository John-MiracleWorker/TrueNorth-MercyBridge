-- =============================================================================
-- LLM Rate Limiting Migration — TrueNorth Security Audit Fix [MAJOR-7]
-- =============================================================================
-- Run this in Supabase SQL Editor (single transaction recommended)
-- Created: 2026-05-07
-- Purpose: Prevent abuse of expensive LLM endpoints by adding per-user daily quotas
--
-- Affected edge functions:
--   - ai-podcast-audio
--   - ai-podcast-full-audio
--   - ai-podcast-artwork
--   - analyze-vision-verse
--   - sermon-chat
--   - ai-tools
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Create the daily quota tracking table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_daily_quota (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quota_date DATE NOT NULL DEFAULT CURRENT_DATE,
  llm_calls_used INTEGER NOT NULL DEFAULT 0,
  max_llm_calls INTEGER NOT NULL DEFAULT 20,

  PRIMARY KEY (user_id)
);

-- Add comment for documentation
COMMENT ON TABLE user_daily_quota IS 'Tracks daily LLM API call usage per user for rate limiting';
COMMENT ON COLUMN user_daily_quota.user_id IS 'Authenticated user (references auth.users)';
COMMENT ON COLUMN user_daily_quota.quota_date IS 'Date of the quota window (resets daily)';
COMMENT ON COLUMN user_daily_quota.llm_calls_used IS 'Number of LLM calls made today';
COMMENT ON COLUMN user_daily_quota.max_llm_calls IS 'Maximum allowed LLM calls per day (default: 20)';

-- Enable RLS
ALTER TABLE user_daily_quota ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only see their own quota
CREATE POLICY "Users can view own quota"
  ON user_daily_quota
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS: Service role can manage all quotas (for edge functions)
CREATE POLICY "Service role can manage all quotas"
  ON user_daily_quota
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 2. Create the atomic check-and-increment function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_and_increment_quota(
  p_user_id UUID,
  p_max_calls INTEGER DEFAULT 20
)
RETURNS TABLE(allowed BOOLEAN, remaining INTEGER, used INTEGER) AS $$
DECLARE
  v_used INTEGER;
  v_date DATE;
BEGIN
  -- Upsert: insert if not exists, otherwise update with daily reset logic
  INSERT INTO user_daily_quota (user_id, quota_date, llm_calls_used, max_llm_calls)
  VALUES (p_user_id, CURRENT_DATE, 1, p_max_calls)
  ON CONFLICT (user_id)
  DO UPDATE SET
    -- If it's a new day, reset counter; otherwise increment
    quota_date = CURRENT_DATE,
    llm_calls_used = CASE
      WHEN user_daily_quota.quota_date < CURRENT_DATE THEN 1
      ELSE user_daily_quota.llm_calls_used + 1
    END,
    max_llm_calls = p_max_calls;

  -- Read back the current state
  SELECT llm_calls_used, quota_date
  INTO v_used, v_date
  FROM user_daily_quota
  WHERE user_id = p_user_id;

  -- Return result
  RETURN QUERY
  SELECT
    (v_used <= p_max_calls) AS allowed,
    GREATEST(0, p_max_calls - v_used) AS remaining,
    v_used AS used;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_and_increment_quota IS 'Atomically checks and increments daily LLM quota for a user. Returns whether the call is allowed and how many remain. Resets counter automatically each day.';

-- -----------------------------------------------------------------------------
-- 3. Optional: create a view for monitoring quota usage
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW user_quota_status AS
SELECT
  q.user_id,
  p.email,
  q.quota_date,
  q.llm_calls_used,
  q.max_llm_calls,
  GREATEST(0, q.max_llm_calls - q.llm_calls_used) AS remaining_calls,
  CASE WHEN q.llm_calls_used >= q.max_llm_calls THEN true ELSE false END AS quota_exceeded
FROM user_daily_quota q
LEFT JOIN auth.users u ON q.user_id = u.id
LEFT JOIN public.profiles p ON q.user_id = p.id;

COMMENT ON VIEW user_quota_status IS 'Convenient view for admin monitoring of LLM quota usage';

-- -----------------------------------------------------------------------------
-- 4. Optional: create function to manually reset a user's quota (admin only)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION reset_user_quota(
  target_user_id UUID,
  new_max_calls INTEGER DEFAULT 20
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_daily_quota (user_id, quota_date, llm_calls_used, max_llm_calls)
  VALUES (target_user_id, CURRENT_DATE, 0, new_max_calls)
  ON CONFLICT (user_id)
  DO UPDATE SET
    quota_date = CURRENT_DATE,
    llm_calls_used = 0,
    max_llm_calls = new_max_calls;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reset_user_quota IS 'Admin utility to manually reset a users LLM quota for the day';

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- After running this migration, verify with:
--
-- SELECT * FROM user_daily_quota;
-- SELECT * FROM check_and_increment_quota('your-test-user-id'::UUID, 20);
-- SELECT * FROM user_quota_status;
--
-- Then update each LLM edge function to call:
--   const { data: quota } = await supabase.rpc('check_and_increment_quota', {
--     p_user_id: user.id,
--     p_max_calls: 20
--   });
--   if (!quota?.[0]?.allowed) {
--     return jsonResponse(req, { error: 'Daily LLM quota exceeded' }, 429);
--   }
-- =============================================================================

-- Phase 1 hardening for quota RPCs: backend/service role only.
REVOKE ALL ON FUNCTION check_and_increment_quota(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION reset_user_quota(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION check_and_increment_quota(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION reset_user_quota(UUID, INTEGER) TO service_role;
ALTER FUNCTION check_and_increment_quota(UUID, INTEGER) SET search_path = public, extensions;
ALTER FUNCTION reset_user_quota(UUID, INTEGER) SET search_path = public, extensions;
