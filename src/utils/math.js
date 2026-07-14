// @ts-check

/**
 * @fileoverview
 * Math utility helpers.
 */

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

