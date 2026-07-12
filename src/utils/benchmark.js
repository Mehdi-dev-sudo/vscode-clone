/**
 * @fileoverview
 * Benchmark utility for measuring performance.
 */

export function measure(label, fn) {
  const start = performance.now();
  const result = fn();
  const elapsed = (performance.now() - start).toFixed(2);
  console.log(`[Benchmark] ${label}: ${elapsed}ms`);
  return result;
}

export async function measureAsync(label, fn) {
  const start = performance.now();
  const result = await fn();
  const elapsed = (performance.now() - start).toFixed(2);
  console.log(`[Benchmark] ${label}: ${elapsed}ms`);
  return result;
}
