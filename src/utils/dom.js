// @ts-check

/**
 * @fileoverview
 * Reusable DOM manipulation utilities.
 * Every DOM creation, query, or mutation should go through these helpers
 * to ensure consistency and avoid repetition.
 */

/**
 * @typedef {Object} ElementOptions
 * @property {Object<string,string>} [attrs] - Attribute key/value pairs.
 * @property {Object<string,string>} [style] - Inline style key/value pairs.
 * @property {string|Array<string>} [className] - Class name(s).
 * @property {string} [text] - Text content.
 * @property {string} [html] - Inner HTML.
 * @property {Array<Element|string>} [children] - Child elements or strings.
 * @property {Object<string,Function>} [events] - Event listeners.
 * @property {Object<string,string>} [dataset] - data-* attributes.
 */

/**
 * Create an HTML element with attributes and children.
 * @param {string} tag - HTML tag name.
 * @param {ElementOptions} [options] - Element configuration.
 * @returns {HTMLElement}
 */
export function createElement(tag, options = {}) {
  const el = document.createElement(tag);

  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      el.setAttribute(key, value);
    }
  }

  if (options.style) {
    for (const [key, value] of Object.entries(options.style)) {
      /** @type {{[key: string]: string}} */ (/** @type {unknown} */ (el.style))[key] = value;
    }
  }

  if (options.className) {
    const classes = Array.isArray(options.className)
      ? options.className
      : options.className.split(' ');
    el.classList.add(...classes.filter(Boolean));
  }

  if (options.text) {
    el.textContent = options.text;
  }

  if (options.html) {
    el.innerHTML = options.html;
  }

  if (options.children) {
    for (const child of options.children) {
      el.append(child);
    }
  }

  if (options.events) {
    for (const [event, handler] of Object.entries(options.events)) {
      el.addEventListener(event, /** @type {EventListener} */ (handler));
    }
  }

  if (options.dataset) {
    for (const [key, value] of Object.entries(options.dataset)) {
      el.dataset[key] = value;
    }
  }

  return el;
}

/**
 * Create an SVG icon element from an inline SVG string.
 * @param {string} svgContent - The raw SVG markup.
 * @param {string} [className] - Optional class name.
 * @returns {HTMLElement}
 */
export function createIcon(svgContent, className = '') {
  const wrapper = createElement('span', {
    className: `icon ${className}`.trim(),
    html: svgContent,
    attrs: { 'aria-hidden': 'true', role: 'img' },
  });
  wrapper.querySelector('svg')?.setAttribute('focusable', 'false');
  return wrapper;
}

/**
 * Query a single element by selector within a parent.
 * @param {string} selector
 * @param {Element|Document} [context=document]
 * @returns {Element|null}
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query all elements matching a selector within a parent.
 * @param {string} selector
 * @param {Element|Document} [context=document]
 * @returns {NodeListOf<Element>}
 */
export function $$(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Empty an element's children efficiently.
 * @param {Element} el
 */
export function empty(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

/**
 * Insert an element after a reference element.
 * @param {Element} el - Element to insert.
 * @param {Element} ref - Reference element.
 */
export function insertAfter(el, ref) {
  ref.parentNode?.insertBefore(el, ref.nextSibling);
}

/**
 * Toggle a class on an element.
 * @param {Element} el
 * @param {string} className
 * @param {boolean} [force]
 */
export function toggleClass(el, className, force) {
  el.classList.toggle(className, force);
}

/**
 * Clamp a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function call.
 * @param {Function} fn
 * @param {number} delay - Milliseconds.
 * @returns {Function}
 */
export function debounce(fn, delay) {
  /** @type {number|null} */
  let timer = null;
  /**
   * @this {*}
   * @param {...*} args
   */
  function debounced(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  }
  return debounced;
}

/**
 * Escape HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * Generate a unique ID.
 * @returns {string}
 */
export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
