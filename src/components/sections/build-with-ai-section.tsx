import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { buildModes } from "../../content/portfolio";
import { SectionHeading } from "../ui/section-heading";

export function BuildWithAiSection() {
  const [activeId, setActiveId] = useState(buildModes[0]?.id ?? "");
  const activeMode = useMemo(() => buildModes.find((mode) => mode.id === activeId) ?? buildModes[0], [activeId]);

  if (!activeMode) {
    return null;
  }

  return (
    <section id="build-modes" className="section-space">
      <div className="section-frame">
        <SectionHeading
          eyebrow="Build Anything With AI"
          title="One engineering mindset, many product forms."
          description="The same core approach can be directed toward chat, voice, workflows, local tooling, education, or multimodal products. Switching the mode changes the architecture emphasis, interface pattern, and system shape."
        />

        <div className="rounded-[32px] border border-line/75 bg-white/4 p-4 sm:p-6">
          <div className="flex snap-x gap-2 overflow-x-auto pb-2">
            {buildModes.map((mode) => {
              const active = mode.id === activeMode.id;
              return (
                <button
                  key={mode.id}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                    active ? "border-accent/40 bg-accent/12 text-ink" : "border-line/75 text-muted hover:text-ink"
                  }`}
                  onClick={() => setActiveId(mode.id)}
                >
                  {mode.title}
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
              <div className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent/75">{activeMode.title}</div>
                <h3 className="mt-3 text-2xl font-semibold text-ink">{activeMode.summary}</h3>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-line/70 bg-white/4 p-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Interface Pattern</div>
                    <div className="mt-3 text-sm text-muted">{activeMode.interfacePattern}</div>
                  </div>
                  <div className="rounded-[22px] border border-line/70 bg-white/4 p-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Output Style</div>
                    <div className="mt-3 text-sm text-muted">{activeMode.outputStyle}</div>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-line/70 bg-black/15 p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Architecture flow</div>
                  <div className="mt-4 grid gap-3">
                    {activeMode.architectureFlow.map((step, index) => (
                      <div key={step} className="flex items-center gap-3 rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[11px] text-accent">
                          0{index + 1}
                        </div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-5">
                <div className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Core technologies</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeMode.technologies.map((technology) => (
                      <span key={technology} className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-sm text-ink">
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Relevant project mapping</div>
                  <div className="mt-4 grid gap-3">
                    {activeMode.relevantSystems.map((system) => (
                      <div key={system} className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                        {system}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Why this matters</div>
                  <p className="mt-4 text-sm text-muted">
                    This selector is meant to show range without losing seriousness. Vicky can adapt the same underlying
                    engineering discipline across multiple AI product shapes while changing the interface and workflow
                    to fit the job.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
