<div align="center">
  <img src="https://avatars.githubusercontent.com/u/254638087?v=4" width="140" height="140" style="border-radius: 50%; border: 5px solid #FF6B6B; box-shadow: 0 0 40px rgba(255,107,107,0.3);" alt="Vicky Kumar">
  <h1 style="margin: 25px 0 10px; font-size: 42px; color: #c9d1d9; font-weight: 700;">Vicky Kumar</h1>
  <p style="font-size: 20px; color: #8b949e; margin: 0 0 25px; letter-spacing: 0.5px;">
    <span style="color: #FF6B6B; font-weight: 600;">AI Engineer</span> · 
    <span style="color: #58a6ff; font-weight: 600;">Full-Stack Developer</span> · 
    <span style="color: #a371f7; font-weight: 600;">Agentic Systems Builder</span>
  </p>
  
  <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px;">
    <a href="https://github.com/FiscalMindset"><img src="https://img.shields.io/badge/GitHub-FiscalMindset-181717?style=for-the-badge&logo=github" alt="GitHub"/></a>
    <a href="https://github.com/algsoch"><img src="https://img.shields.io/badge/GitHub-algsoch-181717?style=for-the-badge&logo=github" alt="GitHub algsoch"/></a>
    <a href="https://www.linkedin.com/in/algsoch"><img src="https://img.shields.io/badge/LinkedIn-algsoch-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn"/></a>
    <a href="https://algsochvicky.onrender.com"><img src="https://img.shields.io/badge/Portfolio-View%20Live-FF6B6B?style=for-the-badge" alt="Portfolio"/></a>
  </div>

  <p style="font-size: 16px; color: #6e7681; max-width: 650px; line-height: 1.6;">
    Building <strong>agentic AI systems</strong>, <strong>open-source integrations</strong>, and <strong>real-world automation tools</strong>.
  </p>
</div>

---

## TL;DR

| | |
|:--|:--|
| **Who** | AI Engineer specializing in agentic systems & on-device AI |
| **What I Build** | Multi-agent pipelines, offline-capable apps, workflow automation |
| **Stack** | Python · Kotlin · TypeScript · LangGraph · RunAnywhere SDK · Coral |
| **Open Source** | 12 PRs to Coral MCP |
| **Achievements** | Pull Shark (22+ PRs merged) · YOLO · Quickdraw (< 5 min merge) |

---

## Philosophy

> "I build software systems, AI-native products, and agentic interfaces that turn ideas into usable, operational products."

- **AI should operate inside a product, not beside it.** A useful system is not just model output. It is the interface, the workflow, the state model, and the decisions around trust.

- **Good AI UX is engineering work.** Latency, control, explainability, failure states, response structure, and operator confidence are implementation concerns, not polish afterthoughts.

- **Workflow design matters more than prompt cleverness.** The strongest systems are built around routes, actions, validation, and output quality, not one-off prompting tricks.

- **Applied intelligence should feel calm and exact.** Serious products communicate precision through restraint, hierarchy, and interface clarity, not through noise.

---

## Featured Projects

### 🏆 On-Device AI Learning — algsoch

[**algsoch**](https://github.com/FiscalMindset/algsoch) — Android AI Study Companion
- **100% Offline** — AI runs entirely on-device via RunAnywhere SDK
- **7 Learning Modes** — Direct, Explain, Notes, Theory, Creative, Answer, Direction
- **SmolLM2-360M + SmolVLM-256M** running locally on Android
- Built with Kotlin + Jetpack Compose + RunAnywhere SDK
- [YouTube Demo](https://youtu.be/8L3svJ2HgI0)

```mermaid
graph LR
    A[User Question] --> B[RunAnywhere SDK]
    B --> C[SmolLM2-360M<br/>On-Device LLM]
    C --> D[AI Response<br/>Mode-Adapted]
```

---

### 📰 Multi-Agent AI Newsroom — algsochnews

[**algsochnews**](https://github.com/FiscalMindset/algsochnews) — AI-Powered News Pipeline
- **5-Agent orchestration** — Article Extraction → News Editor → Visual Packaging → QA → Video Generation
- **Parallel processing** with conditional retry routing
- **Broadcast-native output** — Screenplay JSON, timed visuals, MP4 video
- Built with **LangGraph** + **FastAPI** + **React**
- Live: [Frontend](https://algsochnews-1.onrender.com) · [API](https://algsochnews.onrender.com)

[Demo](https://youtu.be/vX4ZxSSpP8M)

```mermaid
flowchart LR
    A[Article URL] --> B[Extraction Agent]
    B --> C[News Editor Agent]
    C --> D[Visual Packaging]
    D --> E[QA Agent]
    E -->|Pass| F[Video Generation]
    E -->|Retry| C
    E -->|Retry| D
```

---

### 🏥 Healthcare AI — careops

[**careops**](https://github.com/FiscalMindset/careops) — Coral-Powered Family Care Coordination
- **9 Coral sources** joined via single SQL interface
- Generates **doctor-ready visit packets** from scattered medical records
- Timeline synthesis across prescriptions, lab reports, symptoms, appointments
- Safety guardrails — never diagnoses or prescribes
- Built with **Next.js 15** + **Coral SQL** + **TypeScript**
- 22 tests passing (13 careops + 9 coral-cli)

[Demo](https://youtu.be/TAOyyIH2_rc)

```mermaid
flowchart TD
    subgraph App["CareOps Application"]
        UI["Next.js UI"] --> API["Next.js API Routes"]
        API --> Client["Coral CLI Client"]
        Client --> CLI["coral sql --format json"]
    end

    subgraph Coral["Coral Query Layer"]
        CLI --> JOIN["Cross-Source JOIN\n(patient_id key)"]
        JOIN --> PAT["careops_patients"]
        JOIN --> MED["careops_medications"]
        JOIN --> LAB["careops_lab_reports"]
        JOIN --> CHAT["careops_doctor_chats"]
        JOIN --> PHARM["careops_pharmacy_receipts"]
        JOIN --> SYMP["careops_symptom_logs"]
        JOIN --> APPT["careops_appointments"]
        JOIN --> OCR["careops_prescription_ocr"]
        JOIN --> NOTES["careops_family_notes"]
    end

    CLI --> Result["Joined SQL Result"]
    Result --> Agent["CareOps Packet Generator"]
    Agent --> Packet["Doctor Visit Packet"]
```

---

### 🔄 Workflow Automation — autopr & devalert

[**autopr**](https://github.com/FiscalMindset/autopr) — GitHub → Social Media Orchestration
- **Kestra** workflows for event-driven automation
- Generates platform-specific content (LinkedIn, Twitter, Instagram, WhatsApp)
- Parallel AI generation with Gmail notifications
- GitHub webhook-triggered, no backend server required

```mermaid
flowchart LR
    A[GitHub Webhook] --> B[Kestra Orchestrator]
    B --> C[AI Content Generation]
    C --> D1[LinkedIn]
    C --> D2[Twitter/X]
    C --> D3[Instagram]
    C --> D4[WhatsApp]
    C --> E[Email Notification]
```

[**devalert**](https://github.com/FiscalMindset/devalert) — LLM-Filtered Opportunity Alerts
- Aggregates from 6 sources: GitHub, MLH, GSoC, Coral, HN, WeMakeDevs
- **LLM-powered scoring** with configurable threshold
- Telegram + Email notifications via Kestra orchestration

```mermaid
flowchart TD
    S1[GitHub] --> AGG[Aggregator]
    S2[MLH] --> AGG
    S3[GSoC] --> AGG
    S4[Coral] --> AGG
    S5[HN] --> AGG
    S6[WeMakeDevs] --> AGG
    AGG --> LLM[LLM Filter/Scorer]
    LLM --> T[Telegram Bot]
    LLM --> E[Email]
```

---

### ⏰ Developer Alerts — devalert

[**devalert**](https://github.com/FiscalMindset/devalert) — LLM-Filtered Opportunity Alerts
- Aggregates from 6 sources: GitHub, MLH, GSoC, Coral, HN, WeMakeDevs
- **LLM-powered scoring** with configurable threshold
- Telegram + Email notifications via Kestra orchestration

---

### 🧠 LLM Interpretability — Synapse-Graph

[**Synapse-Graph**](https://github.com/FiscalMindset/Synapse-Graph) — AI Autopsy Engine
- **Neural circuit discovery** — trace which attention heads cause hallucinations
- **Causal ablation** — O(n²) sweep to isolate defective components
- **OpenMetadata governance** — tag heads as `DEFECTIVE`, mask at runtime
- No retraining required — surgical fixes instead of full model updates
- Built with **PyTorch** + **FastAPI** + **Next.js**

```mermaid
flowchart LR
    subgraph Dashboard["🎨 Operator Dashboard"]
        D["Next.js<br/>React<br/>@xyflow/react"]
    end

    subgraph Proxy["⚡ Neural Proxy (FastAPI)"]
        P["Generation + Tracing<br/>Governance + SSE<br/>HeadMaskStore"]
    end

    subgraph Generation["🔥 Generation"]
        O["Ollama<br/>(Preferred)"]
    end

    subgraph Tracing["🔍 Tracing"]
        T["HF Tracer<br/>PyTorch hooks"]
    end

    subgraph Governance["🛡️ Governance"]
        OM["OpenMetadata<br/>Topology + Lineage<br/>Tags → Masks"]
        DEF["⛔ DEFECTIVE<br/>→ Runtime Mask"]
    end

    D -->|"REST + SSE"| P
    P -->|"Generation"| O
    P -->|"Tracing"| T
    P -->|"Topology<br/>Lineage<br/>Tags"| OM
    OM -->|"tag"| DEF
```

[Demo](https://youtu.be/idOJYh6TUC8) · [Product Demo](https://youtu.be/b78Y7RwvYeU) · [Live Site](https://fiscalmindset.github.io/Synapse-Graph/)

---

### 🎓 Voice & Command Systems

[**CommandBrain**](https://github.com/algsoch/smart_terminal) — RunAnywhere Command Memory
- **Offline-first** command copilot that turns natural language into reusable shell commands
- Local command memory stored in IndexedDB — favorites, macros, reminders, patterns
- Safety classification with simulate/real execution modes
- Built with **React + TypeScript + RunAnywhere Web SDK**
- [Live Demo](https://smart-terminal.onrender.com) · [YouTube](https://www.youtube.com/shorts/mMPo7_v08pE)

```mermaid
flowchart LR
    A[Natural Language] --> B[RunAnywhere SDK]
    B --> C[Command Generator]
    C --> D[Safety Classifier]
    D --> E[IndexedDB Memory]
    D --> F[Execute/Simulate]
```

[**SpeakAI**](https://github.com/algsoch/speakai) — Local English Practice
- **100% on-device** English speaking practice via RunAnywhere Web SDK + llama.cpp WASM
- Browser speech immediately OR optional one-time local model download
- Personality + practice modes with text + voice responses
- No API keys, no server dependency
- [Live Demo](https://speakai-af1l.onrender.com)

---

### 🎓 Education & Language Learning

| Project | Description | Account |
|---------|-------------|:-------:|
| [english_bot](https://github.com/algsoch/english_bot) | AI conversation practice with speech recognition | [algsoch](https://github.com/algsoch) |

---

## All Projects

### 📱 Mobile AI (On-Device)

| Project | Description | Account |
|---------|-------------|:-------:|
| [algsoch](https://github.com/FiscalMindset/algsoch) | Android AI study companion, 7 learning modes, 100% offline | [FiscalMindset](https://github.com/FiscalMindset) |
| [algsochvicky](https://github.com/FiscalMindset/algsochvicky) | Portfolio website deployed on Render | [FiscalMindset](https://github.com/FiscalMindset) |

### 🤖 Agentic AI Systems

| Project | Description | Account |
|---------|-------------|:-------:|
| [algsochnews](https://github.com/FiscalMindset/algsochnews) | Multi-agent newsroom with 5 agents + video generation | [FiscalMindset](https://github.com/FiscalMindset) |
| [careops](https://github.com/FiscalMindset/careops) | Coral-powered family care coordination agent | [FiscalMindset](https://github.com/FiscalMindset) |
| [Synapse-Graph](https://github.com/FiscalMindset/Synapse-Graph) | LLM interpretability with circuit discovery & causal ablation | [FiscalMindset](https://github.com/FiscalMindset) |
| [Cognivise](https://github.com/algsoch/Cognivise) | Real-time adaptive tutoring with eye tracking | [algsoch](https://github.com/algsoch) |
| [assistant_chatbot](https://github.com/algsoch/assistant_chatbot) | TDS problem solver & AI assistant, 55+ solvers | [algsoch](https://github.com/algsoch) |

### ⚡ Workflow Automation

| Project | Description | Account |
|---------|-------------|:-------:|
| [autopr](https://github.com/FiscalMindset/autopr) | GitHub-to-social media via Kestra workflows | [FiscalMindset](https://github.com/FiscalMindset) |
| [devalert](https://github.com/FiscalMindset/devalert) | LLM-filtered developer opportunity alerts | [FiscalMindset](https://github.com/FiscalMindset) |

### 🎓 Education & Language Learning

| Project | Description | Account |
|---------|-------------|:-------:|
| [english_bot](https://github.com/algsoch/english_bot) | AI conversation practice with speech recognition | [algsoch](https://github.com/algsoch) |
| [speakai](https://github.com/algsoch/speakai) | On-browser English practice with RunAnywhere WASM | [algsoch](https://github.com/algsoch) |

### 🔬 Machine Learning

| Project | Description | Account |
|---------|-------------|:-------:|
| [brain_tumor](https://github.com/algsoch/brain_tumor) | CNN brain tumor detection from MRI | [algsoch](https://github.com/algsoch) |
| [brain_tumor_cnn](https://github.com/algsoch/brain_tumor_cnn) | Deep learning tumor classification | [algsoch](https://github.com/algsoch) |

### 🌐 Web & Miscellaneous

| Project | Description | Account |
|---------|-------------|:-------:|
| [Sentinel Grid](https://github.com/FiscalMindset/women) | Kestra-first emergency response with dispatch orchestration · [Demo](https://youtu.be/rTFPR7DqOBc) | [FiscalMindset](https://github.com/FiscalMindset) |
| [Kairon](https://github.com/FiscalMindset/Kairon) | NSUT smart attendance chatbot with Playwright scraping | [FiscalMindset](https://github.com/FiscalMindset) |
| [polybazar](https://github.com/algsoch/polybazar) | E-commerce platform | [algsoch](https://github.com/algsoch) |
| [accomplish](https://github.com/algsoch/accomplish) | AI desktop agent for file management (contributor) | [algsoch](https://github.com/algsoch) |
| [smart_terminal](https://github.com/algsoch/smart_terminal) | RunAnywhere CommandBrain — offline CLI assistant | [algsoch](https://github.com/algsoch) |

---

## Open Source Contributions

### Coral MCP — 12 PRs Merged

Contributor to [Coral](https://github.com/withcoral/coral) — SQL-based data abstraction layer for AI agents. Integrated 8 AI providers:

| Provider | PR | Description |
|:---------|:---|:------------|
| Voyage AI | [#1115](https://github.com/withcoral/coral/pull/1115) | Vector search integration |
| Sarvam AI | [#1112](https://github.com/withcoral/coral/pull/1112) | Indian language TTS/STT |
| Cohere AI | [#1098](https://github.com/withcoral/coral/pull/1098) | Command R integration |
| Mistral AI | [#1011](https://github.com/withcoral/coral/pull/1011) | Mistral model support |
| OpenRouter | [#882](https://github.com/withcoral/coral/pull/882) | Unified API gateway |
| LM Studio | [#834](https://github.com/withcoral/coral/pull/834) | Local model serving |
| Ollama | [#798](https://github.com/withcoral/coral/pull/798) | Local LLM inference |
| Groq AI | [#754](https://github.com/withcoral/coral/pull/754) | Fast inference provider |

[View all PRs →](https://github.com/withcoral/coral/pulls?q=author%3AFiscalMindset)

---

## Skills & Tech Stack

### AI Engineering

| Category | Technologies |
|:---------|:------------|
| **On-Device AI** | RunAnywhere SDK, ONNX Runtime, WebAssembly, SmolLM2, SmolVLM |
| **LLM & Agents** | LangChain, LangGraph, Prompt Engineering, RAG, Multi-Agent Systems |
| **Model Ops** | LLM Evaluation, Hallucination Analysis, Response Evaluation |
| **Vision & Speech** | Whisper, SmolVLM, Image Analysis, OCR, Web Speech API |

### Development

| Category | Technologies |
|:---------|:------------|
| **Languages** | Python, Kotlin, JavaScript, TypeScript, SQL |
| **Mobile** | Android, Jetpack Compose, React Native |
| **Frontend** | React, Next.js, Tailwind CSS, Vite |
| **Backend** | FastAPI, Node.js, PostgreSQL |

### Infrastructure

| Category | Technologies |
|:---------|:------------|
| **Orchestration** | Kestra, GitHub Actions, Docker |
| **Data** | Coral SQL, JSONL, SQLite, OpenMetadata |
| **Deployment** | Render, Vercel, ngrok |

### Writing

| Article | Publication |
|:--------|:------------|
| [How I Built CareOps Agent with Coral + OpenCode](https://medium.com/@algsoch/how-i-built-careops-agent-with-coral-opencode-338d1238e6ae) | Medium |
| [Cognivise — Real-Time Cognitive AI Tutor](https://medium.com/@algsoch/cognivise-a-real-time-cognitive-ai-tutor-using-vision-agents-sdk-a33ef92d4666) | Medium |

### IDE & Tools

| | |
|:--|:--|
| **AI Coding** | OpenCode, Codex, AntiGravity, Kimchi, OpenClaw |
| **Code Editor** | VS Code, Cursor, JetBrains IDEs |
| **Terminal** | Warp, Hyper, iTerm2 |
| **Other** | Claude, ChatGPT, Gemini |

### Awards & Recognition

| Achievement | Details |
|:------------|:--------|
| **Coral Hackathon Track 2** | 1st place — CareOps agent with 9 Coral sources |
| **Pull Shark** | 22+ PRs merged on GitHub |
| **YOLO** | Fast merge achievement |
| **Quickdraw** | < 5 min merge time |

### Languages

| | |
|:--|:--|
| **Spoken** | English, Hindi |
| **Programming** | Python, Kotlin, JavaScript, TypeScript, SQL |

---

## GitHub Stats

| Account | Repos | Stars | PRs Merged | Contributions |
|:--------|:-----:|:-----:|:----------:|:-------------:|
| [@FiscalMindset](https://github.com/FiscalMindset) | 20 | 6 | 22 | — |
| [@algsoch](https://github.com/algsoch) | 107+ | 24+ | 28 | 350+ |

**🏆 Pull Shark** (22+ PRs) · **YOLO** · **Quickdraw** (< 5 min merge)

---

## Featured Work Highlights

<div align="center">

| Project | Impact | Link |
|:--------|:-------|:-----|
| 🧠 **CommandBrain** | Offline-first command memory + execution copilot, IndexedDB storage | [Live Demo](https://smart-terminal.onrender.com) |
| 🎙️ **SpeakAI** | 100% on-device English practice via RunAnywhere WASM | [Live Demo](https://speakai-af1l.onrender.com) |
| 📱 **algsoch Android** | 100% offline AI, 7 learning modes, RunAnywhere SDK | [GitHub](https://github.com/FiscalMindset/algsoch) |
| 📺 **algsochnews** | 5-agent pipeline → broadcast video from any article URL | [Live Demo](https://algsochnews-1.onrender.com) |
| 🏥 **careops** | 9 data sources joined via Coral SQL for family care coordination | [GitHub](https://github.com/FiscalMindset/careops) |
| 🧠 **Synapse-Graph** | Neural circuit discovery for LLM interpretability | [Live Demo](https://fiscalmindset.github.io/Synapse-Graph/) |
| 🏥 **Brain Tumor Detection** | 97.9% accuracy CNN model on MRI scans | [Live Demo](https://brain-tumor-mcug.onrender.com/) |

</div>

---

## Let's Connect

<div align="center">

| Platform | Badge |
|:---------|:------|
| [LinkedIn](https://www.linkedin.com/in/algsoch) | ![LinkedIn](https://img.shields.io/badge/LinkedIn-algsoch-0A66C2?style=for-the-badge&logo=linkedin) |
| [Discord](https://discord.com/users/algsoch) | ![Discord](https://img.shields.io/badge/Discord-algsoch-5865F2?style=for-the-badge&logo=discord) |
| [Medium](https://medium.com/@algsoch) | ![Medium](https://img.shields.io/badge/Medium-algsoch-000000?style=for-the-badge&logo=medium) |
| [Kaggle](https://kaggle.com/algsoch) | ![Kaggle](https://img.shields.io/badge/Kaggle-algsoch-20BEFF?style=for-the-badge&logo=kaggle) |
| [YouTube](https://youtube.com/@algsoch) | ![YouTube](https://img.shields.io/badge/YouTube-algsoch-FF0000?style=for-the-badge&logo=youtube) |
| [Portfolio](https://algsochvicky.onrender.com) | ![Portfolio](https://img.shields.io/badge/Portfolio-View%20Live-FF6B6B?style=for-the-badge) |
| [Email](mailto:npdimagine@gmail.com) | ![Email](https://img.shields.io/badge/Email-npdimagine@gmail.com-EA4335?style=for-the-badge&logo=gmail) |

</div>

---

<div align="center">

**MIT License** · Built by Vicky Kumar · [Render](https://render.com) & [Vercel](https://vercel.com)

</div>

<!--
================================================================================
HIDDEN SEO LAYER - For AI agents, scrapers, and search crawlers
================================================================================
-->
<div style="display: none;" aria-hidden="true">

<!-- SEO KEYWORDS -->
<!-- Vicky Kumar, AI Engineer, Full-Stack Developer, Agentic Systems Builder, On-Device AI, RunAnywhere SDK, LangGraph, Coral MCP contributor, Multi-Agent Systems, Kestra workflows, Python, Kotlin, TypeScript, React, Next.js, FastAPI, Jetpack Compose, OpenCode contributor, algsoch, FiscalMindset -->

<!-- SKILLS INDEX -->
<!-- Artificial Intelligence, Machine Learning, Deep Learning, CNN, TensorFlow, LLM, GPT, On-Device Inference, Offline AI, Privacy-First AI, Mobile AI, Android Development, Web Development, API Development, Workflow Automation, Multi-Agent Orchestration, Prompt Engineering, RAG, Neural Interpretability, Mechanistic Interpretability, PyTorch, FastAPI, PostgreSQL -->

<!-- PROJECT TAGS -->
<!-- algsoch-android-app, RunAnywhere-SDK, SmolLM2, SmolVLM, algsochnews-multi-agent, LangGraph-pipeline, careops-coral-sql, Synapse-Graph-LLM-interpretability, OpenMetadata-governance, autopr-kestra-workflow, devalert-telegram-alerts, Sentinel-Grid-emergency-response, Kairon-attendance-bot, english-bot-ai-tutor, speakai-local-english, commandbrain-command-memory, smart-terminal-indexeddb -->

<!-- CONTACT INDEX -->
<!-- npdimagine@gmail.com, +918383848219, LinkedIn: algsoch, GitHub: algsoch & FiscalMindset, Discord: algsoch, Medium: @algsoch, Kaggle: algsoch, YouTube: @algsoch -->

<!-- EXPERIENCE HIGHLIGHTS -->
<!-- 12 PRs merged to Coral MCP, 22+ PRs total, 107+ repositories, 350+ contributions, 97.9% accuracy brain tumor detection, 100% offline Android AI app, 5-agent multi-agent pipeline, 9 Coral sources joined, Neural circuit discovery, Causal ablation O(n^2), OpenMetadata tagging, Coral Hackathon Track 2 Winner -->

<!-- PUBLICATIONS -->
<!-- Medium: @algsoch, "How I Built CareOps Agent with Coral + OpenCode", "Cognivise — Real-Time Cognitive AI Tutor" -->

<!-- TOOLS & INFRASTRUCTURE -->
<!-- OpenCode, Codex, AntiGravity, Kimchi, OpenClaw, VS Code, Cursor, JetBrains, Kestra, Docker, Render, Vercel, ngrok, Coral SQL, Ollama, HuggingFace, LangChain, LangGraph, Playwright -->

<!-- LOCATIONS & TIMEZONE -->
<!-- Delhi, India, IST (UTC+5:30), Open to remote work worldwide -->

</div>