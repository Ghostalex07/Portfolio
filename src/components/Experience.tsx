import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";

const EXPERIENCE = [
  {
    role: "Software Development Intern",
    company: "DIGITAL55",
    period: "07/2026 - Present",
    current: true,
    points: [
      "Software development internship within the engineering team, applying engineering skills to real-world products.",
    ],
    stack: ["Development", "Software Engineering"],
  },
  {
    role: "IT Specialist",
    company: "RTTC",
    period: "01/2024 - 03/2025",
    points: [
      "Resolved complex technical issues and modernized legacy hardware & systems.",
      "Optimized infrastructure processes and provided specialized technical support.",
    ],
    stack: ["Hardware", "SysAdmin", "Support"],
  },
];

export function Experience() {
  const reduce = useReducedMotion();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP((gsap) => {
    if (reduce) return;
    gsap.fromTo(
      ".exp-item",
      { opacity: 0, x: -24 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: scope.current, start: "top 70%" },
      },
    );
  }, [reduce]);

  return (
    <section ref={scope} id="experience" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Experience
          </h2>
        </div>

        <div className="relative">
          <span className="absolute bottom-0 top-1.5 left-[7px] w-px bg-surface-border" />

          <div className="space-y-16">
            {EXPERIENCE.map((job, i) => (
              <article key={job.role} className="exp-item relative pl-10 md:pl-12">
                <span
                  className={`absolute left-[7px] top-[7px] h-[13px] w-[13px] -translate-x-1/2 rounded-full border-2 ${
                    job.current
                      ? "border-accent bg-accent"
                      : "border-surface-border bg-surface"
                  }`}
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-2xl font-bold tracking-tight text-text-primary">
                    {job.role}
                    {job.current && (
                      <span className="ml-3 inline-flex translate-y-[-2px] items-center gap-1.5 rounded-full bg-accent-muted px-2.5 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider text-accent">
                        Currently
                      </span>
                    )}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <p className="font-mono text-sm text-accent">{job.company}</p>
                    {job.period && <p className="font-mono text-xs text-text-muted">{job.period}</p>}
                  </div>
                </div>

                <ul className="mt-5 max-w-2xl space-y-3">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-text-secondary md:text-base">
                      <span className="mt-0.5 text-accent">→</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {job.stack.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-surface-border bg-surface-raised px-3 py-1 font-mono text-[11px] text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
