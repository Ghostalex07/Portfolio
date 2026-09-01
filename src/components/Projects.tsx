import { useEffect, useRef, useState } from "react";
import { GithubLogo, Star, GitFork, ArrowSquareOut } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useGSAP } from "../hooks/useGSAP";

const GITHUB_USERNAME = "Ghostalex07";
const CACHE_KEY = "gh-repos-cache";
const CACHE_TTL = 60 * 60 * 1000;

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
}

const FALLBACK: Repo[] = [
  {
    id: 1,
    name: "MIPS-Processor-Simulator",
    description:
      "A detailed simulator for MIPS architecture, focusing on instruction execution and memory management.",
    html_url: `https://github.com/${GITHUB_USERNAME}`,
    stargazers_count: 0,
    forks_count: 0,
    language: "C",
    topics: ["architecture", "simulator"],
  },
  {
    id: 2,
    name: "Cyber-Security-Lab",
    description:
      "Virtual laboratory setups for testing network security, penetration testing, and vulnerability assessment.",
    html_url: `https://github.com/${GITHUB_USERNAME}`,
    stargazers_count: 0,
    forks_count: 0,
    language: "Docker",
    topics: ["security", "lab"],
  },
  {
    id: 3,
    name: "Text-Game-Engine",
    description:
      "A custom engine for narrative-driven text games with complex state management and branching paths.",
    html_url: `https://github.com/${GITHUB_USERNAME}`,
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    topics: ["game", "engine"],
  },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dockerfile: "#384d54",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  R: "#198CE7",
  "Jupyter Notebook": "#DA5B0B",
  COBOL: "#008080",
};

function langColor(lang: string | null): string {
  if (!lang) return "#8b8b8b";
  return LANG_COLORS[lang] ?? "#ef9f4a";
}

function Skeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="relative h-56 overflow-hidden rounded-2xl border border-surface-border bg-surface-raised"
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-raised via-surface-2 to-surface-raised" />
          <div className="absolute inset-0 p-6">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-surface-2 mb-4" />
            <div className="h-3 w-full animate-pulse rounded-full bg-surface-2 mb-2" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-surface-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function readCache(): Repo[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: Repo[] };
    if (Date.now() - parsed.ts > CACHE_TTL) return null;
    return Array.isArray(parsed.data) && parsed.data.length > 0 ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeCache(repos: Repo[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: repos }));
  } catch {
    // storage unavailable (private mode, quota); skip
  }
}

export function Projects() {
  const [repos, setRepos] = useState<Repo[]>(() => {
    if (typeof window === "undefined") return [];
    return readCache() ?? [];
  });
  const [loading, setLoading] = useState(() => repos.length === 0);
  const reduce = useReducedMotion();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP((gsap) => {
    if (reduce || loading) return;
    gsap.fromTo(
      ".proj-card",
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: "top 70%" },
      },
    );
  }, [reduce, loading]);

  useEffect(() => {
    if (repos.length > 0) return; // fresh cache on first paint, no fetch needed

    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) {
        setRepos(FALLBACK);
        setLoading(false);
      }
    }, 5000);

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setRepos(data);
          writeCache(data);
        } else {
          setRepos((prev) => (prev.length > 0 ? prev : FALLBACK));
        }
      })
      .catch(() => {
        if (cancelled) return;
        setRepos((prev) => (prev.length > 0 ? prev : FALLBACK));
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          clearTimeout(timer);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Bento: make first item span 2 cols on lg
  const spanFirst = repos.length > 0;

  return (
    <section ref={scope} id="projects" className="relative scroll-mt-24 border-t border-surface-border py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Projects
          </h2>
          <span className="hidden font-mono text-xs text-text-muted sm:inline">
            pulled live from GitHub
          </span>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo, i) => {
              const color = langColor(repo.language);
              const isWide = spanFirst && i === 0;
              return (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`proj-card group relative flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-raised p-6 pr-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] ${
                    isWide ? "md:col-span-2" : ""
                  }`}
                >
                  <div
                    className="pointer-events-none absolute left-0 top-0 h-full w-px"
                    style={{ background: `linear-gradient(to bottom, transparent, ${color}66, transparent)` }}
                  />
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <h3 className="truncate font-mono text-sm font-bold text-text-primary transition-colors group-hover:text-accent">
                        {repo.name}
                      </h3>
                    </div>
                    <ArrowSquareOut
                      className="h-4 w-4 shrink-0 text-text-muted transition-colors group-hover:text-accent"
                      weight="regular"
                    />
                  </div>

                  <p className="mb-5 flex-1 text-xs leading-relaxed text-text-secondary line-clamp-3">
                    {repo.description || "No description provided."}
                  </p>

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-accent-muted px-2 py-0.5 font-mono text-[10px] text-accent-soft"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 border-t border-surface-border/60 pt-4 text-xs text-text-muted">
                    {repo.language && (
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" weight="regular" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" weight="regular" /> {repo.forks_count}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex items-center gap-3">
          <GithubLogo className="h-4 w-4 text-text-muted" weight="regular" />
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1 font-mono text-xs text-text-secondary transition-colors hover:text-accent"
          >
            github.com/{GITHUB_USERNAME}
            <ArrowSquareOut className="h-3 w-3 transition-transform group-hover:translate-x-0.5" weight="regular" />
          </a>
        </div>
      </div>
    </section>
  );
}
