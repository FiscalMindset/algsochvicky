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
  recruiter: ["hire", "role", "candidate", "engineer", "team", "fit", "experience", "resume", "job", "background", "work", "skill", "strength", "hiring", "interview", "recruiter", "employment"],
  client: ["client", "build", "product", "startup", "company", "deliver", "engagement", "commission", "freelance", "consult", "contract", "agency", "outsource", "need", "solution"],
  technical: ["architecture", "stack", "system", "agent", "runtime", "compare", "implementation", "design", "pattern", "pipeline", "deploy", "integration", "layer", "backend", "frontend", "database", "api", "infrastructure", "performance"],
  project: ["project", "commandbrain", "speakai", "algsoch", "news", "portfolio", "careops", "github", "repository", "repo", "code", "case study", "demo", "showcase", "build"],
  capability: ["ai", "agentic", "voice", "chat", "on-device", "workflow", "local", "multimodal", "llm", "machine learning", "deep learning", "nlp", "inference", "automation", "intelligence", "capability"]
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
  const queryLower = query.toLowerCase();

  const scored = knowledgeEntries
    .map((entry) => {
      const entryText = [entry.title, entry.summary, ...entry.evidence, ...entry.tags, ...entry.relatedSystems]
        .join(" ")
        .toLowerCase();

      const exactMatch = queryTokens.filter((t) => entryText.includes(t)).length;
      const tagMatch = entry.tags.filter((t) => queryTokens.some((qt) => t.includes(qt) || qt.includes(t))).length * 2;
      const systemMatch = entry.relatedSystems.filter((s) => queryTokens.some((qt) => s.includes(qt) || qt.includes(s))).length * 3;
      const bigramMatch = queryTokens.reduce((sum, t, i) => {
        if (i === 0) return sum;
        const bigram = queryTokens[i - 1] + " " + t;
        return sum + (entryText.includes(bigram) ? 5 : 0);
      }, 0);

      const score = exactMatch + tagMatch + systemMatch + bigramMatch;

      return { entry, score };
    })
    .sort((left, right) => right.score - left.score);

  const top = scored.filter((item) => item.score > 0);
  if (top.length < 2) {
    return scored.slice(0, 3).map((item) => item.entry);
  }
  return top.slice(0, 4).map((item) => item.entry);
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

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, count: number): T[] {
  const result: T[] = [];
  const copy = [...arr];
  for (let i = 0; i < Math.min(count, copy.length); i++) {
    const idx = (seed + i * 7) % copy.length;
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function buildFollowUps(mode: AgentIntent, systems: string[], query: string) {
  const seed = simpleHash(query);

  const base =
    systems[0] && systems[1]
      ? seed % 2 === 0
        ? [`Compare ${systems[0]} and ${systems[1]} in more detail.`]
        : [`How does ${systems[0]} compare to ${systems[1]}?`]
      : systems[0]
        ? seed % 2 === 0
          ? [`Go deeper on how ${systems[0]} was architected.`]
          : [`What tech stack does ${systems[0]} use?`]
        : [];

  const modePrompts: Record<AgentIntent, string[]> = {
    recruiter: [
      "Which project is the strongest hiring signal for an AI engineer role?",
      "How does Vicky balance engineering depth with product thinking?",
      "What makes his Coral MCP contributions stand out?",
      "What is his technical background and experience level?",
      "Which project shows the best engineering depth?",
      "What is Vicky's strongest skill as an engineer?"
    ],
    client: [
      "If I need an AI-native product, where would Vicky start?",
      "Which system best proves he can build something client-facing and real?",
      "Has he built anything like my use case before?",
      "What is his delivery process for new projects?",
      "Can he handle end-to-end product development?",
      "How does he approach building for real users?"
    ],
    technical: [
      "How does he separate interface, agent, and execution layers?",
      "What shows runtime integration or local inference capability most clearly?",
      "How does he handle multi-agent orchestration versus single LLM calls?",
      "What are the key architectural patterns across his systems?",
      "How does he think about state and traceability?",
      "What distinguishes his architecture approach?"
    ],
    project: [
      "What is Vicky Kumar's best project across both GitHub accounts, and why?",
      "Which project best represents his flagship product thinking?",
      "What makes CommandBrain different from a normal AI assistant?",
      "Tell me about CareOps and how it uses Coral SQL.",
      "How does Algsoch News pipeline work from article to video?",
      "Why is Algsoch considered the flagship project?"
    ],
    capability: [
      "How does Vicky turn AI into usable systems rather than demos?",
      "Which work best demonstrates on-device or runtime-aware AI thinking?",
      "What is his experience with ML beyond LLMs?",
      "Can he build voice or multimodal AI products?",
      "What AI capabilities does he have beyond chatbots?",
      "Does he have experience with on-device inference?"
    ]
  };

  const modeList = modePrompts[mode];
  const picked = pick(modeList, seed, 3 - base.length);
  return [...base, ...picked].slice(0, 3);
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
    `- **${left.title}**: ${left.architecture[0] ?? left.intelligence}`,
    `- **${right.title}**: ${right.architecture[0] ?? right.intelligence}`,
    "",
    "## Why Each Matters",
    `- **${left.title}**: ${left.whyItMatters}`,
    `- **${right.title}**: ${right.whyItMatters}`,
    "",
    "## Best Use Case",
    `- Choose **${left.title}** when you want ${left.problem.toLowerCase()}.`,
    `- Choose **${right.title}** when you want ${right.problem.toLowerCase()}.`,
    "",
    "## Technical Signal",
    `- **${left.title}** (${left.account}): ${left.summary}`,
    `- **${right.title}** (${right.account}): ${right.summary}`
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

function formatSignalList(signals: (PortfolioSignal | null)[]): string {
  return signals.filter(Boolean).map((s, i) => {
    const signal = s!;
    return `${i + 1}. **${signal.title}** (@${signal.account}) — ${signal.summary}`;
  }).join("\n");
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
        `${brandProfile.name} is strongest for roles that sit between software engineering, applied AI, and product execution. 107+ public repos across two GitHub accounts (${githubAccounts.map((a) => "@" + a.handle).join(", ")}) with a clear flagship focus on Algsoch.`,
        "",
        "## Best Proof",
        ...(signals.length > 0 ? [formatSignalList(signals.slice(0, 3))] : []),
        "- **Coral MCP**: 16+ merged PRs showing real open-source collaboration under code review.",
        "- **Full-stack range**: Android (Kotlin), Web (React/TypeScript), Backend (Python/FastAPI), ML pipelines.",
        "- Portfolio consistently shows interfaces, runtime logic, and workflow design working together.",
        "",
        "## Why That Matters",
        "- Ships AI-native product work end to end — not limited to prompt experiments.",
        "- Strongest signal is product maturity under technical constraint.",
        "- Works across mobile, web, voice, and ML domains — not siloed in one stack.",
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
        ...(signals.length > 0 ? [formatSignalList(signals.slice(0, 3))] : []),
        "- **CareOps**: Healthcare coordination across 9 data sources — real multi-source integration.",
        "- **SpeakAI**: Voice product with local inference — focused use case, not generic assistant.",
        "- **Algsoch News**: Full media pipeline from article URL to rendered video.",
        "",
        "## Delivery Approach",
        "- Works in iterative, visible stages — workflow design before model integration.",
        "- Products are designed to ship: each project has working demos, APKs, or deployed URLs.",
        "- Treats product surfaces as part of the engineering job, not an afterthought.",
        evidenceLine
      ]
        .filter(Boolean)
        .join("\n");
    case "technical":
      return [
        "## Technical Read",
        `${brandProfile.name} approaches AI systems as layered software: interface → agent → intelligence → execution → product. Each layer has a distinct job with clear boundaries.`,
        "",
        "## Strongest Technical Proof",
        ...(signals.length > 0 ? [formatSignalList(signals.slice(0, 3))] : []),
        "- **Algsoch News**: Five-agent pipeline with visible orchestration, retry routing, and structured output.",
        "- **CareOps**: 9-source Coral SQL JOIN with 22 passing tests.",
        "- **RunAnywhere SDK**: On-device inference across Android and WebAssembly runtimes.",
        "",
        "## Architecture Pattern",
        "- Systems separate interface, routing, intelligence, and execution into distinct concerns.",
        "- Runtime-aware design: local inference, model caching, download lifecycle, and progressive activation.",
        "- Visible state and traceability built in — not bolted on after the fact.",
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
        "## AI Capabilities",
        `- **On-Device AI**: RunAnywhere SDK on Android (SmolLM2, SmolVLM) and browser (llama.cpp WASM).`,
        `- **Voice Systems**: Browser speech + local inference in SpeakAI with offline practice workflow.`,
        `- **Agent Workflows**: Multi-agent pipelines (Algsoch News) with visible orchestration and retry routing.`,
        `- **Chat Systems**: Grounded conversational products with evidence-backed responses (this portfolio agent).`,
        `- **ML Systems**: CNN pipelines (brain tumor), XGBoost with SHAP (disease detection), feature engineering.`,
        `- **Full-Stack AI**: Android, React, FastAPI — full delivery surface, not just model integration.`,
        "",
        "## Best Proof",
        ...(signals.length > 0 ? [formatSignalList(signals.slice(0, 3))] : []),
        "",
        "## What That Suggests",
        "- Turns AI capability into usable systems rather than isolated demos.",
        "- Thinks in workflows, state, interfaces, and runtime behavior together.",
        "- Has breadth across mobile AI, voice AI, agent pipelines, and traditional ML.",
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
    `You are Ask Vicky, a portfolio briefing assistant for ${brandProfile.name}. You write concise, substantive portfolio briefings.`,
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
    "- Lead with a direct answer to the question in the first sentence.",
    "- Prioritize engineering depth, product maturity, and applied AI capability.",
    "- Use specific project names and technical details from the evidence.",
    "- Structure with markdown sections (## headings) and bullet lists.",
    "- Keep responses thorough but concise — 3-6 paragraphs typically.",
    "- Do not invent facts beyond the provided evidence."
  ]
    .concat(formattingInstructions)
    .join("\n");
}

function buildLocalPrompt(query: string, mode: AgentIntent, systems: string[], evidence: ReturnType<typeof retrieveEvidence>) {
  const evidenceBlock = evidence
    .map((entry) => `${entry.title}: ${entry.summary}`)
    .join("\n");

  const systemHint = systems.length ? `Mention these projects: ${systems.join(", ")}.` : "";

  return [
    `Answer briefly in 2-3 paragraphs. Use ## headings.`,
    `Mode: ${modeLabels[mode]}.`,
    systemHint,
    `Question: ${query}`,
    ``,
    `Evidence:`,
    evidenceBlock,
    ``,
    `Answer (2-3 paragraphs, ## headings):`
  ].filter(Boolean).join("\n");
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
  const followUps = buildFollowUps(detectedMode, systems, query);
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
          maxTokens: 512,
          temperature: 0.4
        },
        (next) => onToken?.(next)
      );

      return {
        mode: detectedMode,
        modeLabel: modeLabels[detectedMode],
        answer: result.text,
        usedLocalModel: false,
        provider: "groq",
        providerLabel: "Groq",
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
        const localPrompt = buildLocalPrompt(query, detectedMode, recommendedSystems, fallbackEvidence);
        const result = await runtime.generate(
          localPrompt,
          {
          maxTokens: 300,
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
