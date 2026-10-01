import { useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";

export function About() {
  const reduce = useReducedMotion();

  const scope = useGSAP<HTMLElement>((gsap) => {
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
  }, [reduce]);

  return (
    <section ref={scope} id="about" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto w-full max-w-[80rem] px-6 sm:px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <div>
            <div className="space-y-6">
              <h2 className="about-reveal text-balance text-h2-sm font-bold leading-tight tracking-tight">
                From keeping systems running, to{" "}
                <span className="text-accent">building them secure.</span>
              </h2>
              <p className="about-reveal max-w-[46ch] text-base leading-relaxed text-text-secondary md:text-lg lg:max-w-[58ch]">
                Before writing code, I supported it. As an <span className="font-medium text-text-primary">IT Specialist at RTTC</span>{" "}
                I modernized outdated machines and learned how infrastructure actually breaks. The
                practical side a classroom can't teach. That experience shaped how I approach
                software: understand how things fail before adding to them.
              </p>
              <p className="about-reveal max-w-[46ch] text-base leading-relaxed text-text-secondary md:text-lg lg:max-w-[58ch]">
                Today I'm finishing my <span className="font-medium text-text-primary">Computer Engineering degree at UNIE</span>{" "}
                while interning as a developer at DIGITAL55, shipping backend features with
                Python and Java. Security is the thread that ties it all together. Everything I
                build gets designed with an attacker in mind.
              </p>

              <ul className="about-reveal flex max-w-[46ch] flex-col gap-2.5 pt-1 text-sm text-text-secondary lg:max-w-[58ch]">
                <li className="flex gap-3">
                  <span className="text-accent">→</span>
                  <span><span className="font-medium text-text-primary">Build in public</span>, most projects land on GitHub</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">→</span>
                  <span><span className="font-medium text-text-primary">Break, then fix</span>, like my ML-based phishing detection system</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">→</span>
                  <span><span className="font-medium text-text-primary">Security first</span>, threat model before feature list</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:pt-24">
            <div className="about-reveal mb-8">
              <h2 className="text-h2-sm font-bold tracking-tight text-text-primary">
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
