import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { featuredSystems } from "../../content/portfolio";
import { Button } from "../ui/button";
import { SectionHeading } from "../ui/section-heading";
import { Surface } from "../ui/surface";

export function SelectedSystemsSection() {
  const [activeId, setActiveId] = useState(featuredSystems[0]?.id ?? "");
  const activeSystem = useMemo(
    () => featuredSystems.find((system) => system.id === activeId) ?? featuredSystems[0],
    [activeId]
  );

  if (!activeSystem) {
    return null;
  }

  return (
    <section id="systems" className="section-space">
      <div className="section-frame">
        <SectionHeading
          eyebrow="Selected Systems"
          title="Built intelligence, engineered as products."
          description="These are not presented as hobby projects or a repo dump. Each system is positioned as a proof point for how Vicky designs interfaces, workflows, runtime behavior, and product maturity around AI."
          aside={
            <p>
              Each module is treated like a case-study surface: thesis, workflow, architecture, and why the system
              matters all sit in one view.
            </p>
          }
        />

        <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="grid gap-3">
            {featuredSystems.map((system) => {
              const active = system.id === activeSystem.id;
              return (
                <button
                  key={system.id}
                  className={`text-left transition ${active ? "scale-[1.01]" : "opacity-90 hover:opacity-100"}`}
                  onClick={() => setActiveId(system.id)}
                >
                  <div
                    className={`rounded-[26px] border p-4 sm:p-5 ${
                      active ? "border-accent/40 bg-accent/10" : "border-line/75 bg-white/4"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted">{system.shorthand}</div>
                    <div className="mt-3 text-lg font-semibold text-ink sm:text-xl">{system.title}</div>
                    <div className="mt-2 text-sm text-muted">{system.thesis}</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {system.signals.map((signal) => (
                        <span
                          key={signal}
                          className="rounded-full border border-line/70 bg-white/4 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted"
                        >
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
              <Surface className="relative overflow-hidden p-5 sm:p-6 lg:p-8">
                <div className={`absolute inset-0 bg-gradient-to-br ${activeSystem.accent}`} />
                <div className="pointer-events-none absolute inset-0 panel-grid opacity-30" />
                <div className="relative">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent/80">Case Study</div>
                      <h3 className="mt-3 text-balance font-display text-2xl font-semibold text-ink sm:text-3xl lg:text-4xl">
                        {activeSystem.title}
                      </h3>
                      <p className="mt-4 text-base text-muted sm:text-lg">{activeSystem.summary}</p>
                    </div>

                    <div className="grid gap-2 self-start sm:grid-cols-2 lg:grid-cols-1">
                      {activeSystem.links.map((link) => (
                        <Button
                          key={link.label}
                          href={link.href ?? "#"}
                          variant={link.variant === "primary" ? "primary" : "secondary"}
                        >
                          {link.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <div className="grid gap-5">
                      <div className="rounded-[24px] border border-line/75 bg-black/15 p-4 sm:p-5">
                        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/70">What it solves</div>
                        <p className="mt-3 text-sm text-muted">{activeSystem.problem}</p>
                      </div>
                      <div className="rounded-[24px] border border-line/75 bg-black/15 p-4 sm:p-5">
                        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/70">Why it matters</div>
                        <p className="mt-3 text-sm text-muted">{activeSystem.significance}</p>
                      </div>
                      <div className="rounded-[24px] border border-line/75 bg-black/15 p-4 sm:p-5">
                        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/70">
                          Intelligence / Workflow
                        </div>
                        <p className="mt-3 text-sm text-muted">{activeSystem.intelligence}</p>
                      </div>
                    </div>

                    <div className="grid gap-5">
                      <div className="rounded-[24px] border border-line/75 bg-black/15 p-4 sm:p-5">
                        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/70">
                          Architecture glimpse
                        </div>
                        <div className="mt-4 grid gap-3">
                          {activeSystem.architecture.map((point) => (
                            <div key={point} className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[24px] border border-line/75 bg-black/15 p-4 sm:p-5">
                      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/70">
                        Technical layers built
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {activeSystem.layers.map((layer) => (
                          <span key={layer} className="rounded-full border border-line/70 px-3 py-1.5 text-sm text-muted">
                            {layer}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-line/75 bg-black/15 p-4 sm:p-5">
                      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/70">Stack</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {activeSystem.stack.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-sm text-ink"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-line/75 bg-black/15 p-4 sm:p-5">
                    <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/70">Why this is strong signal</div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      {activeSystem.outcomes.map((outcome) => (
                        <div key={outcome} className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                          {outcome}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Surface>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
