// @ts-check

/**
 * @fileoverview
 * Path utility helpers for file system operations.
 */

export function basename(path) {
  return path.split('/').pop() || path;
}

export function dirname(path) {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/') || '/';
}

export function extname(path) {
  const base = basename(path);
  const idx = base.lastIndexOf('.');
  return idx >= 0 ? base.slice(idx) : '';
}

export function join(...parts) {
  return parts.filter(Boolean).join('/').replace(/\/+/g, '/');
}

export function normalize(path) {
  return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

