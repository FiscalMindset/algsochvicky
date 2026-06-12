import { useCallback, useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";
import { cn } from "../../lib/utils";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  maxTextSize: 80000,
  securityLevel: "loose",
  themeVariables: {
    primaryColor: "#1e293b",
    primaryTextColor: "#e2e8f0",
    primaryBorderColor: "#334155",
    lineColor: "#64748b",
    secondaryColor: "#0f172a",
    tertiaryColor: "#1e293b",
    fontSize: "14px",
    mainBkg: "#1e293b",
    nodeBorder: "#334155",
    clusterBkg: "#0f172a",
    clusterBorder: "#334155",
    titleColor: "#e2e8f0",
    edgeLabelBackground: "#1e293b",
    nodeTextColor: "#e2e8f0",
  },
});

type DiagramTab = { title: string; definition: string };

type MermaidDiagramProps = {
  diagrams: DiagramTab[];
  className?: string;
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function MermaidDiagram({ diagrams, className }: MermaidDiagramProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const current = diagrams[activeTab] ?? diagrams[0];
  const uid = useId();

  const inlineSvgRef = useRef<HTMLDivElement>(null);
  const inlineId = `m-inline-${uid.replace(/[:.]/g, "-")}`;

  useEffect(() => {
    if (!inlineSvgRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        setInlineError(null);
        const { svg } = await mermaid.render(inlineId, current.definition);
        if (!cancelled && inlineSvgRef.current) {
          inlineSvgRef.current.innerHTML = svg;
          const svgEl = inlineSvgRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
            svgEl.style.display = "block";
            svgEl.removeAttribute("width");
            svgEl.removeAttribute("height");
            svgEl.style.pointerEvents = "none";
          }
        }
      } catch (err) {
        if (!cancelled) setInlineError(err instanceof Error ? err.message : "Render failed");
      }
    })();
    return () => { cancelled = true; };
  }, [current.definition, inlineId]);

  return (
    <>
      <div className={cn("relative", className)}>
        {diagrams.length > 1 && (
          <div className="mb-2 flex gap-1 overflow-x-auto">
            {diagrams.map((d, i) => (
              <button
                key={d.title}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  "shrink-0 rounded-md border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] transition",
                  i === activeTab
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-line/60 bg-white/4 text-muted hover:border-line/80 hover:text-ink"
                )}
              >
                {d.title}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{current.title}</div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 rounded-md border border-line/60 bg-white/4 px-2 py-1 text-[10px] text-muted transition hover:border-accent/30 hover:text-accent"
          >
            <Maximize2 size={12} />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
        {inlineError ? (
          <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-[11px] text-red-400/80">
            {inlineError}
          </div>
        ) : (
          <div className="mt-2 overflow-auto rounded-xl border border-line/60 bg-black/20 p-3 sm:p-4 max-h-[280px] sm:max-h-[360px] [&_svg]:!max-w-full [&_svg]:!h-auto">
            <div
              ref={inlineSvgRef}
              className="flex items-start justify-center [&_svg]:!w-full [&_svg]:!max-w-full [&_svg]:!h-auto"
            />
          </div>
        )}
      </div>

      {modalOpen && (
        <ModalOverlay onClose={() => setModalOpen(false)}>
          {diagrams.length > 1 && (
            <div className="mb-3 flex gap-1.5 overflow-x-auto px-1">
              {diagrams.map((d, i) => (
                <button
                  key={d.title}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "shrink-0 rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition",
                    i === activeTab
                      ? "border-accent/40 bg-accent/12 text-accent"
                      : "border-white/10 bg-white/4 text-white/60 hover:border-white/20 hover:text-white/80"
                  )}
                >
                  {d.title}
                </button>
              ))}
            </div>
          )}
          <div className="mb-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">{current.title}</div>
          </div>
          <ZoomableDiagram
            key={`${activeTab}-${current.definition.slice(0, 40)}`}
            definition={current.definition}
          />
        </ModalOverlay>
      )}
    </>
  );
}

function ModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="text-sm font-semibold text-white/90">Architecture Diagram</div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/6 text-white/60 transition hover:border-white/20 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden px-4 py-4 sm:px-8 sm:py-6">
        {children}
      </div>
    </div>
  );
}

function ZoomableDiagram({ definition }: { definition: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const transform = useRef({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const pinchDist = useRef(0);
  const uid = useId();
  const elId = `m-zoom-${uid.replace(/[:.]/g, "-")}`;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgWrapperRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        const { svg } = await mermaid.render(elId, definition);
        if (!cancelled && svgWrapperRef.current) {
          svgWrapperRef.current.innerHTML = svg;
          const svgEl = svgWrapperRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "none";
            svgEl.style.height = "auto";
            svgEl.style.display = "block";
            svgEl.removeAttribute("width");
            svgEl.removeAttribute("height");
            svgEl.style.pointerEvents = "none";
          }
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Render failed");
      }
    })();
    return () => { cancelled = true; };
  }, [definition, elId]);

  const apply = useCallback(() => {
    const el = containerRef.current?.querySelector(".zoom-layer") as HTMLElement | null;
    if (!el) return;
    const t = transform.current;
    el.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.scale})`;
  }, []);

  const zoomAt = useCallback((cx: number, cy: number, factor: number) => {
    const t = transform.current;
    const ns = clamp(t.scale * factor, 0.3, 6);
    t.x = cx - (cx - t.x) * (ns / t.scale);
    t.y = cy - (cy - t.y) * (ns / t.scale);
    t.scale = ns;
    apply();
  }, [apply]);

  const zoomIn = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) zoomAt(rect.width / 2, rect.height / 2, 1.3);
  }, [zoomAt]);

  const zoomOut = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) zoomAt(rect.width / 2, rect.height / 2, 0.77);
  }, [zoomAt]);

  const reset = useCallback(() => {
    transform.current = { x: 0, y: 0, scale: 1 };
    apply();
  }, [apply]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY > 0 ? 0.88 : 1.14);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      el.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const t = transform.current;
      t.x += e.clientX - last.current.x;
      t.y += e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      apply();
    };

    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = "grab";
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDragging.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchDist.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1 && isDragging.current) {
        const t = transform.current;
        t.x += e.touches[0].clientX - last.current.x;
        t.y += e.touches[0].clientY - last.current.y;
        last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        apply();
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const factor = dist / pinchDist.current;
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const rect = el.getBoundingClientRect();
        zoomAt(mx - rect.left, my - rect.top, factor);
        pinchDist.current = dist;
      }
    };

    const onTouchEnd = () => { isDragging.current = false; };
    const onResize = () => reset();

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
    };
  }, [apply, zoomAt, reset]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/30"
      style={{ cursor: "grab", touchAction: "none" }}
    >
      {error ? (
        <div className="flex h-full items-center justify-center p-4 text-[12px] text-red-400/80">{error}</div>
      ) : (
        <div className="zoom-layer origin-top-left" style={{ transform: "translate(0px, 0px) scale(1)" }}>
          <div
            ref={svgWrapperRef}
            className="flex items-start justify-center p-4 [&_svg]:!max-w-none [&_svg]:!h-auto"
            style={{ minWidth: 600 }}
          />
        </div>
      )}
      <div className="absolute right-3 top-3 flex items-center gap-1">
        <button type="button" onClick={zoomOut} className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/60 text-white/60 transition hover:border-white/20 hover:text-white"><Minus size={14} /></button>
        <button type="button" onClick={reset} className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/60 text-white/60 transition hover:border-white/20 hover:text-white"><RotateCcw size={13} /></button>
        <button type="button" onClick={zoomIn} className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/60 text-white/60 transition hover:border-white/20 hover:text-white"><Plus size={14} /></button>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-[9px] text-white/40 font-mono whitespace-nowrap">
        <span>Drag to pan · Scroll to zoom</span>
      </div>
    </div>
  );
}
