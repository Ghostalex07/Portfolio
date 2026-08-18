import { Code } from "@phosphor-icons/react";

const SKILLS = [
  { name: "Java", category: "Backend" },
  { name: "Python", category: "Scripting" },
  { name: "C", category: "Low Level" },
  { name: "MIPS Assembly", category: "Low Level" },
  { name: "HTML/CSS", category: "Frontend" },
  { name: "Docker", category: "DevOps" },
  { name: "Git", category: "Tools" },
  { name: "Transformers", category: "AI" },
  { name: "Jupyter Notebook", category: "Data" },
  { name: "R", category: "Data" },
  { name: "Cobol", category: "Legacy" },
  { name: "Flet", category: "UI" },
];

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 border-t border-surface-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center gap-3">
          <Code className="h-5 w-5 text-accent" weight="regular" />
          <h2 className="text-lg font-bold">Technical Skills</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {SKILLS.map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col items-center justify-center rounded-lg border border-surface-border bg-surface-raised p-4 text-center transition-colors hover:border-accent/40"
            >
              <span className="text-sm font-medium text-text-primary">{skill.name}</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary/50">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
