/**
 * @fileoverview
 * MultiCursor component — visual multi-cursor support for the editor.
 * Manages cursor positions, rendering, and keyboard shortcuts.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { createElement } from '../../utils/dom.js';

/** @type {Array<{line: number, col: number, el: HTMLElement}>} */
let cursors = [];

/** @type {HTMLElement|null} */
let editorEl = null;

/** @type {HTMLElement|null} */
let cursorContainer = null;

/**
 * Initialize the MultiCursor component.
 * @param {HTMLElement} editorElement
 */
export function initMultiCursor(editorElement) {
  editorEl = editorElement;
  cursorContainer = createElement('div', {
    className: 'multi-cursor-container',
    style: { position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', pointerEvents: 'none', zIndex: '10' },
  });
  editorEl.style.position = 'relative';
  editorEl.appendChild(cursorContainer);

  eventBus.on(EVENTS.COMMAND_EXECUTED, (payload) => {
    if (payload === 'multicursor-add-above') addCursorAbove();
    if (payload === 'multicursor-add-below') addCursorBelow();
    if (payload === 'multicursor-select-all') selectAllOccurrences();
    if (payload === 'multicursor-collapse') collapseCursors();
  });
}

/**
 * Get the current cursor position from the native selection.
 * @returns {{line: number, col: number}|null}
 */
function getCurrentPosition() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return null;
  const range = sel.getRangeAt(0);
  const node = range.startContainer;
  const lineEl = node?.nodeType === 3 ? node.parentElement?.closest('[data-line]') : node?.closest('[data-line]');
  if (!lineEl) return null;
  const line = parseInt(lineEl.dataset.line, 10);
  const col = range.startOffset;
  return { line, col };
}

/**
 * Add a cursor above the current position.
 */
export function addCursorAbove() {
  const pos = getCurrentPosition();
  if (!pos || pos.line <= 1) return;
  addCursorAt(pos.line - 1, pos.col);
}

/**
 * Add a cursor below the current position.
 */
export function addCursorBelow() {
  const pos = getCurrentPosition();
  if (!pos) return;
  const totalLines = editorEl?.querySelectorAll('[data-line]').length || 0;
  if (pos.line >= totalLines) return;
  addCursorAt(pos.line + 1, pos.col);
}

/**
 * Add a cursor at a specific line and column.
 * @param {number} line
 * @param {number} col
 */
function addCursorAt(line, col) {
  const lineEl = editorEl?.querySelector(`[data-line="${line}"]`);
  if (!lineEl) return;

  // Check if cursor already exists at this line
  const existing = cursors.findIndex((c) => c.line === line);
  if (existing !== -1) {
    removeCursorElement(existing);
    cursors.splice(existing, 1);
  }

  // Create visual cursor element
  const cursorEl = createElement('div', {
    className: 'multi-cursor',
    style: {
      position: 'absolute',
      width: '2px',
      height: '1.2em',
      backgroundColor: 'var(--text-primary)',
      animation: 'cursor-blink 1s step-end infinite',
    },
  });

  // Position cursor
  const editorRect = editorEl?.getBoundingClientRect();
  const lineRect = lineEl.getBoundingClientRect();
  if (editorRect && lineRect) {
    const charWidth = 8; // approximate monospace char width
    cursorEl.style.left = `${col * charWidth}px`;
    cursorEl.style.top = `${lineRect.top - editorRect.top + lineEl.offsetTop}px`;
  }

  cursorContainer?.appendChild(cursorEl);
  cursors.push({ line, col, el: cursorEl });
}

/**
 * Remove a cursor element.
 * @param {number} index
 */
function removeCursorElement(index) {
  const cursor = cursors[index];
  if (cursor?.el?.parentElement) {
    cursor.el.remove();
  }
}

/**
 * Select all occurrences of selected text.
 */
export function selectAllOccurrences() {
  const sel = window.getSelection();
  const text = sel.toString().trim();
  if (!text) return;

  collapseCursors();
  const lines = editorEl?.querySelectorAll('[data-line]');
  lines?.forEach((lineEl) => {
    const lineText = lineEl.textContent || '';
    let idx = 0;
    while (idx !== -1) {
      idx = lineText.indexOf(text, idx);
      if (idx === -1) break;
      addCursorAt(parseInt(lineEl.dataset.line, 10), idx);
      idx += 1;
    }
  });
}

/**
 * Collapse all cursors back to a single cursor.
 */
export function collapseCursors() {
  cursors.forEach((c) => c.el?.remove());
  cursors = [];
}

/**
 * Update cursor positions (call after editor content changes).
 */
export function updateCursorPositions() {
  if (cursors.length === 0) return;
  const editorRect = editorEl?.getBoundingClientRect();
  if (!editorRect) return;

  cursors.forEach((c) => {
    const lineEl = editorEl?.querySelector(`[data-line="${c.line}"]`);
    if (!lineEl) return;
    const lineRect = lineEl.getBoundingClientRect();
    const charWidth = 8;
    c.el.style.left = `${c.col * charWidth}px`;
    c.el.style.top = `${lineRect.top - editorRect.top + lineEl.offsetTop}px`;
  });
}
