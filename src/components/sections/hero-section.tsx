import { Bot, Cpu, Layers, Terminal } from "lucide-react";
import { brandProfile } from "../../content/portfolio";
import { FiscalMindsetBadge } from "../ui/fiscalmindset-badge";
import { HeroFeaturedSystems } from "../visuals/hero-signal-map";
import { ProjectStatsChart } from "../visuals/project-stats-chart";

const capabilityCards = [
  {
    icon: <Cpu size={14} />,
    title: "On-Device AI Engineer",
    subtitle: "Edge inference, local LLMs, embedded agents",
    skills: ["On-Device AI", "RunAnywhere SDK", "SmolLM2", "SmolVLM", "Whisper", "Kotlin", "Jetpack Compose"],
    projects: [
      { name: "algsoch (Android)", url: "https://github.com/FiscalMindset/algsoch" },
      { name: "speakai", url: "https://github.com/algsoch/speakai" },
      { name: "smart_terminal", url: "https://github.com/algsoch/smart_terminal" },
    ],
    border: "border-blue-500/25",
    bg: "bg-blue-500/8",
    iconBg: "border-blue-500/40 bg-blue-500/15 text-blue-400",
    tag: "border-blue-500/25 bg-blue-500/10 text-blue-400/90"
  },
  {
    icon: <Bot size={14} />,
    title: "Agentic AI Engineer",
    subtitle: "LangGraph agents, Coral MCP, deep learning models",
    skills: ["LangGraph", "LangChain", "PyTorch", "Coral MCP", "FastAPI", "Python", "Circuit Discovery"],
    projects: [
      { name: "algsochnews", url: "https://github.com/FiscalMindset/algsochnews" },
      { name: "venture_analyst", url: "https://github.com/algsoch/venture_analyst" },
      { name: "job_agentic", url: "https://github.com/algsoch/job_agentic" },
      { name: "indianlabour", url: "https://github.com/algsoch/indianlabour" },
      { name: "careops", url: "https://github.com/FiscalMindset/careops" },
      { name: "brain_tumor", url: "https://github.com/algsoch/brain_tumor" },
      { name: "Synapse-Graph", url: "https://github.com/FiscalMindset/Synapse-Graph" },
      { name: "freelancer.com AI Bid", url: "https://github.com/algsoch/freelancer.com" },
    ],
    border: "border-purple-500/25",
    bg: "bg-purple-500/8",
    iconBg: "border-purple-500/40 bg-purple-500/15 text-purple-400",
    tag: "border-purple-500/25 bg-purple-500/10 text-purple-400/90"
  },
  {
    icon: <Layers size={14} />,
    title: "Full-Stack AI Builder",
    subtitle: "Web apps, APIs, real-time, databases",
    skills: ["Python", "TypeScript", "React", "Node.js", "FastAPI", "PostgreSQL", "WebSockets", "REST APIs"],
    projects: [
      { name: "PathPilot-India", url: "https://github.com/FiscalMindset/PathPilot-India" },
      { name: "Cognivise", url: "https://github.com/algsoch/Cognivise" },
      { name: "clutchzone", url: "https://github.com/algsoch/clutchzone" },
      { name: "dynamic-prompt-studio", url: "https://github.com/algsoch/dynamic-prompt-studio" },
      { name: "html-checker", url: "https://github.com/algsoch/html-checker" },
      { name: "english_bot", url: "https://github.com/algsoch/english_bot" },
    ],
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/8",
    iconBg: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
    tag: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400/90"
  },
  {
    icon: <Terminal size={14} />,
    title: "Infrastructure & Automation",
    subtitle: "CI/CD, workflow orchestration, testing automation",
    skills: ["Kestra", "GitHub Actions", "Docker", "Render", "Playwright", "FFmpeg"],
    projects: [
      { name: "devalert", url: "https://github.com/FiscalMindset/devalert" },
      { name: "autopr", url: "https://github.com/FiscalMindset/autopr" },
      { name: "Sentinel Grid", url: "https://github.com/FiscalMindset/women" },
      { name: "Kairon", url: "https://github.com/FiscalMindset/Kairon" },
    ],
    border: "border-orange-500/25",
    bg: "bg-orange-500/8",
    iconBg: "border-orange-500/40 bg-orange-500/15 text-orange-400",
    tag: "border-orange-500/25 bg-orange-500/10 text-orange-400/90"
  }
];

export function HeroSection() {
  return (
    <section id="hero" className="pt-[4.5rem] sm:pt-20 lg:pt-24">
      <div className="section-frame pb-6 sm:pb-8 lg:pb-12">
        <div className="relative max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-accent/35 bg-canvas-elevated p-4 sm:rounded-2xl sm:border-2 sm:border-accent/40 lg:p-6">
          <div className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl panel-grid opacity-15" />

          <div className="relative space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-3 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-accent/40 bg-canvas px-3 py-1.5">
                  <span className="rounded-full border border-accent/40 bg-accent/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.28em] text-accent font-semibold">
                    {brandProfile.name}
                  </span>
                </div>

                <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2.4rem] font-bold text-ink" style={{lineHeight: '1.3'}}>
                  Applied Intelligence Engineer
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border-2 border-emerald-500/40 bg-emerald-500/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-400 font-semibold">
                    Open to Work
                  </span>
                  <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-blue-400">
                    On-Device AI
                  </span>
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-purple-400">
                    Agentic Workflows
                  </span>
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-cyan-400">
                    Edge Inference
                  </span>
                  <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-orange-400">
                    LangGraph
                  </span>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-400">
                    Full-Stack
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-xl border-2 border-accent/25 bg-black/15 px-4 py-3">
                <img
                  src={brandProfile.portraitUrl}
                  alt={brandProfile.name}
                  className="h-12 w-12 rounded-lg border-2 border-accent/30 object-cover object-top"
                />
                <div>
                  <div className="text-sm font-semibold text-ink">{brandProfile.name}</div>
                  <div className="text-[10px] text-muted/80 font-mono">Applied Intelligence Engineer</div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-4">
                <div className="rounded-xl border-2 border-accent/25 bg-black/10 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70 mb-3">Core Capabilities</div>
                  <div className="grid gap-3">
                    {capabilityCards.map((item) => (
                      <div key={item.title} className={`group rounded-lg border ${item.border} ${item.bg} p-3 transition hover:bg-white/6`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${item.iconBg}`}>
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-ink">{item.title}</div>
                            <div className="text-[9px] text-muted/70 font-mono">{item.subtitle}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.skills.map((skill) => (
                            <span key={skill} className={`rounded-full border ${item.tag} px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.05em]`}>
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="mt-2 flex items-start gap-1.5 border-t border-white/6 pt-2">
                          <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-muted/50 shrink-0 mt-[1px]">Projects</span>
                          <div className="flex flex-wrap gap-x-1.5">
                            {item.projects.map((p) => (
                              <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="font-mono text-[8px] text-muted/70 hover:text-accent transition-colors">{p.name}</a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pb-2">
                  <ProjectStatsChart />
                </div>
              </div>

              <div className="space-y-3">
                <HeroFeaturedSystems embedded />
              </div>
            </div>
          </div>
        <FiscalMindsetBadge />
        </div>
      </div>
    </section>
  );
}
