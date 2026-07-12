/**
 * @fileoverview
 * Media query utility helpers.
 */

const cache = new Map();

export function matchQuery(query) {
  if (cache.has(query)) return cache.get(query);
  const mq = window.matchMedia(query);
  cache.set(query, mq);
  return mq;
}

export function onQueryChange(query, callback) {
  const mq = matchQuery(query);
  const handler = (e) => callback(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

export function isDarkMode() {
  return matchQuery('(prefers-color-scheme: dark)').matches;
}

export function isReducedMotion() {
  return matchQuery('(prefers-reduced-motion: reduce)').matches;
}
