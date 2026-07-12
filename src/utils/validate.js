/**
 * @fileoverview
 * Validator utility — common validation checks.
 */

export function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

export function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function isHexColor(str) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(str);
}

export function isNumeric(str) {
  return /^-?\d+(\.\d+)?$/.test(str);
}

export function isAlpha(str) {
  return /^[a-zA-Z]+$/.test(str);
}

export function isAlphanumeric(str) {
  return /^[a-zA-Z0-9]+$/.test(str);
}
