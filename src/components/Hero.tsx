import { motion, useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";
import { ArrowDown } from "@phosphor-icons/react";

const STACK = ["Python", "Java", "C", "Azure", "Linux", "Docker"];

export function Hero() {
  const reduce = useReducedMotion();

  useGSAP((gsap) => {
    if (reduce) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      ".hero-kicker",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2 },
    )
      .fromTo(
        ".hero-line",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.0, stagger: 0.12 },
        "-=0.2",
      )
      .fromTo(
        ".hero-desc",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4",
      )
      .fromTo(
        ".hero-cta",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        "-=0.4",
      )
      .fromTo(
        ".hero-card",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6",
      );
  }, [reduce]);

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden pb-16 pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(240,166,60,0.06),transparent)]" />

      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="hero-kicker mb-7 font-mono text-xs uppercase tracking-[0.28em] text-accent md:text-sm">
              {"//"} software &amp; dev
            </p>

            <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.02] tracking-tight">
              <span className="block overflow-hidden">
                <span className="hero-line block">Alejandro</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block text-accent">Blanco.</span>
              </span>
            </h1>

            <p className="hero-desc mt-7 max-w-md text-base leading-relaxed text-text-secondary md:text-lg text-balance">
              I break things so I can build them back secure. A Computer Engineering student in
              Madrid, working toward cybersecurity.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <motion.a
                href="#projects"
                className="hero-cta inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm font-medium text-surface transition-all hover:brightness-110 active:translate-y-px"
                whileTap={{ scale: 0.97 }}
              >
                See my work
                <ArrowDown className="h-4 w-4" weight="bold" />
              </motion.a>
              <motion.a
                href="#about"
                className="hero-cta inline-flex items-center gap-2 rounded-full border border-surface-border px-6 py-3 font-mono text-sm text-text-secondary transition-all hover:border-accent/40 hover:text-accent active:translate-y-px"
                whileTap={{ scale: 0.97 }}
              >
                More about me
              </motion.a>
            </div>
          </div>

          <div className="hero-card ring-chrome rounded-2xl border border-surface-border bg-surface-raised p-6 lg:justify-self-end lg:w-[19rem]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Software intern at DIGITAL55
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">now</span>
            </div>

            <div className="my-5 h-px w-full bg-surface-border" />

            <dl className="space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-text-muted">Studying</dt>
                <dd className="text-right font-medium text-text-primary">
                  B.Sc. Computer Engineering
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-text-muted">
                    UNIE - Madrid, 2023-2027
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-text-muted">Focus</dt>
                <dd className="font-medium text-text-primary">Cybersecurity</dd>
              </div>
            </dl>

            <div className="my-5 h-px w-full bg-surface-border" />

            <div className="flex flex-wrap gap-2">
              {STACK.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-surface-border px-3 py-1 font-mono text-[11px] text-text-secondary"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}