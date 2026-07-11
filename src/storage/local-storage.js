/**
 * @fileoverview
 * LocalStorage abstraction layer.
 * Handles serialization, deserialization, and fallback for environments
 * where localStorage is unavailable.
 */

/** Checks if localStorage is available. */
const STORAGE_AVAILABLE = (() => {
  try {
    const key = '__test__';
    localStorage.setItem(key, '1');
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
})();

/** In-memory fallback when localStorage is unavailable. */
const memoryStore = new Map();

/**
 * Read a value from storage.
 * @param {string} key
 * @param {*} [fallback] - Default value if key is missing.
 * @returns {*}
 */
export function getItem(key, fallback = null) {
  if (!STORAGE_AVAILABLE) {
    return memoryStore.has(key) ? memoryStore.get(key) : fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Write a value to storage.
 * @param {string} key
 * @param {*} value - Will be JSON-serialized.
 */
export function setItem(key, value) {
  if (!STORAGE_AVAILABLE) {
    memoryStore.set(key, value);
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[Storage] Failed to write', key, e);
  }
}

/**
 * Remove a key from storage.
 * @param {string} key
 */
export function removeItem(key) {
  if (!STORAGE_AVAILABLE) {
    memoryStore.delete(key);
    return;
  }
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('[Storage] Failed to remove', key, e);
  }
}

/**
 * Clear all application storage (keys prefixed with `vscode-clone:`).
 */
export function clearAppStorage() {
  if (!STORAGE_AVAILABLE) {
    for (const key of memoryStore.keys()) {
      if (key.startsWith('vscode-clone:')) memoryStore.delete(key);
    }
    return;
  }
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('vscode-clone:')) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.warn('[Storage] Failed to clear app storage', e);
  }
}
