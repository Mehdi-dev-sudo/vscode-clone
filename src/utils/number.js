// @ts-check

/**
 * @fileoverview
 * Number utility helpers.
 */

export function toFixed(num, decimals = 2) {
  return Number(num.toFixed(decimals));
}

export function toPercentage(num, total) {
  if (total === 0) return 0;
  return (num / total) * 100;
}

export function toOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

