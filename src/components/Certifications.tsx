import { useRef } from "react";
import { Shield, Trophy, CloudArrowUp, Brain, Certificate, Medal } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";

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
  const scope = useRef<HTMLDivElement>(null);
  const featured = CERTIFICATIONS.filter((c) => c.featured);
  const rest = CERTIFICATIONS.filter((c) => !c.featured);

  useGSAP((gsap) => {
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
    <section ref={scope} id="certs" className="relative scroll-mt-24 border-t border-surface-border py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Certifications
          </h2>
          <span className="hidden font-mono text-xs text-text-muted sm:inline">
            {CERTIFICATIONS.length} credentials
          </span>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-2">
          {featured.map((cert) => (
            <div
              key={cert.title}
              className="cert-reveal group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-raised p-7 ring-chrome transition-colors hover:border-accent/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-accent-muted p-3">
                    <cert.icon className="h-5 w-5 text-accent" weight="fill" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-accent-soft">
                      {cert.issuer}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-text-primary">{cert.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((cert) => (
            <div
              key={cert.title}
              className="cert-reveal flex flex-col justify-between rounded-2xl border border-surface-border bg-surface-raised p-5 transition-colors hover:border-accent/30"
            >
              <cert.icon className="h-5 w-5 text-accent" weight="regular" />
              <div className="mt-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  {cert.issuer}
                </p>
                <h4 className="mt-1 text-sm font-bold leading-snug text-text-primary">{cert.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}