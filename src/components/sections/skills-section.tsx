import { SectionHeading } from "../ui/section-heading";

const skillCategories = [
  {
    title: "Languages",
    icon: "⌨️",
    color: "from-blue-500/20 to-blue-600/10",
    skills: ["Python", "Kotlin", "JavaScript", "TypeScript", "SQL", "HTML/CSS"]
  },
  {
    title: "AI / ML",
    icon: "🤖",
    color: "from-purple-500/20 to-purple-600/10",
    skills: ["LangGraph", "LangChain", "PyTorch", "RunAnywhere SDK", "On-Device AI", "SmolLM2", "SmolVLM", "Whisper", "Circuit Discovery"]
  },
  {
    title: "Frontend",
    icon: "🎨",
    color: "from-cyan-500/20 to-cyan-600/10",
    skills: ["React", "Next.js", "Tailwind CSS", "Vite", "Jetpack Compose", "Framer Motion"]
  },
  {
    title: "Backend",
    icon: "⚙️",
    color: "from-green-500/20 to-green-600/10",
    skills: ["FastAPI", "Node.js", "PostgreSQL", "SQLite", "REST APIs", "WebSockets"]
  },
  {
    title: "Infrastructure",
    icon: "🏗️",
    color: "from-orange-500/20 to-orange-600/10",
    skills: ["Docker", "Kestra", "Render", "Vercel", "ngrok", "GitHub Actions"]
  },
  {
    title: "Tools",
    icon: "🔧",
    color: "from-pink-500/20 to-pink-600/10",
    skills: ["Coral MCP", "OpenCode", "Cursor", "VS Code", "Playwright", "FFmpeg"]
  }
];

export function SkillsSection() {
  return (
    <section id="skills" className="section-space">
      <div className="section-frame rounded-3xl border-2 border-orange-500/60 bg-black/10 p-6 sm:p-8 lg:p-10">
        <SectionHeading
          eyebrow="Skills"
          title="Technical toolkit."
          description="Technologies I work with across the full AI engineering stack."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, idx) => (
            <div 
              key={category.title} 
              className={`relative overflow-hidden rounded-2xl border border-line/75 bg-gradient-to-br ${category.color} p-5 transition hover:border-accent/40 hover:scale-[1.02]`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent/90 font-semibold">
                    {category.title}
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">
                    {category.skills.length} technologies
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-black/20 backdrop-blur-sm px-2.5 py-1 text-xs text-ink hover:border-accent/30 hover:bg-accent/10 transition cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="absolute bottom-2 right-2 font-mono text-[8px] text-accent/30 uppercase tracking-widest">
                0{idx + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-line/50" />
            <span className="text-muted">38+ technologies across 6 domains</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-line/50" />
          </div>
        </div>
      </div>
    </section>
  );
}