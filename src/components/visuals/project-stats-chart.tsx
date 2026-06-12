import { useMemo, useState, useCallback } from "react";
import { projectSkillData } from "../sections/skills-section";
import { cn } from "../../lib/utils";

type Metric = "skills" | "categories";

const metricLabels: Record<Metric, string> = {
  skills: "Skills per Project",
  categories: "Categories per Project",
};

const catStyles: Record<string, { bg: string; text: string; bar: string; border: string }> = {
  "Languages":       { bg: "rgba(59,130,246,0.12)", text: "rgb(147,197,253)", bar: "rgba(59,130,246,0.55)", border: "rgba(59,130,246,0.25)" },
  "AI / ML":         { bg: "rgba(168,85,247,0.12)", text: "rgb(216,180,254)", bar: "rgba(168,85,247,0.55)", border: "rgba(168,85,247,0.25)" },
  "Frontend":        { bg: "rgba(6,182,212,0.12)",  text: "rgb(103,232,249)", bar: "rgba(6,182,212,0.55)",  border: "rgba(6,182,212,0.25)" },
  "Backend":         { bg: "rgba(34,197,94,0.12)",  text: "rgb(134,239,172)", bar: "rgba(34,197,94,0.55)",  border: "rgba(34,197,94,0.25)" },
  "Infrastructure":  { bg: "rgba(249,115,22,0.12)", text: "rgb(253,186,116)", bar: "rgba(249,115,22,0.55)", border: "rgba(249,115,22,0.25)" },
  "Tools":           { bg: "rgba(236,72,153,0.12)", text: "rgb(249,168,212)", bar: "rgba(236,72,153,0.55)", border: "rgba(236,72,153,0.25)" },
};

const projectPalette = [
  { bar: "rgba(59,130,246,0.65)", text: "rgb(96,165,250)", bg: "rgba(59,130,246,0.1)" },
  { bar: "rgba(168,85,247,0.65)", text: "rgb(192,132,252)", bg: "rgba(168,85,247,0.1)" },
  { bar: "rgba(6,182,212,0.65)", text: "rgb(103,232,249)", bg: "rgba(6,182,212,0.1)" },
  { bar: "rgba(34,197,94,0.65)", text: "rgb(134,239,172)", bg: "rgba(34,197,94,0.1)" },
  { bar: "rgba(249,115,22,0.65)", text: "rgb(253,186,116)", bg: "rgba(249,115,22,0.1)" },
  { bar: "rgba(236,72,153,0.65)", text: "rgb(249,168,212)", bg: "rgba(236,72,153,0.1)" },
  { bar: "rgba(234,179,8,0.65)", text: "rgb(250,204,21)", bg: "rgba(234,179,8,0.1)" },
  { bar: "rgba(99,102,241,0.65)", text: "rgb(165,180,252)", bg: "rgba(99,102,241,0.1)" },
  { bar: "rgba(20,184,166,0.65)", text: "rgb(94,234,212)", bg: "rgba(20,184,166,0.1)" },
  { bar: "rgba(239,68,68,0.65)", text: "rgb(252,165,165)", bg: "rgba(239,68,68,0.1)" },
  { bar: "rgba(245,158,11,0.65)", text: "rgb(251,191,36)", bg: "rgba(245,158,11,0.1)" },
  { bar: "rgba(244,114,182,0.65)", text: "rgb(249,168,212)", bg: "rgba(244,114,182,0.1)" },
];

function getProjectColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i);
  return projectPalette[Math.abs(hash) % projectPalette.length];
}

const catOrder = ["Languages", "AI / ML", "Frontend", "Backend", "Infrastructure", "Tools"];

function getProjectDetail(id: string) {
  const p = projectSkillData.find((x) => x.project === id);
  if (!p) return null;
  const byCat: Record<string, string[]> = {};
  for (const s of p.skills) {
    if (!byCat[s.category]) byCat[s.category] = [];
    byCat[s.category].push(s.name);
  }
  return { ...p, byCat };
}

function BarChart({
  data, metric, activeId, onSelect,
}: {
  data: { id: string; title: string; account: string; value: number }[];
  metric: Metric;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent/70 mb-1.5">{metricLabels[metric]}</div>
      <div className="max-h-[260px] overflow-y-auto space-y-[3px] pr-1 scrollbar-thin">
        {data.map((d) => {
          const pct = (d.value / maxVal) * 100;
          const active = d.id === activeId;
          const ac = getProjectColor(d.id);
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              className={cn(
                "w-full text-left rounded px-1.5 py-[3px] transition-all",
                active ? "bg-white/6" : "hover:bg-white/4"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-[5.5rem] truncate text-[9px] shrink-0 transition-colors",
                    active ? "font-semibold" : "text-muted group-hover:text-ink/80"
                  )}
                  style={active ? { color: ac.text } : undefined}
                >
                  {d.title}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: active ? ac.bar : ac.bar.replace("0.65", "0.25") }}
                  />
                </div>
                <span className="w-5 text-right font-mono text-[9px] text-muted shrink-0">{d.value}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SkillDetail({ projectId }: { projectId: string }) {
  const detail = useMemo(() => getProjectDetail(projectId), [projectId]);
  if (!detail) return null;

  const ac = getProjectColor(projectId);
  const totalSkills = detail.skills.length;
  const totalCats = Object.keys(detail.byCat).length;
  const sortedCats = catOrder.filter((c) => detail.byCat[c]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/4 p-3 space-y-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: ac.bar }} />
          <span className="text-[11px] font-semibold text-ink truncate">{detail.project}</span>
          <span className="shrink-0 rounded border px-1.5 py-[1px] font-mono text-[7px] uppercase tracking-wider" style={{ borderColor: ac.bar, color: ac.text, backgroundColor: ac.bg }}>
            @{detail.account}
          </span>
        </div>
      </div>

      {/* description */}
      {detail.description && (
        <div className="text-[10px] leading-relaxed text-muted/90 border-l-2 pl-2.5" style={{ borderColor: ac.bar }}>
          {detail.description}
        </div>
      )}

      {/* skills as pills grouped by category */}
      <div className="space-y-1.5">
        <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/70">
          Stack · {totalSkills} skills across {totalCats} categories
        </div>
        <div className="space-y-1">
          {sortedCats.map((cat) => {
            const cs = catStyles[cat];
            const skills = detail.byCat[cat];
            if (!skills || !cs) return null;
            return (
              <div key={cat} className="flex items-start gap-1.5">
                <span className="mt-[3px] h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: cs.bar }} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1">
                    {skills.map((sk) => (
                      <span
                        key={sk}
                        className="rounded-full border px-2 py-[1px] font-mono text-[8px] leading-normal"
                        style={{ borderColor: cs.border, backgroundColor: cs.bg, color: cs.text }}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* category distribution stacked mini-bar */}
      <div>
        <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/70 mb-1">Composition</div>
        <div className="flex h-3 rounded-full overflow-hidden">
          {sortedCats.map((cat) => {
            const cs = catStyles[cat];
            const share = (detail.byCat[cat].length / totalSkills) * 100;
            return (
              <div
                key={cat}
                style={{ width: `${share}%`, backgroundColor: cs.bar }}
                title={`${cat}: ${detail.byCat[cat].length} skills`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          {sortedCats.map((cat) => {
            const cs = catStyles[cat];
            const count = detail.byCat[cat].length;
            return (
              <div key={cat} className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cs.bar }} />
                <span className="font-mono text-[7px] text-muted">{cat.split(" ")[0]} {count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type AccountAgg = {
  account: string;
  projectCount: number;
  skillCount: number;
  catCount: number;
  byCat: Record<string, number>;
};

function AccountBars({ activeAccount }: { activeAccount: string }) {
  const agg = useMemo(() => {
    const map = new Map<string, AccountAgg>();
    for (const p of projectSkillData) {
      if (!map.has(p.account)) {
        map.set(p.account, { account: p.account, projectCount: 0, skillCount: 0, catCount: 0, byCat: {} });
      }
      const entry = map.get(p.account)!;
      entry.projectCount++;
      entry.skillCount += p.skills.length;
      const seen = new Set<string>();
      for (const s of p.skills) {
        if (!seen.has(s.category)) { seen.add(s.category); entry.catCount++; }
        entry.byCat[s.category] = (entry.byCat[s.category] ?? 0) + 1;
      }
    }
    return Array.from(map.values());
  }, []);

  const maxPerCat = Math.max(...agg.flatMap((a) => Object.values(a.byCat)), 1);

  return (
    <div className="space-y-2">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent/70">Account comparison</div>
      <div className="grid grid-cols-2 gap-2">
        {agg.map((a) => {
          const ac = getProjectColor(a.account);
          const isActive = a.account === activeAccount;
          return (
            <div
              key={a.account}
              className="rounded-xl border p-2.5 transition-all"
              style={{
                borderColor: isActive ? ac.bar : "rgba(255,255,255,0.08)",
                backgroundColor: isActive ? ac.bg : "rgba(255,255,255,0.03)",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ac.bar }} />
                <span className="font-mono text-[9px] font-semibold" style={{ color: ac.text }}>@{a.account}</span>
              </div>
              <div className="text-[9px] text-muted mb-2">
                {a.projectCount} projects · {a.skillCount} total skills
              </div>
              {catOrder.map((cat) => {
                const cs = catStyles[cat];
                const val = a.byCat[cat] ?? 0;
                const pct = (val / maxPerCat) * 100;
                if (val === 0) return null;
                return (
                  <div key={cat} className="flex items-center gap-1.5 mb-[2px]">
                    <span className="w-12 truncate text-[7px] font-mono text-muted">{cat.split(" ")[0]}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/6 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cs.bar }} />
                    </div>
                    <span className="w-3 text-right font-mono text-[7px] text-muted">{val}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const metricKeys: Metric[] = ["skills", "categories"];

type FilterMode = "all" | "FiscalMindset" | "algsoch";

export function ProjectStatsChart() {
  const [activeId, setActiveId] = useState(projectSkillData[0]?.project ?? "");
  const [metric, setMetric] = useState<Metric>("skills");
  const [filterAccount, setFilterAccount] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let list = projectSkillData;
    if (filterAccount !== "all") {
      list = list.filter((p) => p.account === filterAccount);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.project.toLowerCase().includes(q));
    }
    const mapped = list.map((p) => ({
      id: p.project,
      title: p.project,
      account: p.account,
      value: metric === "skills" ? p.skills.length : new Set(p.skills.map((s) => s.category)).size,
    }));
    return sortAsc ? mapped.sort((a, b) => a.value - b.value) : mapped.sort((a, b) => b.value - a.value);
  }, [metric, filterAccount, search, sortAsc]);

  const activeProject = useMemo(
    () => projectSkillData.find((p) => p.project === activeId) ?? projectSkillData[0],
    [activeId]
  );

  const onSelect = useCallback((id: string) => { setActiveId(id); }, []);

  return (
    <div className="min-w-0 rounded-[22px] border border-line/70 bg-black/15 p-4 pb-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent/75">
          Project stats
          <span className="ml-2 text-[8px] text-muted/60 tracking-normal normal-case">
            {filtered.length}/{projectSkillData.length}
          </span>
        </div>
        <button
          onClick={() => setSortAsc((v) => !v)}
          className="rounded border border-line/50 px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-wider text-muted hover:border-accent/20 transition"
          title={sortAsc ? "Sorted ascending" : "Sorted descending"}
        >
          {sortAsc ? "↑ asc" : "↓ desc"}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 rounded-lg border border-line/50 bg-white/4 px-2 py-1 font-mono text-[9px] text-ink placeholder-muted/50 outline-none focus:border-accent/40 transition"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "FiscalMindset", "algsoch"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilterAccount(f)}
            className={`rounded-full border px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] transition ${
              filterAccount === f ? "border-accent/40 bg-accent/12 text-accent" : "border-line/50 text-muted hover:border-accent/20"
            }`}
          >
            {f === "all" ? "All" : `@${f}`}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {metricKeys.map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] transition ${
              metric === m ? "border-accent/40 bg-accent/12 text-accent" : "border-line/50 text-muted hover:border-accent/20"
            }`}
          >
            {metricLabels[m].split(" ")[0]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-[10px] text-muted/60 font-mono text-center py-6">No projects match your search</div>
      ) : (
        <BarChart data={filtered} metric={metric} activeId={activeId} onSelect={onSelect} />
      )}

      {activeProject && <SkillDetail projectId={activeProject.project} />}

      <AccountBars activeAccount={activeProject?.account ?? "FiscalMindset"} />
    </div>
  );
}
