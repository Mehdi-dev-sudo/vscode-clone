// @ts-check

/**
 * @fileoverview
 * CSS utility helpers.
 */

export function addClass(el, cls) {
  el.classList.add(cls);
}

export function removeClass(el, cls) {
  el.classList.remove(cls);
}

export function toggleClass(el, cls, force) {
  el.classList.toggle(cls, force);
}

export function hasClass(el, cls) {
  return el.classList.contains(cls);
}

export function setStyle(el, prop, value) {
  el.style[prop] = value;
}

export function getStyle(el, prop) {
  return getComputedStyle(el)[prop];
}

