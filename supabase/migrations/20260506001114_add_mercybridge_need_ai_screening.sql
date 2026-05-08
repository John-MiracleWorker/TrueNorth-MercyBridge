ALTER TABLE mercybridge_needs
  ADD COLUMN IF NOT EXISTS document_storage_paths JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_screening_status TEXT DEFAULT 'pending'
    CHECK (ai_screening_status IN ('pending', 'approved', 'rejected', 'flagged', 'failed')),
  ADD COLUMN IF NOT EXISTS ai_screening_score INTEGER
    CHECK (ai_screening_score IS NULL OR (ai_screening_score >= 0 AND ai_screening_score <= 100)),
  ADD COLUMN IF NOT EXISTS ai_screening_result JSONB,
  ADD COLUMN IF NOT EXISTS ai_screened_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_mercybridge_needs_ai_screening_status
  ON mercybridge_needs(ai_screening_status, submitted_at);

COMMENT ON COLUMN mercybridge_needs.document_storage_paths IS
  'Private Supabase Storage object paths for uploaded request documents.';
COMMENT ON COLUMN mercybridge_needs.ai_screening_status IS
  'AI intake screening result: pending, approved, rejected, flagged, or failed.';
COMMENT ON COLUMN mercybridge_needs.ai_screening_score IS
  'AI confidence/risk score from 0 to 100.';
COMMENT ON COLUMN mercybridge_needs.ai_screening_result IS
  'Full AI intake screening result with extracted bill data, requester-vetting signals, and red flags.';
COMMENT ON COLUMN mercybridge_needs.ai_screened_at IS
  'Timestamp of the last AI intake screening run.';
