/**
 * The navbar appears once, after the first page's intro has finished.
 * A CSS class, not a tween: page tweens live in a gsap.context that is
 * reverted on page leave, which used to hide the nav again.
 */
export function showNav(delay = 0) {
  window.setTimeout(() => document.querySelector('[data-nav]')?.classList.add('is-shown'), delay * 1000);
}

export function setActiveNav(path: string) {
  document.querySelectorAll<HTMLElement>('[data-nav-path]').forEach((a) => {
    const p = a.dataset.navPath!;
    const on = path === p || path === p + '/' || path.startsWith(p + '/');
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/** "Call me" dropdown: hover on mouse devices, tap/Enter elsewhere, Esc to close. */
export function initNav() {
  const dd = document.querySelector<HTMLElement>('[data-dd]');
  const btn = dd?.querySelector<HTMLButtonElement>('[data-dd-btn]');
  if (!dd || !btn) return;

  const canHover = window.matchMedia('(hover: hover)').matches;
  let timer = 0;
  const set = (open: boolean) => {
    dd.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  const isOpen = () => dd.classList.contains('is-open');

  if (canHover) {
    dd.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      window.clearTimeout(timer);
      set(true);
    });
    dd.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      timer = window.setTimeout(() => set(false), 180);
    });
  }

  btn.addEventListener('click', (e) => {
    // a mouse already opened it on hover, so a click keeps it open
    if (canHover && (e as PointerEvent).pointerType === 'mouse') return set(true);
    set(!isOpen());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      set(false);
      btn.focus();
    }
  });
  document.addEventListener('pointerdown', (e) => {
    if (isOpen() && !dd.contains(e.target as Node)) set(false);
  });
  dd.addEventListener('focusout', (e) => {
    if (!dd.contains(e.relatedTarget as Node | null)) set(false);
  });
}
