import { ArrowLeft, ArrowUpRight, Newspaper, Sparkles } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  brandProfile,
  capabilitySignals,
  contactDetails,
  featuredSystems,
  githubAccounts,
  philosophyStatements,
  repositorySignals
} from "../../content/portfolio";
import { compactActionLabel, getSectionHref, getSystemRouteHref } from "../../lib/utils";
import { Button } from "../ui/button";

const editorialLead = [
  "Vicky Kumar does not approach AI as a branding layer. He approaches it as software that has to survive contact with real users, real workflows, and real runtime constraints.",
  "Across browser apps, Android products, voice interfaces, and agentic pipelines, the pattern is consistent: intelligence is only valuable when it is shaped into an interface people can trust, a workflow people can follow, and a product people can keep using.",
  "That is why the strongest read of this work is not 'developer interested in AI.' It is software engineer, AI engineer, and product-minded systems builder operating at the point where engineering depth and interface judgment have to work as one."
] as const;

const editorialSections = [
  {
    title: "Software Engineer",
    detail: "Builds interfaces, APIs, orchestration, storage, Android experiences, and product delivery paths end to end."
  },
  {
    title: "AI Engineer",
    detail: "Builds local inference systems, voice products, structured outputs, workflow routing, and grounded conversational surfaces."
  },
  {
    title: "Agentic Systems Builder",
    detail: "Designs systems that route, execute, retry, review, and expose visible workflow state instead of hiding everything in one prompt box."
  }
] as const;

const editorialSkillGroups = [
  {
    title: "Software Desk",
    items: [
      "React, TypeScript, Vite, browser-side product engineering",
      "Android, Kotlin, Jetpack Compose, offline mobile UX",
      "FastAPI, pipeline services, structured delivery layers"
    ]
  },
  {
    title: "AI Systems Desk",
    items: [
      "RunAnywhere runtime integration and local model lifecycle",
      "Voice, chat, multimodal interaction, and on-device activation",
      "Agent workflows, structured outputs, retry logic, and orchestration"
    ]
  },
  {
    title: "Product Desk",
    items: [
      "Interface quality treated as engineering quality",
      "Workflow-first thinking over isolated prompt tricks",
      "Privacy-aware, operator-aware, product-grade system design"
    ]
  }
] as const;

const editorialPullQuotes = [
  "The strongest systems are not prompt wrappers. They are products with state, trust, workflow, and delivery quality designed into them.",
  "Interface quality is not polish after engineering. In AI products, it is part of the engineering."
] as const;

const editionFacts = [
  ["Edition", "Profile Issue 04"],
  ["Filed", "New Delhi / India"],
  ["Lead", "Software + AI Systems"],
  ["Focus", "Applied intelligence in product form"]
] as const;

const marginNotes = [
  "Not a student portfolio read. The strongest signal is product maturity under technical constraint.",
  "The work is most convincing where AI capability, runtime control, and usable interfaces are designed together.",
  "Algsoch leads as the flagship because it combines Android execution, offline AI, and product identity in one system."
] as const;

const editorialBriefs = [
  {
    label: "Lead story",
    detail: "Algsoch anchors the profile because it combines Android product execution with offline AI."
  },
  {
    label: "Systems desk",
    detail: "CommandBrain and SpeakAI show local runtime discipline, browser control, and interface thinking."
  },
  {
    label: "Workflow desk",
    detail: "Algsoch News shows orchestration, structured output, and visible agent traces."
  },
  {
    label: "Read path",
    detail: "Projects, skills, mindset, GitHub split, and direct contact sit in one continuous route."
  }
] as const;

const editorialReadingOrder = [
  { index: "01", title: "Read the flagship", href: "/?system=algsoch" },
  { index: "02", title: "Inspect the projects edition", href: "#projects" },
  { index: "03", title: "Review GitHub identity split", href: "#editorial-github" }
] as const;

export function EditorialProfilePage() {
  const currentDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(new Date()),
    []
  );
  const secondarySignals = useMemo(
    () => repositorySignals.filter((repository) => !featuredSystems.some((system) => system.id === repository.id)).slice(0, 4),
    []
  );
  const primaryContactDetails = useMemo(() => contactDetails.slice(0, 4), []);
  const githubContactDetails = useMemo(() => contactDetails.filter((detail) => detail.label.startsWith("GitHub")), []);

  useEffect(() => {
    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute("content");

    document.title = `Editorial Profile | ${brandProfile.name}`;
    descriptionTag?.setAttribute(
      "content",
      `${brandProfile.name} in editorial form: projects, capabilities, mindset, GitHub signal, and engineering philosophy in one long-form profile page.`
    );

    return () => {
      document.title = previousTitle;
      if (descriptionTag && previousDescription) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.04]" />
      <div className="pointer-events-none fixed left-[-10%] top-10 h-[22rem] w-[22rem] rounded-full bg-accent/10 blur-[150px]" />

      <header className="fixed inset-x-0 top-0 z-40">
        <div className="section-frame pt-3 sm:pt-4">
          <div className="surface flex flex-wrap items-center justify-between gap-3 rounded-[28px] px-4 py-2.5 sm:rounded-full sm:px-5 sm:py-3">
            <a href={getSectionHref("hero")} className="flex min-w-0 items-center gap-3 text-ink">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line/70 bg-white/4">
                <ArrowLeft size={16} />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/80">{brandProfile.brand}</div>
                <div className="mt-1 truncate text-sm font-semibold text-ink">Back to Portfolio</div>
              </div>
            </a>

            <div className="hidden items-center gap-2 lg:flex">
              <div className="rounded-full border border-line/70 bg-white/4 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Editorial profile
              </div>
              <Button href="/docs/vicky_software_engineer.pdf" size="sm">
                Open Resume
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 sm:pt-28">
        <section className="section-space pt-8 sm:pt-12">
          <div className="section-frame">
            <div className="rounded-[34px] border border-line/75 bg-canvas-elevated/75 p-5 sm:p-6 lg:p-8">
              <div className="border-y border-line/70 py-3">
                <div className="grid gap-3 lg:grid-cols-[0.95fr_1.1fr_0.95fr] lg:items-center">
                  <div className="grid gap-1 text-center lg:text-left">
                    <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/80">Algsoch Review</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Editorial profile feature</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-3xl font-semibold tracking-[-0.08em] text-ink sm:text-4xl lg:text-[3.7rem]">
                      Special Profile Edition
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                      Software systems / AI products / agentic workflows / runtime execution
                    </div>
                  </div>
                  <div className="grid gap-1 text-center lg:text-right">
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">{currentDate}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Independent profile report</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 rounded-[22px] border border-line/70 bg-black/15 p-3 sm:grid-cols-2 xl:grid-cols-4">
                {editionFacts.map(([label, value]) => (
                  <div key={label} className="rounded-[16px] border border-line/70 bg-white/4 px-3 py-2.5">
                    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent/75">{label}</div>
                    <div className="mt-1.5 text-sm font-semibold text-ink">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[24px] border border-line/70 bg-black/15 p-4 sm:p-5">
                <div className="flex flex-col gap-3 border-b border-dashed border-line/70 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">In this issue</div>
                    <div className="mt-1 text-sm text-muted">A front-page read of product signal, engineering depth, AI capability, and public identity.</div>
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Feature brief</div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {editorialBriefs.map((brief, index) => (
                    <div key={brief.label} className="grid grid-cols-[auto_1fr] gap-3 border-l-2 border-accent/30 bg-white/[0.03] px-3 py-3">
                      <div className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent/75">0{index + 1}</div>
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink">{brief.label}</div>
                        <div className="mt-1 text-sm leading-6 text-muted">{brief.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:grid-cols-[0.9fr_1.2fr_0.9fr]">
                <div className="grid content-start gap-5 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:grid-cols-1">
                  <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-[26px] border border-line/70 bg-black/20 md:mx-0 md:max-w-none">
                    <div className="aspect-[4/4.8] bg-gradient-to-b from-white/8 to-transparent sm:aspect-[4/5]">
                      <img
                        src={brandProfile.portraitUrl}
                        alt={`${brandProfile.name} portrait`}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <div className="border-t border-line/70 px-4 py-4">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">Filed under</div>
                      <div className="mt-2 text-sm font-semibold text-ink">Software Engineer / AI Engineer</div>
                      <div className="mt-2 text-sm leading-6 text-muted">Agentic systems, product workflows, local intelligence, and applied AI execution.</div>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-line/70 bg-black/15 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3 border-b border-dashed border-line/70 pb-3">
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Profile ledger</div>
                        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Filed contacts / identity directory</div>
                      </div>
                      <div className="rounded-full border border-line/70 bg-white/4 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        Pg 01
                      </div>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-[20px] border border-line/70 bg-white/[0.03]">
                      <div className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] gap-3 border-b border-line/70 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted sm:grid-cols-[minmax(0,0.52fr)_minmax(0,1fr)]">
                        <div>Record</div>
                        <div>Filed detail</div>
                      </div>

                      {[...primaryContactDetails, ...githubContactDetails].map((detail, index) => (
                        <a
                          key={detail.label}
                          href={detail.href}
                          target={detail.href.startsWith("http") ? "_blank" : undefined}
                          rel={detail.href.startsWith("http") ? "noreferrer" : undefined}
                          className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] gap-3 px-3 py-3 transition hover:bg-white/[0.04] sm:grid-cols-[minmax(0,0.52fr)_minmax(0,1fr)]"
                        >
                          <div className="min-w-0">
                            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent/80">{detail.label}</div>
                            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                              File 0{index + 1}
                            </div>
                          </div>
                          <div className="min-w-0 text-sm leading-6 text-ink break-words">{detail.value}</div>
                        </a>
                      ))}
                    </div>

                    <div className="mt-3 rounded-[18px] border border-line/70 bg-white/[0.035] px-3 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      Current public identities: LinkedIn, GitHub / algsoch, GitHub / fiscalmindset
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent/85">
                    <Newspaper size={13} />
                    {brandProfile.brand} = {brandProfile.brandMeaning}
                  </div>

                  <h1 className="mt-5 text-balance font-display text-[2.35rem] font-semibold leading-[0.92] text-ink sm:text-5xl lg:text-[4.25rem] xl:text-[5rem]">
                    Vicky Kumar builds AI systems that read like products, not demos.
                  </h1>

                  <p className="mt-5 max-w-3xl text-base leading-8 text-muted sm:text-xl">
                    A long-form editorial read on projects, capabilities, thinking process, engineering standards, and why the work signals much more than surface-level AI interest.
                  </p>

                  <div className="mt-5 grid gap-3 rounded-[24px] border border-line/70 bg-black/15 p-4 md:grid-cols-3">
                    <div className="rounded-[18px] border border-line/70 bg-white/4 px-3 py-3">
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent/75">Byline</div>
                      <div className="mt-2 text-sm text-ink">Profile desk / Algsoch Review</div>
                    </div>
                    <div className="rounded-[18px] border border-line/70 bg-white/4 px-3 py-3">
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent/75">Read</div>
                      <div className="mt-2 text-sm text-ink">Projects, systems, skill, mindset</div>
                    </div>
                    <div className="rounded-[18px] border border-line/70 bg-white/4 px-3 py-3">
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent/75">Frame</div>
                      <div className="mt-2 text-sm text-ink">AI in product form, not prompt form</div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 border-y border-line/70 py-5 md:grid-cols-3">
                    {editorialSections.map((item) => (
                      <div key={item.title} className="min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/80">{item.title}</div>
                        <div className="mt-2 text-sm leading-7 text-muted">{item.detail}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 editorial-columns">
                    <p className="editorial-column-block text-pretty text-base leading-8 text-ink/95 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.78] first-letter:text-accent">
                      {editorialLead[0]}
                    </p>

                    <div className="editorial-column-block relative overflow-hidden rounded-[26px] border border-accent/20 bg-accent/10 p-5 sm:p-6">
                      <div className="pointer-events-none absolute left-3 top-1 font-display text-[5rem] leading-none text-accent/18 sm:text-[6.5rem]">
                        “
                      </div>
                      <div className="pointer-events-none absolute bottom-[-1.6rem] right-3 font-display text-[5rem] leading-none text-accent/18 sm:text-[6.5rem]">
                        ”
                      </div>
                      <div className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">Pull Quote</div>
                      <blockquote className="relative mt-4 text-balance font-display text-xl font-semibold leading-[1.08] text-ink sm:text-[2rem]">
                        “{editorialPullQuotes[0]}”
                      </blockquote>
                    </div>

                    {editorialLead.slice(1).map((paragraph) => (
                      <p key={paragraph} className="editorial-column-block text-pretty text-base leading-8 text-muted">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 content-start lg:col-span-2 xl:col-span-1">
                  <div className="rounded-[26px] border border-line/70 bg-black/15 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3 border-b border-dashed border-line/70 pb-3">
                      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Margin notes</div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Editor annotations</div>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {marginNotes.map((item, index) => (
                        <div key={item} className="grid grid-cols-[auto_1fr] gap-3 border-l-2 border-accent/30 bg-white/[0.03] px-3 py-3">
                          <div className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent/75">N0{index + 1}</div>
                          <div className="text-sm leading-6 text-muted">{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-line/70 bg-black/15 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3 border-b border-dashed border-line/70 pb-3">
                      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Front-page index</div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Routes</div>
                    </div>
                    <div className="mt-4 grid gap-3">
                      {editorialReadingOrder.map((item) => (
                        <a
                          key={item.index}
                          href={item.href}
                          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-dashed border-line/60 pb-3 last:border-b-0 last:pb-0"
                        >
                          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent/75">{item.index}</div>
                          <div className="text-sm text-ink">{item.title}</div>
                          <ArrowUpRight size={14} className="text-muted" />
                        </a>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <Button href="/docs/vicky_software_engineer.pdf" size="sm" className="w-full justify-between">
                        Resume
                        <ArrowUpRight size={14} />
                      </Button>
                      <Button href={getSystemRouteHref("algsoch")} variant="secondary" size="sm" className="w-full justify-between">
                        Flagship
                        <ArrowUpRight size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section-space pt-4">
          <div className="section-frame">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Continued on Page 02 / Projects Edition
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-line/70 via-accent/35 to-transparent" />
            </div>
            <div className="rounded-[34px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6 lg:p-8">
              <div className="border-b border-line/70 pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">Projects Edition</div>
                    <div className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">Four flagship systems that explain the portfolio best.</div>
                  </div>
                  <div className="self-start rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    Issue stamp / Pg 02
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                {featuredSystems.map((system) => (
                  <article key={system.id} className="rounded-[28px] border border-line/70 bg-black/15 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 border-b border-dashed border-line/70 pb-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent/80">{system.shorthand}</div>
                        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Special report / product file</div>
                        <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">{system.title}</h2>
                      </div>
                      <div className="self-start rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        {system.themes[0]}
                      </div>
                    </div>

                    <div className="mt-4 text-sm leading-7 text-muted">{system.summary}</div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-[20px] border border-line/70 bg-white/4 p-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/75">What it proves</div>
                        <div className="mt-3 text-sm leading-7 text-muted">{system.significance}</div>
                      </div>
                      <div className="rounded-[20px] border border-line/70 bg-white/4 p-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/75">Signals</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {system.signals.map((signal) => (
                            <span key={signal} className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-ink">
                              {signal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[20px] border border-line/70 bg-black/15 px-4 py-3">
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent/75">Editorial read</div>
                      <div className="mt-2 text-sm leading-7 text-muted">{system.outcomes[0]}</div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                      <Button href={getSystemRouteHref(system.id)} size="sm" className="w-full justify-center">
                        Case Study
                      </Button>
                      {system.links.map((link) => (
                        <Button
                          key={`${system.id}-${link.label}`}
                          href={link.href ?? "#"}
                          variant={link.variant === "primary" ? "primary" : "secondary"}
                          size="sm"
                          className="w-full justify-center"
                        >
                          {compactActionLabel(link.label)}
                        </Button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="editorial-github" className="section-space pt-4">
          <div className="section-frame">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Continued on Page 03 / Skills & Mindset
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-line/70 via-accent/35 to-transparent" />
            </div>
            <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="rounded-[34px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6 lg:p-8">
                <div className="border-b border-line/70 pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">Skill Ledger</div>
                      <div className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">What the work suggests about actual capability.</div>
                    </div>
                    <div className="self-start rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      Skill file / Pg 03
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {editorialSkillGroups.map((group) => (
                    <div key={group.title} className="rounded-[24px] border border-line/70 bg-black/15 p-4 sm:p-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/75">{group.title}</div>
                      <div className="mt-4 grid gap-3">
                        {group.items.map((item) => (
                          <div key={item} className="rounded-[16px] border border-line/70 bg-white/4 px-3 py-3 text-sm leading-6 text-muted">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[26px] border border-line/70 bg-black/15 p-4 sm:p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Capability rail</div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {capabilitySignals.map((signal) => (
                      <div key={signal.title} className="rounded-[18px] border border-line/70 bg-white/4 p-4">
                        <div className="text-sm font-semibold text-ink">{signal.title}</div>
                        <div className="mt-2 text-sm leading-6 text-muted">{signal.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-5">
                <div className="rounded-[34px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6 lg:p-8">
                  <div className="border-b border-line/70 pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">Thinking & Mindset</div>
                        <div className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">How the engineering judgment reads.</div>
                      </div>
                      <div className="self-start rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        Opinion desk / Pg 03
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-6 overflow-hidden rounded-[26px] border border-accent/20 bg-accent/10 p-5 sm:p-6">
                    <div className="pointer-events-none absolute left-3 top-1 font-display text-[4.75rem] leading-none text-accent/18 sm:text-[6rem]">
                      “
                    </div>
                    <div className="pointer-events-none absolute bottom-[-1.6rem] right-3 font-display text-[4.75rem] leading-none text-accent/18 sm:text-[6rem]">
                      ”
                    </div>
                    <div className="relative font-mono text-[10px] uppercase tracking-[0.2em] text-accent/80">Pull Quote</div>
                    <blockquote className="relative mt-3 text-balance font-display text-xl font-semibold leading-[1.14] text-ink sm:text-[1.75rem]">
                      “{editorialPullQuotes[1]}”
                    </blockquote>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {philosophyStatements.map((statement, index) => (
                      <div key={statement.title} className="rounded-[24px] border border-line/70 bg-black/15 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                            0{index + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold leading-6 text-ink">{statement.title}</div>
                            <div className="mt-2 text-sm leading-7 text-muted">{statement.detail}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[34px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6 lg:p-8">
                  <div className="border-b border-line/70 pb-3">
                    <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">Working Archive</div>
                    <div className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">Additional serious repository signal.</div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {secondarySignals.map((repository) => (
                      <div key={repository.id} className="rounded-[22px] border border-line/70 bg-black/15 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-ink">{repository.title}</div>
                            <div className="mt-1 text-sm leading-6 text-muted">{repository.overview}</div>
                          </div>
                          <div className="rounded-full border border-line/70 bg-white/4 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                            @{repository.account}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space pt-4">
          <div className="section-frame">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Continued on Page 04 / GitHub & Contact
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-line/70 via-accent/35 to-transparent" />
            </div>
            <div className="rounded-[34px] border border-line/75 bg-canvas-elevated/70 p-5 sm:p-6 lg:p-8">
              <div className="border-b border-line/70 pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/80">GitHub & Contact</div>
                    <div className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">Identity split, contact path, and what to read next.</div>
                  </div>
                  <div className="self-start rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    Closing sheet / Pg 04
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="grid gap-4">
                  {githubAccounts.map((account) => (
                    <div key={account.handle} className="rounded-[24px] border border-line/70 bg-black/15 p-4 sm:p-5">
                      <div className="flex items-start gap-4">
                        <img
                          src={account.avatarUrl}
                          alt={`GitHub avatar for ${account.handle}`}
                          className="h-14 w-14 shrink-0 rounded-2xl border border-line/75 object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/75">{account.role}</div>
                          <div className="mt-2 text-lg font-semibold text-ink">@{account.handle}</div>
                          <div className="mt-2 text-sm leading-7 text-muted">{account.overview}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-line/70 pt-3">
                        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">{account.status === "primary" ? "Current public account" : "Legacy public account"}</div>
                        <a
                          href={account.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink transition hover:border-accent/30 hover:bg-white/[0.06]"
                        >
                          Open profile
                          <ArrowUpRight size={12} />
                        </a>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {account.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-ink">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[24px] border border-line/70 bg-black/15 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3 border-b border-dashed border-line/70 pb-3">
                      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Closing read</div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Editor close</div>
                    </div>
                    <div className="mt-4 text-base leading-8 text-muted">
                      The cleanest way to read this portfolio is simple: the work is strongest where software engineering,
                      AI capability, interface quality, and workflow design have to operate as one system. That is the
                      through-line across Algsoch, CommandBrain, SpeakAI, and Algsoch News.
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button href="/docs/vicky_software_engineer.pdf" size="lg" className="w-full justify-center">
                      Resume
                      <ArrowUpRight size={16} />
                    </Button>
                    <Button href={getSectionHref("contact")} variant="secondary" size="lg" className="w-full justify-center">
                      Main portfolio
                    </Button>
                    <Button href={getSystemRouteHref("algsoch")} variant="secondary" size="lg" className="w-full justify-center">
                      Flagship case study
                    </Button>
                    <Button href="mailto:npdimagine@gmail.com" variant="secondary" size="lg" className="w-full justify-center">
                      Email Vicky
                    </Button>
                  </div>

                  <div className="rounded-[24px] border border-line/70 bg-black/15 p-4 sm:p-5">
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">
                      <Sparkles size={14} />
                      Editorial route
                    </div>
                    <div className="mt-3 text-sm leading-7 text-muted">
                      This page is meant to be the long-form read: one route where projects, skills, mindset, GitHub
                      signal, and positioning sit together in editorial form instead of being scattered across multiple
                      interactive sections.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
