DESORA — exact brand artwork drop-in
====================================

Save your real logo files into THIS folder (public/brand/) with these exact
names. The site detects them at build time and uses them everywhere
automatically — header, footer, preloader, favicon, and the pattern texture.
No code changes needed. Until a file is present, a tasteful recreation is used
so nothing ever looks broken.

FILES (use the names on the left; SVG preferred, PNG works):

  wordmark.svg   (or wordmark.png)
      The "DESORA" wordmark.
      → Export with a TRANSPARENT background and the letters as a single colour
        (any colour is fine — the site re-tints it: crimson in light mode,
        pearl in dark mode). A transparent SVG is ideal (crisp at any size).
      → If your wordmark is multi-colour or you don't want re-tinting, also add
        wordmark-dark.svg/png (a pearl/cream version) and both are used as-is.

  icon.svg       (or icon.png)
      The "ds" monogram. Transparent is best (re-tinted like the wordmark).
      Used as the favicon fallback and can be reused elsewhere.

  favicon.png    (optional)
      A dedicated favicon if you want one — the crimson-square monogram is
      perfect here (background is fine for favicons). If omitted, icon.* is used.

  pattern.png    (or pattern.svg)
      The scattered-letterform pattern tile.
      → Crimson glyphs on a WHITE or TRANSPARENT background works best; the site
        blends it (multiply) so white drops out and only the glyphs show, at low
        opacity, in the hero / final CTA / footer.

After adding files:
  - Dev server: they appear on the next page reload.
  - Production: run  npm run build  again.

Tip: to get the images out of the chat onto disk, right-click each attached
image → "Save image as…" → into this folder, then rename to match above.
