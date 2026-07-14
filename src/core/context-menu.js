// @ts-check

/**
 * @fileoverview
 * Context menu system.
 * Provides a reusable, customizable right-click menu component.
 * Supports separators, disabled items, submenus, and keyboard navigation.
 */

import { createElement, $ } from '../utils/dom.js';

/**
 * @typedef {Object} ContextMenuItem
 * @property {string} [label] - Menu item text.
 * @property {string} [icon] - Optional icon HTML.
 * @property {Function} [action] - Callback when clicked.
 * @property {boolean} [disabled] - If true, item cannot be clicked.
 * @property {boolean} [separator] - If true, renders a divider.
 * @property {Array<ContextMenuItem>} [children] - Submenu items.
 * @property {string} [shortcut] - Keyboard shortcut hint.
 */

/** @type {HTMLElement|null} */
let menuEl = null;
/** @type {HTMLElement|null} */
let menuItemsEl = null;

/** @type {*} */
let activeContext = null;

/** @returns {void} */
function hide() {
  if (!menuEl) return;
  menuEl.hidden = true;
  menuEl.classList.remove('context-menu--visible');
  activeContext = null;
}

/**
 * Get or create the context menu element.
 * @returns {HTMLElement|null}
 */
function getMenu() {
  if (!menuEl) {
    menuEl = document.getElementById('context-menu');
    menuItemsEl = document.getElementById('context-menu-items');
  }
  return menuEl;
}

/**
 * Render menu items into the menu element.
 * @param {Array<ContextMenuItem>} items
 * @returns {DocumentFragment}
 */
function renderItems(items) {
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    if (item.separator) {
      const sep = createElement('div', {
        className: 'context-menu__separator',
        attrs: { role: 'separator' },
      });
      fragment.appendChild(sep);
      return;
    }

    const btn = createElement('button', {
      className: 'context-menu__item',
      attrs: {
        role: 'menuitem',
        ...(item.disabled ? { disabled: '' } : {}),
      },
      events: {
        click: () => {
          if (!item.disabled && item.action) {
            item.action(activeContext);
            hide();
          }
        },
        mouseenter: () => {
          // Close sibling submenus
          menuEl && menuEl.querySelectorAll('.context-menu__item--open').forEach((el) => {
            el.classList.remove('context-menu__item--open');
          });
        },
      },
    });

    if (item.icon) {
      const iconEl = createElement('span', {
        className: 'context-menu__icon',
        html: item.icon,
      });
      btn.appendChild(iconEl);
    }

    const labelEl = createElement('span', {
      className: 'context-menu__label',
      text: item.label || '',
    });
    btn.appendChild(labelEl);

    if (item.shortcut) {
      const shortcutEl = createElement('span', {
        className: 'context-menu__shortcut',
        text: item.shortcut,
      });
      btn.appendChild(shortcutEl);
    }

    if (item.children) {
      const arrowEl = createElement('span', {
        className: 'context-menu__arrow',
        html: '<svg width="10" height="10" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
      });
      btn.appendChild(arrowEl);
    }

    if (item.disabled) {
      btn.classList.add('context-menu__item--disabled');
    }

    fragment.appendChild(btn);
  });

  return fragment;
}

/**
 * Show the context menu at the given position.
 * @param {MouseEvent} e - The triggering event.
 * @param {Array<ContextMenuItem>} items - Menu items.
 * @param {*} [context] - Contextual data passed to actions.
 * @returns {void}
 */
function show(e, items, context = null) {
  const menu = getMenu();
  if (!menu || !menuItemsEl) return;

  activeContext = context;
  menuItemsEl.innerHTML = '';
  menuItemsEl.appendChild(renderItems(items));

  // Position the menu
  const menuWidth = menu.offsetWidth || 160;
  const menuHeight = menu.offsetHeight || 200;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let x = e.clientX;
  let y = e.clientY;

  if (x + menuWidth > viewportWidth) {
    x = viewportWidth - menuWidth - 8;
  }
  if (y + menuHeight > viewportHeight) {
    y = viewportHeight - menuHeight - 8;
  }

  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.hidden = false;

  // Force reflow before adding visible class for transition
  menu.offsetHeight;
  menu.classList.add('context-menu--visible');
}

/**
 * Handle document click to close the menu.
 * @param {MouseEvent} e
 */
function onDocumentClick(e) {
  if (menuEl && !menuEl.contains(/** @type {Node} */ (e.target))) {
    hide();
  }
}

/**
 * Handle Escape key to close the menu.
 * @param {KeyboardEvent} e
 */
function onKeyDown(e) {
  if (e.key === 'Escape') {
    hide();
  }
}

/**
 * ContextMenu module.
 * @namespace
 */
export const ContextMenu = {
  /** Initialize the context menu system. */
  init() {
    getMenu();
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);
  },

  /**
   * Show a context menu.
   * @param {MouseEvent} e
   * @param {Array<ContextMenuItem>} items
   * @param {*} [context]
   */
  show(e, items, context = null) {
    e.preventDefault();
    e.stopPropagation();
    show(e, items, context);
  },

  /** Hide the context menu. */
  hide() {
    hide();
  },
};
