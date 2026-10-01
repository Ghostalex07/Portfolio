import { Shield, Trophy, CloudArrowUp, Brain, Certificate, Medal } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";

/**
 * Certificaciones lee como un libro mayor de titulos, no como otra rejilla de
 * tarjetas con una destacada. Projects ya es la pieza central con su rejilla de
 * 2 columnas + 3 columnas; repetirla aqui hacia que las dos secciones se
 * confundieran en el scroll. Aqui la jerarquia se resuelve con escala y medida:
 * las dos insignias ocupan filas anchas a tamano display-sm y las seis restantes
 * caen a filas compactas en dos columnas.
 *
 * Sin superficies: son datos, no controles. Un hover sobre una fila que no hace
 * nada seria una mentira de interactividad.
 */

const CERTIFICATIONS = [
  { title: "Junior Cybersecurity Analyst", issuer: "Cisco", icon: Trophy, featured: true },
  { title: "AZ-500 · Azure Security", issuer: "Microsoft", icon: Shield, featured: true },
  { title: "SC-900 · Security & Identity", issuer: "Microsoft", icon: Shield, featured: false },
  { title: "MS-900 · M365 Fundamentals", issuer: "Microsoft", icon: Certificate, featured: false },
  { title: "AI & Critical Thinking", issuer: "Planeta Formacion", icon: Brain, featured: false },
  { title: "International Hackathon", issuer: "Univ. Pontificia de Salamanca", icon: Trophy, featured: false },
  { title: "AWS Academy", issuer: "Amazon Web Services", icon: CloudArrowUp, featured: false },
  { title: "Experis Academy", issuer: "Experis", icon: Medal, featured: false },
];

export function Certifications() {
  const reduce = useReducedMotion();
  const featured = CERTIFICATIONS.filter((c) => c.featured);
  const rest = CERTIFICATIONS.filter((c) => !c.featured);

  const scope = useGSAP<HTMLElement>((gsap) => {
    if (reduce) return;
    gsap.fromTo(
      ".cert-reveal",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: scope.current, start: "top 70%" },
      },
    );
  }, [reduce]);

  return (
    <section ref={scope} id="certs" className="relative scroll-mt-24 border-t border-surface-border py-16 md:py-24">
      <div className="mx-auto w-full max-w-[80rem] px-6 sm:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 className="text-h2-sm font-bold tracking-tight text-text-primary">
            Certifications
          </h2>
          <span className="hidden font-mono text-xs text-text-muted sm:inline">
            {CERTIFICATIONS.length} credentials
          </span>
        </div>

        {/* Las dos insignias: filas a ancho completo, sin caja. El peso lo da el
            tamano del titular, no un contenedor. */}
        <div className="border-t border-surface-border">
          {featured.map((cert) => (
            <div
              key={cert.title}
              className="cert-reveal flex items-start gap-5 border-b border-surface-border py-7 md:py-9"
            >
              <cert.icon className="mt-1.5 h-6 w-6 shrink-0 text-accent" weight="fill" />
              <div>
                <p className="font-mono text-micro uppercase tracking-wider text-accent-soft">
                  {cert.issuer}
                </p>
                <h3 className="mt-2 max-w-[24ch] text-display-sm font-bold leading-[1.1] tracking-tight text-text-primary">
                  {cert.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Las seis restantes: dos columnas de filas cortas. El paso de las
            filas anchas a las compactas es el unico acento que hace falta. */}
        <div className="grid gap-x-12 sm:grid-cols-2">
          {rest.map((cert) => (
            <div
              key={cert.title}
              className="cert-reveal flex items-start gap-4 border-b border-surface-border py-5"
            >
              <cert.icon className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" weight="regular" />
              <div className="min-w-0">
                <p className="font-mono text-micro uppercase tracking-wider text-text-muted">
                  {cert.issuer}
                </p>
                <h3 className="mt-1 text-sm font-bold leading-snug text-text-primary">
                  {cert.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}