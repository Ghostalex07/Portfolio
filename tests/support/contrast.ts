/**
 * Aritmetica de contraste WCAG 2.x, misma formula que usaban los scripts CDP.
 * Se ejecuta en Node sobre los tokens leidos del :root, para que el fallo
 * muestre el ratio exacto y no un boolean opaco.
 */

/** Luminancia relativa de un color hex de 3 o 6 digitos. null si no es parseable. */
export function relativeLuminance(hex: string): number | null {
  const raw = hex.replace("#", "").trim();
  const channels = raw.length === 3 ? raw.split("").map((c) => c + c) : raw.match(/../g);
  if (!channels || channels.length < 3) return null;
  const [r, g, b] = channels
    .slice(0, 3)
    .map((part) => parseInt(part, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Ratio de contraste redondeado a dos decimales, o null si algum color no parsea. */
export function contrastRatio(foreground: string, background: string): number | null {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  if (l1 === null || l2 === null) return null;
  const [high, low] = l1 > l2 ? [l1, l2] : [l2, l1];
  return Math.round(((high + 0.05) / (low + 0.05)) * 100) / 100;
}

/** `true` si todos los ratios cumplen el minimo (AA). */
export function allAtLeast(ratios: Array<number | null>, min: number): boolean {
  return ratios.every((ratio) => ratio !== null && ratio >= min);
}

/** Lee los tokens de color de @theme desde el :root ya computado. */
export async function readThemeTokens(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const token = (name: string) => style.getPropertyValue(name).trim();
    return {
      "surface": token("--color-surface"),
      "surface-raised": token("--color-surface-raised"),
      "surface-2": token("--color-surface-2"),
      "surface-border": token("--color-surface-border"),
      "accent": token("--color-accent"),
      "accent-soft": token("--color-accent-soft"),
      "accent-muted": token("--color-accent-muted"),
      "text-primary": token("--color-text-primary"),
      "text-secondary": token("--color-text-secondary"),
      "text-muted": token("--color-text-muted"),
    };
  });
}
