import { allAtLeast, contrastRatio, readThemeTokens } from "./support/contrast";
import { expect, openApp, test } from "./support/harness";
import { expectElementsExist, scrollThroughPage } from "./support/reveal";

/**
 * Tokens de @theme (src/index.css) y las superficies que emiten.
 *
 * Los tokens se leen del :root computado, no del fuente: Tailwind v4 solo emite
 * las utilidades que se usan, asi que grepear src/ probaria el fuente y no el
 * bundle que se despliega.
 */

test.describe("Contraste de los tokens de color", () => {
  test("text-muted es un color opaco (no rgba)", async ({ page }) => {
    // verify.mjs check 8/12
    await openApp(page);
    const muted = page.locator(".text-text-muted").first();
    await expect(muted).toBeAttached();

    const computed = await muted.evaluate((element) => getComputedStyle(element).color);
    expect(computed, "el color computado no es opaco").not.toMatch(/rgba/);
  });

  test("text-muted pasa WCAG AA (>= 4.5:1)", async ({ page }) => {
    // verify.mjs check 9/12
    await openApp(page);
    const tokens = await readThemeTokens(page);

    const ratio = contrastRatio(tokens["text-muted"], tokens.surface);
    expect(ratio, `fg=${tokens["text-muted"]} bg=${tokens.surface}`).not.toBeNull();
    expect(ratio!, `${JSON.stringify(tokens)}`).toBeGreaterThanOrEqual(4.5);
  });

  test("text-primary/secondary/muted pasan AA en los 3 fondos", async ({ page }) => {
    // verify2.mjs check 1/9
    await openApp(page);
    const tokens = await readThemeTokens(page);
    const surfaces = [tokens.surface, tokens["surface-raised"], tokens["surface-2"]];
    const measured = (foreground: string) => surfaces.map((background) => contrastRatio(foreground, background));

    const ratios = {
      "text-primary": measured(tokens["text-primary"]),
      "text-secondary": measured(tokens["text-secondary"]),
      "text-muted": measured(tokens["text-muted"]),
    };
    const report = `${JSON.stringify(ratios)} tokens=${JSON.stringify(tokens)}`;

    expect(allAtLeast(ratios["text-primary"], 4.5), `text-primary: ${report}`).toBe(true);
    expect(allAtLeast(ratios["text-secondary"], 4.5), `text-secondary: ${report}`).toBe(true);
    expect(allAtLeast(ratios["text-muted"], 4.5), `text-muted: ${report}`).toBe(true);
  });

  test("accent pasa AA (3:1 para texto grande/UI)", async ({ page }) => {
    // verify2.mjs check 2/9
    await openApp(page);
    const tokens = await readThemeTokens(page);
    const surfaces = [tokens.surface, tokens["surface-raised"], tokens["surface-2"]];

    const ratios = surfaces.map((background) => contrastRatio(tokens.accent, background));
    expect(allAtLeast(ratios, 4.5), `accent=${tokens.accent} ratios=${JSON.stringify(ratios)}`).toBe(true);
  });

  test("accent-soft sobre accent-muted pasa AA", async ({ page }) => {
    // verify2.mjs check 3/9
    // Ojo: el nombre del check historico dice "accent-muted", pero el ratio que
    // se midio siempre fue accent-soft contra --color-surface-raised (los pills
    // de topics viven sobre surface-raised, no sobre accent-muted). Se conserva
    // la medida original.
    await openApp(page);
    const tokens = await readThemeTokens(page);

    const ratio = contrastRatio(tokens["accent-soft"], tokens["surface-raised"]);
    expect(ratio, `fg=${tokens["accent-soft"]} bg=${tokens["surface-raised"]}`).not.toBeNull();
    expect(ratio!, `tokens=${JSON.stringify(tokens)}`).toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("Superficies y radios", () => {
  test("una sola superficie de tarjeta (rounded-card) y cero rounded-2xl/xl", async ({ page }) => {
    // verify.mjs check 10/12
    await openApp(page);
    await scrollThroughPage(page);
    await expectElementsExist(page, ".proj-card");

    const surfaces = await page.evaluate(() => {
      // Solo las superficies que siguen siendo cajas. Las certificaciones "rest"
      // son filas con border-b, sin radio por diseno.
      const boxes = Array.from(document.querySelectorAll(".proj-card, .cert-reveal"));
      const withBackground = boxes.filter(
        (box) => getComputedStyle(box).backgroundColor !== "rgba(0, 0, 0, 0)",
      );
      return {
        radii: Array.from(new Set(withBackground.map((box) => getComputedStyle(box).borderRadius))),
        boxes: withBackground.length,
        total: boxes.length,
        legacy: document.querySelectorAll('[class*="rounded-2xl"],[class*="rounded-xl"]').length,
      };
    });

    expect(surfaces.total, "no hay superficies que medir").toBeGreaterThan(0);
    expect(surfaces.boxes, `ninguna caja con fondo: ${JSON.stringify(surfaces)}`).toBeGreaterThan(0);
    expect(surfaces.radii, `radios inconsistentes: ${JSON.stringify(surfaces)}`).toEqual(["12px"]);
    expect(surfaces.legacy, `utilidades rounded-2xl/xl vivas: ${JSON.stringify(surfaces)}`).toBe(0);
  });

  test("el contorno de foco sigue el radio de la pildora (sin 2px)", async ({ page }) => {
    // verify2.mjs check 8/9
    await openApp(page);
    const pill = page.locator('a[href="#projects"].rounded-pill').first();
    await expect(pill).toBeAttached();
    await pill.evaluate((element) => element.focus());

    const outline = await pill.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        outlineRadius: style.borderRadius,
        outlineWidth: style.outlineWidth,
        outlineStyle: style.outlineStyle,
      };
    });

    expect(outline.outlineRadius, "el radio del contorno se ha desvisto del elemento").not.toBe("2px");
  });
});
