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
  { id: "groq", label: "Groq Test" },
  { id: "auto", label: "Auto Route" },
  { id: "local", label: "Local Runtime" },
  { id: "fallback", label: "Fallback Only" }
];

export function PortfolioAgentSection() {
  const { snapshot, activate, bridge } = useRunAnywhereRuntime();
  const groqAvailable = isGroqProxyAvailable();
  const [query, setQuery] = useState(suggestedQuestions[0]);
  const [mode, setMode] = useState<AgentMode>("auto");
  const [inferenceMode, setInferenceMode] = useState<AgentInferenceMode>(import.meta.env.DEV ? "groq" : groqAvailable ? "auto" : "fallback");
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [streamedText, setStreamedText] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const visibleInferenceModes = groqAvailable ? inferenceModes : inferenceModes.filter((entry) => entry.id !== "groq");

  const filteredSuggestions = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) {
      return suggestedQuestions.slice(0, 5);
    }

    return suggestedQuestions.filter((question) => question.toLowerCase().includes(normalized)).slice(0, 5);
  }, [deferredQuery]);

  async function handleAsk() {
    if (!query.trim()) {
      return;
    }

    setIsRunning(true);
    setStreamedText("");
    setResult(null);

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

  return (
    <section id="agent" className="section-space">
      <div className="section-frame">
        <SectionHeading
          eyebrow="Advanced Portfolio Agent"
          title="A portfolio agent that routes intent, grounds evidence, and answers with signal."
          description="This is not a fake FAQ bot. The agent detects audience intent, retrieves high-signal context from the portfolio knowledge base, adapts response style, and can answer through a fast Groq test path or the local RunAnywhere runtime."
          aside={
            <p>
              Recruiter, client, collaborator, founder, or technical interviewer: the system is meant to answer
              differently depending on what the user is really trying to understand.
            </p>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent/75">Ask Vicky</div>
                <div className="mt-2 text-sm text-muted">
                  Ask about fit, architecture, project comparisons, voice AI, on-device runtime, or product thinking.
                </div>
              </div>

              <Button
                variant={snapshot.modelStatus === "active" ? "primary" : "secondary"}
                onClick={() => void activate()}
                disabled={snapshot.modelStatus === "downloading" || snapshot.modelStatus === "loading"}
              >
                {snapshot.modelStatus === "active" ? "Local Model Active" : "Activate Local Model"}
              </Button>
            </div>

            <div className="mt-5 rounded-[24px] border border-line/70 bg-black/15 p-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Inference path</div>
              <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2">
                {visibleInferenceModes.map((entry) => (
                  <button
                    key={entry.id}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                      entry.id === inferenceMode
                        ? "border-accent/40 bg-accent/12 text-ink"
                        : "border-line/75 text-muted hover:text-ink"
                    }`}
                    onClick={() => setInferenceMode(entry.id)}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm text-muted">
                {groqAvailable
                  ? "Groq test mode uses a server-side proxy, so the key stays off the client. Local mode still uses RunAnywhere when you want browser-local inference."
                  : "This static deployment uses local runtime or curated fallback by default. Groq can still be re-enabled later by pointing `VITE_GROQ_PROXY_URL` at an external proxy."}
              </div>
            </div>

            <div className="mt-5 flex snap-x gap-2 overflow-x-auto pb-2">
              {modes.map((entry) => (
                <button
                  key={entry.id}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                    entry.id === mode ? "border-accent/40 bg-accent/12 text-ink" : "border-line/75 text-muted hover:text-ink"
                  }`}
                  onClick={() => setMode(entry.id)}
                >
                  {entry.label}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[28px] border border-line/75 bg-black/15 p-4">
              <textarea
                className="min-h-[130px] w-full resize-none bg-transparent text-base text-ink outline-none placeholder:text-muted"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask why Vicky is a strong fit for an AI role, compare systems, or inspect architecture decisions."
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={() => void handleAsk()} disabled={isRunning}>
                  {isRunning ? "Generating Answer" : "Run Portfolio Agent"}
                </Button>
                <Button variant="secondary" href="#runtime">
                  Inspect Runtime Layer
                </Button>
              </div>
            </div>

            <div className="mt-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Suggested prompts</div>
              <div className="mt-3 grid gap-3">
                {filteredSuggestions.map((question) => (
                  <button
                    key={question}
                    className="rounded-[22px] border border-line/70 bg-white/4 p-4 text-left text-sm text-muted transition hover:border-accent/30 hover:text-ink"
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
              <div className="flex items-center justify-between">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Response</div>
                <div className="inline-flex items-center gap-2 rounded-full border border-line/80 px-3 py-1 text-xs text-muted">
                  <Sparkles size={14} />
                  {result
                    ? `${result.providerLabel}${result.providerModel ? ` • ${result.providerModel}` : ""}`
                    : inferenceMode === "groq"
                      ? "Groq Test Path"
                      : inferenceMode === "local"
                        ? "RunAnywhere Local"
                        : inferenceMode === "fallback"
                          ? "Curated Fallback"
                          : snapshot.modelStatus === "active"
                            ? "Auto Route • Local Ready"
                            : "Auto Route"}
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-line/70 bg-black/15 p-5">
                <div className="mb-3 text-sm font-semibold text-ink">
                  {result?.modeLabel ?? "The agent will detect the right response mode from the question."}
                </div>
                <RichResponse
                  content={streamedText || result?.answer || ""}
                  empty="Ask a question to see the agent route intent, gather signal, and respond."
                />
              </div>
            </div>

            <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Signal path</div>
              <div className="mt-4 grid gap-3">
                {(result?.reasoning ?? [
                  "Intent routing will adapt the response style to the question.",
                  "Evidence retrieval will prioritize systems and knowledge with the strongest signal.",
                  "Groq test mode can answer quickly through the server-side proxy, while local mode stays available for browser-runtime testing."
                ]).map((item) => (
                  <div key={item} className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Lead evidence</div>
                <div className="mt-4 grid gap-3">
                  {(result?.evidence ?? []).length ? (
                    result?.evidence.map((entry) => (
                      <div key={entry.title} className="rounded-2xl border border-line/70 bg-white/4 p-3">
                        <div className="text-sm font-semibold text-ink">{entry.title}</div>
                        <div className="mt-2 text-sm text-muted">{entry.summary}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                      Evidence cards will show which portfolio facts and systems the answer was built from.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Suggested follow-ups</div>
                <div className="mt-4 grid gap-3">
                  {(result?.followUps ?? [
                    "Which project best demonstrates agentic AI capability?",
                    "How does he think about turning AI into usable products?",
                    "What kind of systems can he build for a client?"
                  ]).map((item) => (
                    <button
                      key={item}
                      className="rounded-2xl border border-line/70 bg-white/4 p-3 text-left text-sm text-muted transition hover:border-accent/30 hover:text-ink"
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
    </section>
  );
}
