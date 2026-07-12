/**
 * @fileoverview
 * Accessibility utility helpers.
 */

export function announce(message) {
  const el = document.getElementById('aria-live-region');
  if (el) {
    el.textContent = '';
    requestAnimationFrame(() => { el.textContent = message; });
  }
}

export function focusFirst(el) {
  const focusable = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable) focusable.focus();
}

export function trapFocus(el) {
  const focusable = el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
