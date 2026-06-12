import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Blocks, BriefcaseBusiness, Building2, SearchCode } from "lucide-react";
import { useMemo, useState } from "react";
import { audienceRoutes, type AudienceRoute } from "../../content/portfolio";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

const routeIcons: Record<AudienceRoute["id"], typeof Building2> = {
  founder: Building2,
  recruiter: BriefcaseBusiness,
  client: Blocks,
  "technical-reviewer": SearchCode
};

const routeColors: Record<string, { border: string; bg: string; text: string; ring: string }> = {
  founder: {
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    ring: "border-blue-500/40"
  },
  recruiter: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "border-emerald-500/40"
  },
  client: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    ring: "border-purple-500/40"
  },
  "technical-reviewer": {
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    ring: "border-amber-500/40"
  }
};

function compactTitle(route: AudienceRoute) {
  if (route.id === "founder") return "Founder";
  if (route.id === "recruiter") return "Recruiter";
  if (route.id === "client") return "Client";
  return "Technical";
}

export function AudienceRoutesSection() {
  const [activeId, setActiveId] = useState(audienceRoutes[0]?.id ?? "");
  const activeRoute = audienceRoutes.find((route) => route.id === activeId) ?? audienceRoutes[0];
  const colors = useMemo(() => routeColors[activeId] ?? routeColors.founder, [activeId]);

  if (!activeRoute) {
    return null;
  }

  const ActiveIcon = routeIcons[activeRoute.id];

  return (
    <div className="relative mt-6 overflow-hidden rounded-[28px] border border-line/75 bg-canvas-elevated/70">
      <div className="relative grid gap-4 p-4 sm:p-5">
        <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Audience routes</div>
            <div className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Fast proof paths for founders, hiring teams, clients, and technical reviewers.
            </div>
          </div>

          <div className="rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/80">
            One route, focused proof
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {audienceRoutes.map((route) => {
            const Icon = routeIcons[route.id];
            const active = route.id === activeRoute.id;
            const rc = routeColors[route.id];

            return (
              <button
                key={route.id}
                className={cn(
                  "min-w-0 rounded-[18px] border px-3 py-3 text-left transition",
                  active
                    ? `${rc.border} ${rc.bg}`
                    : "border-line/70 bg-white/4 hover:border-line/60 hover:bg-white/6"
                )}
                onClick={() => setActiveId(route.id)}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
                      active ? `${rc.ring} ${rc.bg} ${rc.text}` : "border-line/70 bg-white/4 text-ink/80"
                    )}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0">
                    <div className={cn("font-mono text-[10px] uppercase tracking-[0.18em]", active ? rc.text : "text-muted")}>
                      {active ? "Active route" : "Proof path"}
                    </div>
                    <div className="mt-1 truncate text-sm font-semibold text-ink">{compactTitle(route)}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoute.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn("grid gap-4 rounded-[22px] border p-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center", colors.border, colors.bg)}
          >
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", colors.ring, colors.bg, colors.text)}>
                  <ActiveIcon size={18} />
                </div>

                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent/75">{activeRoute.title}</div>
                  <div className="mt-1 text-base font-semibold leading-tight text-ink sm:text-[1.02rem]">
                    {activeRoute.question}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm leading-6 text-muted">{activeRoute.summary}</div>

              <div className={cn("mt-3 inline-flex max-w-full items-center rounded-full border px-3 py-1.5 text-xs font-medium", colors.border, colors.bg, "text-ink/90")}>
                {activeRoute.proof}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <Button href={activeRoute.href} className="w-full justify-center text-center">
                {activeRoute.cta}
                <ArrowUpRight size={14} />
              </Button>

              <div className={cn("rounded-[18px] border px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em]", colors.border, colors.bg, colors.text)}>
                Route: {compactTitle(activeRoute)}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
