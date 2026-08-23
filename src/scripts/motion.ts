import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The house easing curve. One curve everywhere: a fast, confident start that
 * settles without bouncing. Bounce reads as playful; this reads as expensive. */
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_ARR = [0.16, 1, 0.3, 1] as const;
gsap.registerEase('desora', (p) => gsap.parseEase('power3.out')(p));

export let lenis: Lenis | undefined;

if (!reduceMotion) {
  // Scroll feel, retuned. The old values (lerp 0.075, wheelMultiplier 0.92)
  // were chosen for "weight" and landed on "wading": the viewport took roughly
  // half a second to catch up to the wheel, and each tick travelled LESS than a
  // native scroll would. That reads as lag, not luxury.
  //
  // lerp 0.2 still smooths the step between wheel notches but tracks the input
  // closely enough to feel direct. wheelMultiplier slightly above 1 means a
  // flick now covers more ground than native, not less.
  //
  // syncTouch is off: on a phone the native momentum scroller is hardware
  // driven and always beats a JS rAF loop. Hijacking it was pure cost.
  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.2,
    wheelMultiplier: 1.08,
    touchMultiplier: 1.6,
    syncTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

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
      gsap.set(el, { opacity: 1, y: 0, clipPath: 'none' });
      return;
    }

    const mode = el.dataset.reveal;

    // Headings split to lines or characters and climb out from behind their own
    // clipped box. `mask` supplies that box, so an accent on the line above is
    // never shaved off, which matters in French and would not show up in an
    // English-only test.
    if (mode === 'lines' || mode === 'chars') {
      try {
        const split = new SplitText(el, {
          type: mode,
          linesClass: 'reveal-line',
          charsClass: 'reveal-char',
          mask: 'lines',
        });
        const targets = mode === 'chars' ? split.chars : split.lines;
        gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          targets,
          { yPercent: 108, opacity: 0, rotate: mode === 'chars' ? 3 : 0 },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            duration: mode === 'chars' ? 0.9 : 1.15,
            stagger: mode === 'chars' ? 0.018 : 0.085,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          }
        );
        return;
      } catch {
        /* fall through to the block reveal below */
      }
    }

    // Default: a curtain wipe, not a fade. The block is uncovered from the
    // bottom edge while it settles out of a slight over-scale, so it reads as
    // something being revealed rather than something being turned up in
    // opacity. Opacity stays at 1 throughout, which is what kills the "everything
    // gently fades in" feel the whole page used to have.
    gsap.fromTo(
      el,
      { clipPath: 'inset(0% 0% 100% 0%)', y: 46, scale: 0.985 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onComplete: () => gsap.set(el, { clipPath: 'none' }),
      }
    );
  });

  const groups = gsap.utils.toArray<HTMLElement>('[data-reveal-group]');
  groups.forEach((group) => {
    const children = Array.from(group.children) as HTMLElement[];
    if (reduceMotion) {
      gsap.set(children, { opacity: 1, y: 0, clipPath: 'none' });
      return;
    }

    // Cards deal out rather than fade up: each one arrives from slightly below
    // and behind, with a hair of rotation, uncovered by its own wipe. `from`
    // follows the reading direction so an Arabic grid deals from the right.
    gsap.fromTo(
      children,
      { clipPath: 'inset(0% 0% 100% 0%)', y: 54, scale: 0.965, rotate: isRtl() ? -1.1 : 1.1 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 1.05,
        stagger: { each: 0.085, from: isRtl() ? 'end' : 'start' },
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 88%', once: true },
        onComplete: () => gsap.set(children, { clipPath: 'none' }),
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
      if (lenis) {
        lenis.scrollTo(target, { offset: -96, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
}

/** A gold hairline across the very top that fills as the page is read. Drawn
 * with scaleX on a single fixed element, so it costs one composited layer and
 * never triggers layout. RTL flips the origin so it fills from the right. */
function initScrollProgress() {
  if (reduceMotion) return;
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  gsap.set(bar, {
    scaleX: 0,
    transformOrigin: document.documentElement.dir === 'rtl' ? 'right center' : 'left center',
  });

  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.4 },
  });
}

/** Sections drift up and settle as they enter, a half-beat behind the content
 * revealing inside them. Gives the page a sense of depth while scrolling
 * without any element moving far enough to read as a gimmick. */
function initSectionDepth() {
  if (reduceMotion) return;

  gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((el) => {
    gsap.fromTo(
      el,
      { y: 28, scale: 0.994 },
      {
        y: 0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 55%', scrub: 0.8 },
      }
    );
  });
}

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

/** Pointer-capable, non-touch device. Magnetic pulls and tilt are meaningless
 *  on touch and cost battery, so they never initialise there. */
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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
function initDepthLayers() {
  if (reduceMotion) return;

  gsap.utils.toArray<HTMLElement>('[data-depth-layer]').forEach((el) => {
    const depth = parseFloat(el.dataset.depthLayer || '0');
    if (!isFinite(depth) || depth === 0) return;
    const scope = el.closest<HTMLElement>('[data-depth-scope]') ?? el.parentElement ?? el;

    gsap.fromTo(
      el,
      { yPercent: -depth },
      {
        yPercent: depth,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}

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
function initMagnetic() {
  if (reduceMotion || !finePointer) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.28');
    const label = el.querySelector<HTMLElement>('[data-magnetic-label]');
    const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const labelX = label ? gsap.quickTo(label, 'x', { duration: 0.65, ease: 'power3.out' }) : null;
    const labelY = label ? gsap.quickTo(label, 'y', { duration: 0.65, ease: 'power3.out' }) : null;

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      quickX(dx);
      quickY(dy);
      // The label trails the button slightly, which is what sells the weight.
      labelX?.(dx * 0.35);
      labelY?.(dy * 0.35);
    });

    const release = () => {
      quickX(0);
      quickY(0);
      labelX?.(0);
      labelY?.(0);
    };
    el.addEventListener('pointerleave', release);
    el.addEventListener('blur', release);
  });
}

/** Cards catch the light: a few degrees of tilt plus a specular sheen that
 *  tracks the cursor. Perspective lives on the parent so siblings stay coplanar. */
function initTilt() {
  if (reduceMotion || !finePointer) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    const max = parseFloat(card.dataset.tilt || '5');
    const setRotX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
    const setRotY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
    gsap.set(card, { transformPerspective: 900, transformStyle: 'preserve-3d' });

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      setRotY((px - 0.5) * max * 2);
      setRotX((0.5 - py) * max * 2);
      card.style.setProperty('--sheen-x', `${px * 100}%`);
      card.style.setProperty('--sheen-y', `${py * 100}%`);
    });

    card.addEventListener('pointerleave', () => {
      setRotX(0);
      setRotY(0);
    });
  });
}

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

    // Scroll velocity surges the strip, then it eases back to base speed.
    let scrollTs: gsap.core.Tween | undefined;
    ScrollTrigger.create({
      onUpdate: (self) => {
        if (!loop) return;
        const surge = gsap.utils.clamp(1, 5, 1 + Math.abs(self.getVelocity()) / 900);
        scrollTs?.kill();
        loop.timeScale(surge);
        scrollTs = gsap.to(loop, { timeScale: 1, duration: 0.9, ease: 'power2.out', overwrite: true });
      },
    });

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
function initAmbient() {
  if (reduceMotion) return;

  gsap.utils.toArray<HTMLElement>('[data-ambient]').forEach((el, i) => {
    const drift = parseFloat(el.dataset.ambient || '18');
    const tween = gsap.to(el, {
      xPercent: drift,
      yPercent: drift * -0.55,
      scale: 1.12,
      duration: 26 + i * 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      paused: true,
    });

    // Only animate while the plate is actually on screen. An infinite tween on
    // a large composited layer otherwise keeps the compositor busy for the
    // entire session, including for the eight plates below the fold.
    ScrollTrigger.create({
      trigger: el.closest('section') ?? el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
    });
  });
}


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

/** Bands arrive from under the band above them.
 *
 *  Each `[data-curtain]` section is clipped to nothing at its top edge and
 *  uncovers as it enters, so the page reads as a stack of plates being dealt
 *  rather than a column of boxes scrolling past. Scrubbed, so the reveal is
 *  tied to the reader's own scrolling rather than playing on a timer.
 */
function initCurtains() {
  if (reduceMotion) return;

  gsap.utils.toArray<HTMLElement>('[data-curtain]').forEach((section) => {
    gsap.fromTo(
      section,
      { clipPath: 'inset(14% 0% 0% 0%)', scale: 0.975 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top 55%',
          scrub: 0.7,
        },
      }
    );
  });
}

/** Custom cursor: REMOVED on request. The page uses the system cursor. */

/** Cursor-following image plate: REMOVED on request. Service rows now respond
 *  with the crimson wash and the indent alone. */

/** Pinned chapters.
 *
 *  `[data-chapters]` pins its `[data-chapters-stage]` and steps through the
 *  `[data-chapter]` children as the reader scrolls, one at a time. Used for the
 *  method: five steps that must be read in order, so the page holds the reader
 *  on each one instead of letting them skim past.
 */
function initChapters() {
  const scopes = gsap.utils.toArray<HTMLElement>('[data-chapters]');

  scopes.forEach((scope) => {
    const stage = scope.querySelector<HTMLElement>('[data-chapters-stage]');
    const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]', scope);
    const marks = gsap.utils.toArray<HTMLElement>('[data-chapter-mark]', scope);
    if (!stage || chapters.length < 2) return;

    // Reduced motion, and touch, get the plain stacked list: every chapter
    // visible, no pinning, nothing to fight a thumb.
    const canPin = window.matchMedia('(min-width: 1024px) and (min-height: 640px)').matches;
    if (reduceMotion || !canPin) {
      scope.dataset.chaptersMode = 'stacked';
      gsap.set(chapters, { opacity: 1, clearProps: 'transform' });
      return;
    }
    scope.dataset.chaptersMode = 'pinned';

    gsap.set(chapters, { opacity: 0, yPercent: 8 });
    gsap.set(chapters[0], { opacity: 1, yPercent: 0 });
    marks[0]?.classList.add('is-current');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scope,
        start: 'top top',
        end: () => `+=${chapters.length * 62}%`,
        pin: stage,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length));
          marks.forEach((m, mi) => m.classList.toggle('is-current', mi === i));
        },
      },
    });

    chapters.forEach((ch, i) => {
      if (i === 0) return;
      tl.to(chapters[i - 1], { opacity: 0, yPercent: -8, duration: 0.5, ease: 'power2.inOut' }, i - 1)
        .fromTo(
          ch,
          { opacity: 0, yPercent: 8 },
          { opacity: 1, yPercent: 0, duration: 0.5, ease: 'power2.inOut' },
          i - 1 + 0.25
        );
    });
  });
}

/** Words that arrive one at a time, tied to the scroll.
 *
 *  `[data-word-reveal]` splits to words and brightens them in sequence as the
 *  block crosses the viewport, so a statement is read at the pace it was
 *  written. Used once per page at most: it is a device, and a device used twice
 *  is a tic.
 */
function initWordReveal() {
  gsap.utils.toArray<HTMLElement>('[data-word-reveal]').forEach((el) => {
    if (reduceMotion) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    let words: Element[] = [];
    try {
      const split = new SplitText(el, { type: 'words', wordsClass: 'reveal-word' });
      words = split.words;
    } catch {
      gsap.set(el, { opacity: 1 });
      return;
    }
    gsap.set(el, { opacity: 1 });
    gsap.fromTo(
      words,
      { opacity: 0.18 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.35,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 55%', scrub: 0.5 },
      }
    );
  });
}

initReveals();
initHairlines();
initCounters();
initFigures();
initAnchorLinks();
initScrollProgress();
initSectionDepth();
initHorizontalScroll();
initDepthLayers();
initMaskReveals();
initMagnetic();
initTilt();
initMarquees();
initLogoWall();
initAmbient();
initCurtains();
initChapters();
initWordReveal();

requestAnimationFrame(() => ScrollTrigger.refresh());
// Web fonts change text metrics after load, which shifts every trigger point.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
