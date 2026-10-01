import { expect, openApp, test } from "./support/harness";
import { scrollThroughPage } from "./support/reveal";

/**
 * Limpieza de consola.
 *
 * El script original acumulaba Runtime.exceptionThrown y Log.entryAdded(level:
 * error) durante toda su sesion y hacia una unica comprobacion al final. Aqui la
 * fixture `consoleErrors` acumula lo mismo durante todo el test, y cada test
 * recorre un journey completo antes de comprobar que la lista sigue vacia.
 */

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.describe("Consola sin errores", () => {
  test("sin excepciones en consola", async ({ page, consoleErrors }) => {
    // verify.mjs check 12/12
    await openApp(page);
    await scrollThroughPage(page);

    // Journey movil: el menu es la parte de la app con mas estado y handlers.
    await page.setViewportSize(MOBILE);
    await page.reload();
    await page.locator('button[aria-controls="mobile-menu"]').click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.locator("#mobile-menu a").first().focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);

    // Vuelta a escritorio con los datos ya en cache: segunda pasada de reveals.
    await page.setViewportSize(DESKTOP);
    await page.reload();
    await scrollThroughPage(page);

    expect(consoleErrors, "la pagina ha registrado errores en consola").toEqual([]);
  });
});

test.describe("Consola sin errores con cache corrupta", () => {
  test.use({ github: { mode: "ok", cache: "corrupt" } });

  test("sin excepciones en consola recuperandose de la cache corrupta", async ({
    page,
    consoleErrors,
  }) => {
    // Mismo check (12/12) sobre la ruta de recuperacion: readCache() descarta
    // el elemento invalido y la pagina monta sin que el ErrorBoundary salte.
    await openApp(page);
    await scrollThroughPage(page);

    expect(consoleErrors, "la pagina ha registrado errores en consola").toEqual([]);
  });
});
