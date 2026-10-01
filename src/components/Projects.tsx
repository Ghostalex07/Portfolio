import { useEffect, useState } from "react";
import { GithubLogo, Star, GitFork } from "@phosphor-icons/react";
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
  fork?: boolean;
  size?: number;
}

interface FeaturedRepo {
  name: string;
  description: string;
  language: string;
  topics: string[];
}

const FEATURED: FeaturedRepo[] = [
  {
    name: "YouMuDow",
    description:
      "Cross-platform music & video downloader built with Python and yt-dlp: desktop GUI, reusable CLI, download queue, embedded metadata, persistent config, and CI/CD.",
    language: "Python",
    topics: ["python", "yt-dlp", "desktop"],
  },
  {
    name: "phishing-domain-detection",
    description:
      "Machine Learning project that detects phishing domains using domain-based features and classification models. My first real project mixing security and data.",
    language: "Python",
    topics: ["security", "machine-learning", "python"],
  },
  {
    name: "Mips-Python-Simulator",
    description:
      "A Python-based MIPS processor simulator that executes binary-encoded instructions with full register and memory emulation.",
    language: "Python",
    topics: ["python", "mips", "architecture"],
  },
  {
    name: "CountryApp",
    description:
      "An Angular application for exploring the world: search countries by capital, name, or region, with population, flag, and location details.",
    language: "TypeScript",
    topics: ["angular", "typescript", "api"],
  },
];

const EXCLUDED_NAMES = new Set(["Portfolio", "Ghostalex07", "disgusting", "Web", "pipes-app"]);

// Cuatro tonos, todos por debajo del 80% de saturación y separados del acento en
// tono. Los 20 colores de GitHub Linguist producían un arcoíris junto al ámbar.
const LANG_TONES = {
  accent: "#e7a240", // H 35
  violet: "#b28dc4", // H 280
  cyan: "#81a8bb", // H 200
  neutral: "#75758a", // H 240, la familia de grises del tema
} as const;

const LANG_COLORS: Record<string, keyof typeof LANG_TONES> = {
  TypeScript: "cyan",
  JavaScript: "cyan",
  Python: "accent",
  Java: "violet",
  Shell: "violet",
};

function langColor(lang: string | null): string {
  if (!lang) return LANG_TONES.neutral;
  return LANG_TONES[LANG_COLORS[lang] ?? "neutral"];
}

function repoDescription(repo: Repo): string {
  if (repo.description && repo.description.trim().length > 0) return repo.description;
  if (Array.isArray(repo.topics) && repo.topics.length > 0) {
    return `Exploring ${repo.topics.slice(0, 2).join(" and ")} in public. Details landing soon.`;
  }
  return "Work in progress. Check the repository for the latest state.";
}

function Skeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative min-h-[13rem] overflow-hidden rounded-card border border-surface-border bg-surface-raised"
        >
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-raised via-surface-2 to-surface-raised" />
          <div className="absolute inset-0 p-6">
            <div className="mb-4 h-4 w-2/3 animate-pulse rounded-full bg-surface-2" />
            <div className="mb-2 h-3 w-full animate-pulse rounded-full bg-surface-2" />
            <div className="mb-2 h-3 w-4/5 animate-pulse rounded-full bg-surface-2" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-surface-2" />
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
    if (!Array.isArray(parsed.data) || parsed.data.length === 0) return null;
    // Validar cada elemento: un null o un primitivo dentro del array provoca un
    // TypeError en el render y deja la página en blanco.
    const valid = parsed.data.filter(
      (r): r is Repo =>
        !!r &&
        typeof r === "object" &&
        typeof r.name === "string" &&
        typeof r.html_url === "string",
    );
    return valid.length > 0 ? valid : null;
  } catch {
    return null;
  }
}

function writeCache(repos: Repo[]) {
  try {
    // Persistir solo los campos que se usan, no los 80+ que devuelve la API.
    const slim = repos.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language,
      topics: r.topics,
      fork: r.fork,
      size: r.size,
    }));
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: slim }));
  } catch {
    // storage unavailable (private mode, quota); skip
  }
}

interface Card {
  id: string;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  featured: boolean;
}

export function Projects() {
  const [repos, setRepos] = useState<Repo[]>(() => readCache() ?? []);
  const [loading, setLoading] = useState(repos.length === 0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const reduce = useReducedMotion();

  const scope = useGSAP<HTMLElement>((gsap) => {
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
    if (repos.length > 0) return;
    const el = scope.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          setShouldFetch(true);
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [repos.length]);

  // El timeout se monta siempre, no solo cuando la red responde ni cuando la seccion
  // entra en el viewport: si el observer nunca dispara o el fetch se cuelga, el
  // skeleton tiene que resolverse igualmente.
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!shouldFetch) return;

    const controller = new AbortController();
    let cancelled = false;

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`GitHub API ${r.status}`);
        const data: unknown = await r.json();
        if (!Array.isArray(data)) throw new Error("Unexpected payload shape");
        return data as Repo[];
      })
      .then((data) => {
        if (cancelled) return;
        const filtered = data.filter((r) => r && typeof r === "object" && !r.fork);
        if (filtered.length > 0) {
          setRepos(filtered);
          writeCache(filtered);
        } else {
          setFetchError(true);
        }
      })
      .catch((err: unknown) => {
        if (cancelled || (err instanceof DOMException && err.name === "AbortError")) return;
        // 403 rate-limit, 404, 5xx y error de red llegan aquí: hay que distinguirlo
        // del "no había repos" para no dejar al visitante con un portfolio vacío.
        setFetchError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [shouldFetch]);

  const byName = new Map<string, Repo>(repos.map((r) => [r.name, r]));
  const featured: Card[] = FEATURED.map((f) => {
    const live = byName.get(f.name);
    return {
      id: `featured-${f.name}`,
      name: f.name,
      description: f.description,
      html_url: live?.html_url ?? `https://github.com/${GITHUB_USERNAME}/${f.name}`,
      stargazers_count: live?.stargazers_count ?? 0,
      forks_count: live?.forks_count ?? 0,
      language: f.language,
      topics: f.topics,
      featured: true,
    };
  });
  const others: Card[] = repos
    .filter((r) => !FEATURED.some((f) => f.name === r.name))
    .filter((r) => !EXCLUDED_NAMES.has(r.name))
    .filter((r) => (r.size ?? 0) > 0 && r.description && r.description.trim().length > 3)
    .slice(0, 6)
    .map((r) => ({
      id: `repo-${r.id}`,
      name: r.name,
      description: repoDescription(r),
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language,
      topics: r.topics ?? [],
      featured: false,
    }));
  return (
    <section ref={scope} id="projects" className="relative scroll-mt-24 border-t border-surface-border py-24 md:py-40">
      <div className="mx-auto w-full max-w-[80rem] px-6 sm:px-8 lg:px-12">
        {/* Titulo, regla y procedencia en un solo renglon. La nota deja de flotar
            suelta en la esquina superior derecha y pasa a ser el remate de una
            linea continua; por debajo de sm la regla se retira y la nota cae
            bajo el titular, nunca se oculta. */}
        <div className="mb-14 flex flex-wrap items-baseline gap-x-5 gap-y-2 sm:flex-nowrap">
          <h2 className="text-h2 font-bold tracking-tight text-text-primary">
            Projects
          </h2>
          <span className="hidden h-px flex-1 self-center bg-surface-border sm:block" aria-hidden="true" />
          <p className="font-mono text-xs text-text-muted">curated + live from GitHub</p>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <div>
            <div className="grid gap-5 md:grid-cols-2">
              {featured.map((repo) => {
                const color = langColor(repo.language);
                return (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="proj-card group relative flex flex-col overflow-hidden rounded-card border border-surface-border bg-surface-raised p-7 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-accent/30"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                        <h3 className="truncate font-mono text-sm font-bold text-text-primary transition-colors group-hover:text-accent">
                          {repo.name}
                        </h3>
                      </div>
                    </div>

                    <p className="mb-5 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-4 md:text-[0.9375rem]">
                      {repo.description}
                    </p>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="mb-4 mt-auto flex flex-wrap gap-1.5">
                        {repo.topics.slice(0, 2).map((topic) => (
                          <span
                            key={topic}
                            className="rounded-pill bg-accent-muted px-2 py-0.5 font-mono text-micro text-accent-soft"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex items-center gap-4 border-t border-surface-border/60 pt-4 text-xs text-text-muted">
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

            {others.length > 0 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((repo) => {
                  const color = langColor(repo.language);
                  return (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="proj-card group relative flex flex-col overflow-hidden rounded-card border border-surface-border bg-surface-raised p-6 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-accent/30"
                    >
                      <div className="mb-4 flex min-w-0 items-center gap-3">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                        <h3 className="truncate font-mono text-sm font-bold text-text-primary transition-colors group-hover:text-accent">
                          {repo.name}
                        </h3>
                      </div>

                      <p className="mb-5 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-4 md:text-[0.9375rem]">
                        {repo.description}
                      </p>

                      {repo.topics.length > 0 && (
                        <div className="mb-4 mt-auto flex flex-wrap gap-1.5">
                          {repo.topics.slice(0, 2).map((topic) => (
                            <span
                              key={topic}
                              className="rounded-pill bg-accent-muted px-2 py-0.5 font-mono text-micro text-accent-soft"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto flex items-center gap-4 border-t border-surface-border/60 pt-4 text-xs text-text-muted">
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

            {fetchError && (
              <p className="mt-6 text-sm text-text-secondary">
                Live GitHub data is unavailable right now, so only the curated projects are shown.{" "}
                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline underline-offset-4 hover:text-accent-soft"
                >
                  Browse all repos
                </a>
              </p>
            )}
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
            <span className="sr-only">opens in new tab</span>
          </a>
        </div>
      </div>
    </section>
  );
}