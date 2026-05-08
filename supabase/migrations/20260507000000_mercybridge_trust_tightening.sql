-- ============================================================================
-- MercyBridge Tightness & Trust Plan Migration
-- ============================================================================

-- ============================================================================
-- 1. DISCLOSURE ACKNOWLEDGEMENTS
-- ============================================================================

ALTER TABLE mercybridge_needs
  ADD COLUMN IF NOT EXISTS requester_disclosure_acknowledged_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS requester_disclosure_version TEXT DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS requester_consent_ai_review BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS requester_consent_human_review BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS requester_consent_temp_storage BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS requester_consent_no_guarantee BOOLEAN DEFAULT false;

COMMENT ON COLUMN mercybridge_needs.requester_disclosure_acknowledged_at IS
  'Timestamp when requester acknowledged the disclosure/consent layer before submission.';
COMMENT ON COLUMN mercybridge_needs.requester_disclosure_version IS
  'Version of the disclosure text the requester agreed to.';
COMMENT ON COLUMN mercybridge_needs.requester_consent_ai_review IS
  'Requester consents to AI review of uploaded documents.';
COMMENT ON COLUMN mercybridge_needs.requester_consent_human_review IS
  'Requester consents to human admin review of uploaded documents and hardship narrative.';
COMMENT ON COLUMN mercybridge_needs.requester_consent_temp_storage IS
  'Requester consents to temporary storage of documents with defined retention and purge.';
COMMENT ON COLUMN mercybridge_needs.requester_consent_no_guarantee IS
  'Requester understands there is no guarantee of approval or funding.';

ALTER TABLE mercybridge_contributions
  ADD COLUMN IF NOT EXISTS sponsor_disclosure_acknowledged_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sponsor_disclosure_version TEXT DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS sponsor_ack_direct_pay BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sponsor_ack_not_tax_deductible BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sponsor_ack_mercybridge_no_custody BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sponsor_ack_no_reversal_guarantee BOOLEAN DEFAULT false;

COMMENT ON COLUMN mercybridge_contributions.sponsor_disclosure_acknowledged_at IS
  'Timestamp when sponsor acknowledged direct-pay disclosures before proof upload.';
COMMENT ON COLUMN mercybridge_contributions.sponsor_ack_direct_pay IS
  'Sponsor acknowledges they paid the biller directly, not through MercyBridge.';
COMMENT ON COLUMN mercybridge_contributions.sponsor_ack_not_tax_deductible IS
  'Sponsor acknowledges this payment is not tax-deductible.';
COMMENT ON COLUMN mercybridge_contributions.sponsor_ack_mercybridge_no_custody IS
  'Sponsor acknowledges MercyBridge never held or processed the funds.';
COMMENT ON COLUMN mercybridge_contributions.sponsor_ack_no_reversal_guarantee IS
  'Sponsor acknowledges payment may not be reversible through MercyBridge.';

-- ============================================================================
-- 2. EXTENDED AI SCREENING RESULT FIELDS (reviewer-facing)
-- ============================================================================

-- These are stored within ai_screening_result JSONB; we document them here
-- but the JSONB schema is flexible. New fields:
--   document_summary
--   hardship_summary_safe
--   recommended_admin_action
--   missing_information
--   privacy_redactions_detected

-- ============================================================================
-- 3. ADMIN REVIEW CHECKLIST AND AUDITABILITY
-- ============================================================================

ALTER TABLE mercybridge_admin_reviews
  ADD COLUMN IF NOT EXISTS checklist JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS decision_reason TEXT,
  ADD COLUMN IF NOT EXISTS public_summary_approved TEXT;

COMMENT ON COLUMN mercybridge_admin_reviews.checklist IS
  'Structured checklist of objective review criteria (bill legitimacy, form match, hardship signal, duplicate risk, etc.).';
COMMENT ON COLUMN mercybridge_admin_reviews.decision_reason IS
  'Human-readable reason for the approve/reject/more_info/archive decision.';
COMMENT ON COLUMN mercybridge_admin_reviews.public_summary_approved IS
  'Admin-approved public summary text, redacted and safe for public display.';

-- ============================================================================
-- 4. DOCUMENT LIFECYCLE FIELDS
-- ============================================================================

ALTER TABLE mercybridge_needs
  ADD COLUMN IF NOT EXISTS raw_document_retention_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS raw_document_purged_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS document_summary_retained TEXT,
  ADD COLUMN IF NOT EXISTS purge_status TEXT DEFAULT 'pending'
    CHECK (purge_status IN ('pending', 'in_progress', 'completed', 'failed', 'not_needed'));

COMMENT ON COLUMN mercybridge_needs.raw_document_retention_until IS
  'Deadline after which raw documents should be purged from storage.';
COMMENT ON COLUMN mercybridge_needs.raw_document_purged_at IS
  'Timestamp when raw bill/hardship documents were permanently deleted.';
COMMENT ON COLUMN mercybridge_needs.document_summary_retained IS
  'AI-generated summary retained after raw documents are purged.';
COMMENT ON COLUMN mercybridge_needs.purge_status IS
  'State of the document purge workflow: pending, in_progress, completed, failed, not_needed.';

-- ============================================================================
-- 5. CONTRIBUTION AI VERIFICATION ENHANCEMENTS
-- ============================================================================

ALTER TABLE mercybridge_contributions
  ADD COLUMN IF NOT EXISTS ai_review_queue_reason TEXT,
  ADD COLUMN IF NOT EXISTS admin_reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_reviewed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS admin_review_notes TEXT;

COMMENT ON COLUMN mercybridge_contributions.ai_review_queue_reason IS
  'Why this contribution was queued for manual admin review (e.g., confirmation-number-only, AI flagged).';
COMMENT ON COLUMN mercybridge_contributions.admin_reviewed_at IS
  'Timestamp when an admin manually reviewed this contribution proof.';
COMMENT ON COLUMN mercybridge_contributions.admin_reviewed_by IS
  'Admin user who manually reviewed this contribution.';
COMMENT ON COLUMN mercybridge_contributions.admin_review_notes IS
  'Notes left by admin during manual review of payment proof.';

-- ============================================================================
-- 6. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_needs_disclosure_ack
  ON mercybridge_needs(requester_disclosure_acknowledged_at)
  WHERE requester_disclosure_acknowledged_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_needs_purge_status
  ON mercybridge_needs(purge_status)
  WHERE purge_status IN ('pending', 'in_progress', 'failed');

CREATE INDEX IF NOT EXISTS idx_contributions_admin_review
  ON mercybridge_contributions(admin_reviewed_at)
  WHERE admin_reviewed_at IS NOT NULL;

-- ============================================================================
-- 7. RLS POLICY UPDATES (ensure admins can read disclosure fields)
-- ============================================================================

-- No new RLS policies needed; existing is_mercybridge_admin() covers admin access.
-- The new columns inherit existing table RLS policies.

-- ============================================================================
-- COMPLETE
-- ============================================================================
