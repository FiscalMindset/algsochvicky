export type SystemDiagram = {
  title: string;
  definition: string;
};

export const systemDiagrams: Record<string, SystemDiagram[]> = {
  algsoch: [
    {
      title: "System Architecture",
      definition: `flowchart TB
    subgraph UI["Algsoch UI (Jetpack Compose)"]
        CS["Chat Screen"]
        MS["Mode Selection"]
        ST["Settings"]
    end
    subgraph SVC["ViewModels & Services"]
        PB["PromptBuilder"]
        RP["ResponseParser"]
        MDM["ModelDownloadManager"]
    end
    subgraph SDK["RunAnywhere SDK Core"]
        MR["Model Registry"]
        DM["Download Manager"]
        IE["Inference Engine"]
    end
    subgraph BACK["Local Model Backends"]
        LLAMA["llama.cpp</br>SmolLM2"]
        ONNX["ONNX Runtime</br>SmolVLM + Whisper"]
    end
    UI --> SVC --> SDK --> BACK`,
    },
    {
      title: "Model Download Flow",
      definition: `flowchart LR
        START(["First Launch"]) --> CHECK{"Models cached?"}
        CHECK -->|"Yes"| LOAD["Load from device storage"]
        CHECK -->|"No"| DL["Download from HuggingFace"]
        DL --> CACHE["HTTP download</br>with resume support"]
        CACHE --> MANAGE["RunAnywhere SDK manages</br>progress + cache + disk space"]
        MANAGE --> READY["Models Ready"]
        LOAD --> READY
        READY --> INFER["Instant AI responses</br>powered by local models"]`,
    },
  ],
  speakai: [
    {
      title: "Voice Practice Flow",
      definition: `flowchart TB
        USER(("User")) --> OPEN["Open SpeakAI App"]
        OPEN --> CHOICE{"Choose path"}
        CHOICE -->|"Skip download"| SPEECH["Browser Speech API</br>Web Speech API"]
        CHOICE -->|"Download model"| RW["RunAnywhere Web SDK</br>llama.cpp WASM"]
        RW --> CACHE["~300MB model</br>cached in browser"]

        subgraph PRACTICE["Practice Workflow"]
            MIC["Click mic / Press Space"] --> TRANSCRIBE["Speech → Transcript"]
            TRANSCRIBE --> AI["Local AI inference"]
            AI --> REPLY["Text + Voice Response"]
        end

        SPEECH --> PRACTICE
        CACHE --> PRACTICE
        REPLY --> USER`,
    },
    {
      title: "Feature Flow",
      definition: `flowchart LR
        subgraph MODES["Interaction Modes"]
            PERS["Personality Selection"]
            MODE["Practice Mode"]
        end
        BROWSER["Browser Speech"] --> APP["SpeakAI"]
        LOCAL["Local Model Cache"] --> APP
        APP --> MODES
        MODES --> FEEDBACK["Text + Voice</br>Feedback Loop"]`,
    },
  ],
  careops: [
    {
      title: "Architecture",
      definition: `flowchart TD
    subgraph App["CareOps Application"]
        UI["Next.js UI"] --> API["Next.js API Routes"]
        API --> Client["Coral CLI Client\n(coral-cli-client.ts)"]
        Client --> CLI["coral sql --format json"]
    end

    subgraph Coral["Coral Query Layer"]
        CLI --> JOIN["Cross-Source JOIN\n(patient_id key)"]
        JOIN --> PAT["careops_patients\npatient demographics"]
        JOIN --> MED["careops_medications\nmedication records"]
        JOIN --> LAB["careops_lab_reports\nlab test results"]
        JOIN --> CHAT["careops_doctor_chats\ndoctor instructions"]
        JOIN --> PHARM["careops_pharmacy_receipts\nrefill evidence"]
        JOIN --> SYMP["careops_symptom_logs\nsymptom tracking"]
        JOIN --> APPT["careops_appointments\nappointment calendar"]
        JOIN --> OCR["careops_prescription_ocr\nOCR prescriptions"]
        JOIN --> NOTES["careops_family_notes\ncaregiver notes"]
    end

    subgraph Storage["Data Backend"]
        MED --> JSONL["data/*.jsonl\n73 records across 9 files"]
        LAB --> JSONL
        CHAT --> JSONL
        PHARM --> JSONL
        SYMP --> JSONL
        APPT --> JSONL
        OCR --> JSONL
        NOTES --> JSONL
        PAT --> JSONL
    end

    CLI --> Result["Joined SQL Result"]
    Result --> Agent["CareOps Packet Generator"]
    Agent --> Packet["Doctor Visit Packet"]
    Packet --> Evidence["SQL Evidence Panel"]

    style PAT fill:#e0f2fe,stroke:#0284c7
    style JOIN fill:#f0fdf4,stroke:#15803d
    style JSONL fill:#fef2f2,stroke:#b91c1c`,
    },
    {
      title: "Tech Stack",
      definition: `graph TB
    subgraph Frontend["Frontend"]
        NEXT["Next.js 15 App Router"]
        TS["TypeScript"]
        TW["Tailwind CSS"]
        LI["Lucide Icons"]
    end

    subgraph Query["Query Layer"]
        CC["CoralClient\nmode-switching abstraction"]
        CCLI["Coral CLI Client\nsafe execFile wrapper"]
        CP["Coral Output Parser\nJSON result parser"]
    end

    subgraph Coral["Coral Engine"]
        CSQL["coral sql --format json"]
        CLINT["coral source lint"]
        CADD["coral source add"]
        CTEST["coral source test"]
    end

    subgraph Sources["9 Coral Source Specs\nregistered via coral source add --file"]
        PAT["careops_patients\npatient demographics"]
        MED["careops_medications\nmedication records"]
        LAB["careops_lab_reports\nlab test results"]
        CHAT["careops_doctor_chats\ndoctor instructions"]
        PHARM["careops_pharmacy_receipts\nrefill evidence"]
        SYMP["careops_symptom_logs\nsymptom tracking"]
        APPT["careops_appointments\nappointment calendar"]
        OCR["careops_prescription_ocr\nOCR prescriptions"]
        NOTES["careops_family_notes\ncaregiver notes"]
    end

    subgraph Data["Data Layer"]
        JSONL["JSONL Files\n9 files, 73 total rows"]
        CSV["CSV Files\n9 files (SQLite fallback)"]
    end

    subgraph Agent["Agent Layer"]
        AGT["CareOps Packet Generator\n10+ query pipeline"]
        QRY["Query Builders\n8 typed SQL templates"]
        SAFE["Safety Rules Engine\nno diagnosis/prescription"]
    end

    NEXT --> CC
    CC --> CCLI
    CCLI --> CSQL
    CSQL --> CLINT
    CSQL --> CADD
    CSQL --> CTEST
    CCLI --> CP
    CP --> AGT
    CSQL --> Sources
    Sources --> JSONL
    Sources --> CSV
    AGT --> QRY
    AGT --> SAFE
    QRY --> Sources`,
    },
  ],
  "algsoch-news": [
    {
      title: "5-Agent Pipeline",
      definition: `flowchart LR
    A["Article Extraction Agent"] --> B["News Editor Agent"]
    B --> C["Visual Packaging Agent"]
    C --> D["QA / Evaluation Agent"]
    D -->|Pass| E["Video Generation Agent"]
    E --> F["Finalize JSON + Screenplay + MP4"]
    D -->|Retry Editorial| B
    D -->|Retry Packaging| C`,
    },
  ],
};
