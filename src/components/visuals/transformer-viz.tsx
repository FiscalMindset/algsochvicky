"use client";
import { useEffect, useRef } from "react";

function tokenize(text: string): string[] {
  return text.split(/(\s+|[.,!?;:()\[\]{}"'「」、。，．！？])/g).filter(Boolean);
}

export function TransformerViz({
  active,
  streamingText = "",
  tokensPerSecond = 0
}: {
  active: boolean;
  streamingText?: string;
  tokensPerSecond?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current!;
    const parent = parentRef.current!;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let animId = 0;
    let w = 0, h = 0;
    const dpr = window.devicePixelRatio || 1;
    const tokens = tokenize(streamingText);

    function resize() {
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (w === 0 || h === 0) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(parent);
    resize();

    function drawTokenBar(time: number) {
      if (tokens.length === 0) return;

      const barX = 8;
      const barY = h - 20;
      const barW = w - 16;
      const barH = 8;

      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.roundRect?.(barX, barY, barW, barH, 4) ?? ctx.fillRect(barX, barY, barW, barH);
      ctx.fill();

      const maxVisible = Math.min(tokens.length, Math.floor(barW / 6));
      const visible = tokens.slice(-maxVisible);

      for (let i = 0; i < visible.length; i++) {
        const x = barX + (i / maxVisible) * barW;
        const isLatest = i === visible.length - 1;
        const pulse = isLatest ? Math.sin(time * 3) * 0.3 + 0.7 : 0.3;
        const alpha = isLatest ? pulse : 0.1 + (i / maxVisible) * 0.2;
        ctx.fillStyle = `rgba(16,185,129,${alpha})`;
        ctx.fillRect(x, barY + 1, Math.max(2, barW / maxVisible - 1), barH - 2);
      }
    }

    function drawTokenFlow(time: number) {
      if (tokens.length === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("awaiting tokens...", w / 2, h / 2);
        return;
      }

      const displayCount = Math.min(tokens.length, 14);
      const displayTokens = tokens.slice(-displayCount);
      const spacing = Math.min(22, (w - 40) / displayCount);
      const startX = Math.max(20, (w - displayCount * spacing) / 2);

      for (let i = 0; i < displayTokens.length; i++) {
        const x = startX + i * spacing;
        const y = h * 0.35;
        const isLatest = i === displayTokens.length - 1;
        const pulse = isLatest ? Math.sin(time * 4) * 0.3 + 0.7 : 0;

        ctx.beginPath();
        ctx.arc(x, y, isLatest ? 3 + pulse * 1.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isLatest
          ? `rgba(16,185,129,${0.4 + pulse * 0.4})`
          : `rgba(255,255,255,${0.05 + (i / displayCount) * 0.15})`;
        ctx.fill();

        if (isLatest) {
          ctx.strokeStyle = `rgba(16,185,129,${0.2 + pulse * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          for (let j = 0; j < 6; j++) {
            const angle = time * 2 + (j * Math.PI * 2) / 6;
            const rippleR = 6 + Math.sin(time * 2 + j) * 2;
            ctx.beginPath();
            ctx.arc(x, y, rippleR, angle, angle + 0.3);
            ctx.strokeStyle = `rgba(16,185,129,${0.1 * (1 - pulse)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        ctx.font = `${isLatest ? 7 : 6}px monospace`;
        ctx.fillStyle = isLatest
          ? `rgba(16,185,129,${0.6 + pulse * 0.3})`
          : `rgba(255,255,255,${0.12 + (i / displayCount) * 0.12})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const label = displayTokens[i].length > 6
          ? displayTokens[i].slice(0, 5) + "…"
          : displayTokens[i];
        ctx.fillText(label, x, y + 5);

        if (i < displayTokens.length - 1) {
          ctx.beginPath();
          ctx.moveTo(x + spacing * 0.15, y);
          ctx.lineTo(x + spacing * 0.85, y);
          ctx.strokeStyle = `rgba(255,255,255,${0.02 + (i / displayCount) * 0.04})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    function drawAttentionGrid(time: number) {
      const dim = Math.min(6, Math.max(2, Math.ceil(tokens.length / 3)));
      if (dim < 2) return;

      const size = Math.min(40, dim * 5);
      const cx = w - size / 2 - 12;
      const cy = size / 2 + 8;
      const cell = size / dim;

      for (let row = 0; row < dim; row++) {
        for (let col = 0; col < dim; col++) {
          const x = cx - size / 2 + col * cell;
          const y = cy - size / 2 + row * cell;
          const val = (Math.sin(row * 1.7 + col * 2.3 + time) * 0.5 + 0.5) * 0.4
            + (row === col ? 0.3 : 0)
            + (row === dim - 1 || col === dim - 1 ? Math.sin(time + row + col) * 0.1 : 0);
          const alpha = Math.max(0.05, Math.min(0.6, val));
          const hue = 140 + val * 80;
          ctx.fillStyle = `hsla(${hue}, 70%, ${40 + val * 20}%, ${alpha})`;
          ctx.fillRect(x, y, cell - 1, cell - 1);
        }
      }
    }

    function drawMetrics(time: number) {
      ctx.font = "6px monospace";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      const lines = [
        `pos ${tokens.length}`,
        tokensPerSecond > 0 ? `${tokensPerSecond.toFixed(1)} tok/s` : "",
        `seq_len ${tokens.length}`
      ].filter(Boolean);

      lines.forEach((line, i) => {
        ctx.fillStyle = `rgba(255,255,255,${0.08 + i * 0.02})`;
        ctx.fillText(line, 8, 6 + i * 9);
      });

      const step = Math.floor(time * 0.2) % 4;
      const steps = ["attend", "ffn", "norm", "out"];
      ctx.textAlign = "right";
      const labelStr = steps.map((s, i) => i === step ? `[${s}]` : s).join("→");
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillText(labelStr, w - 8, 6);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (w < 120 || h < 60) { animId = requestAnimationFrame(draw); return; }

      const time = Date.now() / 1200;

      drawTokenFlow(time);
      drawAttentionGrid(time);
      drawTokenBar(time);
      drawMetrics(time);

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [active, streamingText, tokensPerSecond]);

  if (!active) return null;

  return (
    <div ref={parentRef} className="w-full h-[90px] rounded-xl overflow-hidden border border-emerald-500/10 bg-black/40">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
