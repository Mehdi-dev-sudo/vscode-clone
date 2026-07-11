/**
 * @fileoverview
 * Tabs component — manages open editor tabs.
 * Supports: open, close, pin, reorder (drag & drop), active tab switching.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { createElement, empty, $ } from '../../utils/dom.js';
import { getItem, setItem } from '../../storage/local-storage.js';
import { STORAGE_KEYS } from '../../core/constants.js';
import { ICONS } from '../../assets/icons/codicons.js';

/**
 * @typedef {Object} TabData
 * @property {string} id
 * @property {string} name
 * @property {boolean} [pinned]
 * @property {string} [icon]
 */

/** @type {Array<TabData>} */
let tabs = [];

/** Currently active tab ID. */
let activeTabId = null;

/** @type {HTMLElement|null} */
let tabsBarEl = null;

/**
 * Persist tabs to localStorage.
 */
function persistTabs() {
  setItem(STORAGE_KEYS.OPEN_TABS, tabs);
}

/**
 * Render all tabs.
 */
function renderTabs() {
  if (!tabsBarEl) return;
  empty(tabsBarEl);

  if (tabs.length === 0) {
    tabsBarEl.appendChild(createElement('div', {
      className: 'tabs-bar__empty',
      text: 'No tabs open',
    }));
    return;
  }

  const fragment = document.createDocumentFragment();
  tabs.forEach((tab, index) => {
    const isActive = tab.id === activeTabId;
    const tabEl = createElement('div', {
      className: `tab${isActive ? ' tab--active' : ''}${tab.pinned ? ' tab--pinned' : ''}`,
      attrs: {
        role: 'tab',
        'aria-selected': isActive ? 'true' : 'false',
        'aria-label': tab.name,
        'data-id': tab.id,
        draggable: 'true',
        title: tab.name,
      },
      events: {
        click: () => activateTab(tab.id),
        dragstart: (e) => {
          e.dataTransfer.setData('text/plain', tab.id);
          tabEl.classList.add('tab--dragging');
        },
        dragend: () => tabEl.classList.remove('tab--dragging'),
        dragover: (e) => { e.preventDefault(); },
        drop: (e) => {
          e.preventDefault();
          const sourceId = e.dataTransfer.getData('text/plain');
          if (sourceId && sourceId !== tab.id) {
            reorderTab(sourceId, tab.id);
          }
        },
        contextmenu: (e) => {
          e.preventDefault();
          const items = [
            { label: 'Close', icon: ICONS.close, action: () => closeTab(tab.id) },
            { label: tab.pinned ? 'Unpin' : 'Pin', icon: ICONS.link, action: () => togglePin(tab.id) },
            { separator: true },
            { label: 'Close Others', action: () => closeOthers(tab.id) },
            { label: 'Close All', action: () => closeAll() },
          ];
          import('../../core/context-menu.js').then((m) =>
            m.ContextMenu.show(e, items, tab)
          );
        },
      },
    });

    const iconEl = createElement('span', {
      className: 'tab__icon',
      html: tab.icon || ICONS.file,
      attrs: { 'aria-hidden': 'true' },
    });
    tabEl.appendChild(iconEl);

    const label = createElement('span', {
      className: 'tab__label',
      text: tab.name,
    });
    tabEl.appendChild(label);

    const closeBtn = createElement('button', {
      className: 'tab__close-btn',
      html: ICONS.close,
      attrs: { 'aria-label': `Close ${tab.name}`, title: 'Close' },
      events: { click: (e) => { e.stopPropagation(); closeTab(tab.id); } },
    });
    tabEl.appendChild(closeBtn);

    fragment.appendChild(tabEl);
  });

  tabsBarEl.appendChild(fragment);

  // Scroll active tab into view
  const activeEl = tabsBarEl.querySelector('.tab--active');
  activeEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

/**
 * Switch to a tab by ID.
 * @param {string} id
 */
function activateTab(id) {
  const tab = tabs.find((t) => t.id === id);
  if (!tab) return;
  activeTabId = id;
  renderTabs();
  eventBus.emit(EVENTS.TAB_OPENED, tab);
  eventBus.emit(EVENTS.FILE_SELECTED, tab);
}

/**
 * Open a file in a new tab (or switch to existing).
 * @param {{id?: string, name: string}} file
 */
function openTab(file) {
  const id = file.id || file.name;
  const existing = tabs.find((t) => t.id === id);
  if (existing) {
    activateTab(id);
    return;
  }

  tabs.push({ id, name: file.name, pinned: false, icon: ICONS.file });
  activeTabId = id;
  persistTabs();
  renderTabs();
  eventBus.emit(EVENTS.TAB_OPENED, { id, name: file.name });
}

/**
 * Close a tab by ID.
 * @param {string} id
 */
function closeTab(id) {
  const idx = tabs.findIndex((t) => t.id === id);
  if (idx === -1) return;
  tabs.splice(idx, 1);

  if (activeTabId === id) {
    activeTabId = tabs.length > 0
      ? tabs[Math.min(idx, tabs.length - 1)].id
      : null;
  }

  persistTabs();
  renderTabs();
  eventBus.emit(EVENTS.TAB_CLOSED, { id });

  if (tabs.length === 0) {
    eventBus.emit(EVENTS.FILE_SELECTED, null);
  }
}

/**
 * Toggle pin state on a tab.
 * @param {string} id
 */
function togglePin(id) {
  const tab = tabs.find((t) => t.id === id);
  if (!tab) return;
  tab.pinned = !tab.pinned;
  persistTabs();
  renderTabs();
  eventBus.emit(EVENTS.TAB_PINNED, { id, pinned: tab.pinned });
}

/**
 * Close all tabs except the one with given ID.
 * @param {string} keepId
 */
function closeOthers(keepId) {
  tabs = tabs.filter((t) => t.id === keepId || t.pinned);
  activeTabId = keepId;
  persistTabs();
  renderTabs();
}

/**
 * Close all tabs.
 */
function closeAll() {
  const pinned = tabs.filter((t) => t.pinned);
  tabs = pinned;
  activeTabId = pinned.length > 0 ? pinned[0].id : null;
  persistTabs();
  renderTabs();
  if (tabs.length === 0) {
    eventBus.emit(EVENTS.FILE_SELECTED, null);
  }
}

/**
 * Reorder a tab by moving it before a target.
 * @param {string} sourceId
 * @param {string} targetId
 */
function reorderTab(sourceId, targetId) {
  const sourceIdx = tabs.findIndex((t) => t.id === sourceId);
  const targetIdx = tabs.findIndex((t) => t.id === targetId);
  if (sourceIdx === -1 || targetIdx === -1) return;

  const [tab] = tabs.splice(sourceIdx, 1);
  tabs.splice(targetIdx, 0, tab);
  persistTabs();
  renderTabs();
  eventBus.emit(EVENTS.TAB_REORDERED, { sourceId, targetId });
}

/**
 * Tabs component module.
 * @namespace
 */
export const Tabs = {
  /** Initialize the Tabs component. */
  init() {
    tabsBarEl = document.getElementById('tabs-bar');
    if (!tabsBarEl) return;

    // Restore persisted tabs
    const savedTabs = getItem(STORAGE_KEYS.OPEN_TABS, []);
    if (savedTabs.length > 0) {
      tabs = savedTabs;
      activeTabId = tabs[0].id;
    }

    renderTabs();

    // Listen for file opens
    eventBus.on(EVENTS.TAB_OPENED, (file) => {
      if (file?.name) openTab(file);
    });

    // Listen for tab close keyboard shortcut
    eventBus.on(EVENTS.TAB_CLOSED, (payload) => {
      if (payload === 'close-active') {
        if (activeTabId) closeTab(activeTabId);
      }
    });
  },

  /**
   * Open a file in a tab programmatically.
   * @param {{id?: string, name: string}} file
   */
  open(file) {
    openTab(file);
  },

  /**
   * Close a tab by ID.
   * @param {string} id
   */
  close(id) {
    closeTab(id);
  },

  /** Get currently active tab ID. */
  getActiveId() {
    return activeTabId;
  },

  /** Get all open tabs. */
  getTabs() {
    return [...tabs];
  },
};
