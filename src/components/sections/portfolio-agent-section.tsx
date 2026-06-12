import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { suggestedQuestions } from "../../content/portfolio";
import { answerPortfolioQuestion } from "../../features/agent/engine";
import { isGroqProxyAvailable } from "../../features/agent/groq-provider";
import type { AgentInferenceMode, AgentMode, AgentResponse } from "../../features/agent/types";
import { useRunAnywhereRuntime } from "../../features/runanywhere/runtime-provider";
import { Button } from "../ui/button";
import { RichResponse } from "../ui/rich-response";
import { SectionHeading } from "../ui/section-heading";

const modes: { id: AgentMode; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "recruiter", label: "Recruiter Mode" },
  { id: "client", label: "Client Mode" },
  { id: "technical", label: "Technical Deep Dive" },
  { id: "project", label: "Project Explorer" },
  { id: "capability", label: "AI Capability Mode" }
];

const inferenceModes: { id: AgentInferenceMode; label: string }[] = [
  { id: "fallback", label: "Rule-Based" },
  { id: "auto", label: "Smart Route" },
  { id: "groq", label: "Groq Test" },
  { id: "local", label: "Local Runtime" }
];

export function PortfolioAgentSection() {
  const { snapshot, activate, bridge } = useRunAnywhereRuntime();
  const groqAvailable = isGroqProxyAvailable();
  const [query, setQuery] = useState(suggestedQuestions[0]);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [mode, setMode] = useState<AgentMode>("auto");
  const [inferenceMode, setInferenceMode] = useState<AgentInferenceMode>("fallback");
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [streamedText, setStreamedText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const visibleInferenceModes = groqAvailable ? inferenceModes : inferenceModes.filter((entry) => entry.id !== "groq");

  const filteredSuggestions = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) {
      return suggestedQuestions.slice(0, 6);
    }

    return suggestedQuestions.filter((question) => question.toLowerCase().includes(normalized)).slice(0, 6);
  }, [deferredQuery]);

  async function handleAsk() {
    if (!query.trim()) {
      return;
    }

    setIsRunning(true);
    setStreamedText("");
    setResult(null);
    setSubmittedQuery(query);

    const runtime =
      inferenceMode === "fallback"
        ? null
        : inferenceMode === "local"
          ? bridge
          : snapshot.modelStatus === "active"
            ? bridge
            : null;

    const nextResult = await answerPortfolioQuestion({
      query,
      mode,
      inferenceMode,
      runtime,
      onToken: setStreamedText
    });

    startTransition(() => {
      setResult(nextResult);
    });

    setIsRunning(false);
  }

  const providerLabel = result
    ? `${result.providerLabel}${result.providerModel ? ` • ${result.providerModel}` : ""}`
    : inferenceMode === "fallback"
      ? "Rule-Based Portfolio Engine"
      : inferenceMode === "groq"
        ? "Groq Test Path"
        : inferenceMode === "local"
          ? "RunAnywhere Local"
          : snapshot.modelStatus === "active"
            ? "Smart Route • Local Ready"
            : "Smart Route";

  return (
    <section id="agent" className="section-space">
      <div className="section-frame">
        <div className="rounded-xl border border-orange-500/50 bg-black/10 p-5 sm:rounded-2xl sm:border-2 sm:p-6 lg:rounded-3xl lg:p-10">
        <SectionHeading
          eyebrow="Portfolio Chat"
          title="Ask about my projects and skills."
          description="A simple chat interface to learn more about my work. Uses local AI to answer questions about my projects, technologies I've learned, and what I'm looking for."
          aside={
            <p>
              Built as a learning project to understand how to integrate local AI into a web app.
            </p>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent/75">Ask Vicky</div>
                <div className="mt-2 text-sm leading-7 text-muted">
                  Ask about fit, architecture, project comparisons, voice AI, on-device runtime, or product thinking.
                </div>
              </div>

              <Button
                variant={snapshot.modelStatus === "active" ? "primary" : "secondary"}
                onClick={() => void activate()}
                disabled={snapshot.modelStatus === "downloading" || snapshot.modelStatus === "loading"}
                className="w-full justify-center lg:w-auto"
              >
                {snapshot.modelStatus === "active" ? "Local Model Active" : "Activate Local Model"}
              </Button>
            </div>

            <div className="mt-5 rounded-[24px] border border-line/70 bg-black/15 p-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Inference path</div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {visibleInferenceModes.map((entry) => (
                  <button
                    key={entry.id}
                    className={`rounded-2xl border px-3 py-2.5 text-xs sm:text-sm transition ${
                      entry.id === inferenceMode
                        ? "border-accent/40 bg-accent/12 text-ink"
                        : "border-line/75 bg-white/4 text-muted hover:text-ink"
                    }`}
                    onClick={() => setInferenceMode(entry.id)}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm leading-7 text-muted">
                {inferenceMode === "fallback"
                  ? "Rule-Based mode uses deterministic portfolio logic: intent detection, repository ranking, project matching, and structured answer composition without depending on a live model."
                  : groqAvailable
                    ? "Groq test mode uses a server-side proxy, so the key stays off the client. Local mode still uses RunAnywhere when you want browser-local inference."
                    : "This static deployment uses the rule-based engine or local runtime by default. Groq can still be re-enabled later by pointing `VITE_GROQ_PROXY_URL` at an external proxy."}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {modes.map((entry) => (
                <button
                  key={entry.id}
                  className={`rounded-2xl border px-3 py-2.5 text-xs sm:text-sm transition ${
                    entry.id === mode
                      ? "border-accent/40 bg-accent/12 text-ink"
                      : "border-line/75 bg-white/4 text-muted hover:text-ink"
                  }`}
                  onClick={() => setMode(entry.id)}
                >
                  {entry.label}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[28px] border border-line/75 bg-black/15 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink">
                  {inferenceMode === "fallback" ? "Rule-Based Active" : "Live Inference Optional"}
                </span>
                <span className="rounded-full border border-line/70 bg-white/4 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Responsive portfolio brief
                </span>
              </div>

              <textarea
                className="min-h-[150px] w-full resize-none bg-transparent text-base leading-7 text-ink outline-none placeholder:text-muted"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask why Vicky is a strong fit for an AI role, compare systems, or inspect architecture decisions."
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Button onClick={() => void handleAsk()} disabled={isRunning} className="w-full justify-center">
                  {isRunning ? "Generating Answer" : "Run Portfolio Agent"}
                </Button>
                <Button variant="secondary" href="#runtime" className="w-full justify-center">
                  Inspect Runtime Layer
                </Button>
              </div>
            </div>

            <div className="mt-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Suggested prompts</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {filteredSuggestions.map((question) => (
                  <button
                    key={question}
                    className="rounded-[22px] border border-line/70 bg-white/4 p-4 text-left text-sm leading-7 text-muted transition hover:border-accent/30 hover:text-ink"
                    onClick={() => setQuery(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Response</div>
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-line/80 px-3 py-1 text-xs text-muted">
                  <Sparkles size={14} />
                  {providerLabel}
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-line/70 bg-black/15 p-4 sm:p-5">
                {submittedQuery ? (
                  <div className="mb-4 rounded-[22px] border border-line/70 bg-white/4 p-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent/75">User query</div>
                    <div className="mt-2 text-sm leading-7 text-ink">{submittedQuery}</div>
                  </div>
                ) : null}

                <div className="mb-3 text-sm font-semibold text-ink">
                  {result?.modeLabel ?? "The agent will detect the right response mode from the question."}
                </div>

                <div className="rounded-[22px] border border-line/70 bg-white/4 p-4 sm:p-5">
                  <RichResponse
                    content={streamedText || result?.answer || ""}
                    empty="Ask a question to see the agent route intent, gather signal, and respond."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Signal path</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {(result?.reasoning ?? [
                  "Intent routing adapts the answer style to the user's real goal.",
                  "Repository ranking and project matching pull the strongest signal first.",
                  "Rule-based mode stays available even if no live model provider is active."
                ]).map((item) => (
                  <div key={item} className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm leading-5 sm:leading-7 text-muted">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-4 sm:p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Lead evidence</div>
                <div className="mt-4 grid gap-3">
                  {(result?.evidence ?? []).length ? (
                    result?.evidence.map((entry) => (
                      <div key={entry.title} className="rounded-2xl border border-line/70 bg-white/4 p-3">
                        <div className="text-sm font-semibold text-ink">{entry.title}</div>
                        <div className="mt-2 text-sm leading-5 sm:leading-7 text-muted">{entry.summary}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm leading-5 sm:leading-7 text-muted">
                      Evidence cards will show which portfolio facts and systems the answer was built from.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-4 sm:p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Suggested follow-ups</div>
                <div className="mt-4 grid gap-3">
                  {(result?.followUps ?? [
                    "Which project best demonstrates agentic AI capability?",
                    "How does he think about turning AI into usable products?",
                    "What kind of systems can he build for a client?"
                  ]).map((item) => (
                    <button
                      key={item}
                      className="rounded-2xl border border-line/70 bg-white/4 p-3 text-left text-sm leading-5 sm:leading-7 text-muted transition hover:border-accent/30 hover:text-ink"
                      onClick={() => setQuery(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}

