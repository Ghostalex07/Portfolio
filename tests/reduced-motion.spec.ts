import { expect, openApp, test } from "./support/harness";
import { expectElementsExist, waitForFullyRevealed } from "./support/reveal";

/**
 * prefers-reduced-motion: reduce.
 *
 * Con la opcion activa la app tiene que desactivar los loops infinitos
 * (animate-ping, animate-pulse) y no esconder contenido con reveals que nunca
 * se animan.
 */
test.describe("prefers-reduced-motion", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("animate-ping neutralizado con prefers-reduced-motion", async ({ page }) => {
    // verify2.mjs check 7/9
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openApp(page);

    const ping = page.locator(".animate-ping").first();
    await expect(ping).toBeAttached();

    const animation = await ping.evaluate((element) => {
      const style = getComputedStyle(element);
      return { duration: style.animationDuration, iterations: style.animationIterationCount };
    });

    const neutralised =
      Number.parseFloat(animation.duration) < 0.01 || animation.iterations === "1";
    expect(neutralised, `animation=${JSON.stringify(animation)}`).toBe(true);
  });

  test("con reduced-motion nada queda en opacity 0", async ({ page }) => {
    // verify2.mjs check 9/9: los reveals de GSAP se saltan con reduce, asi que
    // los elementos tienen que quedarse en su opacity natural.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openApp(page);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator("#certs").scrollIntoViewIfNeeded();

    await expectElementsExist(page, ".cert-reveal");
    const stats = await waitForFullyRevealed(page, "", ".cert-reveal");

    expect(stats.total, "no hay .cert-reveal en el DOM").toBeGreaterThan(0);
    expect(stats.hidden).toBe(0);
  });
});
