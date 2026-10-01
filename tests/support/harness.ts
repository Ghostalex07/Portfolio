import type { Page, Route } from "@playwright/test";
import { expect, test as base } from "@playwright/test";
import { FAKE_REPOS } from "./repos";

/**
 * Fixture compartida por toda la suite.
 *
 * Dos garantias que necesita el resto de los specs:
 *   1. Ningun test toca la red real. Toda llamada a api.github.com se
 *      intercepta con page.route() y se responde de forma sintetica, con
 *      CORS habilitado para que el navegador entregue la respuesta al JS de la
 *      pagina (sin el header, un 403 llegaria como error de CORS y el check
 *      pasaria por el motivo equivocado).
 *   2. Ningun test hereda estado de otro: la cache de repos se limpia (o se
 *      siembra corrupta a proposito) en un addInitScript, que corre antes que
 *      cualquier script de la aplicacion en cada navegacion.
 */
export const GITHUB_API_GLOB = "**://api.github.com/**";

/** Que responde el interceptor de la API de GitHub. */
export type GithubMode =
  /** 200 con repos sinteticos. */
  | "ok"
  /** 403 con el cuerpo real de rate limit. */
  | "forbidden"
  /** La peticion se queda colgada indefinidamente. */
  | "hang";

/** Estado de localStorage['gh-repos-cache'] antes de cargar la pagina. */
export type CacheSeed = "clear" | "corrupt";

export interface GithubOptions {
  mode: GithubMode;
  cache: CacheSeed;
}

export interface Fixtures {
  /** console.error y excepciones no capturadas de la pagina, en orden. */
  consoleErrors: string[];
  /** URLs de api.github.com que la app ha solicitado de verdad. */
  githubRequests: string[];
}

/** Fixture `github` de tipo GithubOptions, mas las fixtures observadoras. */
export interface Harness extends Fixtures {
  github: GithubOptions;
}

const CORS_HEADERS = { "access-control-allow-origin": "*" };

export const test = base.extend<Harness>({
  github: [{ mode: "ok", cache: "clear" }, { option: true }],

  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console.error: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`uncaught exception: ${error.message}`));
    await use(errors);
  },

  githubRequests: async ({}, use) => {
    const requests: string[] = [];
    await use(requests);
  },

  page: async ({ page, github, githubRequests }, use) => {
    const neverAnswered: Route[] = [];

    await page.route(GITHUB_API_GLOB, async (route) => {
      githubRequests.push(route.request().url());

      if (github.mode === "forbidden") {
        await route.fulfill({
          status: 403,
          contentType: "application/json",
          headers: CORS_HEADERS,
          body: JSON.stringify({ message: "API rate limit exceeded" }),
        });
        return;
      }

      if (github.mode === "hang") {
        // Equivalente al Fetch.requestPaused sin responder de los scripts CDP:
        // el fetch nunca resuelve y el skeleton tiene que resolverse igual.
        neverAnswered.push(route);
        await new Promise<never>(() => {});
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: CORS_HEADERS,
        body: JSON.stringify(FAKE_REPOS),
      });
    });

    await page.addInitScript((seed: string) => {
      try {
        if (seed === "corrupt") {
          // Bug 3: un null dentro del array hace crash el render y deja la
          // pagina en blanco. readCache() tiene que descartar el elemento.
          localStorage.setItem("gh-repos-cache", JSON.stringify({ ts: Date.now(), data: [null] }));
        } else {
          localStorage.removeItem("gh-repos-cache");
        }
      } catch {
        /* storage no disponible: la app ya lo tolera */
      }
    }, github.cache);

    await use(page);

    // Desbloquear el cierre de contexto si un test dejo un fetch colgado.
    await Promise.all(neverAnswered.map((route) => route.abort().catch(() => undefined)));
  },
});

export { expect };

/** Navega a la raiz del sitio servido por el webServer de Playwright. */
export async function openApp(page: Page) {
  await page.goto("/");
}
