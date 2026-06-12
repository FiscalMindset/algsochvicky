"use client";
import { useEffect, useRef } from "react";

const modelBlocks = [
  [1,1,0,1,0,1,1,0,1,1],
  [0,1,1,0,1,1,0,1,0,1],
  [1,0,1,1,0,0,1,1,1,0],
  [0,1,0,1,1,1,0,1,0,1],
  [1,1,1,0,1,0,1,0,1,1],
];

const runeChars = "⬡⬢◈◇○●◎◉◐◑◒◓";
const hexChars = "0123456789abcdef";

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

export function RunAnywhereBg({ embedded }: { embedded?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const parent = parentRef.current!;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let animId = 0;
    let w = 0, h = 0;
    const dpr = window.devicePixelRatio || 1;
    let particles: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = [];

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

    function drawBlockMatrix(cx: number, cy: number, s: number, time: number) {
      const rows = modelBlocks.length;
      const cols = modelBlocks[0].length;
      const cell = Math.max(2, s / cols);
      const pulse = Math.sin(time * 0.5) * 0.3 + 0.7;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const val = modelBlocks[r][c];
          const x = cx - (cols * cell) / 2 + c * cell;
          const y = cy - (rows * cell) / 2 + r * cell;
          const alpha = val ? 0.08 + pulse * 0.12 : 0.03;
          ctx.fillStyle = `rgba(251,146,60,${alpha})`;
          ctx.fillRect(x, y, cell - 0.5, cell - 0.5);
        }
      }
    }

    function drawDownloadFlow(time: number) {
      const cy = h * 0.7;
      const cx = w * 0.2;
      const len = 20;
      const speed = time * 0.3;

      for (let i = 0; i < len; i++) {
        const phase = ((i / len) + speed) % 1;
        const x = cx + phase * w * 0.6;
        const y = cy + Math.sin(phase * 6 + time) * 4;
        const alpha = 0.1 + phase * 0.25;
        const size = 2 + phase * 3;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < 8; i++) {
        const phase2 = ((i / 8) + speed * 0.7) % 1;
        const x2 = cx + phase2 * w * 0.6;
        const y2 = cy + 20 + Math.sin(phase2 * 4 + time * 0.7) * 6;
        const hex = hexChars[Math.floor(phase2 * 16)];
        ctx.font = `${6 + phase2 * 4}px monospace`;
        ctx.fillStyle = `rgba(168,85,247,${0.05 + phase2 * 0.15})`;
        ctx.fillText(hex, x2, y2);
      }
    }

    function drawWasmNode(time: number) {
      const cx = w * 0.8;
      const cy = h * 0.25;
      const pulse = Math.sin(time * 1.2) * 0.5 + 0.5;
      const r = Math.min(w, h) * 0.04;

      ctx.beginPath();
      ctx.arc(cx, cy, r * (0.8 + pulse * 0.2), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16,185,129,${0.06 + pulse * 0.08})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(16,185,129,${0.15 + pulse * 0.1})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      const runeIdx = Math.floor(time * 2) % runeChars.length;
      ctx.font = `${Math.max(8, r * 0.5)}px serif`;
      ctx.fillStyle = `rgba(16,185,129,${0.2 + pulse * 0.15})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(runeChars[runeIdx], cx, cy);

      for (let i = 0; i < 3; i++) {
        const angle = time * 0.5 + i * 2.1;
        const dx = Math.cos(angle) * r * 1.4;
        const dy = Math.sin(angle) * r * 1.4;
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16,185,129,${0.2 + Math.sin(time + i) * 0.1})`;
        ctx.fill();
      }
    }

    function drawInferenceStream(time: number) {
      const cx = w * 0.5;
      const cy = h * 0.45;
      const count = 12;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + time * 0.15;
        const dist = Math.min(w, h) * 0.06;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const alpha = 0.04 + Math.sin(time + i * 0.8) * 0.03 + 0.04;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,146,60,${alpha})`;
        ctx.fill();
      }

      const tick = Math.floor(time * 3) % count;
      const ta = (tick / count) * Math.PI * 2 + time * 0.15;
      const td = Math.min(w, h) * 0.06;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(ta) * td, cy + Math.sin(ta) * td, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(251,146,60,0.35)";
      ctx.fill();
    }

    function drawParticles(time: number) {
      if (particles.length < 15 && Math.random() < 0.05) {
        particles.push({
          x: rand(0, w), y: rand(0, h),
          vx: rand(-0.2, 0.2), vy: rand(-0.3, -0.1),
          life: rand(0.5, 1), size: rand(1, 2.5),
        });
      }
      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.003;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,146,60,${p.life * 0.08})`;
        ctx.fill();
      }
    }

    function drawStatusBar(time: number) {
      const y = h - 4;
      const pulse = Math.sin(time * 0.5) * 0.5 + 0.5;
      const gradient = ctx.createLinearGradient(0, y, w, y);
      gradient.addColorStop(0, `rgba(16,185,129,${0.02 + pulse * 0.04})`);
      gradient.addColorStop(0.5, `rgba(251,146,60,${0.03 + pulse * 0.05})`);
      gradient.addColorStop(1, `rgba(168,85,247,${0.02 + pulse * 0.04})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y - 1, w, 2);

      ctx.font = "7px monospace";
      ctx.fillStyle = `rgba(255,255,255,${0.04 + pulse * 0.03})`;
      ctx.textAlign = "left";
      const memUse = (time * 0.7 % 100).toFixed(1);
      ctx.fillText(`runanywhere · wasm heap ${memUse}mb · model lfm2-350m · opfs cache · ${Math.floor(time * 0.2)} requests`, 8, y - 4);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (w < 100 || h < 100) { animId = requestAnimationFrame(draw); return; }

      const time = Date.now() / 1200;

      drawBlockMatrix(w * 0.18, h * 0.2, Math.min(w, h) * 0.12, time);
      drawDownloadFlow(time);
      drawWasmNode(time);
      drawInferenceStream(time);
      drawParticles(time);
      drawStatusBar(time);

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={parentRef}
      className={`pointer-events-none overflow-hidden ${embedded ? "absolute inset-0" : "fixed inset-0"}`}
      style={{ zIndex: 0 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
