import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The house easing curve. One curve everywhere: a fast, confident start that
 * settles without bouncing. Bounce reads as playful; this reads as expensive. */
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_ARR = [0.16, 1, 0.3, 1] as const;
gsap.registerEase('desora', (p) => gsap.parseEase('power3.out')(p));

/** Smooth scroll: REMOVED.
 *
 *  Lenis interpolates the viewport toward the real scroll position, so the page
 *  always trails the input by design. Retuning the lerp only shortened the lag,
 *  it could not remove it. Native scrolling is instant and is handled by the
 *  compositor rather than a JS rAF loop, so it also frees a frame's worth of
 *  work for everything else on the page.
 */
export const lenis: undefined = undefined;

/** Generic scroll-reveal system: add data-reveal (single element) or
 * data-reveal-group (staggers direct children) instead of writing bespoke
 * ScrollTrigger code in every page/component.
 *
 * data-reveal="chars" splits a heading into characters for a fine-grained
 * cascade; the default is a soft rise. */
function initReveals() {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  items.forEach((el) => {
    if (reduceMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    if (el.dataset.reveal === 'lines') {
      try {
        const split = new SplitText(el, { type: 'lines', linesClass: 'reveal-line' });
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          split.lines,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
        return;
      } catch {
        /* fall through to the plain reveal below */
      }
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });

  const groups = gsap.utils.toArray<HTMLElement>('[data-reveal-group]');
  groups.forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    if (reduceMotion) {
      gsap.set(children, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      children,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
      }
    );
  });
}

/** Hairline rules draw themselves in from the leading edge, like a ruled line
 * on paper. RTL-aware via transform-origin. */
function initHairlines() {
  if (reduceMotion) return;
  const isRtl = document.documentElement.dir === 'rtl';
  gsap.utils.toArray<HTMLElement>('[data-hairline-draw]').forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.4,
        ease: 'power3.out',
        transformOrigin: isRtl ? 'right center' : 'left center',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      }
    );
  });
}

/** Numerals count up when their band scrolls into view. Parses the leading
 * number out of strings like "+217,6%", "1,1s", "MAD 280 000" and animates to
 * it, preserving prefix/suffix and the original decimal separator. */
function initCounters() {
  const els = gsap.utils.toArray<HTMLElement>('[data-countup]');
  if (!els.length) return;

  els.forEach((el) => {
    const raw = el.textContent?.trim() ?? '';
    // Leading non-numeric prefix, the number itself, then the rest.
    const m = raw.match(/^([^\d-]*)(-?[\d][\d\s.,]*)(.*)$/s);
    if (!m) return;

    const [, prefix, numStr, suffix] = m;
    const usesComma = /,\d/.test(numStr);
    const normalized = numStr.replace(/\s/g, '').replace(/\.(?=\d{3}\b)/g, '');
    const target = parseFloat(usesComma ? normalized.replace(',', '.') : normalized);
    if (!isFinite(target)) return;

    const decimals = (() => {
      const dm = normalized.match(/[.,](\d+)$/);
      return dm ? dm[1].length : 0;
    })();
    const grouped = /[\s.]\d{3}\b/.test(numStr);

    const render = (v: number) => {
      let s = v.toFixed(decimals);
      if (usesComma) s = s.replace('.', ',');
      if (grouped) {
        const [int, dec] = s.split(usesComma ? ',' : '.');
        const spaced = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        s = dec ? `${spaced}${usesComma ? ',' : '.'}${dec}` : spaced;
      }
      el.textContent = `${prefix}${s}${suffix}`;
    };

    if (reduceMotion) return; // leave the final value as authored

    const state = { v: 0 };
    render(0);
    gsap.to(state, {
      v: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => render(state.v),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/** Art-directed photography (Figure.astro).
 *
 * Two moves, both transform/clip only so they stay on the compositor:
 *  - a curtain wipe: the frame opens from the bottom while the image settles
 *    out of a slight over-scale. Reads like a print being revealed, not a
 *    div fading in.
 *  - optional scrubbed parallax (`data-parallax="8"`), so large bands drift
 *    slower than the page and the layout gains depth.
 *
 * Atmospheric figures also warm from cool to full grade on entry.
 */
function initFigures() {
  const figures = gsap.utils.toArray<HTMLElement>('[data-figure]');

  figures.forEach((fig) => {
    const media = fig.querySelector<HTMLElement>('.figure-media');

    if (reduceMotion) {
      fig.classList.add('is-warm');
      return;
    }

    gsap.fromTo(
      fig,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.25,
        ease: 'power3.out',
        scrollTrigger: { trigger: fig, start: 'top 88%', once: true },
      }
    );

    // Ken-burns figures run a CSS transform animation on the media, which would
    // override (and fight) a GSAP scale tween on the same element. Those get the
    // clip wipe only; the drift is their entrance.
    if (media && !fig.classList.contains('figure--kenburns')) {
      gsap.fromTo(
        media,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: fig, start: 'top 88%', once: true },
        }
      );
    }

    // Atmospheric grade warms once the frame is open.
    ScrollTrigger.create({
      trigger: fig,
      start: 'top 85%',
      once: true,
      onEnter: () => fig.classList.add('is-warm'),
    });
  });

  // Parallax drift. Applied to the frame (not the media) so it never fights
  // the ken-burns scale animation running on the image itself.
  if (!reduceMotion) {
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const depth = parseFloat(el.dataset.parallax || '8');
      if (!isFinite(depth) || depth === 0) return;
      gsap.fromTo(
        el,
        { yPercent: -depth },
        {
          yPercent: depth,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        }
      );
    });
  }
}

/** Smooth-scrolls to in-page anchors (blog TOC, "scroll to services" etc.)
 * through Lenis so it stays consistent with the rest of the page's scroll feel. */
function initAnchorLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

/** A gold hairline across the very top that fills as the page is read. Drawn
 * with scaleX on a single fixed element, so it costs one composited layer and
 * never triggers layout. RTL flips the origin so it fills from the right. */
/* initScrollProgress: REMOVED for performance (scrubbed scaleX tied to total scroll). */

/** Sections drift up and settle as they enter, a half-beat behind the content
 * revealing inside them. Gives the page a sense of depth while scrolling
 * without any element moving far enough to read as a gimmick. */
/* initSectionDepth: REMOVED for performance (scrubbed y/scale on every section on the page). */

/* ==========================================================================
   Depth and kinetics.

   Everything below is transform/opacity/clip only, so it stays on the
   compositor, and everything is behind `prefers-reduced-motion`. The house
   curve (power3.out, the GSAP twin of cubic-bezier(0.16, 1, 0.3, 1)) is used
   throughout: fast, confident, settles without bouncing.
   ========================================================================== */

const isRtl = () => document.documentElement.dir === 'rtl';

/** Trailing-edge debounce. Rebuilding a marquee or a pinned rail on every
 *  resize event is what makes a page stutter while a window is dragged. */
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}


/** Pinned horizontal rail.
 *
 *  `<section data-hscroll><div data-hscroll-track>…panels…</div></section>`
 *
 *  The section pins and the track travels sideways for exactly its own overflow,
 *  so the last panel lands flush instead of over-running. Direction flips under
 *  RTL. Below the desktop breakpoint the whole mechanism is skipped and the
 *  track falls back to native swipe + scroll-snap, which is both cheaper and
 *  what a thumb expects.
 */
function initHorizontalScroll() {
  // Pinning also needs vertical room. On a short window the panel gets squeezed
  // until the plate is a letterbox, so below 640px tall the rail drops back to
  // the native swipe rather than degrading the card.
  const desktop = window.matchMedia('(min-width: 1024px) and (min-height: 640px)');

  gsap.utils.toArray<HTMLElement>('[data-hscroll]').forEach((section) => {
    const track = section.querySelector<HTMLElement>('[data-hscroll-track]');
    if (!track) return;

    let tween: gsap.core.Tween | undefined;
    let trigger: ScrollTrigger | undefined;

    const build = () => {
      teardown();
      if (reduceMotion || !desktop.matches) {
        section.dataset.hscrollMode = 'native';
        return;
      }
      const distance = track.scrollWidth - section.clientWidth;
      if (distance <= 0) {
        section.dataset.hscrollMode = 'native';
        return;
      }
      section.dataset.hscrollMode = 'pinned';

      tween = gsap.to(track, {
        x: isRtl() ? distance : -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          // Pin for the horizontal distance plus a beat, so the rail doesn't
          // release the instant the last panel arrives.
          end: () => `+=${distance + window.innerHeight * 0.6}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      trigger = tween.scrollTrigger;

      // Each panel lifts as it crosses the middle of the viewport, so the rail
      // has depth instead of reading as one flat strip sliding past.
      gsap.utils.toArray<HTMLElement>('[data-hscroll-panel]', track).forEach((panel) => {
        gsap.fromTo(
          panel,
          { scale: 0.94, opacity: 0.55 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: 'left 88%',
              end: 'left 45%',
              scrub: true,
            },
          }
        );
      });
    };

    const teardown = () => {
      trigger?.kill();
      tween?.kill();
      tween = undefined;
      trigger = undefined;
      gsap.set(track, { x: 0, clearProps: 'transform' });
    };

    build();
    desktop.addEventListener('change', build);
    ScrollTrigger.addEventListener('refreshInit', teardown);
    ScrollTrigger.addEventListener('refresh', build);
  });
}

/** Multi-depth parallax.
 *
 *  `data-depth-layer="-20"` moves against the scroll (recedes),
 *  `data-depth-layer="20"` moves with it (comes forward). Values are percent of
 *  the element's own height, so a value reads the same at any size.
 */
/* initDepthLayers: REMOVED for performance (multi-layer parallax, scrubbed). */

/** Headline reveal: each line climbs out from behind its own clipped box.
 *  Reads like a printed line being pulled off the press, not a div fading in. */
function initMaskReveals() {
  gsap.utils.toArray<HTMLElement>('[data-mask-reveal]').forEach((el) => {
    if (reduceMotion) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    let lines: Element[] = [];
    try {
      // `mask: 'lines'` wraps each line in its own overflow-hidden box, which is
      // what lets a line climb in from fully below without clipping descenders
      // on the line above. Hand-rolling that wrapper is the classic way to get
      // clipped accents on É and ç, which matters in French and never shows up
      // in an English-only test.
      const split = new SplitText(el, { type: 'lines', linesClass: 'mask-line', mask: 'lines' });
      lines = split.lines;
    } catch {
      lines = [];
    }
    gsap.set(el, { opacity: 1 });
    const targets = lines.length ? lines : [el];

    gsap.fromTo(
      targets,
      { yPercent: 116, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.15,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });
}

/** Magnetic pull. The control leans toward the cursor inside its own hit area
 *  and springs back on exit. Deliberately small: a suggestion of attraction,
 *  not a toy that chases the mouse around. */
/* initMagnetic: REMOVED for performance (pointermove tracking on every CTA). */

/** Cards catch the light: a few degrees of tilt plus a specular sheen that
 *  tracks the cursor. Perspective lives on the parent so siblings stay coplanar. */
/* initTilt: REMOVED for performance (3D transform per pointermove across 16 cards). */

/** Seamless marquee driven by GSAP rather than a CSS keyframe.
 *
 *  Two wins over the keyframe version: it reacts to scroll velocity (the strip
 *  surges while the page moves, which makes the page feel physical), and it
 *  works identically under RTL without a mirrored keyframe. The track's children
 *  must already be duplicated; we translate by exactly one copy's width.
 */
function initMarquees() {
  gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((viewport) => {
    const track = viewport.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;

    if (reduceMotion) {
      // Static, still legible, no motion at all.
      track.style.transform = 'none';
      return;
    }

    const copies = parseInt(viewport.dataset.marqueeCopies || '2', 10);
    const speed = parseFloat(viewport.dataset.marquee || '38'); // seconds per copy
    let loop: gsap.core.Tween | undefined;

    const build = () => {
      loop?.kill();
      const span = track.scrollWidth / copies;
      if (!span) return;
      const dir = isRtl() ? 1 : -1;
      gsap.set(track, { x: 0 });
      loop = gsap.to(track, {
        x: dir * span,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (v) => `${gsap.utils.wrap(dir < 0 ? -span : 0, dir < 0 ? 0 : span, parseFloat(v))}px`,
        },
      });
    };

    build();
    window.addEventListener('resize', debounce(build, 250));

    /* Velocity surge: REMOVED for performance (ran on every scroll frame). */

    // Pause on hover so a visitor can actually read a name.
    viewport.addEventListener('pointerenter', () => loop?.pause());
    viewport.addEventListener('pointerleave', () => loop?.resume());
  });
}

/** The logo wall settles in as a set, each mark a beat behind the last, from
 *  the reading edge. Colour fill is CSS hover; this is only the arrival. */
function initLogoWall() {
  if (reduceMotion) return;

  gsap.utils.toArray<HTMLElement>('[data-logo-wall]').forEach((wall) => {
    gsap.fromTo(
      wall.querySelectorAll('[data-logo-cell]'),
      { opacity: 0, y: 22, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: { each: 0.055, from: isRtl() ? 'end' : 'start' },
        ease: 'power3.out',
        scrollTrigger: { trigger: wall, start: 'top 85%', once: true },
      }
    );
  });
}

/** Ambient plates drift and breathe behind content. One shared timeline per
 *  element, infinite, extremely slow: it should never be consciously noticed. */
/* initAmbient: REMOVED for performance (infinite drift tweens on large plates). */


/* ==========================================================================
   SIGNATURE MOTION
   The layer that makes the page feel authored rather than assembled. Still
   transform / opacity / clip only, still entirely behind prefers-reduced-motion.
   ========================================================================== */

/** Scroll-velocity skew: REMOVED.
 *
 *  It shear-transformed large blocks of type in proportion to scroll speed.
 *  A skew on text cannot be served from the existing raster, so every frame of
 *  every scroll re-rasterized the whole block. It was a subtle effect with a
 *  very unsubtle cost, and it was a direct contributor to scrolling feeling
 *  heavy. `data-skew` is now inert and left in the markup harmlessly.
 */

/** Section curtain: REMOVED. It clipped each band on a scrubbed timeline,
 *  which left sections part-hidden if a trigger resolved late and made the
 *  whole page feel like it was catching up with the scroll. `data-curtain`
 *  is now inert and harmless in the markup.
 */

/** Pinned chapters: REMOVED (home page, the method section).
 *  It pinned the section and stepped through the five steps under a scrubbed
 *  timeline, which hijacked the scroll and made the page feel stuck. Without
 *  it `data-chapters-mode` is never set, so neither the pinned nor the stacked
 *  CSS rule matches and the steps simply render as a normal stacked list.
 */

/** Scroll-scrubbed word reveal: REMOVED for the same reason as the curtain.
 *  `data-word-reveal` is inert; the heading simply renders.
 */

initReveals();
initHairlines();
initCounters();
initFigures();
initAnchorLinks();
initHorizontalScroll();
initMaskReveals();
initMarquees();
initLogoWall();

requestAnimationFrame(() => ScrollTrigger.refresh());
// Web fonts change text metrics after load, which shifts every trigger point.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
