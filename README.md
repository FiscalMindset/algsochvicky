<!-- Profile Section -->
<table>
<tr>
<td rowspan="3">
<img src="https://avatars.githubusercontent.com/u/254638087?v=4" width="120" height="120" style="border-radius: 50%;">
</td>
<td>

# Vicky Kumar

**Software Engineer** · **AI Engineer** · **Agentic Systems Builder**

[![GitHub](https://img.shields.io/badge/GitHub-FiscalMindset-181717?style=flat&logo=github)](https://github.com/FiscalMindset)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-algsoch-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/algsoch)
[![Portfolio](https://img.shields.io/badge/Portfolio-algsochvicky.onrender.com-FF6B6B?style=flat)](https://algsochvicky.onrender.com)

Building AI products and real-world systems

</td>
</tr>
</table>

---

## 🏅 GitHub Achievements

<div style="display: flex; gap: 16px; flex-wrap: wrap;">

[![Pull Shark](https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png)](https://github.com/FiscalMindset?achievement=pull-shark&tab=achievements)
[![YOLO](https://github.githubassets.com/assets/yolo-default-be0bbff04951.png)](https://github.com/FiscalMindset?achievement=yolo&tab=achievements)
[![Quickdraw](https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png)](https://github.com/FiscalMindset?achievement=quickdraw&tab=achievements)

</div>

| Achievement | Description | Earned |
|-------------|-------------|--------|
| 🦈 Pull Shark | 22+ pull requests merged | ✅ |
| 💥 YOLO | Merged PR without review | ✅ |
| ⚡ Quickdraw | PR merged in < 5 minutes | ✅ |

---

## 📊 GitHub Stats

### @FiscalMindset (Primary)

| Metric | Count |
|--------|-------|
| ⬆️ Commits | 42 |
| 🔀 Pull Requests | 22 |
| 🐛 Issues | 12 |
| 📦 Public Repos | 20 |
| ⭐ Stars | 6 |

### @algsoch (Legacy)

| Metric | Count |
|--------|-------|
| ⬆️ Commits | 217 |
| 🔀 Pull Requests | 28 |
| 📦 Public Repos | 107 |
| ⭐ Stars | 24 |
| 👥 Followers | 6 |

---

## 🐙 Coral MCP Contributions

**12 PRs** merged/open to [withcoral/coral](https://github.com/withcoral/coral)

| Source | PR | Status |
|--------|-----|--------|
| Voyage AI | [#1115](https://github.com/withcoral/coral/pull/1115) | ✅ Merged |
| Sarvam AI | [#1112](https://github.com/withcoral/coral/pull/1112) | ✅ Merged |
| Cohere AI | [#1098](https://github.com/withcoral/coral/pull/1098) | ✅ Merged |
| Mistral AI | [#1011](https://github.com/withcoral/coral/pull/1011) | ✅ Merged |
| OpenRouter | [#882](https://github.com/withcoral/coral/pull/882) | ✅ Merged |
| LM Studio | [#834](https://github.com/withcoral/coral/pull/834) | ✅ Merged |
| Ollama | [#798](https://github.com/withcoral/coral/pull/798) | ✅ Merged |
| Groq AI | [#754](https://github.com/withcoral/coral/pull/754) | ✅ Merged |
| Deepgram ASR | [#1118](https://github.com/withcoral/coral/pull/1118) | 🔄 Open |
| NVIDIA NIM | [#958](https://github.com/withcoral/coral/pull/958) | 🔄 Open |

---

## 🛠️ Tech Stack

**Frontend**
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

**AI/ML**
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat&logo=tensorflow&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white)

**Tools**
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)
![Coral MCP](https://img.shields.io/badge/Coral%20MCP-FF6B6B?style=flat)

---

## 📐 Architecture Overview

### System Architecture

```mermaid
graph TB
    subgraph Frontend
        A[React + TypeScript + Vite]
        B[Tailwind CSS]
        C[Framer Motion]
    end
    
    subgraph AI Runtime
        D[RunAnywhere WASM]
        E[Llama.cpp WebGPU]
        F[Groq API Fallback]
    end
    
    subgraph Agent System
        G[Portfolio Agent Engine]
        H[Knowledge Base]
        I[Response Synthesizer]
    end
    
    subgraph GitHub Integration
        J[Repo Intelligence]
        K[Contribution Stats]
        L[Achievement Tracker]
    end
    
    A --> B & C
    D --> E
    A --> D & F
    G --> H & I
    A --> G
    J --> K & L
    A --> J
```

### Agent Response Pipeline

```mermaid
sequenceDiagram
    participant U as User
    participant A as Agent Engine
    participant K as Knowledge Base
    participant S as Synthesizer
    participant R as Runtime

    U->>A: Question
    A->>K: Retrieve evidence
    K-->>A: Context
    A->>S: Build reasoning
    alt Local Model Active
        S->>R: Generate on-device
        R-->>S: Response
    else Fallback
        S->>S: Deterministic synthesis
    end
    S-->>U: Final response
```

### Deployment Architecture

```mermaid
graph LR
    A[GitHub] -->|Push| B[CI/CD]
    B -->|Build| C[Vercel / Render]
    C -->|Static Files| D[CDN Edge]
    
    E[API Routes] -->|Groq Proxy| F[Groq API]
    
    D <-->|WASM Assets| G[Browser OPFS]
    D <-->|Runtime| G
```

---

## 📁 Project Structure

```
vicky/
├── src/
│   ├── app/
│   │   └── App.tsx              # Main app shell
│   ├── components/
│   │   ├── sections/            # Page sections
│   │   │   ├── hero-section.tsx
│   │   │   ├── github-intelligence-section.tsx
│   │   │   ├── portfolio-agent-section.tsx
│   │   │   └── local-runtime-section.tsx
│   │   └── ui/                  # Design system
│   ├── content/
│   │   └── portfolio.ts         # Central content config
│   ├── features/
│   │   ├── agent/               # Portfolio agent
│   │   ├── github/              # GitHub integration
│   │   └── runanywhere/         # Local AI runtime
│   └── styles/
│       └── globals.css          # Design tokens
├── api/
│   └── groq.js                  # Groq proxy for Vercel
├── server/
│   └── groq-proxy.mjs           # Render deployment
├── public/
│   └── images/
│       └── vicky-kumar.png      # Profile photo
└── render.yaml                  # Render blueprint
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/FiscalMindset/algsochvicky.git
cd algsochvicky

# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

### Environment Variables

Create a `.env` file:

```bash
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-8b-instant
VITE_GROQ_PROXY_URL=
```

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🤖 Portfolio Agent | Interactive AI agent with 5 modes (Recruiter, Client, Technical, Project Explorer, AI Capability) |
| 🖥️ Local Runtime | Browser-local AI inference via RunAnywhere WASM |
| 📊 GitHub Intelligence | Dual-account stats, achievements, Coral MCP contributions |
| 🌙 Dark Theme | Premium dark technical luxury design |
| 📱 Responsive | Mobile-first responsive layout |
| ⚡ Fast | Vite-powered builds with code splitting |

---

## 📜 License

MIT License - feel free to use this as a template for your own portfolio.

---

## 📬 Contact

- **GitHub**: [@FiscalMindset](https://github.com/FiscalMindset)
- **LinkedIn**: [algsoch](https://www.linkedin.com/in/algsoch)
- **Portfolio**: [algsochvicky.onrender.com](https://algsochvicky.onrender.com)