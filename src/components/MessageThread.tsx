import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SafeAuthProvider';
import { getMessagesForNeed, sendMessage, markMessageAsRead } from '@/services/messagingApi';
import type { Message } from '@/services/messagingApi';

interface MessageThreadProps {
  needId: string;
  otherPartyId: string;
  otherPartyName: string;
  onMessageSent?: () => void;
}

export function MessageThread({ needId, otherPartyId, otherPartyName, onMessageSent }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    try {
      const msgs = await getMessagesForNeed(needId);
      setMessages(msgs);
      // Mark all as read
      await Promise.all(
        msgs.filter(m => m.recipient_id === user?.id && !m.is_read).map(m => markMessageAsRead(m.id))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  };

  useEffect(() => {
    loadMessages();
  }, [needId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      await sendMessage({
        need_id: needId,
        recipient_id: otherPartyId,
        message: newMessage.trim(),
      });
      setNewMessage('');
      await loadMessages();
      onMessageSent?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/75 overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-800 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
          <Shield className="h-4 w-4 text-amber-100" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">Secure Message Thread</h3>
          <p className="text-xs text-slate-400">Chatting with {otherPartyName}</p>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          End-to-end encrypted
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === user.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    isMe
                      ? 'bg-amber-500 text-slate-950 rounded-br-sm'
                      : 'bg-white/[0.08] text-white rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-slate-700' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-slate-800 p-4">
        {error && (
          <div className="mb-3 flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle className="h-3 w-3" />
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-950/55 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-200/60/50"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-amber-200 hover:bg-amber-100 text-slate-950 shadow-[0_0_32px_rgba(251,191,36,0.16)] px-6"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          ⚠️ Don't share personal info (phone, email, address) until you trust the other party
        </p>
      </form>
    </div>
  );
}
