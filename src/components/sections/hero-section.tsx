import { ArrowDownRight, Bot, ChevronDown, ChevronUp, Cpu, Workflow } from "lucide-react";
import { useState } from "react";
import { brandProfile } from "../../content/portfolio";
import { getEditorialRouteHref } from "../../lib/utils";
import { CapabilityStripSection } from "./capability-strip-section";
import { AudienceRoutesSection } from "./audience-routes-section";
import { Button } from "../ui/button";
import { HeroFeaturedSystems, HeroSignalMap } from "../visuals/hero-signal-map";

const capabilityCards = [
  {
    icon: <Bot size={14} />,
    title: "AI-Native Product Engineer",
    skills: ["On-Device AI", "LangGraph", "LangChain", "PyTorch", "RunAnywhere SDK"]
  },
  {
    icon: <Workflow size={14} />,
    title: "Full-Stack Developer",
    skills: ["Python", "Kotlin", "TypeScript", "React", "FastAPI", "PostgreSQL"]
  },
  {
    icon: <Cpu size={14} />,
    title: "Agentic Systems Builder",
    skills: ["Multi-Agent", "Kestra", "Coral MCP", "Docker", "Vercel"]
  }
];

export function HeroSection() {
  const [signalMapExpanded, setSignalMapExpanded] = useState(false);
  const [capabilityExpanded, setCapabilityExpanded] = useState(false);

  return (
    <section id="hero" className="pt-[4.5rem] sm:pt-20 lg:pt-24">
      <div className="section-frame pb-4">
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border-2 border-accent/40 bg-canvas-elevated lg:p-6 p-4">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-accent/40 bg-canvas px-3 py-1.5">
                  <span className="rounded-full border border-accent/40 bg-accent/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">
                    {brandProfile.brand}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/50">=</span>
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.24em] text-accent/90">
                    {brandProfile.brandMeaning}
                  </span>
                </div>

                <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2.4rem] font-bold text-ink" style={{lineHeight: '1.3'}}>
                  I build AI products that actually ship.
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border-2 border-accent/40 bg-accent/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-accent font-semibold">
                    107K+ app downloads
                  </span>
                  <span className="rounded-full border border-line/60 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    Products, not demos
                  </span>
                  <span className="rounded-full border border-line/60 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    On-Device AI
                  </span>
                  <span className="rounded-full border border-line/60 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    Full-Stack
                  </span>
                  <div className="flex gap-1.5 ml-2">
                    <a href="https://github.com/FiscalMindset" target="_blank" rel="noopener" className="rounded-full border border-line/60 bg-white/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted hover:text-accent hover:border-accent/40 transition">
                      @FiscalMindset
                    </a>
                    <a href="https://github.com/algsoch" target="_blank" rel="noopener" className="rounded-full border border-line/60 bg-white/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted hover:text-accent hover:border-accent/40 transition">
                      @algsoch
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button href="#systems" size="sm">
                  View Work
                  <ArrowDownRight size={14} />
                </Button>
                <Button href={getEditorialRouteHref()} variant="secondary" size="sm">
                  Editorial Profile
                </Button>
                <Button href="#contact" variant="ghost" size="sm">
                  Contact
                </Button>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-accent/30 bg-black/10 p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group rounded-lg border-2 border-accent/30 overflow-hidden shrink-0 cursor-pointer">
                      <img
                        src={brandProfile.portraitUrl}
                        alt={brandProfile.name}
                        className="h-20 w-20 object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center gap-1 sm:hidden md:flex">
                        <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-accent/80">Identity Surface</div>
                        <div className="text-xs font-semibold text-ink">{brandProfile.name}</div>
                        <div className="text-[9px] text-muted">Software Engineer · AI Engineer</div>
                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                          {["Software Systems", "Agentic Workflows", "On-Device AI"].map((tag) => (
                            <span key={tag} className="rounded-full border border-accent/40 bg-accent/20 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.05em] text-accent">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent/70">Identity Surface</div>
                        <div className="text-base font-semibold text-ink">{brandProfile.name}</div>
                        <div className="text-xs text-muted">Software Engineer · AI Engineer</div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {["Software Systems", "Agentic Workflows", "On-Device AI"].map((tag) => (
                          <span key={tag} className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-accent">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-accent/25 bg-black/10 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70 mb-3">Core Capabilities</div>
                  <div className="grid gap-3">
                    {capabilityCards.map((item) => (
                      <div key={item.title} className="rounded-lg border border-accent/20 bg-black/5 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-accent/40 bg-accent/15 text-accent">
                            {item.icon}
                          </div>
                          <div className="text-xs font-semibold text-ink">{item.title}</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.skills.map((skill) => (
                            <span key={skill} className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.05em] text-accent/90">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <AudienceRoutesSection />
              </div>

              <div className="space-y-3">
                <HeroFeaturedSystems embedded />

                <div className="flex gap-3">
                  <button
                    onClick={() => setCapabilityExpanded(!capabilityExpanded)}
                    className="flex-1 flex items-center justify-between rounded-xl border-2 border-accent/30 bg-black/10 p-3 text-left hover:border-accent/50 transition"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">
                      Signal Bar
                    </span>
                    {capabilityExpanded ? <ChevronUp size={14} className="text-accent shrink-0" /> : <ChevronDown size={14} className="text-accent shrink-0" />}
                  </button>

                  <button
                    onClick={() => setSignalMapExpanded(!signalMapExpanded)}
                    className="flex-1 flex items-center justify-between rounded-xl border-2 border-accent/30 bg-black/10 p-3 text-left hover:border-accent/50 transition"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">
                      Repository Intel
                    </span>
                    {signalMapExpanded ? <ChevronUp size={14} className="text-accent shrink-0" /> : <ChevronDown size={14} className="text-accent shrink-0" />}
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {capabilityExpanded && (
                    <div className="rounded-xl border-2 border-accent/20 bg-canvas-elevated p-4">
                      <CapabilityStripSection embedded />
                    </div>
                  )}

                  {signalMapExpanded && (
                    <div className="rounded-xl border-2 border-accent/20 bg-canvas-elevated p-4">
                      <HeroSignalMap />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}