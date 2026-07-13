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

/** @type {{ isDragging: boolean, dividerIndex: number, startX: number, startWidths: number[] }|null} */
let resizeState = null;

/**
 * Create an interactive split divider.
 * @param {number} index - Divider position (between pane index and index+1).
 * @returns {HTMLElement}
 */
function createDivider(index) {
  const divider = createElement('div', {
    className: 'editor__split-divider',
    attrs: { 'data-divider': index },
    style: { width: '4px', cursor: 'col-resize', backgroundColor: 'var(--border-primary)', flexShrink: '0', position: 'relative', zIndex: '1' },
  });

  divider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const container = editorContentEl?.querySelector('.editor__splits');
    if (!container) return;
    container.classList.add('editor__splits--resizing');
    divider.classList.add('editor__split-divider--active');
    const panes = container.querySelectorAll('.editor__split-pane');
    const startWidths = Array.from(panes).map((p) => p.getBoundingClientRect().width);
    resizeState = { isDragging: true, dividerIndex: index, startX: e.clientX, startWidths, container, divider };
  });

  return divider;
}

/**
 * Handle mouse move for divider resize.
 * @param {MouseEvent} e
 */
function onDividerMouseMove(e) {
  if (!resizeState || !resizeState.isDragging) return;
  const container = editorContentEl?.querySelector('.editor__splits');
  if (!container) return;
  const panes = container.querySelectorAll('.editor__split-pane');
  if (panes.length <= resizeState.dividerIndex) return;
  const dx = e.clientX - resizeState.startX;
  const leftWidth = Math.max(100, resizeState.startWidths[resizeState.dividerIndex - 1] + dx);
  const rightWidth = Math.max(100, resizeState.startWidths[resizeState.dividerIndex] - dx);
  panes[resizeState.dividerIndex - 1].style.flex = 'none';
  panes[resizeState.dividerIndex - 1].style.width = `${leftWidth}px`;
  panes[resizeState.dividerIndex].style.flex = 'none';
  panes[resizeState.dividerIndex].style.width = `${rightWidth}px`;
}

/**
 * Remove all splits except the one at the given index.
 * @param {number} keepIndex
 */
function closeOtherSplits(keepIndex) {
  splits = [splits[keepIndex]];
  activeSplitIndex = 0;
  renderSplits();
}

/**
 * Add a new split to the right of the current one.
 * @param {number} index
 */
function splitRight(index) {
  const current = splits[index];
  if (current) addSplit(current.fileName, current.content);
}

/**
 * Add a new split to the left by inserting before the current one.
 * @param {number} index
 */
function splitLeft(index) {
  const newSplit = { id: `split-${Date.now()}`, fileName: 'untitled', content: '' };
  splits.splice(index, 0, newSplit);
  activeSplitIndex = index;
  renderSplits();
}

/**
 * Handle mouse up to finalize divider resize.
 */
function onDividerMouseUp() {
  if (!resizeState) return;
  resizeState.isDragging = false;
  resizeState.container?.classList.remove('editor__splits--resizing');
  resizeState.divider?.classList.remove('editor__split-divider--active');
  resizeState = null;
}

/**
 * Create a split editor container.
 * @param {number} index
 * @returns {HTMLElement}
 */
function createSplitPane(index) {
  const isActive = index === activeSplitIndex;
  const pane = createElement('div', {
    className: `editor__split-pane${isActive ? ' editor__split-pane--active' : ''}`,
    attrs: { 'data-split': index, role: 'region', 'aria-label': `Editor split ${index + 1}` },
    style: { flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' },
  });

  const showContextMenu = (e) => {
    e.preventDefault();
    const menu = createElement('div', {
      className: 'context-menu',
      style: { position: 'fixed', left: `${e.clientX}px`, top: `${e.clientY}px`, zIndex: '1000' },
      children: [
        createElement('div', { className: 'context-menu__item', text: 'Close', events: { click: () => { removeSplit(index); menu.remove(); } } }),
        createElement('div', { className: 'context-menu__item', text: 'Close Others', events: { click: () => { closeOtherSplits(index); menu.remove(); } } }),
        createElement('div', { className: 'context-menu__separator' }),
        createElement('div', { className: 'context-menu__item', text: 'Split Right', events: { click: () => { splitRight(index); menu.remove(); } } }),
        createElement('div', { className: 'context-menu__item', text: 'Split Left', events: { click: () => { splitLeft(index); menu.remove(); } } }),
      ],
    });
    document.body.appendChild(menu);
    const close = (event) => { if (!menu.contains(event.target)) { menu.remove(); document.removeEventListener('mousedown', close); } };
    document.addEventListener('mousedown', close);
  };

  const header = createElement('div', {
    className: 'editor__split-header',
    style: {
      display: 'flex', alignItems: 'center', padding: '2px 8px',
      backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)',
      fontSize: '12px', color: 'var(--text-secondary)',
    },
    events: { contextmenu: showContextMenu },
    children: [
      createElement('span', { text: splits[index]?.fileName || 'Untitled' }),
      createElement('div', {
        style: { marginLeft: 'auto', display: 'flex', gap: '4px' },
        children: [
          createElement('button', {
            className: 'sidebar__action-btn',
            html: ICONS.close,
            attrs: { 'aria-label': 'Close split', title: 'Close Split' },
            events: { click: (e) => { e.stopPropagation(); removeSplit(index); } },
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
    events: { focus: () => { activeSplitIndex = index; renderSplits(); } },
  });

  pane.append(header, body);
  return pane;
}

/**
 * Add a new split with the given file content.
 * @param {string} fileName
 * @param {string} content
 * @returns {void}
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
 * @returns {void}
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
    splitContainer.appendChild(createSplitPane(i));
    if (i < splits.length - 1) {
      splitContainer.appendChild(createDivider(i + 1));
    }
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

    document.addEventListener('mousemove', onDividerMouseMove);
    document.addEventListener('mouseup', onDividerMouseUp);

    eventBus.on(EVENTS.COMMAND_EXECUTED, (payload) => {
      if (payload === 'split-editor') {
        const currentTab = document.querySelector('.tabs-bar .tab--active');
        const name = currentTab?.querySelector('.tab__label')?.textContent || 'untitled';
        const content = currentTab?.dataset?.content || '';
        addSplit(name, content);
      }
      const splitMatch = typeof payload === 'string' && payload.match(/^split-focus-(\d+)$/);
      if (splitMatch) {
        const idx = parseInt(splitMatch[1], 10) - 1;
        if (idx >= 0 && idx < splits.length) {
          activeSplitIndex = idx;
          renderSplits();
          const panes = editorContentEl?.querySelectorAll('.editor__split-pane');
          panes?.[idx]?.querySelector('.editor__split-body')?.focus();
        }
      }
    });

    eventBus.on(EVENTS.FILE_SELECTED, (file) => {
      if (splits.length > 0) {
        splits[activeSplitIndex] = { id: splits[activeSplitIndex]?.id || `split-${Date.now()}`, fileName: file.name || file.path, content: file.content || '' };
        renderSplits();
      }
    });

    eventBus.on(EVENTS.TAB_OPENED, (file) => {
      if (splits.length > 0) {
        const pane = splits[activeSplitIndex];
        if (pane) {
          pane.fileName = file.name || file.path || pane.fileName;
          if (file.content) pane.content = file.content;
          renderSplits();
        }
      }
    });
  },

  /**
   * Open a file in a split pane.
   * @param {string} fileName
   * @param {string} content
   * @returns {void}
   */
  open(fileName, content) {
    addSplit(fileName, content);
  },

  /**
   * Close split by index.
   * @param {number} index
   * @returns {void}
   */
  close(index) {
    removeSplit(index);
  },
};
