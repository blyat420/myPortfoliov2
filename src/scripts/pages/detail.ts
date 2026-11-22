import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduced, type PageHandle } from '../env';
import { showNav } from '../nav';

/**
 * Journey timeline: the line fills down with the scroll (head sits at 55% of the viewport),
 * and each step's text + image appear when the line reaches its dot. Must run inside a gsap.context.
 */
function initTimeline(tl: HTMLElement, animate: boolean) {
  const fill = tl.querySelector<HTMLElement>('[data-ln-fill]')!;
  const steps = tl.querySelectorAll<HTMLElement>('[data-ln-step]');
  if (!animate) {
    gsap.set(fill, { scaleY: 1 });
    steps.forEach((s) => s.querySelector('[data-ln-dot]')!.classList.add('is-on'));
    return;
  }
  gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 55%', end: 'bottom 55%', scrub: 0.4 } });
  steps.forEach((s) => {
    const dot = s.querySelector<HTMLElement>('[data-ln-dot]')!;
    const parts = s.querySelectorAll('[data-ln-text], [data-ln-media]');
    gsap.set(parts, { opacity: 0, y: 40 });
    const show = gsap.to(parts, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, paused: true });
    ScrollTrigger.create({
      trigger: dot,
      start: 'center 55%',
      onEnter: () => {
        dot.classList.add('is-on');
        show.play();
      },
      onLeaveBack: () => {
        dot.classList.remove('is-on');
        show.reverse();
      },
    });
  });
}

export function mountDetail(c: HTMLElement): PageHandle {
  const ctx = gsap.context(() => {
    const items = c.querySelectorAll<HTMLElement>('[data-reveal]');
    const timeline = c.querySelector<HTMLElement>('[data-timeline]');
    if (reduced) {
      gsap.set(items, { opacity: 1 });
      if (timeline) initTimeline(timeline, false);
      showNav();
      return;
    }
    if (timeline) initTimeline(timeline, true);
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(batch, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
    });
    // brand-guideline rows slide in from the right, just after their title
    c.querySelectorAll<HTMLElement>('[data-drag]').forEach((row) => {
      gsap.set(row, { x: window.innerWidth, opacity: 0 });
      ScrollTrigger.create({
        trigger: row.parentElement,
        start: 'top 70%',
        once: true,
        onEnter: () =>
          gsap.to(row, { x: 0, opacity: 1, duration: 1.4, delay: 0.35, ease: 'expo.out', clearProps: 'transform,opacity' }),
      });
    });
    showNav(0.4);
  }, c);

  // mouse drag-to-scroll for slide rows (touch / trackpad scroll natively)
  const ac = new AbortController();
  c.querySelectorAll<HTMLElement>('[data-drag]').forEach((row) => {
    let x0 = 0;
    let s0 = 0;
    let down = false;
    row.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      x0 = e.clientX;
      s0 = row.scrollLeft;
    }, { signal: ac.signal });
    row.addEventListener('pointermove', (e) => {
      if (!down) return;
      row.classList.add('is-dragging');
      row.scrollLeft = s0 - (e.clientX - x0);
    }, { signal: ac.signal });
    const end = () => {
      down = false;
      row.classList.remove('is-dragging');
    };
    row.addEventListener('pointerup', end, { signal: ac.signal });
    row.addEventListener('pointerleave', end, { signal: ac.signal });
  });

  return {
    destroy() {
      ac.abort();
      ctx.revert();
    },
  };
}
