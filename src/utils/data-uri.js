/**
 * @fileoverview
 * Data URI utility for generating inline assets.
 */

export function toDataUri(svgString) {
  return 'data:image/svg+xml,' + encodeURIComponent(svgString);
}

export function svgToDataUri(svgString) {
  return toDataUri(svgString.replace(/\s+/g, ' ').trim());
}

export function cssToDataUri(css, mime = 'text/css') {
  return `data:${mime},${encodeURIComponent(css)}`;
}
