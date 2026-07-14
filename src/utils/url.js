// @ts-check

/**
 * @fileoverview
 * URL utility helpers.
 */

export function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export function setQueryParam(name, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.replaceState({}, '', url);
}

export function removeQueryParam(name) {
  const url = new URL(window.location.href);
  url.searchParams.delete(name);
  window.history.replaceState({}, '', url);
}

