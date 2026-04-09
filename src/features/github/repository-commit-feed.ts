import { useEffect, useMemo, useState } from "react";
import { getGitHubCommitHistoryUrl } from "../../lib/utils";

export type RepositoryCommitEntry = {
  sha: string;
  shortSha: string;
  message: string;
  detail?: string;
  author: string;
  committedAt?: string;
  url?: string;
  source: "live" | "fallback";
};

type RepositoryCommitState = {
  status: "idle" | "loading" | "ready" | "error";
  entries: RepositoryCommitEntry[];
  repositoryLabel?: string;
  commitHistoryUrl?: string | null;
};

type ParsedRepository = {
  owner: string;
  repo: string;
  label: string;
  commitHistoryUrl: string;
};

type GitHubCommitApiItem = {
  sha: string;
  html_url?: string;
  commit?: {
    message?: string;
    author?: {
      name?: string;
      date?: string;
    };
  };
  author?: {
    login?: string;
  } | null;
};

const CACHE_TTL_MS = 1000 * 60 * 30;
const memoryCache = new Map<string, { expiresAt: number; entries: RepositoryCommitEntry[] }>();

function parseGitHubRepository(repoUrl?: string): ParsedRepository | null {
  if (!repoUrl) {
    return null;
  }

  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/?#]+)/i);

  if (!match) {
    return null;
  }

  const [, owner, repo] = match;
  return {
    owner,
    repo,
    label: `${owner}/${repo}`,
    commitHistoryUrl: getGitHubCommitHistoryUrl(repoUrl) ?? `${repoUrl.replace(/\/+$/, "")}/commits`
  };
}

function getStorageKey(label: string) {
  return `github-commit-preview:${label}`;
}

function readCachedCommits(label: string) {
  const now = Date.now();
  const memory = memoryCache.get(label);

  if (memory && memory.expiresAt > now) {
    return memory.entries;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getStorageKey(label));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { expiresAt: number; entries: RepositoryCommitEntry[] };

    if (parsed.expiresAt <= now) {
      window.localStorage.removeItem(getStorageKey(label));
      return null;
    }

    memoryCache.set(label, { expiresAt: parsed.expiresAt, entries: parsed.entries });
    return parsed.entries;
  } catch {
    window.localStorage.removeItem(getStorageKey(label));
    return null;
  }
}

function writeCachedCommits(label: string, entries: RepositoryCommitEntry[]) {
  const expiresAt = Date.now() + CACHE_TTL_MS;
  memoryCache.set(label, { expiresAt, entries });

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(label), JSON.stringify({ expiresAt, entries }));
}

function toFallbackEntries(items: string[]) {
  return items.slice(0, 8).map((item, index) => ({
    sha: `fallback-${index + 1}`,
    shortSha: `PF0${index + 1}`,
    message: item,
    author: "Portfolio evidence",
    source: "fallback" as const
  }));
}

async function fetchRepositoryCommits(repo: ParsedRepository, signal?: AbortSignal) {
  const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/commits?per_page=8`, {
    headers: {
      Accept: "application/vnd.github+json"
    },
    signal
  });

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status}`);
  }

  const payload = (await response.json()) as GitHubCommitApiItem[];

  return payload.map((item) => {
    const message = item.commit?.message?.split("\n\n")[0]?.trim() || "Commit update";
    const detail = item.commit?.message?.split("\n\n").slice(1).join(" ").trim() || undefined;

    return {
      sha: item.sha,
      shortSha: item.sha.slice(0, 7),
      message,
      detail,
      author: item.author?.login || item.commit?.author?.name || repo.owner,
      committedAt: item.commit?.author?.date,
      url: item.html_url,
      source: "live" as const
    };
  });
}

export function formatRelativeCommitTime(date?: string) {
  if (!date) {
    return "Portfolio evidence";
  }

  const target = new Date(date).getTime();

  if (Number.isNaN(target)) {
    return "Recent commit";
  }

  const diffMs = target - Date.now();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return rtf.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, "day");
  }

  const diffMonths = Math.round(diffDays / 30);
  return rtf.format(diffMonths, "month");
}

export function useRepositoryCommitFeed(repoUrl?: string, fallbackEntries: string[] = []) {
  const repository = useMemo(() => parseGitHubRepository(repoUrl), [repoUrl]);
  const fallbackKey = fallbackEntries.join("||");
  const fallback = useMemo(() => toFallbackEntries(fallbackEntries), [fallbackKey]);
  const [state, setState] = useState<RepositoryCommitState>(() => ({
    status: repository ? "loading" : "ready",
    entries: fallback,
    repositoryLabel: repository?.label,
    commitHistoryUrl: repository?.commitHistoryUrl ?? null
  }));

  useEffect(() => {
    if (!repository) {
      setState({
        status: "ready",
        entries: fallback,
        repositoryLabel: undefined,
        commitHistoryUrl: null
      });
      return;
    }

    const cachedEntries = readCachedCommits(repository.label);

    if (cachedEntries?.length) {
      setState({
        status: "ready",
        entries: cachedEntries,
        repositoryLabel: repository.label,
        commitHistoryUrl: repository.commitHistoryUrl
      });
      return;
    }

    const controller = new AbortController();

    setState({
      status: "loading",
      entries: fallback,
      repositoryLabel: repository.label,
      commitHistoryUrl: repository.commitHistoryUrl
    });

    fetchRepositoryCommits(repository, controller.signal)
      .then((entries) => {
        writeCachedCommits(repository.label, entries);
        setState({
          status: "ready",
          entries,
          repositoryLabel: repository.label,
          commitHistoryUrl: repository.commitHistoryUrl
        });
      })
      .catch(() => {
        setState({
          status: fallback.length ? "ready" : "error",
          entries: fallback,
          repositoryLabel: repository.label,
          commitHistoryUrl: repository.commitHistoryUrl
        });
      });

    return () => controller.abort();
  }, [fallback, repository]);

  return state;
}
