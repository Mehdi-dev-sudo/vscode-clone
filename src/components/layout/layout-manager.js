// @ts-check

/**
 * @fileoverview
 * Layout Manager — handles resizable sidebar and terminal panel.
 * Persists panel dimensions to localStorage.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS, STORAGE_KEYS, DIMENSIONS } from '../../core/constants.js';
import { getItem, setItem } from '../../storage/local-storage.js';
import { clamp } from '../../utils/dom.js';

/** @type {boolean} */
let isDragging = false;

/** @type {'sidebar'|'panel'|null} */
let dragType = null;

/** @type {number} */
let startPos = 0;

/** @type {number} */
let startSize = 0;

/**
 * Initialize sidebar resizing.
 */
function initSidebarResize() {
  const handle = document.getElementById('sidebar-resize-handle');
  const sidebar = document.getElementById('sidebar');
  if (!handle || !sidebar) return;

  handle.addEventListener('mousedown', (/** @type {MouseEvent} */ e) => {
    e.preventDefault();
    isDragging = true;
    dragType = 'sidebar';
    startPos = e.clientX;
    startSize = sidebar.offsetWidth;
    handle.classList.add('resize-handle--active');
    document.body.style.cursor = 'col-resize';
  });
}

/**
 * Initialize panel resizing.
 */
function initPanelResize() {
  const handle = document.getElementById('panel-resize-handle');
  const panel = document.getElementById('panel');
  if (!handle || !panel) return;

  handle.addEventListener('mousedown', (/** @type {MouseEvent} */ e) => {
    e.preventDefault();
    isDragging = true;
    dragType = 'panel';
    startPos = e.clientY;
    startSize = panel.offsetHeight;
    handle.classList.add('resize-handle--active');
    document.body.style.cursor = 'row-resize';
  });
}

/**
 * Handle mouse move during drag.
 * @param {MouseEvent} e
 */
function onMouseMove(e) {
  if (!isDragging || !dragType) return;

  if (dragType === 'sidebar') {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const delta = e.clientX - startPos;
    const newWidth = clamp(startSize + delta, DIMENSIONS.SIDEBAR_MIN_WIDTH, DIMENSIONS.SIDEBAR_MAX_WIDTH);
    sidebar.style.width = `${newWidth}px`;
    setItem(STORAGE_KEYS.SIDEBAR_WIDTH, newWidth);
  } else if (dragType === 'panel') {
    const panel = document.getElementById('panel');
    if (!panel) return;
    // Drag upward to increase panel height (mouse Y decreases)
    const delta = startPos - e.clientY;
    const newHeight = clamp(startSize + delta, DIMENSIONS.PANEL_MIN_HEIGHT, DIMENSIONS.PANEL_MAX_HEIGHT);
    panel.style.height = `${newHeight}px`;
    setItem(STORAGE_KEYS.PANEL_HEIGHT, newHeight);
  }
}

/**
 * Handle mouse up to end drag.
 */
function onMouseUp() {
  if (!isDragging) return;
  isDragging = false;
  document.body.style.cursor = '';
  document.querySelectorAll('.resize-handle--active').forEach((el) => {
    el.classList.remove('resize-handle--active');
  });

  const completedDragType = dragType;
  dragType = null;

  if (completedDragType === 'sidebar') {
    eventBus.emit(EVENTS.SIDEBAR_RESIZED, {});
  } else if (completedDragType === 'panel') {
    eventBus.emit(EVENTS.PANEL_RESIZED, {});
  }
}

/**
 * LayoutManager module.
 * @namespace
 */
export const LayoutManager = {
  /** Initialize layout managers. */
  init() {
    initSidebarResize();
    initPanelResize();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Handle Zen Mode toggle
    eventBus.on(EVENTS.ZEN_MODE_TOGGLED, (/** @type {string} */ payload) => {
      if (payload === 'zen') {
        document.getElementById('app')?.classList.toggle('app--zen');
      }
    });

    // Handle Fullscreen toggle
    eventBus.on(EVENTS.FULLSCREEN_TOGGLED, () => {
      const app = document.getElementById('app');
      if (app) {
        app.classList.toggle('app--fullscreen');
      }
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });

    // Title bar buttons
    document.getElementById('btn-zen-mode')?.addEventListener('click', () => {
      eventBus.emit(EVENTS.ZEN_MODE_TOGGLED, 'zen');
    });
    document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
      eventBus.emit(EVENTS.FULLSCREEN_TOGGLED);
    });

    // Panel close button
    document.getElementById('panel-close')?.addEventListener('click', () => {
      const panel = document.getElementById('panel');
      if (panel) panel.classList.toggle('app__panel--hidden');
    });
  },

  /**
   * Restore persisted layout dimensions.
   */
  restore() {
    const sidebarWidth = getItem(STORAGE_KEYS.SIDEBAR_WIDTH, DIMENSIONS.SIDEBAR_DEFAULT_WIDTH);
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.width = `${sidebarWidth}px`;
    }

    const panelHeight = getItem(STORAGE_KEYS.PANEL_HEIGHT, DIMENSIONS.PANEL_DEFAULT_HEIGHT);
    const panel = document.getElementById('panel');
    if (panel) {
      panel.style.height = `${panelHeight}px`;
    }
  },
};
