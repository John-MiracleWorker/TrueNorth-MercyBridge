-- TrueNorth admins should be MercyBridge admins too. Without this, the UI can
-- admit an app admin while RLS still hides submitted needs and proof rows.
CREATE OR REPLACE FUNCTION is_mercybridge_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND (
        is_admin = true
        OR mercybridge_role IN ('admin', 'reviewer')
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS messages_select_admin ON mercybridge_messages;
CREATE POLICY "messages_select_admin" ON mercybridge_messages
  FOR SELECT USING (is_mercybridge_admin());

-- Older submitted rows can have null submitted_at because the original trigger
-- only ran on updates. Backfill and keep future submitted rows timestamped.
UPDATE mercybridge_needs
SET submitted_at = COALESCE(submitted_at, created_at, now())
WHERE status IN ('submitted', 'more_info_needed', 'approved', 'partially_funded', 'funded', 'paid')
  AND submitted_at IS NULL;

ALTER TABLE mercybridge_needs
  ALTER COLUMN submitted_at SET DEFAULT now();
