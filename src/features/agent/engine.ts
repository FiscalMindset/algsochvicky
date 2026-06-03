import {
  brandProfile,
  featuredSystems,
  githubAccounts,
  knowledgeEntries,
  philosophyStatements,
  repositorySignals,
  suggestedQuestions
} from "../../content/portfolio";
import { tokenize } from "../../lib/utils";
import {
  getAccountProjectMap,
  getTopRepository,
  isBestProjectQuestion,
  recommendRepositoriesForQuery
} from "../github/repo-intelligence";
import { generateWithGroq } from "./groq-provider";
import type { AgentInferenceMode, AgentIntent, AgentMode, AgentRequest, AgentResponse } from "./types";

const modeKeywords: Record<AgentIntent, string[]> = {
  recruiter: ["hire", "role", "candidate", "engineer", "team", "fit", "experience"],
  client: ["client", "build", "product", "startup", "company", "deliver", "engagement"],
  technical: ["architecture", "stack", "system", "agent", "runtime", "compare", "implementation"],
  project: ["project", "commandbrain", "speakai", "algsoch", "news", "portfolio"],
  capability: ["ai", "agentic", "voice", "chat", "on-device", "workflow", "local", "multimodal"]
};

const modeLabels: Record<AgentIntent, string> = {
  recruiter: "Recruiter Mode",
  client: "Client Mode",
  technical: "Technical Deep Dive",
  project: "Project Explorer",
  capability: "AI Capability Mode"
};

function detectIntent(query: string, requestedMode: AgentMode): AgentIntent {
  if (requestedMode !== "auto") {
    return requestedMode;
  }

  const tokens = tokenize(query);
  const scores = Object.entries(modeKeywords).map(([mode, keywords]) => {
    const score = keywords.reduce((total, keyword) => total + (tokens.includes(keyword) ? 2 : 0), 0);
    return [mode, score] as const;
  });

  const sorted = scores.sort((left, right) => right[1] - left[1]);
  return (sorted[0]?.[1] ?? 0) > 0 ? (sorted[0]![0] as AgentIntent) : "capability";
}

function retrieveEvidence(query: string) {
  const queryTokens = tokenize(query);

  const scored = knowledgeEntries
    .map((entry) => {
      const score =
        entry.tags.reduce((total, tag) => total + (queryTokens.some((token) => tag.includes(token)) ? 2 : 0), 0) +
        entry.relatedSystems.reduce(
          (total, systemId) => total + (queryTokens.some((token) => systemId.includes(token)) ? 3 : 0),
          0
        ) +
        queryTokens.reduce(
          (total, token) =>
            total +
            (entry.summary.toLowerCase().includes(token) ? 1 : 0) +
            entry.evidence.reduce((sum, point) => sum + (point.toLowerCase().includes(token) ? 1 : 0), 0),
          0
        );

      return { entry, score };
    })
    .sort((left, right) => right.score - left.score);

  return scored.filter((item) => item.score > 0).slice(0, 4).map((item) => item.entry);
}

function inferSystems(query: string, evidenceIds: string[]) {
  const queryLower = query.toLowerCase();
  const explicitSystems = [
    ...featuredSystems
      .filter((system) => queryLower.includes(system.id) || queryLower.includes(system.title.toLowerCase()))
      .map((system) => system.title),
    ...repositorySignals
      .filter((repository) => queryLower.includes(repository.id) || queryLower.includes(repository.title.toLowerCase()))
      .map((repository) => repository.title)
  ];

  if (explicitSystems.length) {
    return [...new Set(explicitSystems)].slice(0, 3);
  }

  const evidenceSystems = new Set(
    knowledgeEntries
      .filter((entry) => evidenceIds.includes(entry.id))
      .flatMap((entry) => entry.relatedSystems)
      .map((id) => {
        const featuredTitle = featuredSystems.find((system) => system.id === id)?.title;
        const repositoryTitle = repositorySignals.find((repository) => repository.id === id)?.title;
        return featuredTitle ?? repositoryTitle;
      })
      .filter((title): title is string => Boolean(title))
  );

  if (evidenceSystems.size) {
    return [...evidenceSystems].slice(0, 3);
  }

  return recommendRepositoriesForQuery(query)
    .slice(0, 3)
    .map((repository) => repository.title);
}

function buildReasoning(mode: AgentIntent, systems: string[]) {
  const systemLabel = systems.length ? systems.join(", ") : "portfolio-wide signal";

  switch (mode) {
    case "recruiter":
      return [
        "Prioritized hireability signal over chronology.",
        `Used ${systemLabel} as the clearest proof of execution depth.`,
        "Framed strengths around shipping AI products, not theoretical familiarity."
      ];
    case "client":
      return [
        "Focused on what Vicky can build for a real product need.",
        "Mapped the answer to workflow design, interfaces, and delivery confidence.",
        `Highlighted systems with the strongest applied value: ${systemLabel}.`
      ];
    case "technical":
      return [
        "Shifted the answer toward architecture, runtime, and implementation layers.",
        "Emphasized orchestration, model integration, and system boundaries.",
        `Used ${systemLabel} as technical evidence instead of generic claims.`
      ];
    case "project":
      return [
        "Narrowed the response around project-level differentiation.",
        `Pulled evidence from ${systemLabel} where the contrast is most visible.`,
        "Kept the framing grounded in what each system demonstrates."
      ];
    case "capability":
      return [
        "Answered from the lens of AI execution capability across products.",
        "Connected interfaces, workflows, and runtime integration into one narrative.",
        `Used ${systemLabel} as proof rather than a broad skills list.`
      ];
  }
}

function buildFollowUps(mode: AgentIntent, systems: string[]) {
  const base =
    systems[0] && systems[1]
      ? [`Compare ${systems[0]} and ${systems[1]} in more detail.`]
      : systems[0]
        ? [`Go deeper on how ${systems[0]} was architected.`]
        : [];

  const modePrompts: Record<AgentIntent, string[]> = {
    recruiter: [
      "Which project is the strongest hiring signal for an AI engineer role?",
      "How does Vicky balance engineering depth with product thinking?"
    ],
    client: [
      "If I need an AI-native product, where would Vicky start?",
      "Which system best proves he can build something client-facing and real?"
    ],
    technical: [
      "How does he separate interface, agent, and execution layers?",
      "What shows runtime integration or local inference capability most clearly?"
    ],
    project: [
      "What is Vicky Kumar's best project across both GitHub accounts, and why?",
      "Which project best represents his flagship product thinking?",
      "What makes CommandBrain different from a normal AI assistant?"
    ],
    capability: [
      "How does Vicky turn AI into usable systems rather than demos?",
      "Which work best demonstrates on-device or runtime-aware AI thinking?"
    ]
  };

  return [...base, ...modePrompts[mode]].slice(0, 3);
}

function buildRepositoryBlock(query: string) {
  const ranked = recommendRepositoriesForQuery(query).slice(0, 4);

  return ranked
    .map(
      (repository, index) =>
        `${index + 1}. ${repository.title} (@${repository.account})\nOverview: ${repository.overview}\nWhy it matters: ${repository.whyItMatters}\nBest for: ${repository.bestFor.join(", ")}`
    )
    .join("\n\n");
}

type PortfolioSignal = {
  id: string;
  title: string;
  summary: string;
  problem: string;
  whyItMatters: string;
  intelligence: string;
  architecture: string[];
  bestFor: string[];
  account: string;
};

function resolvePortfolioSignal(idOrTitle: string): PortfolioSignal | null {
  const system =
    featuredSystems.find((entry) => entry.id === idOrTitle || entry.title.toLowerCase() === idOrTitle.toLowerCase()) ?? null;
  const repository =
    repositorySignals.find((entry) => entry.id === idOrTitle || entry.title.toLowerCase() === idOrTitle.toLowerCase()) ?? null;

  if (!system && !repository) {
    return null;
  }

  return {
    id: system?.id ?? repository!.id,
    title: system?.title ?? repository!.title,
    summary: system?.summary ?? repository!.overview ?? repository!.synopsis ?? "",
    problem: system?.problem ?? repository?.synopsis ?? repository?.overview ?? "",
    whyItMatters: system?.significance ?? repository?.whyItMatters ?? "",
    intelligence: system?.intelligence ?? repository?.overview ?? "",
    architecture: system?.architecture ?? repository?.highlights ?? [],
    bestFor:
      system?.audienceFit.map((entry) => entry.title.replace(/^For\s+/i, "")) ??
      repository?.bestFor ??
      [],
    account: repository?.account ?? githubAccounts.find((account) => account.featuredProjects.includes(system?.title ?? ""))?.handle ?? "fiscalmindset"
  };
}

function extractPortfolioSignals(query: string, systems: string[]) {
  const explicitMatches = inferSystems(query, []).map((title) => resolvePortfolioSignal(title)).filter((item): item is PortfolioSignal => Boolean(item));
  const inferredMatches = systems.map((title) => resolvePortfolioSignal(title)).filter((item): item is PortfolioSignal => Boolean(item));

  return [...new Map([...explicitMatches, ...inferredMatches].map((item) => [item.id, item])).values()];
}

function isComparisonQuestion(query: string) {
  return /\b(compare|comparison|vs|versus|difference|different)\b/i.test(query);
}

function composeComparisonAnswer(signals: PortfolioSignal[]) {
  const [left, right] = signals;

  if (!left || !right) {
    return null;
  }

  return [
    "## Comparison Read",
    `${left.title} is stronger for ${left.bestFor.slice(0, 2).join(" and ") || "product execution"}, while ${right.title} is stronger for ${right.bestFor.slice(0, 2).join(" and ") || "workflow depth"}.`,
    "",
    "## Architectural Difference",
    `- ${left.title}: ${left.architecture[0] ?? left.intelligence}`,
    `- ${right.title}: ${right.architecture[0] ?? right.intelligence}`,
    "",
    "## Why Each Matters",
    `- ${left.title}: ${left.whyItMatters}`,
    `- ${right.title}: ${right.whyItMatters}`,
    "",
    "## Best Use",
    `- Choose ${left.title} when you want ${left.problem.toLowerCase()}.`,
    `- Choose ${right.title} when you want ${right.problem.toLowerCase()}.`
  ].join("\n");
}

function composeProjectBrief(signal: PortfolioSignal) {
  return [
    "## Project Brief",
    `${signal.title} is best understood as a serious product proof, not just a repository.`,
    "",
    "## What It Does",
    signal.problem,
    "",
    "## Why It Matters",
    `- ${signal.whyItMatters}`,
    `- Hosted under @${signal.account}.`,
    `- Strongest for ${signal.bestFor.slice(0, 3).join(", ") || "applied AI product execution"}.`,
    "",
    "## Technical Read",
    ...signal.architecture.slice(0, 3).map((point) => `- ${point}`)
  ].join("\n");
}

function composeRuleBasedAnswer(query: string, mode: AgentIntent, signals: PortfolioSignal[], evidenceTitles: string[]) {
  const lead = signals[0] ?? resolvePortfolioSignal("algsoch") ?? resolvePortfolioSignal("commandbrain");
  const secondary = signals[1];
  const evidenceLine = evidenceTitles.length ? `Evidence came primarily from ${evidenceTitles.join(", ")}.` : "";

  if (isComparisonQuestion(query) && signals.length >= 2) {
    return composeComparisonAnswer(signals.slice(0, 2));
  }

  if ((mode === "project" || /which project|tell me about|what is .*project|explain .*project/i.test(query)) && lead) {
    return composeProjectBrief(lead);
  }

  switch (mode) {
    case "recruiter":
      return [
        "## Hiring Read",
        `${brandProfile.name} is strongest for roles that sit between software engineering, applied AI, and product execution.`,
        "",
        "## Best Proof",
        `- ${lead?.title ?? "Algsoch"}: ${lead?.whyItMatters ?? ""}`,
        secondary ? `- ${secondary.title}: ${secondary.whyItMatters}` : "",
        "- The portfolio consistently shows interfaces, runtime logic, and workflow design working together rather than separately.",
        "",
        "## Why That Matters",
        "- This reads like someone who can ship AI-native product work end to end, not someone limited to prompt experiments.",
        "- The strongest signal is product maturity under technical constraint.",
        evidenceLine
      ]
        .filter(Boolean)
        .join("\n");
    case "client":
      return [
        "## Client Read",
        `${brandProfile.name} is a stronger fit when the problem is bigger than adding a chatbot and needs workflow design, interface clarity, and a reliable intelligence layer.`,
        "",
        "## Best Proof",
        `- ${lead?.title ?? "Algsoch"}: ${lead?.problem ?? ""}`,
        secondary ? `- ${secondary.title}: ${secondary.problem}` : "",
        "",
        "## Why That Matters",
        "- The work shows delivery thinking, not just model integration.",
        "- Product surfaces are treated as part of the engineering job.",
        evidenceLine
      ]
        .filter(Boolean)
        .join("\n");
    case "technical":
      return [
        "## Technical Read",
        `${brandProfile.name} approaches AI systems as layered software: interface, routing, intelligence, and execution each have a clear job.`,
        "",
        "## Strongest Technical Proof",
        `- ${lead?.title ?? "CommandBrain"}: ${lead?.architecture[0] ?? lead?.intelligence ?? ""}`,
        secondary ? `- ${secondary.title}: ${secondary.architecture[0] ?? secondary.intelligence}` : "",
        "",
        "## What Stands Out",
        "- The systems are designed for visible state, traceability, and controllable behavior.",
        "- Runtime constraints and product usability are handled as part of the architecture.",
        evidenceLine
      ]
        .filter(Boolean)
        .join("\n");
    case "project":
      return lead ? composeProjectBrief(lead) : "## Project Read\nNo matching project signal was found strongly enough from the current question.";
    case "capability":
      return [
        "## Capability Read",
        `${brandProfile.name} looks strongest in applied AI product engineering: full-stack delivery, voice and chat interfaces, local runtime thinking, and agentic workflow design.`,
        "",
        "## Best Proof",
        `- ${lead?.title ?? "Algsoch"}: ${lead?.whyItMatters ?? ""}`,
        secondary ? `- ${secondary.title}: ${secondary.whyItMatters}` : "",
        "",
        "## What That Suggests",
        "- He can turn AI capability into usable systems rather than isolated demos.",
        "- He thinks in workflows, state, interfaces, and runtime behavior together.",
        evidenceLine
      ]
        .filter(Boolean)
        .join("\n");
  }
}

function composeBestProjectAnswer(query: string) {
  const ranked = recommendRepositoriesForQuery(query);
  const winner = ranked[0] ?? getTopRepository();
  const runnersUp = ranked.slice(1, 4);
  const accountMap = getAccountProjectMap();

  if (!winner) {
    return null;
  }

  return [
    "## Verdict",
    `${winner.title} is the strongest overall GitHub project signal for Vicky Kumar.`,
    ``,
    `${winner.overview} It is hosted under @${winner.account}.`,
    ``,
    "## Why It Wins",
    `- ${winner.whyItMatters}`,
    `- It ranks highest on combined execution depth, AI depth, product signal, and completeness.`,
    `- It is especially strong for ${winner.bestFor.slice(0, 3).join(", ")}.`,
    ``,
    "## Other High-Signal Repositories",
    ...runnersUp.map(
      (repository) =>
        `- ${repository.title} (@${repository.account}): ${repository.overview}`
    ),
    ``,
    "## GitHub Account Map",
    `- @fiscalmindset: ${accountMap.fiscalmindset.join(", ")}.`,
    `- @algsoch: ${accountMap.algsoch.join(", ")}.`,
    ``,
    "## Bottom Line",
    `If the question is “which single GitHub project best represents Vicky Kumar overall today?”, the answer should be ${winner.title}. CommandBrain still remains one of the strongest historical technical signals, but Algsoch is the clearest flagship product signal.`
  ].join("\n");
}

function composeFallbackAnswer(query: string, mode: AgentIntent, systems: string[], evidenceTitles: string[]) {
  if (mode === "project" || isBestProjectQuestion(query)) {
    const bestProjectAnswer = composeBestProjectAnswer(query);
    if (bestProjectAnswer) {
      return bestProjectAnswer;
    }
  }

  const ruleBasedSignals = extractPortfolioSignals(query, systems);
  const ruleBasedAnswer = composeRuleBasedAnswer(query, mode, ruleBasedSignals, evidenceTitles);

  if (ruleBasedAnswer) {
    return ruleBasedAnswer;
  }

  return "## Brief\nThe current rule-based portfolio engine did not find a stronger direct pattern for that exact question, but the portfolio still suggests strong overlap across software engineering, applied AI, workflow design, and product execution.";
}

function buildGroundedPrompt(query: string, mode: AgentIntent, systems: string[], evidence: ReturnType<typeof retrieveEvidence>) {
  const evidenceBlock = evidence
    .map(
      (entry, index) =>
        `${index + 1}. ${entry.title}: ${entry.summary}\nEvidence: ${entry.evidence.map((point) => `- ${point}`).join("\n")}`
    )
    .join("\n\n");

  const systemList = systems.length ? systems.join(", ") : "portfolio-wide evidence";
  const repositoryBlock = buildRepositoryBlock(query);
  const accountBlock = githubAccounts
    .map((account) => `- @${account.handle}: ${account.overview} Featured: ${account.featuredProjects.join(", ")}.`)
    .join("\n");
  const formattingInstructions =
    mode === "project" || isBestProjectQuestion(query)
      ? [
          "- Format with markdown sections exactly named: `## Verdict`, `## Why It Wins`, `## Other High-Signal Repositories`, `## GitHub Account Map`, `## Bottom Line`.",
          "- Name one winning project clearly in the first sentence.",
          "- State which GitHub account hosts it.",
          "- Mention that Algsoch and Algsoch News are in fiscalmindset, while CommandBrain, SpeakAI, and most remaining repositories are in algsoch."
        ]
      : [
          "- Format with markdown sections and bullet lists where useful.",
          "- Keep the answer structured and skimmable."
        ];

  return [
    `You are Ask Vicky, a portfolio briefing assistant for ${brandProfile.name}.`,
    "Answer only from the provided evidence. If information is missing, say that directly.",
    `Audience mode: ${modeLabels[mode]}.`,
    `Focus systems: ${systemList}.`,
    `User question: ${query}`,
    "",
    "Portfolio framing:",
    `- Brand: ${brandProfile.brand} (${brandProfile.brandMeaning})`,
    `- Positioning: ${brandProfile.statement}`,
    `- Supporting context: ${brandProfile.supporting}`,
    "",
    "GitHub account map:",
    accountBlock,
    "",
    "Repository ranking context:",
    repositoryBlock,
    "",
    "Evidence:",
    evidenceBlock,
    "",
    "Response requirements:",
    "- Use a calm, precise, high-trust tone.",
    "- Prioritize engineering depth, product maturity, and applied AI capability.",
    "- Do not invent facts beyond the provided evidence."
  ]
    .concat(formattingInstructions)
    .join("\n");
}

function resolveInferenceOrder(inferenceMode: AgentInferenceMode, hasRuntime: boolean) {
  if (inferenceMode === "groq") {
    return ["groq", hasRuntime ? "local" : "fallback", "fallback"] as const;
  }

  if (inferenceMode === "local") {
    return [hasRuntime ? "local" : "fallback", "groq", "fallback"] as const;
  }

  if (inferenceMode === "fallback") {
    return ["fallback"] as const;
  }

  return [hasRuntime ? "local" : "groq", hasRuntime ? "groq" : "fallback", "fallback"] as const;
}

export async function answerPortfolioQuestion({
  query,
  mode,
  inferenceMode = "auto",
  runtime,
  onToken
}: AgentRequest): Promise<AgentResponse> {
  const detectedMode = detectIntent(query, mode);
  const evidence = retrieveEvidence(query);
  const fallbackEvidence = evidence.length ? evidence : knowledgeEntries.slice(0, 3);
  const systems = inferSystems(query, fallbackEvidence.map((entry) => entry.id));
  const reasoning = buildReasoning(detectedMode, systems);
  const followUps = buildFollowUps(detectedMode, systems);
  const recommendedSystems = systems.length ? systems : featuredSystems.slice(0, 3).map((system) => system.title);

  const fallbackAnswer = composeFallbackAnswer(
    query,
    detectedMode,
    recommendedSystems,
    fallbackEvidence.map((entry) => entry.title)
  );
  const groundedPrompt = buildGroundedPrompt(query, detectedMode, recommendedSystems, fallbackEvidence);
  const inferenceOrder = resolveInferenceOrder(inferenceMode, Boolean(runtime));
  const deterministicProjectAnswer = isBestProjectQuestion(query) ? composeBestProjectAnswer(query) : null;

  if (deterministicProjectAnswer) {
    onToken?.(deterministicProjectAnswer);
    return {
      mode: detectedMode,
      modeLabel: modeLabels[detectedMode],
      answer: deterministicProjectAnswer,
      usedLocalModel: false,
          provider: "fallback",
          providerLabel: "Rule-Based GitHub Ranking",
      providerModel: null,
      recommendedSystems,
      evidence: fallbackEvidence.map((entry) => ({ title: entry.title, summary: entry.summary })),
      reasoning: [
        ...reasoning,
        "Used the deterministic GitHub ranking path so the answer names one winner, shows why, and preserves the correct account map."
      ],
      followUps
    };
  }

  for (const provider of inferenceOrder) {
    if (provider === "groq") {
      try {
        const result = await generateWithGroq(
          groundedPrompt,
          {
            maxTokens: 320,
            temperature: 0.3
          },
          (next) => onToken?.(next)
        );

        return {
          mode: detectedMode,
          modeLabel: modeLabels[detectedMode],
          answer: result.text,
          usedLocalModel: false,
          provider: "groq",
          providerLabel: "Groq Test Path",
          providerModel: result.model,
          recommendedSystems,
          evidence: fallbackEvidence.map((entry) => ({ title: entry.title, summary: entry.summary })),
          reasoning: [
            ...reasoning,
            "Final phrasing was generated through the Groq testing path with grounded portfolio evidence."
          ],
          followUps
        };
      } catch {
        continue;
      }
    }

    if (provider === "local" && runtime) {
      try {
        const result = await runtime.generate(
          groundedPrompt,
          {
            maxTokens: 260,
            temperature: 0.3
          },
          (next) => onToken?.(next)
        );

        return {
          mode: detectedMode,
          modeLabel: modeLabels[detectedMode],
          answer: result.text,
          usedLocalModel: true,
          provider: "local",
          providerLabel: "RunAnywhere Local",
          providerModel: null,
          recommendedSystems,
          evidence: fallbackEvidence.map((entry) => ({ title: entry.title, summary: entry.summary })),
          reasoning: [
            ...reasoning,
            "Final phrasing was generated inside the browser-local RunAnywhere runtime."
          ],
          followUps
        };
      } catch {
        continue;
      }
    }

    if (provider === "fallback") {
      onToken?.(fallbackAnswer);
      break;
    }
  }

  return {
    mode: detectedMode,
    modeLabel: modeLabels[detectedMode],
    answer: fallbackAnswer,
    usedLocalModel: false,
    provider: "fallback",
    providerLabel: "Rule-Based Portfolio Engine",
    providerModel: null,
    recommendedSystems,
    evidence: fallbackEvidence.map((entry) => ({ title: entry.title, summary: entry.summary })),
    reasoning: [...reasoning, "Returned the deterministic portfolio synthesis path because no live inference provider succeeded."],
    followUps
  };
}

export const agentCapabilitySummary = {
  philosophy: philosophyStatements.map((statement) => statement.title),
  suggestedQuestions
};
