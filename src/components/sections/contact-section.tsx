import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Mail, Github, Linkedin, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { brandProfile, contactDetails, repositorySignals } from "../../content/portfolio";
import { Button } from "../ui/button";
import { FiscalMindsetBadge } from "../ui/fiscalmindset-badge";

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

export function ContactSection() {
  const signalAverages = useMemo(() => {
    const n = repositorySignals.length || 1;
    return SIGNAL_CONFIG.map(({ label, key, color }) => ({
      label,
      value: repositorySignals.reduce((sum, r) => sum + r[key], 0) / n,
      color,
    }));
  }, []);

  return (
    <section id="contact" className="section-space">
      <div className="section-frame">
        <div className="rounded-xl border border-orange-500/50 bg-black/10 p-5 sm:rounded-2xl sm:border-2 sm:p-6 lg:rounded-3xl lg:p-10">
        <div className="relative overflow-hidden rounded-[36px] border border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 via-transparent to-transparent p-8 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -inset-32 bg-emerald-500/5 blur-[120px] rounded-full" />
          <div className="pointer-events-none absolute inset-0 panel-grid opacity-15" />
          <div className="relative">
            <AgentBackground />
            <div className="max-w-4xl">
              <motion.div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/12 px-4 py-1.5"
                animate={{ boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 12px rgba(16,185,129,0.25)", "0 0 0px rgba(16,185,129,0)"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400 font-semibold">Open to Work</span>
                <Sparkles size={11} className="text-emerald-400/60" />
              </motion.div>
              <h2 className="mt-5 font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-[4rem]" style={{lineHeight: '1.2'}}>
                Hire me. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Remote AI systems</span>, production-ready.
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] text-emerald-400">Local AI</span>
                <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1 font-mono text-[10px] text-blue-400">Agentic Workflows</span>
                <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 font-mono text-[10px] text-amber-400">Full-Stack</span>
                <span className="rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1 font-mono text-[10px] text-purple-400">Edge Inference</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="mailto:npdimagine@gmail.com" variant="primary" size="lg">
                  Email Me
                  <ArrowUpRight size={16} />
                </Button>
                <Button href="https://www.linkedin.com/in/algsoch" variant="secondary" size="lg">
                  LinkedIn
                </Button>
                <Button href="/docs/vicky_software_engineer.pdf" variant="secondary" size="lg">
                  Resume
                </Button>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.2fr] items-start">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50 text-center mb-2">Signal profile · {repositorySignals.length} repos</div>
                <RadarChart signals={signalAverages} />
              </div>
              <div className="grid gap-3">
                {contactDetails.map((detail) => (
                  <a key={detail.label} href={detail.href} target={detail.href.startsWith("http") ? "_blank" : undefined}
                    rel={detail.href.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition">
                    {detail.label === "Email" ? <Mail size={14} className="text-muted/50 group-hover:text-emerald-400 transition" /> :
                     detail.label === "GitHub" ? <Github size={14} className="text-muted/50 group-hover:text-emerald-400 transition" /> :
                     detail.label === "LinkedIn" ? <Linkedin size={14} className="text-muted/50 group-hover:text-emerald-400 transition" /> :
                     <FileText size={14} className="text-muted/50 group-hover:text-emerald-400 transition" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted/40">{detail.label}</div>
                      <div className="text-[12px] text-ink truncate group-hover:text-emerald-400 transition">{detail.value}</div>
                    </div>
                    <ArrowUpRight size={12} className="text-muted/30 group-hover:text-emerald-400 transition" />
                  </a>
                ))}
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

