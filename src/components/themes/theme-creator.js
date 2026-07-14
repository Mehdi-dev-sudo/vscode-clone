// @ts-check

/**
 * @fileoverview
 * Theme Creator — lets users edit theme colors in real-time and
 * save custom themes to localStorage. No build tool needed.
 *
 * Usage: eventBus.emit('command:executed', 'theme-creator')
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { createElement, empty, $ } from '../../utils/dom.js';
import { getItem, setItem } from '../../storage/local-storage.js';
import { Notifications } from '../notifications/notifications.js';

const CUSTOM_THEMES_KEY = 'vscode-clone:custom-themes';
const CSS_VARIABLES = [
  { key: '--bg-primary', label: 'Background Primary', category: 'Background' },
  { key: '--bg-secondary', label: 'Background Secondary', category: 'Background' },
  { key: '--bg-tertiary', label: 'Background Tertiary', category: 'Background' },
  { key: '--text-primary', label: 'Text Primary', category: 'Text' },
  { key: '--text-secondary', label: 'Text Secondary', category: 'Text' },
  { key: '--text-link', label: 'Link Color', category: 'Text' },
  { key: '--accent-primary', label: 'Accent Color', category: 'Accent' },
  { key: '--border-primary', label: 'Border Color', category: 'Borders' },
  { key: '--border-focus', label: 'Focus Border', category: 'Borders' },
  { key: '--status-bar-bg', label: 'Status Bar BG', category: 'Bars' },
  { key: '--activity-bar-bg', label: 'Activity Bar BG', category: 'Bars' },
  { key: '--tab-active-bg', label: 'Tab Active BG', category: 'Tabs' },
  { key: '--tab-active-border', label: 'Tab Active Border', category: 'Tabs' },
  { key: '--editor-selection', label: 'Selection Color', category: 'Editor' },
  { key: '--terminal-text', label: 'Terminal Text', category: 'Terminal' },
  { key: '--notification-info', label: 'Info Color', category: 'Notifications' },
  { key: '--notification-error', label: 'Error Color', category: 'Notifications' },
];

/** @type {Object<string, string>} */
let currentColors = {};

/** @type {string|null} */
let currentThemeName = null;

/**
 * Load a custom theme's colors.
 * @param {string} name
 * @returns {Object<string, string>}
 */
function loadTheme(name) {
  const themes = getItem(CUSTOM_THEMES_KEY, {});
  return themes[name] || {};
}

/**
 * Save a custom theme.
 * @param {string} name
 * @param {Object<string, string>} colors
 * @returns {void}
 */
function saveTheme(name, colors) {
  const themes = getItem(CUSTOM_THEMES_KEY, {});
  themes[name] = colors;
  setItem(CUSTOM_THEMES_KEY, themes);
}

/**
 * Get all custom theme names.
 * @returns {string[]}
 */
function getThemeNames() {
  return Object.keys(getItem(CUSTOM_THEMES_KEY, {}));
}

/**
 * Apply colors to the document root.
 * @param {Object<string, string>} colors
 * @returns {void}
 */
function applyColors(colors) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(colors)) {
    if (value) root.style.setProperty(key, value);
  }
}

/**
 * Reset custom colors.
 * @returns {void}
 */
function resetColors() {
  const root = document.documentElement;
  CSS_VARIABLES.forEach((v) => root.style.removeProperty(v.key));
}

/**
 * Render the theme creator dialog.
 * @returns {void}
 */
function render() {
  // Remove existing dialog
  document.querySelector('.theme-creator')?.remove();

  const overlay = createElement('div', {
    className: 'theme-creator',
    style: {
      position: 'fixed', inset: '0', zIndex: '500',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    events: { click: (e) => { if (e.target === overlay) close(); } },
  });

  const dialog = createElement('div', {
    style: {
      backgroundColor: 'var(--bg-dropdown)',
      border: '1px solid var(--border-dropdown)',
      borderRadius: '8px',
      maxWidth: '600px', width: '90%',
      maxHeight: '80vh',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex', flexDirection: 'column',
    },
  });

  // Header
  const header = createElement('div', {
    style: { padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    children: [
      createElement('h2', { style: { fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }, text: 'Theme Creator' }),
      createElement('button', {
        style: { color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px', background: 'none', border: 'none' },
        text: '✕',
        events: { click: close },
      }),
    ],
  });
  dialog.appendChild(header);

  // Theme name input
  const nameRow = createElement('div', {
    style: { padding: '12px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: '8px', alignItems: 'center' },
    children: [
      createElement('label', { style: { fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }, text: 'Theme Name:' }),
      createElement('input', {
        style: { flex: '1', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '4px 8px', fontSize: '13px' },
        attrs: { type: 'text', value: currentThemeName || '', placeholder: 'My Custom Theme', id: 'theme-creator-name' },
        events: { input: (e) => { currentThemeName = e.target.value; } },
      }),
      createElement('button', {
        style: { backgroundColor: 'var(--accent-primary)', color: '#fff', padding: '4px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
        text: 'Save',
        events: { click: saveCurrentTheme },
      }),
    ],
  });
  dialog.appendChild(nameRow);

  // Color list (scrollable)
  const list = createElement('div', {
    style: { overflowY: 'auto', padding: '8px 20px', flex: '1' },
  });

  let currentCategory = '';
  CSS_VARIABLES.forEach((v) => {
    if (v.category !== currentCategory) {
      currentCategory = v.category;
      list.appendChild(createElement('div', {
        style: { fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '8px 0 4px', marginTop: '8px', borderBottom: '1px solid var(--border-primary)' },
        text: v.category,
      }));
    }

    const value = currentColors[v.key] || getComputedStyle(document.documentElement).getPropertyValue(v.key).trim() || '#000000';
    const row = createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' },
      children: [
        createElement('label', { style: { flex: '1', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }, text: v.label }),
        createElement('input', {
          style: { width: '28px', height: '28px', padding: '0', border: '1px solid var(--border-primary)', borderRadius: '2px', cursor: 'pointer', background: 'none' },
          attrs: { type: 'color', value, 'data-key': v.key },
          events: {
            input: (e) => {
              currentColors[v.key] = e.target.value;
              applyColors(currentColors);
            },
          },
        }),
        createElement('input', {
          style: { width: '80px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '2px 4px', fontSize: '11px', fontFamily: 'monospace' },
          attrs: { type: 'text', value, 'data-key': v.key },
          events: {
            input: (e) => {
              currentColors[v.key] = e.target.value;
              applyColors(currentColors);
              const colorInput = row.querySelector('input[type="color"]');
              if (colorInput) colorInput.value = e.target.value;
            },
          },
        }),
      ],
    });
    list.appendChild(row);
  });

  dialog.appendChild(list);

  // Footer with actions
  const footer = createElement('div', {
    style: { padding: '12px 20px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: '8px', justifyContent: 'space-between' },
    children: [
      createElement('div', { style: { display: 'flex', gap: '8px' },
        children: [
          createElement('button', {
            style: { backgroundColor: 'var(--button-secondary-bg)', color: 'var(--text-primary)', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' },
            text: 'Export JSON',
            events: { click: () => exportThemeJSON() },
          }),
          createElement('button', {
            style: { backgroundColor: 'var(--button-secondary-bg)', color: 'var(--text-primary)', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' },
            text: 'Import JSON',
            events: { click: () => importThemeJSON() },
          }),
        ],
      }),
      createElement('div', { style: { display: 'flex', gap: '8px' },
        children: [
          createElement('button', {
            style: { backgroundColor: 'var(--button-secondary-bg)', color: 'var(--text-primary)', padding: '6px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
            text: 'Reset',
            events: { click: () => { currentColors = {}; resetColors(); render(); } },
          }),
          createElement('button', {
            style: { backgroundColor: 'var(--accent-primary)', color: '#fff', padding: '6px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
            text: 'Apply & Close',
            events: { click: close },
          }),
        ],
      }),
    ],
  });
  dialog.appendChild(footer);

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}

/**
 * @returns {void}
 */
function saveCurrentTheme() {
  if (!currentThemeName) {
    currentThemeName = 'Custom-' + Date.now().toString(36);
    const input = document.getElementById('theme-creator-name');
    if (input) input.value = currentThemeName;
  }
  saveTheme(currentThemeName, currentColors);
  Notifications.info(`Theme "${currentThemeName}" saved`);
}

/**
 * @returns {void}
 */
function exportThemeJSON() {
  const name = currentThemeName || 'custom-theme';
  const colors = { ...currentColors };
  // Add any CSS variables not yet customized (use computed values)
  CSS_VARIABLES.forEach((v) => {
    if (!colors[v.key]) {
      colors[v.key] = getComputedStyle(document.documentElement).getPropertyValue(v.key).trim() || '#000000';
    }
  });
  const json = JSON.stringify({ name, colors }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name.replace(/[^a-zA-Z0-9_-]/g, '')}-theme.json`;
  a.click();
  URL.revokeObjectURL(url);
  Notifications.info(`Theme "${name}" exported`);
}

/**
 * @returns {void}
 */
function importThemeJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.colors) {
          currentColors = { ...data.colors };
          if (data.name) currentThemeName = data.name;
          applyColors(currentColors);
          const nameInput = document.getElementById('theme-creator-name');
          if (nameInput && data.name) nameInput.value = data.name;
          // Update color inputs in the UI
          document.querySelectorAll('.theme-creator input[type="color"]').forEach((el) => {
            const key = el.dataset.key;
            if (currentColors[key]) el.value = currentColors[key];
          });
          document.querySelectorAll('.theme-creator input[type="text"]').forEach((el) => {
            const key = el.dataset.key;
            if (currentColors[key]) el.value = currentColors[key];
          });
          Notifications.info(`Theme "${data.name || 'imported'}" loaded`);
        }
      } catch (err) {
        Notifications.error('Invalid theme file');
      }
    };
    reader.readAsText(file);
  });
  input.click();
}

/**
 * @returns {void}
 */
function close() {
  document.querySelector('.theme-creator')?.remove();
}

export const ThemeCreator = {
  init() {
    eventBus.on(EVENTS.COMMAND_EXECUTED, (cmd) => {
      if (cmd === 'theme-creator') {
        currentColors = {};
        currentThemeName = null;
        render();
      }
    });
  },
};
