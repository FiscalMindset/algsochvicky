# Contribution Guide

## Overview

Portfolio website for Vicky Kumar — an AI Engineer / Software Engineer portfolio built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**. Features include a local on-device AI runtime (RunAnywhere SDK), a portfolio agent with Groq/rule-based fallback, GitHub intelligence layer, and a full editorial profile page.

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- (Optional) `GROQ_API_KEY` for the live inference agent

---

## Quick Start

```bash
# Clone
git clone https://github.com/FiscalMindset/algsochvicky.git
cd algsochvicky

# Install
npm install

# Copy environment
cp .env.example .env
# Edit .env and add GROQ_API_KEY if desired

# Dev server
npm run dev
```

Opens at `http://localhost:5173`

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | TypeScript type checking only |

---

## Project Architecture

```
src/
├── app/
│   └── App.tsx                  # Root — route to portfolio / editorial
├── components/
│   ├── pages/                    # Full page components
│   │   ├── editorial-profile-page.tsx
│   │   └── system-case-study-page.tsx
│   ├── sections/                 # Portfolio sections
│   │   ├── hero-section.tsx      # Entry point with identity + capabilities
│   │   ├── skills-section.tsx    # Technical toolkit grid
│   │   ├── selected-systems-section.tsx  # Project deep-dive tabs
│   │   ├── architecture-section.tsx      # 5-layer blueprint
│   │   ├── build-with-ai-section.tsx     # Build modes explorer
│   │   ├── local-runtime-section.tsx     # On-device AI control panel
│   │   ├── portfolio-agent-section.tsx   # Ask Vicky chat
│   │   ├── github-intelligence-section.tsx  # Repo ranking + stats
│   │   ├── philosophy-section.tsx   # Build philosophy
│   │   ├── contact-section.tsx   # Contact + conversion paths
│   │   ├── capability-strip-section.tsx
│   │   ├── audience-routes-section.tsx
│   │   └── nav-shell.tsx         # Sticky nav bar
│   ├── ui/                       # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── section-heading.tsx
│   │   ├── surface.tsx
│   │   ├── github-commit-surface.tsx
│   │   ├── rich-response.tsx
│   │   └── youtube-preview.tsx
│   └── visuals/                  # Visual + diagram components
│       ├── architecture-blueprint.tsx
│       └── hero-signal-map.tsx
├── content/
│   └── portfolio.ts              # All portfolio data (projects, skills, etc.)
├── features/
│   ├── agent/                    # Portfolio agent engine
│   │   ├── engine.ts             # Core answer logic + routing
│   │   ├── groq-provider.ts      # Groq API integration
│   │   └── types.ts              # Agent types
│   ├── github/                   # GitHub repo intelligence
│   │   └── repo-intelligence.ts  # Ranking + theme filtering
│   └── runanywhere/              # RunAnywhere SDK integration
│       ├── model-catalog.ts      # Local model definitions
│       ├── runtime-manager.ts    # Lifecycle management
│       ├── runtime-provider.tsx  # React context provider
│       ├── sdk.ts                # SDK bridge
│       └── types.ts
├── hooks/
│   └── use-active-section.ts     # Scroll-based section tracking
├── lib/
│   └── utils.ts                  # Utility functions
├── styles/
│   └── globals.css               # Tailwind base + custom utilities
├── main.tsx                      # React entry point
└── vite-env.d.ts
```

### Architecture Flow

```mermaid
flowchart TB
    subgraph Browser["Browser"]
        ROOT["App.tsx<br/>Root Router"]
        ROOT -->|"view=editorial"| EDIT["EditorialProfilePage"]
        ROOT -->|"?system=id"| CASE["SystemCaseStudyPage"]
        ROOT -->|"default"| HOME["PortfolioHome"]
    end

    subgraph Sections["Portfolio Sections"]
        HOME --> HERO["HeroSection<br/>Identity + Capabilities"]
        HOME --> SKILLS["SkillsSection<br/>Technical Toolkit"]
        HOME --> SYSTEMS["SelectedSystemsSection<br/>Project Tabs"]
        HOME --> ARCH["ArchitectureSection<br/>5-Layer Blueprint"]
        HOME --> BUILD["BuildWithAiSection<br/>Build Modes"]
        HOME --> RUNTIME["LocalRuntimeSection<br/>On-Device AI"]
        HOME --> AGENT["PortfolioAgentSection<br/>Ask Vicky Chat"]
        HOME --> GH["GitHubIntelligenceSection<br/>Repo Ranking"]
        HOME --> PHIL["PhilosophySection<br/>Build Philosophy"]
        HOME --> CONTACT["ContactSection"]
    end

    subgraph Features["Feature Modules"]
        RL["RuntimeProvider<br/>RunAnywhere Context"] --> RA["RunAnywhere SDK<br/>Local LLM (SmolLM2)"]
        AGENT --> ENGINE["Agent Engine<br/>engine.ts"]
        ENGINE -->|"groq mode"| GROQ["Groq API Proxy"]
        ENGINE -->|"local mode"| RL
        ENGINE -->|"fallback mode"| RULES["Rule-Based<br/>Portfolio Logic"]
        GH --> REPO["Repo Intelligence<br/>Ranking + Themes"]
    end

    subgraph Data["Content Layer"]
        CONTENT["portfolio.ts<br/>All Data"]
        CONTENT -->|"projects"| SYSTEMS
        CONTENT -->|"skills"| SKILLS
        CONTENT -->|"architecture"| ARCH
        CONTENT -->|"build modes"| BUILD
        CONTENT -->|"github"| GH
        CONTENT -->|"philosophy"| PHIL
        CONTENT -->|"contact"| CONTACT
    end

    subgraph Styling["Styling System"]
        CONFIG["tailwind.config.ts<br/>Custom Theme"]
        CSS["globals.css<br/>CSS Variables + Utilities"]
        UI["UI Primitives<br/>button, surface, heading"]
    end

    GROQ -.->|"optional API key"| GROQ_API["api.groq.com"]
    RA -.->|"WASM downloads"| OPFS["Browser OPFS Cache"]
```

### Agent Inference Architecture

```mermaid
flowchart LR
    subgraph Input["User Input"]
        Q["Question / Query"]
        MODE["Agent Mode<br/>recruiter / client / technical"]
        IM["Inference Mode<br/>fallback / groq / local / auto"]
    end

    subgraph Engine["Portfolio Agent Engine (engine.ts)"]
        ID["Intent Detection"] --> ROUTE["Route to Handler"]
        ROUTE -->|fallback| FB["Rule-Based Engine<br/>Deterministic matching"]
        ROUTE -->|groq| GQ["Groq LLM<br/>Streaming Response"]
        ROUTE -->|local| LOC["RunAnywhere Local<br/>SmolLM2 Inference"]
        ROUTE -->|auto| SMART["Smart Route<br/>Local if active → Groq → Fallback"]
    end

    subgraph Context["Portfolio Context"]
        DATA["portfolio.ts<br/>Projects, Skills, Systems"]
        RANK["Repository Ranking<br/>Signal Scores"]
        EVIDENCE["Evidence Cards<br/>Grounded Facts"]
    end

    subgraph Output["Response"]
        ANS["Answer Text"]
        EVID["Supporting Evidence"]
        FOLLOW["Suggested Follow-ups"]
        MODE_LABEL["Response Mode Label"]
    end

    Q --> ID
    MODE --> ID
    IM --> ROUTE
    FB --> DATA
    GQ --> DATA
    LOC --> DATA
    DATA --> ANS
    DATA --> EVID
    DATA --> FOLLOW
```

### Editorial Profile Architecture

```mermaid
flowchart TB
    subgraph Shell["Editorial Shell"]
        HEADER["Fixed Header<br/>Theme Toggle + Resume"]
        MAIN["Scrollable Content<br/>4-Page Layout"]
    end

    subgraph Pages["Editorial Spreads"]
        MAIN --> PG1["Page 01<br/>Profile Edition<br/>Lead article, byline, facts"]
        MAIN --> PG2["Page 02<br/>Projects Edition<br/>4 flagship systems deep-dive"]
        MAIN --> PG3["Page 03<br/>Skills & Mindset<br/>Skill ledger, pull quotes, philosophy"]
        MAIN --> PG4["Page 04<br/>GitHub & Contact<br/>Identity split, closing read"]
    end

    subgraph Theme["Theme System"]
        T["Editorial Theme State<br/>night / newsprint"]
        T -->|night| DARK["Dark Mode<br/>--canvas: 10 14 20"]
        T -->|newsprint| LIGHT["Newsprint Mode<br/>--canvas: 245 239 227"]
    end
```

---

## How to Contribute

### 1. Branch

```bash
git checkout -b fix/your-fix-name
# or
git checkout -b feature/your-feature-name
```

### 2. Make changes

- Edit sections in `src/components/sections/`
- Add/modify portfolio data in `src/content/portfolio.ts`
- Run `npm run typecheck` to verify types

### 3. Commit

```bash
git add .
npm run typecheck     # ensure no type errors
npm run build         # ensure build passes
git commit -m "description of changes"
```

Note: This repo uses **LiveReview** pre-commit hooks. If blocked, run:

```bash
lrc review --staged --vouch   # manually approve
# or
lrc review --staged --skip    # skip AI review
```

### 4. Push & PR

```bash
git push -u origin your-branch-name
# Create PR on GitHub: https://github.com/FiscalMindset/algsochvicky/pulls
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | No | API key for Groq inference in the portfolio agent |
| `GROQ_MODEL` | No | Model override (default: `llama-3.1-8b-instant`) |
| `VITE_GROQ_PROXY_URL` | No | Custom Groq proxy endpoint |

---

## Deployment

This portfolio deploys on **Render** (primary) and **Vercel** (secondary).

### Render

- Build command: `npm run build`
- Publish directory: `dist`
- Auto-deploys from `main` branch

### Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

---

## Design Conventions

- **Border system**: Sections have responsive outer borders — `rounded-xl border` on mobile, `sm:rounded-2xl sm:border-2`, `lg:rounded-3xl`
- **Section spacing**: `section-space` utility = `py-6 sm:py-8 lg:py-12`
- **Colors**: Defined as CSS variables in `globals.css` (canvas, ink, accent, line, etc.)
- **Typography**: `font-display` (Syne), `font-sans` (Manrope), `font-mono` (JetBrains Mono)
- **Components keep data separate** — portfolio content lives in `src/content/portfolio.ts`, not in components
