// @ts-check

/**
 * @fileoverview
 * Animation frame utility — rAF wrapper with fallback.
 */

export function raf(fn) {
  if ('requestAnimationFrame' in window) {
    return requestAnimationFrame(fn);
  }
  return setTimeout(fn, 16);
}

export function caf(id) {
  if ('cancelAnimationFrame' in window) {
    cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
}

export function whileRaf(conditionFn, actionFn) {
  function loop() {
    if (!conditionFn()) return;
    actionFn();
    raf(loop);
  }
  raf(loop);
}

