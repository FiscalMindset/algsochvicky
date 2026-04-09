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
  brandMeaning: "Think Different",
  portraitUrl: "/images/vicky-kumar.png",
  statement:
    "I build software systems, AI-native products, and agentic interfaces that turn ideas into usable, operational products.",
  supporting:
    "The work sits at the intersection of full-stack engineering, on-device intelligence, workflow orchestration, and product-grade interface design."
};

export const contactDetails: ContactDetail[] = [
  {
    label: "Phone",
    value: "+91 8383848219",
    href: "tel:+918383848219"
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

export const navItems: NavItem[] = [
  { id: "hero", label: "Overview" },
  { id: "systems", label: "Systems" },
  { id: "architecture", label: "Architecture" },
  { id: "build-modes", label: "Build Modes" },
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
    id: "commandbrain",
    title: "CommandBrain",
    shorthand: "RunAnywhere-powered command memory and execution copilot",
    thesis:
      "A RunAnywhere-powered offline-first browser app that turns natural language into reusable system commands and remembers them locally.",
    summary:
      "CommandBrain, published as RunAnywhere CommandBrain, is a React + TypeScript browser app built around local command memory, command generation, refinement, safety classification, and optional real execution through a bridge. The core idea is simple: stop repeating the same prompt and start building a reusable local command system.",
    problem:
      "Terminal help is often disposable and repetitive. CommandBrain solves that by storing commands, favorites, macros, reminders, and execution context locally so useful command workflows do not vanish after one chat.",
    significance:
      "This is one of the clearest proofs of Vicky's systems thinking: local storage, safety-aware execution, natural-language command generation, bridge-based execution, and a real operator workflow in one product.",
    intelligence:
      "Natural-language command generation, safety labeling, refinement loops, memory-backed command reuse, and local-first execution workflows.",
    layers: [
      "Natural-language command input",
      "Local command memory in IndexedDB",
      "Safety classification and preview",
      "Simulate or real execution bridge"
    ],
    stack: ["React", "TypeScript", "Vite", "IndexedDB", "RunAnywhere Web SDK", "Bridge-based execution"],
    architecture: [
      "Natural-language input becomes command suggestions with safety classification before execution.",
      "Commands, favorites, macros, patterns, and reminders are stored locally in the browser database.",
      "The app supports simulate mode and real execution through a configurable local bridge."
    ],
    outcomes: [
      "Shows real local-first AI product thinking.",
      "Demonstrates command memory as a product system, not a one-shot prompt trick.",
      "Balances generation, safety, storage, and execution in one interface."
    ],
    themes: ["AI Systems", "Command Interface", "Agentic"],
    accent: "from-accent/25 via-accent/10 to-transparent",
    signals: ["RunAnywhere Web SDK", "Local command memory", "Safety + execution"],
    links: [
      { label: "Repository", href: "https://github.com/algsoch/smart_terminal", variant: "primary" },
      { label: "Live Demo", href: "https://smart-terminal.onrender.com/", variant: "secondary" }
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
    themes: ["Voice / Chat / Agentic", "Interfaces", "AI Systems"],
    accent: "from-sky-400/20 via-accent/10 to-transparent",
    signals: ["RunAnywhere Web SDK", "Browser speech", "Offline voice practice"],
    links: [
      { label: "Repository", href: "https://github.com/algsoch/speakai", variant: "primary" },
      { label: "Ask About Voice Fit", href: "#agent", variant: "secondary" }
    ]
  },
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
      "It is the clearest flagship product signal because it combines Android engineering, on-device AI, learning UX, model lifecycle, and privacy-first product positioning in one app.",
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
      "Shows a real offline AI product, not just a concept.",
      "Demonstrates Android product execution with on-device models.",
      "Connects privacy, speed, and educational UX in one system."
    ],
    themes: ["Full-Stack Products", "Interfaces", "AI Systems"],
    accent: "from-white/15 via-white/5 to-transparent",
    signals: ["RunAnywhere SDK", "Android offline AI", "7 learning modes"],
    links: [
      { label: "Repository", href: "https://github.com/FiscalMindset/algsoch", variant: "primary" },
      { label: "APK Releases", href: "https://github.com/FiscalMindset/algsoch/releases", variant: "secondary" }
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
    relevantSystems: ["CommandBrain", "Algsoch"]
  },
  {
    id: "voice-assistant",
    title: "Voice Assistant",
    summary: "Speech-first products with conversation orchestration and UI feedback quality.",
    interfacePattern: "Voice practice interface with transcript, mic controls, local model activation, and browser-speech fallback.",
    outputStyle: "Practice-oriented feedback with text plus voice responses.",
    architectureFlow: ["Speech input", "Mode selection", "Optional local model download", "Local response generation", "Voice feedback"],
    technologies: ["RunAnywhere Web SDK", "Web Speech API", "React", "Browser model caching"],
    relevantSystems: ["SpeakAI"]
  },
  {
    id: "agent-workflow",
    title: "Agent Workflow",
    summary: "Action-driven systems that plan, execute, and expose workflow progress clearly.",
    interfacePattern: "Command center UI with execution traces, checkpoints, and route summaries.",
    outputStyle: "Action plans, structured outputs, and transparent state transitions.",
    architectureFlow: ["Intent routing", "Planner layer", "Tool execution", "Trace display", "Review"],
    technologies: ["Tool orchestration", "Execution logic", "State machines", "Structured outputs"],
    relevantSystems: ["CommandBrain", "Algsoch News"]
  },
  {
    id: "news-automation",
    title: "News Automation",
    summary: "Ranking, synthesis, and formatting workflows for signal-first publishing systems.",
    interfacePattern: "Editorial operations board with ranking, transformation, and output stages.",
    outputStyle: "Structured summaries and consistent delivery formats.",
    architectureFlow: ["Collection", "Filtering", "Ranking", "Summarization", "Distribution"],
    technologies: ["Automation pipelines", "Signal ranking", "Output templates", "Data curation"],
    relevantSystems: ["Algsoch News"]
  },
  {
    id: "on-device-tool",
    title: "On-Device Tool",
    summary: "Private, local-first interfaces powered by browser or device runtime models.",
    interfacePattern: "Runtime control panel with model state, download flow, and private local interaction.",
    outputStyle: "Offline-first answers with explicit runtime state and reuse behavior.",
    architectureFlow: ["Model registration", "Download and cache", "Load to runtime", "Local inference", "Release or reuse"],
    technologies: ["RunAnywhere Web SDK", "On-device inference", "OPFS caching", "Runtime management"],
    relevantSystems: ["Algsoch", "CommandBrain"]
  },
  {
    id: "educational-assistant",
    title: "Educational Assistant",
    summary: "Systems that explain, compare, and adapt information for different audiences.",
    interfacePattern: "Guided explainer UI with examples, comparisons, and follow-up pathways.",
    outputStyle: "Audience-aware explanations with progressive depth.",
    architectureFlow: ["Intent detect", "Audience map", "Content retrieval", "Adaptive response", "Guided follow-up"],
    technologies: ["Routing logic", "Prompt planning", "Knowledge graphs", "Interface scaffolding"],
    relevantSystems: ["Algsoch", "SpeakAI"]
  },
  {
    id: "command-interface",
    title: "Command Interface",
    summary: "Precision-oriented interfaces for turning human requests into system actions.",
    interfacePattern: "Keyboard-first control surface with state visibility and execution review.",
    outputStyle: "Commands, plans, system notices, and traceable actions.",
    architectureFlow: ["Command parsing", "Execution mapping", "Action orchestration", "Status feedback", "Human confirmation"],
    technologies: ["Command parsers", "Action logs", "State layers", "Control UIs"],
    relevantSystems: ["CommandBrain"]
  },
  {
    id: "multimodal-app",
    title: "Multimodal App",
    summary: "Products that combine text, voice, and system context without collapsing into gimmicks.",
    interfacePattern: "Layered interface with text, voice, optional vision, and synchronized runtime feedback.",
    outputStyle: "Mode-aware responses tuned to learning, speaking, or media workflows.",
    architectureFlow: ["Input capture", "Mode selection", "Model/runtime route", "Response generation", "UI adaptation"],
    technologies: ["Voice + chat", "Vision models", "RunAnywhere SDK", "State synchronization"],
    relevantSystems: ["SpeakAI", "Algsoch"]
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
    avatarUrl: "https://github.com/algsoch.png?size=160",
    avatarNote: "Avatar sourced from @algsoch",
    status: "primary"
  },
  {
    handle: "algsoch",
    role: "Legacy GitHub identity",
    note: "Suspended old account, but it still contains much of the strongest historical engineering signal.",
    overview:
      "CommandBrain, SpeakAI, and most of the remaining meaningful repository history sit under algsoch even though the account is suspended.",
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
    avatarUrl: "https://github.com/algsoch.png?size=160",
    avatarNote: "Avatar sourced from @algsoch",
    status: "legacy"
  }
];

export const repositorySignals: RepositorySignal[] = [
  {
    id: "commandbrain",
    title: "CommandBrain",
    account: "algsoch",
    synopsis: "Command-driven orchestration and execution interface for AI workflows.",
    overview:
      "An offline-first command memory and execution copilot that converts natural language into commands, stores them locally, and supports simulate or real execution.",
    whyItMatters:
      "It proves Vicky can build a local-first AI product with command generation, safety review, memory, analytics, and execution workflows instead of a disposable prompt box.",
    bestFor: ["Best overall GitHub signal", "Agentic systems", "Technical depth", "Execution interfaces"],
    repoUrl: "https://github.com/algsoch/smart_terminal",
    demoUrl: "https://smart-terminal.onrender.com/",
    highlights: [
      "Natural language to command generation",
      "IndexedDB-backed local command memory",
      "Safety labels, macros, reminders, and execution modes"
    ],
    themes: ["AI Systems", "Command Interface", "Agentic"],
    featured: true,
    completeness: 0.92,
    executionDepth: 0.96,
    aiDepth: 0.95,
    productSignal: 0.91,
    recencySignal: 0.88
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
    bestFor: ["Flagship product", "Applied intelligence", "Product taste", "Design + engineering"],
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
    title: "AI should operate inside a product, not beside it.",
    detail:
      "A useful system is not just model output. It is the interface, the workflow, the state model, and the decisions around trust."
  },
  {
    title: "Good AI UX is engineering work.",
    detail:
      "Latency, control, explainability, failure states, response structure, and operator confidence are implementation concerns, not polish afterthoughts."
  },
  {
    title: "Workflow design matters more than prompt cleverness.",
    detail:
      "The strongest systems are built around routes, actions, validation, and output quality, not one-off prompting tricks."
  },
  {
    title: "Applied intelligence should feel calm and exact.",
    detail:
      "Serious products communicate precision through restraint, hierarchy, and interface clarity, not through noise."
  }
];

export const contactActions = [
  {
    label: "Open GitHub",
    href: "https://github.com/fiscalmindset"
  },
  {
    label: "Inspect Local AI",
    href: "#runtime"
  },
  {
    label: "Ask The Portfolio Agent",
    href: "#agent"
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
      "CommandBrain is the strongest overall GitHub signal because it combines agentic execution depth, product control, and operator-facing AI UX.",
    evidence: [
      "It is the clearest proof of agentic systems engineering.",
      "It shows execution visibility rather than just generated output.",
      "It balances architecture depth with usable product design."
    ],
    tags: ["best project", "strongest github project", "github winner", "commandbrain"],
    relatedSystems: ["commandbrain"]
  }
];
