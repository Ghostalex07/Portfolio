import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Helpers de medicion para los reveals de GSAP.
 *
 * Los scripts CDP midian con un sleep fijo y luego comparaban. Aqui se usa
 * expect.poll con el mismo umbral (opacity >= 0.9), que es la misma garantia
 * pero sin depender de que el tween haya acabado justo en el milisegundo N.
 */
export interface RevealStats {
  /** Elementos que coinciden con el selector. */
  total: number;
  /** Cuantos siguen por debajo de 0.9 de opacity. */
  hidden: number;
}

/** Mide cuantos elementos del selector siguen ocultos. */
export async function measureReveal(page: Page, root: string, selector: string): Promise<RevealStats> {
  return page.evaluate(
    ({ root: rootSelector, selector: target }) => {
      const scope = rootSelector ? document.querySelector(rootSelector) : document;
      const elements = scope ? Array.from(scope.querySelectorAll(target)) : [];
      return {
        total: elements.length,
        hidden: elements.filter((element) => Number(getComputedStyle(element).opacity) < 0.9).length,
      };
    },
    { root, selector },
  );
}

/**
 * Espera a que todos los elementos del selector sean visibles y devuelve el
 * recuento. Falla si algun elemento sigue oculto tras `timeout`.
 */
export async function waitForFullyRevealed(
  page: Page,
  root: string,
  selector: string,
  timeout = 10_000,
): Promise<RevealStats> {
  let stats: RevealStats = { total: 0, hidden: 0 };
  await expect
    .poll(
      async () => {
        stats = await measureReveal(page, root, selector);
        return stats.hidden;
      },
      {
        timeout,
        message: `elementos ${selector}${root ? ` dentro de ${root}` : ""} nunca salieron de opacity < 0.9`,
      },
    )
    .toBe(0);
  return stats;
}

/**
 * Espera a que exista al menos un elemento que medir. Sin esto un selector que
 * no renderiza nada daria 0/0 y el check pasaria en vacio.
 */
export async function expectElementsExist(page: Page, selector: string, timeout = 10_000) {
  await expect(page.locator(selector).first()).toBeAttached({ timeout });
}

/** Recorre la pagina de arriba abajo, como hacia el script CDP. */
export async function scrollThroughPage(page: Page, step = 600, dwell = 120, settle = 2_000) {
  await page.evaluate(
    async ({ step: pixels, dwell: wait, settle: rest }) => {
      for (let y = 0; y < document.body.scrollHeight; y += pixels) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
      await new Promise((resolve) => setTimeout(resolve, rest));
    },
    { step, dwell, settle },
  );
}
