-- MercyBridge Secure Messaging Schema
-- Enables communication between sponsors and requesters

CREATE TABLE IF NOT EXISTS mercybridge_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  need_id UUID NOT NULL REFERENCES mercybridge_needs(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure messages are within a valid need context
  CONSTRAINT valid_message_participants CHECK (
    EXISTS (
      SELECT 1 FROM mercybridge_needs n
      WHERE n.id = need_id
      AND (
        n.requester_id = sender_id 
        OR EXISTS (
          SELECT 1 FROM mercybridge_contributions c
          WHERE c.need_id = n.id AND c.sponsor_id = sender_id
        )
      )
    )
  )
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_messages_need ON mercybridge_messages(need_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON mercybridge_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON mercybridge_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON mercybridge_messages(recipient_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_messages_created ON mercybridge_messages(need_id, created_at);

-- Enable RLS
ALTER TABLE mercybridge_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "messages_select_participants" ON mercybridge_messages;
CREATE POLICY "messages_select_participants" ON mercybridge_messages
  FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

DROP POLICY IF EXISTS "messages_insert_sender" ON mercybridge_messages;
CREATE POLICY "messages_insert_sender" ON mercybridge_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM mercybridge_needs n
      WHERE n.id = need_id
      AND (
        n.requester_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM mercybridge_contributions c
          WHERE c.need_id = n.id AND c.sponsor_id = auth.uid() AND c.status = 'pending'
        )
      )
    )
  );

-- Admin can see all messages for moderation
DROP POLICY IF EXISTS "messages_select_admin" ON mercybridge_messages;
CREATE POLICY "messages_select_admin" ON mercybridge_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.mercybridge_role IN ('admin', 'reviewer')
    )
  );

-- Comment for documentation
COMMENT ON TABLE mercybridge_messages IS 'Secure messaging between sponsors and requesters for payment coordination';
COMMENT ON COLUMN mercybridge_messages.is_read IS 'Whether recipient has read the message';
