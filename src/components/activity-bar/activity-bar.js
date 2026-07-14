// @ts-check

/**
 * @fileoverview
 * Activity Bar component — the vertical icon bar on the left.
 * Provides navigation between views: Explorer, Search, Source Control,
 * Run & Debug, Extensions, plus Settings/Theme at the bottom.
 */

import { eventBus } from '../../events/event-bus.js';
import { VIEWS, EVENTS } from '../../core/constants.js';
import { createElement } from '../../utils/dom.js';
import { ICONS, getIcon } from '../../assets/icons/codicons.js';

/** @type {Array<{id: string, icon: string, label: string}>} */
const VIEW_BUTTONS = [
  { id: VIEWS.EXPLORER, icon: ICONS.files, label: 'Explorer (Ctrl+Shift+E)' },
  { id: VIEWS.SEARCH, icon: ICONS.search, label: 'Search (Ctrl+Shift+F)' },
  { id: VIEWS.SOURCE_CONTROL, icon: ICONS.sourceControl, label: 'Source Control (Ctrl+Shift+G)' },
  { id: VIEWS.RUN_DEBUG, icon: ICONS.runDebug, label: 'Run & Debug (Ctrl+Shift+D)' },
  { id: VIEWS.EXTENSIONS, icon: ICONS.extensions, label: 'Extensions (Ctrl+Shift+X)' },
];

/** Currently active view ID. */
let activeView = VIEWS.EXPLORER;

/** Store button elements by ID. */
/** @type {Map<string, HTMLElement>} */
const buttons = new Map();

/** The activity bar container element. */
/** @type {HTMLElement|null} */
let container = null;

/**
 * Handle view switching when a button is clicked.
 * @param {string} viewId
 * @returns {void}
 */
function switchView(viewId) {
  if (viewId === activeView) {
    // Toggle sidebar visibility
    eventBus.emit(EVENTS.VIEW_CHANGED, 'toggle-sidebar');
    return;
  }

  activeView = viewId;
  updateActiveButton(viewId);
  eventBus.emit(EVENTS.VIEW_CHANGED, viewId);
}

/**
 * Update the active visual state of buttons.
 * @param {string} viewId
 * @returns {void}
 */
function updateActiveButton(viewId) {
  buttons.forEach((btn, id) => {
    btn.classList.toggle('activity-bar__btn--active', id === viewId);
    btn.setAttribute('aria-selected', id === viewId ? 'true' : 'false');
  });
}

/**
 * Create the activity bar DOM structure and attach it to the app.
 */
function render() {
  container = document.getElementById('activity-bar');
  if (!container) return;

  container.setAttribute('role', 'tablist');
  container.setAttribute('aria-label', 'Activity Bar');

  // Top section — view buttons
  const topSection = createElement('div', {
    className: 'activity-bar__top',
    attrs: { role: 'presentation' },
  });

  VIEW_BUTTONS.forEach((view) => {
    const btn = createElement('button', {
      className: `activity-bar__btn${view.id === activeView ? ' activity-bar__btn--active' : ''}`,
      attrs: {
        role: 'tab',
        'aria-selected': view.id === activeView ? 'true' : 'false',
        'aria-label': view.label,
        title: view.label,
        'data-view': view.id,
      },
      html: `<span class="icon" aria-hidden="true">${view.icon}</span>`,
      events: {
        click: () => switchView(view.id),
      },
    });
    topSection.appendChild(btn);
    buttons.set(view.id, btn);
  });

  container.appendChild(topSection);

  // Bottom section — settings, theme
  const bottomSection = createElement('div', {
    className: 'activity-bar__bottom',
    attrs: { role: 'presentation' },
  });

  const settingsBtn = createElement('button', {
    className: 'activity-bar__settings-btn',
    attrs: {
      'aria-label': 'Manage Settings',
      title: 'Settings',
    },
    html: `<span class="icon" aria-hidden="true">${getIcon('settings')}</span>`,
    events: {
      click: () => {
        eventBus.emit(EVENTS.COMMAND_EXECUTED, 'settings');
      },
    },
  });
  bottomSection.appendChild(settingsBtn);

  container.appendChild(bottomSection);
}

/**
 * ActivityBar component module.
 * @namespace
 */
export const ActivityBar = {
  /** Initialize the Activity Bar. */
  init() {
    render();

    // Listen for external view changes
    eventBus.on(EVENTS.VIEW_CHANGED, (/** @type {string} */ viewId) => {
      if (VIEW_BUTTONS.some((v) => v.id === viewId)) {
        activeView = viewId;
        updateActiveButton(viewId);
      }
    });
  },
};
