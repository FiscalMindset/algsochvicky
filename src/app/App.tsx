import { useEffect, useState } from "react";
import { featuredSystems, navItems } from "../content/portfolio";
import { useActiveSection } from "../hooks/use-active-section";
import { RuntimeProvider } from "../features/runanywhere/runtime-provider";
import { EditorialProfilePage } from "../components/pages/editorial-profile-page";
import { SystemCaseStudyPage } from "../components/pages/system-case-study-page";
import { ArchitectureSection } from "../components/sections/architecture-section";
import { BuildWithAiSection } from "../components/sections/build-with-ai-section";
import { ContactSection } from "../components/sections/contact-section";
import { GitHubIntelligenceSection } from "../components/sections/github-intelligence-section";
import { HeroSection } from "../components/sections/hero-section";
import { LocalRuntimeSection } from "../components/sections/local-runtime-section";
import { NavShell } from "../components/sections/nav-shell";
import { PhilosophySection } from "../components/sections/philosophy-section";
import { PortfolioAgentSection } from "../components/sections/portfolio-agent-section";
import { SelectedSystemsSection } from "../components/sections/selected-systems-section";

const PORTFOLIO_THEME_STORAGE_KEY = "algsoch-portfolio-theme";

type PortfolioTheme = "default" | "newsprint";

function getSystemFromLocation() {
  const querySystem = new URLSearchParams(window.location.search).get("system");
  const hashMatch = window.location.hash.match(/^#\/systems\/([^/?#]+)/);
  const pathMatch = window.location.pathname.match(/^\/systems\/([^/?#]+)/);
  const systemId = querySystem ?? hashMatch?.[1] ?? pathMatch?.[1];

  return featuredSystems.find((system) => system.id === systemId) ?? null;
}

function isEditorialRoute() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");

  return view === "editorial" || /^#\/editorial\/?$/.test(window.location.hash) || /^\/editorial\/?$/.test(window.location.pathname);
}

function PortfolioHome({
  theme,
  onToggleTheme
}: {
  theme: PortfolioTheme;
  onToggleTheme: () => void;
}) {
  const activeSection = useActiveSection(navItems.map((item) => item.id));

  return (
    <div className="relative overflow-x-hidden">
      <div className="portfolio-grid-overlay pointer-events-none fixed inset-0 bg-grid opacity-[0.06]" />
      <div className="portfolio-accent-glow pointer-events-none fixed left-[-10%] top-20 h-[26rem] w-[26rem] rounded-full bg-accent/10 blur-[150px]" />
      <div className="portfolio-ink-glow pointer-events-none fixed bottom-[-10rem] right-[-6rem] h-[24rem] w-[24rem] rounded-full bg-white/6 blur-[150px]" />
      <a
        href="#hero"
        className="absolute left-4 top-4 z-[60] -translate-y-14 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-canvas transition focus:translate-y-0"
      >
        Skip to content
      </a>
      <NavShell items={navItems} activeSection={activeSection} theme={theme} onToggleTheme={onToggleTheme} />
      <main>
        <HeroSection />
        <SelectedSystemsSection />
        <ArchitectureSection />
        <BuildWithAiSection />
        <LocalRuntimeSection />
        <PortfolioAgentSection />
        <GitHubIntelligenceSection />
        <PhilosophySection />
        <ContactSection />
      </main>
    </div>
  );
}

export default function App() {
  const [portfolioTheme, setPortfolioTheme] = useState<PortfolioTheme>("default");
  const editorialRoute = isEditorialRoute();
  const routeSystem = getSystemFromLocation();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedTheme = window.localStorage.getItem(PORTFOLIO_THEME_STORAGE_KEY);
    if (savedTheme === "default" || savedTheme === "newsprint") {
      setPortfolioTheme(savedTheme);
    } else if (savedTheme === "mono") {
      setPortfolioTheme("newsprint");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(PORTFOLIO_THEME_STORAGE_KEY, portfolioTheme);
  }, [portfolioTheme]);

  const togglePortfolioTheme = () => {
    setPortfolioTheme((currentTheme) => (currentTheme === "default" ? "newsprint" : "default"));
  };

  return (
    <RuntimeProvider>
      {editorialRoute ? (
        <EditorialProfilePage />
      ) : (
        <div className="portfolio-shell" data-portfolio-theme={portfolioTheme}>
          {routeSystem ? (
            <SystemCaseStudyPage system={routeSystem} />
          ) : (
            <PortfolioHome theme={portfolioTheme} onToggleTheme={togglePortfolioTheme} />
          )}
        </div>
      )}
    </RuntimeProvider>
  );
}
