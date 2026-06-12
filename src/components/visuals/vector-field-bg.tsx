"use client";
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  label: string;
};

const labels = [
  "dim_128", "embed", "attn", "0.94", "pool",
  "dense", "dropout", "norm", "relu", "softmax",
  "token", "cls", "sep", "mask", "pos",
  "enc_1", "enc_2", "enc_3", "ffwd", "head",
  "ctx", "query", "key", "val", "logit",
  "loss", "grad", "lr", "batch", "epoch",
];

export function VectorFieldBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const parent = parentRef.current!;

    const ctx = canvas.getContext("2d")!;

    let animId = 0;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    const dpr = window.devicePixelRatio || 1;

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
      if (particles.length === 0) {
        const count = Math.min(40, Math.floor((w * h) / 20000));
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: 1 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2,
            label: labels[i % labels.length],
          });
        }
      }
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(parent);
    resize();

    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, w, h);

      const time = Date.now() / 2000;

      for (const p of particles) {
        p.x += p.vx + Math.sin(time + p.phase) * 0.1;
        p.y += p.vy + Math.cos(time + p.phase * 0.7) * 0.1;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const pulse = 0.6 + 0.4 * Math.sin(time * 1.2 + p.phase);
        const r = p.radius * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,0.08)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148,163,184,${0.5 + 0.3 * pulse})`;
        ctx.fill();

        ctx.font = "8px monospace";
        ctx.fillStyle = `rgba(148,163,184,${0.25 + 0.15 * pulse})`;
        ctx.fillText(p.label, p.x + r + 3, p.y + 3);
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={parentRef} className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.85 }}
      />
    </div>
  );
}
