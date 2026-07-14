// @ts-check

/**
 * @fileoverview
 * Animation utilities for smooth transitions and effects.
 */

/**
 * Animate an element's property from start to end.
 * @param {HTMLElement} el
 * @param {string} prop - CSS property to animate.
 * @param {number} from
 * @param {number} to
 * @param {number} [duration=150]
 * @param {Function} [onFrame] - Called each frame with current value.
 * @returns {Promise<void>}
 */
export function animate(el, prop, from, to, duration = 150, onFrame) {
  return new Promise((resolve) => {
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = from + (to - from) * eased;

      el.style[prop] = `${value}px`;
      if (onFrame) onFrame(value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.style[prop] = `${to}px`;
        resolve();
      }
    }

    requestAnimationFrame(tick);
  });
}

/**
 * Fade in an element.
 * @param {HTMLElement} el
 * @param {number} [duration=150]
 * @returns {Promise<void>}
 */
export function fadeIn(el, duration = 150) {
  return new Promise((resolve) => {
    el.style.opacity = '0';
    el.style.display = '';
    el.offsetHeight; // force reflow
    el.style.transition = `opacity ${duration}ms ease-out`;
    el.style.opacity = '1';
    setTimeout(() => {
      el.style.transition = '';
      resolve();
    }, duration);
  });
}

/**
 * Fade out an element.
 * @param {HTMLElement} el
 * @param {number} [duration=150]
 * @returns {Promise<void>}
 */
export function fadeOut(el, duration = 150) {
  return new Promise((resolve) => {
    el.style.transition = `opacity ${duration}ms ease-out`;
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.display = 'none';
      el.style.transition = '';
      resolve();
    }, duration);
  });
}

