import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Square,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSafeToast } from '@/hooks/useSafeToast';
import { useAuth } from '@/contexts/SafeAuthProvider';
import {
  streamStewardshipCoachMessage,
  loadStewardshipChat,
  saveStewardshipChat,
  type StewardshipChatContext,
  type StewardshipChatMessage,
} from '@/services/mercybridgeApi';

const starterPrompts = [
  'Help me decide which bill to call first.',
  'Write a hardship script I can use with my utility company.',
  'What should I do in the next 24 hours?',
];

export default function StewardshipCoach() {
  const { toast } = useSafeToast();
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [messages, setMessages] = useState<StewardshipChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Tell me what feels most urgent right now. I can help you triage bills, prepare a call script, and choose one faithful next step.',
    },
  ]);
  const [input, setInput] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingThinking, setStreamingThinking] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  const [activeSnapshot, setActiveSnapshot] = useState<StewardshipChatContext | null>(null);
  const [context, setContext] = useState<StewardshipChatContext>({
    monthly_income: '',
    bills: '',
    expenses: '',
    hardship_notes: '',
    church_community: '',
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  // Load persisted chat history on mount
  useEffect(() => {
    if (!user?.id || hasLoadedHistory) return;
    setIsLoadingHistory(true);
    loadStewardshipChat()
      .then((data) => {
        if (data) {
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
          if (data.context) {
            setContext(data.context);
            setActiveSnapshot(data.context);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load stewardship chat history:', err);
      })
      .finally(() => {
        setIsLoadingHistory(false);
        setHasLoadedHistory(true);
      });
  }, [user?.id, hasLoadedHistory]);

  // Auto-save chat after each assistant response
  const persistChat = async (
    currentMessages: StewardshipChatMessage[],
    currentContext: StewardshipChatContext | null
  ) => {
    if (!user?.id) return;
    try {
      await saveStewardshipChat({
        messages: currentMessages,
        context: currentContext,
      });
    } catch (err) {
      console.error('Failed to save stewardship chat:', err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, streamingContent, streamingThinking]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const updateContext = (field: keyof StewardshipChatContext, value: string) => {
    setContext((prev) => ({ ...prev, [field]: value }));
  };

  const hasSnapshot = Boolean(activeSnapshot);
  const currentSnapshot = {
    monthly_income: context.monthly_income?.trim() || '',
    bills: context.bills?.trim() || '',
    expenses: context.expenses?.trim() || '',
    hardship_notes: context.hardship_notes?.trim() || '',
    church_community: context.church_community?.trim() || '',
  };
  const hasSnapshotChanges = JSON.stringify(activeSnapshot) !== JSON.stringify(currentSnapshot);
  const canSaveSnapshot = Boolean(context.bills?.trim() && context.hardship_notes?.trim());

  const saveSnapshot = () => {
    if (!canSaveSnapshot) {
      toast({
        title: 'Add the core snapshot first',
        description: 'Please include your bills and a short note about what feels most urgent.',
        variant: 'destructive',
      });
      return;
    }

    setActiveSnapshot(currentSnapshot);

    if (messages.length === 1) {
      setMessages([
        {
          role: 'assistant',
          content:
            'I have your situation snapshot now. Ask me what to do first, or use one of the prompts below.',
        },
      ]);
    }

    // Persist the updated snapshot
    void persistChat(messages, currentSnapshot);

    toast({
      title: 'Snapshot ready',
      description: 'Your situation snapshot will be sent as context with each stewardship message.',
    });
  };

  const stopStream = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
  };

  const sendMessage = async (messageOverride?: string) => {
    const content = (messageOverride || input).trim();
    if (!content || isStreaming) return;

    if (!activeSnapshot) {
      toast({
        title: 'Save your situation snapshot first',
        description: 'The coach needs your bills and current hardship context before the conversation starts.',
        variant: 'destructive',
      });
      return;
    }

    const nextUserMessage: StewardshipChatMessage = { role: 'user', content };
    const history = messages;

    setMessages((prev) => [...prev, nextUserMessage]);
    setInput('');
    setStreamingContent('');
    setStreamingThinking('');
    setIsStreaming(true);
    setShowThinking(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      await streamStewardshipCoachMessage(
        {
          message: content,
          context: activeSnapshot,
          conversationHistory: history,
        },
        {
          signal: abortController.signal,
          onTextDelta: (_delta, currentContent) => {
            setStreamingContent(currentContent);
          },
          onThinkingDelta: (_delta, currentThinking) => {
            setStreamingThinking(currentThinking);
          },
          onComplete: (finalContent, finalThinking) => {
            const assistantContent = finalContent.trim();
            if (assistantContent) {
              setMessages((prev) => {
                const updated = [...prev, { role: 'assistant', content: assistantContent }];
                // Persist after assistant response
                void persistChat(updated, activeSnapshot);
                return updated;
              });
            }
            setStreamingContent('');
            setStreamingThinking(finalThinking || '');
          },
          onError: (message) => {
            throw new Error(message);
          },
        }
      );
    } catch (error) {
      if (abortController.signal.aborted) return;

      const description = error instanceof Error ? error.message : 'The stewardship coach could not respond.';
      toast({
        title: 'Stewardship coach unavailable',
        description,
        variant: 'destructive',
      });
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-4 py-4 sm:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 xl:grid xl:grid-cols-[22rem_minmax(0,1fr)] xl:gap-6">
        <aside className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-4 sm:p-5"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-200">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-white sm:text-xl">Stewardship Coach</h1>
                <p className="text-xs text-slate-400 sm:text-sm">Conversational direct-pay guidance.</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-300/15 bg-amber-300/10 p-2.5 text-xs text-amber-100/90 sm:p-3 sm:text-sm">
              <AlertCircle className="mr-2 inline h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Educational guidance only. For legal, tax, investment, or professional financial
              advice, consult a qualified advisor.
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl p-4 sm:space-y-4 sm:p-5"
          >
            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">Situation Snapshot</h2>
              <p className="text-xs text-slate-400 sm:text-sm">
                Fill this out first. It is sent to the coach as context for the conversation.
              </p>
            </div>

            <div>
              <Label className="text-sm text-slate-200">Monthly Income</Label>
              <Input
                inputMode="decimal"
                placeholder="e.g. 2400"
                value={context.monthly_income}
                onChange={(event) => updateContext('monthly_income', event.target.value)}
                className="mt-1.5 border-white/10 bg-slate-950/45 text-white sm:mt-2"
              />
            </div>

            <div>
              <Label className="text-sm text-slate-200">Bills</Label>
              <Textarea
                placeholder={`Electric bill - 184 - May 15\nRent - 850 - May 20`}
                value={context.bills}
                onChange={(event) => updateContext('bills', event.target.value)}
                className="mt-1.5 min-h-[80px] border-white/10 bg-slate-950/45 text-white sm:mt-2 sm:min-h-[96px]"
              />
            </div>

            <div>
              <Label className="text-sm text-slate-200">Other Expenses</Label>
              <Textarea
                placeholder={`Groceries - 300\nGas - 120\nPhone - 65`}
                value={context.expenses}
                onChange={(event) => updateContext('expenses', event.target.value)}
                className="mt-1.5 min-h-[72px] border-white/10 bg-slate-950/45 text-white sm:mt-2 sm:min-h-[84px]"
              />
            </div>

            <div>
              <Label className="text-sm text-slate-200">Hardship Notes</Label>
              <Textarea
                placeholder="What changed, and what feels most urgent?"
                value={context.hardship_notes}
                onChange={(event) => updateContext('hardship_notes', event.target.value)}
                className="mt-1.5 min-h-[80px] border-white/10 bg-slate-950/45 text-white sm:mt-2 sm:min-h-[96px]"
              />
            </div>

            <div>
              <Label className="text-sm text-slate-200">Church or Community</Label>
              <Input
                placeholder="Local church, 211, family, community group..."
                value={context.church_community}
                onChange={(event) => updateContext('church_community', event.target.value)}
                className="mt-1.5 border-white/10 bg-slate-950/45 text-white sm:mt-2"
              />
            </div>

            <Button
              type="button"
              onClick={saveSnapshot}
              className="w-full bg-emerald-200 font-semibold text-slate-950 hover:bg-emerald-100 shadow-[0_0_32px_rgba(16,185,129,0.12)]"
              disabled={!canSaveSnapshot || isStreaming}
            >
              {hasSnapshot && !hasSnapshotChanges ? (
                <>
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Snapshot Saved
                </>
              ) : hasSnapshot ? (
                <>
                  <RefreshCw className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Update Snapshot
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Save Snapshot and Start
                </>
              )}
            </Button>

            {hasSnapshot ? (
              <div className="rounded-xl border border-emerald-300/15 bg-emerald-300/10 p-2.5 text-xs leading-5 text-emerald-100/85 sm:p-3">
                This saved snapshot is attached to every message. Update it if your bills or
                hardship details change.
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 backdrop-blur-xl p-2.5 text-xs leading-5 text-slate-400 sm:p-3">
                Required before chatting: bills and hardship notes. Income, expenses, and community
                support are helpful but optional.
              </div>
            )}
          </motion.section>
        </aside>

        <section className="flex min-h-[60vh] flex-col rounded-2xl border border-white/10 bg-white/[0.055] shadow-xl shadow-black/15 backdrop-blur-xl sm:min-h-[calc(100vh-4rem)]">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-2xl font-bold text-white">MercyBridge Conversation</h2>
            <p className="mt-1 text-sm text-slate-400">
              Ask about bill triage, hardship calls, direct-pay proof, or one next step.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-5">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading conversation history...
              </div>
            ) : null}

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' ? (
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200">
                    <Bot className="h-5 w-5" />
                  </span>
                ) : null}
                <div
                  className={`max-w-full rounded-xl border p-3 text-sm leading-6 sm:max-w-[min(42rem,82%)] sm:p-4 ${
                    message.role === 'user'
                      ? 'border-amber-300/20 bg-amber-300/10 text-amber-50'
                      : 'border-white/10 bg-slate-950/70 text-slate-200'
                  }`}
                >
                  <div className="markdown-content break-words">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        h1: ({ children }) => <h1 className="mb-2 mt-3 text-base font-bold text-white">{children}</h1>,
                        h2: ({ children }) => <h2 className="mb-2 mt-3 text-sm font-semibold text-white">{children}</h2>,
                        h3: ({ children }) => <h3 className="mb-1 mt-2 text-sm font-semibold text-slate-200">{children}</h3>,
                        ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-4">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-4">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        a: ({ children, href }) => <a href={href} className="text-amber-200 underline hover:text-amber-100" target="_blank" rel="noopener noreferrer">{children}</a>,
                        code: ({ children, className }) => {
                          const isInline = !className;
                          return isInline ? (
                            <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-amber-100">{children}</code>
                          ) : (
                            <pre className="mb-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs">
                              <code className="text-slate-200">{children}</code>
                            </pre>
                          );
                        },
                        blockquote: ({ children }) => <blockquote className="mb-2 border-l-2 border-amber-300/30 pl-3 italic text-slate-300">{children}</blockquote>,
                        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
                {message.role === 'user' ? (
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200">
                    <UserRound className="h-5 w-5" />
                  </span>
                ) : null}
              </div>
            ))}

            {isStreaming ? (
              <div className="flex justify-start gap-3">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
                <div className="w-full max-w-full space-y-3 sm:max-w-[min(42rem,92%)]">
                  {streamingThinking ? (
                    <div className="rounded-xl border border-sky-300/15 bg-sky-300/10">
                      <button
                        type="button"
                        onClick={() => setShowThinking((prev) => !prev)}
                        className="flex w-full items-center justify-between px-2 py-2 text-left text-xs font-semibold text-sky-100 sm:px-4 sm:py-3 sm:text-sm"
                      >
                        Thinking
                        <span className="text-xs text-sky-200/70">{showThinking ? 'Hide' : 'Show'}</span>
                      </button>
                      {showThinking ? (
                        <p className="whitespace-pre-wrap border-t border-sky-300/10 px-2 py-2 text-xs leading-5 text-sky-100/80 sm:px-4 sm:py-3">
                          {streamingThinking}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-xs leading-5 text-slate-200 sm:p-4 sm:text-sm sm:leading-6">
                    <div className="markdown-content break-words">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          h1: ({ children }) => <h1 className="mb-2 mt-3 text-base font-bold text-white">{children}</h1>,
                          h2: ({ children }) => <h2 className="mb-2 mt-3 text-sm font-semibold text-white">{children}</h2>,
                          h3: ({ children }) => <h3 className="mb-1 mt-2 text-sm font-semibold text-slate-200">{children}</h3>,
                          ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-4">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-4">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          a: ({ children, href }) => <a href={href} className="text-amber-200 underline hover:text-amber-100" target="_blank" rel="noopener noreferrer">{children}</a>,
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="rounded bg-slate-800 px-1 py-0.5 text-xs text-amber-100">{children}</code>
                            ) : (
                              <pre className="mb-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs">
                                <code className="text-slate-200">{children}</code>
                              </pre>
                            );
                          },
                          blockquote: ({ children }) => <blockquote className="mb-2 border-l-2 border-amber-300/30 pl-3 italic text-slate-300">{children}</blockquote>,
                          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                        }}
                      >
                        {streamingContent || 'Listening and thinking...'}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 p-3 sm:p-5">
            {messages.length === 1 ? (
              <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
                {starterPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto min-h-[36px] whitespace-normal border-white/10 px-3 py-1.5 text-xs hover:bg-white/[0.055] hover:text-white sm:text-sm"
                    onClick={() => void sendMessage(prompt)}
                    disabled={!hasSnapshot || isStreaming}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-3">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Ask for help triaging bills..."
                className="min-h-[80px] w-full resize-none border-white/10 bg-slate-950/45 text-sm text-white sm:min-h-[72px] sm:text-base"
                disabled={isStreaming || !hasSnapshot}
              />
              <div className="flex gap-3">
                {isStreaming ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1 border-red-400/30 text-xs text-red-200 hover:bg-red-400/10 sm:h-auto sm:w-32 sm:text-sm"
                    onClick={stopStream}
                  >
                    <Square className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="h-11 flex-1 bg-amber-500 text-xs font-semibold text-slate-950 hover:bg-amber-600 sm:h-auto sm:w-32 sm:text-sm"
                    onClick={() => void sendMessage()}
                    disabled={!input.trim() || !hasSnapshot}
                  >
                    <Send className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Send
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
