/**
 * @fileoverview
 * Array utility helpers.
 */

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function uniqueBy(arr, key) {
  const seen = new Set();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const val = item[key];
    (acc[val] = acc[val] || []).push(item);
    return acc;
  }, {});
}
