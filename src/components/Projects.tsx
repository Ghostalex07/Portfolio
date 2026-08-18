import { useEffect, useState } from "react";
import { GithubLogo, Star, GitFork, ArrowSquareOut } from "@phosphor-icons/react";

const GITHUB_USERNAME = "Ghostalex07";

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
    description: "A detailed simulator for MIPS architecture, focusing on instruction execution and memory management.",
    html_url: `https://github.com/${GITHUB_USERNAME}`,
    stargazers_count: 0,
    forks_count: 0,
    language: "C",
    topics: [],
  },
  {
    id: 2,
    name: "Cyber-Security-Lab",
    description: "Virtual laboratory setups for testing network security, penetration testing, and vulnerability assessment.",
    html_url: `https://github.com/${GITHUB_USERNAME}`,
    stargazers_count: 0,
    forks_count: 0,
    language: "Docker",
    topics: [],
  },
  {
    id: 3,
    name: "Text-Game-Engine",
    description: "A custom engine for narrative-driven text games with complex state management and branching paths.",
    html_url: `https://github.com/${GITHUB_USERNAME}`,
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    topics: [],
  },
];

export function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setRepos(FALLBACK);
      setLoading(false);
    }, 5000);

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRepos(data);
        } else {
          setRepos(FALLBACK);
        }
      })
      .catch(() => setRepos(FALLBACK))
      .finally(() => {
        setLoading(false);
        clearTimeout(timer);
      });

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="projects" className="scroll-mt-24 border-t border-surface-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center gap-3">
          <GithubLogo className="h-5 w-5 text-accent" weight="regular" />
          <h2 className="text-lg font-bold">Projects</h2>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl border border-surface-border bg-surface-raised"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col rounded-xl border border-surface-border bg-surface-raised p-6 transition-all hover:border-accent/30"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-mono text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                    {repo.name}
                  </h3>
                  <ArrowSquareOut className="h-4 w-4 shrink-0 text-text-secondary/30 transition-colors group-hover:text-accent" weight="regular" />
                </div>

                <p className="mb-6 flex-1 text-xs leading-relaxed text-text-secondary line-clamp-3">
                  {repo.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-text-secondary/50">
                    {repo.language && (
                      <span className="rounded border border-surface-border bg-surface px-2 py-0.5 font-mono text-[10px]">
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
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
