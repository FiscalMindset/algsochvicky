import { useCallback, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Cpu, DownloadCloud, HardDriveDownload, LoaderCircle, Send, Sparkles, Zap } from "lucide-react";
import { localLanguageModel } from "../../features/runanywhere/model-catalog";
import { useRunAnywhereRuntime } from "../../features/runanywhere/runtime-provider";
import { answerPortfolioQuestion } from "../../features/agent/engine";
import type { AgentResponse } from "../../features/agent/types";
import { formatBytes, sentenceCase } from "../../lib/utils";
import { Button } from "../ui/button";
import { SectionHeading } from "../ui/section-heading";
import { FiscalMindsetBadge } from "../ui/fiscalmindset-badge";
import { RichResponse } from "../ui/rich-response";
import { RunAnywhereBg } from "../visuals/runanywhere-bg";

function countTokens(text: string): number {
  return text.split(/[\s\n]+/).filter(Boolean).length;
}

const statusConfig = {
  "not-downloaded": { label: "Not Downloaded", tone: "text-muted", icon: <HardDriveDownload size={16} /> },
  downloading: { label: "Downloading", tone: "text-accent", icon: <DownloadCloud size={16} /> },
  ready: { label: "Ready", tone: "text-success", icon: <CheckCircle2 size={16} /> },
  loading: { label: "Loading", tone: "text-warning", icon: <LoaderCircle size={16} className="animate-spin" /> },
  active: { label: "Active", tone: "text-success", icon: <Cpu size={16} /> },
  failed: { label: "Failed", tone: "text-danger", icon: <AlertTriangle size={16} /> }
} as const;

function RingChart({ pct, size = 56, color = "rgb(251,146,60)" }: { pct: number; size?: number; color?: string }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct, 1);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dasharray 0.6s ease" }} />
    </svg>
  );
}

function BarChart({ bars }: { bars: { label: string; value: number; max: number; color: string }[] }) {
  return (
    <div className="grid gap-2.5">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted/60">{b.label}</span>
            <span className="font-mono text-[9px] text-muted/40">{Math.round((b.value / b.max) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/6 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(b.value / b.max) * 100}%`, backgroundColor: b.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LocalRuntimeSection() {
  const { snapshot, activate, release, clearCache, bridge } = useRunAnywhereRuntime();
  const status = statusConfig[snapshot.modelStatus];
  const isBusy = snapshot.initializing || snapshot.modelStatus === "downloading" || snapshot.modelStatus === "loading";
  const [chatQuery, setChatQuery] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatRunning, setChatRunning] = useState(false);
  const [chatPhase, setChatPhase] = useState<"idle" | "activating" | "loading" | "generating" | "done" | "error">("idle");
  const [chatMeta, setChatMeta] = useState<{ timeMs: number; tokens: number; queryTokens: number; model: string; provider: string } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const streamBufRef = useRef("");
  const rafRef = useRef(0);

  const handleTestQuery = useCallback(async () => {
    const q = chatQuery.trim();
    if (!q || chatRunning) return;
    const queryTokens = countTokens(q);
    setChatRunning(true);
    setChatResponse("");
    setChatMeta(null);
    streamBufRef.current = "";
    if (streamRef.current) streamRef.current.textContent = "";

    if (snapshot.modelStatus !== "active" && snapshot.modelStatus !== "ready") {
      setChatPhase("activating");
      try {
        await activate();
      } catch {
        setChatPhase("error");
        setChatResponse("Model activation failed. Try clicking Download + Activate manually.");
        setChatRunning(false);
        return;
      }
    }

    if (snapshot.modelStatus === "ready") {
      setChatPhase("loading");
      try {
        await activate();
      } catch {
        setChatPhase("error");
        setChatResponse("Model loading failed.");
        setChatRunning(false);
        return;
      }
    }

    setChatPhase("generating");
    const startTime = performance.now();
    try {
      const result: AgentResponse = await answerPortfolioQuestion({
        query: q, mode: "auto", inferenceMode: "local", runtime: bridge,
        onToken: (t) => {
          streamBufRef.current = t;
          if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(() => {
              if (streamRef.current) {
                streamRef.current.textContent = streamBufRef.current;
              }
              rafRef.current = 0;
            });
          }
        },
      });
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      const elapsed = Math.round(performance.now() - startTime);
      const finalText = streamBufRef.current || result.answer;
      if (streamRef.current) streamRef.current.textContent = finalText;
      setChatResponse(finalText);
      setChatMeta({
        timeMs: elapsed,
        tokens: countTokens(finalText),
        queryTokens,
        model: result.providerModel ?? localLanguageModel.name,
        provider: result.providerLabel,
      });
      setChatPhase("done");
    } catch {
      setChatPhase("error");
      setChatResponse("Local inference failed. The model may not be fully loaded.");
    }
    setChatRunning(false);
  }, [chatQuery, chatRunning, snapshot.modelStatus, activate, bridge]);

  return (
    <section id="runtime" className="section-space relative">
      <RunAnywhereBg embedded />
      <div className="section-frame relative" style={{ zIndex: 1 }}>
        <div className="rounded-xl border border-orange-500/50 bg-black/20 p-5 sm:rounded-2xl sm:border-2 sm:p-6 lg:rounded-3xl lg:p-10 backdrop-blur-sm">
          <SectionHeading
            eyebrow="RunAnywhere SDK / On-Device AI"
            title="A real browser runtime, not a decorative local-AI claim."
            description="This portfolio includes a proper local model control surface built around RunAnywhere's Web SDK: click-to-download activation, OPFS caching, visible lifecycle state, progressive loading, and reusable browser-local inference."
            aside={
              <p>
                Activation is real. When the model is missing, clicking the runtime starts download and cache setup
                automatically. Later visits reuse the cached model instead of downloading again.
              </p>
            }
          />

          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            {/* Left — Dashboard Panel */}
            <div className="rounded-[32px] border border-line/75 bg-black/60 p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent/75">Runtime Control Panel</div>
                  <h3 className="mt-3 text-2xl font-semibold text-ink">Activate Local AI</h3>
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm shrink-0 ${status.tone}`} style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                  {status.icon}
                  {status.label}
                </div>
              </div>

              {/* Metric cards with varied colors */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-emerald-400/70">Model</div>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/50" />
                  </div>
                  <div className="mt-2 text-sm font-medium text-ink">{localLanguageModel.name}</div>
                  <div className="mt-0.5 text-[10px] text-emerald-400/60">{localLanguageModel.purpose}</div>
                </div>
                <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-sky-400/70">Memory</div>
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-400/50" />
                  </div>
                  <div className="mt-2 text-sm font-medium text-ink">{formatBytes(snapshot.memoryRequirement)}</div>
                  <div className="mt-0.5 text-[10px] text-sky-400/60">Model size on disk</div>
                </div>
                <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-purple-400/70">Acceleration</div>
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400/50" />
                  </div>
                  <div className="mt-2 text-sm font-medium text-ink">{sentenceCase(snapshot.accelerationMode)}</div>
                  <div className="mt-0.5 text-[10px] text-purple-400/60">Inference backend</div>
                </div>
                <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-amber-400/70">Cache</div>
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400/50" />
                  </div>
                  <div className="mt-2 text-sm font-medium text-ink">{snapshot.cached ? "OPFS cache detected" : "No local cache yet"}</div>
                  <div className="mt-0.5 text-[10px] text-amber-400/60">{snapshot.crossOriginIsolated ? "SharedArrayBuffer ready" : "Fallback mode"}</div>
                </div>
              </div>

              {/* Lifecycle progress */}
              <div className="mt-6 rounded-[26px] border border-line/70 bg-black/30 p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Lifecycle Progress</div>
                  {snapshot.detail && <div className="text-xs text-muted/60 truncate ml-2">{snapshot.detail}</div>}
                </div>
                <div className="h-2 rounded-full bg-white/6 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-accent to-purple-500 transition-all duration-500" style={{ width: `${Math.max(snapshot.progress * 100, snapshot.modelStatus === "active" ? 100 : snapshot.modelStatus === "downloading" ? 33 : 0)}%` }} />
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    { step: "Download", complete: snapshot.cached || snapshot.modelStatus === "downloading" || snapshot.modelStatus === "active", color: "emerald" },
                    { step: "Load", complete: snapshot.modelStatus === "loading" || snapshot.modelStatus === "active", color: "accent" },
                    { step: "Answer", complete: snapshot.modelStatus === "active", color: "purple" }
                  ].map(({ step, complete, color }) => (
                    <div key={step} className={`rounded-2xl border p-3 transition-all ${complete ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/[0.06] bg-white/[0.02]"}`}>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${complete ? `bg-${color === "accent" ? "accent" : `${color}-500`}` : "bg-white/10"}`} />
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{step}</div>
                      </div>
                      <div className={`mt-2 text-sm font-medium ${complete ? "text-emerald-400" : "text-muted/50"}`}>
                        {complete ? "Ready" : "Pending"}
                      </div>
                    </div>
                  ))}
                </div>
                {snapshot.lastError ? (
                  <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
                    {snapshot.lastError}
                  </div>
                ) : null}
              </div>

              {/* Action buttons */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Button onClick={() => void activate()} disabled={isBusy} className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border-0">
                  {snapshot.cached ? "Load Local Model" : "Download + Activate"}
                </Button>
                <Button variant="secondary" onClick={() => void release()} disabled={snapshot.modelStatus !== "active" || isBusy} className="w-full">
                  Release Runtime
                </Button>
                <Button variant="secondary" onClick={() => void clearCache()} disabled={isBusy || !snapshot.cached} className="w-full">
                  Clear Cached Model
                </Button>
              </div>
            </div>

            {/* Right — Visual Dashboard, Charts & Inline Test */}
            <div className="grid gap-5">
              {/* Model Profile dashboard */}
              <div className="rounded-[32px] border border-line/75 bg-black/60 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Model Profile</div>
                  <div className="flex items-center gap-2">
                    <RingChart pct={snapshot.cached ? 1 : snapshot.modelStatus === "downloading" ? snapshot.progress : 0.15} color={snapshot.modelStatus === "active" ? "rgb(16,185,129)" : snapshot.cached ? "rgb(168,85,247)" : "rgba(255,255,255,0.25)"} />
                    <div className="text-[10px] font-mono text-muted/40 leading-tight">
                      <div>{localLanguageModel.name.split(" ")[0]}</div>
                      <div>{localLanguageModel.name.split(" ")[1] ?? ""}</div>
                    </div>
                  </div>
                </div>
                <BarChart
                  bars={[
                    { label: "Model Size", value: snapshot.memoryRequirement, max: 500_000_000, color: "rgb(16,185,129)" },
                    { label: "Acceleration", value: snapshot.accelerationMode === "webgpu" ? 85 : snapshot.accelerationMode === "wasm" ? 50 : 20, max: 100, color: "rgb(56,189,248)" },
                    { label: "Cache", value: snapshot.cached ? 100 : 0, max: 100, color: "rgb(168,85,247)" },
                    { label: "Isolation", value: snapshot.crossOriginIsolated ? 100 : 35, max: 100, color: "rgb(251,146,60)" },
                  ]}
                />
                {snapshot.lastMetrics ? (
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                    <div className="text-center">
                      <div className="font-mono text-[18px] font-semibold text-emerald-400">{snapshot.lastMetrics.tokensUsed}</div>
                      <div className="font-mono text-[8px] uppercase tracking-wider text-muted/40">Tokens</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[18px] font-semibold text-sky-400">{snapshot.lastMetrics.tokensPerSecond.toFixed(1)}</div>
                      <div className="font-mono text-[8px] uppercase tracking-wider text-muted/40">T/s</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[18px] font-semibold text-amber-400">{snapshot.lastMetrics.latencyMs}ms</div>
                      <div className="font-mono text-[8px] uppercase tracking-wider text-muted/40">Latency</div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-muted/30">
                      <div className={`h-1.5 w-1.5 rounded-full ${snapshot.modelStatus === "active" ? "bg-emerald-400 animate-pulse" : "bg-white/10"}`} />
                      {snapshot.modelStatus === "active" ? "Model ready — type a query below to see live metrics" : "Activate the model to see live inference metrics"}
                    </div>
                  </div>
                )}
              </div>

              {/* Inline test chatbox */}
              <div className="rounded-[32px] border border-line/75 bg-black/60 p-5 backdrop-blur-sm">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75 flex items-center gap-2 mb-3">
                  <Sparkles size={12} className="text-accent/60" />
                  Test Local Inference
                </div>
                <p className="text-xs text-muted/60 mb-3">
                  Ask a question — auto-activates the model if not already running.
                </p>
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    className="min-h-[40px] max-h-[80px] flex-1 resize-none rounded-xl border border-emerald-500/25 bg-black/40 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-muted/40 focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleTestQuery(); } }}
                    placeholder="Ask a question to test local inference..."
                    rows={1}
                  />
                  <Button onClick={handleTestQuery} disabled={chatRunning || !chatQuery.trim()} className="h-[40px] w-[40px] shrink-0 justify-center p-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500">
                    <Send size={14} />
                  </Button>
                </div>
                {chatPhase !== "idle" && (
                  <div className="mt-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.03] p-3">
                    {/* Activation phase — live animated status */}
                    {(chatPhase === "activating" || chatPhase === "loading") && (
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <DownloadCloud size={20} className="text-emerald-400/60 animate-pulse" />
                          <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex gap-0.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                            <span className="text-xs font-mono text-emerald-400/80">
                              {chatPhase === "activating" ? "Downloading model..." : "Loading into runtime..."}
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 rounded-full bg-white/6 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                              style={{ width: `${Math.min(100, Math.max(5, snapshot.progress * 100))}%` }}
                            />
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[8px] font-mono text-muted/40">
                            <span>{snapshot.detail || (chatPhase === "activating" ? "Preparing model files..." : "Loading model weights...")}</span>
                            <span>{Math.round(snapshot.progress * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Generating phase — direct DOM streaming */}
                    {chatPhase === "generating" && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 opacity-40">
                          <div className="flex gap-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          <span className="text-[8px] font-mono text-emerald-400/50">generating tokens...</span>
                        </div>
                        <div ref={streamRef} className="text-[13px] text-muted leading-relaxed whitespace-pre-wrap" />
                      </div>
                    )}

                    {/* Done phase — final output + metadata */}
                    {chatPhase === "done" && (
                      <>
                        <div className="text-[13px] text-muted leading-relaxed">
                          <RichResponse content={chatResponse} empty="" />
                        </div>
                        {chatMeta && (
                          <div className="mt-2.5 flex items-center gap-3 border-t border-emerald-500/10 pt-2">
                            <span className="font-mono text-[7px] text-muted/40 flex items-center gap-1">
                              <span>📝</span>{chatMeta.queryTokens} in
                            </span>
                            <span className="font-mono text-[7px] text-muted/40 flex items-center gap-1">
                              <span>⚡</span>{chatMeta.tokens} out
                            </span>
                            <span className="font-mono text-[7px] text-muted/40 flex items-center gap-1">
                              <span>⏱</span>{chatMeta.timeMs}ms
                            </span>
                            <span className="font-mono text-[7px] text-emerald-400/60 flex items-center gap-1">
                              {chatMeta.model.split(" ")[0]}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Error phase */}
                    {chatPhase === "error" && chatResponse && (
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
                        <span className="text-[13px] text-rose-400/90">{chatResponse}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <FiscalMindsetBadge />
        </div>
      </div>
    </section>
  );
}
