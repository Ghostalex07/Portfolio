import { expect, openApp, test } from "./support/harness";
import { expectElementsExist, scrollThroughPage } from "./support/reveal";

/**
 * Resiliencia de la integracion con GitHub.
 *
 * Todos los modos de respuesta (200 sintetico, 403, fetch colgado) y la cache
 * corrupta se configuran con la option fixture `github`; ver tests/support/harness.ts.
 * Ningun test de este archivo toca la red real.
 */
test.describe("GitHub: cache corrupta", () => {
  test.use({ github: { mode: "ok", cache: "corrupt" } });

  test("cache corrupta no deja pagina en blanco", async ({ page }) => {
    // verify.mjs check 5/12 (bug 3): localStorage con {data: [null]}.
    await openApp(page);

    const state = await page.evaluate(() => ({
      bodyLen: document.body.innerText.length,
      hasBoundary: document.body.innerText.includes("Something broke"),
      cards: document.querySelectorAll(".proj-card").length,
    }));

    expect(
      state.bodyLen,
      `body ${state.bodyLen} chars, boundary=${state.hasBoundary}, cards=${state.cards}`,
    ).toBeGreaterThan(200);
    // Diagnostico del original: el sintoma del bug era blank + ErrorBoundary.
    test.info().annotations.push({ type: "diagnostics", description: JSON.stringify(state) });
  });
});

test.describe("GitHub: 403 rate limit", () => {
  test.use({ github: { mode: "forbidden", cache: "clear" } });

  test("403 de GitHub muestra estado de error (no un portfolio silenciosamente mas pequeno)", async ({
    page,
    githubRequests,
  }) => {
    // verify2.mjs check 4/9
    await openApp(page);
    await scrollThroughPage(page, 500, 80, 0);

    // El fetch solo se dispara cuando #projects entra en el viewport, asi que
    // si no hubiera peticion el check pasaria en vacio.
    await expect
      .poll(() => githubRequests.length, {
        timeout: 10_000,
        message: "la app nunca llamo a api.github.com",
      })
      .toBeGreaterThan(0);

    const errorState = page.getByText("Live GitHub data is unavailable");
    await expect(errorState).toBeVisible({ timeout: 10_000 });

    const state = await page.evaluate(() => ({
      cards: document.querySelectorAll(".proj-card").length,
      hasLink: Boolean(document.querySelector('a[href*="github.com/Ghostalex07"]')),
    }));
    test.info().annotations.push({ type: "diagnostics", description: JSON.stringify(state) });
  });
});

test.describe("GitHub: skeleton sin respuesta", () => {
  test.use({ github: { mode: "hang", cache: "clear" } });

  test("el skeleton resuelve a los 5s aunque el fetch nunca responda", async ({ page }) => {
    // verify2.mjs check 5/9
    await openApp(page);
    await page.locator("#projects").scrollIntoViewIfNeeded();

    // Guarda contra un pase en vacio: si el skeleton nunca llego a pintarse,
    // "ya no hay skeleton" seria cierto desde el principio.
    await expect(page.locator("#projects .animate-pulse").first()).toBeAttached();

    const stillSkeleton = async () =>
      page.evaluate(() => ({
        loading: document.body.innerText.includes("Loading"),
        pulses: document.querySelectorAll("#projects .animate-pulse").length,
        cards: document.querySelectorAll(".proj-card").length,
      }));

    // El timeout de la app son 5s; se concede 7s como en el original.
    await expect
      .poll(async () => {
        const state = await stillSkeleton();
        return state.loading || state.pulses > 3;
      }, { timeout: 7_000, message: "el skeleton de Projects sigue vivo tras 7s" })
      .toBe(false);

    test.info().annotations.push({ type: "diagnostics", description: JSON.stringify(await stillSkeleton()) });
  });

  test("skeleton resuelve aunque Projects nunca entre en el viewport", async ({ page }) => {
    // verify2.mjs check 6/9: el timer vivia dentro del effect gateado por
    // shouldFetch, asi que sin IntersectionObserver el loading se quedaba true.
    await openApp(page);
    await expect(page.locator("#projects .animate-pulse").first()).toBeAttached();

    // No hay scroll en todo el test a proposito.
    await expect
      .poll(
        () => page.evaluate(() => document.querySelectorAll("#projects .animate-pulse").length),
        { timeout: 7_000, message: "el skeleton sigue vivo sin que Projects entre en el viewport" },
      )
      .toBeLessThanOrEqual(3);

    // Diagnostico del original: scrollY y si la seccion llego a verse.
    const state = await page.evaluate(() => {
      const section = document.querySelector("#projects") as HTMLElement;
      return {
        scrollY: window.scrollY,
        projectsInView: section.getBoundingClientRect().top < window.innerHeight + 300,
        cards: document.querySelectorAll(".proj-card").length,
      };
    });
    expect(state.scrollY, "el test no deberia haber hecho scroll").toBe(0);
    test.info().annotations.push({ type: "diagnostics", description: JSON.stringify(state) });
  });
});

test.describe("GitHub: carga normal", () => {
  test.use({ github: { mode: "ok", cache: "clear" } });

  test("la cache se puebla desde la respuesta de la API", async ({ page, githubRequests }) => {
    // Cubierta nueva, no un check del original: sin ella, el resto de la suite
    // podria pasar con un mock mal cableado que nunca llegara a la app.
    await openApp(page);
    await scrollThroughPage(page);
    await expectElementsExist(page, ".proj-card");

    expect(githubRequests.length, "la app nunca llamo a api.github.com").toBeGreaterThan(0);
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const raw = localStorage.getItem("gh-repos-cache");
            if (!raw) return 0;
            const parsed = JSON.parse(raw) as { data: unknown[] };
            return Array.isArray(parsed.data) ? parsed.data.length : 0;
          }),
        { message: "la cache de repos nunca se escribio" },
      )
      .toBeGreaterThan(0);
  });
});
