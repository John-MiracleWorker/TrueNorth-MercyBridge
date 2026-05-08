// This is a patch file - apply these specific fixes to StewardshipCoach.tsx

// FIX 1: Header section - reduce text sizes on mobile
// Line ~315: Change the header div to:
<div className="border-b border-slate-700 p-4 sm:p-5">
  <h2 className="text-lg font-bold text-white sm:text-2xl">MercyBridge Conversation</h2>
  <p className="mt-1 text-xs text-slate-400 sm:text-sm">
    Ask about bill triage, hardship calls, direct-pay proof, or one next step.
  </p>
</div>

// FIX 2: Message avatars - fix alignment and sizing
// Replace the message mapping section with proper mobile spacing:
{messages.map((message, index) => (
  <div
    key={`${message.role}-${index}`}
    className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
  >
    {message.role === 'assistant' ? (
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200 sm:h-9 sm:w-9">
        <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>
    ) : null}
    <div
      className={`max-w-[calc(100%-2.5rem)] rounded-xl border p-2.5 text-xs leading-5 sm:max-w-[min(42rem,82%)] sm:p-4 sm:text-sm sm:leading-6 ${
        message.role === 'user'
          ? 'border-amber-300/20 bg-amber-300/10 text-amber-50'
          : 'border-slate-700 bg-slate-950/70 text-slate-200'
      }`}
    >
      <p className="whitespace-pre-wrap break-words">{message.content}</p>
    </div>
    {message.role === 'user' ? (
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200 sm:h-9 sm:w-9">
        <UserRound className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>
    ) : null}
  </div>
))}

// FIX 3: Streaming thinking section - smaller padding on mobile
{streamingThinking ? (
  <div className="rounded-xl border border-sky-300/15 bg-sky-300/10">
    <button
      type="button"
      onClick={() => setShowThinking((prev) => !prev)}
      className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold text-sky-100 sm:px-4 sm:py-3 sm:text-sm"
    >
      Thinking
      <span className="text-xs text-sky-200/70">{showThinking ? 'Hide' : 'Show'}</span>
    </button>
    {showThinking ? (
      <p className="whitespace-pre-wrap border-t border-sky-300/10 px-3 py-2 text-xs leading-5 text-sky-100/80 sm:px-4 sm:py-3">
        {streamingThinking}
      </p>
    ) : null}
  </div>
) : null}

// FIX 4: Starter prompts - ensure they wrap properly and don't overlap
<div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
  {starterPrompts.map((prompt) => (
    <Button
      key={prompt}
      type="button"
      variant="outline"
      size="sm"
      className="h-auto min-h-[36px] whitespace-normal border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800 hover:text-white sm:text-sm"
      onClick={() => void sendMessage(prompt)}
      disabled={!hasSnapshot || isStreaming}
    >
      {prompt}
    </Button>
  ))}
</div>

// FIX 5: Textarea - proper mobile sizing with resize disabled
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
  className="min-h-[80px] w-full resize-none border-slate-700 bg-slate-950 text-sm text-white sm:min-h-[72px] sm:text-base"
  disabled={isStreaming || !hasSnapshot}
/>

// FIX 6: Send/Stop buttons - full width on mobile
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
