import type Lenis from 'lenis';

function initCursorTag() {
  const tag = document.querySelector<HTMLElement>('[data-cursor-tag]');
  if (!tag || !matchMedia('(hover: hover)').matches) return;
  const CLICKABLE = 'a[href], button, .card, label';
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.target as Element;
    const on = !!el.closest?.(CLICKABLE) && !el.closest('[data-cursor-tag]');
    tag.classList.toggle('is-on', on);
    // flip to the left / above near the viewport edges so it never clips
    const w = tag.offsetWidth;
    const h = tag.offsetHeight;
    const x = e.clientX + 16 + w > innerWidth ? e.clientX - 12 - w : e.clientX + 16;
    const y = e.clientY + 20 + h > innerHeight ? e.clientY - 12 - h : e.clientY + 20;
    tag.style.transform = `translate(${x}px, ${y}px)`;
  });
  document.addEventListener('pointerleave', () => tag.classList.remove('is-on'));
}

export function initWidgets(lenis: Lenis | null) {
  initCursorTag();
  initRing(lenis);
  initPlayer();
}

function initRing(lenis: Lenis | null) {
  const btn = document.querySelector<HTMLButtonElement>('[data-ring]');
  const fg = document.querySelector<SVGCircleElement>('[data-ring-fg]');
  if (!btn || !fg) return;
  const C = parseFloat(fg.getAttribute('stroke-dasharray') || '0');
  // cache scroll height (reading it every scroll event forces layout = jank)
  let max = 0;
  let visible = false;
  let queued = false;
  const paint = () => {
    queued = false;
    const y = window.scrollY;
    const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    fg.style.strokeDashoffset = String(C * (1 - p));
    const v = y > 240;
    if (v !== visible) {
      visible = v;
      btn.classList.toggle('is-visible', v);
    }
  };
  const measure = () => {
    max = document.documentElement.scrollHeight - window.innerHeight;
    paint();
  };
  const update = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(paint);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', measure);
  new ResizeObserver(measure).observe(document.body);
  btn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  measure();
}

function initPlayer() {
  const root = document.querySelector<HTMLElement>('[data-player]');
  if (!root) return;
  const tracks: { src: string; title: string }[] = JSON.parse(root.dataset.tracks || '[]');
  if (!tracks.length) return;

  const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const playBtn = $('[data-play]');
  const iconPlay = $('[data-icon-play]');
  const iconPause = $('[data-icon-pause]');
  const seek = $<HTMLInputElement>('[data-seek]');
  const title = $('[data-title]');
  const shuffleBtn = $('[data-shuffle]');
  const repeatBtn = $('[data-repeat]');

  const audio = new Audio();
  audio.preload = 'none';
  let shuffle = true;
  let repeat = false;
  let idx = -1;
  const history: number[] = [];
  let seeking = false;

  const randomOther = () => {
    if (tracks.length === 1) return 0;
    let n;
    do n = Math.floor(Math.random() * tracks.length);
    while (n === idx);
    return n;
  };

  function load(i: number, play = true) {
    idx = i;
    audio.src = tracks[i].src;
    title.textContent = tracks[i].title;
    root.classList.add('has-track');
    seek.value = '0';
    paintSeek();
    if (play) audio.play().catch(() => {});
  }
  function next() {
    if (idx >= 0) history.push(idx);
    load(shuffle || idx < 0 ? randomOther() : (idx + 1) % tracks.length);
  }
  function prev() {
    if (audio.currentTime > 3 || !history.length) {
      audio.currentTime = 0;
      return;
    }
    load(history.pop()!);
  }
  function paintSeek() {
    seek.style.setProperty('--p', `${(Number(seek.value) / 1000) * 100}%`);
  }

  playBtn.addEventListener('click', () => {
    if (idx < 0) load(shuffle ? randomOther() : 0);
    else if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });
  $('[data-next]').addEventListener('click', next);
  $('[data-prev]').addEventListener('click', prev);
  shuffleBtn.addEventListener('click', () => {
    shuffle = !shuffle;
    shuffleBtn.setAttribute('aria-pressed', String(shuffle));
  });
  repeatBtn.addEventListener('click', () => {
    repeat = !repeat;
    audio.loop = repeat;
    repeatBtn.setAttribute('aria-pressed', String(repeat));
  });

  const sync = () => {
    const playing = !audio.paused;
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    root.classList.toggle('is-playing', playing);
  };
  audio.addEventListener('play', sync);
  audio.addEventListener('pause', sync);
  audio.addEventListener('ended', next);
  audio.addEventListener('timeupdate', () => {
    if (seeking || !audio.duration) return;
    seek.value = String((audio.currentTime / audio.duration) * 1000);
    paintSeek();
  });
  seek.addEventListener('input', () => {
    seeking = true;
    paintSeek();
  });
  seek.addEventListener('change', () => {
    if (audio.duration) audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
    seeking = false;
  });
}

