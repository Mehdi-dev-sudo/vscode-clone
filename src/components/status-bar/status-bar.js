/**
 * @fileoverview
 * Status Bar component — the bottom bar showing editor state.
 * Displays: branch, problems count, line/col, indentation, encoding,
 * language, feedback, and theme information.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { createElement, empty } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';

/** @type {HTMLElement|null} */
let statusBarEl = null;

/** @type {HTMLElement|null} */
let leftEl = null;

/** @type {HTMLElement|null} */
let rightEl = null;

/**
 * Render the status bar.
 */
function render() {
  if (!statusBarEl) return;
  empty(statusBarEl);

  leftEl = createElement('div', { className: 'status-bar__left' });
  rightEl = createElement('div', { className: 'status-bar__right' });

  // Left items
  const branchItem = createElement('div', {
    className: 'status-bar__item',
    html: `<span class="icon" aria-hidden="true">${ICONS.gitBranch}</span> main`,
    attrs: { title: 'main (Git branch)', 'aria-label': 'Git branch: main' },
  });
  leftEl.appendChild(branchItem);

  const problemsItem = createElement('div', {
    className: 'status-bar__item',
    html: `<span class="icon" aria-hidden="true">${ICONS.error}</span> 0`,
    attrs: { title: 'No problems detected', 'aria-label': 'No problems' },
  });
  leftEl.appendChild(problemsItem);

  const infoItem = createElement('div', {
    className: 'status-bar__item',
    html: `<span class="icon" aria-hidden="true">${ICONS.info}</span>`,
    attrs: { title: 'No warnings', 'aria-label': 'No warnings' },
  });
  leftEl.appendChild(infoItem);

  // Right items
  const cursorItem = createElement('div', {
    className: 'status-bar__item',
    text: 'Ln 1, Col 1',
    attrs: { title: 'Cursor position', 'aria-label': 'Line 1, Column 1' },
  });
  rightEl.appendChild(cursorItem);

  const indentItem = createElement('div', {
    className: 'status-bar__item',
    text: 'Spaces: 2',
    attrs: { title: 'Indentation', 'aria-label': 'Spaces: 2' },
  });
  rightEl.appendChild(indentItem);

  const eolItem = createElement('div', {
    className: 'status-bar__item',
    text: 'LF',
    attrs: { title: 'Line ending', 'aria-label': 'Line Feed' },
  });
  rightEl.appendChild(eolItem);

  const encodingItem = createElement('div', {
    className: 'status-bar__item',
    text: 'UTF-8',
    attrs: { title: 'File encoding', 'aria-label': 'UTF-8 Encoding' },
  });
  rightEl.appendChild(encodingItem);

  const langItem = createElement('div', {
    className: 'status-bar__item',
    text: 'JavaScript',
    attrs: { title: 'Select language mode', 'aria-label': 'Language: JavaScript' },
  });
  rightEl.appendChild(langItem);

  const themeItem = createElement('div', {
    className: 'status-bar__item',
    text: 'Dark+',
    attrs: { title: 'Select theme', 'aria-label': 'Theme: Dark+' },
    events: {
      click: () => eventBus.emit(EVENTS.COMMAND_EXECUTED, 'theme-creator'),
    },
  });
  rightEl.appendChild(themeItem);

  const zoomItem = createElement('div', {
    className: 'status-bar__item',
    text: '100%',
    attrs: { title: 'Zoom level', 'aria-label': 'Zoom: 100%' },
  });
  rightEl.appendChild(zoomItem);

  const feedbackItem = createElement('div', {
    className: 'status-bar__item',
    html: `<span class="icon" aria-hidden="true">${ICONS.feedback}</span>`,
    attrs: { title: 'Provide feedback', 'aria-label': 'Provide feedback' },
    events: { click: () => window.open('https://github.com', '_blank') },
  });
  rightEl.appendChild(feedbackItem);

  statusBarEl.append(leftEl, rightEl);
}

/**
 * StatusBar component module.
 * @namespace
 */
export const StatusBar = {
  /** Initialize the Status Bar. */
  init() {
    statusBarEl = document.getElementById('status-bar');
    if (!statusBarEl) return;
    statusBarEl.classList.add('status-bar');
    render();
  },
};
