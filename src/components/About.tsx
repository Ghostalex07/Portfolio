import { useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";

/**
 * About es el bloque editorial de la pagina: una declaracion a tamano display
 * que ocupa todo el ancho, la prosa debajo en dos columnas y el historico
 * academico como un libro mayor horizontal. El Hero se queda con el split
 * asimetrico (texto + panel de estado), asi que las dos secciones ya no se leen
 * con el mismo ritmo.
 *
 * Nota: el `border-l` con punto que usaba Education era un segundo timeline
 * vertical en la pagina, identico al de Experience. Aqui son filas con filete
 * superior: el mismo dato, otra cadencia.
 */

const PRINCIPLES = [
  { lead: "Build in public", rest: ", most projects land on GitHub" },
  { lead: "Break, then fix", rest: ", like my ML-based phishing detection system" },
  { lead: "Security first", rest: ", threat model before feature list" },
];

const EDUCATION = [
  {
    school: "UNIE Universidad",
    period: "2023 - 2027",
    degree: "Bachelor's Degree in Computer Engineering",
    detail:
      "Cybersecurity & Blockchain specialization. Cloud Computing on AWS and Azure. AI & Data Analysis.",
    current: true,
  },
  {
    school: "Colegio Nuestra Senora de la Merced",
    period: "2021 - 2023",
    degree: "Technological Baccalaureate",
    detail: "",
    current: false,
  },
];

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
    <section ref={scope} id="about" className="relative scroll-mt-24 py-20 md:py-32">
      <div className="mx-auto w-full max-w-[80rem] px-6 sm:px-8 lg:px-12">
        {/* Bloque 1: la declaracion manda. Ocupa el ancho completo del
            contenedor y se parte en tres lineas por la medida en ch, no por una
            columna que lo recorte. */}
        <h2 className="about-reveal max-w-[22ch] text-balance text-display font-bold leading-[1.06] tracking-tight">
          From keeping systems running, to{" "}
          <span className="text-accent">building them secure.</span>
        </h2>

        {/* Bloque 2: prosa a la izquierda, principios como filas con filete a la
            derecha. Asimetrico a proposito, pero sin tarjeta: nada que compita
            con la caja de estado del Hero. */}
        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="space-y-6">
            <p className="about-reveal max-w-[58ch] text-base leading-relaxed text-text-secondary md:text-lg">
              Before writing code, I supported it. As an{" "}
              <span className="font-medium text-text-primary">IT Specialist at RTTC</span> I
              modernized outdated machines and learned how infrastructure actually breaks. The
              practical side a classroom can't teach. That experience shaped how I approach
              software: understand how things fail before adding to them.
            </p>
            <p className="about-reveal max-w-[58ch] text-base leading-relaxed text-text-secondary md:text-lg">
              Today I'm finishing my{" "}
              <span className="font-medium text-text-primary">
                Computer Engineering degree at UNIE
              </span>{" "}
              while interning as a developer at DIGITAL55, shipping backend features with Python
              and Java. Security is the thread that ties it all together. Everything I build gets
              designed with an attacker in mind.
            </p>
          </div>

          <ul className="about-reveal self-start">
            {PRINCIPLES.map((principle) => (
              <li
                key={principle.lead}
                className="flex gap-3 border-t border-surface-border py-4 text-sm leading-relaxed text-text-secondary last:border-b"
              >
                <span className="text-accent">→</span>
                <span>
                  <span className="font-medium text-text-primary">{principle.lead}</span>
                  {principle.rest}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bloque 3: Education como libro mayor. Dos entradas lado a lado, sin
            timeline, para que la pagina tenga un solo eje vertical (Experience). */}
        <div className="mt-20 md:mt-28">
          <h3 className="about-reveal text-h3 font-bold tracking-tight text-text-primary">
            Education
          </h3>

          <div className="mt-7 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {EDUCATION.map((entry) => (
              <article key={entry.school} className="about-reveal border-t border-surface-border pt-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h4 className="text-h3 font-bold tracking-tight text-text-primary">
                    {entry.school}
                  </h4>
                  <p className="font-mono text-xs text-accent">{entry.period}</p>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{entry.degree}</p>

                {entry.detail && (
                  <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-text-muted">
                    {entry.detail}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}