export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface PageHandle {
  destroy(): void;
  /** called when the user clicks the link of the page they're already on */
  self?(): void;
}
