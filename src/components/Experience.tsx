import { Briefcase, CaretRight } from "@phosphor-icons/react";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 border-t border-surface-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-accent" weight="regular" />
          <h2 className="text-lg font-bold">Experience</h2>
        </div>

        <div className="rounded-xl border border-surface-border bg-surface-raised p-6 md:p-8">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-lg font-bold text-text-primary">IT Specialist</h3>
              <p className="font-mono text-sm text-accent">RTTC</p>
            </div>
            <p className="font-mono text-xs text-text-secondary">01/2024 - 03/2025</p>
          </div>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-text-secondary">
              <CaretRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" weight="bold" />
              <span>Resolved complex technical issues and modernized legacy hardware and systems.</span>
            </li>
            <li className="flex gap-3 text-sm text-text-secondary">
              <CaretRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" weight="bold" />
              <span>Optimized infrastructure processes and provided specialized technical support.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
