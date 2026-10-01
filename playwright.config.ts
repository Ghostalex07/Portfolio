import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "@playwright/test";

/**
 * Config de la suite. Ejecutar siempre desde la raiz del repo (`npm test`), que
 * es donde resuelven las rutas absolutas de abajo.
 */
const repoRoot = process.cwd();
const testsDir = join(repoRoot, "tests");

/**
 * Puerto 4174 a proposito: 4173 lo usan otras cosas del entorno y la suite no
 * debe pelearse por el. El ciclo de vida del servidor lo lleva el bloque
 * `webServer`, que lo levanta, espera a que responda y lo baja al terminar
 * (tambien si la suite falla).
 */
const HOST = process.env.TEST_HOST ?? "127.0.0.1";
const PORT = Number(process.env.TEST_PORT ?? 4174);
const baseURL = `http://${HOST}:${PORT}`;

if (!existsSync(join(testsDir, "support", "serve.mjs"))) {
  throw new Error(
    `No se encuentra tests/support/serve.mjs. Lanza la suite desde la raiz del repo (cwd=${repoRoot}).`,
  );
}

export default defineConfig({
  testDir: testsDir,
  testMatch: /.*\.spec\.ts$/,
  testIgnore: /support\/.*/,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  // Los checks originales esperaban a los reveals de GSAP, al timeout de 5s del
  // skeleton y al ciclo completo del menu movil. 30s da margen sin convertir
  // una regresion real en un timeout opaco.
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    // Viewport por defecto = el de los scripts CDP (1440x900). Los specs moviles
    // lo sobreescriben con test.use({ viewport }).
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    // tests/support/serve.mjs reconstruye dist/ si las fuentes han cambiado y lo
    // sirve con Cache-Control: no-store. reuseExistingServer reutiliza un
    // servidor ya levantado en local en lugar de pelear por el puerto.
    command: `node ${join(testsDir, "support", "serve.mjs")}`,
    cwd: repoRoot,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
