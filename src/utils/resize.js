// @ts-check

/**
 * @fileoverview
 * Throttle-able resize handler utility.
 */

const handlers = new Map();

export function onWindowResize(id, handler, throttleMs = 100) {
  let ticking = false;
  const wrapped = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handler();
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('resize', wrapped);
  handlers.set(id, wrapped);
  return () => window.removeEventListener('resize', wrapped);
}

export function offWindowResize(id) {
  const handler = handlers.get(id);
  if (handler) {
    window.removeEventListener('resize', handler);
    handlers.delete(id);
  }
}

