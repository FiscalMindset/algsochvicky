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
        <SectionHeading
          eyebrow="GitHub Intelligence"
          title="A signal-first repository lens across two identities."
          description="The repository view is curated intentionally. The hosting split is explicit: Algsoch and Algsoch News are in `fiscalmindset`, while CommandBrain, SpeakAI, and most remaining repositories live in the suspended `algsoch` account."
        />

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-5">
            {topRepository ? (
              <div className="rounded-[28px] border border-accent/25 bg-accent/10 p-4 sm:p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/80">Strongest overall signal</div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
              </div>
            ) : null}

            {githubAccounts.map((account) => (
              <div key={account.handle} className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-4 sm:p-5">
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

            <div className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-4 sm:p-5">
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

          <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-4 sm:p-6">
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
    </section>
  );
}
