/**
 * @fileoverview
 * Environment detection helpers.
 */

export const isBrowser = typeof window !== 'undefined';
export const isTouchDevice = isBrowser && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
export const isMac = isBrowser && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
export const isWindows = isBrowser && navigator.platform.toUpperCase().indexOf('WIN') >= 0;
export const isLinux = isBrowser && navigator.platform.toUpperCase().indexOf('LINUX') >= 0;

export function getPlatform() {
  if (isMac) return 'mac';
  if (isWindows) return 'windows';
  if (isLinux) return 'linux';
  return 'unknown';
}
