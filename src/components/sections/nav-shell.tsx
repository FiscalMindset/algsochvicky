import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { brandProfile, type NavItem } from "../../content/portfolio";
import { cn } from "../../lib/utils";

type NavShellProps = {
  items: NavItem[];
  activeSection: string;
};

export function NavShell({ items, activeSection }: NavShellProps) {
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

            <nav className="hidden items-center gap-1 lg:flex">
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
