// @ts-check

/**
 * @fileoverview
 * Unit conversion utility helpers.
 */

export function pxToRem(px, base = 16) {
  return `${px / base}rem`;
}

export function remToPx(rem, base = 16) {
  return rem * base;
}

export function celsiusToFahrenheit(c) {
  return (c * 9 / 5) + 32;
}

export function fahrenheitToCelsius(f) {
  return (f - 32) * 5 / 9;
}

export function bytesToSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
}

