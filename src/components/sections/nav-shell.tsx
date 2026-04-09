import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { brandProfile, type NavItem } from "../../content/portfolio";
import { cn, getEditorialRouteHref } from "../../lib/utils";

type NavShellProps = {
  items: NavItem[];
  activeSection: string;
  theme: "default" | "newsprint";
  onToggleTheme: () => void;
};

export function NavShell({ items, activeSection, theme, onToggleTheme }: NavShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="section-frame pt-3 sm:pt-4">
          <div className="surface flex items-center justify-between rounded-full px-4 py-2.5 sm:px-5 sm:py-3">
            <a href="#hero" className="flex min-w-0 items-center gap-3">
              <img
                src={brandProfile.portraitUrl}
                alt={`${brandProfile.name} portrait`}
                className="h-10 w-10 shrink-0 rounded-xl border border-line/75 object-cover object-center"
              />
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent/80">{brandProfile.brand}</div>
                <div className="mt-1 truncate text-sm font-semibold text-ink sm:text-base">
                  {brandProfile.name} <span className="text-muted">/ Applied Intelligence Engineer</span>
                </div>
              </div>
            </a>

            <div className="hidden items-center gap-3 lg:flex">
              <nav className="flex items-center gap-1">
                {items.map((item) => {
                  const active = item.id === activeSection;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={cn(
                        "rounded-full px-3 py-2 text-sm transition duration-200",
                        active ? "bg-accent/14 text-ink" : "text-muted hover:text-ink"
                      )}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <button
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  theme === "newsprint"
                    ? "border-accent/35 bg-accent/12 text-ink hover:bg-accent/18"
                    : "border-line/80 bg-white/0 text-ink hover:border-accent/30 hover:bg-white/5"
                )}
                onClick={onToggleTheme}
                aria-label="Toggle newspaper theme"
              >
                {theme === "newsprint" ? "Color View" : "Newspaper View"}
              </button>

              <a
                href={getEditorialRouteHref()}
                className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-accent/16"
              >
                Editorial Page
                <ArrowUpRight size={14} />
              </a>
            </div>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line/80 text-muted transition hover:text-ink lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-x-4 top-[4.6rem] z-30 lg:hidden sm:top-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="surface rounded-[28px] p-4">
              <div className="grid gap-2">
                <button
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
                    theme === "newsprint"
                      ? "border-accent/25 bg-accent/10 text-ink"
                      : "border-line/80 text-ink hover:bg-white/5"
                  )}
                  onClick={() => {
                    onToggleTheme();
                    setMobileOpen(false);
                  }}
                >
                  {theme === "newsprint" ? "Color View" : "Newspaper View"}
                </button>
                <a
                  href={getEditorialRouteHref()}
                  className="rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm font-semibold text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  Editorial Page
                </a>
                {items.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm transition",
                      item.id === activeSection ? "bg-accent/14 text-ink" : "text-muted hover:bg-white/5 hover:text-ink"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
