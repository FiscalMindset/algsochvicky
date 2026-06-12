import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { buildModes } from "../../content/portfolio";
import { SectionHeading } from "../ui/section-heading";
import { FiscalMindsetBadge } from "../ui/fiscalmindset-badge";

export function BuildWithAiSection() {
  const [activeId, setActiveId] = useState(buildModes[0]?.id ?? "");
  const activeMode = useMemo(() => buildModes.find((mode) => mode.id === activeId) ?? buildModes[0], [activeId]);

  if (!activeMode) {
    return null;
  }

  return (
    <section id="build-modes" className="section-space">
      <div className="section-frame">
        <div className="rounded-xl border border-orange-500/50 bg-black/10 p-5 sm:rounded-2xl sm:border-2 sm:p-6 lg:rounded-3xl lg:p-10">
        <SectionHeading
          eyebrow="What I Build"
          title="AI products across different domains."
          description="Each type requires different architecture, interface patterns, and tooling. Here's what I've built in each category."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {buildModes.map((mode) => {
            const active = mode.id === activeMode.id;
            return (
              <button
                key={mode.id}
                className={`text-left transition ${active ? "" : "opacity-70 hover:opacity-100"}`}
                onClick={() => setActiveId(mode.id)}
              >
                <div className={`rounded-2xl border p-4 ${active ? "border-accent/40 bg-accent/10" : "border-line/75 bg-white/4"}`}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75 mb-2">{mode.title}</div>
                  <p className="text-sm text-muted line-clamp-2">{mode.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {mode.relevantSystems.map((system) => (
                      <span key={system} className={`rounded-full border px-2 py-0.5 text-[10px] ${active ? "border-accent/30 bg-accent/10 text-accent" : "border-line/50 text-muted"}`}>
                        {system}
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
            key={activeMode.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="rounded-2xl border border-line/75 bg-canvas-elevated/70 p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent/75">{activeMode.title}</div>
              <h3 className="mt-3 text-xl font-semibold text-ink">{activeMode.summary}</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line/70 bg-white/4 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Interface Pattern</div>
                  <div className="mt-2 text-sm text-muted">{activeMode.interfacePattern}</div>
                </div>
                <div className="rounded-xl border border-line/70 bg-white/4 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Output Style</div>
                  <div className="mt-2 text-sm text-muted">{activeMode.outputStyle}</div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-line/70 bg-black/15 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75">Architecture flow</div>
                <div className="mt-3 grid gap-2">
                  {activeMode.architectureFlow.map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-lg border border-line/70 bg-white/4 p-2.5 text-sm text-muted">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[10px] text-accent">
                        {index + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-line/75 bg-canvas-elevated/70 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75">Technologies</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeMode.technologies.map((technology) => (
                    <span key={technology} className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs text-ink">
                      {technology}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line/75 bg-canvas-elevated/70 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75">Projects</div>
                <div className="mt-3 grid gap-2">
                  {activeMode.relevantSystems.map((system) => (
                    <div key={system} className="rounded-xl border border-line/70 bg-white/4 p-3 text-sm text-ink">
                      {system}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line/75 bg-canvas-elevated/70 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75">What I learned</div>
                <p className="mt-3 text-sm text-muted">
                  Building {activeMode.title.toLowerCase()} requires adapting the core AI engineering approach to {activeMode.interfacePattern.split(' ')[0].toLowerCase()} interfaces. This shows range in applying the same principles across different product types.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      <FiscalMindsetBadge />
      </div>
    </div>
    </section>
  );
}

