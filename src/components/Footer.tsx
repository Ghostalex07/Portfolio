import { EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";

const EMAIL = "Alejandro.bj007@gmail.com";

export function Footer() {
  return (
    <footer className="border-t border-surface-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-text-primary">Get in Touch</h2>
            <p className="font-mono text-sm text-text-secondary">
              Available for collaborations and professional inquiries.
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/alejandroblancojimenez/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-surface-border px-6 py-3 font-mono text-xs text-text-secondary transition-all hover:border-accent/30 hover:text-accent active:translate-y-px"
            >
              <LinkedinLogo className="h-4 w-4" weight="regular" />
              LinkedIn
            </a>
            <a
              href="https://github.com/Ghostalex07"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-surface-border px-6 py-3 font-mono text-xs text-text-secondary transition-all hover:border-accent/30 hover:text-accent active:translate-y-px"
            >
              <GithubLogo className="h-4 w-4" weight="regular" />
              GitHub
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs font-medium text-surface transition-all hover:brightness-110 active:translate-y-px"
            >
              <EnvelopeSimple className="h-4 w-4" weight="regular" />
              Email
            </a>
          </div>
        </div>

        <div className="mt-16 text-center font-mono text-[10px] uppercase tracking-widest text-text-secondary/30">
          &copy; {new Date().getFullYear()} Alejandro Blanco
        </div>
      </div>
    </footer>
  );
}
