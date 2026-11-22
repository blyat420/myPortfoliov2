import { gsap } from 'gsap';
import { reduced, type PageHandle } from '../env';
import { showNav } from '../nav';
import { splitChars, typeTween } from '../typewriter';

let playedOnce = false;

/**
 * Order: avatar rises from the bottom -> Name -> About me -> Education ->
 * Tools (icons fade + scale up) -> navbar.
 */
export function mountHome(c: HTMLElement): PageHandle {
  const ctx = gsap.context(() => {
    const figure = c.querySelector<HTMLElement>('[data-figure]');
    const steps = [...c.querySelectorAll<HTMLElement>('[data-step]')];
    const tools = c.querySelectorAll<HTMLElement>('[data-tool]');

    if (reduced) {
      gsap.set([figure, tools], { opacity: 1 });
      showNav();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => showNav() });

    tl.fromTo(figure, { yPercent: 110, opacity: 1 }, { yPercent: 0, duration: 1.6, ease: 'expo.out' }, 0);

    steps.forEach((step, i) => {
      const [head, ...bodies] = [...step.querySelectorAll<HTMLElement>('[data-tw]')];
      const stepTools = step.querySelectorAll('[data-tool]');

      tl.add(typeTween(splitChars(head), 0.045), i === 0 ? 0.7 : '>+0.15');
      bodies.forEach((el) => tl.add(typeTween(splitChars(el), 0.009)));
      if (stepTools.length) {
        tl.fromTo(
          stepTools,
          { opacity: 0, scale: 0.4 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.05 },
          '>-0.1'
        );
      }
    });

    // coming back to Home later replays it faster
    if (playedOnce) tl.timeScale(2.5);
    playedOnce = true;
  }, c);

  return { destroy: () => ctx.revert() };
}
