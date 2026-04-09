import { ArrowUpRight } from "lucide-react";
import {
  brandProfile,
  contactActions,
  contactDetails,
  contactScenarios,
  contactTags,
  conversionPaths
} from "../../content/portfolio";
import { Button } from "../ui/button";

export function ContactSection() {
  return (
    <section id="contact" className="section-space pt-6">
      <div className="section-frame">
        <div className="relative overflow-hidden rounded-[36px] border border-line/75 bg-canvas-elevated/80 p-8 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/12 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 panel-grid opacity-20" />
          <div className="relative">
            <div className="max-w-4xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/75">Contact / CTA</div>
              <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-[0.96] text-ink sm:text-4xl lg:text-[4rem]">
                Let’s build intelligent products with software quality at the core.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                If you need AI-native product engineering, agentic workflows, voice or chat systems, or runtime-aware
                local intelligence, {brandProfile.name}'s work is built to show how that execution looks in practice.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {contactTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap">
                {contactActions.map((action, index) => (
                  <Button
                    key={action.label}
                    href={action.href}
                    variant={index === 0 ? "primary" : "secondary"}
                    size="lg"
                    className="w-full xl:w-auto"
                  >
                    {action.label}
                    <ArrowUpRight size={16} />
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
              <div className="grid gap-4">
                <div className="rounded-[24px] border border-line/70 bg-black/15 p-5 sm:p-6">
                  <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Best fit</div>
                  <p className="mt-4 text-sm leading-7 text-muted">
                    This is the right fit when the job is not “add AI somehow,” but define the product surface, build
                    the workflow, control the runtime, and ship something people can actually trust and use.
                  </p>
                </div>

                <div className="grid gap-3 xl:grid-cols-2">
                  {conversionPaths.map((path) => (
                    <a
                      key={path.id}
                      href={path.href}
                      className="group rounded-[24px] border border-line/70 bg-black/15 p-5 transition hover:border-accent/30 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75">{path.title}</div>
                        <ArrowUpRight size={14} className="mt-0.5 text-accent/70 transition group-hover:text-accent" />
                      </div>
                      <div className="mt-3 text-sm font-semibold leading-6 text-ink">{path.lead}</div>
                      <div className="mt-3 text-sm leading-7 text-muted">{path.detail}</div>
                      <div className="mt-4 rounded-2xl border border-accent/20 bg-accent/10 px-3 py-2 text-xs text-ink">
                        {path.proof}
                      </div>
                      <div className="mt-4 text-sm text-accent">{path.cta}</div>
                    </a>
                  ))}
                </div>

                <div className="grid gap-3 xl:grid-cols-3">
                  {contactScenarios.map((scenario) => (
                    <div key={scenario.title} className="rounded-[24px] border border-line/70 bg-black/15 p-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/75">{scenario.title}</div>
                      <div className="mt-3 text-sm leading-7 text-muted">{scenario.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-line/70 bg-black/15 p-5 sm:p-6">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Direct contact</div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {contactDetails.map((detail) => (
                    <a
                      key={detail.label}
                      className="group rounded-2xl border border-line/70 bg-white/4 p-4 transition hover:border-accent/30 hover:bg-white/[0.06]"
                      href={detail.href}
                      target={detail.href.startsWith("http") ? "_blank" : undefined}
                      rel={detail.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{detail.label}</div>
                        <ArrowUpRight size={14} className="mt-0.5 text-accent/70 transition group-hover:text-accent" />
                      </div>
                      <div className="mt-3 break-all text-sm text-ink">{detail.value}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
