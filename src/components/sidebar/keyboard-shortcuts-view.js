/**
 * @fileoverview
 * Keyboard Shortcuts viewer — displays all available keyboard shortcuts
 * in a searchable list, grouped by category.
 */

import { createElement, empty } from '../../utils/dom.js';

const SHORTCUT_GROUPS = [
  {
    name: 'General',
    shortcuts: [
      { keys: 'Ctrl+Shift+P', description: 'Show Command Palette' },
      { keys: 'Ctrl+P', description: 'Quick Open' },
      { keys: 'Ctrl+B', description: 'Toggle Sidebar' },
      { keys: 'Ctrl+`', description: 'Toggle Terminal' },
      { keys: 'Ctrl+K Z', description: 'Zen Mode' },
      { keys: 'F11', description: 'Toggle Fullscreen' },
    ],
  },
  {
    name: 'View',
    shortcuts: [
      { keys: 'Ctrl+Shift+E', description: 'Show Explorer' },
      { keys: 'Ctrl+Shift+F', description: 'Show Search' },
      { keys: 'Ctrl+Shift+G', description: 'Show Source Control' },
      { keys: 'Ctrl+Shift+D', description: 'Show Run & Debug' },
      { keys: 'Ctrl+Shift+X', description: 'Show Extensions' },
    ],
  },
  {
    name: 'Editor',
    shortcuts: [
      { keys: 'Ctrl+W', description: 'Close Tab' },
      { keys: 'Ctrl+N', description: 'New File' },
      { keys: 'Ctrl+S', description: 'Save File' },
    ],
  },
];

/**
 * Render the shortcuts view.
 * @param {HTMLElement} container
 */
function render(container) {
  empty(container);

  const header = createElement('div', { className: 'sidebar__header' });
  header.appendChild(createElement('span', { className: 'sidebar__title', text: 'KEYBOARD SHORTCUTS' }));
  container.appendChild(header);

  const searchBox = createElement('div', {
    style: { padding: '8px', borderBottom: '1px solid var(--border-primary)' },
    children: [
      createElement('input', {
        style: { width: '100%', padding: '4px 8px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none' },
        attrs: { type: 'text', placeholder: 'Search shortcuts...', 'aria-label': 'Search keyboard shortcuts', autocomplete: 'off' },
        events: {
          input: (e) => {
            const query = e.target.value.toLowerCase();
            container.querySelectorAll('.shortcut-group').forEach((group) => {
              let visible = false;
              group.querySelectorAll('.shortcut-item').forEach((item) => {
                const matches = item.textContent.toLowerCase().includes(query);
                item.style.display = matches ? 'flex' : 'none';
                if (matches) visible = true;
              });
              group.querySelector('.shortcut-group-title').style.display = visible || !query ? 'block' : 'none';
            });
          },
        },
      }),
    ],
  });
  container.appendChild(searchBox);

  const list = createElement('div', {
    style: { flex: '1', overflowY: 'auto', padding: '4px 0' },
  });

  SHORTCUT_GROUPS.forEach((group) => {
    const groupEl = createElement('div', {
      className: 'shortcut-group',
      style: { marginBottom: '8px' },
    });

    const title = createElement('div', {
      className: 'shortcut-group-title',
      style: {
        padding: '4px 12px', fontSize: '11px', fontWeight: '600',
        color: 'var(--text-secondary)', textTransform: 'uppercase',
        letterSpacing: '0.5px',
      },
      text: group.name,
    });
    groupEl.appendChild(title);

    group.shortcuts.forEach((s) => {
      const item = createElement('div', {
        className: 'shortcut-item',
        style: {
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 12px 4px 12px', fontSize: '13px', cursor: 'pointer',
        },
        events: {
          mouseenter: (e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-item-hover)'; },
          mouseleave: (e) => { e.currentTarget.style.backgroundColor = ''; },
        },
        children: [
          createElement('span', { text: s.description, style: { color: 'var(--text-primary)' } }),
          createElement('kbd', {
            text: s.keys,
            style: {
              padding: '1px 6px', fontSize: '11px', fontFamily: 'inherit',
              backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
              borderRadius: '3px', color: 'var(--text-secondary)',
            },
          }),
        ],
      });
      groupEl.appendChild(item);
    });

    list.appendChild(groupEl);
  });

  container.appendChild(list);
}

export const KeyboardShortcutsView = {
  /** @param {HTMLElement} container */
  render(container) { render(container); },
};
