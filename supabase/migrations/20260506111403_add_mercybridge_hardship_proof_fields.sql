ALTER TABLE mercybridge_needs
  ADD COLUMN IF NOT EXISTS hardship_attestation BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS hardship_proof_type TEXT
    CHECK (
      hardship_proof_type IS NULL OR hardship_proof_type IN (
        'none',
        'pay_stub',
        'benefits_letter',
        'shutoff_notice',
        'past_due_notice',
        'eviction_or_collections',
        'referral_letter',
        'bank_statement_redacted',
        'other'
      )
    ),
  ADD COLUMN IF NOT EXISTS hardship_document_urls JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hardship_document_storage_paths JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hardship_document_retention_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS hardship_document_purged_at TIMESTAMPTZ;

COMMENT ON COLUMN mercybridge_needs.hardship_attestation IS
  'Requester attests that they are experiencing hardship and submitted truthful information.';
COMMENT ON COLUMN mercybridge_needs.hardship_proof_type IS
  'Optional targeted hardship proof type. Prefer lower-risk proof over bank statements.';
COMMENT ON COLUMN mercybridge_needs.hardship_document_urls IS
  'Short-lived hardship proof URLs. These are not public evidence and should be purged after AI extraction.';
COMMENT ON COLUMN mercybridge_needs.hardship_document_storage_paths IS
  'Private storage paths for short-lived hardship proof documents.';
COMMENT ON COLUMN mercybridge_needs.hardship_document_retention_until IS
  'Latest time raw hardship proof should remain in storage unless legally required.';
COMMENT ON COLUMN mercybridge_needs.hardship_document_purged_at IS
  'Timestamp when raw hardship proof files were deleted from storage.';
