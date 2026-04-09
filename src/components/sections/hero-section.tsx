import { ArrowDownRight, Bot, Cpu, Workflow } from "lucide-react";
import { brandProfile } from "../../content/portfolio";
import { getEditorialRouteHref } from "../../lib/utils";
import { CapabilityStripSection } from "./capability-strip-section";
import { AudienceRoutesSection } from "./audience-routes-section";
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

            <h1 className="max-w-4xl text-balance font-display text-3xl font-semibold leading-[0.96] text-ink sm:text-4xl md:text-5xl lg:text-[4.7rem]">
              Vicky Kumar builds intelligent products that feel engineered, not improvised.
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-base text-muted sm:text-lg lg:text-xl">{brandProfile.statement}</p>
            <p className="mt-4 max-w-2xl text-pretty text-sm text-muted/90 sm:text-base lg:text-lg">{brandProfile.supporting}</p>

            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <Button href="#systems" size="lg" className="w-full sm:w-auto">
                Inspect Selected Systems
                <ArrowDownRight size={16} />
              </Button>
              <Button href="#runtime" variant="secondary" size="lg" className="w-full sm:w-auto">
                Activate Local AI Layer
              </Button>
            </div>

            <a
              href={getEditorialRouteHref()}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:text-ink"
            >
              Read the editorial profile
              <ArrowDownRight size={14} />
            </a>

            <AudienceRoutesSection />

            <div className="surface-soft mt-6 overflow-hidden rounded-[30px]">
              <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
                <div className="rounded-[22px] border border-line/70 bg-black/15 p-4">
                  <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)]">
                    <div className="self-start overflow-hidden rounded-[20px] border border-line/70 bg-white/4">
                      <div className="aspect-square min-h-[96px] bg-gradient-to-b from-white/8 to-transparent">
                        <img
                          src={brandProfile.portraitUrl}
                          alt={`${brandProfile.name} portrait`}
                          className="h-full w-full scale-[1.08] object-cover object-top"
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent/75">Identity Surface</div>
                      <div className="mt-2 text-base font-semibold text-ink sm:text-lg">{brandProfile.name}</div>
                      <div className="mt-1.5 text-sm font-medium leading-6 text-ink/90">
                        Software Engineer · AI Engineer
                      </div>
                      <div className="mt-2.5 text-sm leading-6 text-muted">
                        Agentic systems, runtime-aware AI products, and usable interfaces.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Software Systems", "Agentic Workflows", "On-Device AI"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[18px] border border-line/70 bg-white/4">
                    {capabilityCards.map((item, index) => (
                      <div
                        key={item.title}
                        className={`flex items-start gap-3 px-3.5 py-3.5 sm:px-4 ${
                          index < capabilityCards.length - 1 ? "border-b border-line/70" : ""
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold leading-5 text-ink">{item.title}</div>
                          <div className="mt-1.5 text-sm leading-6 text-muted">{item.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <HeroFeaturedSystems embedded />
              </div>
            </div>
          </div>

          <div className="grid gap-6 content-start">
            <HeroSignalMap />
            <CapabilityStripSection embedded />
          </div>
        </div>
      </div>
    </section>
  );
}
