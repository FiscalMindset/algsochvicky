import { ArrowUpRight, GitBranch, GitCommitHorizontal, Layers3, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import { formatRelativeCommitTime, useRepositoryCommitFeed, useRepositoryStats } from "../../features/github/repository-commit-feed";
import { Button } from "./button";

type GitHubCommitSurfaceProps = {
  repoUrl?: string;
  title: string;
  fallbackEntries: string[];
  compact?: boolean;
  className?: string;
};

const tagColors = [
  "border-rose-500/30 bg-rose-500/10 text-rose-400/90",
  "border-cyan-500/30 bg-cyan-500/10 text-cyan-400/90",
  "border-violet-500/30 bg-violet-500/10 text-violet-400/90",
  "border-lime-500/30 bg-lime-500/10 text-lime-400/90",
  "border-pink-500/30 bg-pink-500/10 text-pink-400/90",
];

export function GitHubCommitSurface({
  repoUrl,
  title,
  fallbackEntries,
  compact = false,
  className
}: GitHubCommitSurfaceProps) {
  const { entries, status, repositoryLabel, commitHistoryUrl } = useRepositoryCommitFeed(repoUrl, fallbackEntries);
  const { stats, loading: statsLoading } = useRepositoryStats(repoUrl);
  const isLive = entries.some((e) => e.source === "live");
  const visibleEntries = useMemo(() => entries.slice(0, compact ? 6 : 8), [compact, entries]);
  const [activeSha, setActiveSha] = useState(visibleEntries[0]?.sha ?? "");

  useEffect(() => {
    setActiveSha((current) => (visibleEntries.some((entry) => entry.sha === current) ? current : visibleEntries[0]?.sha ?? ""));
  }, [visibleEntries]);

  const activeEntry = visibleEntries.find((entry) => entry.sha === activeSha) ?? visibleEntries[0];
  const latestCommitUrl = activeEntry?.url;

  if (!visibleEntries.length && !commitHistoryUrl) {
    return null;
  }

  return (
    <div className={cn("rounded-[24px] border border-line/75 bg-black/15 p-4 sm:p-5", className)}>
      {/* header */}
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Commit surface</div>
          <div className="mt-2 text-sm font-semibold text-ink">{title}</div>
          <div className="mt-1 text-sm text-muted">
            {repositoryLabel ? `${repositoryLabel} commit activity` : "Repository history preview"}
          </div>
        </div>
        <div className="self-start rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/75">
          {status === "loading" ? "Syncing" : isLive ? "Live GitHub feed" : "Portfolio fallback"}
        </div>
      </div>

      {/* repo stats bar */}
      {stats && (
        <div className="mt-3 flex flex-wrap items-center gap-2.5 rounded-xl border border-line/70 bg-white/4 px-3 py-2">
          <div className="flex items-center gap-1 text-[10px] font-mono text-muted/80">
            <Star size={10} className="text-amber-400/70" />
            <span>{stats.stars}</span>
          </div>
          <span className="text-muted/20">|</span>
          <div className="flex items-center gap-1 text-[10px] font-mono text-muted/80">
            <GitBranch size={10} className="text-cyan-400/70" />
            <span>{stats.forks} forks</span>
          </div>
          <span className="text-muted/20">|</span>
          <div className="flex items-center gap-1 text-[10px] font-mono text-muted/80">
            <GitBranch size={10} className="text-violet-400/70" />
            <span>{stats.branchCount} branches</span>
          </div>
          {stats.language && (
            <>
              <span className="text-muted/20">|</span>
              <span className="rounded border border-line/60 bg-white/4 px-1.5 py-0.5 text-[9px] font-mono text-muted/70">{stats.language}</span>
            </>
          )}
          <span className="text-muted/20">|</span>
          <span className="text-[9px] font-mono text-muted/50">{stats.defaultBranch}</span>
        </div>
      )}
      {statsLoading && !stats && (
        <div className="mt-3 rounded-xl border border-line/70 bg-white/4 px-3 py-2 text-[9px] font-mono text-muted/50">
          Loading repo stats...
        </div>
      )}

      {/* commit cards */}
      <div className="mt-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className={cn("px-2 py-3", compact ? "min-w-0" : "relative min-w-max py-4")}>
          {!compact ? (
            <div className="absolute left-10 right-10 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
          ) : null}
          <div className={cn(compact ? "grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3" : "flex items-start gap-3 sm:gap-4")}>
            {visibleEntries.map((entry, index) => {
              const active = entry.sha === activeEntry?.sha;
              return (
                <button
                  key={entry.sha}
                  onClick={() => setActiveSha(entry.sha)}
                  className={cn(
                    "relative rounded-[22px] border px-3 py-3 text-left transition-all",
                    compact ? "min-w-0" : "w-[132px] shrink-0 sm:w-[146px]",
                    active
                      ? "border-accent/35 bg-accent/12 shadow-[0_14px_40px_rgba(0,0,0,0.24)]"
                      : "border-line/70 bg-white/4 hover:border-accent/22 hover:bg-white/6"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
                        active ? "border-accent/30 bg-accent/12 text-accent" : "border-line/70 bg-black/20 text-ink/80"
                      )}
                    >
                      <GitCommitHorizontal size={12} />
                    </div>
                    <div className={cn("font-mono text-[9px] uppercase tracking-[0.12em]", active ? "text-accent/80" : "text-muted/60")}>
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className={cn("mt-2 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]", active ? tagColors[index % tagColors.length] : "border-line/70 bg-black/20 text-muted/70")}>
                    {entry.shortSha}
                  </div>
                  <div className={cn("mt-2 font-semibold leading-5 text-ink", compact ? "line-clamp-2 text-[11px]" : "line-clamp-3 text-[11px]")}>
                    {entry.message}
                  </div>
                  <div className="mt-1.5 text-[10px] text-muted/70 font-mono">{formatRelativeCommitTime(entry.committedAt)}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* active commit detail */}
      {activeEntry ? (
        <div className="relative mt-3 rounded-[24px] border border-line/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_52%)] p-3 sm:p-4">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
          <div className="relative rounded-[20px] border border-line/70 bg-canvas/90 p-3.5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
                    <GitCommitHorizontal size={14} />
                  </div>
                  <div className="rounded-full border border-line/70 bg-white/4 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent/80">
                    {activeEntry.shortSha}
                  </div>
                  <div className="rounded-full border border-line/70 bg-black/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    #{visibleEntries.findIndex((e) => e.sha === activeEntry.sha) + 1}
                  </div>
                </div>
                <div className="mt-3 text-sm font-semibold leading-6 text-ink">{activeEntry.message}</div>
                {activeEntry.detail ? (
                  <div className={cn("mt-2 text-muted", compact ? "text-[12px] leading-5" : "text-sm leading-6")}>{activeEntry.detail}</div>
                ) : null}
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/70 bg-white/4 text-muted">
                <Layers3 size={14} />
              </div>
            </div>
            <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
              <span>{activeEntry.author}</span>
              <span className="text-accent/85">{formatRelativeCommitTime(activeEntry.committedAt)}</span>
              <span>{activeEntry.source === "live" ? "GitHub commit" : "Portfolio evidence"}</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* action buttons */}
      {commitHistoryUrl || latestCommitUrl ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {commitHistoryUrl ? (
            <Button href={commitHistoryUrl} variant="secondary" size="sm" className="w-full min-w-0 justify-center">
              <span className="truncate">Open full history</span>
              <ArrowUpRight size={14} />
            </Button>
          ) : null}
          {latestCommitUrl ? (
            <Button href={latestCommitUrl} size="sm" className="w-full min-w-0 justify-center">
              <span className="truncate">Open latest commit</span>
              <ArrowUpRight size={14} />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
