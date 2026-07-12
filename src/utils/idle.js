/**
 * @fileoverview
 * Idle callback utility — runs function when browser is idle.
 */

export function onIdle(fn, options = {}) {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(fn, options);
  }
  return setTimeout(fn, 1);
}

export function cancelIdle(id) {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}
