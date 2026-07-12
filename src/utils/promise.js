/**
 * @fileoverview
 * Promise utility helpers.
 */

export function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms));
}

export function withTimeout(promise, ms) {
  return Promise.race([promise, timeout(ms)]);
}

export function retry(fn, attempts = 3, delay = 300) {
  return fn().catch((err) => {
    if (attempts <= 1) throw err;
    return new Promise((resolve) => setTimeout(resolve, delay))
      .then(() => retry(fn, attempts - 1, delay));
  });
}
