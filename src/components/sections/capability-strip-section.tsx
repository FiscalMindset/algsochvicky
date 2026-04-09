import { capabilitySignals } from "../../content/portfolio";
import { cn } from "../../lib/utils";

type CapabilityStripSectionProps = {
  embedded?: boolean;
};

export function CapabilityStripSection({ embedded = false }: CapabilityStripSectionProps) {
  const content = (
    <div
      className={cn(
        embedded ? "surface-soft rounded-[32px] p-4 sm:p-5" : "surface rounded-[30px] px-4 py-4 sm:px-6 sm:py-5"
      )}
    >
      <div className="mb-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/75">Signal Bar</div>
          <div className="mt-2 text-sm text-muted">High-signal capabilities, not filler metrics.</div>
        </div>
        {embedded ? (
          <div className="self-start rounded-full border border-line/70 bg-white/4 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/75">
            Capability matrix
          </div>
        ) : null}
      </div>

      <div className={cn("grid gap-3", embedded ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4")}>
        {capabilitySignals.map((signal, index) => (
          <div
            key={signal.title}
            className={cn(
              "rounded-[22px] border border-line/75 bg-white/4",
              embedded ? "p-3.5" : "p-4"
            )}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">0{index + 1}</div>
            <div className={cn("font-semibold text-ink", embedded ? "mt-2 text-sm leading-5" : "mt-3 text-sm")}>
              {signal.title}
            </div>
            <div className={cn("text-muted", embedded ? "mt-1.5 text-[13px] leading-5" : "mt-2 text-sm")}>
              {signal.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <section className="pb-8">
      <div className="section-frame">{content}</div>
    </section>
  );
}
