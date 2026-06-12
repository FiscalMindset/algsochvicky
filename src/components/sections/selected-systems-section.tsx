import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { featuredSystems, repositorySignals } from "../../content/portfolio";
import { systemDiagrams } from "../../content/system-diagrams";
import { compactActionLabel, getSystemRouteHref } from "../../lib/utils";
import { Button } from "../ui/button";
import { GitHubCommitSurface } from "../ui/github-commit-surface";
import { MermaidDiagram } from "../ui/mermaid-diagram";
import { Surface } from "../ui/surface";
import { FiscalMindsetBadge } from "../ui/fiscalmindset-badge";
import { VectorFieldBg } from "../visuals/vector-field-bg";

const sysColors: Record<string, { border: string; bg: string; text: string; ring: string; badge: string; bar: string; label: string }> = {
  algsoch:        { border: "border-blue-500/30", bg: "bg-blue-500/10", text: "text-blue-400", ring: "ring-blue-500/30", badge: "border-blue-500/30 bg-blue-500/12 text-blue-400", bar: "rgba(59,130,246,0.6)", label: "border-blue-500/20 bg-blue-500/8 text-blue-400/90" },
  speakai:        { border: "border-sky-500/30", bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/30", badge: "border-sky-500/30 bg-sky-500/12 text-sky-400", bar: "rgba(14,165,233,0.6)", label: "border-sky-500/20 bg-sky-500/8 text-sky-400/90" },
  careops:        { border: "border-teal-500/30", bg: "bg-teal-500/10", text: "text-teal-400", ring: "ring-teal-500/30", badge: "border-teal-500/30 bg-teal-500/12 text-teal-400", bar: "rgba(20,184,166,0.6)", label: "border-teal-500/20 bg-teal-500/8 text-teal-400/90" },
  "algsoch-news": { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/30", badge: "border-amber-500/30 bg-amber-500/12 text-amber-400", bar: "rgba(245,158,11,0.6)", label: "border-amber-500/20 bg-amber-500/8 text-amber-400/90" },
};

const tagWheel = [
  "border-rose-500/30 bg-rose-500/10 text-rose-400/90",
  "border-cyan-500/30 bg-cyan-500/10 text-cyan-400/90",
  "border-violet-500/30 bg-violet-500/10 text-violet-400/90",
  "border-lime-500/30 bg-lime-500/10 text-lime-400/90",
  "border-pink-500/30 bg-pink-500/10 text-pink-400/90",
  "border-yellow-500/30 bg-yellow-500/10 text-yellow-400/90",
];

const catTagMap: Record<string, string> = {
  "Languages": "border-blue-500/25 bg-blue-500/8 text-blue-400/80",
  "AI / ML": "border-purple-500/25 bg-purple-500/8 text-purple-400/80",
  "Frontend": "border-cyan-500/25 bg-cyan-500/8 text-cyan-400/80",
  "Backend": "border-emerald-500/25 bg-emerald-500/8 text-emerald-400/80",
  "Infrastructure": "border-orange-500/25 bg-orange-500/8 text-orange-400/80",
  "Tools": "border-pink-500/25 bg-pink-500/8 text-pink-400/80",
};

const skillCat: Record<string, string> = {
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

export function SelectedSystemsSection() {
  const [activeId, setActiveId] = useState(featuredSystems[0]?.id ?? "");
  const activeSystem = useMemo(
    () => featuredSystems.find((system) => system.id === activeId) ?? featuredSystems[0],
    [activeId]
  );
  const sc = sysColors[activeSystem.id] ?? sysColors.algsoch;

  if (!activeSystem) return null;

  return (
    <section id="systems" className="section-space relative overflow-hidden">
      <VectorFieldBg />
      <div className="section-frame relative z-10">
        <div className="rounded-xl border border-orange-500/50 bg-black/10 p-5 sm:rounded-2xl sm:border-2 sm:p-6 lg:rounded-3xl lg:p-10">
          <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_280px] lg:items-start">
            <div className="max-w-3xl">
              <div className="mb-3 inline-block rounded-full border-2 border-orange-500 bg-gray-100 px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.3em] text-gray-900">
                Selected Systems
              </div>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-[2.75rem]" style={{lineHeight: '1.15'}}>
                Problems I've solved with AI.
              </h2>
              <p className="mt-2 max-w-2xl text-pretty text-sm leading-6 text-muted lg:text-base">
                Each project solves a real problem. Click to see how I approached it and what I built.
              </p>
            </div>
            <p className="max-w-xs text-sm leading-6 text-muted">Ranked by complexity and real-world usefulness.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="grid content-start gap-2 self-start">
              {featuredSystems.map((system) => {
                const active = system.id === activeSystem.id;
                const scc = sysColors[system.id] ?? sysColors.algsoch;
                return (
                  <button key={system.id} className="text-left transition hover:opacity-100" onClick={() => setActiveId(system.id)}>
                    <div className={`rounded-[20px] border p-3 sm:p-3.5 transition-all ${active ? `${scc.border} ${scc.bg}` : "border-line/75 bg-white/4 opacity-75 hover:opacity-100"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${active ? scc.text : "bg-muted/30"}`} />
                            <div className="text-[15px] font-semibold leading-tight text-ink sm:text-base">{system.title}</div>
                          </div>
                          <div className="mt-1 line-clamp-1 text-[12px] leading-5 text-muted">{system.shorthand}</div>
                        </div>
                        <div className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${active ? scc.badge : "border-line/70 bg-black/20 text-muted"}`}>
                          {active ? "Active" : "View"}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {system.signals.slice(0, 2).map((signal, si) => (
                          <span key={signal} className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] ${active ? tagWheel[si % tagWheel.length] : "border-line/70 bg-white/4 text-muted"}`}>
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSystem.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Surface className="relative p-5 sm:p-6 lg:p-8">
                  <div className={`pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br ${activeSystem.accent}`} />
                  <div className="pointer-events-none absolute inset-0 rounded-[28px] panel-grid opacity-30" />
                  <div className="relative">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${sc.text}`} style={{ backgroundColor: sc.bar }} />
                          <div className={`font-mono text-[11px] uppercase tracking-[0.32em] ${sc.text}`}>Case Study</div>
                        </div>
                        <h3 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl" style={{lineHeight: '1.2'}}>
                          {activeSystem.title}
                        </h3>
                        <p className="mt-4 text-base text-muted sm:text-lg">{activeSystem.summary}</p>
                      </div>
                      <div className="grid w-full gap-2 self-start sm:grid-cols-2 xl:max-w-md">
                        <Button href={getSystemRouteHref(activeSystem.id)} size="sm" className="w-full min-w-0 px-3">
                          <span className="truncate">Case Study</span>
                        </Button>
                        {activeSystem.links.map((link) => (
                          <Button key={link.label} href={link.href ?? "#"} variant={link.variant === "primary" ? "primary" : "secondary"} size="sm" className="w-full min-w-0 px-3" aria-label={`${activeSystem.title} ${link.label}`}>
                            <span className="truncate">{compactActionLabel(link.label)}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-3">
                      <div className="rounded-2xl border p-3 sm:p-4" style={{ borderColor: sc.bar.replace("0.6", "0.2") }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px]">!</span>
                          <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${sc.text}`}>Problem</div>
                        </div>
                        <p className="text-xs text-muted/90 leading-relaxed">{activeSystem.problem}</p>
                      </div>
                      <div className="rounded-2xl border p-3 sm:p-4" style={{ borderColor: sc.bar.replace("0.6", "0.2") }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px]">★</span>
                          <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${sc.text}`}>Significance</div>
                        </div>
                        <p className="text-xs text-muted/90 leading-relaxed">{activeSystem.significance}</p>
                      </div>
                      <div className="rounded-2xl border p-3 sm:p-4" style={{ borderColor: sc.bar.replace("0.6", "0.2") }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[11px]">◈</span>
                          <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${sc.text}`}>Intelligence</div>
                        </div>
                        <p className="text-xs text-muted/90 leading-relaxed">{activeSystem.intelligence}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.2fr]">
                      <GitHubCommitSurface
                        repoUrl={activeSystem.links.find((link) => link.label === "Repository")?.href}
                        title={activeSystem.title}
                        fallbackEntries={[...activeSystem.architecture.slice(0, 2), ...activeSystem.outcomes.slice(0, 2)]}
                        compact
                      />
                      <div className="rounded-2xl border p-3 sm:p-4" style={{ borderColor: sc.bar.replace("0.6", "0.2") }}>
                        <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${sc.text} mb-2`}>Stack</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeSystem.stack.map((item) => {
                            const cat = skillCat[item] ?? "Tools";
                            const ct = catTagMap[cat] ?? catTagMap.Tools;
                            return <span key={item} className={`rounded-full border ${ct} px-2 py-0.5 text-[10px] font-mono`}>{item}</span>;
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-2xl border p-3 sm:p-4" style={{ borderColor: sc.bar.replace("0.6", "0.2") }}>
                        <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${sc.text} mb-2`}>Architecture</div>
                        <div className="space-y-2">
                          {activeSystem.architecture.map((point, i) => (
                            <div key={point} className="flex items-start gap-2">
                              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[7px] font-mono font-bold ${tagWheel[i % tagWheel.length]}`}>{i + 1}</span>
                              <span className="text-xs text-muted/80 leading-relaxed">{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border p-3 sm:p-4" style={{ borderColor: sc.bar.replace("0.6", "0.2") }}>
                        <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${sc.text} mb-2`}>Signal Profile</div>
                        {(() => {
                          const sig = repositorySignals.find((r) => r.id === activeSystem.id);
                          if (!sig) return <div className="text-xs text-muted/60">No signal data</div>;
                          const pairs: [string, string][] = [["completeness", "Complete"], ["executionDepth", "Execution"], ["aiDepth", "AI Depth"], ["productSignal", "Product"], ["recencySignal", "Recency"]];
                          return (
                            <div className="space-y-1.5">
                              {pairs.map(([k, label]) => {
                                const val = sig[k as keyof typeof sig] as number;
                                return (
                                  <div key={k} className="flex items-center gap-2">
                                    <span className="w-14 truncate font-mono text-[8px] text-muted/50">{label}</span>
                                    <div className="flex-1 h-1.5 rounded-full bg-white/6 overflow-hidden">
                                      <div className="h-full rounded-full" style={{ width: `${val * 100}%`, backgroundColor: sc.bar }} />
                                    </div>
                                    <span className="w-5 text-right font-mono text-[8px] text-muted">{Math.round(val * 100)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                      <div className="rounded-2xl border p-3 sm:p-4" style={{ borderColor: sc.bar.replace("0.6", "0.2") }}>
                        <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${sc.text} mb-2`}>Layers</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeSystem.layers.map((layer, li) => (
                            <span key={layer} className={`rounded-md border ${tagWheel[li % tagWheel.length]} px-2 py-0.5 text-[9px] font-mono`}>{layer}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border p-3 sm:p-4" style={{ borderColor: sc.bar.replace("0.6", "0.2") }}>
                        <div className={`font-mono text-[10px] uppercase tracking-[0.2em] ${sc.text} mb-2`}>Outcomes</div>
                        <div className="space-y-1.5">
                          {activeSystem.outcomes.map((o) => (
                            <div key={o} className="flex items-start gap-1.5">
                              <span className="mt-0.5 text-[9px] text-emerald-400/70 shrink-0">◆</span>
                              <span className="text-xs text-muted/80">{o}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {systemDiagrams[activeSystem.id]?.length ? (
                      <div className="mt-4">
                        <MermaidDiagram
                          diagrams={systemDiagrams[activeSystem.id]}
                          className="w-full"
                        />
                      </div>
                    ) : null}
                  </div>
                </Surface>
              </motion.div>
            </AnimatePresence>
          </div>
        <FiscalMindsetBadge />
        </div>
      </div>
    </section>
  );
}

