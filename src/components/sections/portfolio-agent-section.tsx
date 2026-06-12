import { startTransition, useDeferredValue, useMemo, useRef, useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { suggestedQuestions } from "../../content/portfolio";
import { answerPortfolioQuestion } from "../../features/agent/engine";
import { isGroqProxyAvailable } from "../../features/agent/groq-provider";
import type { AgentInferenceMode, AgentMode, AgentResponse } from "../../features/agent/types";
import { useRunAnywhereRuntime } from "../../features/runanywhere/runtime-provider";
import { Button } from "../ui/button";
import { RichResponse } from "../ui/rich-response";

const modes: { id: AgentMode; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "recruiter", label: "Recruiter" },
  { id: "client", label: "Client" },
  { id: "technical", label: "Deep Dive" },
  { id: "project", label: "Projects" },
  { id: "capability", label: "Capability" },
];

const inferenceModes: { id: AgentInferenceMode; label: string }[] = [
  { id: "fallback", label: "Rule" },
  { id: "auto", label: "Smart" },
  { id: "groq", label: "Groq" },
  { id: "local", label: "Local" },
];

type Message = {
  role: "user" | "assistant";
  text: string;
  result?: AgentResponse;
};

export function countTokens(text: string): number {
  return text.split(/[\s\n]+/).filter(Boolean).length;
}

function PortfolioAgentSection() {
  const { snapshot, activate, bridge } = useRunAnywhereRuntime();
  const groqAvailable = isGroqProxyAvailable();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    text: "Ask me anything about my projects, skills, or fit for your team.",
  }]);
  const [mode, setMode] = useState<AgentMode>("auto");
  const [inferenceMode, setInferenceMode] = useState<AgentInferenceMode>("auto");
  const [isRunning, setIsRunning] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [genSpeed, setGenSpeed] = useState(0);
  const genTiming = useRef({ lastCount: 0, lastTime: 0 });
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const visibleInferenceModes = groqAvailable ? inferenceModes : inferenceModes.filter((e) => e.id !== "groq");

  const filteredSuggestions = useMemo(() => {
    const n = deferredQuery.trim().toLowerCase();
    if (!n) return suggestedQuestions.slice(0, 5);
    return suggestedQuestions.filter((q) => q.toLowerCase().includes(n)).slice(0, 5);
  }, [deferredQuery]);

  async function handleSend(text?: string) {
    const q = text ?? query;
    if (!q.trim() || isRunning) return;
    setQuery("");
    setIsRunning(true);
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    const runtime = inferenceMode === "fallback" ? null : inferenceMode === "local" ? bridge : snapshot.modelStatus === "active" ? bridge : null;
    setStreamingText("");
    setGenSpeed(0);
    genTiming.current = { lastCount: 0, lastTime: performance.now() };
    const result = await answerPortfolioQuestion({
      query: q,
      mode,
      inferenceMode,
      runtime,
      onToken: (t) => {
        setStreamingText(t);
        const tokenCount = countTokens(t);
        const now = performance.now();
        const elapsed = (now - genTiming.current.lastTime) / 1000;
        if (elapsed > 0.15) {
          const delta = tokenCount - genTiming.current.lastCount;
          if (delta > 0) setGenSpeed(delta / elapsed);
          genTiming.current = { lastCount: tokenCount, lastTime: now };
        }
        requestAnimationFrame(() => {
          listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        });
      },
    });
    const finalText = streamingText || result.answer;
    setStreamingText("");
    setGenSpeed(0);
    startTransition(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: finalText, result }]);
    });
    setIsRunning(false);
  }

  const providerLabel = inferenceMode === "fallback" ? "Rule-Based" : inferenceMode === "groq" ? "Groq" : inferenceMode === "local" ? "Local" : snapshot.modelStatus === "active" ? "Smart · Local" : "Smart";

  return (
    <section id="agent" className="section-space">
      <div className="section-frame">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-orange-500/50 bg-black/30 p-2.5 sm:rounded-3xl sm:p-3">
            {/* Chat header */}
            <div className="flex items-center justify-between rounded-xl border border-line/60 bg-canvas-elevated/70 px-4 py-2.5 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15">
                  <Bot size={14} className="text-accent" />
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent/70">Portfolio Chat</div>
                  <div className="text-[11px] text-muted">{providerLabel}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <select
                  value={inferenceMode}
                  onChange={(e) => setInferenceMode(e.target.value as AgentInferenceMode)}
                  className="rounded-md border border-line/60 bg-black/20 px-2 py-1 font-mono text-[9px] text-muted outline-none"
                >
                  {visibleInferenceModes.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as AgentMode)}
                  className="rounded-md border border-line/60 bg-black/20 px-2 py-1 font-mono text-[9px] text-muted outline-none"
                >
                  {modes.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
                <Button
                  variant={snapshot.modelStatus === "active" ? "primary" : "secondary"}
                  onClick={() => void activate()}
                  disabled={snapshot.modelStatus === "downloading" || snapshot.modelStatus === "loading"}
                  className="px-2.5 py-1 text-[9px]"
                >
                  {snapshot.modelStatus === "active" ? "Local ✓" : "Load"}
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex flex-col gap-3 rounded-xl border border-line/50 bg-black/25 p-3 min-h-[320px] max-h-[420px] overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${msg.role === "user" ? "bg-accent/15" : "bg-white/8"}`}>
                    {msg.role === "user" ? <User size={12} className="text-accent" /> : <Bot size={12} className="text-muted" />}
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent/15 border border-accent/20 text-ink"
                      : "bg-white/5 border border-line/50 text-muted"
                  }`}>
                    {msg.role === "assistant" && msg.result ? (
                      <div>
                        <RichResponse content={msg.text} empty="" />
                        {msg.result.evidence.length > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer font-mono text-[9px] uppercase tracking-[0.15em] text-accent/60 hover:text-accent">Evidence · {msg.result.evidence.length}</summary>
                            <div className="mt-2 grid gap-1.5">
                              {msg.result.evidence.map((e) => (
                                <div key={e.title} className="rounded-lg border border-line/50 bg-white/4 p-2">
                                  <div className="text-[11px] font-semibold text-ink">{e.title}</div>
                                  <div className="text-[10px] text-muted mt-0.5">{e.summary}</div>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                        {msg.result.followUps.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1 border-t border-line/30 pt-2">
                            {msg.result.followUps.map((f) => (
                              <button
                                key={f}
                                onClick={() => { setQuery(f); inputRef.current?.focus(); }}
                                className="rounded-full border border-line/50 px-2 py-0.5 text-[9px] text-muted hover:text-ink"
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isRunning && streamingText && (
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8">
                    <Bot size={12} className="text-muted" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl border border-line/50 bg-white/5 px-3.5 py-2.5 text-sm leading-relaxed text-muted">
                    <RichResponse content={streamingText} empty="" />
                    <span className="inline-block w-[2px] h-[14px] bg-accent/60 animate-pulse ml-0.5 align-text-bottom" />
                  </div>
                </div>
              )}
              {isRunning && !streamingText && (
                <div className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8">
                    <Bot size={12} className="text-muted" />
                  </div>
                  <div className="rounded-2xl border border-line/50 bg-white/5 px-3.5 py-2.5">
                    <span className="inline-flex gap-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="mt-2.5 flex gap-2">
              <textarea
                ref={inputRef}
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-line/60 bg-black/20 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-muted/50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about my work..."
                rows={1}
              />
              <Button onClick={() => handleSend()} disabled={isRunning || !query.trim()} className="h-[44px] w-[44px] shrink-0 justify-center p-0">
                <Send size={15} />
              </Button>
            </div>

            {/* Suggested prompts */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {filteredSuggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => { setQuery(q); inputRef.current?.focus(); }}
                  className="rounded-full border border-line/40 bg-white/3 px-2.5 py-1 text-[10px] text-muted/70 hover:text-ink hover:border-line/70 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
