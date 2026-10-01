#!/usr/bin/env node
/**
 * Servidor estatico para la suite de Playwright.
 *
 * Hace dos cosas, en este orden:
 *   1. `npm run build` si dist/ esta ausente o desactualizado respecto a las
 *      fuentes (los specs se ejecutan contra el build de produccion, no contra
 *      el dev server: es lo que se despliega a GitHub Pages).
 *   2. Sirve dist/ con Cache-Control: no-store para que una suite repetida
 *      nunca lea un bundle cacheado del run anterior.
 *
 * Playwright mantiene el ciclo de vida de este proceso via `webServer`, asi que
 * no hay ningun servidor que lanzar a mano ni puerto que limpiar.
 *
 * Variables de entorno:
 *   TEST_HOST  (default 127.0.0.1)
 *   TEST_PORT  (default 4174)
 */
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIST = join(ROOT, "dist");
const HOST = process.env.TEST_HOST ?? "127.0.0.1";
const PORT = Number(process.env.TEST_PORT ?? 4174);

/** Cualquier cambio aqui obliga a reconstruir antes de testear. */
const BUILD_INPUTS = ["src", "index.html", "vite.config.ts", "package.json"];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

/** mtime mas reciente del arbol `path` (archivo o directorio). */
function newestMtime(path) {
  const stats = statSync(path);
  let newest = stats.mtimeMs;
  if (!stats.isDirectory()) return newest;
  for (const entry of readdirSync(path)) {
    newest = Math.max(newest, newestMtime(join(path, entry)));
  }
  return newest;
}

function distIsStale() {
  const builtIndex = join(DIST, "index.html");
  if (!existsSync(builtIndex)) return true;
  const builtAt = statSync(builtIndex).mtimeMs;
  return BUILD_INPUTS.some((input) => {
    const path = join(ROOT, input);
    return existsSync(path) && newestMtime(path) > builtAt;
  });
}

if (distIsStale()) {
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  console.log(`[serve] dist/ ausente o desactualizado -> npm run build (${HOST}:${PORT})`);
  const build = spawnSync(npm, ["run", "build"], { cwd: ROOT, stdio: "inherit" });
  if (build.status !== 0) {
    console.error("[serve] npm run build fallo: no se puede servir dist/");
    process.exit(build.status ?? 1);
  }
} else {
  console.log(`[serve] dist/ al dia -> sirviendo sin reconstruir (${HOST}:${PORT})`);
}

/** Resuelve una URL contra dist/ y rechaza cualquier escape del directorio. */
function resolveInDist(pathname) {
  const decoded = decodeURIComponent(pathname);
  const target = resolve(DIST, `.${decoded.startsWith("/") ? decoded : `/${decoded}`}`);
  if (target !== DIST && !target.startsWith(DIST + sep)) return null;
  return target;
}

function statOrNull(path) {
  return existsSync(path) ? statSync(path) : null;
}

function send(res, status, body, type) {
  res.writeHead(status, {
    "content-type": type,
    "content-length": body.length,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  res.end(body);
}

function sendFile(res, path) {
  send(res, 200, readFileSync(path), MIME[extname(path).toLowerCase()] ?? "application/octet-stream");
}

function sendNotFound(res) {
  const custom = join(DIST, "404.html");
  if (existsSync(custom)) {
    send(res, 404, readFileSync(custom), MIME[".html"]);
    return;
  }
  send(res, 404, Buffer.from("404"), MIME[".txt"]);
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? `${HOST}:${PORT}`}`);
  const target = resolveInDist(url.pathname);
  if (target === null) {
    sendNotFound(res);
    return;
  }

  const direct = statOrNull(target);
  if (direct?.isFile()) {
    sendFile(res, target);
    return;
  }
  if (direct?.isDirectory()) {
    const index = join(target, "index.html");
    if (statOrNull(index)?.isFile()) {
      sendFile(res, index);
      return;
    }
    sendNotFound(res);
    return;
  }

  // /ruta sin extension: GitHub Pages sirve el index.html del directorio.
  const asIndex = statOrNull(join(target, "index.html"));
  if (asIndex?.isFile()) {
    sendFile(res, join(target, "index.html"));
    return;
  }
  sendNotFound(res);
});

server.listen(PORT, HOST, () => {
  console.log(`[serve] escuchando en http://${HOST}:${PORT} (dist=${DIST})`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
