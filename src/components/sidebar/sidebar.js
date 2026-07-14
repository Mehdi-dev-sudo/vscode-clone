// @ts-check

/**
 * @fileoverview
 * Sidebar component — manages the left panel that shows different views
 * (Explorer, Search, Source Control, Run & Debug, Extensions).
 * Delegates content rendering to each view module.
 */

import { eventBus } from '../../events/event-bus.js';
import { VIEWS, EVENTS } from '../../core/constants.js';
import { empty } from '../../utils/dom.js';
import { Explorer } from '../explorer/explorer.js';

/** @type {HTMLElement|null} */
let sidebarEl = null;

/** @type {HTMLElement|null} */
let contentEl = null;

/** Current view displayed in the sidebar. */
let currentView = VIEWS.EXPLORER;

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

  empty(el);

  switch (viewId) {
    case VIEWS.EXPLORER:
      Explorer.render(el);
      break;
    case VIEWS.SEARCH:
      import('../sidebar/search-view.js').then((m) => m.SearchView.render(el));
      break;
    case VIEWS.SOURCE_CONTROL:
      import('../sidebar/source-control-view.js').then((m) => m.SourceControlView.render(el));
      break;
    case VIEWS.RUN_DEBUG:
      import('../sidebar/run-debug-view.js').then((m) => m.RunDebugView.render(el));
      break;
    case VIEWS.EXTENSIONS:
      import('../sidebar/extensions-view.js').then((m) => m.ExtensionsView.render(el));
      break;
    case 'settings':
      import('../sidebar/settings-view.js').then((m) => m.SettingsView.render(el));
      break;
    case 'keyboard-shortcuts':
      import('../sidebar/keyboard-shortcuts-view.js').then((m) => m.KeyboardShortcutsView.render(el));
      break;
    case 'git-history':
      import('../sidebar/git-view.js').then((m) => m.GitView.render(el));
      break;
    default:
      break;
  }
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
/**
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
