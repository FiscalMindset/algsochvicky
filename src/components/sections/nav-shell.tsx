import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { brandProfile, type NavItem } from "../../content/portfolio";
import { cn, getEditorialRouteHref } from "../../lib/utils";

type NavShellProps = {
  items: NavItem[];
  activeSection: string;
  theme: "default" | "newsprint";
  onToggleTheme: () => void;
};

function NavItemIndicator({ items, activeSection, containerRef }: { items: NavItem[]; activeSection: string; containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const activeIndex = items.findIndex((item) => item.id === activeSection);
    if (activeIndex < 0) { setIndicatorStyle((s) => ({ ...s, opacity: 0 })); return; }
    const el = containerRef.current.children[activeIndex] as HTMLElement | undefined;
    if (!el) { setIndicatorStyle((s) => ({ ...s, opacity: 0 })); return; }
    const { offsetLeft, offsetWidth } = el;
    setIndicatorStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
  }, [activeSection, items, containerRef]);

  return (
    <motion.div
      className="absolute bottom-0.5 top-0.5 rounded-full bg-accent/14"
      animate={indicatorStyle}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function NavShell({ items, activeSection, theme, onToggleTheme }: NavShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="section-frame pt-2 sm:pt-3">
          <div className={cn(
            "surface relative flex items-center justify-between rounded-full px-2 py-1.5 transition-all sm:px-3 sm:py-2",
            scrolled ? "shadow-lg shadow-black/10 ring-1 ring-white/[0.04]" : ""
          )}>
            <a href="#hero" onClick={() => scrollToSection("hero")} className="flex min-w-0 items-center gap-2 sm:gap-2.5 shrink-0 group">
              <div className="relative">
                <img
                  src={brandProfile.portraitUrl}
                  alt={`${brandProfile.name} portrait`}
                  className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-xl border border-line/75 object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--surface)]" />
              </div>
              <div className="min-w-0 hidden xs:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold tracking-tight text-ink sm:text-[11px]">{brandProfile.brand.toLowerCase()}</span>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-medium text-emerald-400 sm:text-[9px]">Open to Work</span>
                </div>
                <div className="truncate text-[10px] text-muted sm:text-xs">
                  Applied Intelligence Engineer
                </div>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-1 ml-auto">
              <nav className="relative flex items-center gap-0.5 overflow-x-auto scrollbar-none mr-1">
                <NavItemIndicator items={items} activeSection={activeSection} containerRef={navRef} />
                <div ref={navRef} className="flex items-center gap-0.5">
                  {items.map((item) => {
                    const active = item.id === activeSection;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                        className={cn(
                          "relative z-10 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-1.5 sm:text-xs font-medium transition duration-200",
                          active ? "text-ink" : "text-muted hover:text-ink"
                        )}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              </nav>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition shrink-0",
                    theme === "newsprint"
                      ? "border-accent/35 bg-accent/12 text-ink hover:bg-accent/18"
                      : "border-line/80 text-muted hover:text-ink hover:border-accent/30 hover:bg-white/[0.03]"
                  )}
                  onClick={onToggleTheme}
                  aria-label="Toggle newspaper theme"
                >
                  {theme === "newsprint" ? "Color" : "Paper"}
                </button>

                <a
                  href={getEditorialRouteHref()}
                  className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/8 px-2.5 py-1.5 text-[11px] font-semibold text-ink transition hover:bg-accent/14 shrink-0"
                >
                  Edit
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </div>

            <button
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-line/80 text-muted transition hover:text-ink hover:bg-white/[0.03] md:hidden shrink-0"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-x-3 top-[3.5rem] z-30 md:hidden sm:inset-x-4 sm:top-[4.2rem]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="surface rounded-2xl p-2.5 sm:rounded-[24px] sm:p-3 border border-white/[0.04] shadow-xl shadow-black/20">
              <div className="grid gap-0.5">
                <div className="flex items-center gap-2 px-3 py-2 mb-1 border-b border-white/[0.06]">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-emerald-400">Open to Work</span>
                  <span className="ml-auto text-[10px] text-muted">{brandProfile.brand.toLowerCase()}</span>
                </div>
                {items.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-xs transition sm:px-4",
                      item.id === activeSection ? "bg-accent/14 text-ink font-semibold" : "text-muted hover:bg-white/[0.03] hover:text-ink"
                    )}
                    onClick={() => { scrollToSection(item.id); setMobileOpen(false); }}
                  >
                    <span className="flex items-center justify-between">
                      {item.label}
                      {item.id === activeSection ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      ) : null}
                    </span>
                  </motion.a>
                ))}
                <div className="mt-1 pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-1.5">
                  <button
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-left text-[11px] font-medium transition sm:py-3",
                      theme === "newsprint"
                        ? "border-accent/20 bg-accent/8 text-ink"
                        : "border-line/80 text-muted hover:text-ink hover:bg-white/[0.03]"
                    )}
                    onClick={() => { onToggleTheme(); setMobileOpen(false); }}
                  >
                    {theme === "newsprint" ? "Color View" : "Paper Mode"}
                  </button>
                  <a
                    href={getEditorialRouteHref()}
                    className="rounded-xl border border-accent/20 bg-accent/8 px-3 py-2.5 text-[11px] font-medium text-ink sm:py-3 flex items-center justify-between"
                    onClick={() => setMobileOpen(false)}
                  >
                    Editorial
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
