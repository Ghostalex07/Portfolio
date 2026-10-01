import { useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";

interface Skill {
  name: string;
  core?: boolean;
}

interface Category {
  label: string;
  skills: Skill[];
}

const CATEGORIES: Category[] = [
  {
    label: "Languages",
    skills: [
      { name: "Java", core: true },
      { name: "Python", core: true },
      { name: "C", core: true },
      { name: "COBOL" },
      { name: "MIPS Assembly" },
      { name: "HTML/CSS" },
    ],
  },
  {
    label: "Cloud & DevOps",
    skills: [
      { name: "Azure", core: true },
      { name: "AWS" },
      { name: "Docker", core: true },
      { name: "Git", core: true },
      { name: "Linux", core: true },
    ],
  },
  {
    label: "Security",
    skills: [
      { name: "Cybersecurity", core: true },
      { name: "Network Security" },
      { name: "Identity & Access" },
      { name: "Microsoft Sentinel" },
      { name: "Microsoft 365 Defender" },
    ],
  },
  {
    label: "Data & AI",
    skills: ["Machine Learning", "Transformers", "Jupyter Notebook", "R"].map((name) => ({ name })),
  },
];

export function Skills() {
  const reduce = useReducedMotion();

  const scope = useGSAP<HTMLElement>((gsap) => {
    if (reduce) return;
    gsap.fromTo(
      ".skill-cat",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: "top 70%" },
      },
    );
  }, [reduce]);

  return (
    <section ref={scope} id="skills" className="relative scroll-mt-24 border-t border-surface-border py-16 md:py-24">
      <div className="mx-auto w-full max-w-[80rem] px-6 sm:px-8 lg:px-12">
        <div className="mb-8">
          <h2 className="text-h2-sm font-bold tracking-tight text-text-primary">
            Skills
          </h2>
          <p className="mt-3 font-mono text-micro uppercase tracking-wider text-text-muted">
            <span className="text-accent">core</span> stack, others are working knowledge
          </p>
        </div>

        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="skill-cat">
              <h3 className="mb-5 text-h3 font-bold text-text-primary">{cat.label}</h3>
              <div className="flex flex-wrap gap-2.5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={
                      skill.core
                        ? "rounded-pill border border-accent/40 bg-accent-muted px-4 py-2 text-sm text-accent-soft transition-colors hover:border-accent hover:text-accent"
                        : "rounded-pill border border-surface-border bg-surface-raised px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                    }
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}