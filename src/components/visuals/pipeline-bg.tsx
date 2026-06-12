"use client";
import { useEffect, useRef } from "react";

const terms = [
  "user", "intent", "context", "tools", "product",
  "route", "ground", "execute", "ship", "pipeline",
  "input", "plan", "reason", "act", "deliver",
  "signal", "flow", "layer", "stack", "runtime",
];

type PipeParticle = {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  phase: number;
  label: string;
};

export function PipelineBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const parent = parentRef.current!;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let animId = 0;
    let particles: PipeParticle[] = [];
    let w = 0, h = 0;
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
        const count = Math.min(20, Math.floor((w * h) / 30000));
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            radius: 1 + Math.random() * 1.5,
            phase: Math.random() * Math.PI * 2,
            label: terms[i % terms.length],
          });
        }
      }
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(parent);
    resize();

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const time = Date.now() / 2500;

      for (const p of particles) {
        p.x += p.vx + Math.sin(time + p.phase) * 0.08;
        p.y += p.vy + Math.cos(time * 0.7 + p.phase) * 0.08;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(251,146,60,${(1 - dist / 90) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 1.5 + p.phase);
        const r = p.radius * (0.7 + 0.3 * pulse);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,146,60,0.06)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,146,60,${0.3 + 0.2 * pulse})`;
        ctx.fill();

        ctx.font = "7px monospace";
        ctx.fillStyle = `rgba(251,146,60,${0.15 + 0.12 * pulse})`;
        ctx.fillText(p.label, p.x + r + 2, p.y + 2);
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <div ref={parentRef} className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]">
      <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.6 }} />
    </div>
  );
}
