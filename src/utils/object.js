/**
 * @fileoverview
 * Object utility helpers.
 */

export function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}

export function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function merge(target, ...sources) {
  return Object.assign(target, ...sources);
}
