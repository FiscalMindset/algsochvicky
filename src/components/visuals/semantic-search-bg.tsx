"use client";
import { useEffect, useRef } from "react";

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}` : "251, 146, 60";
}

const docLabels = [
  "chat_history", "user_intent", "context_window", "knowledge_base",
  "embedding", "vector_index", "cosine_sim", "dot_product",
  "query_encoder", "doc_encoder", "retriever", "ranker",
  "semantic_search", "nearest_neighbor", "dense_passage",
  "query_token", "doc_token", "relevance", "score",
  "top_k=5", "recall@5", "precision", "rerank", "fusion",
  "cls_token", "mean_pool", "attention", "feed_forward", "residual",
];

const clusterColors = [
  { dot: "rgba(59,130,246,0.5)", glow: "rgba(59,130,246,0.25)" },
  { dot: "rgba(139,92,246,0.5)", glow: "rgba(139,92,246,0.25)" },
  { dot: "rgba(6,182,212,0.5)", glow: "rgba(6,182,212,0.25)" },
  { dot: "rgba(16,185,129,0.5)", glow: "rgba(16,185,129,0.25)" },
];

export function SemanticSearchBg({ accentColor = "#f97316" }: { accentColor?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const parent = parentRef.current!;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let animId = 0;
    let embs: { x: number; y: number; vx: number; vy: number; label: string; cluster: number; phase: number }[] = [];
    let w = 0, h = 0;
    const dpr = window.devicePixelRatio || 1;

    const isLg = () => w > 640;
    const isMd = () => w > 420;
    const fs = (n: number) => Math.max(4, Math.round(n * Math.min(w, 1200) / 900));
    const p = () => Math.max(4, Math.floor(w * 0.015));
    const accent = () => hexToRgb(accentColor);

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
      const count = Math.min(isLg() ? 35 : isMd() ? 22 : 14, Math.floor((w * h) / 25000));
      embs = [];
      for (let i = 0; i < count; i++) {
        embs.push({
          x: p() + Math.random() * (w - 2 * p()),
          y: p() + Math.random() * (h - 2 * p()),
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          label: docLabels[i % docLabels.length],
          cluster: Math.floor(Math.random() * 4),
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(parent);
    resize();

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const time = Date.now() / 1200;
      const pd = p();
      const ac = accent();
      const qx = w * (0.25 + 0.25 * Math.sin(time * 0.15));
      const qy = h * (0.3 + 0.2 * Math.cos(time * 0.2));

      for (const e of embs) {
        e.x += e.vx;
        e.y += e.vy;
        e.phase += 0.005;
        if (e.x < pd || e.x > w - pd) e.vx *= -1;
        if (e.y < pd || e.y > h - pd) e.vy *= -1;
      }

      const withDist = embs.map((e) => ({
        ...e,
        dist: Math.sqrt((e.x - qx) ** 2 + (e.y - qy) ** 2),
      }));
      withDist.sort((a, b) => a.dist - b.dist);
      const k = isLg() ? 5 : isMd() ? 3 : 2;
      const nearest = withDist.slice(0, k);

      for (const n of nearest) {
        const alpha = Math.max(0.08, 0.35 * (1 - n.dist / (Math.max(w, h) * 0.7)));
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        const cx1 = qx + (n.x - qx) * 0.5 + Math.sin(n.phase + time * 0.3) * Math.min(w, h) * 0.03;
        const cy1 = qy + (n.y - qy) * 0.5 + Math.cos(n.phase + time * 0.25) * Math.min(w, h) * 0.03;
        ctx.quadraticCurveTo(cx1, cy1, n.x, n.y);
        ctx.strokeStyle = `rgba(${ac},${alpha})`;
        ctx.lineWidth = isLg() ? 1 : 0.6;
        ctx.stroke();

        ctx.font = `${fs(5)}px monospace`;
        ctx.fillStyle = `rgba(${ac},${alpha * 0.6})`;
        ctx.textAlign = "center";
        const sim = (1 - n.dist / (Math.max(w, h) * 0.55)).toFixed(2);
        ctx.fillText(`s=${sim}`, (qx + n.x) / 2 + Math.sin(time + n.phase) * 6, (qy + n.y) / 2 + Math.cos(time * 0.7 + n.phase) * 4);
      }

      const dotR = isLg() ? 3 : isMd() ? 2.5 : 2;
      for (const e of embs) {
        const isN = nearest.some((n) => n.x === e.x && n.y === e.y);
        const cc = clusterColors[e.cluster % clusterColors.length];
        ctx.beginPath();
        ctx.arc(e.x, e.y, isN ? dotR + 1 : dotR, 0, Math.PI * 2);
        ctx.fillStyle = isN ? `rgba(${ac},${0.4 + 0.3 * (0.5 + 0.5 * Math.sin(time + e.phase))})` : cc.dot;
        ctx.fill();
        if (isN) {
          ctx.strokeStyle = `rgba(${ac},${0.3 + 0.3 * (0.5 + 0.5 * Math.sin(time + e.phase))})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      for (const n of nearest) {
        ctx.font = `${fs(5)}px monospace`;
        ctx.fillStyle = `rgba(${ac},0.5)`;
        ctx.textAlign = "left";
        ctx.fillText(n.label, n.x + dotR + 3, n.y + 2);
      }

      const qPulse = 0.5 + 0.5 * Math.sin(time * 1.5);
      const qR = isLg() ? 6 : isMd() ? 5 : 4;
      ctx.beginPath();
      ctx.arc(qx, qy, qR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ac},${0.3 + 0.3 * qPulse})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${ac},${0.5 + 0.3 * qPulse})`;
      ctx.lineWidth = isLg() ? 2 : 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(qx, qy, qR + 5 + 3 * Math.sin(time), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${ac},${0.12 + 0.1 * qPulse})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = `${fs(7)}px monospace`;
      ctx.fillStyle = `rgba(${ac},${0.5 + 0.2 * qPulse})`;
      ctx.textAlign = "center";
      ctx.fillText("query", qx, qy - qR - 6);
      if (isMd()) {
        ctx.font = `${fs(5)}px monospace`;
        ctx.fillStyle = `rgba(${ac},0.2)`;
        ctx.fillText("embed → retrieve → rank", qx, qy + qR + fs(10));
      }

      ctx.font = `${fs(6)}px monospace`;
      ctx.fillStyle = `rgba(${ac},0.2)`;
      ctx.textAlign = "right";
      ctx.fillText(`semantic search · dense retrieval · top-${k}`, w - pd, fs(8));

      ctx.font = `${fs(5)}px monospace`;
      ctx.fillStyle = `rgba(${ac},0.12)`;
      ctx.textAlign = "left";
      ctx.fillText(`corpus: ${embs.length} docs · dim: 384 · index: HNSW`, pd, h - pd);

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [accentColor]);

  return (
    <div ref={parentRef} className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: 0.6 }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
