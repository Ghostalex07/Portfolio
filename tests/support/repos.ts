/**
 * Repos sinteticos para las llamadas a api.github.com.
 *
 * La suite no toca la red: cada peticion se intercepta con page.route() y se
 * responde con esta lista, de modo que los checks no dependen del rate limit de
 * GitHub ni de la red del runner. La forma respeta el contrato que consume
 * src/components/Projects.tsx (name, html_url, description, topics, fork, size).
 */
export interface FakeRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  size: number;
}

const USER = "Ghostalex07";

function repo(
  id: number,
  name: string,
  language: string | null,
  description: string,
  topics: string[],
  extra: Partial<FakeRepo> = {},
): FakeRepo {
  return {
    id,
    name,
    description,
    html_url: `https://github.com/${USER}/${name}`,
    stargazers_count: id % 7,
    forks_count: id % 3,
    language,
    topics,
    fork: false,
    size: 120 + id,
    ...extra,
  };
}

export const FAKE_REPOS: FakeRepo[] = [
  // Las cuatro "curated": la app las pinta siempre y las cruza con la respuesta.
  repo(101, "YouMuDow", "Python", "Cross-platform music and video downloader with a desktop GUI and a reusable CLI.", ["python", "yt-dlp"]),
  repo(102, "phishing-domain-detection", "Python", "Machine learning project that detects phishing domains from lexical features.", ["security", "machine-learning"]),
  repo(103, "Mips-Python-Simulator", "Python", "A MIPS processor simulator with full register and memory emulation.", ["python", "mips"]),
  repo(104, "CountryApp", "TypeScript", "Angular app to explore countries by capital, name or region.", ["angular", "typescript"]),
  // Las "others": pasan el filtro de la segunda rejilla (no fork, size > 0,
  // description con contenido, fuera de EXCLUDED_NAMES).
  repo(105, "packet-sniffer-lab", "Python", "Raw socket experiments capturing and dissecting Ethernet frames for a networks course.", ["networking", "security"]),
  repo(106, "azure-lab", "Shell", "Bicep templates and hardening notes for a locked-down Azure landing zone.", ["azure", "iac"]),
  repo(107, "log-anomaly-hunter", "Python", "Pipeline that scores rare log sequences to surface brute-force attempts.", ["security", "python"]),
  repo(108, "docker-images", "Shell", "Hardened multi-stage images for the services I run on my own homelab.", ["docker", "devops"]),
  repo(109, "cv", "TypeScript", "Resume and portfolio source, built with Vite and Tailwind.", ["portfolio"]),
  repo(110, "study-notes", null, "Notes from the computer engineering degree, mostly systems and networks.", ["notes"]),
];
