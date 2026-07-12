/**
 * @fileoverview
 * Storage utility — simplified wrapper around localStorage with size limit.
 */

import { getItem, setItem, removeItem } from '../storage/local-storage.js';

const PREFIX = 'vscode-clone:';

export function getPrefixed(key) {
  return getItem(PREFIX + key);
}

export function setPrefixed(key, value) {
  return setItem(PREFIX + key, value);
}

export function removePrefixed(key) {
  return removeItem(PREFIX + key);
}

export function getKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(PREFIX)) keys.push(key.slice(PREFIX.length));
  }
  return keys;
}
