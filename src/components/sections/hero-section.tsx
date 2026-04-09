import { ArrowDownRight, Bot, Cpu, Workflow } from "lucide-react";
import { brandProfile } from "../../content/portfolio";
import { Button } from "../ui/button";
import { HeroFeaturedSystems, HeroSignalMap } from "../visuals/hero-signal-map";

export function HeroSection() {
  const capabilityCards = [
    {
      icon: <Workflow size={18} />,
      title: "Agentic Systems Builder",
      detail: "Workflows designed for route, action, and review."
    },
    {
      icon: <Bot size={18} />,
      title: "AI-Native Product Engineer",
      detail: "Usable interfaces around intelligence, not isolated demos."
    },
    {
      icon: <Cpu size={18} />,
      title: "Runtime-Aware Engineer",
      detail: "On-device AI, local caching, and model lifecycle control."
    }
  ];

  return (
    <section id="hero" className="section-space pt-20 sm:pt-24 lg:pt-28">
      <div className="section-frame">
        <div className="grid gap-6 xl:gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-start">
          <div>
            <div className="mb-5 inline-flex items-center rounded-full border border-accent/25 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.28em] text-accent/85">
              {brandProfile.brand} = {brandProfile.brandMeaning}
            </div>

            <h1 className="max-w-4xl text-balance font-display text-4xl font-semibold leading-[0.94] text-ink sm:text-5xl lg:text-[5.15rem]">
              Vicky Kumar builds intelligent products that feel engineered, not improvised.
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-base text-muted sm:text-lg lg:text-xl">{brandProfile.statement}</p>
            <p className="mt-4 max-w-2xl text-pretty text-sm text-muted/90 sm:text-base lg:text-lg">{brandProfile.supporting}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="#systems" size="lg">
                Inspect Selected Systems
                <ArrowDownRight size={16} />
              </Button>
              <Button href="#runtime" variant="secondary" size="lg">
                Activate Local AI Layer
              </Button>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
              <div className="surface-soft overflow-hidden rounded-[28px]">
                <div className="grid min-w-0 grid-cols-[92px_minmax(0,1fr)] sm:grid-cols-[116px_minmax(0,1fr)] xl:grid-cols-1">
                  <div className="min-h-[112px] overflow-hidden sm:min-h-[136px] xl:min-h-0 xl:aspect-[4/5]">
                    <img
                      src={brandProfile.portraitUrl}
                      alt={`${brandProfile.name} portrait`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="border-l border-line/70 p-4 xl:border-l-0 xl:border-t">
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent/75">Vicky Kumar</div>
                    <div className="mt-2 text-sm font-semibold text-ink">Software Engineer · AI Engineer</div>
                    <div className="mt-2 text-sm text-muted">
                      Agentic systems, runtime-aware AI products, and usable interfaces.
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface-soft rounded-[28px] p-4 sm:p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Capability rail</div>
                <div className="mt-4 grid gap-3">
                  {capabilityCards.map((item, index) => (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-line/70 bg-white/4 p-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,180px)_minmax(0,1fr)] sm:items-start">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">0{index + 1}</div>
                          <div className="mt-2 text-sm font-semibold leading-5 text-ink">{item.title}</div>
                        </div>
                        <div className="min-w-0 text-sm leading-6 text-muted">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <HeroSignalMap />
        </div>

        <div className="mt-6">
          <HeroFeaturedSystems />
        </div>
      </div>
    </section>
  );
}
