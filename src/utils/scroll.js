// @ts-check

/**
 * @fileoverview
 * Scroll utility helpers.
 */

export function scrollToTop(el) {
  el.scrollTop = 0;
}

export function scrollToBottom(el) {
  el.scrollTop = el.scrollHeight;
}

export function isScrolledToBottom(el, threshold = 10) {
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
}

export function smoothScrollTo(el, target, duration = 300) {
  const start = el.scrollTop;
  const diff = target - start;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.scrollTop = start + diff * ease;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

