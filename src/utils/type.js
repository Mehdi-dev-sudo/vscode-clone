// @ts-check

/**
 * @fileoverview
 * Type checking utility helpers.
 */

export function isString(val) { return typeof val === 'string'; }
export function isNumber(val) { return typeof val === 'number' && !isNaN(val); }
export function isBoolean(val) { return typeof val === 'boolean'; }
export function isObject(val) { return val !== null && typeof val === 'object' && !Array.isArray(val); }
export function isArray(val) { return Array.isArray(val); }
export function isFunction(val) { return typeof val === 'function'; }
export function isUndefined(val) { return val === undefined; }
export function isNull(val) { return val === null; }
export function isEmpty(val) {
  if (isArray(val) || isString(val)) return val.length === 0;
  if (isObject(val)) return Object.keys(val).length === 0;
  return false;
}

