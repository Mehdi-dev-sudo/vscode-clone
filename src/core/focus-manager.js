// @ts-check

/**
 * @fileoverview
 * Focus Manager — manages focus ring styles and keyboard tab navigation
 * across the application. Ensures accessible focus indicators.
 */

/**
 * Initialize focus manager to handle :focus-visible polyfill behavior.
 * @returns {void}
 */
export function initFocusManager() {
  document.addEventListener('keydown', (/** @type {KeyboardEvent} */ e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  // Add focus-visible polyfill logic
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-navigation *:focus {
      outline: 1px solid var(--border-focus) !important;
      outline-offset: -1px !important;
    }
    .keyboard-navigation *:focus:not(:focus-visible) {
      outline: 1px solid var(--border-focus) !important;
    }
  `;
  document.head.appendChild(style);
}
