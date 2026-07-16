// @ts-check

/**
 * @fileoverview
 * Minimap component — renders a scaled-down view of the editor content
 * on the right side of the editor. Clicking/dragging scrolls the editor.
 */

import { createElement, clamp } from '../../utils/dom.js';

/** @type {HTMLElement|null} */
let minimapEl = null;

/** @type {HTMLCanvasElement|null} */
let canvasEl = null;

/** @type {HTMLElement|null} */
let sliderEl = null;

/** @type {boolean} */
let isDragging = false;

/**
 * Scroll editor to a ratio (0-1) of its content.
 * @param {number} ratio
 * @returns {void}
 */
function scrollEditorTo(ratio) {
  const editor = document.querySelector('.editor__content');
  if (!editor) return;
  const maxScroll = Math.max(0, editor.scrollHeight - editor.clientHeight);
  editor.scrollTop = clamp(ratio, 0, 1) * maxScroll;
}

/**
 * Handle pointer down on minimap.
 * @param {number} clientY
 * @returns {void}
 */
function handlePointerDown(clientY) {
  if (!minimapEl) return;
  const rect = minimapEl.getBoundingClientRect();
  const ratio = (clientY - rect.top) / rect.height;
  scrollEditorTo(ratio);
}

/**
 * Handle pointer move during drag.
 * @param {number} clientY
 * @returns {void}
 */
function handlePointerMove(clientY) {
  if (!isDragging || !minimapEl) return;
  const rect = minimapEl.getBoundingClientRect();
  const ratio = (clientY - rect.top) / rect.height;
  scrollEditorTo(ratio);
}

/**
 * Initialize the minimap with mouse and touch support.
 */
export function initMinimap() {
  minimapEl = document.getElementById('minimap');
  if (!minimapEl) return;

  canvasEl = document.createElement('canvas');
  canvasEl.className = 'minimap__content';
  canvasEl.style.width = '100%';
  canvasEl.style.touchAction = 'none';
  minimapEl.appendChild(canvasEl);

  sliderEl = createElement('div', { className: 'minimap__slider' });
  minimapEl.appendChild(sliderEl);

  // Mouse events
  minimapEl.addEventListener('mousedown', (/** @type {MouseEvent} */ e) => {
    if (e.target === sliderEl) {
      isDragging = true;
    } else {
      handlePointerDown(e.clientY);
    }
  });

  document.addEventListener('mousemove', (/** @type {MouseEvent} */ e) => {
    if (!isDragging) return;
    handlePointerMove(e.clientY);
  });

  document.addEventListener('mouseup', () => { isDragging = false; });

  // Touch events
  minimapEl.addEventListener('touchstart', (/** @type {TouchEvent} */ e) => {
    const touch = e.touches[0];
    handlePointerDown(touch.clientY);
  }, { passive: true });

  minimapEl.addEventListener('touchmove', (/** @type {TouchEvent} */ e) => {
    const touch = e.touches[0];
    handlePointerMove(touch.clientY);
  }, { passive: true });

  document.addEventListener('touchend', () => { isDragging = false; }, { passive: true });
}

/**
 * Update the minimap with new content.
 * @param {string} content
 * @param {number} editorScrollTop - Current scroll position of editor.
 * @param {number} editorHeight - Visible editor height.
 * @param {number} editorScrollHeight - Total editor content height.
 * @returns {void}
 */
export function updateMinimap(content, editorScrollTop, editorHeight, editorScrollHeight) {
  if (!canvasEl || !minimapEl || !sliderEl) return;

  const lines = content.split('\n');
  const minimapHeight = minimapEl.clientHeight;

  // Guard against empty content, zero-height container, or NaN values
  if (!lines.length || !minimapHeight || isNaN(editorScrollHeight) || isNaN(editorHeight)) return;

  const lineHeight = Math.max(1, Math.floor((minimapHeight / lines.length) * 2) / 2);
  const dpr = window.devicePixelRatio || 1;
  const logicalWidth = minimapEl.clientWidth;
  const newHeight = Math.max(minimapHeight, lines.length * lineHeight);

  // Avoid canvas clear/redraw if dimensions same
  if (canvasEl.height !== newHeight) canvasEl.height = newHeight;
  if (canvasEl.width !== logicalWidth * dpr) canvasEl.width = logicalWidth * dpr;

  const ctx = canvasEl.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  // Background
  const bgColor = getComputedStyle(minimapEl).backgroundColor || '#1e1e1e';
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, logicalWidth, Math.max(minimapHeight, lines.length * lineHeight));

  // Draw lines as tiny blocks
  const maxWidth = logicalWidth - 4;
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#cccccc';

  for (let i = 0; i < lines.length; i++) {
    const y = i * lineHeight;
    const width = Math.min(lines[i].length * 2, maxWidth);
    if (lines[i].trim()) {
      ctx.fillRect(1, y, width, Math.max(1, lineHeight - 1));
    }
  }

  // Update slider position
  const scrollRange = editorScrollHeight - editorHeight;
  const visibleRatio = scrollRange > 0 ? editorHeight / editorScrollHeight : 1;
  const sliderHeight = Math.max(10, Math.round(minimapHeight * visibleRatio));
  const sliderTop = scrollRange > 0
    ? (editorScrollTop / scrollRange) * (minimapHeight - sliderHeight)
    : 0;

  sliderEl.style.height = `${sliderHeight}px`;
  sliderEl.style.top = `${sliderTop}px`;
}
