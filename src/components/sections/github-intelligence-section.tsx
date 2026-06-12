import { useMemo, useState } from "react";
import { featuredSystems, githubAccounts, type SystemLink } from "../../content/portfolio";
import {
  getAccountProjectMap,
  getRankedRepositories,
  getRepositoryThemes,
  getTopRepository
} from "../../features/github/repo-intelligence";
import { compactActionLabel, getSystemRouteHref } from "../../lib/utils";
import { Button } from "../ui/button";
import { GitHubCommitSurface } from "../ui/github-commit-surface";
import { SectionHeading } from "../ui/section-heading";
import { YouTubePreview } from "../ui/youtube-preview";

function getRepositoryActions(id: string, repoUrl?: string, demoUrl?: string) {
  const featuredMatch = featuredSystems.find((system) => system.id === id);

  if (featuredMatch?.links.length) {
    return featuredMatch.links;
  }

  const fallback: SystemLink[] = [];

  if (repoUrl) {
    fallback.push({ label: "Repository", href: repoUrl, variant: "primary" });
  }

  if (demoUrl) {
    fallback.push({ label: "Live Demo", href: demoUrl, variant: "secondary" });
  }

  return fallback;
}

export function GitHubIntelligenceSection() {
  const themes = useMemo(() => ["All", ...getRepositoryThemes()], []);
  const [activeTheme, setActiveTheme] = useState("All");
  const topRepository = useMemo(() => getTopRepository(), []);
  const accountProjectMap = useMemo(() => getAccountProjectMap(), []);
  const topRepositoryActions = useMemo(
    () => (topRepository ? getRepositoryActions(topRepository.id, topRepository.repoUrl, topRepository.demoUrl) : []),
    [topRepository]
  );
  const topRepositoryVideo = useMemo(() => {
    const videoLink = topRepositoryActions.find((link) => link.label === "YouTube Demo" && link.href)?.href;
    return videoLink ?? null;
  }, [topRepositoryActions]);
  const repositories = useMemo(
    () => getRankedRepositories(activeTheme === "All" ? undefined : activeTheme),
    [activeTheme]
  );

  return (
    <section id="github" className="section-space">
      <div className="section-frame">
        <div className="rounded-xl border border-orange-500/50 bg-black/10 p-5 sm:rounded-2xl sm:border-2 sm:p-6 lg:rounded-3xl lg:p-10">
        <SectionHeading
          eyebrow="GitHub Profile"
          title="My open source work and contributions."
          description="I've contributed to Coral MCP (12 merged PRs) and built several AI projects. Most of my work is on @FiscalMindset."
        />

        <div className="grid gap-3 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-3 self-start">
            {topRepository ? (
              <div className="rounded-2xl border border-accent/25 bg-accent/10 p-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/80">Strongest overall signal</div>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-xl font-semibold text-ink sm:text-2xl">{topRepository.title}</div>
                    <p className="mt-2 text-sm leading-6 text-muted">{topRepository.overview}</p>
                  </div>
                  <div className="self-start rounded-full border border-accent/20 bg-accent/12 px-3 py-1 text-xs text-accent">
                    @{topRepository.account}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {topRepository.bestFor.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-accent/20 bg-accent/12 px-3 py-1 text-xs text-ink">
                      {tag}
                    </span>
                  ))}
                </div>
                {topRepositoryActions.length ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Button href={getSystemRouteHref(topRepository.id)} size="sm" className="w-full min-w-0">
                      <span className="truncate">Case Study</span>
                    </Button>
                    {topRepositoryActions.map((link) => (
                      <Button
                        key={`${topRepository.id}-${link.label}`}
                        href={link.href ?? "#"}
                        variant={link.variant === "primary" ? "primary" : "secondary"}
                        size="sm"
                        className="w-full min-w-0"
                        aria-label={`${topRepository.title} ${link.label}`}
                      >
                        <span className="truncate">{compactActionLabel(link.label)}</span>
                      </Button>
                    ))}
                  </div>
                ) : null}
                {topRepositoryVideo ? (
                  <YouTubePreview
                    url={topRepositoryVideo}
                    title={topRepository.title}
                    className="mt-4"
                    aspectClassName="mx-auto aspect-[4/5] w-full max-w-[26rem] sm:max-w-none sm:aspect-video"
                    note="Open the full demo on YouTube."
                  />
                ) : null}
                <GitHubCommitSurface
                  repoUrl={topRepository.repoUrl}
                  title={topRepository.title}
                  fallbackEntries={topRepository.highlights ?? [topRepository.overview, topRepository.whyItMatters]}
                  className="mt-4"
                  compact
                />
              </div>
            ) : null}

            {githubAccounts.map((account) => (
              <div key={account.handle} className="rounded-2xl border border-line/75 bg-white/4 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <img
                      src={account.avatarUrl}
                      alt={`GitHub avatar for ${account.handle}`}
                      className="h-16 w-16 shrink-0 rounded-2xl border border-line/75 object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">{account.role}</div>
                      <div className="mt-3 text-xl font-semibold text-ink">@{account.handle}</div>
                      <div className="mt-2 text-xs text-muted">{account.avatarNote}</div>
                    </div>
                  </div>
                  <div
                    className={`self-start rounded-full border px-3 py-1 text-xs ${
                      account.status === "primary"
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-line/70 bg-white/4 text-muted"
                    }`}
                  >
                    {account.status === "primary" ? "Current Canonical" : "Legacy / Suspended"}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{account.note}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{account.overview}</p>
                <div className="mt-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">Signal tags</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {account.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-ink">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">What lives here</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {account.featuredProjects.slice(0, 6).map((project) => (
                      <span key={project} className="rounded-full border border-line/70 bg-white/4 px-3 py-1 text-xs text-muted">
                        {project}
                      </span>
                    ))}
                    {account.featuredProjects.length > 6 ? (
                      <span className="rounded-full border border-line/70 bg-white/4 px-3 py-1 text-xs text-muted">
                        +{account.featuredProjects.length - 6} more
                      </span>
                    ) : null}
                  </div>
                </div>
                <a className="mt-4 inline-flex text-sm text-accent hover:text-ink" href={account.href} target="_blank" rel="noreferrer">
                  View profile
                </a>
              </div>
            ))}

            {/* GitHub Contribution Stats - Dual Account Display */}
            <div className="rounded-2xl border border-accent/25 bg-accent/5 p-4">
              {/* Profile Header with Avatar */}
              <div className="flex items-center gap-4">
                <img 
                  src="https://avatars.githubusercontent.com/u/254638087?v=4" 
                  alt="Vicky Kumar" 
                  className="h-14 w-14 rounded-full border-2 border-accent/30 object-cover"
                />
                <div>
                  <div className="text-lg font-bold text-ink">Vicky Kumar</div>
                  <div className="text-sm text-muted">Building AI products and real-world systems</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <a href="https://github.com/FiscalMindset" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      @FiscalMindset
                    </a>
                    <span className="text-xs text-muted">|</span>
                    <a href="https://github.com/algsoch" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent">
                      @algsoch
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {/* @fiscalmindset Account */}
                <div className="rounded-2xl border border-accent/20 bg-accent/8 p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <a href="https://github.com/FiscalMindset" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold text-ink hover:text-accent">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      @fiscalmindset
                    </a>
                    <span className="rounded-full border border-accent/30 bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">⭐ Primary</span>
                  </div>
                  
                  {/* Stats Grid - Responsive: 2 cols on mobile, 4 on sm+ */}
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-xl border border-accent/15 bg-accent/10 p-2 text-center">
                      <div className="flex justify-center"><svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg></div>
                      <div className="mt-1 text-lg font-bold text-ink">42</div>
                      <div className="text-[9px] text-muted">Commits</div>
                    </div>
                    <div className="rounded-xl border border-accent/15 bg-accent/10 p-2 text-center">
                      <div className="flex justify-center"><svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                      <div className="mt-1 text-lg font-bold text-ink">22</div>
                      <div className="text-[9px] text-muted">PRs</div>
                    </div>
                    <div className="rounded-xl border border-accent/15 bg-accent/10 p-2 text-center">
                      <div className="flex justify-center"><svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg></div>
                      <div className="mt-1 text-lg font-bold text-ink">12</div>
                      <div className="text-[9px] text-muted">Issues</div>
                    </div>
                    <div className="rounded-xl border border-accent/15 bg-accent/10 p-2 text-center">
                      <div className="flex justify-center"><svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg></div>
                      <div className="mt-1 text-lg font-bold text-ink">20</div>
                      <div className="text-[9px] text-muted">Repos</div>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[10px] text-accent">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      6 Stars
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[10px] text-accent">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      CLA Signed
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-500/25 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      12 Coral PRs
                    </span>
                  </div>
                </div>

                {/* @algsoch Account */}
                <div className="rounded-2xl border border-muted/20 bg-white/5 p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <a href="https://github.com/algsoch" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold text-ink hover:text-accent">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                      @algsoch
                    </a>
                    <span className="rounded-full border border-muted/30 bg-white/5 px-2 py-0.5 text-xs font-medium text-muted">📦 Legacy</span>
                  </div>
                  
                  {/* Stats Grid - Responsive: 2 cols on mobile, 4 on sm+ */}
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-xl border border-muted/15 bg-white/4 p-2 text-center">
                      <div className="flex justify-center"><svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg></div>
                      <div className="mt-1 text-lg font-bold text-ink">217</div>
                      <div className="text-[9px] text-muted">Commits</div>
                    </div>
                    <div className="rounded-xl border border-muted/15 bg-white/4 p-2 text-center">
                      <div className="flex justify-center"><svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
                      <div className="mt-1 text-lg font-bold text-ink">28</div>
                      <div className="text-[9px] text-muted">PRs</div>
                    </div>
                    <div className="rounded-xl border border-muted/15 bg-white/4 p-2 text-center">
                      <div className="flex justify-center"><svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg></div>
                      <div className="mt-1 text-lg font-bold text-ink">107</div>
                      <div className="text-[9px] text-muted">Repos</div>
                    </div>
                    <div className="rounded-xl border border-muted/15 bg-white/4 p-2 text-center">
                      <div className="flex justify-center"><svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg></div>
                      <div className="mt-1 text-lg font-bold text-ink">6</div>
                      <div className="text-[9px] text-muted">Followers</div>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-muted/25 bg-white/5 px-2 py-0.5 text-[10px] text-muted">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      24 Stars
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-muted/25 bg-white/5 px-2 py-0.5 text-[10px] text-muted">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      350 Contributions
                    </span>
                  </div>
                </div>
              </div>

              {/* GitHub Achievements */}
              <div className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/75">🏅 GitHub Achievements</div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a href="https://github.com/FiscalMindset?achievement=pull-shark&tab=achievements" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-1 rounded-xl border border-accent/20 bg-accent/8 p-3 transition hover:border-accent/40 hover:bg-accent/12">
                    <img src="https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png" alt="Pull Shark" className="h-12 w-12 object-contain" />
                    <span className="text-xs font-medium text-ink group-hover:text-accent">Pull Shark</span>
                    <span className="text-[9px] text-muted">22+ PRs</span>
                  </a>
                  <a href="https://github.com/FiscalMindset?achievement=yolo&tab=achievements" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-1 rounded-xl border border-accent/20 bg-accent/8 p-3 transition hover:border-accent/40 hover:bg-accent/12">
                    <img src="https://github.githubassets.com/assets/yolo-default-be0bbff04951.png" alt="YOLO" className="h-12 w-12 object-contain" />
                    <span className="text-xs font-medium text-ink group-hover:text-accent">YOLO</span>
                    <span className="text-[9px] text-muted">Merged without review</span>
                  </a>
                  <a href="https://github.com/FiscalMindset?achievement=quickdraw&tab=achievements" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-1 rounded-xl border border-accent/20 bg-accent/8 p-3 transition hover:border-accent/40 hover:bg-accent/12">
                    <img src="https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png" alt="Quickdraw" className="h-12 w-12 object-contain" />
                    <span className="text-xs font-medium text-ink group-hover:text-accent">Quickdraw</span>
                    <span className="text-[9px] text-muted">PR merged &lt;5min</span>
                  </a>
                </div>
              </div>

              {/* Key Achievements with Better Icons */}
              <div className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/75">🏆 Key Achievements</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="group flex items-start gap-3 rounded-xl border border-accent/15 bg-accent/8 p-3 transition hover:border-accent/30">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-lg">📱</div>
                    <div>
                      <div className="font-medium text-ink">Algsoch</div>
                      <div className="text-xs text-muted">Android AI news app with on-device intelligence (107K+ downloads)</div>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3 rounded-xl border border-accent/15 bg-accent/8 p-3 transition hover:border-accent/30">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-lg">🤖</div>
                    <div>
                      <div className="font-medium text-ink">Algsoch News</div>
                      <div className="text-xs text-muted">Multi-agent AI newsroom system</div>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3 rounded-xl border border-accent/15 bg-accent/8 p-3 transition hover:border-accent/30">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-lg">🧠</div>
                    <div>
                      <div className="font-medium text-ink">Synapse-Graph</div>
                      <div className="text-xs text-muted">AI autopsy engine for neural governance</div>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3 rounded-xl border border-accent/15 bg-accent/8 p-3 transition hover:border-accent/30">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-lg">🔧</div>
                    <div>
                      <div className="font-medium text-ink">Kairon</div>
                      <div className="text-xs text-muted">AI-powered system automation platform</div>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3 rounded-xl border border-accent/15 bg-accent/8 p-3 transition hover:border-accent/30">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-lg">🧬</div>
                    <div>
                      <div className="font-medium text-ink">Brain Tumor Detection</div>
                      <div className="text-xs text-muted">97.9% accuracy CNN model (EfficientNetB3)</div>
                    </div>
                  </div>
                  <div className="group flex items-start gap-3 rounded-xl border border-purple-500/15 bg-purple-500/8 p-3 transition hover:border-purple-500/30">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-lg">🐙</div>
                    <div>
                      <div className="font-medium text-ink">Coral MCP Contributor</div>
                      <div className="text-xs text-muted">12 PRs merged/open to withcoral/coral sources</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pinned Repositories */}
              <div className="mt-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/75">📌 Pinned Repositories</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <a href="https://github.com/FiscalMindset/algsoch" target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border border-line/70 bg-white/4 p-3 transition hover:border-accent/30 hover:bg-accent/5">
                    <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="font-semibold text-ink group-hover:text-accent truncate">algsoch</span><span className="rounded-full border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent">Kotlin</span></div>
                      <p className="text-xs text-muted truncate">Android AI news app</p>
                    </div>
                  </a>
                  <a href="https://github.com/FiscalMindset/algsochnews" target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border border-line/70 bg-white/4 p-3 transition hover:border-accent/30 hover:bg-accent/5">
                    <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="font-semibold text-ink group-hover:text-accent truncate">algsochnews</span><span className="rounded-full border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent">Python</span></div>
                      <p className="text-xs text-muted truncate">Multi-agent AI newsroom</p>
                    </div>
                  </a>
                  <a href="https://github.com/FiscalMindset/Kairon" target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border border-line/70 bg-white/4 p-3 transition hover:border-accent/30 hover:bg-accent/5">
                    <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="font-semibold text-ink group-hover:text-accent truncate">Kairon</span><span className="rounded-full border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent">Python</span></div>
                      <p className="text-xs text-muted truncate">AI automation platform</p>
                    </div>
                  </a>
                  <a href="https://github.com/FiscalMindset/Synapse-Graph" target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border border-line/70 bg-white/4 p-3 transition hover:border-accent/30 hover:bg-accent/5">
                    <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="font-semibold text-ink group-hover:text-accent truncate">Synapse-Graph</span><span className="rounded-full border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent">Python</span></div>
                      <p className="text-xs text-muted truncate">AI autopsy engine</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Coral MCP Contributions */}
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent/75">🐙 Coral MCP Contributions</div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-green-500/25 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">✓ 9 merged</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/25 bg-yellow-500/10 px-2 py-0.5 text-[10px] text-yellow-400">◐ 2 open</span>
                  </div>
                </div>
                <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {[
                    { name: "Voyage AI", pr: "1115", status: "merged" },
                    { name: "Sarvam AI", pr: "1112", status: "merged" },
                    { name: "Cohere AI", pr: "1098", status: "merged" },
                    { name: "Mistral AI", pr: "1011", status: "merged" },
                    { name: "OpenRouter", pr: "882", status: "merged" },
                    { name: "LM Studio", pr: "834", status: "merged" },
                    { name: "Ollama", pr: "798", status: "merged" },
                    { name: "Groq AI", pr: "754", status: "merged" },
                    { name: "Deepgram ASR", pr: "1118", status: "open" },
                    { name: "NVIDIA NIM", pr: "958", status: "open" },
                  ].map((pr) => (
                    <a
                      key={pr.name}
                      href={`https://github.com/withcoral/coral/pull/${pr.pr}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-lg border border-line/50 bg-white/3 p-2 transition hover:border-accent/30 hover:bg-accent/5"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${pr.status === "merged" ? "bg-green-400" : "bg-yellow-400"}`}></span>
                        <span className="text-sm font-medium text-ink group-hover:text-accent">{pr.name}</span>
                      </div>
                      <span className="font-mono text-xs text-muted">#{pr.pr}</span>
                    </a>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/20 bg-accent/10 px-2 py-1 text-accent">✓ CLA Signed</span>
                  <a href="https://github.com/withcoral/coral/pulls?q=author%3AFiscalMindset" target="_blank" rel="noreferrer" className="text-accent hover:underline">View all 12 PRs →</a>
                </div>
              </div>
            </div>

<div className="rounded-2xl border border-line/75 bg-white/4 p-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Ranking read</div>
              <div className="mt-3 grid gap-3">
                {[
                  "Algsoch is treated as the strongest overall signal because it best combines current flagship relevance, product maturity, and on-device AI execution.",
                  "CommandBrain still remains one of the strongest historical technical signals in the suspended algsoch account.",
                  "Low-signal repositories stay visible as context, but the ranking stays focused on serious execution proof."
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3">
                {Object.entries(accountProjectMap).map(([account, projects]) => (
                  <div key={account} className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                    <span className="font-semibold text-ink">@{account}</span>: {projects.slice(0, 3).join(", ")}
                    {projects.length > 3 ? `, +${projects.length - 3} more` : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line/75 bg-white/4 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Curated repository ranking</div>
                <div className="mt-2 text-sm text-muted">
                  Theme filtering is here so the portfolio tells a coherent story instead of dumping a repo feed.
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      theme === activeTheme ? "border-accent/40 bg-accent/12 text-ink" : "border-line/75 text-muted hover:text-ink"
                    }`}
                    onClick={() => setActiveTheme(theme)}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {repositories.map((repository, index) => (
                <div key={repository.id} className="rounded-[26px] border border-line/75 bg-black/15 p-4">
                  {(() => {
                    const repositoryActions = getRepositoryActions(repository.id, repository.repoUrl, repository.demoUrl);

                    return (
                      <>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                        Rank {index + 1} / @{repository.account}
                      </div>
                      <div className="mt-2 text-xl font-semibold text-ink">{repository.title}</div>
                      <p className="mt-2 max-w-2xl text-sm text-accent/80">{repository.synopsis}</p>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{repository.overview}</p>
                    </div>
                    <div className="rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm text-accent">
                      {(repository.score * 100).toFixed(0)} signal
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {repository.themes.map((theme) => (
                      <span key={theme} className="rounded-full border border-line/70 bg-white/4 px-3 py-1 text-xs text-muted">
                        {theme}
                      </span>
                    ))}
                    {repository.bestFor.map((tag) => (
                      <span key={tag} className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs text-ink">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-line/70 bg-white/4 p-4 text-sm text-muted">
                    <span className="font-semibold text-ink">Why it matters:</span> {repository.whyItMatters}
                  </div>

                  {repository.highlights?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {repository.highlights.map((highlight) => (
                        <div key={highlight} className="rounded-full border border-line/70 bg-white/4 px-3 py-1.5 text-xs text-muted">
                          {highlight}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {repositoryActions.length ? (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {featuredSystems.some((system) => system.id === repository.id) ? (
                        <Button href={getSystemRouteHref(repository.id)} size="sm" className="w-full min-w-0">
                          <span className="truncate">Case Study</span>
                        </Button>
                      ) : null}
                      {repositoryActions.map((link) => (
                        <Button
                          key={`${repository.id}-${link.label}`}
                          href={link.href ?? "#"}
                          variant={link.variant === "primary" ? "primary" : "secondary"}
                        size="sm"
                        className="w-full min-w-0"
                        aria-label={`${repository.title} ${link.label}`}
                      >
                          <span className="truncate">{compactActionLabel(link.label)}</span>
                        </Button>
                      ))}
                    </div>
                  ) : null}

                  <GitHubCommitSurface
                    repoUrl={repository.repoUrl}
                    title={repository.title}
                    fallbackEntries={repository.highlights ?? [repository.overview, repository.whyItMatters]}
                    className="mt-4"
                    compact
                  />

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      ["Execution", repository.executionDepth],
                      ["AI depth", repository.aiDepth],
                      ["Product", repository.productSignal],
                      ["Completeness", repository.completeness]
                    ].map(([label, value]) => (
                      <div key={label as string} className="rounded-2xl border border-line/70 bg-white/4 p-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</div>
                        <div className="mt-2 text-sm text-ink">{(Number(value) * 100).toFixed(0)}%</div>
                      </div>
                    ))}
                  </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

