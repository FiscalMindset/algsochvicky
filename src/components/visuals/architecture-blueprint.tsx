import { motion } from "framer-motion";
import { architectureLayers } from "../../content/portfolio";
import { cn } from "../../lib/utils";

type ArchitectureBlueprintProps = {
  activeLayerId: string;
};

export function ArchitectureBlueprint({ activeLayerId }: ArchitectureBlueprintProps) {
  return (
    <div className="surface-soft relative overflow-hidden rounded-[30px] p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/75">Agentic Blueprint</div>
          <div className="mt-2 text-sm text-muted">How interface, intelligence, and execution become one product system.</div>
        </div>
        <div className="rounded-full border border-line/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          5-Layer Model
        </div>
      </div>

      <div className="relative grid gap-3">
        {architectureLayers.map((layer, index) => {
          const active = layer.id === activeLayerId;
          return (
            <motion.div
              key={layer.id}
              className={cn(
                "relative overflow-hidden rounded-[24px] border px-5 py-4 transition duration-300",
                active
                  ? "border-accent/40 bg-accent/10 shadow-[0_12px_40px_rgba(124,199,222,0.08)]"
                  : "border-line/75 bg-white/4"
              )}
              animate={{ opacity: active ? 1 : 0.72, y: active ? 0 : index * 2 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted">Layer {index + 1}</div>
                  <div className="mt-2 text-lg font-semibold text-ink">{layer.label}</div>
                </div>
                <div className={cn("h-2.5 w-2.5 rounded-full", active ? "bg-accent" : "bg-line")} />
              </div>
              <div className="max-w-2xl text-sm text-muted">{layer.headline}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
