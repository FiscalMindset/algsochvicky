export type NavItem = {
  id: string;
  label: string;
};

export type CapabilitySignal = {
  title: string;
  detail: string;
};

export type SystemLink = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary";
};

export type SystemAudienceFit = {
  title: string;
  detail: string;
};

export type FeaturedSystem = {
  id: string;
  title: string;
  shorthand: string;
  thesis: string;
  summary: string;
  problem: string;
  significance: string;
  intelligence: string;
  layers: string[];
  stack: string[];
  architecture: string[];
  outcomes: string[];
  deliverables: string[];
  audienceFit: SystemAudienceFit[];
  themes: string[];
  accent: string;
  signals: string[];
  links: SystemLink[];
};

export type ArchitectureLayer = {
  id: string;
  label: string;
  headline: string;
  description: string;
  modules: string[];
  outputs: string[];
};

export type BuildMode = {
  id: string;
  title: string;
  summary: string;
  interfacePattern: string;
  outputStyle: string;
  architectureFlow: string[];
  technologies: string[];
  relevantSystems: string[];
};

export type ContactDetail = {
  label: string;
  value: string;
  href: string;
};

export type AudienceRoute = {
  id: string;
  title: string;
  question: string;
  summary: string;
  proof: string;
  href: string;
  cta: string;
};

export type ConversionPath = {
  id: string;
  title: string;
  lead: string;
  detail: string;
  proof: string;
  href: string;
  cta: string;
};

export type KnowledgeEntry = {
  id: string;
  title: string;
  type: "profile" | "project" | "architecture" | "philosophy" | "github";
  summary: string;
  evidence: string[];
  tags: string[];
  relatedSystems: string[];
};

export type GitHubAccount = {
  handle: string;
  role: string;
  note: string;
  overview: string;
  tags: string[];
  featuredProjects: string[];
  href: string;
  avatarUrl: string;
  avatarNote: string;
  status: "primary" | "legacy";
};

export type RepositorySignal = {
  id: string;
  title: string;
  account: string;
  synopsis: string;
  overview: string;
  whyItMatters: string;
  bestFor: string[];
  repoUrl?: string;
  demoUrl?: string;
  highlights?: string[];
  themes: string[];
  featured: boolean;
  completeness: number;
  executionDepth: number;
  aiDepth: number;
  productSignal: number;
  recencySignal: number;
};

export const brandProfile = {
  name: "Vicky Kumar",
  brand: "Algsoch",
  brandMeaning: "Keep Building",
  portraitUrl: "/images/vicky-kumar.png",
  statement:
    "AI engineer who solves problems with code. Building AI-powered products, contributing to open source, and shipping useful tools.",
  supporting:
    "Focused on browser AI, multi-agent systems, and production-ready applications. 12 PRs merged to Coral MCP."
};

export const contactDetails: ContactDetail[] = [
  {
    label: "Resume",
    value: "vicky_software_engineer.pdf",
    href: "/docs/vicky_software_engineer.pdf"
  },
  {
    label: "Email",
    value: "npdimagine@gmail.com",
    href: "mailto:npdimagine@gmail.com"
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/algsoch",
    href: "https://www.linkedin.com/in/algsoch"
  },
  {
    label: "GitHub / algsoch",
    value: "github.com/algsoch",
    href: "https://www.github.com/algsoch"
  },
  {
    label: "GitHub / fiscalmindset",
    value: "github.com/fiscalmindset",
    href: "https://www.github.com/fiscalmindset"
  }
];

export const contactTags = [
  "AI-Native Product Engineering",
  "Agentic Workflows",
  "Voice + Chat Systems",
  "On-Device / Local AI",
  "Runtime Integrations",
  "Full-Stack Delivery"
] as const;

export const contactScenarios = [
  {
    title: "AI-native product builds",
    detail: "Interface design, system architecture, orchestration, and delivery in one execution path."
  },
  {
    title: "Voice or chat systems",
    detail: "Usable conversational products with runtime-aware behavior, not shallow wrappers."
  },
  {
    title: "Local intelligence workflows",
    detail: "On-device activation, model lifecycle, caching, privacy, and operator-facing control surfaces."
  }
] as const;

export const audienceRoutes: AudienceRoute[] = [
  {
    id: "founder",
    title: "Founder / Cofounder",
    question: "Can Vicky turn AI into a serious product, not just a feature demo?",
    summary: "Start with the flagship product path and see how on-device AI, UX, and product thinking come together in one shipped system.",
    proof: "Best proof: Algsoch",
    href: "/?system=algsoch",
    cta: "Open flagship case study"
  },
  {
    id: "recruiter",
    title: "Recruiter / Hiring Team",
    question: "Is there enough proof for a real software engineer or AI engineer role?",
    summary: "Follow the strongest hiring signals first: current flagship product quality, historical command-system depth, and a curated GitHub read.",
    proof: "Best proof: Algsoch + GitHub Intelligence",
    href: "/#github",
    cta: "View hiring signal"
  },
  {
    id: "client",
    title: "Client / Product Lead",
    question: "What can he actually build for my product, workflow, or use case?",
    summary: "Use the build-mode surfaces to match chat, voice, automation, local AI, or agent workflows to a real delivery path.",
    proof: "Best proof: Build Modes + Ask Vicky",
    href: "/#build-modes",
    cta: "See build modes"
  },
  {
    id: "technical-reviewer",
    title: "Technical Reviewer",
    question: "Is there real architecture depth behind the visual presentation?",
    summary: "Go straight to the detailed system pages and inspect workflow boundaries, runtime choices, and implementation layers.",
    proof: "Best proof: CommandBrain case study",
    href: "/?system=commandbrain",
    cta: "Inspect architecture"
  }
];

export const conversionPaths: ConversionPath[] = [
  {
    id: "founder",
    title: "Founder",
    lead: "You need someone who can shape the product and ship the intelligence layer.",
    detail: "This is the right fit when the problem is bigger than a chatbot and needs product judgment, interface design, orchestration, and engineering execution working together.",
    proof: "Best entry: Algsoch and Algsoch News",
    href: "/?system=algsoch",
    cta: "See flagship build"
  },
  {
    id: "client",
    title: "Client",
    lead: "You need a usable AI workflow, voice experience, local tool, or serious chat product.",
    detail: "The work is strongest where there is a real workflow to design, a runtime to control, and an interface people actually need to trust and use.",
    proof: "Best entry: Build Modes and Ask Vicky",
    href: "/#agent",
    cta: "Ask about your use case"
  },
  {
    id: "recruiter",
    title: "Recruiter",
    lead: "You need fast evidence of engineering depth, AI capability, and product maturity.",
    detail: "The portfolio is curated to surface flagship product work first, then historical technical signal, rather than hiding the strongest proof inside a noisy repo list.",
    proof: "Best entry: GitHub Intelligence and system case studies",
    href: "/#github",
    cta: "Review hiring signal"
  },
  {
    id: "technical",
    title: "Technical Interviewer",
    lead: "You want architecture, tradeoffs, and real implementation proof.",
    detail: "The case-study pages expose runtime layers, architecture choices, stack, workflow design, and why each project matters beyond a visual impression.",
    proof: "Best entry: CommandBrain and Algsoch News",
    href: "/?system=commandbrain",
    cta: "Open technical proof"
  }
];

export const navItems: NavItem[] = [
  { id: "hero", label: "Overview" },
  { id: "skills", label: "Skills" },
  { id: "systems", label: "Projects" },
  { id: "architecture", label: "Architecture" },
  { id: "build-modes", label: "What I Build" },
  { id: "runtime", label: "Local AI" },
  { id: "agent", label: "Ask Vicky" },
  { id: "github", label: "GitHub" },
  { id: "philosophy", label: "Philosophy" },
  { id: "contact", label: "Contact" }
];

export const capabilitySignals: CapabilitySignal[] = [
  {
    title: "Full-Stack Systems",
    detail: "Interfaces, APIs, orchestration, data flow, and product delivery."
  },
  {
    title: "AI Chat Systems",
    detail: "Grounded conversational products with usable control surfaces."
  },
  {
    title: "Agentic Workflows",
    detail: "Task routing, execution layers, structured outputs, and human checkpoints."
  },
  {
    title: "Runtime Integrations",
    detail: "Model lifecycle, tool bridges, browser runtime constraints, and delivery quality."
  },
  {
    title: "Voice + Chat Interfaces",
    detail: "Speech-driven interaction with system-grade orchestration behind it."
  },
  {
    title: "On-Device AI",
    detail: "Local inference, privacy-aware UX, caching, and progressive activation."
  },
  {
    title: "Product-Grade Engineering",
    detail: "Architectures meant to ship, scale, and be understood by real users."
  }
];

export const featuredSystems: FeaturedSystem[] = [
  {
    id: "algsoch",
    title: "Algsoch",
    shorthand: "Offline Android study companion with local AI",
    thesis:
      "An Android study companion with 7 learning modes, local chat history, and fully offline RunAnywhere SDK inference.",
    summary:
      "The current Algsoch repo is an Android/Kotlin product built around offline education. It uses SmolLM2 and SmolVLM through RunAnywhere SDK, supports seven learning modes, stores data locally, and is designed as a privacy-first mobile AI app rather than a web landing page concept.",
    problem:
      "Most study assistants depend on cloud inference and weak privacy guarantees. Algsoch pushes the opposite direction: on-device inference, zero tracking, local storage, and learning-mode-driven UX.",
    significance:
      "This was my first major project integrating local AI models into a mobile app. Shows Android development skills, on-device AI understanding, and privacy-focused product thinking.",
    intelligence:
      "On-device language and vision assistance, mode-based prompt shaping, local chat history, and adaptive study workflows.",
    layers: [
      "Jetpack Compose mobile interface",
      "Seven learning-mode prompt system",
      "RunAnywhere model management and inference",
      "Local storage and private study history"
    ],
    stack: ["Android", "Kotlin", "Jetpack Compose", "RunAnywhere SDK", "SmolLM2", "SmolVLM"],
    architecture: [
      "RunAnywhere initializes and manages local model download, caching, and inference on device.",
      "The app routes user questions through seven learning modes with different instructional behavior.",
      "All conversations and learning state stay on the device without cloud processing."
    ],
    outcomes: [
      "First Android app with on-device AI integration.",
      "Learned Kotlin, Jetpack Compose, and model lifecycle management.",
      "Built a complete privacy-first mobile AI product."
    ],
    deliverables: ["Android app", "On-device inference", "Seven-mode learning UX", "Private local-first experience"],
    audienceFit: [
      {
        title: "For founders",
        detail: "Best proof that Vicky can shape a full product, not just integrate an API."
      },
      {
        title: "For recruiters",
        detail: "Strongest overall signal of current engineering maturity, Android execution, and AI product quality."
      },
      {
        title: "For clients",
        detail: "Shows how privacy, product usability, and AI capability can be designed as one system."
      }
    ],
    themes: ["Full-Stack Products", "Interfaces", "AI Systems"],
    accent: "from-white/15 via-white/5 to-transparent",
    signals: ["RunAnywhere SDK", "Android offline AI", "7 learning modes"],
    links: [
      { label: "Repository", href: "https://github.com/FiscalMindset/algsoch", variant: "primary" },
      { label: "APK Releases", href: "https://github.com/FiscalMindset/algsoch/releases", variant: "secondary" },
      { label: "YouTube Demo", href: "https://www.youtube.com/shorts/T09FWf5gFew", variant: "secondary" }
    ]
  },
  {
    id: "speakai",
    title: "SpeakAI",
    shorthand: "RunAnywhere-powered local English practice",
    thesis:
      "A RunAnywhere-powered English speaking practice app with browser speech, personality modes, and one-time local model download.",
    summary:
      "SpeakAI is not a generic voice demo. The repo positions it as local English practice with browser speech, optional on-device model download, personality and practice modes, and text-plus-voice responses without API keys or server dependency.",
    problem:
      "Speaking tools often depend on cloud APIs or stop at speech-to-text novelty. SpeakAI is built to make voice practice private, local, and usable with a clear model-download flow.",
    significance:
      "This is strong proof of on-device voice UX thinking: browser speech, model caching, local inference, and a focused practice product rather than an unfocused assistant.",
    intelligence:
      "Speech-driven interaction, on-device model inference, practice-mode prompting, and local cached model workflows.",
    layers: [
      "Browser speech input",
      "Practice mode and personality selection",
      "Optional local model download and cache",
      "Text plus voice response loop"
    ],
    stack: ["React", "TypeScript", "RunAnywhere Web SDK", "llama.cpp WASM", "Web Speech API"],
    architecture: [
      "Users can skip model download and use browser speech immediately or download a local model once for offline use.",
      "The model is cached in the browser after the first download so practice can continue without repeated setup.",
      "Speech, transcript, and local AI reply are presented as one practice workflow."
    ],
    outcomes: [
      "Shows a concrete voice AI product rather than a generic assistant.",
      "Demonstrates local model download UX and reuse.",
      "Proves browser-based, privacy-respecting voice practice design."
    ],
    deliverables: ["Voice-first interface", "Browser speech workflow", "On-device model activation", "Offline practice UX"],
    audienceFit: [
      {
        title: "For clients",
        detail: "Shows a usable voice experience, not only speech recognition or prompt glue."
      },
      {
        title: "For recruiters",
        detail: "Proves multimodal thinking across browser APIs, local runtime, and conversation design."
      },
      {
        title: "For product leads",
        detail: "Strong proof that Vicky can make AI interaction feel focused and intentional."
      }
    ],
    themes: ["Voice / Chat / Agentic", "Interfaces", "AI Systems"],
    accent: "from-sky-400/20 via-accent/10 to-transparent",
    signals: ["RunAnywhere Web SDK", "Browser speech", "Offline voice practice"],
    links: [
      { label: "Repository", href: "https://github.com/algsoch/speakai", variant: "primary" },
      { label: "Live Demo", href: "https://speakai-af1l.onrender.com/", variant: "secondary" },
      { label: "YouTube Demo", href: "https://www.youtube.com/shorts/KPWbz52uyuo", variant: "secondary" }
    ]
  },
  {
    id: "careops",
    title: "CareOps",
    shorthand: "Coral-powered family healthcare coordination agent",
    thesis:
      "A family healthcare coordination agent that joins 9 medical data sources through Coral SQL into a single operations view.",
    summary:
      "CareOps is a healthcare coordination agent built with Next.js and Coral MCP. It queries 9 medical data sources — patients, medications, lab reports, doctor chats, pharmacy receipts, symptom logs, appointments, prescription OCR, and family notes — through a single Coral-powered interface.",
    problem:
      "Family healthcare data is scattered across doctors, labs, pharmacies, and chat logs with no unified view. CareOps solves this by using Coral SQL to cross-reference all sources into a coordinated care timeline.",
    significance:
      "Shows practical healthcare AI application with real data-source integration. Demonstrates ability to build multi-source medical coordination products using Coral's semantic SQL layer.",
    intelligence:
      "Multi-source data JOIN, semantic SQL querying, appointment and medication timeline synthesis, and cross-reference medical intelligence.",
    layers: [
      "Coral SQL multi-source JOIN layer",
      "Care coordination timeline",
      "Medication and appointment tracking",
      "Family member health profile"
    ],
    stack: ["Next.js", "TypeScript", "Coral MCP", "PostgreSQL", "Tailwind CSS", "Vercel"],
    architecture: [
      "Coral SQL queries 9 data sources simultaneously through a unified semantic schema.",
      "Results are cross-referenced into per-family-member care timelines.",
      "Medication, appointment, symptom, and lab data are surfaced through a coordination dashboard."
    ],
    outcomes: [
      "22 passing tests across careops and coral-cli integration.",
      "Shows production-grade Coral MCP integration with real healthcare workflows.",
      "Proves multi-source healthcare data coordination is buildable with semantic SQL."
    ],
    deliverables: ["Healthcare coordination agent", "9-source data JOIN", "Care timeline UI", "Coral MCP integration"],
    audienceFit: [
      {
        title: "For founders",
        detail: "Proves Vicky can build serious multi-source data products using Coral's SQL layer."
      },
      {
        title: "For clients",
        detail: "Shows how scattered healthcare data can be unified into a single operations surface."
      },
      {
        title: "For technical reviewers",
        detail: "Demonstrates deep Coral MCP integration with multiple source JOINs and real test coverage."
      }
    ],
    themes: ["Healthcare AI", "Data Integration", "Agentic"],
    accent: "from-teal-400/20 via-accent/5 to-transparent",
    signals: ["Coral SQL", "9-source JOIN", "Care coordination"],
    links: [
      { label: "Repository", href: "https://github.com/FiscalMindset/careops", variant: "primary" },
      { label: "YouTube Demo", href: "https://www.youtube.com/watch?v=TAOyyIH2_rc", variant: "secondary" },
      { label: "Blog Post", href: "https://medium.com/@algsoch/how-i-built-careops-agent-with-coral-opencode-338d1238e6ae", variant: "secondary" }
    ]
  },
  {
    id: "algsoch-news",
    title: "Algsoch News",
    shorthand: "Multi-agent AI newsroom to screenplay and video",
    thesis:
      "A multi-agent newsroom that turns one public article URL into structured screenplay JSON, agent traces, and a rendered MP4 package.",
    summary:
      "Algsoch News is a full pipeline product, not a summarizer. The repo describes a five-agent workflow for article extraction, editorial shaping, visual packaging, QA routing, and final video generation with visible agent activity across the UI.",
    problem:
      "News automation is usually opaque and one-shot. Algsoch News makes the workflow explicit, reviewable, and broadcast-oriented from URL input to final rendered output.",
    significance:
      "It is one of the strongest proofs of visible multi-agent orchestration in the portfolio because the system exposes retries, agent roles, packaging logic, and production output artifacts.",
    intelligence:
      "Five-agent orchestration, article extraction, beat shaping, packaging logic, QA scoring, retry routing, and video generation.",
    layers: [
      "Article extraction agent",
      "News editor agent",
      "Visual packaging agent",
      "QA and retry agent",
      "Video generation agent"
    ],
    stack: ["FastAPI", "LangGraph", "React", "Render", "FFmpeg", "Agent orchestration"],
    architecture: [
      "One article URL enters a five-agent pipeline with explicit handoffs and visible workflow state.",
      "QA can route targeted retries back to editorial or packaging before final generation.",
      "Outputs include screenplay JSON, segment visuals, timings, and final MP4 rendering."
    ],
    outcomes: [
      "Shows serious visible agent orchestration, not a hidden one-shot call.",
      "Demonstrates AI workflow design tied to a real media output pipeline.",
      "Bridges extraction, editorial shaping, packaging, QA, and rendering in one product."
    ],
    deliverables: ["5-agent workflow", "Screenplay JSON", "Traceable orchestration", "Rendered MP4 output"],
    audienceFit: [
      {
        title: "For technical reviewers",
        detail: "Best proof of visible orchestration, retries, structured outputs, and pipeline design."
      },
      {
        title: "For clients",
        detail: "Shows Vicky can design a serious automation workflow around AI, not only a chat surface."
      },
      {
        title: "For founders",
        detail: "Demonstrates product-grade workflow thinking for media and operations-heavy use cases."
      }
    ],
    themes: ["AI Systems", "Tools", "News Automation", "Agentic"],
    accent: "from-amber-200/15 via-accent/5 to-transparent",
    signals: ["5-agent orchestration", "Visible workflow traces", "Broadcast output pipeline"],
    links: [
      { label: "Repository", href: "https://github.com/FiscalMindset/algsochnews", variant: "primary" },
      { label: "Live Demo", href: "https://algsochnews-1.onrender.com", variant: "secondary" }
    ]
  }
];

export const architectureLayers: ArchitectureLayer[] = [
  {
    id: "interface",
    label: "Interface Layer",
    headline: "Interfaces that make intelligence usable.",
    description:
      "Vicky treats interface design as part of the system architecture. The goal is not to wrap a model, but to create a surface that clarifies intent, state, trust, and action.",
    modules: ["Chat surfaces", "Voice controls", "Operator dashboards", "Command inputs"],
    outputs: ["User confidence", "Workflow clarity", "Interaction speed"]
  },
  {
    id: "agent",
    label: "Agent Layer",
    headline: "Routing, planning, and controllable action systems.",
    description:
      "The agent layer handles intent detection, project routing, response planning, and action sequencing. It turns inputs into structured execution paths instead of shallow completions.",
    modules: ["Intent routing", "Planner logic", "Mode-aware behavior", "Action boundaries"],
    outputs: ["Targeted responses", "Operational traceability", "Better task fit"]
  },
  {
    id: "intelligence",
    label: "Intelligence Layer",
    headline: "Grounded reasoning with structured context.",
    description:
      "This is where knowledge retrieval, prompt grounding, structured outputs, ranking, and response composition live. The emphasis is signal quality and fit to the problem.",
    modules: ["Knowledge retrieval", "Context ranking", "Structured output", "Response composition"],
    outputs: ["Better precision", "Reduced noise", "Project-aware synthesis"]
  },
  {
    id: "execution",
    label: "Execution Layer",
    headline: "Runtime integrations that do real work.",
    description:
      "Execution means models, tools, caches, downloads, local inference, and delivery mechanics. The system handles lifecycle, runtime constraints, and action-oriented behavior.",
    modules: ["Local model runtime", "Tool invocation", "Download lifecycle", "Progress feedback"],
    outputs: ["Reliable behavior", "Visible state", "Production readiness"]
  },
  {
    id: "product",
    label: "Product Layer",
    headline: "Usability, trust, and system coherence.",
    description:
      "The top layer is where engineering rigor becomes product maturity. It ensures the system feels intentional, understandable, and worth using beyond a demo.",
    modules: ["Experience design", "Trust signals", "Content architecture", "Operational polish"],
    outputs: ["Product quality", "Client confidence", "Adoption potential"]
  }
];

export const buildModes: BuildMode[] = [
  {
    id: "ai-chatbot",
    title: "AI Chatbot",
    summary: "Grounded chat systems with evidence-backed responses and usable interface patterns.",
    interfacePattern: "Context-aware conversation UI with signal panels and operator controls.",
    outputStyle: "Direct, structured, user-intent-aware answers.",
    architectureFlow: ["Input framing", "Intent detection", "Knowledge retrieval", "Response synthesis", "Feedback loop"],
    technologies: ["React", "Structured prompts", "Retrieval logic", "Streaming responses"],
    relevantSystems: ["CommandBrain", "Algsoch", "assistant_chatbot", "Kairon"]
  },
  {
    id: "voice-assistant",
    title: "Voice Assistant",
    summary: "Speech-first products with conversation orchestration and UI feedback quality.",
    interfacePattern: "Voice practice interface with transcript, mic controls, local model activation, and browser-speech fallback.",
    outputStyle: "Practice-oriented feedback with text plus voice responses.",
    architectureFlow: ["Speech input", "Mode selection", "Optional local model download", "Local response generation", "Voice feedback"],
    technologies: ["RunAnywhere Web SDK", "Web Speech API", "React", "Browser model caching"],
    relevantSystems: ["SpeakAI", "english_bot", "CommandBrain"]
  },
  {
    id: "agent-workflow",
    title: "Agent Workflow",
    summary: "Action-driven systems that plan, execute, and expose workflow progress clearly.",
    interfacePattern: "Command center UI with execution traces, checkpoints, and route summaries.",
    outputStyle: "Action plans, structured outputs, and transparent state transitions.",
    architectureFlow: ["Intent routing", "Planner layer", "Tool execution", "Trace display", "Review"],
    technologies: ["LangGraph", "Tool orchestration", "Execution logic", "State machines"],
    relevantSystems: ["Algsoch News", "careops", "autopr", "devalert", "Synapse-Graph"]
  },
  {
    id: "news-automation",
    title: "News Automation",
    summary: "Ranking, synthesis, and formatting workflows for signal-first publishing systems.",
    interfacePattern: "Editorial operations board with ranking, transformation, and output stages.",
    outputStyle: "Structured summaries and consistent delivery formats.",
    architectureFlow: ["Collection", "Filtering", "Ranking", "Summarization", "Distribution"],
    technologies: ["LangGraph", "FastAPI", "Automation pipelines", "FFmpeg"],
    relevantSystems: ["Algsoch News", "autopr"]
  },
  {
    id: "on-device-tool",
    title: "On-Device AI",
    summary: "Private, local-first interfaces powered by browser or device runtime models.",
    interfacePattern: "Runtime control panel with model state, download flow, and private local interaction.",
    outputStyle: "Offline-first answers with explicit runtime state and reuse behavior.",
    architectureFlow: ["Model registration", "Download and cache", "Load to runtime", "Local inference", "Release or reuse"],
    technologies: ["RunAnywhere Web SDK", "ONNX Runtime", "WebAssembly", "OPFS caching"],
    relevantSystems: ["Algsoch", "CommandBrain", "SpeakAI"]
  },
  {
    id: "educational-assistant",
    title: "Education AI",
    summary: "Systems that explain, compare, and adapt information for different audiences.",
    interfacePattern: "Guided explainer UI with examples, comparisons, and follow-up pathways.",
    outputStyle: "Audience-aware explanations with progressive depth.",
    architectureFlow: ["Intent detect", "Audience map", "Content retrieval", "Adaptive response", "Guided follow-up"],
    technologies: ["RunAnywhere SDK", "SmolLM2", "SmolVLM", "Prompt planning"],
    relevantSystems: ["Algsoch", "SpeakAI", "Cognivise", "english_bot"]
  },
  {
    id: "healthcare-ai",
    title: "Healthcare AI",
    summary: "Medical data coordination with safety guardrails and multi-source aggregation.",
    interfacePattern: "Care coordination dashboard with timeline synthesis and report generation.",
    outputStyle: "Structured medical summaries and visit-ready packets.",
    architectureFlow: ["Data aggregation", "Cross-source JOIN", "Timeline synthesis", "Guardrail check", "Packet generation"],
    technologies: ["Coral SQL", "Next.js", "TypeScript", "Medical data APIs"],
    relevantSystems: ["careops"]
  },
  {
    id: "ml-systems",
    title: "ML Systems",
    summary: "Machine learning systems from model training to interpretability analysis.",
    interfacePattern: "Research dashboard with visualization and causal analysis tools.",
    outputStyle: "Model predictions, interpretability reports, and diagnostic outputs.",
    architectureFlow: ["Data input", "Model inference", "Circuit tracing", "Causal ablation", "Governance tagging"],
    technologies: ["PyTorch", "FastAPI", "Next.js", "OpenMetadata", "Ollama"],
    relevantSystems: ["Synapse-Graph", "brain_tumor", "Cognivise"]
  }
];

export const githubAccounts: GitHubAccount[] = [
  {
    handle: "fiscalmindset",
    role: "Primary GitHub identity",
    note: "Current main account. This is where Algsoch and Algsoch News live today.",
    overview:
      "Use fiscalmindset for current flagship product identity and the newer applied-intelligence product surfaces.",
    tags: ["Current flagship", "Applied intelligence", "Android + on-device AI", "Agentic media systems"],
    featuredProjects: ["Algsoch", "Algsoch News"],
    href: "https://github.com/fiscalmindset",
    avatarUrl: "https://avatars.githubusercontent.com/u/254638087?v=4",
    avatarNote: "Avatar sourced from @FiscalMindset",
    status: "primary"
  },
  {
    handle: "algsoch",
    role: "Legacy GitHub identity",
    note: "Original account with the strongest historical engineering signal and largest repository count.",
    overview:
      "CommandBrain, SpeakAI, and most of the remaining meaningful repository history sit under algsoch. Contains 107 public repos with deep engineering projects.",
    tags: ["Command systems", "Voice AI", "ML systems", "Developer tooling", "Historical engineering depth"],
    featuredProjects: [
      "CommandBrain",
      "SpeakAI",
      "Brain Tumor Detection System",
      "AI Bid Writer Agent",
      "HTML Checker",
      "Silent Disease Detection Engine",
      "TDS Tool-Based Assistant"
    ],
    href: "https://github.com/algsoch",
    avatarUrl: "https://avatars.githubusercontent.com/u/158506810?v=4",
    avatarNote: "Avatar from @algsoch",
    status: "legacy"
  }
];

export const repositorySignals: RepositorySignal[] = [
  {
    id: "careops",
    title: "CareOps",
    account: "fiscalmindset",
    synopsis: "Coral-powered family healthcare coordination agent spanning 9 medical data sources.",
    overview:
      "A healthcare coordination agent built with Next.js, TypeScript, and Coral MCP that queries 9 data sources — patients, medications, lab reports, doctor chats, pharmacy receipts, symptom logs, appointments, prescription OCR, and family notes.",
    whyItMatters:
      "It proves Vicky can build multi-source data coordination products with real healthcare integration, 22 passing tests, and production-grade Coral MCP usage.",
    bestFor: ["Healthcare AI", "Data integration", "Coral MCP", "Multi-source JOIN"],
    repoUrl: "https://github.com/FiscalMindset/careops",
    highlights: [
      "9 medical data sources JOINed via Coral SQL",
      "Family care coordination timeline",
      "22 passing tests across careops and coral-cli"
    ],
    themes: ["Healthcare AI", "Data Integration", "Agentic"],
    featured: true,
    completeness: 0.85,
    executionDepth: 0.82,
    aiDepth: 0.78,
    productSignal: 0.86,
    recencySignal: 0.95
  },
  {
    id: "speakai",
    title: "SpeakAI",
    account: "algsoch",
    synopsis: "Voice-first conversational system showing multimodal product thinking.",
    overview:
      "A local English practice app with browser speech, optional on-device model download, and voice plus text responses.",
    whyItMatters:
      "It shows Vicky can build a focused voice product with local inference, browser speech integration, and model caching instead of a generic cloud assistant.",
    bestFor: ["Voice AI", "Multimodal UX", "Conversational systems"],
    repoUrl: "https://github.com/algsoch/speakai",
    demoUrl: "https://speakai-af1l.onrender.com/",
    highlights: [
      "100% on-device English practice",
      "Web Speech API plus local model flow",
      "One-time browser model download and cache"
    ],
    themes: ["Voice / Chat / Agentic", "Interfaces"],
    featured: true,
    completeness: 0.88,
    executionDepth: 0.86,
    aiDepth: 0.89,
    productSignal: 0.92,
    recencySignal: 0.82
  },
  {
    id: "algsoch",
    title: "Algsoch",
    account: "fiscalmindset",
    synopsis: "Flagship applied intelligence platform expressing product and systems quality together.",
    overview:
      "An AI-powered study companion for Android with seven learning modes and fully offline RunAnywhere-powered inference.",
    whyItMatters:
      "It shows serious mobile AI product execution: Android/Kotlin engineering, model download and inference management, seven-mode UX, and privacy-first local operation.",
    bestFor: ["Best overall GitHub signal", "Flagship product", "Applied intelligence", "Design + engineering"],
    repoUrl: "https://github.com/FiscalMindset/algsoch",
    highlights: [
      "Offline Android study companion",
      "Seven learning modes",
      "SmolLM2 and SmolVLM on device"
    ],
    themes: ["Full-Stack Products", "Interfaces", "AI Systems"],
    featured: true,
    completeness: 0.9,
    executionDepth: 0.87,
    aiDepth: 0.84,
    productSignal: 0.95,
    recencySignal: 0.86
  },
  {
    id: "algsoch-news",
    title: "Algsoch News",
    account: "fiscalmindset",
    synopsis: "Structured media workflow with ranking, transformation, and output automation.",
    overview:
      "A five-agent newsroom pipeline that transforms a public article URL into screenplay JSON, visible workflow traces, and a final MP4 video.",
    whyItMatters:
      "It demonstrates visible multi-agent orchestration with retries, packaging logic, and final media rendering instead of a hidden one-shot summarization call.",
    bestFor: ["Workflow automation", "Structured output", "News pipelines", "Agentic media systems"],
    repoUrl: "https://github.com/FiscalMindset/algsochnews",
    demoUrl: "https://algsochnews-1.onrender.com",
    highlights: [
      "Visible five-agent orchestration",
      "QA-driven retry routing",
      "Screenplay plus rendered video output"
    ],
    themes: ["Tools", "News Automation", "Agentic"],
    featured: true,
    completeness: 0.86,
    executionDepth: 0.9,
    aiDepth: 0.89,
    productSignal: 0.83,
    recencySignal: 0.8
  },
  {
    id: "brain-tumor-detection-system",
    title: "Brain Tumor Detection System",
    account: "algsoch",
    synopsis: "Supervised deep learning system for MRI brain tumor classification.",
    overview:
      "A computer-vision pipeline for brain MRI classification with preprocessing, augmentation, reproducible inference, and controlled result interpretation.",
    whyItMatters:
      "It shows practical deep learning execution beyond LLM products: data preparation, model training, evaluation discipline, and a usable inference surface.",
    bestFor: ["Computer vision", "Medical ML", "CNN pipelines"],
    repoUrl: "https://github.com/algsoch/brain_tumor",
    demoUrl: "https://brain-tumor-mcug.onrender.com/",
    highlights: [
      "CNN-based MRI classification pipeline",
      "Systematic preprocessing, normalization, and augmentation",
      "Reproducible inference and visualization workflow"
    ],
    themes: ["AI Systems", "ML Systems", "Computer Vision", "Healthcare AI"],
    featured: false,
    completeness: 0.84,
    executionDepth: 0.87,
    aiDepth: 0.9,
    productSignal: 0.76,
    recencySignal: 0.7
  },
  {
    id: "silent-disease-detection-engine",
    title: "Silent Disease Detection Engine",
    account: "algsoch",
    synopsis: "Multi-model disease-risk prediction engine with feature engineering and explainability.",
    overview:
      "A structured ML system that predicts risk across five diseases from synthetic clinical data using engineered features, XGBoost models, SHAP analysis, FastAPI inference, and a test dashboard.",
    whyItMatters:
      "It proves Vicky can build reproducible machine learning products with feature engineering, model evaluation, explainability, and API delivery rather than only prompt-based applications.",
    bestFor: ["ML pipelines", "Feature engineering", "Explainability", "FastAPI delivery"],
    demoUrl: "https://silent-killer-kdnm.onrender.com/",
    highlights: [
      "37 engineered features derived from 25 clinical inputs",
      "Per-disease XGBoost models with ROC-AUC and F1 evaluation",
      "SHAP-based feature contribution analysis"
    ],
    themes: ["AI Systems", "ML Systems", "Healthcare AI", "Full-Stack Products"],
    featured: false,
    completeness: 0.82,
    executionDepth: 0.85,
    aiDepth: 0.87,
    productSignal: 0.74,
    recencySignal: 0.66
  },
  {
    id: "ai-bid-writer-agent",
    title: "AI Bid Writer Agent",
    account: "algsoch",
    synopsis: "Modular LLM agent pipeline for analyzing freelance jobs and generating tailored bid proposals.",
    overview:
      "A full-stack agent system with FastAPI backend and React frontend that parses project descriptions, matches skills, and optimizes bids across configurable LLM backends.",
    whyItMatters:
      "It demonstrates applied agentic product engineering with real workflow value: structured extraction, toolable prompt pipelines, configurable model backends, and interactive UI delivery.",
    bestFor: ["LLM agents", "Full-stack AI apps", "Workflow automation", "Proposal generation"],
    repoUrl: "https://github.com/algsoch/freelancer.com",
    demoUrl: "https://freelancer-com-omega.vercel.app/",
    highlights: [
      "Modular agent pipeline for bid generation",
      "Configurable Gemini, GPT-4, and Claude backends",
      "FastAPI + React interactive product surface"
    ],
    themes: ["AI Systems", "Agentic", "Full-Stack Products", "Tools"],
    featured: false,
    completeness: 0.85,
    executionDepth: 0.86,
    aiDepth: 0.9,
    productSignal: 0.82,
    recencySignal: 0.72
  },
  {
    id: "html-checker",
    title: "HTML Checker",
    account: "algsoch",
    synopsis: "Rule-based HTML parser and validator for structural and syntax error detection.",
    overview:
      "A parsing and validation tool that detects unclosed tags, improper nesting, malformed markup, and reports categorized errors through a web-accessible service.",
    whyItMatters:
      "It shows depth outside AI branding alone: parser logic, error analysis, systematic pattern handling, and developer-facing tooling.",
    bestFor: ["Parsing logic", "Validation tools", "Developer tooling"],
    repoUrl: "https://github.com/algsoch/html-checker",
    demoUrl: "https://html-checker-1.onrender.com/",
    highlights: [
      "Rule-based parser for malformed markup",
      "Detection of nesting and closure errors",
      "Categorized error reporting for debugging"
    ],
    themes: ["Tools", "Developer Tools", "Parsing"],
    featured: false,
    completeness: 0.81,
    executionDepth: 0.83,
    aiDepth: 0.34,
    productSignal: 0.72,
    recencySignal: 0.68
  },
  {
    id: "tds-tool-based-assistant",
    title: "TDS Tool-Based Assistant",
    account: "algsoch",
    synopsis: "Pattern-matching assistant that routes data science queries to modular solver functions.",
    overview:
      "A backend-first assistant that classifies data science queries, dispatches them to solver modules, and returns structured outputs through REST APIs and an interactive web UI.",
    whyItMatters:
      "It reinforces the tool-based side of Vicky's AI work: routing, modular solvers, structured outputs, and integration-friendly backend design.",
    bestFor: ["Tool routing", "Structured outputs", "Educational assistants", "Solver architecture"],
    demoUrl: "https://assistant-chatbot-izrt.onrender.com/",
    highlights: [
      "Pattern-matching engine for query classification",
      "Modular solver functions for processing and automation tasks",
      "REST APIs with structured outputs"
    ],
    themes: ["AI Systems", "Tools", "Educational Assistant", "Structured Output"],
    featured: false,
    completeness: 0.79,
    executionDepth: 0.81,
    aiDepth: 0.72,
    productSignal: 0.74,
    recencySignal: 0.64
  },
  {
    id: "legacy-archive",
    title: "Legacy Algsoch Archive",
    account: "algsoch",
    synopsis: "Historical work referenced only for continuity, not as the active engineering signal.",
    overview:
      "Older repositories remain useful as background context, but they are not the strongest proof of current product or AI execution quality.",
    whyItMatters:
      "It helps explain continuity of the portfolio history without outranking the more complete flagship repositories.",
    bestFor: ["Historical context"],
    themes: ["Legacy"],
    featured: false,
    completeness: 0.54,
    executionDepth: 0.58,
    aiDepth: 0.47,
    productSignal: 0.42,
    recencySignal: 0.15
  }
];

export const philosophyStatements = [
  {
    title: "Local-first is the future.",
    detail:
      "Browser-based AI with no API calls means no costs, no privacy concerns, and offline capability. RunAnywhere SDK makes this accessible today."
  },
  {
    title: "Workflow before model.",
    detail:
      "The model is the last layer, not the first. Build the routing, state, error handling, and UX first. Then plug in whichever model fits."
  },
  {
    title: "Open source contribution over consumption.",
    detail:
      "12 merged PRs to Coral MCP. Real code review, documentation, and upstream collaboration. Contributing builds reputation and skills."
  },
  {
    title: "Keep shipping.",
    detail:
      "Projects don't need to be perfect to be useful. CommandBrain runs. Algsoch runs. SpeakAI runs. Done and working beats perfect and incomplete."
  }
];

export const contactActions = [
  {
    label: "Resume",
    href: "/docs/vicky_software_engineer.pdf"
  },
  {
    label: "GitHub",
    href: "https://github.com/fiscalmindset"
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/algsoch"
  }
];

export const suggestedQuestions = [
  "Why should we hire Vicky Kumar for an AI engineer role?",
  "What is Vicky Kumar's best project across both GitHub accounts, and why?",
  "Show me the GitHub account overview and where each project lives.",
  "Which project best demonstrates agentic AI capability?",
  "Which ML or non-LLM systems stand out in Vicky's work?",
  "How does he approach turning AI into usable products?",
  "Which system best shows full-stack + AI integration?",
  "How does Vicky think about runtime-integrated local AI?",
  "Compare CommandBrain and Algsoch News from an architecture perspective.",
  "If I need a voice AI product, why is he a strong fit?"
];

export const knowledgeEntries: KnowledgeEntry[] = [
  {
    id: "profile-core",
    title: "Applied Intelligence Product Engineer",
    type: "profile",
    summary:
      "Vicky Kumar positions himself at the overlap of software engineering, AI systems, usable interfaces, and product-grade execution.",
    evidence: [
      "Builds full-stack systems, AI-native apps, and agentic workflows.",
      "Emphasizes usable interfaces around intelligence rather than prompt wrappers.",
      "Treats runtime integration and product quality as core engineering concerns."
    ],
    tags: ["software engineer", "ai engineer", "agentic systems", "product engineer", "full-stack"],
    relatedSystems: ["commandbrain", "algsoch", "speakai", "algsoch-news"]
  },
  {
    id: "project-commandbrain",
    title: "CommandBrain signal",
    type: "project",
    summary:
      "CommandBrain is an offline-first command memory and execution copilot built in the browser with local storage, safety review, and execution modes.",
    evidence: [
      "Transforms natural language into reusable shell commands.",
      "Stores commands, favorites, macros, reminders, and patterns locally in IndexedDB.",
      "Supports safety classification plus simulate or real execution through a bridge."
    ],
    tags: ["commandbrain", "smart_terminal", "command memory", "execution", "local-first", "runanywhere"],
    relatedSystems: ["commandbrain"]
  },
  {
    id: "project-speakai",
    title: "SpeakAI signal",
    type: "project",
    summary:
      "SpeakAI is a local English speaking practice app with browser speech, optional on-device model download, and text plus voice feedback.",
    evidence: [
      "Runs 100% on device with RunAnywhere Web SDK and llama.cpp WASM.",
      "Supports browser speech immediately or local model download for offline use.",
      "Treats microphone, transcript, and AI reply as one practice workflow."
    ],
    tags: ["speakai", "voice", "english practice", "runanywhere", "web speech api", "offline ai"],
    relatedSystems: ["speakai"]
  },
  {
    id: "project-algsoch",
    title: "Algsoch signal",
    type: "project",
    summary:
      "Algsoch is an Android AI-powered study companion with seven learning modes and offline on-device inference.",
    evidence: [
      "Built with Android, Kotlin, and Jetpack Compose.",
      "Uses RunAnywhere SDK with SmolLM2 and SmolVLM on device.",
      "Delivers private, offline educational assistance without cloud dependency."
    ],
    tags: ["algsoch", "android", "study companion", "offline ai", "runanywhere sdk", "smollm2", "smolvlm"],
    relatedSystems: ["algsoch"]
  },
  {
    id: "project-news",
    title: "Algsoch News signal",
    type: "project",
    summary:
      "Algsoch News is a five-agent newsroom pipeline that turns an article URL into screenplay JSON, workflow traces, and rendered video.",
    evidence: [
      "Uses distinct agents for extraction, editorial shaping, packaging, QA, and video generation.",
      "Supports conditional retry routing from QA back into the pipeline.",
      "Produces structured outputs and final MP4 artifacts rather than only text summaries."
    ],
    tags: ["algsoch news", "algsochnews", "multi-agent", "newsroom", "video generation", "langgraph"],
    relatedSystems: ["algsoch-news"]
  },
  {
    id: "project-brain-tumor",
    title: "Brain Tumor Detection System signal",
    type: "project",
    summary:
      "A supervised deep learning pipeline for brain MRI classification with preprocessing, augmentation, evaluation, and reproducible inference.",
    evidence: [
      "Built a CNN-based medical imaging workflow instead of only LLM products.",
      "Handled normalization, augmentation, and class-wise error analysis.",
      "Added reproducible inference and visualization for controlled testing."
    ],
    tags: ["brain tumor", "mri", "cnn", "computer vision", "medical ml", "brain_tumor"],
    relatedSystems: []
  },
  {
    id: "project-silent-disease",
    title: "Silent Disease Detection Engine signal",
    type: "project",
    summary:
      "A multi-model disease-risk prediction engine with feature engineering, XGBoost modeling, SHAP explainability, FastAPI inference, and dashboard delivery.",
    evidence: [
      "Derived 37 engineered features from 25 clinical inputs.",
      "Trained separate disease models with ROC-AUC and F1 evaluation.",
      "Connected ML inference to a reproducible API and testing dashboard."
    ],
    tags: ["silent disease", "xgboost", "shap", "feature engineering", "healthcare ai", "fastapi"],
    relatedSystems: []
  },
  {
    id: "project-bid-writer",
    title: "AI Bid Writer Agent signal",
    type: "project",
    summary:
      "A modular LLM agent product that analyzes freelance project descriptions and generates optimized bid proposals through a full-stack interface.",
    evidence: [
      "Implements extraction, skill matching, and bid optimization.",
      "Supports multiple configurable LLM backends.",
      "Combines FastAPI backend orchestration with a React frontend."
    ],
    tags: ["bid writer", "freelancer", "agent", "proposal generation", "llm backends", "full-stack ai"],
    relatedSystems: ["commandbrain"]
  },
  {
    id: "project-html-checker",
    title: "HTML Checker signal",
    type: "project",
    summary:
      "A rule-based parser and validator for HTML structure, nesting, malformed patterns, and categorized error reporting.",
    evidence: [
      "Detects unclosed tags and improper nesting.",
      "Uses systematic pattern analysis across malformed markup.",
      "Exposes validation through an interactive web service."
    ],
    tags: ["html checker", "parser", "validator", "developer tools", "markup analysis"],
    relatedSystems: []
  },
  {
    id: "project-tds-assistant",
    title: "TDS Tool-Based Assistant signal",
    type: "project",
    summary:
      "A tool-based assistant that classifies data science queries, routes them to solver modules, and returns structured outputs over REST APIs.",
    evidence: [
      "Uses a pattern-matching engine to classify queries.",
      "Routes work to modular solver functions.",
      "Returns structured outputs for UI and integration use."
    ],
    tags: ["tds assistant", "tool-based assistant", "solver routing", "structured outputs", "data science assistant"],
    relatedSystems: ["commandbrain"]
  },
  {
    id: "architecture-layers",
    title: "AI architecture approach",
    type: "architecture",
    summary:
      "The architecture model moves from interface to agent to intelligence to execution to product.",
    evidence: [
      "Separates interaction design from orchestration and runtime concerns.",
      "Uses structured retrieval and response planning for grounded behavior.",
      "Treats product quality as part of the architecture rather than decoration."
    ],
    tags: ["architecture", "layers", "workflow", "execution", "local ai"],
    relatedSystems: ["commandbrain", "algsoch", "speakai", "algsoch-news"]
  },
  {
    id: "philosophy-ai-product",
    title: "AI product philosophy",
    type: "philosophy",
    summary:
      "Vicky builds AI for use, not for demo value alone.",
    evidence: [
      "Values interface quality as engineering quality.",
      "Prefers workflow thinking over isolated prompts.",
      "Builds calm, exact systems instead of loud gimmicks."
    ],
    tags: ["philosophy", "useful ai", "workflow", "interface quality", "product"],
    relatedSystems: ["algsoch", "commandbrain"]
  },
  {
    id: "github-signal",
    title: "GitHub curation approach",
    type: "github",
    summary:
      "Repository signal is curated across fiscalmindset and the suspended algsoch account with explicit project-to-account mapping.",
    evidence: [
      "CommandBrain and SpeakAI sit under algsoch.",
      "Algsoch and Algsoch News sit under fiscalmindset.",
      "Most remaining repositories live in algsoch.",
      "Manual featured weighting goes to the strongest engineering signals first.",
      "Low-signal repositories are intentionally deprioritized."
    ],
    tags: ["github", "repo ranking", "signal", "fiscalmindset", "algsoch"],
    relatedSystems: ["commandbrain", "speakai", "algsoch", "algsoch-news"]
  },
  {
    id: "github-best-overall",
    title: "Best overall GitHub project",
    type: "github",
    summary:
      "Algsoch is the strongest overall GitHub project because it combines product maturity, on-device AI, Android execution, and current flagship identity in one system.",
    evidence: [
      "It is the clearest current proof of serious product execution around AI.",
      "It combines Android engineering, local inference, privacy-first design, and multi-mode learning UX.",
      "It reflects both current flagship positioning and real technical depth."
    ],
    tags: ["best project", "strongest github project", "github winner", "algsoch"],
    relatedSystems: ["algsoch"]
  }
];
