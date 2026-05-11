-- ============================================================================
-- MercyBridge Public Data Hardening
-- Creates a public-safe view for approved needs
-- Removes public SELECT access from the sensitive base table
-- ============================================================================

-- Drop the public view if it exists (idempotent)
DROP VIEW IF EXISTS public.mercybridge_public_needs;

-- Create public-safe view exposing only non-sensitive fields
CREATE VIEW public.mercybridge_public_needs AS
SELECT
  id,
  requester_id,
  title,
  category,
  biller_name,
  bill_amount,
  amount_requested,
  amount_funded,
  amount_remaining,
  due_date,
  urgency_level,
  hardship_summary_public,
  public_location,
  payment_instructions_public,
  verification_level,
  status,
  submitted_at
FROM public.mercybridge_needs
WHERE status IN ('approved', 'partially_funded', 'funded', 'paid');

-- Lock down the view: revoke all, then grant SELECT only
REVOKE ALL ON public.mercybridge_public_needs FROM PUBLIC;
GRANT SELECT ON public.mercybridge_public_needs TO anon;
GRANT SELECT ON public.mercybridge_public_needs TO authenticated;

-- Remove the dangerous public policy from the base table
DROP POLICY IF EXISTS "needs_select_public" ON public.mercybridge_needs;

-- Keep requester/admin policies intact on the base table
-- (needs_select_own and needs_select_admin already exist)

-- ============================================================================
-- COMPLETE
-- ============================================================================
