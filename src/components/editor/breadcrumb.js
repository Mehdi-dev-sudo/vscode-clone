/**
 * @fileoverview
 * Breadcrumb component — shows the file path with clickable segments.
 * Each segment can be clicked to navigate to that directory level.
 */

import { createElement, empty } from '../../utils/dom.js';
import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { ICONS } from '../../assets/icons/codicons.js';

/** @type {HTMLElement|null} */
let breadcrumbEl = null;

/**
 * Update the breadcrumb with a file path.
 * @param {string} filePath - Full file path (e.g. "src/components/app.js")
 * @returns {void}
 */
export function updateBreadcrumb(filePath) {
  if (!breadcrumbEl) return;
  empty(breadcrumbEl);

  if (!filePath) {
    breadcrumbEl.style.display = 'none';
    return;
  }

  breadcrumbEl.style.display = 'flex';
  const parts = filePath.split('/');

  // Workspace root
  const root = createElement('span', {
    className: 'breadcrumb__item',
    html: `<span class="icon" aria-hidden="true" style="margin-right:4px">${ICONS.folder}</span> workspace`,
    attrs: { title: 'workspace' },
    events: {
      click: () => eventBus.emit(EVENTS.VIEW_CHANGED, 'explorer'),
    },
  });
  breadcrumbEl.appendChild(root);

  parts.forEach((part, i) => {
    // Separator
    const sep = createElement('span', {
      className: 'breadcrumb__separator',
      html: '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
      attrs: { 'aria-hidden': 'true' },
    });
    breadcrumbEl.appendChild(sep);

    const isLast = i === parts.length - 1;
    const item = createElement('span', {
      className: `breadcrumb__item${isLast ? '' : ''}`,
      text: part,
      attrs: { title: parts.slice(0, i + 1).join('/') },
      events: isLast ? {} : {
        click: () => {
          // Navigate to this directory level in explorer
          eventBus.emit(EVENTS.VIEW_CHANGED, 'explorer');
        },
      },
    });
    breadcrumbEl.appendChild(item);
  });
}

/**
 * Initialize the breadcrumb component.
 */
export function initBreadcrumb() {
  breadcrumbEl = document.getElementById('breadcrumb');
  if (breadcrumbEl) {
    breadcrumbEl.style.display = 'none';
  }
}
