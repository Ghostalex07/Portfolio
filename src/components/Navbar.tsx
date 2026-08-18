import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { List, X, GithubLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certs" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/50 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-mono text-lg font-bold tracking-tight text-accent">
          AB<span className="animate-pulse">_</span>
        </a>

        <nav className="hidden items-center gap-8 text-xs font-mono uppercase tracking-widest md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="https://www.linkedin.com/in/alejandroblancojimenez/"
            target="_blank"
            rel="noreferrer"
            className="text-text-secondary transition-colors hover:text-accent"
          >
            <LinkedinLogo className="h-5 w-5" weight="regular" />
          </a>
          <a
            href="https://github.com/Ghostalex07"
            target="_blank"
            rel="noreferrer"
            className="text-text-secondary transition-colors hover:text-accent"
          >
            <GithubLogo className="h-5 w-5" weight="regular" />
          </a>
          <a
            href="mailto:Alejandro.bj007@gmail.com"
            className="text-text-secondary transition-colors hover:text-accent"
          >
            <EnvelopeSimple className="h-5 w-5" weight="regular" />
          </a>
        </div>

        <button
          className="text-accent md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" weight="regular" /> : <List className="h-6 w-6" weight="regular" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          className="border-t border-surface-border bg-surface px-6 py-6 md:hidden"
        >
          <nav className="flex flex-col gap-5 font-mono text-sm uppercase tracking-widest">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 flex gap-5 border-t border-surface-border pt-5">
            <a href="https://www.linkedin.com/in/alejandroblancojimenez/" target="_blank" rel="noreferrer">
              <LinkedinLogo className="h-5 w-5 text-text-secondary" weight="regular" />
            </a>
            <a href="https://github.com/Ghostalex07" target="_blank" rel="noreferrer">
              <GithubLogo className="h-5 w-5 text-text-secondary" weight="regular" />
            </a>
            <a href="mailto:Alejandro.bj007@gmail.com">
              <EnvelopeSimple className="h-5 w-5 text-text-secondary" weight="regular" />
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
