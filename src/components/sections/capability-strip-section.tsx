import { capabilitySignals } from "../../content/portfolio";

export function CapabilityStripSection() {
  return (
    <section className="pb-8">
      <div className="section-frame">
        <div className="surface rounded-[30px] px-4 py-4 sm:px-6 sm:py-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/75">Signal Bar</div>
            <div className="text-sm text-muted">High-signal capabilities, not filler metrics.</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {capabilitySignals.map((signal, index) => (
              <div key={signal.title} className="rounded-[22px] border border-line/75 bg-white/4 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">0{index + 1}</div>
                <div className="mt-3 text-sm font-semibold text-ink">{signal.title}</div>
                <div className="mt-2 text-sm text-muted">{signal.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
