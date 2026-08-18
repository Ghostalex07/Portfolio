import { Terminal, BookOpen } from "@phosphor-icons/react";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Mission */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Terminal className="h-5 w-5 text-accent" weight="regular" />
              <h2 className="text-lg font-bold">Mission</h2>
            </div>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              Computer Engineer based in Madrid with strong knowledge in Java, Python, and C.
              I bring discipline, consistency, and a continuous improvement mindset to every project.
            </p>
            <p className="text-base leading-relaxed text-text-secondary">
              My core focus is on <span className="font-medium text-text-primary">cybersecurity</span>,
              secure software architectures, and threat analysis. I leverage my background in
              Cloud (AWS/Azure) to build resilient and protected digital environments.
            </p>
          </div>

          {/* Education */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-accent" weight="regular" />
              <h2 className="text-lg font-bold">Education</h2>
            </div>
            <div className="space-y-8">
              <div className="relative pl-6 border-l border-accent/30">
                <div className="absolute -left-[5px] top-0 h-[9px] w-[9px] rounded-full bg-accent" />
                <h3 className="font-bold text-text-primary">UNIE Universidad</h3>
                <p className="font-mono text-xs text-accent">2023 - 2027</p>
                <p className="mt-1 text-sm text-text-secondary">Bachelor's Degree in Computer Engineering</p>
                <ul className="mt-2 space-y-1 text-xs text-text-secondary/70">
                  <li>Cybersecurity & Blockchain Specialization</li>
                  <li>Cloud Computing (AWS/Azure)</li>
                  <li>AI & Data Analysis</li>
                </ul>
              </div>
              <div className="relative pl-6 border-l border-surface-border">
                <div className="absolute -left-[5px] top-0 h-[9px] w-[9px] rounded-full bg-text-secondary/20" />
                <h3 className="font-bold text-text-primary">Colegio Nuestra Senora de la Merced</h3>
                <p className="font-mono text-xs text-text-secondary">2021 - 2023</p>
                <p className="mt-1 text-sm text-text-secondary">Technological Baccalaureate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
