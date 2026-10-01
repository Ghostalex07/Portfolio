import { expect, openApp, test } from "./support/harness";
import {
  expectElementsExist,
  scrollThroughPage,
  waitForFullyRevealed,
} from "./support/reveal";

/**
 * Regressiones de GSAP: los ScrollTrigger de una seccion se mataban entre si y
 * dejaban contenido en opacity 0 para siempre (bugs 1-4 del fix anterior).
 *
 * Cada check corresponde a uno de los scripts CDP /tmp/opencode/verify.mjs.
 */

/** Seccion y selector de sus elementos animables, tal como los usa el original. */
const REVEALED_SECTIONS = [
  { id: "about", selector: ".about-reveal" },
  { id: "experience", selector: ".exp-item" },
  { id: "skills", selector: ".skill-cat" },
  { id: "projects", selector: ".proj-card" },
  { id: "certs", selector: ".cert-reveal" },
] as const;

test.describe("Reveals de GSAP", () => {
  test("hero-line presentes en DOM", async ({ page }) => {
    // verify.mjs check 1/12
    await openApp(page);
    await expect(page.locator(".hero-line")).toHaveCount(2);
  });

  test("cert-reveal visibles tras scroll (opacity >= 0.9)", async ({ page }) => {
    // verify.mjs check 2/12
    await openApp(page);
    await page.locator("#certs").scrollIntoViewIfNeeded();

    await expectElementsExist(page, ".cert-reveal");
    const stats = await waitForFullyRevealed(page, "", ".cert-reveal");

    expect(stats.total, "no hay .cert-reveal en el DOM").toBeGreaterThan(0);
    expect(stats.hidden).toBe(0);
  });

  test("hero timeline corrio (hero-line sin translateY residual)", async ({ page }) => {
    // verify.mjs check 3/12
    await openApp(page);
    // El original visitaba Certs y volvia arriba; se conserva el viaje de ida
    // y vuelta porque ademas fuerza un refresh de ScrollTrigger.
    await page.locator("#certs").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2_200);

    const transforms = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".hero-line")).map(
        (element) => (element as HTMLElement).style.transform || getComputedStyle(element).transform,
      ),
    );

    // Predicado verbatim de verify.mjs: un matrix con un digito 1-9 significa
    // que el tween sigue a mitad de camino.
    const stillMoving = transforms.filter(
      (transform) => /matrix.*[1-9]/.test(transform) && transform !== "none",
    );

    expect(stillMoving, `transform residual en .hero-line: ${JSON.stringify(transforms)}`).toEqual([]);
    expect(transforms, "no hay .hero-line que medir").toHaveLength(2);
  });

  test("ninguna seccion deja elementos en opacity 0", async ({ page }) => {
    // verify.mjs check 4/12: los triggers de Certs no fueron matados por el
    // rerun de Projects (y viceversa).
    await openApp(page);

    const measured: Record<string, { n: number; hidden: number }> = {};
    for (const { id, selector } of REVEALED_SECTIONS) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      // Primero que existan elementos: un 0/0 daria un pase en vacio.
      await expectElementsExist(page, selector);
      const stats = await waitForFullyRevealed(page, "", selector);
      measured[id] = { n: stats.total, hidden: stats.hidden };
    }

    const stuck = Object.entries(measured)
      .filter(([, stats]) => stats.n > 0 && stats.hidden > 0)
      .map(([id, stats]) => `${id}: ${stats.hidden}/${stats.n} ocultos`);

    expect(stuck, JSON.stringify(measured)).toEqual([]);
  });

  test("rejilla de projects presente", async ({ page }) => {
    // verify.mjs check 11/12
    await openApp(page);
    await scrollThroughPage(page);
    await expectElementsExist(page, ".proj-card");

    const layout = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".proj-card")).map((card) => {
        const parent = card.parentElement as HTMLElement;
        return {
          cols: getComputedStyle(parent).gridTemplateColumns.split(" ").length,
          group: parent.className.includes("gap-4") ? "others" : "featured",
        };
      }),
    );

    // El original solo exigia que hubiera tarjetas y reportaba las columnas.
    test.info().annotations.push({ type: "grid", description: JSON.stringify(layout) });
    expect(layout.length, `sin tarjetas: ${JSON.stringify(layout)}`).toBeGreaterThan(0);
  });
});
