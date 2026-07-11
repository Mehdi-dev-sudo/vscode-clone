/**
 * @fileoverview
 * Minimap component — renders a scaled-down view of the editor content
 * on the right side of the editor. Clicking/dragging scrolls the editor.
 */

import { createElement, empty, clamp } from '../../utils/dom.js';

/** @type {HTMLElement|null} */
let minimapEl = null;

/** @type {HTMLElement|null} */
let canvasEl = null;

/** @type {HTMLElement|null} */
let sliderEl = null;

/** @type {number} */
let scale = 0.2;

/** @type {number} */
let isDragging = false;

/**
 * Initialize the minimap.
 */
export function initMinimap() {
  minimapEl = document.getElementById('minimap');
  if (!minimapEl) return;

  canvasEl = document.createElement('canvas');
  canvasEl.className = 'minimap__content';
  canvasEl.style.width = '100%';
  minimapEl.appendChild(canvasEl);

  sliderEl = createElement('div', { className: 'minimap__slider' });
  minimapEl.appendChild(sliderEl);

  // Click to scroll
  minimapEl.addEventListener('mousedown', (e) => {
    if (e.target === sliderEl) {
      isDragging = true;
    } else {
      // Click on minimap to jump
      const rect = minimapEl.getBoundingClientRect();
      const y = (e.clientY - rect.top) / rect.height;
      const editor = document.querySelector('.editor__content');
      if (editor) {
        editor.scrollTop = y * (editor.scrollHeight - editor.clientHeight);
      }
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !sliderEl || !minimapEl) return;
    const rect = minimapEl.getBoundingClientRect();
    const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
    const editor = document.querySelector('.editor__content');
    if (editor) {
      editor.scrollTop = y * (editor.scrollHeight - editor.clientHeight);
    }
  });

  document.addEventListener('mouseup', () => { isDragging = false; });
}

/**
 * Update the minimap with new content.
 * @param {string} content
 * @param {number} editorScrollTop - Current scroll position of editor.
 * @param {number} editorHeight - Visible editor height.
 * @param {number} editorScrollHeight - Total editor content height.
 */
export function updateMinimap(content, editorScrollTop, editorHeight, editorScrollHeight) {
  if (!canvasEl || !minimapEl || !sliderEl) return;

  const lines = content.split('\n');
  const minimapHeight = minimapEl.clientHeight;
  const lineHeight = Math.max(1, Math.floor((minimapHeight / lines.length) * 2) / 2);

  canvasEl.height = Math.max(minimapHeight, lines.length * lineHeight);
  canvasEl.width = minimapEl.clientWidth * 2; // Retina

  const ctx = canvasEl.getContext('2d');
  ctx.scale(1, 1);

  // Background
  ctx.fillStyle = getComputedStyle(canvasEl).backgroundColor || '#1e1e1e';
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

  // Draw lines as tiny blocks
  const maxWidth = canvasEl.width - 4;
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#cccccc';

  lines.forEach((line, i) => {
    const y = i * lineHeight;
    const width = Math.min(line.length * 2, maxWidth);
    if (line.trim()) {
      ctx.fillRect(1, y, width, Math.max(1, lineHeight - 1));
    }
  });

  // Update slider position
  const visibleRatio = editorHeight / editorScrollHeight;
  const sliderHeight = Math.max(10, Math.round(minimapHeight * visibleRatio));
  const sliderTop = (editorScrollTop / (editorScrollHeight - editorHeight)) * (minimapHeight - sliderHeight);

  sliderEl.style.height = `${sliderHeight}px`;
  sliderEl.style.top = `${isNaN(sliderTop) ? 0 : sliderTop}px`;
}
