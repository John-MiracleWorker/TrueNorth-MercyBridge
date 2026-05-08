-- Keep the private Supabase Storage object path for sponsor payment proofs.
-- The AI verifier can create a short-lived signed URL from this path instead
-- of relying on public URLs for a private bucket.
ALTER TABLE mercybridge_contributions
  ADD COLUMN IF NOT EXISTS proof_storage_path TEXT;

COMMENT ON COLUMN mercybridge_contributions.proof_storage_path IS
  'Private Supabase Storage path for the uploaded direct-payment proof document.';
