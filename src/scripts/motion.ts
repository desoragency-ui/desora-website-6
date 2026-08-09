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
  // lerp 0.075 = a touch of weight in the scroll, like a heavy door on good
  // hinges. wheelMultiplier just under 1 stops a flick of the wheel from
  // firing the page down a screen and a half. syncTouch carries the same
  // easing to touch devices instead of handing them the native jerk.
  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.075,
    wheelMultiplier: 0.92,
    syncTouch: true,
    syncTouchLerp: 0.09,
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

initReveals();
initHairlines();
initCounters();
initFigures();
initAnchorLinks();
initScrollProgress();
initSectionDepth();

requestAnimationFrame(() => ScrollTrigger.refresh());
// Web fonts change text metrics after load, which shifts every trigger point.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
