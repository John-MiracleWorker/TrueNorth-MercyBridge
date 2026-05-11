-- ============================================================================
-- MercyBridge Messaging Schema Fix
-- Replaces invalid CHECK constraint with trigger + adds update policy + RPC
-- ============================================================================

-- 1. Drop the invalid subquery-based CHECK constraint (idempotent)
ALTER TABLE public.mercybridge_messages
DROP CONSTRAINT IF EXISTS valid_message_participants;

-- 2. Create participant validation trigger function
CREATE OR REPLACE FUNCTION public.validate_mercybridge_message_participants()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester uuid;
  sender_is_sponsor boolean;
  recipient_is_sponsor boolean;
BEGIN
  -- Validate need_id exists
  SELECT requester_id
  INTO requester
  FROM public.mercybridge_needs
  WHERE id = NEW.need_id;

  IF requester IS NULL THEN
    RAISE EXCEPTION 'Invalid need_id: %', NEW.need_id;
  END IF;

  -- Check if sender is a sponsor for this need
  SELECT EXISTS (
    SELECT 1
    FROM public.mercybridge_contributions c
    WHERE c.need_id = NEW.need_id
      AND c.sponsor_id = NEW.sender_id
      AND c.status IN ('pending', 'completed')
  )
  INTO sender_is_sponsor;

  -- Check if recipient is a sponsor for this need
  SELECT EXISTS (
    SELECT 1
    FROM public.mercybridge_contributions c
    WHERE c.need_id = NEW.need_id
      AND c.sponsor_id = NEW.recipient_id
      AND c.status IN ('pending', 'completed')
  )
  INTO recipient_is_sponsor;

  -- Validate participants
  IF NOT (
    (NEW.sender_id = requester AND recipient_is_sponsor)
    OR (sender_is_sponsor AND NEW.recipient_id = requester)
    OR public.is_mercybridge_admin()
  ) THEN
    RAISE EXCEPTION 'Invalid message participants for need %', NEW.need_id;
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Attach trigger
DROP TRIGGER IF EXISTS trg_validate_mercybridge_message_participants
ON public.mercybridge_messages;

CREATE TRIGGER trg_validate_mercybridge_message_participants
BEFORE INSERT OR UPDATE ON public.mercybridge_messages
FOR EACH ROW
EXECUTE FUNCTION public.validate_mercybridge_message_participants();

-- 4. Add update policy so recipients can mark messages read
DROP POLICY IF EXISTS "messages_update_recipient" ON mercybridge_messages;
CREATE POLICY "messages_update_recipient" ON mercybridge_messages
  FOR UPDATE USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- 5. Create RPC for marking messages as read (safer than direct update)
CREATE OR REPLACE FUNCTION public.mark_mercybridge_message_read(message_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.mercybridge_messages
  SET is_read = true
  WHERE id = message_id
    AND recipient_id = auth.uid();
END;
$$;

-- ============================================================================
-- COMPLETE
-- ============================================================================
