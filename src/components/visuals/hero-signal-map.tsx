import { motion } from "framer-motion";
import { useState } from "react";
import { featuredSystems } from "../../content/portfolio";
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
  step: system.id === "commandbrain" ? "01" : system.id === "speakai" ? "02" : system.id === "algsoch" ? "03" : "04",
  title: system.title,
  detail: system.shorthand,
  proof: system.outcomes[0],
  tags: system.signals.slice(0, 3),
  links: system.links.slice(0, 3)
}));

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
              return (
                <button
                  key={signal.id}
                  className={cn(
                    "min-w-0 rounded-[18px] border px-3 py-3 text-left transition",
                    active ? "border-accent/35 bg-accent/10" : "border-line/70 bg-white/4 hover:border-accent/20"
                  )}
                  onClick={() => setActiveId(signal.id)}
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent/75">{signal.step}</div>
                  <div className="mt-1 text-sm font-semibold leading-tight text-ink">{signal.title}</div>
                  <div className="mt-1 text-[12px] leading-5 text-muted">{signal.detail}</div>
                  <div className="mt-2 flex min-w-0 flex-wrap gap-1">
                    {signal.tags.slice(0, 2).map((tag) => (
                      <span
                        key={`${signal.id}-${tag}`}
                        className="rounded-full border border-line/70 bg-white/4 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.08em] text-ink/85"
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
                  {activeSignal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-ink/90"
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

              {videoLink ? (
                <YouTubePreview
                  url={videoLink}
                  title={activeSignal.title}
                  note="Preview card. Open the full demo on YouTube."
                  className="w-full"
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 xl:grid-cols-2 2xl:grid-cols-4">
          {productSignals.map((signal) => (
            <div key={signal.id} className="surface-soft min-w-0 rounded-[20px] border border-line/70 bg-white/4 p-3.5">
              <div className="grid gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/75">{signal.step}</div>
                  <div className="mt-1 text-base font-semibold leading-tight text-ink">{signal.title}</div>
                  <div className="mt-2 text-[13px] leading-5 text-muted">{signal.detail}</div>

                  <div className="mt-3 flex min-w-0 flex-wrap gap-1.5">
                    {signal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink/90"
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
          ))}
        </div>
      )}
    </div>
  );
}
