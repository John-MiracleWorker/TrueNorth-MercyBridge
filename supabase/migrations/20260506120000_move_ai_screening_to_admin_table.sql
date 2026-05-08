-- ============================================================================
-- Move AI screening results from mercybridge_needs to admin-only table
-- ============================================================================

-- 1. Create admin-only AI screenings table
CREATE TABLE IF NOT EXISTS mercybridge_need_ai_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES mercybridge_needs(id) ON DELETE CASCADE,
  screening_status TEXT NOT NULL CHECK (screening_status IN ('pending', 'approved', 'rejected', 'flagged', 'failed')),
  score INTEGER CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  result JSONB,
  screened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE mercybridge_need_ai_screenings IS
  'Admin-only storage for AI intake screening results. Never exposed to requesters or sponsors.';
COMMENT ON COLUMN mercybridge_need_ai_screenings.need_id IS
  'The need this screening belongs to.';
COMMENT ON COLUMN mercybridge_need_ai_screenings.screening_status IS
  'AI screening outcome: pending, approved, rejected, flagged, or failed.';
COMMENT ON COLUMN mercybridge_need_ai_screenings.score IS
  'AI confidence/risk score from 0 to 100.';
COMMENT ON COLUMN mercybridge_need_ai_screenings.result IS
  'Full AI intake screening result with extracted bill data, requester-vetting signals, and red flags.';
COMMENT ON COLUMN mercybridge_need_ai_screenings.screened_at IS
  'Timestamp of the AI intake screening run.';

-- 2. Index for fast lookups by need
CREATE INDEX IF NOT EXISTS idx_need_ai_screenings_need_id
  ON mercybridge_need_ai_screenings(need_id);
CREATE INDEX IF NOT EXISTS idx_need_ai_screenings_screened_at
  ON mercybridge_need_ai_screenings(screened_at DESC);

-- 3. Enable RLS
ALTER TABLE mercybridge_need_ai_screenings ENABLE ROW LEVEL SECURITY;

-- 4. Admin-only policies
DROP POLICY IF EXISTS "ai_screenings_select_admin" ON mercybridge_need_ai_screenings;
CREATE POLICY "ai_screenings_select_admin" ON mercybridge_need_ai_screenings
  FOR SELECT USING (is_mercybridge_admin());

DROP POLICY IF EXISTS "ai_screenings_insert_admin" ON mercybridge_need_ai_screenings;
CREATE POLICY "ai_screenings_insert_admin" ON mercybridge_need_ai_screenings
  FOR INSERT WITH CHECK (is_mercybridge_admin());

DROP POLICY IF EXISTS "ai_screenings_update_admin" ON mercybridge_need_ai_screenings;
CREATE POLICY "ai_screenings_update_admin" ON mercybridge_need_ai_screenings
  FOR UPDATE USING (is_mercybridge_admin());

DROP POLICY IF EXISTS "ai_screenings_delete_admin" ON mercybridge_need_ai_screenings;
CREATE POLICY "ai_screenings_delete_admin" ON mercybridge_need_ai_screenings
  FOR DELETE USING (is_mercybridge_admin());

-- 5, 6, 7. Migrate data and drop old columns (Conditional to allow idempotency)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mercybridge_needs' AND column_name = 'ai_screening_score') THEN
    EXECUTE '
      INSERT INTO mercybridge_need_ai_screenings (
        need_id,
        screening_status,
        score,
        result,
        screened_at,
        created_at
      )
      SELECT
        id,
        ai_screening_status,
        ai_screening_score,
        ai_screening_result,
        ai_screened_at,
        COALESCE(ai_screened_at, NOW())
      FROM mercybridge_needs
      WHERE ai_screening_status IS NOT NULL
        AND ai_screened_at IS NOT NULL
      ON CONFLICT DO NOTHING;
    ';

    EXECUTE '
      ALTER TABLE mercybridge_needs
        DROP COLUMN IF EXISTS ai_screening_score,
        DROP COLUMN IF EXISTS ai_screening_result,
        DROP COLUMN IF EXISTS ai_screened_at;
    ';

    EXECUTE 'DROP INDEX IF EXISTS idx_mercybridge_needs_ai_screening_status;';
  END IF;
END $$;

-- ============================================================================
-- COMPLETE
-- ============================================================================
