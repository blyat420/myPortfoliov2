import { gsap } from 'gsap';

/**
 * Wraps every character of `root` in a span (words stay unbreakable so
 * justified text keeps its layout) and returns the character spans.
 * Nested markup such as <b> or <p> is preserved.
 */
export function splitChars(root: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = [];
  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of (child.textContent ?? '').split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.append(document.createTextNode(part));
            continue;
          }
          const word = document.createElement('span');
          word.className = 'tw-word';
          for (const ch of part) {
            const c = document.createElement('span');
            c.className = 'tw-char';
            c.textContent = ch;
            word.append(c);
            chars.push(c);
          }
          frag.append(word);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    }
  };
  walk(root);
  root.style.visibility = 'visible';
  return chars;
}

/** A tween that "types" the characters one by one with a moving caret. */
export function typeTween(chars: HTMLElement[], secondsPerChar: number): gsap.core.Tween {
  const state = { p: 0 };
  let shown = 0;
  let caret: HTMLElement | null = null;
  const moveCaret = (el: HTMLElement | null) => {
    caret?.classList.remove('is-caret');
    caret = el;
    caret?.classList.add('is-caret');
  };
  return gsap.to(state, {
    p: chars.length,
    duration: Math.max(chars.length * secondsPerChar, 0.05),
    ease: 'none',
    onUpdate() {
      const k = Math.min(chars.length, Math.floor(state.p));
      while (shown < k) chars[shown++].style.opacity = '1';
      if (k > 0) moveCaret(chars[k - 1]);
    },
    onComplete() {
      while (shown < chars.length) chars[shown++].style.opacity = '1';
      moveCaret(null);
    },
  });
}
