import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  need_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SendMessageRequest {
  need_id: string;
  recipient_id: string;
  message: string;
}

export async function getMessagesForNeed(needId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('mercybridge_messages')
    .select('*')
    .eq('need_id', needId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []) as Message[];
}

export async function sendMessage(payload: SendMessageRequest): Promise<Message> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('mercybridge_messages')
    .insert({
      need_id: payload.need_id,
      sender_id: user.id,
      recipient_id: payload.recipient_id,
      message: payload.message,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Message;
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('mercybridge_messages')
    .update({ is_read: true })
    .eq('id', messageId);

  if (error) throw new Error(error.message);
}
