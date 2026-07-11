/**
 * @fileoverview
 * Sidebar component — manages the left panel that shows different views
 * (Explorer, Search, Source Control, Run & Debug, Extensions).
 * Delegates content rendering to each view module.
 */

import { eventBus } from '../../events/event-bus.js';
import { VIEWS, EVENTS } from '../../core/constants.js';
import { $, empty } from '../../utils/dom.js';
import { Explorer } from '../explorer/explorer.js';

/** @type {HTMLElement} */
let sidebarEl = null;

/** @type {HTMLElement} */
let contentEl = null;

/** Current view displayed in the sidebar. */
let currentView = VIEWS.EXPLORER;

/**
 * Render a view's content into the sidebar.
 * @param {string} viewId
 */
function showView(viewId) {
  if (!contentEl) return;
  currentView = viewId;

  // Show sidebar if hidden
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('app__sidebar--hidden');
  }

  empty(contentEl);

  switch (viewId) {
    case VIEWS.EXPLORER:
      Explorer.render(contentEl);
      break;
    case VIEWS.SEARCH:
      renderSearchView();
      break;
    case VIEWS.SOURCE_CONTROL:
      renderSourceControlView();
      break;
    case VIEWS.RUN_DEBUG:
      renderRunDebugView();
      break;
    case VIEWS.EXTENSIONS:
      renderExtensionsView();
      break;
    default:
      break;
  }
}

/**
 * Render the Search view.
 */
function renderSearchView() {
  import('../sidebar/search-view.js').then((m) => m.SearchView.render(contentEl));
}

/**
 * Render the Source Control view.
 */
function renderSourceControlView() {
  import('../sidebar/source-control-view.js').then((m) => m.SourceControlView.render(contentEl));
}

/**
 * Render the Run & Debug view.
 */
function renderRunDebugView() {
  import('../sidebar/run-debug-view.js').then((m) => m.RunDebugView.render(contentEl));
}

/**
 * Render the Extensions view.
 */
function renderExtensionsView() {
  import('../sidebar/extensions-view.js').then((m) => m.ExtensionsView.render(contentEl));
}

/**
 * Toggle sidebar visibility.
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
    eventBus.on(EVENTS.VIEW_CHANGED, (view) => {
      if (view === 'toggle-sidebar') {
        toggle();
        return;
      }

      const validViews = Object.values(VIEWS);
      if (validViews.includes(view)) {
        showView(view);
      }
    });

    // Show initial view
    showView(currentView);
  },
};
