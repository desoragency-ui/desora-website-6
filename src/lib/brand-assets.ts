import fs from 'node:fs';
import path from 'node:path';

/**
 * Build-time detection of the real DESORA brand artwork.
 *
 * Drop the exact files into `public/brand/` and they are used automatically
 * across the whole site (header, footer, preloader, favicon, pattern). Until
 * then, tasteful recreations are used so the design never looks broken.
 *
 * Recommended exports (transparent background is important for the wordmark
 * and icon so they can be tinted crimson in light mode / pearl in dark mode):
 *   public/brand/wordmark.svg   → the DESORA wordmark, shapes on transparent
 *   public/brand/icon.svg       → the "ds" monogram (transparent for tinting;
 *                                  or the crimson-square version for the favicon)
 *   public/brand/favicon.png    → optional dedicated favicon (crimson square ok)
 *   public/brand/pattern.png    → the scattered-letterform pattern
 */
function firstExisting(candidates: string[]): string | null {
  for (const rel of candidates) {
    try {
      if (fs.existsSync(path.join(process.cwd(), 'public', rel))) return '/' + rel;
    } catch {
      /* ignore */
    }
  }
  return null;
}

/** Wordmark, tintable (transparent). Optional pre-coloured dark variant. */
export const brandWordmark = firstExisting(['brand/wordmark.svg', 'brand/wordmark.png']);
export const brandWordmarkDark = firstExisting(['brand/wordmark-dark.svg', 'brand/wordmark-dark.png']);

/** "ds" monogram, tintable (transparent). */
export const brandIcon = firstExisting(['brand/icon.svg', 'brand/icon.png']);

/** Favicon (any format; a crimson-background square is fine here). */
export const brandFavicon = firstExisting([
  'brand/favicon.svg',
  'brand/favicon.png',
  'brand/icon.svg',
  'brand/icon.png',
]);

/** Scattered-letterform pattern tile. */
export const brandPattern = firstExisting(['brand/pattern.svg', 'brand/pattern.png']);

/** True when the wordmark asset can be tinted per-theme via CSS mask (SVG or transparent PNG). */
export const wordmarkTintable = Boolean(brandWordmark);
