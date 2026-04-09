import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useMemo } from "react";
import { brandProfile, featuredSystems, type FeaturedSystem } from "../../content/portfolio";
import { compactActionLabel, getSectionHref, getSystemRouteHref } from "../../lib/utils";
import { Button } from "../ui/button";
import { Surface } from "../ui/surface";
import { YouTubePreview } from "../ui/youtube-preview";

type SystemCaseStudyPageProps = {
  system: FeaturedSystem;
};

function getSystemVideoUrl(system: FeaturedSystem) {
  const videoLink = system.links.find((link) => link.label === "YouTube Demo" && link.href)?.href;
  return videoLink ?? null;
}

export function SystemCaseStudyPage({ system }: SystemCaseStudyPageProps) {
  const videoUrl = useMemo(() => getSystemVideoUrl(system), [system]);
  const relatedSystems = useMemo(
    () => featuredSystems.filter((item) => item.id !== system.id).slice(0, 3),
    [system.id]
  );

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute("content");

    document.title = `${system.title} Case Study | ${brandProfile.name}`;
    descriptionTag?.setAttribute("content", system.summary);

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, [system]);

  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.06]" />
      <div className="pointer-events-none fixed left-[-12%] top-16 h-[24rem] w-[24rem] rounded-full bg-accent/10 blur-[160px]" />

      <header className="fixed inset-x-0 top-0 z-40">
        <div className="section-frame pt-3 sm:pt-4">
          <div className="surface flex flex-wrap items-center justify-between gap-3 rounded-[28px] px-4 py-2.5 sm:rounded-full sm:px-5 sm:py-3">
            <a href={getSectionHref("systems")} className="flex min-w-0 items-center gap-3 text-ink">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line/70 bg-white/4">
                <ArrowLeft size={16} />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/80">{brandProfile.brand}</div>
                <div className="mt-1 truncate text-sm font-semibold text-ink">Back to Portfolio</div>
              </div>
            </a>

            <nav className="hidden items-center gap-1 lg:flex">
              {[
                ["overview", "Overview"],
                ["architecture", "Architecture"],
                ["proof", "Proof"],
                ["next", "Next"]
              ].map(([id, label]) => (
                <a key={id} href={`#${id}`} className="rounded-full px-3 py-2 text-sm text-muted transition hover:text-ink">
                  {label}
                </a>
              ))}
            </nav>

            <Button href={getSectionHref("contact")} size="sm" className="hidden sm:inline-flex">
              Start a conversation
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 sm:pt-28">
        <section id="overview" className="section-space pt-8 sm:pt-12">
          <div className="section-frame">
            <div className="mb-6 inline-flex max-w-full items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-accent/85">
              Case Study / {system.title}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
              <div>
                <h1 className="max-w-4xl text-balance font-display text-3xl font-semibold leading-[0.96] text-ink sm:text-4xl lg:text-[4.1rem]">
                  {system.shorthand}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{system.summary}</p>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  {system.signals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink"
                    >
                      {signal}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:max-w-2xl">
                  {system.links.map((link) => (
                    <Button
                      key={`${system.id}-${link.label}`}
                      href={link.href ?? "#"}
                      variant={link.variant === "primary" ? "primary" : "secondary"}
                      size="sm"
                      className="w-full min-w-0 px-3"
                    >
                      <span className="truncate">{compactActionLabel(link.label)}</span>
                    </Button>
                  ))}
                  <Button href={getSectionHref("agent")} variant="secondary" size="sm" className="w-full min-w-0 px-3">
                    Ask About This System
                  </Button>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 xl:max-w-3xl">
                  {system.deliverables.map((item) => (
                    <div key={item} className="rounded-[22px] border border-line/70 bg-white/4 px-4 py-3 text-sm text-muted">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <Surface className="relative overflow-hidden p-4 sm:p-5">
                <div className={`absolute inset-0 bg-gradient-to-br ${system.accent}`} />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/80">Proof Surface</div>
                      <div className="mt-2 text-sm text-muted">See the product, then inspect the architecture decisions under it.</div>
                    </div>
                    <div className="rounded-full border border-line/70 bg-white/4 px-3 py-1 text-xs text-muted">Flagship system</div>
                  </div>

                  {videoUrl ? (
                    <YouTubePreview
                      url={videoUrl}
                      title={system.title}
                      aspectClassName="mx-auto aspect-[4/5] w-full max-w-[26rem] sm:max-w-none sm:aspect-video"
                      note="Open the complete product demo on YouTube."
                    />
                  ) : (
                    <div className="rounded-[24px] border border-line/70 bg-black/20 p-5">
                      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">System Read</div>
                      <div className="mt-3 text-base font-semibold text-ink">{system.thesis}</div>
                      <div className="mt-4 grid gap-3">
                        {system.outcomes.map((outcome) => (
                          <div key={outcome} className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                            {outcome}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Surface>
            </div>
          </div>
        </section>

        <section id="architecture" className="section-space pt-6">
          <div className="section-frame">
            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-5">
                <div className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">What it solves</div>
                  <p className="mt-4 text-sm leading-7 text-muted">{system.problem}</p>
                </div>
                <div className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Why it matters</div>
                  <p className="mt-4 text-sm leading-7 text-muted">{system.significance}</p>
                </div>
                <div className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Intelligence / Workflow</div>
                  <p className="mt-4 text-sm leading-7 text-muted">{system.intelligence}</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Architecture glimpse</div>
                <div className="mt-4 grid gap-3">
                  {system.architecture.map((point, index) => (
                    <div key={point} className="rounded-[22px] border border-line/70 bg-white/4 p-4">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75">Step 0{index + 1}</div>
                      <div className="mt-2 text-sm leading-6 text-muted">{point}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Technical layers built</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {system.layers.map((layer) => (
                        <span key={layer} className="rounded-full border border-line/70 bg-white/4 px-3 py-1.5 text-sm text-muted">
                          {layer}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Stack</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {system.stack.map((item) => (
                        <span key={item} className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-sm text-ink">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="proof" className="section-space pt-6">
          <div className="section-frame">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent/75">Decision proof</div>
                <div className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  This is the part that should help a founder, recruiter, client, or interviewer decide why this system matters.
                </div>
              </div>
              <div className="self-start rounded-full border border-line/70 bg-white/4 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Why it lands
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {system.audienceFit.map((item) => (
                <div key={item.title} className="rounded-[26px] border border-line/75 bg-canvas-elevated/70 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
                      <Sparkles size={16} />
                    </div>
                    <div className="font-semibold text-ink">{item.title}</div>
                  </div>
                  <div className="mt-4 text-sm leading-7 text-muted">{item.detail}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">What this proves overall</div>
              <div className="mt-4 grid gap-3 xl:grid-cols-3">
                {system.outcomes.map((outcome) => (
                  <div key={outcome} className="rounded-[22px] border border-line/70 bg-white/4 p-4 text-sm leading-6 text-muted">
                    {outcome}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="next" className="section-space pt-6">
          <div className="section-frame">
            <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/80 p-6 sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Next read</div>
                  <div className="mt-3 max-w-2xl text-2xl font-semibold text-ink sm:text-3xl">
                    Use this page as a deep proof surface, then continue through the rest of the portfolio.
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button href={getSectionHref("agent")} size="sm" className="w-full min-w-0">
                    Ask The Portfolio Agent
                  </Button>
                  <Button href={getSectionHref("contact")} variant="secondary" size="sm" className="w-full min-w-0">
                    Start a conversation
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {relatedSystems.map((item) => (
                  <a
                    key={item.id}
                    href={getSystemRouteHref(item.id)}
                    className="rounded-[24px] border border-line/70 bg-white/4 p-5 transition hover:border-accent/30 hover:bg-white/[0.06]"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75">Related case study</div>
                    <div className="mt-3 text-lg font-semibold text-ink">{item.title}</div>
                    <div className="mt-2 text-sm leading-6 text-muted">{item.shorthand}</div>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm text-accent">
                      Open case study
                      <ArrowUpRight size={14} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
