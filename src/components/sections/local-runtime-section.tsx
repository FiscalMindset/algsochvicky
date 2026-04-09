import { AlertTriangle, CheckCircle2, Cpu, DownloadCloud, HardDriveDownload, LoaderCircle } from "lucide-react";
import { localLanguageModel } from "../../features/runanywhere/model-catalog";
import { useRunAnywhereRuntime } from "../../features/runanywhere/runtime-provider";
import { formatBytes, sentenceCase } from "../../lib/utils";
import { Button } from "../ui/button";
import { SectionHeading } from "../ui/section-heading";

const statusConfig = {
  "not-downloaded": { label: "Not Downloaded", tone: "text-muted", icon: <HardDriveDownload size={16} /> },
  downloading: { label: "Downloading", tone: "text-accent", icon: <DownloadCloud size={16} /> },
  ready: { label: "Ready", tone: "text-success", icon: <CheckCircle2 size={16} /> },
  loading: { label: "Loading", tone: "text-warning", icon: <LoaderCircle size={16} className="animate-spin" /> },
  active: { label: "Active", tone: "text-success", icon: <Cpu size={16} /> },
  failed: { label: "Failed", tone: "text-danger", icon: <AlertTriangle size={16} /> }
} as const;

export function LocalRuntimeSection() {
  const { snapshot, activate, release, clearCache } = useRunAnywhereRuntime();
  const status = statusConfig[snapshot.modelStatus];
  const isBusy = snapshot.initializing || snapshot.modelStatus === "downloading" || snapshot.modelStatus === "loading";

  return (
    <section id="runtime" className="section-space">
      <div className="section-frame">
        <SectionHeading
          eyebrow="RunAnywhere SDK / On-Device AI"
          title="A real browser runtime, not a decorative local-AI claim."
          description="This portfolio includes a proper local model control surface built around RunAnywhere’s Web SDK: click-to-download activation, OPFS caching, visible lifecycle state, progressive loading, and reusable browser-local inference."
          aside={
            <p>
              Activation is real. When the model is missing, clicking the runtime starts download and cache setup
              automatically. Later visits reuse the cached model instead of downloading again.
            </p>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent/75">Runtime Control Panel</div>
                <h3 className="mt-3 text-2xl font-semibold text-ink">Activate Local AI</h3>
                <p className="mt-3 max-w-2xl text-sm text-muted">
                  The visible local experience is the portfolio agent. Once active, the on-device model can answer
                  grounded questions about Vicky, his systems, and his architecture approach inside the browser.
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full border border-line/80 px-4 py-2 text-sm ${status.tone}`}>
                {status.icon}
                {status.label}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Model", localLanguageModel.name],
                ["Purpose", localLanguageModel.purpose],
                ["Memory", formatBytes(snapshot.memoryRequirement)],
                ["Acceleration", sentenceCase(snapshot.accelerationMode)],
                ["Cache", snapshot.cached ? "OPFS cache detected" : "No local cache yet"],
                ["Isolation", snapshot.crossOriginIsolated ? "SharedArrayBuffer ready" : "Fallback mode"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-[22px] border border-line/70 bg-white/4 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">{label}</div>
                  <div className="mt-3 text-sm text-ink">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[26px] border border-line/70 bg-black/15 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Lifecycle</div>
                <div className="text-sm text-muted">{snapshot.detail}</div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/6">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${Math.max(snapshot.progress * 100, snapshot.modelStatus === "active" ? 100 : 0)}%` }}
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    step: "Download",
                    complete:
                      snapshot.cached || snapshot.modelStatus === "downloading" || snapshot.modelStatus === "active"
                  },
                  {
                    step: "Load",
                    complete: snapshot.modelStatus === "loading" || snapshot.modelStatus === "active"
                  },
                  {
                    step: "Answer",
                    complete: snapshot.modelStatus === "active"
                  }
                ].map(({ step, complete }) => (
                  <div key={step} className="rounded-2xl border border-line/70 bg-white/4 p-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{step}</div>
                    <div className={`mt-2 text-sm ${complete ? "text-success" : "text-muted"}`}>
                      {complete ? "Ready" : "Pending"}
                    </div>
                  </div>
                ))}
              </div>
              {snapshot.lastError ? (
                <div className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
                  {snapshot.lastError}
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => void activate()} disabled={isBusy}>
                {snapshot.cached ? "Load Local Model" : "Download + Activate Local AI"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => void release()}
                disabled={snapshot.modelStatus !== "active" || isBusy}
              >
                Release Runtime
              </Button>
              <Button variant="secondary" onClick={() => void clearCache()} disabled={isBusy || !snapshot.cached}>
                Clear Cached Model
              </Button>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">Powered Experience</div>
              <h3 className="mt-3 text-xl font-semibold text-ink">Local “Ask Vicky” briefing mode</h3>
              <p className="mt-3 text-sm text-muted">
                The runtime is not separated from the rest of the site. When active, it powers the portfolio agent so
                visitors can ask grounded questions with a browser-local model backed by curated portfolio context.
              </p>
              <div className="mt-5 grid gap-3">
                {[
                  "Click activation auto-downloads the model if it is missing.",
                  "RunAnywhere stores the model in OPFS so revisit flows skip re-download.",
                  "The UI exposes status transitions clearly instead of hiding runtime work.",
                  "The agent can fall back to curated deterministic synthesis when local inference is inactive."
                ].map((point) => (
                  <div key={point} className="rounded-2xl border border-line/70 bg-white/4 p-3 text-sm text-muted">
                    {point}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-line/75 bg-canvas-elevated/70 p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">RunAnywhere notes</div>
              <p className="mt-3 text-sm text-muted">
                This implementation follows the current Web SDK guidance: Vite bundling, WASM copy handling,
                `credentialless` cross-origin isolation, and OPFS-aware model lifecycle management for browser reuse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
