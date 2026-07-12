/**
 * @fileoverview
 * Random utility helpers.
 */

export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

export function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function randomBoolean() {
  return Math.random() > 0.5;
}
