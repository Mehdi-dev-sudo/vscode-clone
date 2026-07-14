// @ts-check

/**
 * @fileoverview
 * Source Control view component — Git integration mock.
 * Displays changes, staging area, and commit message input.
 */

import { createElement, empty } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';

/**
 * SourceControlView component module.
 * @namespace
 */
export const SourceControlView = {
  /**
   * Render the Source Control view.
   * @param {HTMLElement} container
   */
  render(container) {
    empty(container);

    const header = createElement('div', { className: 'sidebar__header' });
    header.appendChild(createElement('span', { className: 'sidebar__title', text: 'SOURCE CONTROL' }));
    container.appendChild(header);

    const scHeader = createElement('div', { className: 'source-control__header' });

    const messageInput = createElement('textarea', {
      className: 'source-control__message-input',
      attrs: {
        placeholder: 'Message (press Ctrl+Enter to commit)',
        'aria-label': 'Commit message',
        rows: '3',
      },
    });
    scHeader.appendChild(messageInput);

    const actions = createElement('div', { className: 'source-control__actions' });
    const commitBtn = createElement('button', {
      className: 'source-control__btn',
      text: 'Commit',
      attrs: { 'aria-label': 'Commit changes' },
      events: { click: () => alert('Commit would be made in real environment.') },
    });
    const refreshBtn = createElement('button', {
      className: 'source-control__btn source-control__btn--secondary',
      text: 'Refresh',
    });
    actions.append(commitBtn, refreshBtn);
    scHeader.appendChild(actions);

    container.appendChild(scHeader);

    // Empty changes state
    const emptyState = createElement('div', {
      className: 'empty-state',
      children: [
        createElement('span', { className: 'empty-state__icon', html: ICONS.sourceControl }),
        createElement('div', { className: 'empty-state__title', text: 'No changes yet' }),
        createElement('div', { className: 'empty-state__desc', text: 'Edit files to see changes here.' }),
      ],
    });
    container.appendChild(emptyState);
  },
};

