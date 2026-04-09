import { philosophyStatements } from "../../content/portfolio";
import { SectionHeading } from "../ui/section-heading";

export function PhilosophySection() {
  return (
    <section id="philosophy" className="section-space">
      <div className="section-frame">
        <SectionHeading
          eyebrow="Build Philosophy"
          title="The system should work as one product."
          description="The philosophy here is grounded in engineering choices, not motivational slogans. AI is useful when interface quality, workflow design, model behavior, and delivery logic all reinforce each other."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {philosophyStatements.map((statement, index) => (
            <div key={statement.title} className="rounded-[28px] border border-line/75 bg-canvas-elevated/70 p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent/70">Principle 0{index + 1}</div>
              <div className="mt-3 text-2xl font-semibold text-ink">{statement.title}</div>
              <p className="mt-4 text-sm text-muted">{statement.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
