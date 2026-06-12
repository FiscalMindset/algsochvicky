import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { architectureLayers, featuredSystems } from "../../content/portfolio";
import { layerColors } from "../../content/system-diagrams";
import { ArchitecturePipeline } from "../visuals/architecture-pipeline";
import { CnnBg } from "../visuals/cnn-bg";
import { PipelineBg } from "../visuals/pipeline-bg";
import { LayerCoverageMatrix } from "../ui/layer-coverage-matrix";
import { FiscalMindsetBadge } from "../ui/fiscalmindset-badge";
import { cn } from "../../lib/utils";

export function ArchitectureSection() {
  const [activeId, setActiveId] = useState(architectureLayers[0]?.id ?? "");
  const activeLayer = useMemo(
    () => architectureLayers.find((layer) => layer.id === activeId) ?? architectureLayers[0],
    [activeId]
  );

  if (!activeLayer) {
    return null;
  }

  const lc = layerColors[activeLayer.id] ?? layerColors.interface;

  return (
    <section id="architecture" className="section-space">
      <div className="section-frame">
        <div className="rounded-xl border border-orange-500/50 bg-black/10 p-5 sm:rounded-2xl sm:border-2 sm:p-6 lg:rounded-3xl lg:p-10 relative overflow-hidden">
          <CnnBg />
          
        <div className="relative mb-8 overflow-hidden rounded-[24px] border border-orange-500/15 bg-gradient-to-br from-orange-500/8 via-black/20 to-transparent px-5 py-5 sm:px-6 sm:py-6 z-10">
          <PipelineBg />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-block rounded-full border-2 border-orange-500 bg-gray-100 px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.3em] text-gray-900">
                Architecture
              </div>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl lg:text-[3.7rem]" style={{lineHeight: '1.2'}}>
                How the work is organized.
              </h2>
              <div className="mt-4 inline-block rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-transparent px-4 py-2.5 text-sm leading-6 text-muted backdrop-blur-sm">
                Every system follows the same pipeline <span className="text-orange-400/50">—</span> from user to shipped product.
              </div>
            </div>
            <div className="inline-block rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-transparent px-4 py-2.5 text-sm text-muted backdrop-blur-sm">
              Pick a layer to see what it actually does across real projects.
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 relative z-10">
          {([
            { label: "Understand", detail: "the user", layer: "interface" },
            { label: "Route", detail: "the intent", layer: "agent" },
            { label: "Ground", detail: "in context", layer: "intelligence" },
            { label: "Execute", detail: "with tools", layer: "execution" },
            { label: "Ship", detail: "something usable", layer: "product" },
          ] as const).map(({ label, detail, layer }) => {
            const lc = layerColors[layer] ?? layerColors.interface;
            const active = layer === activeLayer.id;
            const iconMap: Record<string, string> = { interface: "◈", agent: "◎", intelligence: "◇", execution: "⚙", product: "◆" };
            return (
              <motion.button
                key={layer}
                onClick={() => setActiveId(layer)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-colors duration-150",
                  active ? `${lc.border} ${lc.bg} shadow-md` : "border-line/60 bg-white/4 hover:border-accent/20 hover:bg-white/8"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className={cn("text-base mb-1", lc.text)}
                  animate={{ scale: active ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {iconMap[layer] ?? "▹"}
                </motion.div>
                <div className="text-[10px] font-semibold leading-tight text-ink">{label}</div>
                <div className="text-[9px] text-muted/70">{detail}</div>
              </motion.button>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr] relative z-10">
          <div className="grid gap-3">
            {architectureLayers.map((layer) => {
              const active = layer.id === activeLayer.id;
              const lc2 = layerColors[layer.id] ?? layerColors.interface;
              const iconMap: Record<string, string> = { interface: "◈", agent: "◎", intelligence: "◇", execution: "⚙", product: "◆" };
              const sysColors: Record<string, string> = { algsoch: "#3b82f6", speakai: "#0ea5e9", careops: "#14b8a6", "algsoch-news": "#f59e0b" };
              const activeSystems = featuredSystems.filter(s => ["algsoch","speakai","careops","algsoch-news"].includes(s.id));
              return (
                <motion.button
                  key={layer.id}
                  className="text-left"
                  onClick={() => setActiveId(layer.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className={cn(
                    "rounded-[24px] border px-4 py-3.5 sm:px-5 sm:py-4 transition-colors duration-150",
                    active ? `${lc2.border} ${lc2.bg} shadow-md` : "border-line/75 bg-white/4 hover:border-accent/20 hover:bg-white/8"
                  )}>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-lg shrink-0", lc2.text)}>{iconMap[layer.id] ?? "▹"}</span>
                      <div className="min-w-0 flex-1">
                        <div className={cn("font-mono text-[9px] uppercase tracking-[0.26em]", active ? lc2.text : "text-muted")}>{layer.label}</div>
                        <div className="mt-0.5 text-sm font-semibold text-ink leading-tight">{layer.headline}</div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {activeSystems.map((sys) => {
                          const used = sys.layerIds.includes(layer.id);
                          return (
                            <span
                              key={sys.id}
                              className="inline-block h-2.5 w-2.5 rounded-full transition-all duration-200"
                              style={{
                                backgroundColor: used ? sysColors[sys.id] ?? "#666" : "rgba(255,255,255,0.08)",
                                boxShadow: used && active ? `0 0 6px ${sysColors[sys.id]}40` : "none",
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    {active && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="mt-3 flex flex-wrap gap-1.5 border-t border-line/60 pt-3 overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1">
                          {layer.modules.map((m) => (
                            <span key={m} className={cn("rounded-md border px-1.5 py-0.5 text-[9px] font-mono", lc2.label)}>{m}</span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div className="mt-2 flex gap-2 text-[10px] font-mono text-muted/60">
                      <span>{layer.modules.length} modules</span>
                      <span>·</span>
                      <span>{activeSystems.filter(s => s.layerIds.includes(layer.id)).length}/{activeSystems.length} systems</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="grid gap-6">
            <ArchitecturePipeline activeLayerId={activeLayer.id} onLayerClick={setActiveId} />
            <LayerCoverageMatrix activeLayerId={activeLayer.id} onLayerClick={setActiveId} />
          </div>
        </div>
      <FiscalMindsetBadge />
      </div>
    </div>
    </section>
  );
}
