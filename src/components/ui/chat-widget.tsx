import { startTransition, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Minimize2, Send, Sparkles, X } from "lucide-react";
import { brandProfile, suggestedQuestions } from "../../content/portfolio";
import { answerPortfolioQuestion } from "../../features/agent/engine";
import { isGroqProxyAvailable } from "../../features/agent/groq-provider";
import type { AgentInferenceMode, AgentMode, AgentResponse } from "../../features/agent/types";
import { useRunAnywhereRuntime } from "../../features/runanywhere/runtime-provider";
import { Button } from "../ui/button";
import { RichResponse } from "../ui/rich-response";

const modes: { id: AgentMode; label: string; color: string; badge: string }[] = [
  { id: "auto", label: "Auto", color: "text-purple-400", badge: "bg-purple-500/20 border-purple-500/30 text-purple-300" },
  { id: "recruiter", label: "Recruiter", color: "text-emerald-400", badge: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
  { id: "client", label: "Client", color: "text-sky-400", badge: "bg-sky-500/20 border-sky-500/30 text-sky-300" },
  { id: "technical", label: "Deep Dive", color: "text-amber-400", badge: "bg-amber-500/20 border-amber-500/30 text-amber-300" },
  { id: "project", label: "Projects", color: "text-rose-400", badge: "bg-rose-500/20 border-rose-500/30 text-rose-300" },
  { id: "capability", label: "Capability", color: "text-cyan-400", badge: "bg-cyan-500/20 border-cyan-500/30 text-cyan-300" },
];

const inferenceModes: { id: AgentInferenceMode; label: string }[] = [
  { id: "fallback", label: "Rule" },
  { id: "auto", label: "Smart" },
  { id: "groq", label: "Groq" },
  { id: "local", label: "Local" },
];

const DESKTOP_W = 440;
const DESKTOP_H = 620;
const MIN_W = 320;
const MIN_H = 400;

function SignalBar({ level, label }: { level: number; label: string }) {
  const bars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1.5" title={label}>
      <div className="flex gap-[2px] items-end">
        {bars.map((b) => (
          <div
            key={b}
            className="w-[3px] rounded-full transition-all"
            style={{
              height: `${b * 3}px`,
              backgroundColor: level >= b / 5 ? "rgb(251,146,60)" : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

type MsgMeta = { timeMs: number; tokens: number; selectedMode: AgentMode; selectedInference: AgentInferenceMode; provider: string };
type Msg = { role: "user" | "assistant"; text: string; result?: AgentResponse; meta?: MsgMeta };

function countTokens(text: string): number {
  return text.split(/[\s\n]+/).filter(Boolean).length;
}

export function ChatWidget() {
  const { snapshot, activate, bridge } = useRunAnywhereRuntime();
  const groqAvailable = isGroqProxyAvailable();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", text: "Ask me anything about my projects, skills, or fit for your team." }]);
  const [mode, setMode] = useState<AgentMode>("auto");
  const [inferenceMode, setInferenceMode] = useState<AgentInferenceMode>("auto");
  const [isRunning, setIsRunning] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [genTokens, setGenTokens] = useState(0);
  const [genSpeed, setGenSpeed] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const genTiming = useRef({ lastCount: 0, lastTime: 0 });
  const [panelSize, setPanelSize] = useState({ w: DESKTOP_W, h: DESKTOP_H });
  const [panelPos, setPanelPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0, startPx: 0, startPy: 0 });
  const visibleInferenceModes = groqAvailable ? inferenceModes : inferenceModes.filter((e) => e.id !== "groq");

  // Auto-scroll when messages change or during streaming
  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: smooth ? "smooth" : "instant" });
    });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages.length, isRunning, scrollToBottom]);

  const filteredSuggestions = useMemo(() => {
    const n = deferredQuery.trim().toLowerCase();
    if (!n) return suggestedQuestions.slice(0, 4);
    return suggestedQuestions.filter((q) => q.toLowerCase().includes(n)).slice(0, 4);
  }, [deferredQuery]);

  async function handleSend(text?: string) {
    const q = text ?? query;
    if (!q.trim() || isRunning) return;
    setQuery("");
    setIsRunning(true);
    const sentMode = mode;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    scrollToBottom(false);

    // Auto-activate local model when local mode selected and model not active
    if (inferenceMode === "local" && snapshot.modelStatus !== "active") {
      try { await activate(); } catch { /* engine falls back gracefully */ }
    }

    const runtime = inferenceMode === "fallback" ? null : inferenceMode === "local" ? bridge : snapshot.modelStatus === "active" ? bridge : null;
    const startTime = performance.now();
    setStreamingText("");
    setGenTokens(0);
    setGenSpeed(0);
    genTiming.current = { lastCount: 0, lastTime: startTime };
    const result = await answerPortfolioQuestion({
      query: q, mode: sentMode, inferenceMode, runtime,
      onToken: (t) => {
        setStreamingText(t);
        const tokenCount = countTokens(t);
        setGenTokens(tokenCount);
        const now = performance.now();
        const elapsed = (now - genTiming.current.lastTime) / 1000;
        if (elapsed > 0.15) {
          const delta = tokenCount - genTiming.current.lastCount;
          if (delta > 0) {
            setGenSpeed(delta / elapsed);
          }
          genTiming.current = { lastCount: tokenCount, lastTime: now };
        }
        scrollToBottom();
      },
    });
    const elapsed = Math.round(performance.now() - startTime);
    const finalText = streamingText || result.answer;
    setStreamingText("");
    setGenTokens(0);
    setGenSpeed(0);
    startTransition(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: finalText, result, meta: { timeMs: elapsed, tokens: countTokens(finalText), selectedMode: sentMode, selectedInference: inferenceMode, provider: result.providerLabel } }]);
    });
    setIsRunning(false);
  }

  const handleFollowUp = useCallback((q: string) => {
    handleSend(q);
  }, [mode, inferenceMode, isRunning]);

  // drag to move
  const onDragStart = useCallback((e: React.PointerEvent) => {
    if (isFullScreen) return;
    setIsDragging(true);
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.startPx = panelPos.x;
    dragRef.current.startPy = panelPos.y;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isFullScreen, panelPos]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => {
      setPanelPos((p) => ({
        x: p.x + e.clientX - dragRef.current.startX,
        y: p.y + e.clientY - dragRef.current.startY,
      }));
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [isDragging]);

  // resize handle
  const onResizeStart = useCallback((e: React.PointerEvent) => {
    if (isFullScreen) return;
    setIsResizing(true);
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.startW = panelSize.w;
    dragRef.current.startH = panelSize.h;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isFullScreen, panelSize]);

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: PointerEvent) => {
      const dw = e.clientX - dragRef.current.startX;
      const dh = e.clientY - dragRef.current.startY;
      setPanelSize((s) => ({
        w: Math.max(MIN_W, Math.min(s.w + dw, window.innerWidth - 48)),
        h: Math.max(MIN_H, Math.min(s.h + dh, window.innerHeight - 48)),
      }));
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [isResizing]);

  const isLocalActive = snapshot.modelStatus === "active";
  const providerLabel = inferenceMode === "fallback" ? "Rule" : inferenceMode === "groq" ? "Groq" : inferenceMode === "local" ? "Local" : isLocalActive ? "Smart" : "Smart";

  return (
    <>
      {/* Chat bubble button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-orange-500 shadow-lg shadow-accent/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/30 p-0.5"
        >
          <img
            src={brandProfile.portraitUrl}
            alt="Chat"
            className="h-full w-full rounded-full object-cover ring-2 ring-white/10"
          />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-50 origin-bottom-right animate-in fade-in slide-in-from-bottom-4 duration-200"
          style={
            isFullScreen
              ? { inset: 0 }
              : {
                  bottom: 16,
                  right: 16,
                  width: panelSize.w,
                  height: panelSize.h,
                  transform: `translate(${panelPos.x}px, ${panelPos.y}px)`,
                }
          }
        >
          <div className={`flex flex-col h-full ${isFullScreen ? "rounded-none border-0" : "rounded-2xl border border-orange-500/50"} bg-gradient-to-b from-black/98 via-black/95 to-black/98 shadow-2xl shadow-black/60 backdrop-blur-xl overflow-hidden`}>
            {/* Header — drag handle */}
            <div
              onPointerDown={onDragStart}
              className={`flex items-center justify-between bg-gradient-to-r from-accent/15 to-orange-500/10 px-4 py-3 border-b border-orange-500/20 shrink-0 ${!isFullScreen ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <img
                    src={brandProfile.portraitUrl}
                    alt="Vicky"
                    className="h-8 w-8 shrink-0 rounded-xl object-cover ring-1 ring-accent/30"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-black" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80 truncate flex items-center gap-1.5">
                    <Sparkles size={10} className="text-accent/60" />
                    Portfolio Chat
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`inline-flex items-center rounded-full border px-1.5 py-[1px] font-mono text-[8px] uppercase tracking-wider ${modes.find(m => m.id === mode)?.badge ?? "border-line/30 text-muted/50"}`}>
                      {mode}
                    </span>
                    <span className="text-[8px] text-muted/50 font-mono">{providerLabel}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <select
                  value={inferenceMode}
                  onChange={(e) => setInferenceMode(e.target.value as AgentInferenceMode)}
                  className="rounded-md border border-line/50 bg-black/40 px-1.5 py-0.5 font-mono text-[8px] text-muted outline-none"
                >
                  {visibleInferenceModes.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as AgentMode)}
                  className="rounded-md border border-line/50 bg-black/40 px-1.5 py-0.5 font-mono text-[8px] text-muted outline-none"
                >
                  {modes.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => void activate()}
                  disabled={snapshot.modelStatus === "downloading" || snapshot.modelStatus === "loading"}
                  className="rounded-md border px-1.5 py-0.5 font-mono text-[8px] transition shrink-0"
                  style={{
                    borderColor: isLocalActive ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.15)",
                    color: isLocalActive ? "rgb(16,185,129)" : "rgba(255,255,255,0.5)",
                    backgroundColor: isLocalActive ? "rgba(16,185,129,0.1)" : "transparent",
                  }}
                >
                  {isLocalActive ? "Local ✓" : "Load"}
                </button>
                <button
                  onClick={() => setIsFullScreen((v) => !v)}
                  className="text-muted hover:text-ink ml-0.5"
                  title={isFullScreen ? "Minimize" : "Full screen"}
                >
                  {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button onClick={() => { setOpen(false); setIsFullScreen(false); setPanelPos({ x: 0, y: 0 }); setPanelSize({ w: DESKTOP_W, h: DESKTOP_H }); }} className="text-muted hover:text-ink ml-0.5">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role === "assistant" ? (
                      <img
                        src={brandProfile.portraitUrl}
                        alt="Vicky"
                        className="h-6 w-6 shrink-0 rounded-full object-cover mt-0.5 ring-1 ring-accent/20"
                      />
                    ) : (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/10 mt-0.5 ring-1 ring-accent/20">
                        <Send size={10} className="text-accent" />
                      </div>
                    )}
                    <div className={`${
                      msg.role === "user" ? "max-w-[85%]" : "max-w-[88%]"
                    } rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/25 text-ink"
                        : "bg-white/[0.04] border border-orange-500/30 text-muted"
                    }`}>
                      {msg.role === "assistant" && msg.result ? (
                        <div>
                          {/* Mode badge row */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center rounded-full border px-1.5 py-[1px] font-mono text-[7px] uppercase tracking-wider ${modes.find(m => m.id === msg.result!.mode)?.badge ?? "border-line/30 text-muted/50"}`}>
                              {msg.result.mode}
                            </span>
                            <SignalBar level={msg.result.evidence.length / 5} label="Signal strength" />
                            {msg.result.evidence.length > 0 && (
                              <span className="text-[7px] font-mono text-muted/40">{msg.result.evidence.length} sources</span>
                            )}
                          </div>
                          <RichResponse content={msg.text} empty="" />
                          {msg.meta && (
                            <div className="mt-2 flex items-center gap-2.5 border-t border-orange-500/10 pt-1.5">
                              <span className="font-mono text-[7px] text-muted/40 flex items-center gap-1">
                                <span>⚡</span>{msg.meta.tokens}
                              </span>
                              <span className="font-mono text-[7px] text-muted/40 flex items-center gap-1">
                                <span>⏱</span>{msg.meta.timeMs}ms
                              </span>
                              <span className={`font-mono text-[7px] flex items-center gap-1 ${modes.find(m => m.id === msg.meta!.selectedMode)?.color ?? "text-muted/40"}`}>
                                {msg.meta.selectedMode}
                              </span>
                              <span className="font-mono text-[7px] text-muted/40">·</span>
                              <span className="font-mono text-[7px] text-muted/40">{msg.meta.provider}</span>
                            </div>
                          )}
                          {msg.result.evidence.length > 0 && (
                            <details className="mt-2.5">
                              <summary className="cursor-pointer font-mono text-[8px] uppercase tracking-[0.15em] text-accent/50 hover:text-accent/80 flex items-center gap-1">
                                <span>Evidence</span>
                                <span className="inline-flex items-center justify-center rounded-full bg-accent/15 text-accent/70 h-3.5 min-w-[14px] px-1 text-[7px] font-mono">{msg.result.evidence.length}</span>
                              </summary>
                              <div className="mt-2 grid gap-1.5">
                                {msg.result.evidence.map((e) => (
                                  <div key={e.title} className="rounded-lg border border-accent/10 bg-accent/[0.03] p-2">
                                    <div className="flex items-center gap-1.5">
                                      <div className="h-1.5 w-1.5 rounded-full bg-accent/40 shrink-0" />
                                      <div className="text-[10px] font-semibold text-ink">{e.title}</div>
                                    </div>
                                    <div className="text-[9px] text-muted mt-0.5 ml-3">{e.summary}</div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                          {msg.result.followUps.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-accent/10 pt-2">
                              <div className="w-full mb-0.5 font-mono text-[7px] uppercase tracking-wider text-muted/30">Quick ask</div>
                              {msg.result.followUps.slice(0, 3).map((f) => (
                                <button
                                  key={f}
                                  onClick={() => handleFollowUp(f)}
                                  className="rounded-full border border-accent/20 bg-accent/[0.04] px-2.5 py-1 text-[10px] text-accent/60 hover:text-accent hover:bg-accent/10 hover:border-accent/40 transition cursor-pointer"
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
                  <div className="flex gap-2.5">
                    <img
                      src={brandProfile.portraitUrl}
                      alt="Vicky"
                      className="h-6 w-6 shrink-0 rounded-full object-cover mt-0.5 ring-1 ring-accent/20"
                    />
                    <div className="max-w-[88%] rounded-2xl border border-orange-500/30 bg-white/[0.04] px-4 py-2.5 text-[14px] leading-relaxed text-muted">
                      <RichResponse content={streamingText} empty="" />
                      <span className="inline-block w-[2px] h-[14px] bg-accent/60 animate-pulse ml-0.5 align-text-bottom" />
                    </div>
                  </div>
                )}
                {isRunning && !streamingText && (
                  <div className="flex gap-2.5">
                    <img
                      src={brandProfile.portraitUrl}
                      alt="Vicky"
                      className="h-6 w-6 shrink-0 rounded-full object-cover mt-0.5 ring-1 ring-accent/20"
                    />
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
                      <span className="inline-flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-accent/15 px-4 py-3 shrink-0">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  className="min-h-[48px] max-h-[120px] flex-1 resize-none rounded-xl border border-emerald-500/30 bg-black/50 px-3.5 py-3 text-[14px] text-ink outline-none placeholder:text-muted/50 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about my projects, skills, or fit..."
                  rows={1}
                />
                <Button onClick={() => handleSend()} disabled={isRunning || !query.trim()} className="h-[48px] w-[48px] shrink-0 justify-center p-0 rounded-xl bg-gradient-to-br from-accent to-orange-500 hover:from-accent/90 hover:to-orange-500/90">
                  <Send size={15} />
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {filteredSuggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="rounded-full border border-accent/20 bg-accent/[0.03] px-2.5 py-1 text-[10px] sm:text-[11px] text-accent/60 hover:text-accent hover:bg-accent/10 hover:border-accent/40 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Resize handle */}
            {!isFullScreen && (
              <div
                onPointerDown={onResizeStart}
                className="absolute bottom-0 right-0 w-5 h-5 cursor-nw-resize"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" className="absolute bottom-1 right-1 text-white/20">
                  <line x1="9" y1="12" x2="12" y2="9" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="5" y1="12" x2="12" y2="5" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="1" y1="12" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
