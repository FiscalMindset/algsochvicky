import { useMemo, useState } from "react";
import { architectureLayers } from "../../content/portfolio";
import { SectionHeading } from "../ui/section-heading";
import { ArchitectureBlueprint } from "../visuals/architecture-blueprint";

export function ArchitectureSection() {
  const [activeId, setActiveId] = useState(architectureLayers[0]?.id ?? "");
  const activeLayer = useMemo(
    () => architectureLayers.find((layer) => layer.id === activeId) ?? architectureLayers[0],
    [activeId]
  );

  if (!activeLayer) {
    return null;
  }

  return (
    <section id="architecture" className="section-space">
      <div className="section-frame">
        <SectionHeading
          eyebrow="Agentic Architecture"
          title="Built in layers so intelligence stays usable."
          description="The architecture is intentionally layered. Interface, agents, intelligence, execution, and product experience each have a clear role, which makes the resulting systems easier to trust, extend, and ship."
          aside={<p>The emphasis is not on adding more AI. It is on building cleaner system boundaries around where AI belongs.</p>}
        />

        <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="grid gap-3">
            {architectureLayers.map((layer) => {
              const active = layer.id === activeLayer.id;
              return (
                <button key={layer.id} className="text-left" onClick={() => setActiveId(layer.id)}>
                  <div className={`rounded-[24px] border p-5 ${active ? "border-accent/40 bg-accent/10" : "border-line/75 bg-white/4"}`}>
                    <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted">{layer.label}</div>
                    <div className="mt-3 text-lg font-semibold text-ink">{layer.headline}</div>
                    <div className="mt-2 text-sm text-muted">{layer.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid gap-6">
            <ArchitectureBlueprint activeLayerId={activeLayer.id} />
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-[28px] border border-line/75 bg-white/4 p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/70">Modules</div>
                <div className="mt-4 grid gap-3">
                  {activeLayer.modules.map((module) => (
                    <div key={module} className="rounded-2xl border border-line/70 bg-black/15 p-3 text-sm text-muted">
                      {module}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] border border-line/75 bg-white/4 p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/70">Outputs</div>
                <div className="mt-4 grid gap-3">
                  {activeLayer.outputs.map((output) => (
                    <div key={output} className="rounded-2xl border border-line/70 bg-black/15 p-3 text-sm text-muted">
                      {output}
                    </div>
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
