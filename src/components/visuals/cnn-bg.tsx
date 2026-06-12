"use client";
import { useEffect, useRef } from "react";

const samples = [
  [0,0,0,0,0,1,1,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,0,0,1,1,0,0,0],
  [0,0,0,0,0,1,1,0,0,0,0,0],
];

const labels = ["label", "augment", "normalize", "conv1", "pool", "conv2", "fc", "dropout", "softmax"];

export function CnnBg() {
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

    let convX = 0, convDir = 1;

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

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const time = Date.now() / 800;
      const epoch = Math.floor(time * 0.15) + 1;
      const loss = (0.7 * Math.exp(-epoch * 0.12) + 0.3 * Math.exp(-epoch * 0.04) + 0.05 * Math.sin(time * 0.3)).toFixed(4);
      const acc = Math.min(97, Math.floor(20 + 60 * (1 - Math.exp(-epoch * 0.08)) + 5 * Math.sin(epoch * 0.5)));

      const p = Math.max(3, Math.floor(w * 0.018));
      const g = Math.max(2, Math.floor(w * 0.008));
      const f = (n: number) => Math.max(4, Math.round(n * Math.min(w, 1100) / 900));
      const isLg = w > 640;
      const isMd = w > 420;
      const botH = Math.max(18, Math.floor(h * 0.08));
      const mainH = h - botH - 2 * p;

      if (isLg) {
        const cw = Math.floor((w - 4 * p) / 3);
        const ss = Math.max(2, Math.floor(cw / 22));
        const sr = Math.max(3, Math.min(10, Math.floor(mainH / (ss + 2))));
        const sc = Math.max(3, Math.min(12, Math.floor(cw / (ss + 2))));
        for (let r = 0; r < sr; r++) {
          for (let c = 0; c < sc; c++) {
            const val = samples[r % samples.length][c % samples[0].length];
            ctx.fillStyle = val
              ? `rgba(251,146,60,${0.15 + val * 0.3})`
              : `rgba(251,146,60,0.03)`;
            ctx.fillRect(p + c * (ss + 2), p + r * (ss + 2), ss, ss);
          }
        }
        ctx.font = `${f(7)}px monospace`;
        ctx.fillStyle = "rgba(251,146,60,0.4)";
        ctx.textAlign = "left";
        ctx.fillText("data labeling", p, p + sr * (ss + 2) + f(8));
        ctx.font = `${f(5)}px monospace`;
        ctx.fillStyle = "rgba(251,146,60,0.2)";
        ctx.fillText("2,847 · 3 cls", p, p + sr * (ss + 2) + f(15));

        const tx = 2 * p + cw;
        const tw = cw;
        const ty = p;
        const th = mainH;
        ctx.beginPath();
        for (let i = 0; i <= 30; i++) {
          const x = tx + (i / 30) * tw;
          const t = (i / 30) * epoch * 0.5;
          const y = ty + th - (0.7 * Math.exp(-t * 0.12) + 0.3 * Math.exp(-t * 0.04)) * th * 0.75;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(251,146,60,0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i <= 30; i++) {
          const x = tx + (i / 30) * tw;
          const t = (i / 30) * epoch * 0.5;
          const y = ty + th - (20 + 60 * (1 - Math.exp(-t * 0.08))) / 100 * th * 0.75;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(134,239,172,0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = `${f(7)}px monospace`;
        ctx.fillStyle = "rgba(251,146,60,0.3)";
        ctx.textAlign = "left";
        ctx.fillText(`epoch ${epoch}`, tx + g, ty + f(8));
        ctx.fillText(`loss ${loss}`, tx + g, ty + f(16));
        ctx.fillStyle = "rgba(134,239,172,0.35)";
        ctx.fillText(`acc ${acc}%`, tx + g, ty + f(24));

        const px2 = 3 * p + 2 * cw;
        const sh = Math.max(10, (mainH - g * (labels.length - 1)) / labels.length);
        labels.forEach((label, i) => {
          const sy = p + i * (sh + g);
          const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.5 + i * 0.8));
          const active = i === Math.floor(time * 0.3) % labels.length;
          ctx.fillStyle = active
            ? `rgba(251,146,60,${0.15 + 0.15 * pulse})`
            : `rgba(251,146,60,${0.03 + 0.03 * pulse})`;
          ctx.fillRect(px2, sy, cw, sh);
          ctx.strokeStyle = active
            ? `rgba(251,146,60,${0.25 + 0.25 * pulse})`
            : `rgba(251,146,60,0.06)`;
          ctx.lineWidth = active ? 1 : 0.5;
          ctx.strokeRect(px2, sy, cw, sh);
          ctx.fillStyle = active
            ? `rgba(251,146,60,${0.5 + 0.3 * pulse})`
            : `rgba(251,146,60,0.15)`;
          ctx.font = `${f(6)}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(label, px2 + cw / 2, sy + sh / 2 + f(3));
        });
      } else if (isMd) {
        const cw = Math.floor(w * 0.55);
        const ppw = w - cw - 3 * p;
        const ss = Math.max(2, Math.floor(ppw / 10));
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 6; c++) {
            const val = samples[r % samples.length][c % samples[0].length];
            ctx.fillStyle = val
              ? `rgba(251,146,60,${0.15 + val * 0.3})`
              : `rgba(251,146,60,0.03)`;
            ctx.fillRect(cw + 2 * p + c * (ss + 1), p + r * (ss + 1), ss, ss);
          }
        }
        ctx.font = `${f(5)}px monospace`;
        ctx.fillStyle = "rgba(251,146,60,0.25)";
        ctx.textAlign = "left";
        ctx.fillText("labeling", cw + 2 * p, p + 6 * (ss + 1) + f(6));

        const tx = p;
        const tw = cw;
        const ty = p;
        const th = mainH;
        ctx.beginPath();
        for (let i = 0; i <= 25; i++) {
          const x = tx + (i / 25) * tw;
          const t = (i / 25) * epoch * 0.5;
          const y = ty + th - (0.7 * Math.exp(-t * 0.12) + 0.3 * Math.exp(-t * 0.04)) * th * 0.75;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(251,146,60,0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i <= 25; i++) {
          const x = tx + (i / 25) * tw;
          const t = (i / 25) * epoch * 0.5;
          const y = ty + th - (20 + 60 * (1 - Math.exp(-t * 0.08))) / 100 * th * 0.75;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(134,239,172,0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = `${f(6)}px monospace`;
        ctx.fillStyle = "rgba(251,146,60,0.3)";
        ctx.textAlign = "left";
        ctx.fillText(`epoch ${epoch}  loss ${loss}  acc ${acc}%`, tx + g, ty + f(7));
      } else {
        const tx = p;
        const tw = w - 2 * p;
        const ty = p;
        const th = mainH;
        ctx.beginPath();
        for (let i = 0; i <= 20; i++) {
          const x = tx + (i / 20) * tw;
          const t = (i / 20) * epoch * 0.5;
          const y = ty + th - (0.7 * Math.exp(-t * 0.12) + 0.3 * Math.exp(-t * 0.04)) * th * 0.75;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(251,146,60,0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i <= 20; i++) {
          const x = tx + (i / 20) * tw;
          const t = (i / 20) * epoch * 0.5;
          const y = ty + th - (20 + 60 * (1 - Math.exp(-t * 0.08))) / 100 * th * 0.75;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(134,239,172,0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = `${f(6)}px monospace`;
        ctx.fillStyle = "rgba(251,146,60,0.35)";
        ctx.textAlign = "left";
        ctx.fillText(`epoch ${epoch}  loss ${loss}  acc ${acc}%`, tx + g, ty + f(7));

        const ss2 = Math.max(2, Math.floor(tw / 24));
        const cols = Math.min(20, Math.floor(tw / (ss2 + 1)));
        const rows = Math.min(4, Math.floor(20 / (ss2 + 1)));
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const val = samples[r % samples.length][c % samples[0].length];
            ctx.fillStyle = val
              ? `rgba(251,146,60,${0.12 + val * 0.25})`
              : `rgba(251,146,60,0.02)`;
            ctx.fillRect(tx + c * (ss2 + 1), ty + th - (rows + 1) * (ss2 + 1) + r * (ss2 + 1), ss2, ss2);
          }
        }
      }

      const by = h - botH;
      ctx.fillStyle = "rgba(251,146,60,0.06)";
      ctx.fillRect(p, by, w - 2 * p, botH - g);
      const classes = ["face_A", "face_B", "face_C"];
      const preds = classes.map((c, i) => ({
        name: c, prob: [0.88, 0.07, 0.05][i] + 0.02 * Math.sin(time + i),
      }));
      let bx = 2 * p;
      ctx.font = `${f(5)}px monospace`;
      preds.forEach((pr) => {
        const bw = (w - 4 * p) / 3;
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(bx, by + g, bw - g, botH - 2 * g - 2);
        ctx.fillStyle = `rgba(251,146,60,${0.15 + 0.3 * pr.prob})`;
        ctx.fillRect(bx, by + g, (bw - g) * pr.prob, botH - 2 * g - 2);
        ctx.fillStyle = "rgba(251,146,60,0.3)";
        ctx.textAlign = "left";
        ctx.fillText(`${pr.name} ${(pr.prob * 100).toFixed(0)}%`, bx + g, by + botH / 2 + f(2));
        bx += bw + g;
      });

      ctx.font = `${f(5)}px monospace`;
      ctx.fillStyle = "rgba(251,146,60,0.15)";
      ctx.textAlign = "right";
      ctx.fillText(`cnn_face_v3 · batch ${Math.floor(time * 2) % 128 + 1}/128 · lr 0.001`, w - p, f(6));

      convX += 0.5 * convDir;
      if (convX > w - 30 || convX < 10) convDir *= -1;
      const cs = Math.max(6, Math.floor(w * 0.025));
      ctx.fillStyle = "rgba(251,146,60,0.08)";
      ctx.fillRect(convX, by - cs * 0.7, cs, cs * 1.3);
      ctx.strokeStyle = `rgba(251,146,60,${0.15 + 0.15 * Math.sin(time)})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(convX, by - cs * 0.7, cs, cs * 1.3);
      ctx.font = `${f(4)}px monospace`;
      ctx.fillStyle = "rgba(251,146,60,0.2)";
      ctx.textAlign = "center";
      ctx.fillText("conv", convX + cs / 2, by - cs * 0.7 + cs * 0.7 + f(3));

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <div ref={parentRef} className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: 0.5 }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
