import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export let lenis: Lenis | undefined;

if (!reduceMotion) {
  lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/** Generic scroll-reveal system: add data-reveal (single element) or
 * data-reveal-group (staggers direct children) instead of writing bespoke
 * ScrollTrigger code in every page/component. */
function initReveals() {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  items.forEach((el) => {
    if (reduceMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
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
        lenis.scrollTo(target, { offset: -96 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
}

initReveals();
initAnchorLinks();
requestAnimationFrame(() => ScrollTrigger.refresh());
