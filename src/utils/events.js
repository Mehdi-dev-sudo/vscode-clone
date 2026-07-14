// @ts-check

/**
 * @fileoverview
 * Event utility helpers.
 */

export function on(el, event, selector, handler) {
  if (typeof selector === 'function') {
    el.addEventListener(event, selector);
    return () => el.removeEventListener(event, selector);
  }
  const listener = (e) => {
    const target = e.target.closest(selector);
    if (target) handler(e, target);
  };
  el.addEventListener(event, listener);
  return () => el.removeEventListener(event, listener);
}

export function once(el, event, handler) {
  const wrapper = (e) => { handler(e); el.removeEventListener(event, wrapper); };
  el.addEventListener(event, wrapper);
}

