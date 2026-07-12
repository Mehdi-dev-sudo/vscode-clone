/**
 * @fileoverview
 * Browser detection helpers.
 */

export function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Safari')) return 'safari';
  if (ua.includes('Edge')) return 'edge';
  return 'unknown';
}

export function isMobile() {
  return window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024);
}

export function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
