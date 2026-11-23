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

  const ac = new AbortController();

  // gallery images load lazily and have no fixed size: re-measure scroll triggers as they arrive
  let refreshTimer = 0;
  const refreshSoon = () => {
    clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
  };
  c.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', refreshSoon, { once: true, signal: ac.signal });
  });

  // live demo viewer (System projects): the site loads only when opened, and unloads on close
  const demo = c.querySelector<HTMLDialogElement>('[data-demo]');
  if (demo) initDemo(c, demo, ac.signal);

  // mouse drag-to-scroll for slide rows (touch / trackpad scroll natively)
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
      clearTimeout(refreshTimer);
      if (demo?.open) demo.close();
      ac.abort();
      ctx.revert();
    },
  };
}

function initDemo(c: HTMLElement, dlg: HTMLDialogElement, signal: AbortSignal) {
  const frame = dlg.querySelector<HTMLIFrameElement>('[data-demo-frame]')!;
  const full = dlg.querySelector<HTMLButtonElement>('[data-demo-full]');
  const src = frame.dataset.src!;

  const load = () => {
    dlg.classList.add('is-loading');
    frame.src = src;
  };
  frame.addEventListener('load', () => dlg.classList.remove('is-loading'), { signal });

  c.querySelectorAll<HTMLElement>('[data-demo-open]').forEach((btn) =>
    btn.addEventListener(
      'click',
      () => {
        dlg.showModal();
        load();
      },
      { signal }
    )
  );
  dlg.querySelector('[data-demo-close]')?.addEventListener('click', () => dlg.close(), { signal });
  dlg.querySelector('[data-demo-reload]')?.addEventListener('click', load, { signal });
  full?.addEventListener(
    'click',
    () => {
      const on = dlg.classList.toggle('is-max');
      full.setAttribute('aria-pressed', String(on));
    },
    { signal }
  );
  // click on the dimmed area around the frame closes it
  dlg.addEventListener(
    'click',
    (e) => {
      if (e.target === dlg) dlg.close();
    },
    { signal }
  );
  // stop the demo (audio, timers, network) when it is closed
  dlg.addEventListener(
    'close',
    () => {
      frame.src = 'about:blank';
      dlg.classList.remove('is-loading', 'is-max');
    },
    { signal }
  );
}
