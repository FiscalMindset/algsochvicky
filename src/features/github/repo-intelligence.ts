import { repositorySignals, type RepositorySignal } from "../../content/portfolio";
import { tokenize } from "../../lib/utils";

export function scoreRepositorySignal(repository: RepositorySignal) {
  const manualBoost = repository.featured ? 0.3 : 0;
  const flagshipBoost = repository.id === "algsoch" ? 0.12 : 0;
  return (
    manualBoost +
    flagshipBoost +
    repository.completeness * 0.18 +
    repository.executionDepth * 0.24 +
    repository.aiDepth * 0.24 +
    repository.productSignal * 0.22 +
    repository.recencySignal * 0.12
  );
}

export function getRankedRepositories(theme?: string) {
  return repositorySignals
    .filter((repository) => !theme || repository.themes.includes(theme))
    .map((repository) => ({
      ...repository,
      score: scoreRepositorySignal(repository)
    }))
    .sort((left, right) => right.score - left.score);
}

export function getRepositoryThemes() {
  return [...new Set(repositorySignals.flatMap((repository) => repository.themes))].filter((theme) => theme !== "Legacy");
}

export function getTopRepository() {
  return getRankedRepositories()[0] ?? null;
}

export function getRepositoryById(id: string) {
  return repositorySignals.find((repository) => repository.id === id) ?? null;
}

export function isBestProjectQuestion(query: string) {
  const queryLower = query.toLowerCase();
  return (
    (queryLower.includes("best") || queryLower.includes("strongest") || queryLower.includes("top")) &&
    (queryLower.includes("project") || queryLower.includes("repo") || queryLower.includes("repository")) &&
    queryLower.includes("github")
  );
}

export function recommendRepositoriesForQuery(query: string) {
  const tokens = tokenize(query);
  const queryLower = query.toLowerCase();

  return repositorySignals
    .filter((repository) => repository.id !== "legacy-archive")
    .map((repository) => {
      const queryScore =
        tokens.reduce(
          (total, token) =>
            total +
            (repository.title.toLowerCase().includes(token) ? 4 : 0) +
            (repository.synopsis.toLowerCase().includes(token) ? 2 : 0) +
            (repository.overview.toLowerCase().includes(token) ? 2 : 0) +
            (repository.whyItMatters.toLowerCase().includes(token) ? 2 : 0) +
            repository.bestFor.reduce((sum, item) => sum + (item.toLowerCase().includes(token) ? 3 : 0), 0) +
            repository.themes.reduce((sum, item) => sum + (item.toLowerCase().includes(token) ? 2 : 0), 0),
          0
        ) +
        (isBestProjectQuestion(query) && repository.id === "algsoch" ? 10 : 0) +
        (queryLower.includes("voice") && repository.id === "speakai" ? 8 : 0) +
        (queryLower.includes("news") && repository.id === "algsoch-news" ? 8 : 0) +
        ((queryLower.includes("flagship") || queryLower.includes("best app") || queryLower.includes("strongest app")) &&
        repository.id === "algsoch"
          ? 10
          : 0) +
        ((queryLower.includes("ml") || queryLower.includes("machine learning") || queryLower.includes("medical")) &&
        repository.id === "silent-disease-detection-engine"
          ? 8
          : 0) +
        ((queryLower.includes("brain") || queryLower.includes("tumor") || queryLower.includes("mri")) &&
        repository.id === "brain-tumor-detection-system"
          ? 10
          : 0) +
        ((queryLower.includes("bid") || queryLower.includes("freelancer") || queryLower.includes("proposal")) &&
        repository.id === "ai-bid-writer-agent"
          ? 10
          : 0) +
        ((queryLower.includes("html") || queryLower.includes("parser") || queryLower.includes("markup")) &&
        repository.id === "html-checker"
          ? 10
          : 0) +
        ((queryLower.includes("tds") || queryLower.includes("tool-based") || queryLower.includes("solver")) &&
        repository.id === "tds-tool-based-assistant"
          ? 10
          : 0);

      return {
        ...repository,
        score: scoreRepositorySignal(repository) + queryScore * 0.035
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function getAccountProjectMap() {
  return {
    fiscalmindset: ["Algsoch", "Algsoch News"],
    algsoch: [
      "CommandBrain",
      "SpeakAI",
      "Brain Tumor Detection System",
      "AI Bid Writer Agent",
      "HTML Checker",
      "Silent Disease Detection Engine",
      "TDS Tool-Based Assistant",
      "Most remaining repositories"
    ]
  };
}
