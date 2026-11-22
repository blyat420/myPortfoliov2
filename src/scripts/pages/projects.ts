import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { reduced, type PageHandle } from '../env';
import { showNav } from '../nav';

export function mountProjects(c: HTMLElement): PageHandle {
  const root = c.querySelector<HTMLElement>('[data-pj]')!;
  const folderBtns = [...root.querySelectorAll<HTMLButtonElement>('[data-folder]')];
  const arts = folderBtns.map((b) => b.querySelector<HTMLElement>('.folder__art')!);
  const labels = folderBtns.map((b) => b.querySelector<HTMLElement>('.folder__label')!);
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const carousels = [...root.querySelectorAll<HTMLElement>('[data-carousel]')];
  const progress = root.querySelector<HTMLElement>('[data-progress]')!;
  const capTitle = root.querySelector<HTMLElement>('[data-cap-title]')!;
  const capDesc = root.querySelector<HTMLElement>('[data-cap-desc]')!;

  const ac = new AbortController();
  const on = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement | Window,
    type: K,
    fn: (e: HTMLElementEventMap[K]) => void,
    opts: AddEventListenerOptions = {}
  ) => el.addEventListener(type, fn as EventListener, { ...opts, signal: ac.signal });

  const dur = (s: number) => (reduced ? 0 : s);
  let activeId: string | null = null;
  let carousel: HTMLElement | null = null;
  let track: HTMLElement | null = null;
  let cards: HTMLElement[] = [];
  let idx = 0;
  let busy = false;

  const ctx = gsap.context(() => {
    // folders appear one by one
    if (reduced) {
      gsap.set(folderBtns, { opacity: 1 });
      showNav();
    } else {
      gsap.fromTo(
        folderBtns,
        { opacity: 0, y: 60, scale: 0.6, rotate: -6 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 1,
          ease: 'back.out(1.5)',
          stagger: 0.22,
          delay: 0.15,
          onComplete: () => showNav(),
        }
      );
    }
  }, c);

  /* ---------- pen-scribble hover (same as the reference's disc hover):
     the first loop is drawn in quickly, then the line "boils" by swapping
     between hand-drawn variants every ~90ms until the pointer leaves ---------- */
  const boiling = new Map<HTMLElement, number>();
  const drawOut = (btn: HTMLElement) => {
    window.clearInterval(boiling.get(btn));
    window.clearTimeout(boiling.get(btn));
    boiling.delete(btn);
    btn.querySelectorAll<SVGPathElement>('.scribble path').forEach((p) => (p.style.opacity = '0'));
  };
  const drawIn = (btn: HTMLElement) => {
    if (root.classList.contains('is-open') || reduced || boiling.has(btn)) return;
    const frames = [...btn.querySelectorAll<SVGPathElement>('.scribble path')];
    let i = 0;
    const show = () => frames.forEach((p, k) => (p.style.opacity = k === i ? '1' : '0'));
    show();
    ctx.add(() => gsap.fromTo(frames[0], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.16, ease: 'none' }));
    boiling.set(
      btn,
      window.setTimeout(() => {
        boiling.set(
          btn,
          window.setInterval(() => {
            i = (i + 1) % frames.length;
            show();
          }, 90)
        );
      }, 160)
    );
  };

  folderBtns.forEach((btn) => {
    on(btn, 'pointerenter', () => drawIn(btn));
    on(btn, 'pointerleave', () => drawOut(btn));
    on(btn, 'focus', () => btn.matches(':focus-visible') && drawIn(btn));
    on(btn, 'blur', () => drawOut(btn));
    on(btn, 'click', () => {
      const id = btn.dataset.folder!;
      if (activeId === id) close();
      else open(id);
    });
  });

  /* ---------- open / close a folder ---------- */
  function setActive(id: string | null) {
    activeId = id;
    folderBtns.forEach((b) => {
      const isActive = b.dataset.folder === id;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });
  }

  function open(id: string) {
    if (busy) return;
    if (root.classList.contains('is-open')) {
      setActive(id);
      showCarousel(id, 0);
      return;
    }
    busy = true;
    folderBtns.forEach((b) => drawOut(b));
    const state = Flip.getState(arts);
    root.classList.add('is-open');
    setActive(id);
    ctx.add(() => {
      gsap.to(labels, { autoAlpha: 0, duration: dur(0.3) });
      Flip.from(state, { duration: dur(1.1), ease: 'power4.inOut', scale: true, onComplete: () => (busy = false) });
    });
    showCarousel(id, reduced ? 0 : 0.5);
  }

  function close() {
    if (busy || !root.classList.contains('is-open')) return;
    busy = true;
    ctx.add(() => {
      gsap.to(stage, {
        opacity: 0,
        y: 30,
        duration: dur(0.35),
        ease: 'power2.in',
        onComplete: () => {
          stage.hidden = true;
          gsap.set(stage, { clearProps: 'opacity,transform' });
          const state = Flip.getState(arts);
          root.classList.remove('is-open');
          setActive(null);
          Flip.from(state, { duration: dur(1.1), ease: 'power4.inOut', scale: true, onComplete: () => (busy = false) });
          gsap.to(labels, { autoAlpha: 1, duration: dur(0.5), delay: dur(0.75) });
        },
      });
    });
  }

  /* ---------- carousel ---------- */
  function targetX(i: number) {
    const card = cards[i];
    return carousel!.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
  }

  function setCaption(animate: boolean) {
    const card = cards[idx];
    const apply = () => {
      capTitle.textContent = card.dataset.title ?? '';
      capDesc.textContent = card.dataset.desc ?? '';
    };
    if (!animate || reduced) return apply();
    ctx.add(() => {
      gsap.to([capTitle, capDesc], {
        opacity: 0,
        y: -8,
        duration: 0.15,
        overwrite: true,
        onComplete: () => {
          apply();
          gsap.fromTo([capTitle, capDesc], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 });
        },
      });
    });
  }

  function go(i: number, instant = false) {
    if (!track || !cards.length) return;
    const nextIdx = Math.max(0, Math.min(cards.length - 1, i));
    const changed = nextIdx !== idx;
    idx = nextIdx;
    ctx.add(() => {
      gsap.to(track, { x: targetX(idx), duration: instant ? 0 : dur(0.9), ease: 'expo.out', overwrite: true });
      gsap.to(progress, { scaleX: (idx + 1) / cards.length, duration: instant ? 0 : dur(0.9), ease: 'expo.out' });
    });
    cards.forEach((card, k) => {
      card.classList.toggle('is-active', k === idx);
      if (card.tagName === 'A') card.tabIndex = k === idx ? 0 : -1;
    });
    if (changed || instant) setCaption(changed && !instant);
  }

  function showCarousel(id: string, delay: number) {
    stage.hidden = false;
    carousels.forEach((cz) => (cz.hidden = cz.dataset.carousel !== id));
    carousel = carousels.find((cz) => cz.dataset.carousel === id) ?? null;
    track = carousel?.querySelector<HTMLElement>('[data-track]') ?? null;
    cards = track ? [...track.children].filter((n): n is HTMLElement => n instanceof HTMLElement) : [];
    idx = 0;
    go(0, true);
    if (reduced) return;
    ctx.add(() => {
      gsap.fromTo(stage, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay });
      gsap.fromTo(cards, { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay });
    });
  }

  // click: side card -> bring to centre; centre card -> open project (Barba)
  let dragged = false;
  carousels.forEach((cz) => {
    const tr = cz.querySelector<HTMLElement>('[data-track]')!;
    cz.setAttribute('data-lenis-prevent', '');

    on(tr, 'click', (e) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.card');
      if (!card) return;
      const k = cards.indexOf(card);
      if (dragged || k !== idx || card.tagName !== 'A') {
        e.preventDefault();
        e.stopPropagation(); // keep Barba from navigating
        if (!dragged && k !== -1) go(k);
      }
    });

    // drag / swipe
    let startX = 0;
    let startTrackX = 0;
    let pointerId = -1;
    let dragTo = (_x: number) => {};
    on(tr, 'pointerdown', (e) => {
      if (e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startTrackX = Number(gsap.getProperty(tr, 'x'));
      dragged = false;
    });
    on(tr, 'pointermove', (e) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) > 6) {
        dragged = true;
        // fresh each drag: go() overwrites (kills) tweens on the track
        dragTo = gsap.quickTo(tr, 'x', { duration: 0.35, ease: 'power3.out' });
        tr.classList.add('is-dragging');
        tr.setPointerCapture(pointerId);
      }
      if (dragged) dragTo(startTrackX + dx * 0.9);
    });
    const end = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = -1;
      tr.classList.remove('is-dragging');
      if (!dragged) return;
      const dx = e.clientX - startX;
      go(dx < -60 ? idx + 1 : dx > 60 ? idx - 1 : idx);
      // let the click that follows a drag be swallowed, then reset
      window.setTimeout(() => (dragged = false), 0);
    };
    on(tr, 'pointerup', end);
    on(tr, 'pointercancel', end);

    // wheel / trackpad
    let wheelLock = false;
    on(
      cz,
      'wheel',
      (e) => {
        const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(d) < 12) return;
        e.preventDefault();
        if (wheelLock) return;
        wheelLock = true;
        go(idx + Math.sign(d));
        window.setTimeout(() => (wheelLock = false), 650);
      },
      { passive: false }
    );

    // keyboard
    on(cz, 'keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(idx + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(idx - 1);
      } else if (e.key === 'Enter' && e.target === cz) {
        const card = cards[idx];
        if (card?.tagName === 'A') card.click();
      }
    });
  });

  on(window, 'resize', () => carousel && !stage.hidden && go(idx, true));

  return {
    destroy() {
      folderBtns.forEach(drawOut);
      ac.abort();
      ctx.revert();
    },
    self: close,
  };
}
