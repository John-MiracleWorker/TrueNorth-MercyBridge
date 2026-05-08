-- ============================================================================
-- MercyBridge Direct-Pay Polish
-- Phase 1 keeps funds donor -> biller, with TrueNorth only verifying proof.
-- ============================================================================

-- Private document bucket for bills and payment proofs.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'mercybridge-documents',
  'mercybridge-documents',
  false,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']::text[];

ALTER TABLE mercybridge_contributions
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'direct_pay'
    CHECK (payment_method IN ('direct_pay', 'stripe')),
  ADD COLUMN IF NOT EXISTS proof_url TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_number TEXT,
  ADD COLUMN IF NOT EXISTS proof_notes TEXT,
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS fiscal_sponsor_id UUID;

CREATE INDEX IF NOT EXISTS idx_contributions_status_pending
  ON mercybridge_contributions(created_at)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_contributions_payment_method
  ON mercybridge_contributions(payment_method);

-- Storage RLS for private MercyBridge documents.
DROP POLICY IF EXISTS "mercybridge_documents_select_own" ON storage.objects;
DROP POLICY IF EXISTS "mercybridge_documents_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "mercybridge_documents_update_own" ON storage.objects;
DROP POLICY IF EXISTS "mercybridge_documents_admin_all" ON storage.objects;

CREATE POLICY "mercybridge_documents_select_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'mercybridge-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "mercybridge_documents_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'mercybridge-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "mercybridge_documents_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'mercybridge-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'mercybridge-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "mercybridge_documents_admin_all" ON storage.objects
  FOR ALL USING (
    bucket_id = 'mercybridge-documents'
    AND is_mercybridge_admin()
  )
  WITH CHECK (
    bucket_id = 'mercybridge-documents'
    AND is_mercybridge_admin()
  );

-- Harden contribution write access.
DROP POLICY IF EXISTS "contributions_insert_own" ON mercybridge_contributions;
DROP POLICY IF EXISTS "contributions_update_own" ON mercybridge_contributions;
DROP POLICY IF EXISTS "contributions_update_admin" ON mercybridge_contributions;

CREATE POLICY "contributions_insert_own" ON mercybridge_contributions
  FOR INSERT WITH CHECK (
    sponsor_id = auth.uid()
    AND status = 'pending'
    AND payment_method = 'direct_pay'
    AND verified_by IS NULL
    AND verified_at IS NULL
  );

CREATE POLICY "contributions_update_admin" ON mercybridge_contributions
  FOR UPDATE USING (is_mercybridge_admin())
  WITH CHECK (is_mercybridge_admin());

-- Fix funding rollups: recompute the completed contribution sum exactly once.
CREATE OR REPLACE FUNCTION update_need_funding()
RETURNS TRIGGER AS $$
DECLARE
  target_need_id UUID;
  completed_total DECIMAL(12, 2);
BEGIN
  target_need_id := COALESCE(NEW.need_id, OLD.need_id);

  SELECT COALESCE(SUM(amount), 0)
  INTO completed_total
  FROM mercybridge_contributions
  WHERE need_id = target_need_id
    AND status = 'completed';

  UPDATE mercybridge_needs
  SET
    amount_funded = completed_total,
    status = CASE
      WHEN status = 'paid' THEN status
      WHEN completed_total >= amount_requested THEN 'funded'::need_status
      WHEN completed_total > 0 THEN 'partially_funded'::need_status
      WHEN status IN ('partially_funded', 'funded') THEN 'approved'::need_status
      ELSE status
    END,
    funded_at = CASE
      WHEN completed_total >= amount_requested THEN COALESCE(funded_at, now())
      ELSE NULL
    END,
    updated_at = now()
  WHERE id = target_need_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_update_need_funding ON mercybridge_contributions;
CREATE TRIGGER trigger_update_need_funding
AFTER INSERT OR UPDATE OF amount, status, need_id ON mercybridge_contributions
FOR EACH ROW
EXECUTE FUNCTION update_need_funding();

CREATE OR REPLACE FUNCTION verify_contribution(
  contribution_id UUID,
  action TEXT,
  reason TEXT DEFAULT NULL
)
RETURNS mercybridge_contributions AS $$
DECLARE
  updated_contribution mercybridge_contributions;
BEGIN
  IF NOT is_mercybridge_admin() THEN
    RAISE EXCEPTION 'MercyBridge admin access required' USING ERRCODE = '42501';
  END IF;

  IF action NOT IN ('verify', 'reject') THEN
    RAISE EXCEPTION 'Invalid contribution action' USING ERRCODE = '22023';
  END IF;

  UPDATE mercybridge_contributions
  SET
    status = CASE WHEN action = 'verify' THEN 'completed'::contribution_status ELSE 'failed'::contribution_status END,
    verified_by = auth.uid(),
    verified_at = now(),
    rejection_reason = CASE WHEN action = 'reject' THEN reason ELSE NULL END,
    updated_at = now()
  WHERE id = contribution_id
    AND payment_method = 'direct_pay'
    AND status = 'pending'
  RETURNING * INTO updated_contribution;

  IF updated_contribution.id IS NULL THEN
    RAISE EXCEPTION 'Pending direct-pay contribution not found' USING ERRCODE = 'P0002';
  END IF;

  RETURN updated_contribution;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION verify_contribution(UUID, TEXT, TEXT) TO authenticated;

-- QA seed: pending proof records against existing seed needs.
INSERT INTO mercybridge_contributions (
  need_id,
  sponsor_id,
  amount,
  status,
  payment_method,
  confirmation_number,
  proof_notes,
  gift_note,
  is_anonymous
)
SELECT
  n.id,
  NULL,
  25.00,
  'pending',
  'direct_pay',
  'QA-DIRECT-25',
  'Seed pending payment proof for admin verification QA.',
  'Praying this helps.',
  true
FROM mercybridge_needs n
WHERE n.biller_name = 'Consumers Energy'
ON CONFLICT DO NOTHING;

INSERT INTO mercybridge_contributions (
  need_id,
  sponsor_id,
  amount,
  status,
  payment_method,
  confirmation_number,
  proof_notes,
  is_anonymous
)
SELECT
  n.id,
  NULL,
  50.00,
  'pending',
  'direct_pay',
  'QA-DIRECT-50',
  'Seed pending payment proof for rejection/verify QA.',
  false
FROM mercybridge_needs n
WHERE n.biller_name = 'Baylor Scott & White'
ON CONFLICT DO NOTHING;
