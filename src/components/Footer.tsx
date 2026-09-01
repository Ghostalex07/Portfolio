import { LinkedinLogo, ArrowUpRight } from "@phosphor-icons/react";

const EMAIL = "Alejandro.bj007@gmail.com";

export function Footer() {
  return (
    <footer className="relative border-t border-surface-border py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-12">
          <div>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Let's build something
              <span className="text-accent"> resilient</span>.
            </h2>
            <p className="mt-4 max-w-md font-mono text-sm text-text-secondary">
              {EMAIL}
            </p>
          </div>

          <div className="grid gap-10 border-t border-surface-border pt-10 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <p className="mb-4 text-xs font-semibold text-text-muted">
                Connect
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.linkedin.com/in/alejandroblancojimenez/"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  LinkedIn
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" weight="regular" />
                </a>
                <a
                  href="https://github.com/Ghostalex07"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  GitHub
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" weight="regular" />
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  Email
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" weight="regular" />
                </a>
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold text-text-muted">
                Based in
              </p>
              <p className="text-sm font-medium text-text-secondary">
                Tres Cantos, Madrid, Spain
              </p>
              <p className="mt-1 text-xs text-text-muted">final year of Computer Engineering</p>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold text-text-muted">
                Currently
              </p>
              <p className="text-sm font-medium text-text-secondary">Software intern at DIGITAL55</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-surface-border pt-8 font-mono text-[10px] uppercase tracking-widest text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span>&copy; {new Date().getFullYear()} Alejandro Blanco</span>
            <span className="flex items-center gap-2">
              <LinkedinLogo className="h-3 w-3" weight="regular" />
              built with React &amp; Vite
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
