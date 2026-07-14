// @ts-check

/**
 * @fileoverview
 * Async iterable utility helpers.
 */

export async function mapAsync(arr, fn) {
  return Promise.all(arr.map(fn));
}

export async function filterAsync(arr, fn) {
  const results = await Promise.all(arr.map(fn));
  return arr.filter((_, i) => results[i]);
}

export async function forEachAsync(arr, fn) {
  await Promise.all(arr.map(fn));
}

export async function series(arr, fn) {
  const results = [];
  for (const item of arr) {
    results.push(await fn(item));
  }
  return results;
}

