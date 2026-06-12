import { useState } from "react";
import { architectureLayers, featuredSystems } from "../../content/portfolio";
import { layerColors } from "../../content/system-diagrams";
import { cn } from "../../lib/utils";

const layerOrder = ["interface", "agent", "intelligence", "execution", "product"];

const systemMeta: Record<string, { color: string; label: string }> = {
  algsoch:        { color: "#3b82f6", label: "Algsoch" },
  speakai:        { color: "#0ea5e9", label: "SpeakAI" },
  careops:        { color: "#14b8a6", label: "CareOps" },
  "algsoch-news": { color: "#f59e0b", label: "Algsoch News" },
};

type LayerCoverageMatrixProps = {
  activeLayerId?: string;
  onLayerClick?: (layerId: string) => void;
};

export function LayerCoverageMatrix({ activeLayerId, onLayerClick }: LayerCoverageMatrixProps) {
  const systems = featuredSystems.filter((s) =>
    ["algsoch", "speakai", "careops", "algsoch-news"].includes(s.id)
  );
  const [hoveredCell, setHoveredCell] = useState<{ layer: string; system: string } | null>(null);

  const hoverLayer = hoveredCell?.layer ?? null;

  return (
    <div className="surface-soft relative overflow-hidden rounded-[30px] p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

      <div className="mb-4 flex items-center justify-between">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/75">
          Layer Coverage by System
        </div>
        {hoveredCell && (
          <div className="animate-in fade-in rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-mono text-[9px] text-accent/80">
            {hoveredCell.system} · {hoveredCell.layer}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse">
          <thead>
            <tr>
              <th className="w-[90px] p-0" />
              {systems.map((sys) => {
                const meta = systemMeta[sys.id];
                return (
                  <th
                    key={sys.id}
                    className={cn(
                      "p-1.5 text-center font-mono text-[9px] uppercase tracking-[0.15em]",
                      hoveredCell?.system === sys.id ? "opacity-100" : "opacity-60"
                    )}
                    style={{ color: meta?.color ?? "#fff" }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full transition-transform duration-200"
                        style={{
                          backgroundColor: meta?.color,
                          transform: hoveredCell?.system === sys.id ? "scale(1.5)" : "scale(1)",
                        }}
                      />
                      {meta?.label ?? sys.id}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {layerOrder.map((lid) => {
              const lc = layerColors[lid] ?? layerColors.interface;
              const activeLayer = lid === activeLayerId;
              const isHoveredRow = lid === hoverLayer;

              return (
                <tr
                  key={lid}
                  className={cn(
                    "cursor-pointer transition-all duration-150",
                    isHoveredRow || activeLayer ? "" : "opacity-60 hover:opacity-90"
                  )}
                  onClick={() => onLayerClick?.(lid)}
                  onMouseEnter={() => setHoveredCell({ layer: lid, system: "" })}
                  onMouseLeave={() => setHoveredCell((h) => h?.layer === lid ? null : h)}
                >
                  <td className="p-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-block h-2 w-2 rounded-full transition-all duration-200",
                          activeLayer ? "shadow-[0_0_6px]" : ""
                        )}
                        style={{
                          backgroundColor: lc.bar,
                          boxShadow: activeLayer ? `0 0 8px ${lc.bar}` : "none",
                        }}
                      />
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: lc.bar }}>
                        {lid}
                      </span>
                    </div>
                  </td>
                  {systems.map((sys) => {
                    const covered = sys.layerIds.includes(lid);
                    const isHovered = hoveredCell?.layer === lid && hoveredCell?.system === sys.id;
                    const meta = systemMeta[sys.id];

                    return (
                      <td
                        key={sys.id}
                        className="p-1.5 text-center"
                        onMouseEnter={() => setHoveredCell({ layer: lid, system: sys.id })}
                        onMouseLeave={() => setHoveredCell((h) =>
                          h?.layer === lid && h?.system === sys.id ? { layer: lid, system: "" } : h
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex items-center justify-center rounded-full transition-all duration-[250ms]",
                            covered ? "border" : "border border-white/10"
                          )}
                          style={{
                            width: 28,
                            height: 28,
                            borderColor: covered ? lc.bar : undefined,
                            backgroundColor: covered
                              ? isHovered
                                ? lc.bar.replace("0.6", "0.35")
                                : lc.bar.replace("0.6", "0.15")
                              : undefined,
                            transform: isHovered ? "scale(1.2)" : "scale(1)",
                            boxShadow: isHovered && covered ? `0 0 12px ${lc.bar}` : "none",
                          }}
                        >
                          {covered && (
                            <span
                              className="rounded-full transition-all duration-200"
                              style={{
                                width: isHovered ? 12 : 10,
                                height: isHovered ? 12 : 10,
                                backgroundColor: lc.bar,
                              }}
                            />
                          )}
                          {!covered && (
                            <span
                              className="rounded-full bg-white/10 transition-all duration-200"
                              style={{
                                width: isHovered ? 8 : 5,
                                height: isHovered ? 8 : 5,
                              }}
                            />
                          )}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-muted/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-white/10" />
            <span>Not covered</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-accent/50" />
            <span>Covered</span>
          </span>
        </div>
        <span className="text-muted/30">Click a row to activate layer</span>
      </div>
    </div>
  );
}
