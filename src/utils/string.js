/**
 * @fileoverview
 * String utility helpers.
 */

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function kebabToPascal(str) {
  return str.split('-').map(capitalize).join('');
}

export function truncateMiddle(str, maxLen = 30) {
  if (str.length <= maxLen) return str;
  const half = Math.floor((maxLen - 3) / 2);
  return str.slice(0, half) + '...' + str.slice(str.length - half);
}
