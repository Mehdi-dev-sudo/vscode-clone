/**
 * @fileoverview
 * Multi-cursor simulation for the editor.
 * Supports: add cursor above/below, select all occurrences,
 * and multiple simultaneous editing.
 *
 * Note: This is a visual simulation. Full multi-cursor editing
 * in a contenteditable is complex; this provides the UI patterns.
 */

/**
 * Add a cursor above the current cursor position.
 * @param {HTMLElement} editorEl
 */
export function addCursorAbove(editorEl) {
  if (!editorEl) return;
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const currentLine = findLineNumber(editorEl, range.startContainer);
  if (currentLine <= 1) return;

  const targetLine = editorEl.querySelector(`[data-line="${currentLine - 1}"]`);
  if (!targetLine) return;

  const newRange = document.createRange();
  newRange.setStart(targetLine, 0);
  newRange.setEnd(targetLine, 0);
  selection.addRange(newRange);
}

/**
 * Add a cursor below the current cursor position.
 * @param {HTMLElement} editorEl
 */
export function addCursorBelow(editorEl) {
  if (!editorEl) return;
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const currentLine = findLineNumber(editorEl, range.startContainer);
  const totalLines = editorEl.querySelectorAll('[data-line]').length;
  if (currentLine >= totalLines) return;

  const targetLine = editorEl.querySelector(`[data-line="${currentLine + 1}"]`);
  if (!targetLine) return;

  const newRange = document.createRange();
  newRange.setStart(targetLine, 0);
  newRange.setEnd(targetLine, 0);
  selection.addRange(newRange);
}

/**
 * Find the line number of a text node within the editor.
 * @param {HTMLElement} editorEl
 * @param {Node} node
 * @returns {number}
 */
function findLineNumber(editorEl, node) {
  let current = node;
  while (current && current.parentElement !== editorEl) {
    current = current.parentElement;
  }
  const lineEl = current?.closest?.('[data-line]') || current;
  return parseInt(lineEl?.dataset?.line || '1', 10);
}

/**
 * Select all occurrences of the selected text.
 * @param {HTMLElement} editorEl
 */
export function selectAllOccurrences(editorEl) {
  if (!editorEl) return;
  const selection = window.getSelection();
  const text = selection.toString().trim();
  if (!text) return;

  const lines = editorEl.querySelectorAll('[data-line]');
  selection.removeAllRanges();

  lines.forEach((line) => {
    const lineText = line.textContent || '';
    let idx = lineText.indexOf(text);
    while (idx !== -1) {
      const range = document.createRange();
      range.setStart(line.firstChild || line, idx);
      range.setEnd(line.firstChild || line, idx + text.length);
      selection.addRange(range);
      idx = lineText.indexOf(text, idx + 1);
    }
  });
}
