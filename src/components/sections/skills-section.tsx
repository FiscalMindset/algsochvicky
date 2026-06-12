import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SectionHeading } from "../ui/section-heading";
import { FiscalMindsetBadge } from "../ui/fiscalmindset-badge";

type SkillItem = {
  name: string;
  level: number;
};

type SkillCategory = {
  title: string;
  icon: string;
  color: string;
  ringColor: string;
  label: string;
  highlight: string;
  skills: SkillItem[];
};

const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    icon: "⌨️",
    label: "Core programming",
    highlight: "6 languages across systems, web, and data",
    color: "from-blue-500/20 to-blue-600/10",
    ringColor: "stroke-blue-500",
    skills: [
      { name: "Python", level: 95 },
      { name: "Kotlin", level: 80 },
      { name: "JavaScript", level: 85 },
      { name: "TypeScript", level: 82 },
      { name: "SQL", level: 75 },
      { name: "HTML/CSS", level: 78 }
    ]
  },
  {
    title: "AI / ML",
    icon: "🤖",
    label: "Agentic AI & on-device",
    highlight: "9 technologies across the full AI stack",
    color: "from-purple-500/20 to-purple-600/10",
    ringColor: "stroke-purple-500",
    skills: [
      { name: "LangGraph", level: 90 },
      { name: "LangChain", level: 88 },
      { name: "PyTorch", level: 75 },
      { name: "RunAnywhere SDK", level: 92 },
      { name: "On-Device AI", level: 95 },
      { name: "SmolLM2", level: 85 },
      { name: "SmolVLM", level: 78 },
      { name: "Whisper", level: 70 },
      { name: "Circuit Discovery", level: 65 }
    ]
  },
  {
    title: "Frontend",
    icon: "🎨",
    label: "UI & interaction",
    highlight: "6 frameworks and libraries",
    color: "from-cyan-500/20 to-cyan-600/10",
    ringColor: "stroke-cyan-500",
    skills: [
      { name: "React", level: 88 },
      { name: "Next.js", level: 80 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Vite", level: 82 },
      { name: "Jetpack Compose", level: 75 },
      { name: "Framer Motion", level: 78 }
    ]
  },
  {
    title: "Backend",
    icon: "⚙️",
    label: "APIs & data",
    highlight: "6 backend technologies",
    color: "from-green-500/20 to-green-600/10",
    ringColor: "stroke-green-500",
    skills: [
      { name: "FastAPI", level: 88 },
      { name: "Node.js", level: 80 },
      { name: "PostgreSQL", level: 75 },
      { name: "SQLite", level: 72 },
      { name: "REST APIs", level: 85 },
      { name: "WebSockets", level: 70 }
    ]
  },
  {
    title: "Infrastructure",
    icon: "🏗️",
    label: "DevOps & orchestration",
    highlight: "6 infra tools",
    color: "from-orange-500/20 to-orange-600/10",
    ringColor: "stroke-orange-500",
    skills: [
      { name: "Docker", level: 75 },
      { name: "Kestra", level: 85 },
      { name: "Render", level: 80 },
      { name: "Vercel", level: 78 },
      { name: "ngrok", level: 70 },
      { name: "GitHub Actions", level: 82 }
    ]
  },
  {
    title: "Tools",
    icon: "🔧",
    label: "AI coding & productivity",
    highlight: "6 essential tools",
    color: "from-pink-500/20 to-pink-600/10",
    ringColor: "stroke-pink-500",
    skills: [
      { name: "Coral MCP", level: 92 },
      { name: "OpenCode", level: 88 },
      { name: "Cursor", level: 85 },
      { name: "VS Code", level: 90 },
      { name: "Playwright", level: 72 },
      { name: "FFmpeg", level: 68 }
    ]
  }
];

function SkillBar({ name, level, index, highlighted }: { name: string; level: number; index: number; highlighted?: boolean }) {
  return (
    <motion.div
      className="group relative cursor-pointer"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: "-20px" }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${highlighted ? "bg-accent" : "bg-white/20"}`} />
          <span className="text-xs text-ink/85 group-hover:text-ink transition-colors">{name}</span>
        </span>
        <motion.span
          className="text-[10px] font-mono text-muted group-hover:text-ink/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.35 + index * 0.04 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-2 rounded-full bg-white/6 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-white/30 to-white/60 group-hover:from-accent/50 group-hover:to-accent/80"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: false, margin: "-20px" }}
          transition={{ delay: 0.2 + index * 0.04, duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function RadarChart({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const displayCat = hoveredCategory ?? selectedCategory;

  const categories = skillCategories.map(c => ({
    label: c.title,
    level: Math.round(c.skills.reduce((s, sk) => s + sk.level, 0) / c.skills.length),
    color: c.ringColor.replace("stroke-", ""),
    ringColor: c.ringColor,
  }));

  const cx = 120, cy = 120, r = 90, numAxes = categories.length;
  const angleStep = (Math.PI * 2) / numAxes;

  const points = categories.map((cat, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const value = cat.level / 100;
    return { x: cx + r * value * Math.cos(angle), y: cy + r * value * Math.sin(angle) };
  });

  const gridLevels = [25, 50, 75, 100];
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5 }}
    >
      <svg width="280" height="280" viewBox="0 0 240 240" className="overflow-visible">
        {gridLevels.map(lvl => {
          const gl = lvl / 100;
          const pts = categories.map((_, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            return `${cx + r * gl * Math.cos(angle)},${cy + r * gl * Math.sin(angle)}`;
          }).join(" ");
          return <polygon key={lvl} points={pts} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/8" />;
        })}

        {categories.map((cat, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          const x2 = cx + r * Math.cos(angle);
          const y2 = cy + r * Math.sin(angle);
          const isActive = displayCat === cat.label;
          return (
            <line key={i} x1={cx} y1={cy} x2={x2} y2={y2}
              stroke="currentColor"
              strokeWidth={isActive ? "1.5" : "0.5"}
              className={isActive ? "text-accent/40" : "text-white/8"}
              style={{ transition: "stroke-width 0.3s, color 0.3s" }}
            />
          );
        })}

        <motion.polygon
          points={polyPoints}
          fill={displayCat ? "rgba(255,107,107,0.08)" : "rgba(255,107,107,0.12)"}
          stroke="rgba(255,107,107,0.5)"
          strokeWidth="1.5"
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {categories.map((cat, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          const val = cat.level / 100;
          const px = cx + r * val * Math.cos(angle);
          const py = cy + r * val * Math.sin(angle);
          const lx = cx + (r + 20) * Math.cos(angle);
          const ly = cy + (r + 20) * Math.sin(angle);
          const isActive = displayCat === cat.label;
          const isSelected = selectedCategory === cat.label;

          return (
            <g
              key={cat.label}
              className="cursor-pointer"
              onClick={() => onSelectCategory(isSelected ? null : cat.label)}
              onMouseEnter={() => setHoveredCategory(cat.label)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <line x1={cx} y1={cy} x2={lx} y2={ly} stroke="transparent" strokeWidth="24" />

              <motion.circle
                cx={px} cy={py}
                r={isActive ? 5 : 3}
                fill={cat.color}
                initial={{ r: 0 }}
                whileInView={{ r: isActive ? 5 : 3 }}
                viewport={{ once: false }}
                transition={{ delay: 0.3 + i * 0.05 }}
              />
              {isActive && (
                <circle cx={px} cy={py} r="8" fill="none" stroke="rgba(255,107,107,0.3)" strokeWidth="1" />
              )}

              <text
                x={lx} y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`fill-current text-[7px] font-mono transition-colors duration-300 ${
                  isActive ? "text-accent font-semibold" : "text-[#c9d1d9]"
                }`}
                transform={`rotate(${(angle * 180) / Math.PI + 90}, ${lx}, ${ly})`}
              >
                {cat.label}
              </text>

              {isActive && (
                <text
                  x={lx} y={ly + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-accent/70 text-[6px] font-mono"
                  transform={`rotate(${(angle * 180) / Math.PI + 90}, ${lx}, ${ly + 10})`}
                >
                  {cat.level}%
                </text>
              )}
            </g>
          );
        })}

        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-muted/50 text-[6px] font-mono">
          {displayCat ?? "6 domains"}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" className="fill-accent/60 text-[7px] font-mono font-bold">
          {displayCat
            ? `${categories.find(c => c.label === displayCat)?.level ?? ""}%`
            : "avg"
          }
        </text>
      </svg>
    </motion.div>
  );
}

type DetailPanelProps = {
  category: SkillCategory;
  onClose: () => void;
};

function DetailPanel({ category, onClose }: DetailPanelProps) {
  const catAvg = Math.round(category.skills.reduce((s, sk) => s + sk.level, 0) / category.skills.length);
  const topSkill = useMemo(() => category.skills.reduce((best, s) => s.level > best.level ? s : best), [category]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        className={`relative rounded-2xl border border-accent/30 bg-gradient-to-br ${category.color} p-6`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-7 w-7 rounded-full border border-white/10 bg-black/20 flex items-center justify-center text-xs text-muted hover:text-ink hover:border-accent/30 transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
            <span className="text-2xl">{category.icon}</span>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent/90 font-semibold">
              {category.title}
            </div>
            <div className="text-sm text-muted mt-0.5">{category.highlight}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-center">
              <span className="font-mono text-xs font-bold text-accent">{catAvg}%</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-3">Proficiency Distribution</div>
            <div className="space-y-1">
              {category.skills
                .slice()
                .sort((a, b) => b.level - a.level)
                .map((skill, idx) => {
                  const projCount = projectSkillData
                    .filter(p => p.skills.some(s => s.name === skill.name))
                    .length;
                  return (
                    <motion.div
                      key={skill.name}
                      className="group relative flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 transition hover:border-white/8 hover:bg-white/4"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: idx * 0.04, duration: 0.3 }}
                    >
                      <span className="w-24 truncate text-xs text-ink/80 group-hover:text-ink transition-colors">{skill.name}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-white/6 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${skill.level > 85 ? "rgba(255,107,107,0.7)" : "rgba(255,200,150,0.4)"}, rgba(255,107,107,0.5))`
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: false }}
                          transition={{ delay: 0.1 + idx * 0.04, duration: 0.6 }}
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`font-mono text-[10px] ${skill.level > 80 ? "text-accent" : "text-muted"}`}>{skill.level}%</span>
                        <span className="font-mono text-[8px] text-muted/50">×{projCount}</span>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-2">Skill Analysis</div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-muted">Spread</span>
                  <span className="font-mono text-[10px] text-ink">
                    {category.skills[0]?.level ?? 0}% – {category.skills[category.skills.length - 1]?.level ?? 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-muted">Avg. Proficiency</span>
                  <span className="font-mono text-[10px] text-ink">{catAvg}%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-muted">Technologies</span>
                  <span className="font-mono text-[10px] text-ink">{category.skills.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted">Project Usage</span>
                  <span className="font-mono text-[10px] text-ink">
                    {category.skills.filter(s => projectSkillData.some(p => p.skills.some(ps => ps.name === s.name))).length}/{category.skills.length}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-2">Mini Chart</div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <svg width="100%" height="48" viewBox="0 0 200 48" className="overflow-visible">
                  {category.skills.map((skill, i) => {
                    const x = (i / (category.skills.length - 1 || 1)) * 180 + 10;
                    const y = 44 - (skill.level / 100) * 36;
                    return (
                      <g key={skill.name}>
                        <motion.circle
                          cx={x} cy={y} r="3"
                          fill="#ff6b6b"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: false }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                        />
                        <text x={x} y="46" textAnchor="middle" className="fill-[#6e7681] text-[5px] font-mono">
                          {skill.level}
                        </text>
                      </g>
                    );
                  })}
                  <motion.path
                    d={category.skills.map((skill, i) => {
                      const x = (i / (category.skills.length - 1 || 1)) * 180 + 10;
                      const y = 44 - (skill.level / 100) * 36;
                      return `${i === 0 ? "M" : "L"}${x},${y}`;
                    }).join(" ")}
                    fill="none"
                    stroke="rgba(255,107,107,0.5)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                  />
                  <motion.path
                    d={category.skills.map((skill, i) => {
                      const x = (i / (category.skills.length - 1 || 1)) * 180 + 10;
                      const y = 44 - (skill.level / 100) * 36;
                      return `${i === 0 ? "M" : "L"}${x},${y}`;
                    }).join(" ") + ` L${(category.skills.length - 1) / (category.skills.length - 1 || 1) * 180 + 10},44 L10,44 Z`}
                    fill="rgba(255,107,107,0.06)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
              </div>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-2">Used In Projects</div>
              <div className="flex flex-wrap gap-1.5">
                {category.skills
                  .slice()
                  .sort((a, b) => {
                    const aCount = projectSkillData.filter(p => p.skills.some(s => s.name === a.name)).length;
                    const bCount = projectSkillData.filter(p => p.skills.some(s => s.name === b.name)).length;
                    return bCount - aCount;
                  })
                  .slice(0, 3)
                  .map(skill => {
                    const projects = projectSkillData.filter(p => p.skills.some(s => s.name === skill.name));
                    return (
                      <div key={skill.name} className="rounded-lg border border-white/10 bg-black/15 p-2 flex-1 min-w-[100px]">
                        <div className="text-[10px] font-semibold text-ink">{skill.name}</div>
                        <div className="text-[8px] text-muted mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {projects.slice(0, 2).map(p => (
                            <a key={p.project} href={p.url} target="_blank" rel="noreferrer"
                              className="font-mono text-[7px] text-accent/70 hover:text-accent truncate max-w-[80px] block"
                            >
                              {p.project}
                            </a>
                          ))}
                          {projects.length > 2 && (
                            <span className="font-mono text-[7px] text-muted/50">+{projects.length - 2}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TransformerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dims = useRef({ w: 0, h: 0 });

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { w, h } = dims.current;
    ctx.clearRect(0, 0, w, h);

    const cols = 8;
    const rows = 4;
    const spacingX = w / (cols + 1);
    const spacingY = h / (rows + 1);
    const time = Date.now() / 2000;

    const nodes: { x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        nodes.push({ x: spacingX * (c + 1), y: spacingY * (r + 1) });
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dy = nodes[j].y - nodes[i].y;
        const dx = nodes[j].x - nodes[i].x;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > spacingX * 2.2) continue;

        const phase = Math.sin(time + i * 1.7 + j * 2.3 + dist * 0.02);
        const alpha = Math.max(0, phase * 0.25);
        if (alpha < 0.02) continue;

        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        const cpx = (nodes[i].x + nodes[j].x) / 2 + Math.sin(time + i) * 10;
        const cpy = (nodes[i].y + nodes[j].y) / 2 + Math.cos(time + j) * 10;
        ctx.quadraticCurveTo(cpx, cpy, nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(255, 107, 107, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    nodes.forEach((node, i) => {
      const pulse = Math.sin(time * 0.8 + i * 1.1) * 0.3 + 0.7;
      const radius = 2 + pulse * 1.5;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 200, 150, ${0.25 + pulse * 0.3})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 107, 107, ${0.06 + pulse * 0.08})`;
      ctx.fill();
    });

    for (let i = 0; i < 3; i++) {
      const x = spacingX * (1 + i * 3.5);
      const y = spacingY * 0.5;
      const ww = spacingX * 2.5;
      const hh = spacingY * 0.25;
      const bright = Math.sin(time * 0.5 + i * 2.1) * 0.2 + 0.3;
      ctx.fillStyle = `rgba(255, 107, 107, ${bright * 0.3})`;
      ctx.beginPath();
      ctx.roundRect(x - ww / 2, y - hh / 2, ww, hh, 4);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      dims.current = { w: rect.width, h: rect.height };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    let animId: number;
    const loop = () => {
      draw(ctx);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
    className="pointer-events-none absolute inset-0 opacity-70"
    style={{ mixBlendMode: "screen" }}
    />
  );
}

export type ProjectSkillMap = {
  project: string;
  url: string;
  account: string;
  description: string;
  skills: { name: string; category: string }[];
};

export const projectSkillData: ProjectSkillMap[] = [
  {
    project: "algsoch (Android)",
    url: "https://github.com/FiscalMindset/algsoch",
    account: "FiscalMindset",
    description: "On-device AI agent for Android — runs SmolLM2, SmolVLM, and Whisper locally.",
    skills: [
      { name: "Kotlin", category: "Languages" },
      { name: "RunAnywhere SDK", category: "AI / ML" },
      { name: "On-Device AI", category: "AI / ML" },
      { name: "SmolLM2", category: "AI / ML" },
      { name: "SmolVLM", category: "AI / ML" },
      { name: "Whisper", category: "AI / ML" },
      { name: "Jetpack Compose", category: "Frontend" }
    ]
  },
  {
    project: "algsochnews",
    url: "https://github.com/FiscalMindset/algsochnews",
    account: "FiscalMindset",
    description: "AI news aggregator with LangGraph agents and FFmpeg video processing.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "LangGraph", category: "AI / ML" },
      { name: "LangChain", category: "AI / ML" },
      { name: "FastAPI", category: "Backend" },
      { name: "React", category: "Frontend" },
      { name: "Docker", category: "Infrastructure" },
      { name: "Render", category: "Infrastructure" },
      { name: "FFmpeg", category: "Tools" }
    ]
  },
  {
    project: "Synapse-Graph",
    url: "https://github.com/FiscalMindset/Synapse-Graph",
    account: "FiscalMindset",
    description: "Mechanistic interpretability toolkit using PyTorch and circuit discovery.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "PyTorch", category: "AI / ML" },
      { name: "Circuit Discovery", category: "AI / ML" },
      { name: "FastAPI", category: "Backend" },
      { name: "React", category: "Frontend" },
      { name: "Next.js", category: "Frontend" },
      { name: "Docker", category: "Infrastructure" }
    ]
  },
  {
    project: "careops",
    url: "https://github.com/FiscalMindset/careops",
    account: "FiscalMindset",
    description: "Healthcare operations platform with Next.js, PostgreSQL, and Coral MCP.",
    skills: [
      { name: "TypeScript", category: "Languages" },
      { name: "SQL", category: "Languages" },
      { name: "Next.js", category: "Frontend" },
      { name: "Tailwind CSS", category: "Frontend" },
      { name: "PostgreSQL", category: "Backend" },
      { name: "Vercel", category: "Infrastructure" },
      { name: "Coral MCP", category: "Tools" }
    ]
  },
  {
    project: "devalert",
    url: "https://github.com/FiscalMindset/devalert",
    account: "FiscalMindset",
    description: "DevOps alerting pipeline powered by Kestra and GitHub Actions.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "Kestra", category: "Infrastructure" },
      { name: "GitHub Actions", category: "Infrastructure" },
      { name: "Docker", category: "Infrastructure" }
    ]
  },
  {
    project: "autopr",
    url: "https://github.com/FiscalMindset/autopr",
    account: "FiscalMindset",
    description: "Automated PR management and workflow orchestration with Kestra.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "Kestra", category: "Infrastructure" },
      { name: "GitHub Actions", category: "Infrastructure" }
    ]
  },
  {
    project: "PathPilot-India",
    url: "https://github.com/FiscalMindset/PathPilot-India",
    account: "FiscalMindset",
    description: "Career guidance platform matching skills to Indian job market trends.",
    skills: [
      { name: "TypeScript", category: "Languages" },
      { name: "React", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "FastAPI", category: "Backend" },
      { name: "PostgreSQL", category: "Backend" },
      { name: "Docker", category: "Infrastructure" }
    ]
  },
  {
    project: "Cognivise",
    url: "https://github.com/algsoch/Cognivise",
    account: "algsoch",
    description: "Real-time collaborative whiteboard with WebSocket sync.",
    skills: [
      { name: "JavaScript", category: "Languages" },
      { name: "Node.js", category: "Backend" },
      { name: "WebSockets", category: "Backend" },
      { name: "REST APIs", category: "Backend" }
    ]
  },
  {
    project: "venture_analyst",
    url: "https://github.com/algsoch/venture_analyst",
    account: "algsoch",
    description: "AI-powered startup analysis agent using LangGraph and FastAPI.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "LangGraph", category: "AI / ML" },
      { name: "LangChain", category: "AI / ML" },
      { name: "FastAPI", category: "Backend" },
      { name: "PostgreSQL", category: "Backend" },
      { name: "Docker", category: "Infrastructure" }
    ]
  },
  {
    project: "indianlabour",
    url: "https://github.com/algsoch/indianlabour",
    account: "algsoch",
    description: "Labour law analysis tool with LangChain-powered legal Q&A.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "LangChain", category: "AI / ML" },
      { name: "FastAPI", category: "Backend" },
      { name: "SQLite", category: "Backend" },
      { name: "Docker", category: "Infrastructure" },
      { name: "Render", category: "Infrastructure" }
    ]
  },
  {
    project: "brain_tumor",
    url: "https://github.com/algsoch/brain_tumor",
    account: "algsoch",
    description: "Brain tumour classification API using PyTorch and FastAPI.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "PyTorch", category: "AI / ML" },
      { name: "FastAPI", category: "Backend" },
      { name: "REST APIs", category: "Backend" },
      { name: "Render", category: "Infrastructure" }
    ]
  },
  {
    project: "job_agentic",
    url: "https://github.com/algsoch/job_agentic",
    account: "algsoch",
    description: "Agentic job search and application automation with LangGraph.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "LangGraph", category: "AI / ML" },
      { name: "LangChain", category: "AI / ML" },
      { name: "Docker", category: "Infrastructure" }
    ]
  },
  {
    project: "speakai",
    url: "https://github.com/algsoch/speakai",
    account: "algsoch",
    description: "On-device voice AI agent using RunAnywhere SDK and React.",
    skills: [
      { name: "TypeScript", category: "Languages" },
      { name: "RunAnywhere SDK", category: "AI / ML" },
      { name: "On-Device AI", category: "AI / ML" },
      { name: "React", category: "Frontend" },
      { name: "Vite", category: "Frontend" }
    ]
  },
  {
    project: "smart_terminal",
    url: "https://github.com/algsoch/smart_terminal",
    account: "algsoch",
    description: "AI-augmented terminal with on-device command suggestions.",
    skills: [
      { name: "TypeScript", category: "Languages" },
      { name: "On-Device AI", category: "AI / ML" },
      { name: "RunAnywhere SDK", category: "AI / ML" },
      { name: "React", category: "Frontend" },
      { name: "Vite", category: "Frontend" }
    ]
  },
  {
    project: "clutchzone",
    url: "https://github.com/algsoch/clutchzone",
    account: "algsoch",
    description: "Real-time multiplayer game backend with WebSocket rooms.",
    skills: [
      { name: "JavaScript", category: "Languages" },
      { name: "Node.js", category: "Backend" },
      { name: "WebSockets", category: "Backend" },
      { name: "REST APIs", category: "Backend" }
    ]
  },
  {
    project: "freelancer.com AI Bid",
    url: "https://github.com/algsoch/freelancer.com",
    account: "algsoch",
    description: "Automated bidding agent for freelancer.com gigs using AI.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "React", category: "Frontend" },
      { name: "FastAPI", category: "Backend" }
    ]
  },
  {
    project: "html-checker",
    url: "https://github.com/algsoch/html-checker",
    account: "algsoch",
    description: "HTML validation and accessibility checker with FastAPI backend.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "FastAPI", category: "Backend" },
      { name: "HTML/CSS", category: "Languages" },
      { name: "Render", category: "Infrastructure" }
    ]
  },
  {
    project: "Kairon",
    url: "https://github.com/FiscalMindset/Kairon",
    account: "FiscalMindset",
    description: "Automated UI testing framework combining Playwright and FastAPI.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "Playwright", category: "Tools" },
      { name: "FastAPI", category: "Backend" }
    ]
  },
  {
    project: "english_bot",
    url: "https://github.com/algsoch/english_bot",
    account: "algsoch",
    description: "English learning chatbot with REST API and conversational AI.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "REST APIs", category: "Backend" }
    ]
  },
  {
    project: "dynamic-prompt-studio",
    url: "https://github.com/algsoch/dynamic-prompt-studio",
    account: "algsoch",
    description: "Visual prompt engineering studio for LLM experimentation.",
    skills: [
      { name: "Python", category: "Languages" },
      { name: "React", category: "Frontend" },
      { name: "HTML/CSS", category: "Languages" },
      { name: "FastAPI", category: "Backend" }
    ]
  },
  {
    project: "Sentinel Grid",
    url: "https://github.com/FiscalMindset/women",
    account: "FiscalMindset",
    description: "Women safety monitoring grid with real-time alert orchestration.",
    skills: [
      { name: "TypeScript", category: "Languages" },
      { name: "React", category: "Frontend" },
      { name: "Kestra", category: "Infrastructure" }
    ]
  }
];

const categoryColors: Record<string, string> = {
  "Languages": "rgba(59,130,246,0.6)",
  "AI / ML": "rgba(168,85,247,0.6)",
  "Frontend": "rgba(6,182,212,0.6)",
  "Backend": "rgba(34,197,94,0.6)",
  "Infrastructure": "rgba(249,115,22,0.6)",
  "Tools": "rgba(236,72,153,0.6)"
};

const categoryBorderColors: Record<string, string> = {
  "Languages": "rgba(59,130,246,0.3)",
  "AI / ML": "rgba(168,85,247,0.3)",
  "Frontend": "rgba(6,182,212,0.3)",
  "Backend": "rgba(34,197,94,0.3)",
  "Infrastructure": "rgba(249,115,22,0.3)",
  "Tools": "rgba(236,72,153,0.3)"
};

const catGradients: Record<string, string> = {
  "Languages": "from-blue-500/20 to-blue-600/5",
  "AI / ML": "from-purple-500/20 to-purple-600/5",
  "Frontend": "from-cyan-500/20 to-cyan-600/5",
  "Backend": "from-green-500/20 to-green-600/5",
  "Infrastructure": "from-orange-500/20 to-orange-600/5",
  "Tools": "from-pink-500/20 to-pink-600/5"
};

function CategoryBarChart({ selectedAccount }: { selectedAccount: string }) {
  const cats = useMemo(() => {
    const map = new Map<string, { count: number; projects: string[] }>();
    for (const p of projectSkillData) {
      if (selectedAccount !== "all" && p.account !== selectedAccount) continue;
      const seen = new Set<string>();
      for (const s of p.skills) {
        if (seen.has(s.category)) continue;
        seen.add(s.category);
        if (!map.has(s.category)) map.set(s.category, { count: 0, projects: [] });
        map.get(s.category)!.count++;
        map.get(s.category)!.projects.push(p.project);
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [selectedAccount]);

  const maxCount = cats[0]?.[1].count || 1;

  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-3">Projects per Category</div>
      <div className="space-y-2">
        {cats.map(([cat, data], idx) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: categoryColors[cat] ?? "rgba(255,255,255,0.3)" }} />
              <span className="flex-1 text-[11px] text-ink/80">{cat}</span>
              <span className="font-mono text-[10px] text-muted">{data.count}</span>
            </div>
            <div className="h-2 rounded-full bg-white/6 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${categoryColors[cat] ?? "rgba(255,255,255,0.3)"}, ${(categoryColors[cat] ?? "rgba(255,255,255,0.3)").replace("0.6", "0.3")})` }}
                initial={{ width: 0 }}
                animate={{ width: `${(data.count / maxCount) * 100}%` }}
                transition={{ delay: 0.15 + idx * 0.06, duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AccountComparison() {
  const fmProjects = projectSkillData.filter(p => p.account === "FiscalMindset");
  const alProjects = projectSkillData.filter(p => p.account === "algsoch");

  const fmSkills = new Set(fmProjects.flatMap(p => p.skills.map(s => s.name)));
  const alSkills = new Set(alProjects.flatMap(p => p.skills.map(s => s.name)));
  const shared = [...fmSkills].filter(s => alSkills.has(s));
  const fmOnly = [...fmSkills].filter(s => !alSkills.has(s));
  const alOnly = [...alSkills].filter(s => !fmSkills.has(s));

  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-black/15 p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-3">Account Overlap</div>
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
          <div className="font-mono text-sm font-bold text-blue-400">{fmProjects.length}</div>
          <div className="text-[8px] text-muted uppercase tracking-wider">FiscalMindset</div>
        </div>
        <div className="rounded-lg border border-accent/20 bg-accent/10 p-2">
          <div className="font-mono text-sm font-bold text-accent">{shared.length}</div>
          <div className="text-[8px] text-muted uppercase tracking-wider">Shared Skills</div>
        </div>
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-2">
          <div className="font-mono text-sm font-bold text-purple-400">{alProjects.length}</div>
          <div className="text-[8px] text-muted uppercase tracking-wider">algsoch</div>
        </div>
      </div>
      <div className="flex gap-2 text-[9px]">
        <div className="flex-1">
          <div className="text-blue-400/80 font-mono mb-1">Unique to @FM</div>
          <div className="flex flex-wrap gap-1">
            {fmOnly.slice(0, 5).map(s => (
              <span key={s} className="rounded-full border border-blue-500/20 bg-blue-500/8 px-1.5 py-0.5 text-[8px] text-blue-300/80">{s}</span>
            ))}
            {fmOnly.length > 5 && <span className="text-muted/50 text-[8px]">+{fmOnly.length - 5}</span>}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-purple-400/80 font-mono mb-1">Unique to @al</div>
          <div className="flex flex-wrap gap-1">
            {alOnly.slice(0, 5).map(s => (
              <span key={s} className="rounded-full border border-purple-500/20 bg-purple-500/8 px-1.5 py-0.5 text-[8px] text-purple-300/80">{s}</span>
            ))}
            {alOnly.length > 5 && <span className="text-muted/50 text-[8px]">+{alOnly.length - 5}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SkillCoOccurrence({ selectedSkill }: { selectedSkill: string | null }) {
  const pairs = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projectSkillData) {
      const names = p.skills.map(s => s.name);
      for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
          const key = [names[i], names[j]].sort().join("::");
          map.set(key, (map.get(key) || 0) + 1);
        }
      }
    }
    return Array.from(map.entries())
      .map(([k, v]) => ({ a: k.split("::")[0], b: k.split("::")[1], count: v }))
      .filter(p => p.count > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, []);

  const filtered = selectedSkill
    ? pairs.filter(p => p.a === selectedSkill || p.b === selectedSkill)
    : pairs;

  if (filtered.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-3">
        {selectedSkill ? `Co-occurrence: ${selectedSkill}` : "Top Skill Pairs"}
      </div>
      <div className="space-y-1.5">
        {filtered.slice(0, 6).map((pair, idx) => {
          const maxC = filtered[0]?.count || 1;
          return (
            <motion.div
              key={`${pair.a}-${pair.b}`}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex-1 flex items-center gap-1.5 min-w-0">
                <span className="text-[10px] text-ink/80 truncate">{pair.a}</span>
                <span className="text-[8px] text-muted/40 shrink-0">↔</span>
                <span className="text-[10px] text-ink/80 truncate">{pair.b}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-12 h-1.5 rounded-full bg-white/6 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-accent/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${(pair.count / maxC) * 100}%` }}
                    transition={{ delay: 0.15 + idx * 0.05, duration: 0.4 }}
                  />
                </div>
                <span className="font-mono text-[9px] text-muted w-3 text-right">{pair.count}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SkillsVsProjects() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<"all" | "FiscalMindset" | "algsoch">("all");

  const allSkills = useMemo(() => {
    const map = new Map<string, { projectCount: number; projects: string[]; category: string }>();
    for (const p of projectSkillData) {
      if (selectedAccount !== "all" && p.account !== selectedAccount) continue;
      for (const s of p.skills) {
        if (!map.has(s.name)) {
          map.set(s.name, { projectCount: 0, projects: [], category: s.category });
        }
        const entry = map.get(s.name)!;
        entry.projectCount++;
        entry.projects.push(p.project);
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1].projectCount - a[1].projectCount);
  }, [selectedAccount]);

  const filteredProjects = useMemo(() => {
    let projects = projectSkillData;
    if (selectedAccount !== "all") {
      projects = projects.filter(p => p.account === selectedAccount);
    }
    if (selectedSkill) {
      projects = projects.filter(p => p.skills.some(s => s.name === selectedSkill));
    }
    return projects;
  }, [selectedSkill, selectedAccount]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "FiscalMindset", "algsoch"] as const).map(acc => (
            <motion.button
              key={acc}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedAccount(acc); setSelectedSkill(null); }}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition ${
                selectedAccount === acc
                  ? "border-accent/40 bg-accent/12 text-accent shadow-[0_0_12px_rgba(124,199,222,0.1)]"
                  : "border-line/50 text-muted hover:border-accent/20 hover:text-ink/80"
              }`}
            >
              {acc === "all" ? "All Accounts" : `@${acc}`}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-accent/50" />
          <span>{filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} · {allSkills.length} skills</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/15 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-3">Project Distribution</div>
            <div className="space-y-2">
              {(() => {
                const catCounts = new Map<string, number>();
                for (const p of filteredProjects) {
                  const seen = new Set<string>();
                  for (const s of p.skills) {
                    if (seen.has(s.category)) continue;
                    seen.add(s.category);
                    catCounts.set(s.category, (catCounts.get(s.category) ?? 0) + 1);
                  }
                }
                const sorted = [...catCounts.entries()].sort((a, b) => b[1] - a[1]);
                const maxCount = sorted[0]?.[1] ?? 1;
                return sorted.map(([cat, count], idx) => (
                  <motion.div key={cat} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: categoryColors[cat] ?? "rgba(255,255,255,0.3)" }} />
                      <span className="flex-1 text-[10px] text-ink/70">{cat}</span>
                      <span className="font-mono text-[9px] text-muted">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${categoryColors[cat] ?? "rgba(255,255,255,0.3)"}, ${(categoryColors[cat] ?? "rgba(255,255,255,0.3)").replace("0.6", "0.2")})` }} initial={{ width: 0 }} animate={{ width: `${(count / maxCount) * 100}%` }} transition={{ delay: 0.1 + idx * 0.05, duration: 0.5 }} />
                    </div>
                  </motion.div>
                ));
              })()}
            </div>
          </div>

          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70">
            {selectedSkill ? `Projects using "${selectedSkill}"` : "All Projects"}
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {filteredProjects.map((p, pi) => {
              const isFM = p.account === "FiscalMindset";
              const accountColor = isFM ? "rgba(59,130,246,0.6)" : "rgba(168,85,247,0.6)";
              const accountBorder = isFM ? "rgba(59,130,246,0.25)" : "rgba(168,85,247,0.25)";
              const accountText = isFM ? "text-blue-400/80" : "text-purple-400/80";
              const accountBg = isFM ? "bg-blue-500/10" : "bg-purple-500/10";
              const accountTagBg = isFM ? "bg-blue-500/15" : "bg-purple-500/15";
              const accountTagBorder = isFM ? "border-blue-500/25" : "border-purple-500/25";
              return (
                <motion.a
                  key={p.project}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pi * 0.04, duration: 0.3 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="group relative overflow-hidden rounded-xl border p-0 transition hover:border-accent/30 bg-black/10"
                  style={{ borderColor: accountBorder }}
                >
                  <div className="absolute inset-0 rounded-xl" style={{ background: `linear-gradient(135deg, ${isFM ? "rgba(59,130,246,0.06)" : "rgba(168,85,247,0.06)"}, transparent 60%)` }} />
                  <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl" style={{ background: `linear-gradient(180deg, ${isFM ? "rgba(59,130,246,0.4)" : "rgba(168,85,247,0.4)"}, transparent)` }} />
                  <div className="p-3.5 pl-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-ink group-hover:text-accent transition-colors">{p.project}</span>
                      <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${accountTagBorder} ${accountTagBg} ${accountText}`}>
                        @{p.account}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted/70 leading-relaxed mb-2 line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.skills.map(s => {
                        const catColor = categoryColors[s.category] ?? "rgba(255,255,255,0.3)";
                        const isSel = selectedSkill === s.name;
                        return (
                          <button
                            key={s.name}
                            onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedSkill(isSel ? null : s.name); }}
                            className="rounded-full border px-2 py-0.5 text-[9px] font-mono transition"
                            style={{
                              borderColor: isSel ? "rgba(255,107,107,0.5)" : catColor.replace("0.6", "0.25"),
                              background: isSel ? "rgba(255,107,107,0.15)" : `${catColor.replace("0.6", "0.08")}`,
                              color: isSel ? "#ff6b6b" : catColor.replace("0.6", "0.85"),
                            }}
                          >
                            {s.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.a>
              );
            })}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-2 rounded-xl border border-dashed border-line/30 p-8 text-center text-sm text-muted"
              >
                No projects match this filter.
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {selectedAccount === "all" && <AccountComparison />}

          <CategoryBarChart selectedAccount={selectedAccount} />
          <SkillCoOccurrence selectedSkill={selectedSkill} />

          <div className="rounded-xl border border-white/10 bg-black/15 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 mb-3">Skill Usage</div>
            <div className="space-y-1.5">
              {allSkills.slice(0, 15).map(([name, data], idx) => {
                const maxCount = allSkills[0]?.[1].projectCount || 1;
                const isSelected = selectedSkill === name;
                const catColor = categoryColors[data.category] ?? "rgba(255,255,255,0.3)";
                return (
                  <motion.button
                    key={name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.025, duration: 0.25 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSkill(isSelected ? null : name)}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-left transition ${
                      isSelected ? "bg-accent/10" : "hover:bg-white/4"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: catColor }} />
                      <span className="flex-1 text-[10px] text-ink/80 truncate">{name}</span>
                      <span className="font-mono text-[9px] text-muted shrink-0">{data.projectCount}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: isSelected ? `linear-gradient(90deg, rgba(255,107,107,0.6), rgba(255,107,107,0.3))` : `linear-gradient(90deg, ${catColor}, ${catColor.replace("0.6", "0.2")})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.projectCount / maxCount) * 100}%` }}
                        transition={{ duration: 0.4, delay: 0.1 + idx * 0.025 }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showMapping, setShowMapping] = useState(false);

  const activeCategory = useMemo(
    () => skillCategories.find(c => c.title === selectedCategory) ?? null,
    [selectedCategory]
  );

  const totals = useMemo(() => {
    const all = skillCategories.flatMap(c => c.skills);
    const avg = Math.round(all.reduce((s, sk) => s + sk.level, 0) / all.length);
    return { total: all.length, avg, categories: skillCategories.length };
  }, []);

  return (
    <section id="skills" className="section-space">
      <div className="section-frame">
        <div className="relative rounded-xl border border-orange-500/50 bg-black/10 p-5 sm:rounded-2xl sm:border-2 sm:p-6 lg:rounded-3xl lg:p-10 overflow-hidden">
        <TransformerBackground />
        <SectionHeading
          eyebrow="Skills"
          title="Technical toolkit."
          description={showMapping ? "Skill-to-project mapping based on real repositories." : "Click a category to explore proficiency breakdown and stats."}
        />

        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={() => setShowMapping(false)}
            className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition ${
              !showMapping
                ? "border-accent/40 bg-accent/12 text-accent"
                : "border-line/50 text-muted hover:border-accent/20 hover:text-ink/80"
            }`}
          >
            Proficiency
          </button>
          <button
            onClick={() => setShowMapping(true)}
            className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition ${
              showMapping
                ? "border-accent/40 bg-accent/12 text-accent"
                : "border-line/50 text-muted hover:border-accent/20 hover:text-ink/80"
            }`}
          >
            Project Mapping
          </button>
        </div>

        {!showMapping && (
        <>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
              }}
            >
              {skillCategories.map((category, idx) => {
                const catAvg = Math.round(category.skills.reduce((s, sk) => s + sk.level, 0) / category.skills.length);
                const isActive = category.title === selectedCategory;
                return (
                  <motion.div
                    key={category.title}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                    }}
                    className={`relative overflow-hidden rounded-2xl border transition-all duration-300 bg-gradient-to-br ${category.color} p-5 ${
                      isActive
                        ? "border-accent/40 shadow-[0_0_30px_rgba(124,199,222,0.08)]"
                        : "border-line/75 hover:border-accent/30 cursor-pointer"
                    }`}
                    onClick={() => !isActive && setSelectedCategory(category.title)}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-black/10 to-transparent rounded-full blur-xl" />

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                          <span className="text-xl">{category.icon}</span>
                        </div>
                        <div>
                          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent/90 font-semibold">
                            {category.title}
                          </div>
                          <div className="text-[10px] text-muted mt-0.5">
                            {category.label}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5">
                        <span className="font-mono text-[10px] font-bold text-accent">{catAvg}%</span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {category.skills.slice(0, 4).map((skill, skillIdx) => (
                        <SkillBar key={skill.name} name={skill.name} level={skill.level} index={skillIdx} />
                      ))}
                      {category.skills.length > 4 && (
                        <div className="text-[10px] text-muted/60 text-center pt-0.5">
                          +{category.skills.length - 4} more
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-2 right-2 font-mono text-[8px] text-accent/30 uppercase tracking-widest">
                      0{idx + 1}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <AnimatePresence mode="wait">
              {activeCategory && (
                <motion.div
                  key={activeCategory.title}
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <DetailPanel category={activeCategory} onClose={() => setSelectedCategory(null)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:w-80 xl:w-[360px] shrink-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent/70 text-center mb-3">Category Radar</div>
            <div className="lg:sticky lg:top-24">
              <RadarChart selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            </div>
          </div>
        </div>

        <motion.div
          className="mt-6 flex items-center justify-center gap-6 text-xs"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-line/50" />
            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-ink">{totals.total}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Technologies</div>
              </div>
              <div className="w-px h-8 bg-line/30" />
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-ink">{totals.categories}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Domains</div>
              </div>
              <div className="w-px h-8 bg-line/30" />
              <div className="text-center">
                <div className="font-mono text-lg font-bold text-ink">{totals.avg}%</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Avg. Proficiency</div>
              </div>
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-line/50" />
          </div>
        </motion.div>
        </>
        )}

        {showMapping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SkillsVsProjects />
          </motion.div>
        )}

      <FiscalMindsetBadge />
      </div>
    </div>
    </section>
  );
}
