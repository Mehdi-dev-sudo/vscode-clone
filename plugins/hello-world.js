/**
 * @fileoverview
 * Hello World plugin — demonstrates Plugin API capabilities.
 * Registers a command, a panel tab, and a status bar item.
 */

import { registerCommand, registerPanel, registerStatusItem } from '../src/features/plugin-api.js';
import { createElement } from '../src/utils/dom.js';

export default {
  init() {
    // Register a command
    registerCommand('hello-world', () => {
      alert('Hello from Plugin API! 🎉');
    });

    // Register a panel tab
    registerPanel('plugin-notes', '📝 Notes', (container) => {
      const el = createElement('div', {
        style: { padding: '16px', fontSize: '13px', color: 'var(--text-primary)' },
        children: [
          createElement('h3', { text: 'Quick Notes', style: { marginBottom: '8px', fontSize: '14px', fontWeight: '600' } }),
          createElement('textarea', {
            style: {
              width: '100%', height: '120px', background: 'var(--bg-input)',
              border: '1px solid var(--border-primary)', color: 'var(--text-primary)',
              padding: '8px', fontSize: '12px', fontFamily: 'inherit', resize: 'vertical',
            },
            attrs: { placeholder: 'Type your notes here...' },
          }),
        ],
      });
      container.appendChild(el);
    });

    // Register a status bar item
    registerStatusItem('plugin-clock', () => {
      const now = new Date();
      return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    });
  },
};
