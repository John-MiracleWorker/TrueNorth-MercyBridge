-- Add the MercyBridge AI proof-verification result fields without bundling
-- unrelated pending MercyBridge migrations.

ALTER TABLE mercybridge_contributions
ADD COLUMN IF NOT EXISTS ai_verification_status TEXT DEFAULT 'pending'
  CHECK (ai_verification_status IN ('pending', 'verified', 'flagged', 'failed')),
ADD COLUMN IF NOT EXISTS ai_confidence_score INTEGER DEFAULT 0
  CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 100),
ADD COLUMN IF NOT EXISTS ai_verification_result JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS admin_reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS admin_reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS admin_review_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_contributions_ai_status
ON mercybridge_contributions(ai_verification_status, created_at);

CREATE INDEX IF NOT EXISTS idx_contributions_needs_review
ON mercybridge_contributions(admin_reviewed_at)
WHERE ai_verification_status = 'flagged' AND admin_reviewed_at IS NULL;

COMMENT ON COLUMN mercybridge_contributions.ai_verification_status IS 'AI verification result: pending, verified, flagged, or failed';
COMMENT ON COLUMN mercybridge_contributions.ai_confidence_score IS 'AI confidence 0-100 in the verification result';
COMMENT ON COLUMN mercybridge_contributions.ai_verification_result IS 'Full AI verification result JSON with extracted data and issues';
