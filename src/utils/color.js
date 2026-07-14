// @ts-check

/**
 * @fileoverview
 * Color utility helpers for theme manipulation.
 */

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function isLight(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 128;
}

