import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Mail, Github, Linkedin, FileText, ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { brandProfile, contactDetails, repositorySignals } from "../../content/portfolio";
import { FiscalMindsetBadge } from "../ui/fiscalmindset-badge";
import { cn } from "../../lib/utils";

const POST_COLORS = {
  violet: { border: "border-violet-500/25", bg: "bg-violet-500/8", hoverBg: "hover:bg-violet-500/12", text: "text-violet-400", dot: "bg-violet-500" },
  cyan: { border: "border-cyan-500/25", bg: "bg-cyan-500/8", hoverBg: "hover:bg-cyan-500/12", text: "text-cyan-400", dot: "bg-cyan-500" },
  emerald: { border: "border-emerald-500/25", bg: "bg-emerald-500/8", hoverBg: "hover:bg-emerald-500/12", text: "text-emerald-400", dot: "bg-emerald-500" },
  amber: { border: "border-amber-500/25", bg: "bg-amber-500/8", hoverBg: "hover:bg-amber-500/12", text: "text-amber-400", dot: "bg-amber-500" },
  blue: { border: "border-blue-500/25", bg: "bg-blue-500/8", hoverBg: "hover:bg-blue-500/12", text: "text-blue-400", dot: "bg-blue-500" },
} as const;

const SIGNAL_CONFIG = [
  { label: "Completeness", key: "completeness" as const, color: "#10b981" },
  { label: "Execution", key: "executionDepth" as const, color: "#3b82f6" },
  { label: "AI Depth", key: "aiDepth" as const, color: "#8b5cf6" },
  { label: "Product", key: "productSignal" as const, color: "#f59e0b" },
  { label: "Recency", key: "recencySignal" as const, color: "#ec4899" },
];

function RadarChart({ signals }: { signals: { value: number; label: string; color: string }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const active = selected !== null ? selected : hovered;

  const cx = 120, cy = 120, r = 100, levels = 4, sides = signals.length;
  const angleStep = (2 * Math.PI) / sides;
  const rotOffset = -Math.PI / 2;

  const polygonPoints = (scale: number) =>
    signals.map((_, i) => {
      const a = rotOffset + i * angleStep;
      return `${cx + r * scale * Math.cos(a)},${cy + r * scale * Math.sin(a)}`;
    }).join(" ");

  const dataPoints = signals.map((s, i) => {
    const a = rotOffset + i * angleStep;
    return `${cx + r * s.value * Math.cos(a)},${cy + r * s.value * Math.sin(a)}`;
  }).join(" ");

  const getPos = (i: number, scale: number) => {
    const a = rotOffset + i * angleStep;
    return { x: cx + r * scale * Math.cos(a), y: cy + r * scale * Math.sin(a) };
  };

  return (
    <div>
      <svg viewBox="0 0 240 250" className="w-full max-w-[220px] mx-auto">
        {Array.from({ length: levels }, (_, i) => (
          <polygon key={i} points={polygonPoints((i + 1) / levels)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {signals.map((s, i) => {
          const end = getPos(i, 1);
          const isActive = active === i;
          return (
            <g key={s.label}>
              <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={isActive ? s.color : "rgba(255,255,255,0.04)"} strokeWidth={isActive ? 1.5 : 1} style={{ transition: "stroke 0.2s, stroke-width 0.2s" }} />
              <text x={getPos(i, 1.16).x} y={getPos(i, 1.16).y} textAnchor="middle" dominantBaseline="middle"
                fill={isActive ? s.color : "rgba(255,255,255,0.4)"} fontSize={7} fontFamily="monospace"
                className="cursor-pointer" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(selected === i ? null : i)}>
                {s.label}
              </text>
            </g>
          );
        })}
        <polygon points={dataPoints} fill={active !== null ? `rgba(16,185,129,0.25)` : `rgba(16,185,129,0.15)`} stroke="#10b981" strokeWidth={1.5} />
        {signals.map((s, i) => {
          const p = getPos(i, s.value);
          const isActive = active === i;
          return (
            <g key={s.label}>
              <circle cx={p.x} cy={p.y} r={isActive ? 5 : 3} fill={isActive ? s.color : s.color} opacity={isActive ? 1 : 0.7}
                className="cursor-pointer" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(selected === i ? null : i)}>
                <animate attributeName="r" values="3;5;3" dur="0.3s" fill="freeze" />
              </circle>
              {isActive && (
                <>
                  <line x1={p.x} y1={p.y} x2={p.x} y2={p.y - 16} stroke={s.color} strokeWidth="0.5" />
                  <rect x={p.x - 14} y={p.y - 28} width={28} height={12} rx={3} fill="rgba(0,0,0,0.8)" stroke={s.color} strokeWidth="0.5" />
                  <text x={p.x} y={p.y - 20} textAnchor="middle" fill="#fff" fontSize={6} fontFamily="monospace">{Math.round(s.value * 100)}%</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
        {signals.map((s, i) => (
          <span key={s.label} className="flex items-center gap-1 font-mono text-[7px] cursor-pointer transition"
            style={{ color: active === i ? s.color : "rgba(255,255,255,0.5)" }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            onClick={() => setSelected(selected === i ? null : i)}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label} {Math.round(s.value * 100)}%
          </span>
        ))}
      </div>
      <div className="text-center mt-1">
        <span className="font-mono text-[6px] text-muted/30">Hover to highlight · click to pin</span>
      </div>
    </div>
  );
}

function AgentBackground() {
  const agentLines = [
    { agent: "scanner", color: "text-cyan-400", lines: [
      "scanning FiscalMindset/20 repos...",
      "  ▸ algsoch — offline AI study app",
      "  ▸ algsochnews — 5-agent newsroom",
      "  ▸ careops — healthcare coordinator",
      "  ▸ 17 more repositories analyzed",
      "✓ 706 commits across 2 accounts",
    ]},
    { agent: "analyzer", color: "text-violet-400", lines: [
      "evaluating code signals...",
      "  ▸ completeness:  0.85 avg",
      "  ▸ execution:     0.82 avg",
      "  ▸ ai depth:      0.78 avg",
      "  ▸ product:       0.86 avg",
      "  ▸ recency:       0.95 avg",
      "✓ signal profile built",
    ]},
    { agent: "builder", color: "text-emerald-400", lines: [
      "building competency map...",
      "  ▸ Local AI:        92%",
      "  ▸ Agentic Systems: 88%",
      "  ▸ Full-Stack:      85%",
      "  ▸ Edge Inference:  78%",
      "  ▸ Systems Design:  82%",
      "✓ profile complete",
    ]},
  ];

  const [states, setStates] = useState(
    agentLines.map(a => ({ text: "", done: false, lineIdx: 0 }))
  );
  const [phase, setPhase] = useState<"running" | "done" | "restart">("running");
  const [showVerdict, setShowVerdict] = useState(false);
  const [verdictText, setVerdictText] = useState("");

  useEffect(() => {
    let cancelled = false;

    const runAgents = async () => {
      setShowVerdict(false);
      setVerdictText("");
      setStates(agentLines.map(() => ({ text: "", done: false, lineIdx: 0 })));
      setPhase("running");

      const agents = agentLines.map((a, ai) => {
        const totalChars = a.lines.reduce((s, l) => s + l.length, 0);
        const baseDelay = 300 + ai * 200;
        const charTime = 20 + Math.random() * 10;
        return { ai, a, baseDelay, charTime, totalChars };
      });

      let completed = 0;
      await Promise.all(agents.map(({ ai, a, baseDelay, charTime }) =>
        new Promise<void>(async (resolve) => {
          await new Promise(r => setTimeout(r, baseDelay));
          for (let li = 0; li < a.lines.length; li++) {
            if (cancelled) { resolve(); return; }
            await new Promise(r => setTimeout(r, 200 + Math.random() * 150));
            const line = a.lines[li];
            for (let ci = 1; ci <= line.length; ci++) {
              if (cancelled) { resolve(); return; }
              setStates(prev => {
                const next = [...prev];
                next[ai] = { text: "  " + line.slice(0, ci), done: false, lineIdx: li };
                return next;
              });
              await new Promise(r => setTimeout(r, charTime + Math.random() * 6));
            }
            if (cancelled) { resolve(); return; }
          }
          setStates(prev => {
            const next = [...prev];
            next[ai] = { ...next[ai], done: true };
            return next;
          });
          completed++;
          resolve();
        })
      ));

      if (cancelled) return;
      setPhase("done");
      await new Promise(r => setTimeout(r, 800));

      if (cancelled) return;
      const verdict = "✅ verdict: strong hire — remote AI engineer, production-ready";
      for (let ci = 1; ci <= verdict.length; ci++) {
        if (cancelled) return;
        setVerdictText(verdict.slice(0, ci));
        await new Promise(r => setTimeout(r, 25));
      }
      setShowVerdict(true);

      if (cancelled) return;
      await new Promise(r => setTimeout(r, 4000));
      if (cancelled) return;
      setPhase("restart");
      runAgents();
    };

    runAgents();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[36px]">
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 opacity-15 select-none">
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          {agentLines.map((a, ai) => (
            <div key={a.agent} className="font-mono text-[7px] leading-4">
              <div className={`${a.color} uppercase tracking-wider mb-1`}>[{a.agent}]</div>
              <div className="text-emerald-300/60">
                <span>{states[ai]?.text}</span>
                {phase === "running" && !states[ai]?.done && (
                  <span className="inline-block w-0.5 h-2.5 bg-emerald-400 ml-0.5 animate-pulse" style={{ verticalAlign: "middle" }} />
                )}
                {states[ai]?.done && <span className="text-emerald-400/60"> ✓</span>}
              </div>
            </div>
          ))}
        </div>
        {showVerdict && (
          <div className="text-center mt-3 font-mono text-[8px] text-emerald-400/40 max-w-xl mx-auto">
            {verdictText}
            <span className="inline-block w-0.5 h-2.5 bg-emerald-400 ml-0.5 animate-pulse" style={{ verticalAlign: "middle" }} />
          </div>
        )}
      </div>
    </div>
  );
}

const LINKEDIN_POSTS = [
  { text: "DevAlert: AI-Powered Dev Opportunity Aggregator built with Kestra workflows — 26+ flows across 5 namespaces, parallel multi-source ingestion, LLM-based ranking, Telegram + Gmail notifications, and AI research workflows using Groq + Llama 3.3 70B.", url: "https://www.linkedin.com/posts/algsoch_kestraacademy-kestra-kestraacademy-activity-7459526665598136320-NdX2", date: "May 11, 2026", color: "violet", tag: "Project" },
  { text: "Kestra Academy — workflow orchestration fundamentals, flow design, triggers, execution lifecycle, state management, and building production-like workflows locally with Docker. Shifted from writing scripts to designing workflows.", url: "https://www.linkedin.com/posts/algsoch_kestra-kestraacademy-workfloworchestration-activity-7460280651146006530-I-Kj", date: "May 13, 2026", color: "cyan", tag: "Learning" },
];

function ImpactHeatmap({ signals }: { signals: { label: string; value: number; color: string; key: string }[] }) {
  const repos = useMemo(() => [...repositorySignals].sort((a, b) => b.recencySignal - a.recencySignal).slice(0, 10), []);
  const [hoverCell, setHoverCell] = useState<{ repoIdx: number; signalIdx: number } | null>(null);
  const cellSize = 8;
  const gap = 2;
  const cols = repos.length;
  const rows = signals.length;
  const width = cols * (cellSize + gap) - gap;
  const height = rows * (cellSize + gap) - gap;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[6px] uppercase tracking-[0.12em] text-muted/40">Impact Signal</span>
        <span className="font-mono text-[5px] text-muted/30">{repos.length} repos · {rows} signals</span>
      </div>
      <div className="overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-thin">
        <svg width={width} height={height + 14} className="block mx-auto" style={{ minWidth: width }}>
          <g transform={`translate(0, ${14})`}>
            {signals.map((s, si) =>
              repos.map((repo, ri) => {
                const x = ri * (cellSize + gap);
                const y = si * (cellSize + gap);
                const signalKey = s.key as keyof typeof repo;
                const rawValue = typeof repo[signalKey] === "number" ? (repo[signalKey] as number) : 0.5;
                const intensity = Math.max(0.05, Math.min(1, rawValue));
                const isActive = hoverCell?.repoIdx === ri && hoverCell?.signalIdx === si;
                const alpha = isActive ? 1 : 0.35 + intensity * 0.6;
                return (
                  <rect
                    key={`${ri}-${si}`}
                    x={x} y={y} width={cellSize} height={cellSize} rx={1.5}
                    fill={s.color}
                    opacity={alpha}
                    className="cursor-crosshair transition-all duration-150"
                    onMouseEnter={() => setHoverCell({ repoIdx: ri, signalIdx: si })}
                    onMouseLeave={() => setHoverCell(null)}
                  />
                );
              })
            )}
          </g>
          <g transform={`translate(0, ${height + 14 + 2})`}>
            {repos.map((repo, ri) => (
              <text key={ri} x={ri * (cellSize + gap) + cellSize / 2} y={0} textAnchor="middle"
                fill={hoverCell?.repoIdx === ri ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"}
                fontSize={4} fontFamily="monospace" className="transition-colors duration-150">
                {repo.title.slice(0, 3)}
              </text>
            ))}
          </g>
          {hoverCell && (() => {
            const repo = repos[hoverCell.repoIdx];
            const sig = signals[hoverCell.signalIdx];
            const signalKey = sig.key as keyof typeof repo;
            const val = typeof repo[signalKey] === "number" ? Math.round((repo[signalKey] as number) * 100) : 0;
            return (
              <g>
                <rect x={Math.min(hoverCell.repoIdx * (cellSize + gap) - 12, width - 56)} y={0} width={56} height={10} rx={3}
                  fill="rgba(0,0,0,0.85)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <text x={Math.min(hoverCell.repoIdx * (cellSize + gap) + 16, width - 28)} y={7.5}
                  textAnchor="middle" fill="#fff" fontSize={5} fontFamily="monospace">
                  {repo.title.slice(0, 8)} · {sig.label} {val}%
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

export function ContactSection() {
  const signalAverages = useMemo(() => {
    const n = repositorySignals.length || 1;
    return SIGNAL_CONFIG.map(({ label, key, color }) => ({
      label,
      key,
      value: repositorySignals.reduce((sum, r) => sum + r[key], 0) / n,
      color,
    }));
  }, []);
  const [linkedinOpen, setLinkedinOpen] = useState(false);
  const [githubOpen, setGithubOpen] = useState<string | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const toggleLinkedin = () => setLinkedinOpen((v) => !v);
  const toggleGithub = (handle: string) => setGithubOpen((v) => v === handle ? null : handle);
  const toggleResume = () => setResumeOpen((v) => {
    if (!v) setTimeout(() => resumeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    return !v;
  });

  return (
    <section id="contact" className="py-4 sm:py-6 lg:py-8 overflow-hidden">
      <div className="section-frame">
        <div className="rounded-xl border border-orange-500/50 bg-black/10 p-2 sm:rounded-2xl sm:border-2 sm:p-3 lg:rounded-3xl lg:p-5">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 via-transparent to-transparent p-2 sm:rounded-[28px] sm:p-4 lg:rounded-[36px] lg:p-6">
          <div className="pointer-events-none absolute -inset-32 bg-emerald-500/5 blur-[120px] rounded-full" />
          <div className="pointer-events-none absolute inset-0 panel-grid opacity-15" />
            <div className="relative">
            <AgentBackground />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="max-w-3xl min-w-0">
                <motion.div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/12 px-3 py-1 sm:px-4 sm:py-1.5"
                  animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 12px rgba(16,185,129,0.25)", "0 0 0px rgba(16,185,129,0)"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400 font-semibold sm:text-[10px] sm:tracking-[0.28em]">Open to Work</span>
                  <Sparkles size={10} className="text-emerald-400/60 sm:size-[11px]" />
                </motion.div>
                <h2 className="mt-2 sm:mt-3 font-display text-xl font-semibold text-ink sm:text-2xl lg:text-3xl xl:text-4xl" style={{lineHeight: '1.2'}}>
                  Hire me. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Remote AI systems</span>, production-ready.
                </h2>

              </div>

              <div className="relative shrink-0 self-center sm:self-auto w-auto">
                {/* Floating tags — desktop */}
                <div className="hidden sm:block">
                  {/* Left side */}
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: -6 }}
                    className="absolute top-[15%] -left-4 z-10 cursor-default rounded-full border border-emerald-500/30 bg-emerald-500/12 px-2 py-0.5 font-mono text-[7px] text-emerald-400 shadow-lg shadow-emerald-500/10 backdrop-blur-sm sm:text-[6px] sm:-left-3 lg:text-[7px] lg:-left-4"
                    style={{ transform: "rotate(-7deg)" }}>
                    Open to Work
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute top-[35%] -left-4 z-10 cursor-default rounded-full border border-amber-500/30 bg-amber-500/12 px-2 py-0.5 font-mono text-[7px] text-amber-400 shadow-lg shadow-amber-500/10 backdrop-blur-sm sm:text-[6px] sm:-left-3 lg:text-[7px] lg:-left-5"
                    style={{ transform: "rotate(4deg)" }}>
                    LangGraph
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: -4 }}
                    className="absolute top-[68%] -left-4 z-10 cursor-default rounded-full border border-orange-500/30 bg-orange-500/12 px-2 py-0.5 font-mono text-[7px] text-orange-400 shadow-lg shadow-orange-500/10 backdrop-blur-sm sm:text-[6px] sm:-left-3 lg:text-[7px] lg:-left-4"
                    style={{ transform: "rotate(-5deg)" }}>
                    Full-Stack
                  </motion.span>
                  {/* Right side */}
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    className="absolute top-[15%] -right-4 z-10 cursor-default rounded-full border border-cyan-500/30 bg-cyan-500/12 px-2 py-0.5 font-mono text-[7px] text-cyan-400 shadow-lg shadow-cyan-500/10 backdrop-blur-sm sm:text-[6px] sm:-right-3 lg:text-[7px] lg:-right-4"
                    style={{ transform: "rotate(5deg)" }}>
                    On-Device AI
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: 4 }}
                    className="absolute top-[35%] -right-4 z-10 cursor-default rounded-full border border-blue-500/30 bg-blue-500/12 px-2 py-0.5 font-mono text-[7px] text-blue-400 shadow-lg shadow-blue-500/10 backdrop-blur-sm sm:text-[6px] sm:-right-3 lg:text-[7px] lg:-right-5"
                    style={{ transform: "rotate(3deg)" }}>
                    Agentic Workflows
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="absolute top-[68%] -right-4 z-10 cursor-default rounded-full border border-purple-500/30 bg-purple-500/12 px-2 py-0.5 font-mono text-[7px] text-purple-400 shadow-lg shadow-purple-500/10 backdrop-blur-sm sm:text-[6px] sm:-right-3 lg:text-[7px] lg:-right-4"
                    style={{ transform: "rotate(-6deg)" }}>
                    Edge Inference
                  </motion.span>
                  {/* Floating action buttons — desktop */}
                  <motion.a href="mailto:npdimagine@gmail.com"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.08 }}
                    className="absolute -bottom-2.5 left-0 z-10 cursor-pointer rounded-full border border-emerald-500/30 bg-emerald-500/12 px-2.5 py-0.5 font-mono text-[7px] text-emerald-400 shadow-lg shadow-emerald-500/10 backdrop-blur-sm hover:bg-emerald-500/20 transition-all sm:text-[6px] lg:text-[8px] lg:px-3">
                    Email Me
                  </motion.a>
                  <motion.a href="https://www.linkedin.com/in/algsoch" target="_blank" rel="noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.08 }}
                    className="absolute -bottom-2.5 left-1/2 z-10 -translate-x-1/2 cursor-pointer rounded-full border border-blue-500/30 bg-blue-500/12 px-2.5 py-0.5 font-mono text-[7px] text-blue-400 shadow-lg shadow-blue-500/10 backdrop-blur-sm hover:bg-blue-500/20 transition-all sm:text-[6px] lg:text-[8px] lg:px-3">
                    LinkedIn
                  </motion.a>
                  <motion.button onClick={toggleResume}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.08 }}
                    className="absolute -bottom-2.5 right-0 z-10 cursor-pointer rounded-full border border-amber-500/30 bg-amber-500/12 px-2.5 py-0.5 font-mono text-[7px] text-amber-400 shadow-lg shadow-amber-500/10 backdrop-blur-sm hover:bg-amber-500/20 transition-all sm:text-[6px] lg:text-[8px] lg:px-3">
                    Resume
                  </motion.button>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-accent/25 bg-black/15 px-3 py-2 sm:px-4 sm:py-3 group hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-200">
                  <div className="relative">
                    <img
                      src={brandProfile.portraitUrl}
                      alt={brandProfile.name}
                      className="h-12 w-12 rounded-xl border-2 border-accent/30 object-cover object-top transition-all duration-300 group-hover:scale-105 group-hover:border-orange-500/40 sm:h-16 sm:w-16 sm:rounded-2xl"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--surface)] sm:h-3.5 sm:w-3.5" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-ink sm:text-sm">{brandProfile.brand.toLowerCase()}</div>
                    <div className="text-[8px] text-muted/80 font-mono sm:text-[10px]">Applied Intelligence Engineer</div>
                  </div>
                  <div className="w-full border-t border-white/[0.04] pt-1.5">
                    <ImpactHeatmap signals={signalAverages} />
                  </div>
                </div>
                {/* Floating tags — mobile */}
                <div className="flex sm:hidden flex-wrap gap-1 mt-1.5 justify-center">
                  <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[7px] text-emerald-400">Open to Work</span>
                  <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 font-mono text-[7px] text-cyan-400">On-Device AI</span>
                  <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 font-mono text-[7px] text-blue-400">Agentic Workflows</span>
                  <span className="rounded-full border border-purple-500/25 bg-purple-500/10 px-2 py-0.5 font-mono text-[7px] text-purple-400">Edge Inference</span>
                  <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 font-mono text-[7px] text-amber-400">LangGraph</span>
                  <span className="rounded-full border border-orange-500/25 bg-orange-500/10 px-2 py-0.5 font-mono text-[7px] text-orange-400">Full-Stack</span>
                </div>
                {/* Action buttons — mobile */}
                <div className="flex sm:hidden flex-wrap gap-1.5 mt-2 justify-center">
                  <a href="mailto:npdimagine@gmail.com"
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/12 px-3 py-1 font-mono text-[8px] text-emerald-400 hover:bg-emerald-500/20 transition-all">
                    Email Me
                  </a>
                  <a href="https://www.linkedin.com/in/algsoch" target="_blank" rel="noreferrer"
                    className="rounded-full border border-blue-500/30 bg-blue-500/12 px-3 py-1 font-mono text-[8px] text-blue-400 hover:bg-blue-500/20 transition-all">
                    LinkedIn
                  </a>
                  <button onClick={toggleResume}
                    className="rounded-full border border-amber-500/30 bg-amber-500/12 px-3 py-1 font-mono text-[8px] text-amber-400 hover:bg-amber-500/20 transition-all">
                    Resume
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2 sm:mt-5 grid gap-2 sm:gap-4 lg:grid-cols-[1fr_1.2fr] items-start">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-1.5 sm:rounded-2xl sm:p-3">
                <div className="font-mono text-[7px] uppercase tracking-[0.15em] text-muted/50 text-center mb-1 sm:text-[9px] sm:tracking-[0.2em]">Signal profile · {repositorySignals.length} repos</div>
                <div className="max-w-[180px] mx-auto sm:max-w-none">
                  <RadarChart signals={signalAverages} />
                </div>
              </div>
              <div className="grid gap-1 sm:gap-3">
                {contactDetails.map((detail) => {
                  if (detail.label.startsWith("GitHub / ")) {
                    const handle = detail.label.replace("GitHub / ", "");
                    const isOpen = githubOpen === handle;
                    const repoColors: (keyof typeof POST_COLORS)[] = ["violet", "cyan", "emerald", "amber", "blue"];
                    const accountRepos = [...repositorySignals]
                      .filter((r) => r.account === handle)
                      .sort((a, b) => b.recencySignal - a.recencySignal)
                      .slice(0, 3);
                    return (
                      <div key={detail.label} className="grid gap-1">
                        <button onClick={() => toggleGithub(handle)}
                          className={cn(
                            "group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 transition w-full text-left",
                            isOpen
                              ? "border-violet-500/30 bg-violet-500/8"
                              : "border-white/[0.06] bg-white/[0.02] hover:border-violet-500/20 hover:bg-violet-500/5"
                          )}>
                          <Github size={13} className={cn("transition sm:size-[14px]", isOpen ? "text-violet-400" : "text-muted/50 group-hover:text-violet-400")} />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted/40 sm:text-[8px] sm:tracking-[0.15em]">{detail.label}</div>
                            <div className="text-[11px] text-ink truncate group-hover:text-violet-400 transition sm:text-[12px]">{detail.value}</div>
                          </div>
                          <ChevronDown size={11} className={cn("text-muted/30 transition sm:size-[12px]", isOpen && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {isOpen ? (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 mt-1">
                                <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted/40 mb-2 sm:text-[8px]">Top Repos</div>
                                <div className="grid gap-2">
                                  {accountRepos.map((repo, i) => {
                                    const c = POST_COLORS[repoColors[i % repoColors.length]];
                                    return (
                                      <motion.a key={repo.id} href={repo.repoUrl} target="_blank" rel="noreferrer"
                                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.25 }}
                                        className={cn("group/item flex items-start gap-2.5 rounded-xl border p-2.5 transition-all duration-200 hover:scale-[1.01]", c.border, c.bg)}>
                                        <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md border", c.border, c.bg)}>
                                          <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className={cn("font-mono text-[7px] uppercase tracking-[0.1em] font-semibold", c.text)}>{repo.title}</span>
                                            <span className="font-mono text-[6px] text-muted/30">· {repo.themes[0]}</span>
                                          </div>
                                          <div className="font-mono text-[8px] text-muted/60 leading-relaxed group-hover/item:text-ink transition sm:text-[9px]">{repo.synopsis.slice(0, 120)}{repo.synopsis.length > 120 ? "..." : ""}</div>
                                        </div>
                                        <ArrowUpRight size={10} className={cn("shrink-0 mt-1 transition opacity-0 group-hover/item:opacity-100", c.text)} />
                                      </motion.a>
                                    );
                                  })}
                                  <a href={detail.href} target="_blank" rel="noreferrer"
                                    className="group flex items-center justify-center gap-1 rounded-lg border border-white/[0.06] py-1.5 font-mono text-[8px] text-muted/40 hover:text-ink hover:border-white/[0.12] transition-all duration-200">
                                    View all on GitHub <ArrowUpRight size={10} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  if (detail.label === "LinkedIn") {
                    return (
                      <div key={detail.label} className="grid gap-1">
                        <button onClick={toggleLinkedin}
                          className={cn(
                            "group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 transition w-full text-left",
                            linkedinOpen
                              ? "border-emerald-500/30 bg-emerald-500/8"
                              : "border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/20 hover:bg-emerald-500/5"
                          )}>
                          <Linkedin size={13} className={cn("transition sm:size-[14px]", linkedinOpen ? "text-emerald-400" : "text-muted/50 group-hover:text-emerald-400")} />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted/40 sm:text-[8px] sm:tracking-[0.15em]">{detail.label}</div>
                            <div className="text-[11px] text-ink truncate group-hover:text-emerald-400 transition sm:text-[12px]">{detail.value}</div>
                          </div>
                          <ChevronDown size={11} className={cn("text-muted/30 transition sm:size-[12px]", linkedinOpen && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {linkedinOpen ? (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 mt-1">
                                <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted/40 mb-2 sm:text-[8px]">Latest Posts</div>
                                <div className="grid gap-2">
                                  {LINKEDIN_POSTS.map((post, i) => {
                                    const c = POST_COLORS[post.color as keyof typeof POST_COLORS] || POST_COLORS.emerald;
                                    return (
                                      <motion.a
                                        key={i}
                                        href={post.url}
                                        target="_blank" rel="noreferrer"
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08, duration: 0.25 }}
                                        className={cn("group/post flex items-start gap-2.5 rounded-xl border p-2.5 transition-all duration-200 hover:scale-[1.01]", c.border, c.bg)}>
                                        <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md border", c.border, c.bg)}>
                                          <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className={cn("font-mono text-[7px] uppercase tracking-[0.1em] font-semibold", c.text)}>{post.tag}</span>
                                            {post.date ? <span className="font-mono text-[6px] text-muted/30">· {post.date}</span> : null}
                                          </div>
                                          <div className={cn("font-mono text-[8px] leading-relaxed transition sm:text-[9px]", "text-muted/60 group-hover/post:text-ink")}>{post.text.slice(0, 150)}{post.text.length > 150 ? "..." : ""}</div>
                                        </div>
                                        <ExternalLink size={10} className={cn("shrink-0 mt-1 transition", c.text, "opacity-0 group-hover/post:opacity-100")} />
                                      </motion.a>
                                    );
                                  })}
                                  <a href={detail.href} target="_blank" rel="noreferrer"
                                    className="group flex items-center justify-center gap-1 rounded-lg border border-white/[0.06] py-1.5 font-mono text-[8px] text-muted/40 hover:text-ink hover:border-white/[0.12] transition-all duration-200 hover:scale-[1.01]">
                                    View all on LinkedIn <ArrowUpRight size={10} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  if (detail.label === "Resume") {
                    return (
                      <div key={detail.label} ref={resumeRef} className="grid gap-1">
                        <button onClick={toggleResume}
                          className={cn(
                            "group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 transition w-full text-left",
                            resumeOpen
                              ? "border-amber-500/30 bg-amber-500/8"
                              : "border-white/[0.06] bg-white/[0.02] hover:border-amber-500/20 hover:bg-amber-500/5"
                          )}>
                          <FileText size={13} className={cn("transition sm:size-[14px]", resumeOpen ? "text-amber-400" : "text-muted/50 group-hover:text-amber-400")} />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted/40 sm:text-[8px] sm:tracking-[0.15em]">{detail.label}</div>
                            <div className="text-[11px] text-ink truncate group-hover:text-amber-400 transition sm:text-[12px]">{detail.value}</div>
                          </div>
                          <ChevronDown size={11} className={cn("text-muted/30 transition sm:size-[12px]", resumeOpen && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {resumeOpen ? (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-2 mt-1">
                                <div className="relative w-full rounded-lg overflow-hidden" style={{ height: "50vh", minHeight: "300px" }}>
                                  <iframe src={detail.href} className="absolute inset-0 w-full h-full" title="Resume" />
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                  <a href={detail.href} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] px-3 py-1.5 font-mono text-[8px] text-muted/40 hover:text-ink hover:border-white/[0.12] transition">
                                    Open in new tab <ArrowUpRight size={10} />
                                  </a>
                                </div>
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  return (
                    <a key={detail.label} href={detail.href} target="_blank" rel="noreferrer"
                      className="group flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 sm:px-4 sm:py-3 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition">
                      <Mail size={13} className="text-muted/50 group-hover:text-emerald-400 transition sm:size-[14px]" />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[7px] uppercase tracking-[0.12em] text-muted/40 sm:text-[8px] sm:tracking-[0.15em]">{detail.label}</div>
                        <div className="text-[11px] text-ink truncate group-hover:text-emerald-400 transition sm:text-[12px]">{detail.value}</div>
                      </div>
                      <ArrowUpRight size={11} className="text-muted/30 group-hover:text-emerald-400 transition sm:size-[12px]" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      <FiscalMindsetBadge />
      </div>
    </div>
    </section>
  );
}

