// @ts-check

/**
 * @fileoverview
 * Sidebar component — manages the left panel that shows different views
 * (Explorer, Search, Source Control, Run & Debug, Extensions).
 * Delegates content rendering to each view module.
 */

import { eventBus } from '../../events/event-bus.js';
import { VIEWS, EVENTS } from '../../core/constants.js';
import { createElement, empty } from '../../utils/dom.js';
import { Explorer } from '../explorer/explorer.js';

/** @type {HTMLElement|null} */
let sidebarEl = null;

/** @type {HTMLElement|null} */
let contentEl = null;

/** Current view displayed in the sidebar. */
let currentView = VIEWS.EXPLORER;

/**
 * Fade in the sidebar content element.
 * @param {HTMLElement} el
 */
function fadeIn(el) {
  el.style.opacity = '1';
  el.style.transform = 'translateX(0)';
}

/**
 * Safe dynamic import with error fallback.
 * @param {string} path
 * @param {HTMLElement} el
 * @param {(mod: {[key:string]:*}) => void} onLoad
 */
function loadView(path, el, onLoad) {
  import(path).then((mod) => { onLoad(mod); fadeIn(el); }).catch((err) => {
    console.error('[Sidebar] Failed to load view:', err);
    empty(el);
    el.appendChild(createElement('div', { className: 'empty-state', children: [
      createElement('span', { className: 'empty-state__title', text: 'Failed to load view' }),
      createElement('span', { className: 'empty-state__desc', text: err.message || 'Unknown error' }),
    ]}));
    fadeIn(el);
  });
}

/**
 * Render a view's content into the sidebar.
 * @param {string} viewId
 */
function showView(viewId) {
  if (!contentEl) return;
  /** @type {HTMLElement} */
  const el = contentEl;
  currentView = viewId;

  // Show sidebar if hidden
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('app__sidebar--hidden');
  }

  // Fade transition between views
  el.style.opacity = '0';
  el.style.transform = 'translateX(-4px)';
  el.style.transition = 'opacity 0.15s ease, transform 0.15s ease';

  requestAnimationFrame(() => {
    empty(el);

    switch (viewId) {
      case VIEWS.EXPLORER:
        Explorer.render(el);
        fadeIn(el);
        break;
      case VIEWS.SEARCH:
        loadView('../sidebar/search-view.js', el, (m) => m.SearchView.render(el));
        break;
      case VIEWS.SOURCE_CONTROL:
        loadView('../sidebar/source-control-view.js', el, (m) => m.SourceControlView.render(el));
        break;
      case VIEWS.RUN_DEBUG:
        loadView('../sidebar/run-debug-view.js', el, (m) => m.RunDebugView.render(el));
        break;
      case VIEWS.EXTENSIONS:
        loadView('../sidebar/extensions-view.js', el, (m) => m.ExtensionsView.render(el));
        break;
      case 'settings':
        loadView('../sidebar/settings-view.js', el, (m) => m.SettingsView.render(el));
        break;
      case 'keyboard-shortcuts':
        loadView('../sidebar/keyboard-shortcuts-view.js', el, (m) => m.KeyboardShortcutsView.render(el));
        break;
      case 'git-history':
        loadView('../sidebar/git-view.js', el, (m) => m.GitView.render(el));
        break;
      default:
        fadeIn(el);
        break;
    }
  });
}

/**
 * Toggle sidebar visibility.
 * @returns {void}
 */
function toggle() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const isHidden = sidebar.classList.toggle('app__sidebar--hidden');
  eventBus.emit(EVENTS.SIDEBAR_RESIZED, { visible: !isHidden });
}

/**
 * Sidebar component module.
 * @namespace
 */
export const Sidebar = {
  /** Initialize the Sidebar. */
  init() {
    sidebarEl = document.getElementById('sidebar');
    contentEl = document.getElementById('sidebar-content');
    if (!sidebarEl || !contentEl) return;

    // Listen for view changes from Activity Bar or keyboard
    eventBus.on(EVENTS.VIEW_CHANGED, (/** @type {string} */ view) => {
      if (view === 'toggle-sidebar') {
        toggle();
        return;
      }

      const validViews = [...Object.values(VIEWS), 'settings', 'keyboard-shortcuts', 'git-history'];
      if (validViews.includes(view)) {
        showView(view);
      }
    });

    // Handle special commands from command palette
    eventBus.on(EVENTS.COMMAND_EXECUTED, (/** @type {string} */ cmd) => {
      if (cmd === 'settings') {
        showView('settings');
      } else if (cmd === 'keyboard-shortcuts') {
        showView('keyboard-shortcuts');
      }
    });

    // Show initial view
    showView(currentView);
  },
};
