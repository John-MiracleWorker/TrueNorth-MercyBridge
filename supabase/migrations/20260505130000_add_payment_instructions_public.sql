-- Add public payment instructions field to mercybridge_needs
-- Allows requesters to share payment info with sponsors (account numbers, payment links, etc.)

ALTER TABLE mercybridge_needs
ADD COLUMN IF NOT EXISTS payment_instructions_public TEXT;

-- Add comment for documentation
COMMENT ON COLUMN mercybridge_needs.payment_instructions_public IS 'Optional payment instructions shared with sponsors (account number, payment URL, special instructions). Requester-controlled.';

-- Update RLS to allow requesters to update this field
DROP POLICY IF EXISTS needs_update_own ON mercybridge_needs;
CREATE POLICY "needs_update_own" ON mercybridge_needs
  FOR UPDATE USING (requester_id = auth.uid())
  WITH CHECK (requester_id = auth.uid());

-- Index for faster lookups (optional, can be added later if needed)
-- CREATE INDEX idx_needs_payment_instructions ON mercybridge_needs(payment_instructions_public) WHERE payment_instructions_public IS NOT NULL;
