// @ts-check

/**
 * @fileoverview
 * Debounced resize observer utility.
 */

export function onResize(el, callback, delay = 150) {
  let timer;
  const observer = new ResizeObserver((entries) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(entries[0]), delay);
  });
  observer.observe(el);
  return () => observer.disconnect();
}

export function onMutation(el, callback, options = { childList: true, subtree: true }) {
  const observer = new MutationObserver(callback);
  observer.observe(el, options);
  return () => observer.disconnect();
}

