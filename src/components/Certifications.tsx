import { Shield } from "@phosphor-icons/react";

const CERTIFICATIONS = [
  { title: "Junior Cybersecurity Analyst", issuer: "Cisco", desc: "Foundations of cybersecurity operations and threat analysis" },
  { title: "Microsoft AZ-500", issuer: "Microsoft", desc: "Azure Security Technologies" },
  { title: "Microsoft SC-900", issuer: "Microsoft", desc: "Security, Compliance, and Identity Fundamentals" },
  { title: "Microsoft MS-900", issuer: "Microsoft", desc: "Microsoft 365 Fundamentals" },
  { title: "AI & Critical Thinking", issuer: "Planeta Formacion", desc: "Advanced AI concepts" },
  { title: "International Hackathon", issuer: "Universidad Pontificia de Salamanca", desc: "Digital solutions challenge" },
  { title: "AWS Academy", issuer: "Amazon Web Services", desc: "Cloud computing fundamentals" },
  { title: "Experis Academy", issuer: "Experis", desc: "Soft skills & professional development" },
];

export function Certifications() {
  return (
    <section id="certs" className="scroll-mt-24 border-t border-surface-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center gap-3">
          <Shield className="h-5 w-5 text-accent" weight="regular" />
          <h2 className="text-lg font-bold">Certifications</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.title}
              className="flex gap-4 rounded-xl border border-surface-border bg-surface-raised p-5 transition-colors hover:border-accent/20"
            >
              <div className="mt-0.5 shrink-0 rounded-lg bg-accent-muted p-2">
                <Shield className="h-4 w-4 text-accent" weight="regular" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">{cert.title}</h4>
                <p className="mt-0.5 font-mono text-xs text-accent">{cert.issuer}</p>
                <p className="mt-1 text-xs text-text-secondary/60">{cert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
