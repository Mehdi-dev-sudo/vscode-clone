/**
 * @fileoverview
 * Sample plugin: Color Picker — adds a color preview panel
 * and a command to insert color hex codes.
 */

import { registerCommand, registerPanel } from '../src/features/plugin-api.js';
import { createElement } from '../src/utils/dom.js';

export default {
  init() {
    registerCommand('plugin:insert-date', () => {
      const date = new Date().toISOString().slice(0, 10);
      const editorLines = document.querySelector('.editor__lines');
      if (editorLines) {
        editorLines.focus();
        document.execCommand('insertText', false, date);
      }
    });

    registerPanel('plugin-preview', '👁 Preview', (container) => {
      const el = createElement('div', {
        style: { padding: '16px', fontSize: '13px', color: 'var(--text-secondary)' },
        text: 'Select a file to preview its content here.',
      });
      container.appendChild(el);
    });
  },
};
