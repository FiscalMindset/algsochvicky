import { cn } from "../../lib/utils";

type SystemFlowViewProps = {
  steps: string[];
  color?: string;
};

export function SystemFlowView({ steps, color = "rgba(59,130,246,0.6)" }: SystemFlowViewProps) {
  if (!steps.length) return null;

  return (
    <div className="rounded-xl border border-line/60 bg-black/15 p-4">
      <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/50">
        Architecture Flow
      </div>
      <div className="relative pl-5">
        <div
          className="absolute bottom-3 left-[7px] top-3 w-px"
          style={{ backgroundColor: color, opacity: 0.3 }}
        />
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="relative pl-3">
              <div
                className="absolute left-[-13px] top-[6px] h-2.5 w-2.5 rounded-full border-2"
                style={{
                  borderColor: color,
                  backgroundColor: `rgba(10,14,20,0.95)`,
                  boxShadow: `0 0 0 3px rgba(10,14,20,0.95), 0 0 0 4px ${color}30`,
                }}
              />
              <div
                className="rounded-xl border bg-white/4 px-3 py-2 text-[11px] leading-5 text-muted/90"
                style={{ borderColor: `${color}20` }}
              >
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
