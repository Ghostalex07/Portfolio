import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { List, X, GithubLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certs", href: "#certs" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const reduce = useReducedMotion();
  const sectionIds = useRef(NAV_ITEMS.map((i) => i.href));
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sectionIds.current.forEach((href) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-surface-border/60 bg-surface/90 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="group font-mono text-lg font-bold tracking-tight text-accent">
          AB
          <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-2px]">_</span>
        </a>

        <nav className="hidden items-center gap-8 text-xs font-mono uppercase tracking-widest md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "true" : undefined}
              className={`relative transition-colors hover:text-accent ${
                active === item.href ? "text-accent" : "text-text-secondary"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ${
                  active === item.href ? "w-full" : "w-0"
                }`}
              />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="https://www.linkedin.com/in/alejandroblancojimenez/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-text-secondary transition-colors hover:text-accent"
          >
            <LinkedinLogo className="h-5 w-5" weight="regular" />
          </a>
          <a
            href="https://github.com/Ghostalex07"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-text-secondary transition-colors hover:text-accent"
          >
            <GithubLogo className="h-5 w-5" weight="regular" />
          </a>
          <a
            href="mailto:Alejandro.bj007@gmail.com"
            aria-label="Email"
            className="text-text-secondary transition-colors hover:text-accent"
          >
            <EnvelopeSimple className="h-5 w-5" weight="regular" />
          </a>
        </div>

        <button
          className="text-accent md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" weight="regular" /> : <List className="h-6 w-6" weight="regular" />}
        </button>
      </div>

      {open && (
        <motion.div
          id="mobile-menu"
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
            <a href="https://www.linkedin.com/in/alejandroblancojimenez/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedinLogo className="h-5 w-5 text-text-secondary" weight="regular" />
            </a>
            <a href="https://github.com/Ghostalex07" target="_blank" rel="noreferrer" aria-label="GitHub">
              <GithubLogo className="h-5 w-5 text-text-secondary" weight="regular" />
            </a>
            <a href="mailto:Alejandro.bj007@gmail.com" aria-label="Email">
              <EnvelopeSimple className="h-5 w-5 text-text-secondary" weight="regular" />
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
