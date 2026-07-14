// @ts-check

/**
 * @fileoverview
 * JSON utility helpers.
 */

export function safeParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function safeStringify(obj, fallback = '{}') {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return fallback;
  }
}

export function isJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

