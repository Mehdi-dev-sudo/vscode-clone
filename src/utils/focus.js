/**
 * @fileoverview
 * Focus utility helpers.
 */

export function focusFirstFocusable(el) {
  const focusable = el.querySelector(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) focusable.focus();
}

export function focusLastFocusable(el) {
  const focusables = el.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusables.length) focusables[focusables.length - 1].focus();
}

export function getFocusableElements(el) {
  return el.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
}
