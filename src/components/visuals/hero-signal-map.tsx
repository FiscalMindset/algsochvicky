import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { featuredSystems, repositorySignals } from "../../content/portfolio";
import { cn, compactActionLabel, getSystemRouteHref } from "../../lib/utils";
import { Button } from "../ui/button";
import { YouTubePreview } from "../ui/youtube-preview";

const stages = [
  {
    step: "01",
    eyebrow: "Input",
    title: "Natural-language request",
    detail: "A user asks for a task, system, workflow, or product outcome."
  },
  {
    step: "02",
    eyebrow: "Routing",
    title: "Plan + system selection",
    detail: "The system decides whether the job fits chat, workflow, local runtime, or product logic."
  },
  {
    step: "03",
    eyebrow: "Execution",
    title: "Runtime + tooling",
    detail: "Models, tools, storage, and local execution do the real work with visible state."
  },
  {
    step: "04",
    eyebrow: "Output",
    title: "Usable product surface",
    detail: "The result is delivered through an interface people can actually understand and use."
  }
] as const;

const productSignals = featuredSystems.map((system) => ({
  id: system.id,
  step: system.id === "algsoch" ? "01" : system.id === "speakai" ? "02" : system.id === "careops" ? "03" : "04",
  title: system.title,
  detail: system.shorthand,
  proof: system.outcomes[0],
  tags: system.signals,
  stack: system.stack,
  layers: system.layers,
  deliverables: system.deliverables,
  links: system.links.slice(0, 4)
}));

const skillCatMap: Record<string, string> = {
  "React": "Frontend", "Next.js": "Frontend", "TypeScript": "Languages", "Kotlin": "Languages",
  "Python": "Languages", "Jetpack Compose": "Frontend", "Tailwind CSS": "Frontend",
  "FastAPI": "Backend", "PostgreSQL": "Backend", "Node.js": "Backend",
  "Docker": "Infrastructure", "Vercel": "Infrastructure", "Render": "Infrastructure",
  "LangGraph": "AI / ML", "LangChain": "AI / ML", "PyTorch": "AI / ML",
  "FFmpeg": "Tools", "Coral MCP": "Tools", "Coral SQL": "Tools",
  "RunAnywhere SDK": "AI / ML", "SmolLM2": "AI / ML", "SmolVLM": "AI / ML",
  "Android": "Infrastructure", "Vite": "Infrastructure", "IndexedDB": "Backend",
  "llama.cpp WASM": "AI / ML", "Web Speech API": "Frontend", "Agent orchestration": "AI / ML",
};

const proofPoints = [
  "Full-stack systems that connect interface, runtime, and delivery.",
  "AI products with real workflow shape instead of shallow prompt wrappers.",
  "Local-first and on-device thinking where privacy and speed actually matter."
] as const;

const liveState = [
  ["system.mode", "applied_intelligence"],
  ["interaction.model", "visible_and_controlled"],
  ["delivery.goal", "usable_product_output"]
] as const;

const systemColors: Record<string, { border: string; bg: string; text: string; bar: string; tag: string; tagBorder: string }> = {
  algsoch:        { border: "border-blue-500/25", bg: "bg-blue-500/8", text: "text-blue-400", bar: "rgba(59,130,246,0.6)", tag: "border-blue-500/25 bg-blue-500/10 text-blue-400/90", tagBorder: "border-blue-500/25" },
  speakai:        { border: "border-sky-500/25", bg: "bg-sky-500/8", text: "text-sky-400", bar: "rgba(14,165,233,0.6)", tag: "border-sky-500/25 bg-sky-500/10 text-sky-400/90", tagBorder: "border-sky-500/25" },
  careops:        { border: "border-teal-500/25", bg: "bg-teal-500/8", text: "text-teal-400", bar: "rgba(20,184,166,0.6)", tag: "border-teal-500/25 bg-teal-500/10 text-teal-400/90", tagBorder: "border-teal-500/25" },
  "algsoch-news": { border: "border-amber-500/25", bg: "bg-amber-500/8", text: "text-amber-400", bar: "rgba(245,158,11,0.6)", tag: "border-amber-500/25 bg-amber-500/10 text-amber-400/90", tagBorder: "border-amber-500/25" },
};

const tagColorWheel = [
  "border-rose-500/25 bg-rose-500/10 text-rose-400/90",
  "border-cyan-500/25 bg-cyan-500/10 text-cyan-400/90",
  "border-violet-500/25 bg-violet-500/10 text-violet-400/90",
  "border-lime-500/25 bg-lime-500/10 text-lime-400/90",
  "border-pink-500/25 bg-pink-500/10 text-pink-400/90",
  "border-yellow-500/25 bg-yellow-500/10 text-yellow-400/90",
];

const metricLabels = ["Completeness", "Execution", "AI Depth", "Product", "Recency"];
const metricKeys = ["completeness", "executionDepth", "aiDepth", "productSignal", "recencySignal"] as const;

function RadarChart({ systemId }: { systemId: string }) {
  const signals = useMemo(() => {
    const active = repositorySignals.find((r) => r.id === systemId);
    const all = repositorySignals.filter((r) => ["algsoch", "speakai", "careops", "algsoch-news"].includes(r.id));
    const avg: Record<string, number> = {};
    for (const key of metricKeys) {
      avg[key] = all.reduce((s, r) => s + (r[key] as number), 0) / all.length;
    }
    return { active, avg };
  }, [systemId]);

  const color = systemColors[systemId] ?? systemColors.algsoch;
  const cx = 80, cy = 80, r = 60;
  const levels = [0.25, 0.5, 0.75, 1];
  const numAxes = metricKeys.length;

  const angleStep = (Math.PI * 2) / numAxes;
  const rotOffset = -Math.PI / 2;

  const toPoint = (val: number, i: number) => {
    const angle = rotOffset + i * angleStep;
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) };
  };

  const gridPolygons = levels.map((lvl) => {
    const pts = metricKeys.map((_, i) => toPoint(lvl, i));
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
  });

  const activePts = signals.active
    ? metricKeys.map((key, i) => toPoint((signals.active![key] as number), i))
    : [];
  const avgPts = metricKeys.map((key, i) => toPoint(signals.avg[key], i));

  return (
    <svg viewBox="0 0 160 160" className="w-full max-w-[160px] h-auto">
      {gridPolygons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      ))}
      {metricKeys.map((_, i) => {
        const p = toPoint(1, i);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />;
      })}
      {avgPts.length > 0 && (
        <polygon
          points={avgPts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
      )}
      {activePts.length > 0 && (
        <polygon
          points={activePts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill={color.bar.replace("0.6", "0.15")}
          stroke={color.bar}
          strokeWidth="1.2"
        />
      )}
      {metricKeys.map((key, i) => {
        const p = toPoint(1, i);
        const label = metricLabels[i].split(" ")[0];
        const labelR = r + 14;
        const lp = toPoint(labelR / r, i);
        return (
          <text
            key={key}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted/50 text-[5px] font-mono"
          >
            {label}
          </text>
        );
      })}
      {activePts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill={color.bar} />
      ))}
    </svg>
  );
}

export function HeroSignalMap() {
  return (
    <div className="surface relative w-full min-w-0 overflow-hidden rounded-[32px] p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/8 to-transparent" />

      <div className="relative min-w-0">
        <div className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent/75">Operating View</div>
            <div className="mt-2 max-w-xl text-sm text-muted">
              A cleaner read of how Vicky turns AI capability into software people can understand and use.
            </div>
          </div>
          <div className="self-start rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            Product-Grade Systems
          </div>
        </div>

        <div className="grid min-w-0 gap-4">
          <div className="grid min-w-0 gap-4 xl:grid-cols-[1.06fr_0.94fr]">
            <div className="surface-soft min-w-0 rounded-[28px] p-4 sm:p-5">
              <div className="mb-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">System flow</div>
                <div className="text-xs text-muted">Request → route → execute → deliver</div>
              </div>

              <div className="relative min-w-0 pl-4 sm:pl-5">
                <div className="absolute bottom-2 left-[9px] top-2 w-px bg-gradient-to-b from-accent/45 via-line/80 to-transparent sm:left-[11px]" />
                <div className="grid min-w-0 gap-3">
                  {stages.map((stage, index) => (
                    <motion.div
                      key={stage.step}
                      className="relative min-w-0 rounded-[24px] border border-line/70 bg-white/4 p-4 pl-5 sm:pl-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06, duration: 0.28 }}
                    >
                      <div className="absolute left-[-4px] top-5 h-2.5 w-2.5 rounded-full border border-accent/40 bg-canvas shadow-[0_0_0_4px_rgba(10,14,20,0.95)] sm:left-[-5px]" />
                      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/80">{stage.eyebrow}</div>
                        <div className="self-start rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-mono text-[10px] text-accent">
                          {stage.step}
                        </div>
                      </div>
                      <div className="mt-2 text-base font-semibold leading-tight text-ink">{stage.title}</div>
                      <div className="mt-2 text-sm leading-6 text-muted">{stage.detail}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-1">
              <div className="surface-soft min-w-0 rounded-[28px] p-4 sm:p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Core principle</div>
                <div className="mt-3 text-lg font-semibold leading-tight text-ink">
                  AI should ship as a product system, not a detached feature.
                </div>
                <div className="mt-3 text-sm leading-6 text-muted">
                  Interface, runtime, workflow, and delivery should feel like one coherent piece of software.
                </div>
              </div>

              <div className="surface-soft min-w-0 rounded-[28px] p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Live state</div>
                <div className="mt-4 space-y-3 font-mono text-xs text-muted">
                  {liveState.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex min-w-0 flex-col gap-2 rounded-xl border border-line/70 bg-white/4 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0 break-all">{label}</span>
                      <span className="min-w-0 break-all text-accent sm:text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="surface-soft min-w-0 rounded-[28px] p-4 sm:p-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">What this proves</div>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {proofPoints.map((point) => (
                <div
                  key={point}
                  className="min-w-0 rounded-2xl border border-line/70 bg-white/4 p-4 text-sm leading-6 text-muted"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type HeroFeaturedSystemsProps = {
  embedded?: boolean;
};

export function HeroFeaturedSystems({ embedded = false }: HeroFeaturedSystemsProps) {
  const [activeId, setActiveId] = useState(productSignals[0]?.id ?? "");
  const activeSignal = productSignals.find((signal) => signal.id === activeId) ?? productSignals[0];
  const videoLink = activeSignal?.links.find((link) => link.label === "YouTube Demo")?.href;
  const actionLinks = activeSignal?.links.filter((link) => link.label !== "YouTube Demo") ?? [];

  if (embedded && !activeSignal) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        embedded ? "min-w-0 rounded-[22px] border border-line/70 bg-black/15 p-4 h-full content-start" : ""
      )}
    >
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Featured systems</div>
          <div className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {embedded
              ? "Four flagship systems, compressed into one fast product rail."
              : "Four flagship systems, compressed into a faster first-read product strip."}
          </div>
        </div>
      </div>

      {embedded ? (
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {productSignals.map((signal) => {
              const active = signal.id === activeSignal.id;
              const sc = systemColors[signal.id] ?? systemColors.algsoch;
              return (
                <button
                  key={signal.id}
                  className={cn(
                    "min-w-0 rounded-[18px] border px-3 py-3 text-left transition",
                    active
                      ? `${sc.border} ${sc.bg}`
                      : "border-line/70 bg-white/4 hover:border-accent/20"
                  )}
                  onClick={() => setActiveId(signal.id)}
                >
                  <div className={cn("font-mono text-[10px] uppercase tracking-[0.16em]", active ? sc.text : "text-accent/75")}>
                    {signal.step} · {signal.title}
                  </div>
                  <div className="mt-1 text-sm font-semibold leading-tight text-ink">{signal.detail}</div>
                  <div className="mt-2 flex min-w-0 flex-wrap gap-1">
                    {signal.tags.map((tag, ti) => (
                      <span
                        key={`${signal.id}-${tag}`}
                        className={cn(
                          "rounded-full border px-2 py-1 text-[9px] font-medium uppercase tracking-[0.08em]",
                          active ? tagColorWheel[ti % tagColorWheel.length] : "border-line/70 bg-white/4 text-ink/85"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="min-w-0 rounded-[20px] border border-line/70 bg-white/4 p-3.5">
            <div className="grid min-w-0 gap-3">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/75">{activeSignal.step}</div>
                  <div className="min-w-0 text-base font-semibold leading-tight text-ink">{activeSignal.title}</div>
                </div>
                <div className="mt-1.5 text-[13px] leading-5 text-muted">{activeSignal.detail}</div>
                <div className="mt-2 text-[12px] leading-5 text-ink/85">{activeSignal.proof}</div>

                <div className="mt-2.5 flex min-w-0 flex-wrap gap-1.5">
                  {activeSignal.tags.map((tag, ti) => (
                    <span
                      key={tag}
                      className={`rounded-full border ${tagColorWheel[ti % tagColorWheel.length]} px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em]`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Button href={getSystemRouteHref(activeSignal.id)} size="sm" className="h-8 min-w-0 justify-center px-3 text-[10px]">
                    <span className="truncate">Case Study</span>
                  </Button>
                  {actionLinks.map((link) => (
                    <Button
                      key={`${activeSignal.id}-${link.label}`}
                      href={link.href ?? "#"}
                      variant={link.variant === "primary" ? "primary" : "secondary"}
                      size="sm"
                      className="h-8 min-w-0 justify-center px-3 text-[10px]"
                      aria-label={`${activeSignal.title} ${link.label}`}
                    >
                      <span className="truncate">{compactActionLabel(link.label)}</span>
                    </Button>
                  ))}

                  {videoLink ? (
                    <Button
                      href={videoLink}
                      variant="secondary"
                      size="sm"
                      className="h-8 min-w-0 justify-center px-3 text-[10px]"
                      aria-label={`${activeSignal.title} video demo`}
                    >
                      <span className="truncate">Video</span>
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <RadarChart systemId={activeSignal.id} />
                </div>
                <div className="flex-1 min-w-0 text-[10px] text-muted/70 leading-relaxed pt-1">
                  <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/50 mb-1.5">Signal profile</div>
                  {(() => {
                    const sig = repositorySignals.find((r) => r.id === activeSignal.id);
                    if (!sig) return null;
                    return (
                      <div className="space-y-1">
                        {([["completeness", "Completeness"], ["executionDepth", "Execution"], ["aiDepth", "AI Depth"], ["productSignal", "Product"], ["recencySignal", "Recency"]] as const).map(([key, label]) => {
                          const val = sig[key];
                          const sc = systemColors[activeSignal.id] ?? systemColors.algsoch;
                          return (
                            <div key={key} className="flex items-center gap-2">
                              <span className="w-14 truncate text-muted/60">{label}</span>
                              <div className="flex-1 h-1.5 rounded-full bg-white/6 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${val * 100}%`, backgroundColor: sc.bar }} />
                              </div>
                              <span className="w-6 text-right font-mono text-[9px] text-muted">{Math.round(val * 100)}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* stack + layers analysis */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0">
                  <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/50 mb-1.5">Tech Stack</div>
                  <div className="flex flex-wrap gap-1">
                    {activeSignal.stack.map((s, si) => {
                      const cat = skillCatMap[s] ?? "Tools";
                      const ci = ["Languages", "AI / ML", "Frontend", "Backend", "Infrastructure", "Tools"].indexOf(cat);
                      const tc = tagColorWheel[Math.max(0, ci) % tagColorWheel.length];
                      return (
                        <span key={s} className={`rounded-full border ${tc} px-2 py-[1px] text-[8px] font-mono`}>{s}</span>
                      );
                    })}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/50 mb-1.5">Architecture Layers</div>
                  <div className="text-[10px] text-muted/80 space-y-0.5">
                    {activeSignal.layers.map((l) => (
                      <div key={l} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-accent/50 shrink-0" />
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* deliverables + outcomes */}
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="min-w-0">
                  <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/50 mb-1">Deliverables</div>
                  <div className="flex flex-wrap gap-1">
                    {activeSignal.deliverables.map((d) => (
                      <span key={d} className="rounded-md border border-line/60 bg-white/4 px-1.5 py-0.5 text-[8px] font-mono text-muted/80">{d}</span>
                    ))}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/50 mb-1">Key Outcome</div>
                  <div className="text-[10px] text-muted/80 leading-relaxed">{activeSignal.proof}</div>
                </div>
              </div>

              {/* deep-dive Q&A pulled from project data */}
              {(() => {
                const sys = featuredSystems.find((s) => s.id === activeSignal.id);
                if (!sys) return null;
                const qa: { q: string; a: string; icon: string }[] = [
                  { q: "What problem does this solve?", a: sys.problem, icon: "!" },
                  { q: "What makes it significant?", a: sys.significance, icon: "★" },
                  { q: "How does the intelligence work?", a: sys.intelligence, icon: "◈" },
                  { q: "How is it architected?", a: sys.architecture.join(" "), icon: "⊡" },
                ];
                const sig = repositorySignals.find((r) => r.id === activeSignal.id);
                if (sig) {
                  qa.push({ q: "Why does this matter?", a: sig.whyItMatters, icon: "▶" });
                  qa.push({ q: "What are the highlights?", a: (sig.highlights ?? []).join(" · ") || "See repository for details.", icon: "◆" });
                }
                const sc = systemColors[activeSignal.id] ?? systemColors.algsoch;
                return (
                  <div className="min-w-0">
                    <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/50 mb-2">Deep Dive Q&A</div>
                    <div className="grid gap-2">
                      {qa.map(({ q, a, icon }, i) => {
                        const tc = tagColorWheel[i % tagColorWheel.length];
                        return (
                          <div
                            key={q}
                            className="rounded-xl border bg-white/4 overflow-hidden"
                            style={{ borderColor: sc.bar.replace("0.6", "0.2") }}
                          >
                            <div className="flex items-start gap-2 px-2.5 pt-2 pb-1">
                              <span className={`mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded text-[7px] font-mono font-bold ${tc}`}>
                                {icon}
                              </span>
                              <div className="text-[10px] font-semibold leading-tight" style={{ color: sc.text }}>
                                {q}
                              </div>
                            </div>
                            <div className="px-2.5 pb-2 pt-0.5">
                              <div className="text-[9px] text-muted/80 leading-relaxed pl-6 border-l" style={{ borderColor: sc.bar.replace("0.6", "0.15") }}>
                                {a}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {videoLink ? (
                <YouTubePreview
                  url={videoLink}
                  title={activeSignal.title}
                  note="Click to play embedded demo."
                  className="w-full"
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-4">
          {productSignals.map((signal) => {
            const sc = systemColors[signal.id] ?? systemColors.algsoch;
            return (
              <div key={signal.id} className="surface-soft min-w-0 rounded-[20px] border border-line/70 bg-white/4 p-3.5">
                <div className="grid gap-3 min-w-0">
                  <div className="min-w-0">
                    <div className={cn("font-mono text-[10px] uppercase tracking-[0.18em]", sc.text)}>{signal.step}</div>
                    <div className="mt-1 text-base font-semibold leading-tight text-ink">{signal.title}</div>
                    <div className="mt-2 text-[13px] leading-5 text-muted">{signal.detail}</div>

                    <div className="mt-3 flex min-w-0 flex-wrap gap-1.5">
                      {signal.tags.map((tag, ti) => (
                        <span
                          key={tag}
                          className={`rounded-full border ${tagColorWheel[ti % tagColorWheel.length]} px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-wrap gap-1.5">
                    <Button href={getSystemRouteHref(signal.id)} size="sm" className="h-8 min-w-0 justify-center px-3 text-[10px]">
                      <span className="truncate">Case Study</span>
                    </Button>
                    {signal.links.map((link) => (
                      <Button
                        key={`${signal.id}-${link.label}`}
                        href={link.href ?? "#"}
                        variant={link.variant === "primary" ? "primary" : "secondary"}
                        size="sm"
                        className="h-8 min-w-0 justify-center px-3 text-[10px]"
                        aria-label={`${signal.title} ${link.label}`}
                      >
                        <span className="truncate">{compactActionLabel(link.label)}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
