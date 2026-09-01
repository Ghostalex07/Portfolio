import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";

interface Category {
  label: string;
  skills: string[];
}

const CATEGORIES: Category[] = [
  {
    label: "Languages",
    skills: ["Java", "Python", "C", "COBOL", "MIPS Assembly", "HTML/CSS"],
  },
  {
    label: "Cloud & DevOps",
    skills: ["AWS", "Azure", "Docker", "Git", "Linux"],
  },
  {
    label: "Security",
    skills: [
      "Cybersecurity",
      "Network Security",
      "Identity & Access",
      "Microsoft Sentinel",
      "Microsoft 365 Defender",
    ],
  },
  {
    label: "Data & AI",
    skills: ["Machine Learning", "Transformers", "Jupyter Notebook", "R"],
  },
];

export function Skills() {
  const reduce = useReducedMotion();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP((gsap) => {
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
    <section ref={scope} id="skills" className="relative scroll-mt-24 border-t border-surface-border py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Skills
          </h2>
        </div>

        <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="skill-cat">
              <h3 className="mb-5 text-lg font-bold text-text-primary">{cat.label}</h3>
              <div className="flex flex-wrap gap-2.5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-surface-border bg-surface-raised px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    {skill}
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