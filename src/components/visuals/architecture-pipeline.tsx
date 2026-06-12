import { motion } from "framer-motion";
import { architectureLayers } from "../../content/portfolio";
import { layerColors } from "../../content/system-diagrams";
import { cn } from "../../lib/utils";

const layerOrder = ["interface", "agent", "intelligence", "execution", "product"];

const layerIcons: Record<string, string> = {
  interface: "\u25C8",
  agent: "\u25CE",
  intelligence: "\u25C7",
  execution: "\u2699",
  product: "\u25C6",
};

type ArchitecturePipelineProps = {
  activeLayerId: string;
  onLayerClick?: (layerId: string) => void;
};

export function ArchitecturePipeline({ activeLayerId, onLayerClick }: ArchitecturePipelineProps) {
  const reversed = [...layerOrder].reverse();

  return (
    <div className="surface-soft relative overflow-hidden rounded-[30px]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

      <div className="px-4 pb-2 pt-4 sm:px-6 sm:pb-2 sm:pt-5">
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent/75 sm:text-[11px]">
          Architecture Pipeline
        </div>
        <div className="mt-1 text-[10px] text-muted/80 sm:mt-1.5 sm:text-xs">
          How a request moves through the system — from interface to delivered product value.
        </div>
      </div>

      <div className="relative px-4 pb-4 pt-2 sm:px-6 sm:pb-5 sm:pt-3">
        {reversed.map((lid, i) => {
          const layer = architectureLayers.find((l) => l.id === lid);
          if (!layer) return null;
          const lc = layerColors[lid] ?? layerColors.interface;
          const active = lid === activeLayerId;
          const isLast = i === reversed.length - 1;

          return (
            <button key={lid} className="group relative flex gap-2 text-left w-full sm:gap-4" onClick={() => onLayerClick?.(lid)}>
              <div className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 cursor-pointer sm:h-8 sm:w-8",
                    active
                      ? `${lc.border} ${lc.bg}`
                      : "border-line/60 bg-white/4 group-hover:border-accent/30"
                  )}
                  animate={{ scale: active ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <span className={cn("text-[10px] sm:text-sm", active ? lc.text : "text-muted/50 group-hover:text-accent/70")}>
                    {layerIcons[lid] ?? "\u25B9"}
                  </span>
                </motion.div>
                {!isLast && (
                  <motion.div
                    className="w-px"
                    style={{ backgroundColor: lc.bar }}
                    animate={{ opacity: active ? 0.6 : 0.15 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>

              <motion.div
                className={cn(
                  "min-w-0 flex-1 rounded-2xl border transition-colors duration-200",
                  active
                    ? `${lc.border} ${lc.bg} shadow-lg`
                    : "border-line/70 bg-white/4 hover:border-accent/20 hover:bg-white/8",
                  active ? "px-3 py-2.5 sm:px-4 sm:py-3.5" : "px-3 py-2 sm:px-4 sm:py-3"
                )}
                layout
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  <span className={cn("font-mono text-[7px] uppercase tracking-[0.2em] sm:text-[9px]", active ? lc.text : "text-muted")}>
                    Layer {layerOrder.indexOf(lid) + 1}
                  </span>
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn("rounded-full border px-1 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] sm:px-1.5 sm:text-[8px]", lc.label)}
                    >
                      Active
                    </motion.span>
                  )}
                </div>
                <div className={cn("mt-0.5 text-xs font-semibold leading-tight sm:text-sm", active ? "text-ink" : "text-muted")}>
                  {layer.label}
                </div>
                {!active && (
                  <div className="mt-0.5 text-[10px] leading-4 text-muted/50 sm:text-[11px] sm:leading-5">
                    {layer.headline}
                  </div>
                )}

                {active && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="mt-2 grid gap-1.5 overflow-hidden sm:mt-3 sm:gap-2 sm:grid-cols-2"
                  >
                    <div className="rounded-xl border border-line/70 bg-black/15 p-2 sm:p-2.5">
                      <div className={cn("font-mono text-[7px] uppercase tracking-[0.2em] sm:text-[8px]", lc.text)}>Modules</div>
                      <div className="mt-1 flex flex-wrap gap-1 sm:mt-1.5">
                        {layer.modules.map((m) => (
                          <span key={m} className={cn("rounded-md border px-1 py-0.5 text-[7px] font-mono sm:px-1.5 sm:py-0.5 sm:text-[9px]", lc.label)}>{m}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-line/70 bg-black/15 p-2 sm:p-2.5">
                      <div className={cn("font-mono text-[7px] uppercase tracking-[0.2em] sm:text-[8px]", lc.text)}>Outputs</div>
                      <div className="mt-1 flex flex-wrap gap-1 sm:mt-1.5">
                        {layer.outputs.map((o) => (
                          <span key={o} className="rounded-md border border-line/70 bg-black/20 px-1 py-0.5 text-[7px] font-mono text-muted sm:px-1.5 sm:py-0.5 sm:text-[9px]">{o}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </button>
          );
        })}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[8px] font-mono text-muted/40 sm:mt-4 sm:gap-2 sm:text-[9px]">
          {reversed.map((lid, i) => {
            const lc = layerColors[lid] ?? layerColors.interface;
            return (
              <span key={lid} className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lc.bar }} />
                <span>{layerOrder.indexOf(lid) + 1}</span>
              </span>
            );
          })}
          <span className="ml-1 text-muted/30 hidden sm:inline">→ flow direction</span>
          <span className="text-muted/30 sm:hidden">→</span>
        </div>
      </div>
    </div>
  );
}
