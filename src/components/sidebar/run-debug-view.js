// @ts-check

/**
 * @fileoverview
 * Run & Debug view component — mock debugger controls.
 * Shows debug configuration and run button.
 */

import { createElement, empty } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';

/**
 * RunDebugView component module.
 * @namespace
 */
export const RunDebugView = {
  /**
   * Render the Run & Debug view.
   * @param {HTMLElement} container
   */
  render(container) {
    empty(container);

    const header = createElement('div', { className: 'sidebar__header' });
    header.appendChild(createElement('span', { className: 'sidebar__title', text: 'RUN & DEBUG' }));
    container.appendChild(header);

    const rdHeader = createElement('div', { className: 'run-debug__header' });
    const runBtn = createElement('button', {
      className: 'run-debug__btn',
      html: `<span class="icon" aria-hidden="true">${ICONS.runDebug}</span> Start Debugging`,
      attrs: { 'aria-label': 'Start debugging' },
      events: { click: () => alert('Debugger simulation started.') },
    });
    rdHeader.appendChild(runBtn);
    container.appendChild(rdHeader);

    const emptyState = createElement('div', {
      className: 'empty-state',
      children: [
        createElement('span', { className: 'empty-state__icon', html: ICONS.runDebug }),
        createElement('div', { className: 'empty-state__title', text: 'No configurations' }),
        createElement('div', { className: 'empty-state__desc', text: 'Add a debug configuration to start debugging.' }),
      ],
    });
    container.appendChild(emptyState);
  },
};

