# Vicky Kumar Portfolio

A premium React + TypeScript portfolio built as an applied-intelligence product showcase rather than a conventional portfolio page.

## Why this stack

This project uses `React + TypeScript + Vite + Tailwind + Framer Motion`.

Vite was chosen intentionally for production polish and for compatibility with the current RunAnywhere Web SDK guidance:

- The SDK documentation currently recommends Vite for web projects.
- Vite makes the RunAnywhere WASM asset workflow explicit and controllable.
- Cross-origin isolation headers, worker format, and `optimizeDeps.exclude` are easier to keep aligned with the SDK’s current browser-runtime requirements.
- The app remains lightweight while still giving us a modular, production-grade React architecture.

## What the site is designed to communicate

- Software Engineer
- AI Engineer
- Agentic Systems Builder
- Applied Intelligence Product Engineer

The experience is meant to signal engineering depth, interface discipline, runtime awareness, and product maturity before a visitor reads much text.

## Architecture overview

### App shell

- [`src/app/App.tsx`](/Users/viclkykumar/vicky/src/app/App.tsx)
- Sticky command-style navigation
- Editorial single-page flow with premium dark visual system
- Section-based composition instead of template sections

### Content system

- [`src/content/portfolio.ts`](/Users/viclkykumar/vicky/src/content/portfolio.ts)
- Central source for brand copy, featured systems, architecture layers, build modes, philosophy, GitHub identity context, and portfolio agent knowledge
- Makes the site easy to extend without hardcoding narrative copy directly into components

### Design system

- [`src/styles/globals.css`](/Users/viclkykumar/vicky/src/styles/globals.css)
- [`src/components/ui/button.tsx`](/Users/viclkykumar/vicky/src/components/ui/button.tsx)
- [`src/components/ui/section-heading.tsx`](/Users/viclkykumar/vicky/src/components/ui/section-heading.tsx)
- [`src/components/ui/surface.tsx`](/Users/viclkykumar/vicky/src/components/ui/surface.tsx)

The visual language is restrained dark technical luxury:

- layered graphite backgrounds
- off-white and muted silver text
- one controlled cool accent
- large display typography with editorial spacing
- utility surfaces for premium panels instead of generic cards

### Section architecture

- Hero + intelligence map
- Capability strip
- Selected systems
- Agentic architecture blueprint
- Build-anything-with-AI selector
- RunAnywhere runtime control panel
- Advanced portfolio agent
- GitHub intelligence layer
- Build philosophy
- Premium CTA

## RunAnywhere integration

RunAnywhere is not presented as a fake badge or a future feature. The site includes a real browser-local model lifecycle layer.

### Files

- [`src/features/runanywhere/model-catalog.ts`](/Users/viclkykumar/vicky/src/features/runanywhere/model-catalog.ts)
- [`src/features/runanywhere/sdk.ts`](/Users/viclkykumar/vicky/src/features/runanywhere/sdk.ts)
- [`src/features/runanywhere/runtime-manager.ts`](/Users/viclkykumar/vicky/src/features/runanywhere/runtime-manager.ts)
- [`src/features/runanywhere/runtime-provider.tsx`](/Users/viclkykumar/vicky/src/features/runanywhere/runtime-provider.tsx)
- [`src/components/sections/local-runtime-section.tsx`](/Users/viclkykumar/vicky/src/components/sections/local-runtime-section.tsx)

### Runtime behavior

The local model flow is architected like this:

1. The runtime initializes lazily after first idle time.
2. RunAnywhere core and the Llama.cpp backend are loaded dynamically.
3. The local language model is registered if it is not already in the SDK catalog.
4. When the user clicks activation:
   - if the model is missing, `ModelManager.downloadModel()` starts automatically
   - download progress is surfaced in the UI
   - the model is stored in OPFS by the SDK
   - the model is then loaded into memory with `ModelManager.loadModel()`
5. On later visits, the SDK detects the existing OPFS cache and the UI moves straight to ready/load behavior without re-downloading.

### State model

The UI exposes these states clearly:

- `not-downloaded`
- `downloading`
- `ready`
- `loading`
- `active`
- `failed`

### Browser caching

The SDK persists downloaded models in the browser’s Origin Private File System (OPFS). This means:

- models survive page refreshes
- models survive browser restarts
- the portfolio can reuse the cached model in later sessions
- the user sees a real browser-local activation workflow instead of a mock

### Build/runtime configuration

- [`vite.config.ts`](/Users/viclkykumar/vicky/vite.config.ts) copies required WASM binaries into `dist/assets` for production
- `optimizeDeps.exclude` is set for the RunAnywhere WASM packages
- cross-origin headers are configured both in dev and in [`vercel.json`](/Users/viclkykumar/vicky/vercel.json)

This follows the current RunAnywhere documentation for Vite bundling, WASM discovery, and `credentialless` cross-origin isolation.

## Groq testing path

The portfolio agent now also supports a faster Groq-backed testing mode so you do not need to wait for the local model download during development.

### Files

- [`api/groq.js`](/Users/viclkykumar/vicky/api/groq.js)
- [`src/features/agent/groq-provider.ts`](/Users/viclkykumar/vicky/src/features/agent/groq-provider.ts)
- [`src/components/sections/portfolio-agent-section.tsx`](/Users/viclkykumar/vicky/src/components/sections/portfolio-agent-section.tsx)
- [`vite.config.ts`](/Users/viclkykumar/vicky/vite.config.ts)

### Environment variables

Use a local `.env` file with:

```bash
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-8b-instant
VITE_GROQ_PROXY_URL=
```

`GROQ_API_KEY` intentionally stays server-side:

- in local development, Vite serves `/api/groq` through a dev middleware proxy
- in Vercel deployments, [`api/groq.js`](/Users/viclkykumar/vicky/api/groq.js) handles the same route

This means the key does not need to be exposed to the browser as `VITE_*`.

For static hosting, `VITE_GROQ_PROXY_URL` is optional and should point to an external proxy endpoint if you want Groq available in production. If it is omitted, the deployed site uses the local RunAnywhere runtime or the curated fallback agent path instead of trying to call `/api/groq`.

### Provider behavior

The portfolio agent supports four inference paths:

- `Groq Test`
- `Auto Route`
- `Local Runtime`
- `Fallback Only`

For your current testing flow, `Groq Test` is the fastest path.

## Render static deployment

This repository now includes a Render Blueprint:

- [`render.yaml`](/Users/viclkykumar/vicky/render.yaml)
- [`server/groq-proxy.mjs`](/Users/viclkykumar/vicky/server/groq-proxy.mjs)

It configures:

- a static frontend build with `npm install && npm run build`
- `dist` as the static publish directory
- a rewrite from `/*` to `/index.html` for SPA routing
- a separate lightweight Groq proxy service on Render
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: credentialless`

Those headers matter because the RunAnywhere browser runtime depends on cross-origin isolation for the best local-model experience.

For Render static deployment:

1. Connect [`https://github.com/FiscalMindset/algsochvicky.git`](https://github.com/FiscalMindset/algsochvicky.git) in Render.
2. Create a Blueprint or Static Site from the repo.
3. Let Render use the root `render.yaml`.
4. Set `GROQ_API_KEY` on the `algsochvicky-groq` service when Render asks for unsynced env vars.
5. Deploy the default branch.

Important:

- [`api/groq.js`](/Users/viclkykumar/vicky/api/groq.js) is still used for Vercel deployments
- local development still uses the Vite `/api/groq` middleware path
- Render live deployment now keeps Groq available through the separate `algsochvicky-groq` proxy service
- the static frontend reads `VITE_GROQ_PROXY_URL`, so live Groq stays fast without exposing the secret in the browser

## Portfolio agent architecture

The portfolio agent is intentionally more structured than a normal landing-page chatbot.

### Files

- [`src/features/agent/engine.ts`](/Users/viclkykumar/vicky/src/features/agent/engine.ts)
- [`src/features/agent/types.ts`](/Users/viclkykumar/vicky/src/features/agent/types.ts)
- [`src/components/sections/portfolio-agent-section.tsx`](/Users/viclkykumar/vicky/src/components/sections/portfolio-agent-section.tsx)

### Behavior

The agent currently supports:

- Recruiter Mode
- Client Mode
- Technical Deep Dive
- Project Explorer
- AI Capability Mode

### Response pipeline

1. Detect likely audience intent from the question
2. Retrieve the highest-signal evidence from the curated knowledge base
3. Select the most relevant systems
4. Build reasoning notes and follow-up suggestions
5. If the local model is active, generate the final phrasing on-device using a grounded prompt
6. If local inference is inactive, fall back to deterministic portfolio synthesis instead of a fake LLM

This means the UX remains useful even when a local model has not been activated.

## GitHub intelligence strategy

This portfolio intentionally avoids dumping every repository.

### Files

- [`src/features/github/repo-intelligence.ts`](/Users/viclkykumar/vicky/src/features/github/repo-intelligence.ts)
- [`src/components/sections/github-intelligence-section.tsx`](/Users/viclkykumar/vicky/src/components/sections/github-intelligence-section.tsx)

### Current identity model

- `fiscalmindset` is treated as the canonical active GitHub identity
- `algsoch` is treated as legacy historical context because the account is suspended

### Ranking approach

Repository signal is ranked by:

- manual featured priority
- execution depth
- AI depth
- product signal
- completeness
- recency

The current site uses curated fallback data, which is the right baseline when live GitHub API integration is unavailable or legacy-account behavior is unreliable.

## Customizing content later

The main customization point is:

- [`src/content/portfolio.ts`](/Users/viclkykumar/vicky/src/content/portfolio.ts)

You can update:

- hero positioning
- featured systems
- build modes
- philosophy
- GitHub identity details
- suggested prompts
- contact CTA actions

## Getting started

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Notes

- The project is dark-mode native by design.
- The local runtime depends on browser support for the required WASM and cross-origin isolation behavior.
- The default featured-system and GitHub content is curated fallback data meant to stay high-signal even before live APIs are connected.
