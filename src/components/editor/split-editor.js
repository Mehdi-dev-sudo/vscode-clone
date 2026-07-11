/**
 * @fileoverview
 * Split Editor component — enables side-by-side editing.
 * Supports up to 3 splits: left, right, and bottom.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { createElement, empty, $ } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';

/** @type {Array<{id: string, fileName: string, content: string}>} */
let splits = [];

/** @type {number} */
let activeSplitIndex = 0;

/** @type {HTMLElement|null} */
let editorContentEl = null;

/**
 * Create a split editor container.
 * @param {number} index
 * @returns {HTMLElement}
 */
function createSplitPane(index) {
  const pane = createElement('div', {
    className: 'editor__split-pane',
    attrs: { 'data-split': index, role: 'region', 'aria-label': `Editor split ${index + 1}` },
    style: { flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' },
  });

  const header = createElement('div', {
    className: 'editor__split-header',
    style: {
      display: 'flex', alignItems: 'center', padding: '2px 8px',
      backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)',
      fontSize: '12px', color: 'var(--text-secondary)',
    },
    children: [
      createElement('span', { text: splits[index]?.fileName || 'Untitled' }),
      createElement('div', {
        style: { marginLeft: 'auto', display: 'flex', gap: '4px' },
        children: [
          createElement('button', {
            className: 'sidebar__action-btn',
            html: ICONS.close,
            attrs: { 'aria-label': 'Close split', title: 'Close Split' },
            events: { click: () => removeSplit(index) },
          }),
        ],
      }),
    ],
  });

  const body = createElement('div', {
    className: 'editor__split-body',
    style: { flex: '1', overflow: 'auto', padding: '4px 16px', fontFamily: 'var(--font-family-monospace)', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre', color: 'var(--text-primary)' },
    attrs: { contenteditable: 'true', spellcheck: 'false' },
    text: splits[index]?.content || '',
  });

  pane.append(header, body);
  return pane;
}

/**
 * Add a new split with the given file content.
 * @param {string} fileName
 * @param {string} content
 */
function addSplit(fileName, content) {
  const id = `split-${Date.now()}`;
  splits.push({ id, fileName, content });
  activeSplitIndex = splits.length - 1;
  renderSplits();
  eventBus.emit('split:added', { id, fileName });
}

/**
 * Remove a split by index.
 * @param {number} index
 */
function removeSplit(index) {
  if (splits.length <= 1) return;
  splits.splice(index, 1);
  activeSplitIndex = Math.min(activeSplitIndex, splits.length - 1);
  renderSplits();
}

/**
 * Render all split panes.
 */
function renderSplits() {
  if (!editorContentEl) return;
  // Find the split container or create it
  let splitContainer = editorContentEl.querySelector('.editor__splits');
  if (!splitContainer) {
    splitContainer = createElement('div', {
      className: 'editor__splits',
      style: { display: 'flex', flex: '1', minHeight: '0', overflow: 'hidden' },
    });
    editorContentEl.appendChild(splitContainer);
  }

  empty(splitContainer);

  if (splits.length === 0) {
    splitContainer.remove();
    return;
  }

  splits.forEach((_, i) => {
    if (i > 0) {
      const divider = createElement('div', {
        className: 'editor__split-divider',
        style: {
          width: '4px', cursor: 'col-resize', backgroundColor: 'var(--border-primary)',
          flexShrink: '0',
        },
      });
      splitContainer.appendChild(divider);
    }
    splitContainer.appendChild(createSplitPane(i));
  });
}

/**
 * SplitEditor component module.
 * @namespace
 */
export const SplitEditor = {
  /**
   * Initialize the Split Editor.
   */
  init() {
    editorContentEl = document.getElementById('editor-content');

    eventBus.on(EVENTS.COMMAND_EXECUTED, (payload) => {
      if (payload === 'split-editor') {
        const currentFile = document.querySelector('.tabs-bar .tab--active .tab__label');
        addSplit(currentFile?.textContent || 'untitled', '// Split editor content\n');
      }
    });
  },

  /**
   * Open a file in a split pane.
   * @param {string} fileName
   * @param {string} content
   */
  open(fileName, content) {
    addSplit(fileName, content);
  },

  /**
   * Close split by index.
   * @param {number} index
   */
  close(index) {
    removeSplit(index);
  },
};
