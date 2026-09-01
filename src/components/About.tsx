import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";

export function About() {
  const reduce = useReducedMotion();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP((gsap) => {
    if (reduce) return;

    gsap.fromTo(
      ".about-reveal",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: scope.current, start: "top 75%" },
      },
    );

    return () => {
      gsap.killTweensOf(".about-reveal");
    };
  }, [reduce]);

  return (
    <section ref={scope} id="about" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <div>
            <div className="space-y-6">
              <h2 className="about-reveal text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                Final-year Computer Engineering student, focused on
                <span className="text-accent"> security</span> &amp; software.
              </h2>
              <p className="about-reveal max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
                I'm a <span className="font-medium text-text-primary">final-year student at UNIE University</span>{" "}
                in Madrid with hands-on experience in{" "}
                <span className="font-medium text-text-primary">Java, Python, and C</span>, plus a background
                in systems administration. I work daily on practical, real-world problems, and publish
                most of what I build on GitHub.
              </p>
              <p className="about-reveal max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
                My focus is <span className="font-medium text-text-primary">cybersecurity</span> and software
                development. Recent projects include{" "}
                <span className="font-medium text-text-primary">Python-based tools</span> and a{" "}
                <span className="font-medium text-text-primary">phishing detection system using machine learning</span>,
                sharpening my problem-solving skills along the way.
              </p>
            </div>
          </div>

          <div className="lg:pt-24">
            <div className="about-reveal mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                Education
              </h2>
            </div>

            <div className="space-y-12">
              <div className="relative pl-6 border-l border-accent/30">
                <div className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-accent ring-4 ring-accent-muted" />
                <h3 className="font-bold text-text-primary">UNIE Universidad</h3>
                <p className="mt-0.5 font-mono text-xs text-accent">2023 - 2027</p>
                <p className="mt-2 text-sm text-text-secondary">
                  Bachelor's Degree in Computer Engineering
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-text-muted">
                  <li>· Cybersecurity &amp; Blockchain specialization</li>
                  <li>· Cloud Computing (AWS / Azure)</li>
                  <li>· AI &amp; Data Analysis</li>
                </ul>
              </div>

              <div className="relative pl-6 border-l border-surface-border">
                <div className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-text-muted" />
                <h3 className="font-bold text-text-primary">Colegio Nuestra Señora de la Merced</h3>
                <p className="mt-0.5 font-mono text-xs text-text-muted">2021 - 2023</p>
                <p className="mt-2 text-sm text-text-secondary">Technological Baccalaureate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
