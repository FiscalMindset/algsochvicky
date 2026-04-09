import { ArrowUpRight, GitCommitHorizontal, Layers3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import { formatRelativeCommitTime, useRepositoryCommitFeed } from "../../features/github/repository-commit-feed";
import { Button } from "./button";

type GitHubCommitSurfaceProps = {
  repoUrl?: string;
  title: string;
  fallbackEntries: string[];
  compact?: boolean;
  className?: string;
};

export function GitHubCommitSurface({
  repoUrl,
  title,
  fallbackEntries,
  compact = false,
  className
}: GitHubCommitSurfaceProps) {
  const { entries, status, repositoryLabel, commitHistoryUrl } = useRepositoryCommitFeed(repoUrl, fallbackEntries);
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
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Commit surface</div>
          <div className="mt-2 text-sm font-semibold text-ink">{title}</div>
          <div className="mt-1 text-sm text-muted">
            {repositoryLabel ? `${repositoryLabel} commit activity` : "Repository history preview"}
          </div>
        </div>

        <div className="self-start rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/75">
          {status === "loading" ? "Syncing" : activeEntry?.source === "live" ? "Live GitHub feed" : "Portfolio fallback"}
        </div>
      </div>

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
                    "relative rounded-[22px] border px-3 py-3 text-left transition",
                    compact ? "min-w-0" : "w-[124px] shrink-0 sm:w-[138px]",
                    active
                      ? "border-accent/35 bg-accent/12 shadow-[0_14px_40px_rgba(0,0,0,0.24)]"
                      : "border-line/70 bg-white/4 hover:border-accent/22 hover:bg-white/6"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                        active ? "border-accent/30 bg-accent/12 text-accent" : "border-line/70 bg-black/20 text-ink/80"
                      )}
                    >
                      <GitCommitHorizontal size={14} />
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent/80">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="mt-3 rounded-full border border-line/70 bg-black/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/85">
                    {entry.shortSha}
                  </div>

                  <div className={cn("mt-3 font-semibold leading-5 text-ink", compact ? "line-clamp-2 text-[12px]" : "line-clamp-3 text-[12px]")}>
                    {entry.message}
                  </div>
                  <div className="mt-2 text-[11px] text-muted">{formatRelativeCommitTime(entry.committedAt)}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeEntry ? (
        <div
          className={cn(
            "relative mt-3 rounded-[24px] border border-line/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_52%)] p-3 sm:p-4",
            compact ? "min-h-[11.5rem]" : "min-h-[13rem]"
          )}
          style={{ perspective: "1200px" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
          <div className="pointer-events-none absolute inset-x-5 top-4 h-[86%] rounded-[20px] border border-line/50 bg-white/[0.02]" />
          <div className="pointer-events-none absolute inset-x-7 top-7 h-[82%] rounded-[20px] border border-line/40 bg-white/[0.015]" />

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
                    Level {String(visibleEntries.findIndex((entry) => entry.sha === activeEntry.sha) + 1).padStart(2, "0")}
                  </div>
                </div>

                <div className="mt-3 text-sm font-semibold leading-6 text-ink">{activeEntry.message}</div>
                {activeEntry.detail ? (
                  <div className={cn("mt-2 text-muted", compact ? "text-[12px] leading-5" : "text-sm leading-6")}>
                    {activeEntry.detail}
                  </div>
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
