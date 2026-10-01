import { expect, openApp, test } from "./support/harness";

/**
 * Accesibilidad del menu movil.
 *
 * Viewport movil obligatorio: por encima de md el menu esta display:none.
 *
 * A diferencia de los scripts CDP, que despachaban KeyboardEvent sinteticos,
 * aqui se usan pulsaciones reales (keyboard.press) para que el comportamiento
 * que se comprueba sea el del navegador: foco nativo moviendose y
 * preventDefault cancelando ese movimiento.
 */
test.describe("Menu movil", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const toggle = 'button[aria-controls="mobile-menu"]';

  test("focus trap: el foco no escapa del menu movil", async ({ page }) => {
    // verify.mjs check 6/12 (bug 5)
    await openApp(page);

    await page.locator(toggle).click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();

    const focusables = await menu.locator("a").count();
    expect(focusables, "el menu movil deberia tener enlaces").toBeGreaterThan(0);

    // El menu tiene 5 enlaces de navegacion + 3 sociales: 15 pulsaciones dan
    // varias vueltas completas, igual que el bucle del script original.
    await menu.locator("a").first().focus();
    const focusedLabels = await page.evaluate(() =>
      Array.from(document.querySelectorAll("#mobile-menu a")).map((link) => link.textContent?.trim() ?? ""),
    );
    const insideMenu = () =>
      page.evaluate(() => Boolean(document.querySelector("#mobile-menu")?.contains(document.activeElement)));

    expect(await insideMenu(), "el foco inicial deberia estar dentro del menu").toBe(true);

    const visited = new Set<string>();
    let escapedAt: number | null = null;
    for (let press = 1; press <= 15; press++) {
      await page.keyboard.press("Tab");
      if (!(await insideMenu())) {
        escapedAt = press;
        break;
      }
      const label = await page.evaluate(
        () => (document.activeElement as HTMLElement | null)?.textContent?.trim().slice(0, 40) ?? "",
      );
      visited.add(label);
    }

    const landed = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      return {
        tag: active?.tagName ?? null,
        text: active?.textContent?.trim().slice(0, 40) ?? null,
        ariaControls: active?.getAttribute("aria-controls"),
      };
    });

    expect(
      escapedAt,
      `el foco salio de #mobile-menu en la pulsacion ${escapedAt ?? "?"}; termino en ${JSON.stringify(landed)}`,
    ).toBeNull();
    // Anti-pase-en-vacio: si el foco se quedara clavado en el primer enlace
    // (por ejemplo si el handler del preventDefault se disparara siempre), el
    // check de arriba pasaria sin que Tab hubiera movido nada nunca.
    expect(
      visited.size,
      `el foco no se movio entre los ${focusedLabels.length} enlaces del menu: ${JSON.stringify([...visited])}`,
    ).toBeGreaterThan(1);
  });

  test("Escape devuelve el foco al boton toggle", async ({ page }) => {
    // verify.mjs check 7/12 (bug 5)
    await openApp(page);

    await page.locator(toggle).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();

    await page.keyboard.press("Escape");

    // El overlay se desmonta tras la animacion de salida de AnimatePresence;
    // esperar el desmontaje evita leer el foco en pleno medio del cierre.
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await expect(page.locator(toggle)).toHaveAttribute("aria-expanded", "false");

    const active = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement | null;
      return { tag: element?.tagName ?? null, controls: element?.getAttribute("aria-controls") };
    });

    expect(active, "el foco deberia volver al boton del toggle").toEqual({
      tag: "BUTTON",
      controls: "mobile-menu",
    });
  });

  test("el menu movil abre y cierra con el boton toggle", async ({ page }) => {
    // Cobertura de contexto del fixture: si el boton no abre el menu, los dos
    // checks de foco de arriba no estarian midiendo nada.
    await openApp(page);

    const toggleButton = page.locator(toggle);
    await expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    await toggleButton.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await expect(toggleButton).toHaveAttribute("aria-expanded", "true");

    await page.locator("#mobile-menu a[href='#projects']").click();
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    await expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });
});
