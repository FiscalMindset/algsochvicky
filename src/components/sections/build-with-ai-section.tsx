import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import { buildModes } from "../../content/portfolio";
import { FiscalMindsetBadge } from "../ui/fiscalmindset-badge";
import { SemanticSearchBg } from "../visuals/semantic-search-bg";

const modeColors = [
  { id: "ai-chatbot",        accent: "#3b82f6" },
  { id: "voice-assistant",   accent: "#06b6d4" },
  { id: "agent-workflow",    accent: "#8b5cf6" },
  { id: "news-automation",   accent: "#eab308" },
  { id: "on-device-tool",    accent: "#10b981" },
  { id: "educational-assistant", accent: "#ec4899" },
  { id: "healthcare-ai",     accent: "#ef4444" },
  { id: "ml-systems",        accent: "#6366f1" },
];

const techCategories = [
  { key: "frontend", label: "Frontend", icon: "⎔" },
  { key: "backend", label: "Backend", icon: "⚙" },
  { key: "ai-ml", label: "AI/ML", icon: "◆" },
  { key: "infra", label: "Infra", icon: "☁" },
  { key: "tools", label: "Tools", icon: "⊡" },
];

const techKeywords: Record<string, string[]> = {
  frontend: ["React", "Next.js", "Jetpack Compose", "Android", "Kotlin", "browser", "UI", "Web Speech", "Frontend"],
  backend: ["FastAPI", "Backend", "API", "REST", "server", "Python", "TypeScript", "Next.js"],
  "ai-ml": ["LLM", "LangGraph", "ONNX", "PyTorch", "XGBoost", "SHAP", "SmolLM2", "SmolVLM", "prompts", "Inference", "RunAnywhere", "llama.cpp", "model", "Retrieval", "Embedding", "Coral", "Structured", "Pipeline", "pipeline"],
  infra: ["Docker", "WASM", "WebAssembly", "OPFS", "caching", "Runtime", "runtime", "browser model", "Streaming", "state machine", "State machines", "Browser"],
  tools: ["Coral SQL", "Coral", "FFmpeg", "OpenMetadata", "Ollama", "Tool", "tool", "orchestration", "execution", "Parser", "Automation", "FFmpeg"],
};

const learnings: Record<string, string> = {
  "ai-chatbot": "Chatbots look simple but the hard part is grounding: keeping responses faithful to retrieved knowledge without hallucinating. Every project taught me to design the feedback loop before the prompt.",
  "voice-assistant": "Voice adds a real-time constraint that changes everything. The UX must handle silence, hesitation, and mode-switching mid-flow. Latency perception matters more than actual latency.",
  "agent-workflow": "Agents fail in creative ways. The critical skill isn't writing plans — it's designing the trace visibility so you can debug when the LLM takes a path you didn't expect.",
  "news-automation": "Multi-agent pipelines need QA gates that actually catch bad output. The editor agent and the QA agent must disagree sometimes — that's where the signal is.",
  "on-device-tool": "Local AI is a different engineering discipline. Model size, cache management, cold start, and runtime lifecycle matter more than prompt quality. The SDK does the heavy lifting.",
  "educational-assistant": "Teaching through AI requires audience-aware adaptation. The same content needs different framing for beginners vs. advanced users — the model is the easy part, the audience map is the craft.",
  "healthcare-ai": "Safety isn't a feature, it's the architecture. Every query must be guardrailed, every source must be citeable, and every output must avoid sounding diagnostic. Medical data coordination is harder than ML.",
  "ml-systems": "Traditional ML needs the same product thinking as LLM apps: feature engineering is prompt design, evaluation is the feedback loop, and explainability is the interface pattern.",
};

function computeTechCoverage(technologies: string[]) {
  return techCategories.map((cat) => {
    const matched = technologies.filter((t) =>
      techKeywords[cat.key]?.some((kw) => t.toLowerCase().includes(kw.toLowerCase()))
    );
    return { ...cat, matched, score: matched.length > 0 ? 0.3 + Math.min(0.7, matched.length * 0.18) : 0 };
  });
}

export function BuildWithAiSection() {
  const [activeId, setActiveId] = useState(buildModes[0]?.id ?? "");
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const activeMode = useMemo(() => buildModes.find((mode) => mode.id === activeId) ?? buildModes[0], [activeId]);
  const activeColor = useMemo(() => modeColors.find((c) => c.id === activeId) ?? modeColors[0], [activeId]);
  const currentIdx = buildModes.findIndex((m) => m.id === activeId);

  const allCoverage = useMemo(() => buildModes.map((m) => ({
    id: m.id,
    title: m.title,
    color: modeColors.find((c) => c.id === m.id)?.accent ?? "#f97316",
    coverage: computeTechCoverage(m.technologies),
  })), []);

  useEffect(() => {
    if (isPaused || compareMode) return;
    timerRef.current = setInterval(() => {
      setActiveId((prev) => {
        const idx = buildModes.findIndex((m) => m.id === prev);
        return buildModes[(idx + 1) % buildModes.length].id;
      });
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, compareMode]);

  if (!activeMode) return null;

  const coverage = useMemo(() => computeTechCoverage(activeMode.technologies), [activeMode]);
  const steps = activeMode.architectureFlow;

  return (
    <section id="build-modes" className="section-space relative overflow-hidden">
      <SemanticSearchBg accentColor={activeColor.accent} />
      <div className="pointer-events-none absolute inset-0 z-[1]" style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${activeColor.accent}08 0%, transparent 70%)`,
        transition: "background 0.8s ease",
      }} />
      <div className="section-frame relative z-10">
        <div className="rounded-xl border border-orange-500/50 bg-black/10 p-5 sm:rounded-2xl sm:border-2 sm:p-6 lg:rounded-3xl lg:p-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm" style={{ backgroundColor: activeColor.accent + "18", color: activeColor.accent }}>
              {buildModes.length}
            </span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: activeColor.accent }}>What I Build</div>
              <div className="text-sm text-muted">AI products across different domains</div>
            </div>
          </div>

          {/* Mode selector grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {buildModes.map((mode, mi) => {
              const mc = modeColors[mi];
              const active = mode.id === activeId;
              const hovered = mode.id === hoveredCard;
              return (
                <motion.button
                  key={mode.id}
                  layout
                  className="text-left"
                  onClick={() => { setActiveId(mode.id); setCompareMode(false); setIsPaused(true); }}
                  onMouseEnter={() => { setHoveredCard(mode.id); setIsPaused(true); }}
                  onMouseLeave={() => { setHoveredCard(null); setIsPaused(false); }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <motion.div
                    className="rounded-2xl border p-4 h-full transition-colors duration-300"
                    animate={{
                      borderColor: active ? mc.accent + "66" : hovered ? mc.accent + "33" : "rgba(255,255,255,0.08)",
                      backgroundColor: active ? mc.accent + "18" : hovered ? mc.accent + "0A" : "rgba(255,255,255,0.03)",
                    }}
                    style={active ? { boxShadow: `0 0 20px -4px ${mc.accent}40` } : {}}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: mc.accent }} />
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: mc.accent }}>{mode.title}</div>
                    </div>
                    <p className="text-sm text-muted line-clamp-2">{mode.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {mode.relevantSystems.slice(0, 3).map((system) => (
                        <span
                          key={system}
                          className="rounded-full border px-2 py-0.5 text-[10px]"
                          style={{
                            borderColor: active ? mc.accent + "44" : `${mc.accent}22`,
                            backgroundColor: active ? mc.accent + "18" : "transparent",
                            color: active ? mc.accent : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {system}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* Cycle indicator dots + compare toggle */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {buildModes.map((mode, i) => {
              const mc = modeColors[i];
              return (
                <button
                  key={mode.id}
                  onClick={() => { setActiveId(mode.id); setCompareMode(false); setIsPaused(true); }}
                  className="transition-all duration-500"
                  style={{
                    width: i === currentIdx ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: i === currentIdx ? mc.accent : "rgba(255,255,255,0.1)",
                  }}
                />
              );
            })}
            <span className="ml-2 font-mono text-[9px] text-muted/40">
              {isPaused ? "· paused" : "· auto"}
            </span>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className="ml-3 rounded-full border px-3 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] transition-all"
              style={{
                borderColor: compareMode ? activeColor.accent + "55" : "rgba(255,255,255,0.15)",
                backgroundColor: compareMode ? activeColor.accent + "15" : "transparent",
                color: compareMode ? activeColor.accent : "rgba(255,255,255,0.4)",
              }}
            >
              {compareMode ? "single" : "compare all"}
            </button>
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            {compareMode ? (
              <motion.div
                key="compare-all"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <div className="rounded-2xl border p-5" style={{ borderColor: activeColor.accent + "33", backgroundColor: activeColor.accent + "06" }}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: activeColor.accent }}>Technology coverage · all modes</div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {allCoverage.map((item) => {
                      const mc = item.color;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { setActiveId(item.id); setCompareMode(false); }}
                          className="rounded-xl border p-3 text-left transition-all hover:scale-[1.02]"
                          style={{ borderColor: mc + "33", backgroundColor: mc + "08" }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: mc }} />
                            <span className="font-mono text-[9px] uppercase tracking-[0.15em]" style={{ color: mc }}>{item.title}</span>
                          </div>
                          <div className="grid gap-1">
                            {item.coverage.map((cat) => (
                              <div key={cat.key} className="flex items-center gap-1.5">
                                <span className="w-12 text-[7px] font-mono text-muted/50 truncate">{cat.label}</span>
                                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: mc + "15" }}>
                                  <div className="h-full rounded-full" style={{ width: `${Math.max(4, cat.score * 100)}%`, backgroundColor: mc + "55" }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeMode.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]"
              >
                <div className="rounded-2xl border p-5" style={{ borderColor: activeColor.accent + "33", backgroundColor: activeColor.accent + "06" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm" style={{ backgroundColor: activeColor.accent + "20", color: activeColor.accent }}>
                      {String.fromCharCode(65 + currentIdx)}
                    </div>
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: activeColor.accent }}>{activeMode.title}</div>
                      <h3 className="text-lg font-semibold text-ink">{activeMode.summary}</h3>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 mb-5">
                    <div className="rounded-xl border p-3" style={{ borderColor: activeColor.accent + "22", backgroundColor: activeColor.accent + "08" }}>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Interface Pattern</div>
                      <div className="mt-2 text-sm text-muted">{activeMode.interfacePattern}</div>
                    </div>
                    <div className="rounded-xl border p-3" style={{ borderColor: activeColor.accent + "22", backgroundColor: activeColor.accent + "08" }}>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Output Style</div>
                      <div className="mt-2 text-sm text-muted">{activeMode.outputStyle}</div>
                    </div>
                  </div>

                  {/* Architecture flow with mobile connectors */}
                  <div className="rounded-xl border p-4" style={{ borderColor: activeColor.accent + "22", backgroundColor: activeColor.accent + "04" }}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: activeColor.accent }}>Architecture flow</div>
                    <div className="relative">
                      <div className="absolute top-[22px] left-4 right-4 h-[2px] hidden sm:block" style={{
                        background: `linear-gradient(to right, ${activeColor.accent}22, ${activeColor.accent}44, ${activeColor.accent}22)`,
                      }} />
                      <div className="flex flex-wrap items-center gap-1 sm:gap-0 sm:justify-between relative">
                        {steps.map((step, si) => (
                          <div key={step} className="flex items-center gap-1 sm:flex-col sm:w-[calc(20%-4px)]">
                            {si > 0 && (
                              <svg className="sm:hidden w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none" style={{ color: activeColor.accent + "55" }}>
                                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                            <div className="flex flex-col items-center gap-1.5 sm:gap-1.5">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: si * 0.08, type: "spring", stiffness: 300 }}
                                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-mono font-bold border-2 z-10"
                                style={{ borderColor: activeColor.accent + "66", backgroundColor: activeColor.accent + "18", color: activeColor.accent }}
                              >
                                {si + 1}
                                {si < steps.length - 1 && (
                                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: activeColor.accent }} />
                                )}
                              </motion.div>
                              <motion.span
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: si * 0.1 }}
                                className="text-[10px] font-mono text-center leading-tight px-1"
                                style={{ color: activeColor.accent + "bb" }}
                              >
                                {step}
                              </motion.span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <svg className="hidden sm:block w-full h-4 mt-2" viewBox={`0 0 ${(steps.length - 1) * 100} 16`}>
                        {steps.slice(0, -1).map((_, si) => (
                          <g key={si}>
                            <line x1={si * 100 + 50} y1="8" x2={(si + 1) * 100 + 50} y2="8" stroke={activeColor.accent + "33"} strokeWidth="1" strokeDasharray="3 2" />
                            <polygon points={`${(si + 1) * 100 + 50 - 4},4 ${(si + 1) * 100 + 50 + 4},8 ${(si + 1) * 100 + 50 - 4},12`} fill={activeColor.accent + "44"} />
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {/* Tech radar */}
                  <div className="rounded-2xl border p-4" style={{ borderColor: activeColor.accent + "33", backgroundColor: activeColor.accent + "06" }}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: activeColor.accent }}>Technologies</div>
                    <div className="grid gap-2.5">
                      {coverage.map((cat, ci) => (
                        <motion.div
                          key={cat.key}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ci * 0.06 }}
                          className="flex items-center gap-3"
                        >
                          <span className="flex items-center gap-1.5 w-16 text-[10px] font-mono text-muted">
                            <span style={{ color: activeColor.accent }}>{cat.icon}</span>
                            {cat.label}
                          </span>
                          <div className="flex-1 h-[10px] rounded-full overflow-hidden relative" style={{ backgroundColor: activeColor.accent + "12" }}>
                            <motion.div
                              className="h-full rounded-full relative"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(6, cat.score * 100)}%` }}
                              transition={{ duration: 0.7, ease: "easeOut", delay: ci * 0.08 }}
                              style={{ backgroundColor: activeColor.accent + "44" }}
                            >
                              <div className="absolute right-0 top-0 bottom-0 w-3 rounded-full" style={{ background: `linear-gradient(to left, ${activeColor.accent}66, transparent)` }} />
                            </motion.div>
                          </div>
                          <span className="w-5 text-right font-mono text-[9px] text-muted/50">{cat.matched.length}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {activeMode.technologies.map((tech, ti) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: ti * 0.04 }}
                          className="rounded-full border px-2.5 py-1 text-[10px] font-medium"
                          style={{ borderColor: activeColor.accent + "33", backgroundColor: activeColor.accent + "12", color: activeColor.accent + "dd" }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="rounded-2xl border p-4" style={{ borderColor: activeColor.accent + "33", backgroundColor: activeColor.accent + "06" }}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: activeColor.accent }}>Projects</div>
                    <div className="grid gap-2">
                      {activeMode.relevantSystems.map((system, si) => (
                        <motion.div
                          key={system}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: si * 0.07 }}
                          className="flex items-center gap-3 rounded-xl border p-2.5 text-sm"
                          style={{ borderColor: activeColor.accent + "22", backgroundColor: activeColor.accent + "08", color: "var(--color-ink, #e2e8f0)" }}
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-[9px] font-bold" style={{ backgroundColor: activeColor.accent + "22", color: activeColor.accent }}>
                            {si + 1}
                          </div>
                          {system}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* What I learned — per-mode */}
                  <div className="rounded-2xl border p-4 relative overflow-hidden" style={{ borderColor: activeColor.accent + "33", backgroundColor: activeColor.accent + "06" }}>
                    <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full opacity-20 blur-xl" style={{ backgroundColor: activeColor.accent }} />
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: activeColor.accent }}>What I learned</div>
                    <p className="text-sm text-muted leading-relaxed relative z-10">
                      {learnings[activeMode.id] ?? `Building ${activeMode.title.toLowerCase()} requires adapting the core AI engineering approach to ${activeMode.interfacePattern.split(' ')[0].toLowerCase()} interfaces.`}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <FiscalMindsetBadge />
        </div>
      </div>
    </section>
  );
}
