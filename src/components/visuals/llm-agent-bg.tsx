"use client";
import { useEffect, useState } from "react";

const repos = [
  "algsoch", "speakai", "careops", "algsochnews",
  "Synapse-Graph", "brain_tumor", "venture_analyst",
  "PathPilot-India", "devalert", "autopr",
  "Cognivise", "smart_terminal", "job_agentic"
];

const datasetSamples = [
  "{ repo: algsoch, mode: 7_learning, status: offline }",
  "{ repo: speakai, lang: en, runtime: browser_wasm }",
  "{ repo: careops, sources: 9_medical, sql: coral }",
  "{ repo: Synapse-Graph, focus: circuit_discovery }",
  "{ repo: algsochnews, agents: 5, output: mp4 }",
  "{ repo: brain_tumor, model: cnn, accuracy: 0.94 }",
];

const deployTargets = [
  { platform: "Android", signal: "algsoch" },
  { platform: "Browser WASM", signal: "speakai" },
  { platform: "Vercel", signal: "algsochnews" },
  { platform: "Render", signal: "venture_analyst" },
];

const promptExamples = [
  { q: "> /profile", r: "Applied Intelligence Engineer · 23 repos · 6 categories" },
  { q: "> /systems algsoch", r: "Android · Kotlin · SmolLM2 · 7 learning modes · offline" },
  { q: "> /systems careops", r: "Next.js · Coral SQL · 9 data sources · healthcare" },
  { q: "> /skills", r: "Languages 4 · AI/ML 6 · Frontend 5 · Backend 4 · Infra 3 · Tools 3" },
  { q: "> /featured", r: "algsoch · speakai · careops · algsoch-news" },
];

type Phase = "training" | "deploying" | "running";

export function LLMAgentBg({ embedded }: { embedded?: boolean }) {
  const [phase, setPhase] = useState<Phase>("training");
  const [lossVal, setLossVal] = useState(2.4);
  const [epoch, setEpoch] = useState(0);
  const [dataIdx, setDataIdx] = useState(0);
  const [deployStep, setDeployStep] = useState(0);
  const [deployDone, setDeployDone] = useState<string[]>([]);
  const [promptIdx, setPromptIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => p === "training" ? "deploying" : p === "deploying" ? "running" : "training");
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // training phase
  useEffect(() => {
    if (phase !== "training") return;
    const t1 = setInterval(() => { setLossVal((p) => Math.max(0.08, p - (0.01 + Math.random() * 0.04))); }, 500);
    const t2 = setInterval(() => { setEpoch((p) => p + 1); }, 2000);
    const t3 = setInterval(() => { setDataIdx((p) => (p + 1) % datasetSamples.length); }, 1200);
    const t4 = setInterval(() => { setScore((p) => Math.min(0.97, p + 0.01 + Math.random() * 0.03)); }, 800);
    return () => { clearInterval(t1); clearInterval(t2); clearInterval(t3); clearInterval(t4); };
  }, [phase]);

  // deploying phase
  useEffect(() => {
    if (phase !== "deploying") { setDeployStep(0); setDeployDone([]); return; }
    const t1 = setInterval(() => {
      setDeployStep((p) => {
        if (p >= deployTargets.length) return 0;
        setDeployDone((d) => [...d, deployTargets[p].platform]);
        return p + 1;
      });
    }, 2000);
    return () => clearInterval(t1);
  }, [phase]);

  // running phase
  useEffect(() => {
    if (phase !== "running") { setPromptIdx(0); setCharIdx(0); return; }
    const t1 = setInterval(() => {
      setPromptIdx((p) => (p + 1) % promptExamples.length);
      setCharIdx(0);
    }, 4000);
    const t2 = setInterval(() => {
      setCharIdx((p) => {
        const r = promptExamples[promptIdx]?.r ?? "";
        return p < r.length ? p + 1 : p;
      });
    }, 30);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, [phase, promptIdx]);

  return (
    <div className={`pointer-events-none ${embedded ? "absolute" : "fixed"} inset-0 overflow-hidden opacity-[0.4] select-none`}>
      {/* top-left: phase indicator */}
      <div className="absolute left-6 top-6 font-mono">
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${phase === "training" ? "bg-amber-400 animate-pulse" : phase === "deploying" ? "bg-cyan-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted/60">
            {phase === "training" ? "Phase 1/3 · Training" : phase === "deploying" ? "Phase 2/3 · Deploying" : "Phase 3/3 · Run Prompt"}
          </span>
        </div>
      </div>

      {/* top-right: portfolio signal */}
      <div className="absolute right-6 top-6 font-mono text-[7px] uppercase tracking-[0.2em] text-muted/30">
        vicky kumar · applied intelligence
      </div>

      {/* PHASE 1: TRAINING — left side: data pipeline */}
      {phase === "training" && (
        <>
          <div className="absolute left-6 top-20 font-mono text-[8px] leading-5 text-accent/70">
            <div className="text-[7px] uppercase tracking-[0.2em] text-muted/50 mb-1.5">training data</div>
            {datasetSamples.slice(0, 4).map((d, i) => (
              <div key={d} className="flex items-center gap-1.5" style={{ opacity: i === dataIdx % 4 ? 1 : 0.15 }}>
                <span className="text-muted/40">⊡</span>
                <span className={i === dataIdx % 4 ? "text-accent" : "text-muted/60"}>{d}</span>
              </div>
            ))}
          </div>

          {/* center: loss curve */}
          <div className="absolute left-1/2 top-20 -translate-x-1/2 font-mono text-[8px] text-accent/70">
            <div className="text-[7px] uppercase tracking-[0.2em] text-muted/50 mb-1.5 text-center">loss curve</div>
            <svg width="160" height="48" className="overflow-visible">
              <line x1="0" y1="40" x2="160" y2="40" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <line x1="0" y1="24" x2="160" y2="24" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              <line x1="0" y1="8" x2="160" y2="8" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              <path
                d={`M0,${40 - (2.4 / 3) * 32} Q40,${40 - (lossVal / 3) * 28} Q80,${40 - (lossVal / 3) * 20} Q120,${40 - (lossVal / 3) * 16} Q160,${40 - (Math.max(0.08, lossVal) / 3) * 10}`}
                fill="none"
                stroke="rgba(251,191,36,0.7)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="160" cy={40 - (Math.max(0.08, lossVal) / 3) * 32} r="2" fill="rgba(251,191,36,0.9)" />
            </svg>
            <div className="flex justify-between text-[6px] text-muted/40 mt-0.5">
              <span>epoch {epoch}</span>
              <span>loss {lossVal.toFixed(2)}</span>
            </div>
          </div>

          {/* right: model stats */}
          <div className="absolute right-6 top-20 font-mono text-[8px] text-accent/70">
            <div className="text-[7px] uppercase tracking-[0.2em] text-muted/50 mb-1.5">model</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><span className="text-muted/40">params</span><span className="text-accent">1.2B</span></div>
              <div className="flex items-center gap-2"><span className="text-muted/40">data</span><span className="text-accent">{repos.length} repos</span></div>
              <div className="flex items-center gap-2"><span className="text-muted/40">acc</span><span className="text-accent">{(score * 100).toFixed(0)}%</span></div>
              <div className="flex items-center gap-2"><span className="text-muted/40">mode</span><span className="text-accent">fine-tune</span></div>
            </div>
          </div>

          {/* bottom: progress line */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            <div className="mt-1 flex justify-between font-mono text-[6px] text-muted/30 uppercase tracking-[0.15em]">
              <span>data loading</span>
              <span>forward pass</span>
              <span>backprop</span>
              <span>weight update</span>
            </div>
          </div>
        </>
      )}

      {/* PHASE 2: DEPLOYING */}
      {phase === "deploying" && (
        <>
          <div className="absolute left-6 top-20 font-mono text-[8px] text-accent/70">
            <div className="text-[7px] uppercase tracking-[0.2em] text-muted/50 mb-1.5">build pipeline</div>
            <div className="space-y-2">
              {[
                { label: "model export", status: deployStep > 0 ? "done" : deployStep === 0 ? "active" : "wait" },
                { label: "container build", status: deployStep > 1 ? "done" : deployStep === 1 ? "active" : "wait" },
                { label: "runtime assembly", status: deployStep > 2 ? "done" : deployStep === 2 ? "active" : "wait" },
                { label: "health check", status: deployStep > 3 ? "done" : deployStep === 3 ? "active" : "wait" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`text-[7px] ${s.status === "done" ? "text-emerald-400" : s.status === "active" ? "text-cyan-400 animate-pulse" : "text-muted/30"}`}>
                    {s.status === "done" ? "●" : s.status === "active" ? "◉" : "○"}
                  </span>
                  <span className={`text-[9px] ${s.status === "done" ? "text-emerald-400/80" : s.status === "active" ? "text-cyan-400" : "text-muted/30"}`}>
                    {s.label}
                  </span>
                  {s.status === "done" && <span className="text-[6px] text-emerald-400/60">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* right: deployment targets */}
          <div className="absolute right-6 top-20 font-mono text-[8px] text-accent/70">
            <div className="text-[7px] uppercase tracking-[0.2em] text-muted/50 mb-1.5">targets</div>
            <div className="grid gap-1.5">
              {deployTargets.map((t) => (
                <div key={t.platform} className="flex items-center gap-2 px-2 py-1 rounded border" style={{
                  borderColor: deployDone.includes(t.platform) ? "rgba(6,182,212,0.3)" : "rgba(255,255,255,0.06)",
                  backgroundColor: deployDone.includes(t.platform) ? "rgba(6,182,212,0.06)" : "transparent"
                }}>
                  <span className={`text-[7px] ${deployDone.includes(t.platform) ? "text-emerald-400" : "text-muted/30"}`}>
                    {deployDone.includes(t.platform) ? "●" : "○"}
                  </span>
                  <span className={`text-[8px] ${deployDone.includes(t.platform) ? "text-cyan-400" : "text-muted/40"}`}>
                    {t.signal} → {t.platform}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* bottom: pipeline flow */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-1 text-[7px] font-mono text-cyan-400/50">
              <span className={deployStep >= 1 ? "text-cyan-400" : "text-muted/30"}>model</span>
              <span className="text-muted/20">→</span>
              <span className={deployStep >= 2 ? "text-cyan-400" : "text-muted/30"}>container</span>
              <span className="text-muted/20">→</span>
              <span className={deployStep >= 3 ? "text-cyan-400" : "text-muted/30"}>runtime</span>
              <span className="text-muted/20">→</span>
              <span className={deployStep >= 4 ? "text-emerald-400" : "text-muted/30"}>live ✓</span>
            </div>
          </div>
        </>
      )}

      {/* PHASE 3: RUN PROMPT */}
      {phase === "running" && (
        <>
          <div className="absolute left-6 top-20 font-mono text-[8px]">
            <div className="text-[7px] uppercase tracking-[0.2em] text-muted/50 mb-2">prompt session</div>
            <div className="mb-1 text-[9px] text-accent/80">{promptExamples[promptIdx].q}</div>
            <div className="text-[8px] leading-5 text-emerald-400/70 max-w-[320px]">
              {promptExamples[promptIdx].r.slice(0, charIdx)}
              <span className="animate-pulse text-emerald-400">▌</span>
            </div>
          </div>

          {/* right: inference visualization */}
          <div className="absolute right-6 top-20 font-mono text-[8px] text-accent/70">
            <div className="text-[7px] uppercase tracking-[0.2em] text-muted/50 mb-1.5">inference</div>
            <div className="space-y-1">
              {[
                { label: "tokenize", done: charIdx > 5 },
                { label: "embed", done: charIdx > 15 },
                { label: "attend", done: charIdx > 30 },
                { label: "predict", done: charIdx > 50 },
                { label: "decode", done: charIdx > 70 },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`text-[7px] ${s.done ? "text-emerald-400" : "text-muted/30"}`}>
                    {s.done ? "●" : "○"}
                  </span>
                  <span className={`text-[8px] ${s.done ? "text-emerald-400/80" : "text-muted/40"}`}>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-[7px] text-muted/40">
              {Math.min(100, Math.round((charIdx / promptExamples[promptIdx].r.length) * 100))}% complete
            </div>
          </div>

          {/* bottom: token generation sparkline */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="font-mono text-[6px] text-muted/30 uppercase tracking-[0.15em] mb-1">token generation</div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" style={{ width: `${Math.min(100, (charIdx / promptExamples[promptIdx].r.length) * 100)}%`, transition: "width 0.3s" }} />
          </div>
        </>
      )}

      {/* bottom-right: model signature */}
      <div className="absolute bottom-6 right-6 font-mono text-[6px] text-muted/20 uppercase tracking-[0.2em]">
        portfolio-llm · v0.1 · {repos.length} repos indexed
      </div>
    </div>
  );
}
