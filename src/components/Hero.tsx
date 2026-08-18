import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pb-16 pt-24 md:pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex max-w-3xl flex-col items-start gap-6"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Computer Engineering
          </span>

          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Alejandro{" "}
            <span className="text-accent">Blanco</span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-text-secondary">
            Student at <span className="font-medium text-text-primary">UNIE Universidad</span>.
            Focused on <span className="font-medium text-accent">cybersecurity</span> and
            software development.
          </p>

          <div className="flex gap-4 pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs font-medium text-surface transition-all hover:brightness-110 active:translate-y-px"
            >
              View Projects
              <ArrowRight className="h-4 w-4" weight="bold" />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/[0.03] blur-3xl" />
    </section>
  );
}
