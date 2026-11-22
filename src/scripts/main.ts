import barba from '@barba/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import { initNav, setActiveNav } from './nav';
import { initWidgets } from './widgets';
import { reduced, type PageHandle } from './env';
import { mountHome } from './pages/home';
import { mountProjects } from './pages/projects';
import { mountDetail } from './pages/detail';

gsap.registerPlugin(ScrollTrigger, Flip);
history.scrollRestoration = 'manual';

// Smooth scroll (same stack as the reference: Lenis driven by GSAP's ticker)
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.085 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

const pages: Record<string, (c: HTMLElement) => PageHandle> = {
  home: mountHome,
  projects: mountProjects,
  detail: mountDetail,
};
let current: PageHandle | null = null;

function mount(container: HTMLElement, namespace: string) {
  setActiveNav(location.pathname);
  current = pages[namespace]?.(container) ?? null;
  ScrollTrigger.refresh();
  lenis?.resize();
}

initNav();
initWidgets(lenis);

barba.init({
  preventRunning: true,
  transitions: [
    {
      name: 'self',
      // clicking the link of the page you're on (e.g. "Projects") resets it
      enter() {
        current?.self?.();
      },
    },
    {
      name: 'fade',
      once({ next }) {
        mount(next.container, next.namespace);
      },
      async leave({ current: cur }) {
        current?.destroy();
        current = null;
        await gsap.to(cur.container, { autoAlpha: 0, y: -16, duration: reduced ? 0 : 0.45, ease: 'power2.inOut' });
        cur.container.style.display = 'none';
      },
      beforeEnter({ next }) {
        const title = new DOMParser().parseFromString(next.html, 'text/html').title;
        if (title) document.title = title;
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        gsap.set(next.container, { autoAlpha: 0, y: 16 });
      },
      async enter({ next }) {
        await gsap.to(next.container, {
          autoAlpha: 1,
          y: 0,
          duration: reduced ? 0 : 0.8,
          ease: 'expo.out',
          clearProps: 'transform,opacity,visibility',
        });
      },
      after({ next }) {
        mount(next.container, next.namespace);
      },
    },
  ],
});
