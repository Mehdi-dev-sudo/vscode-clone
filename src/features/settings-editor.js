// @ts-check

/**
 * @fileoverview
 * Settings Editor — persists and applies user settings from a JSON file.
 * Settings are stored in localStorage and applied to the UI in real-time.
 *
 * Default settings:
 * {
 *   "fontSize": 14,
 *   "theme": "theme-dark",
 *   "wordWrap": false,
 *   "tabSize": 2,
 *   "renderWhitespace": "none",
 *   "minimap": true,
 *   "lineNumbers": true,
 *   "autoSave": false,
 *   "terminal.fontSize": 13
 * }
 */

import { eventBus } from '../events/event-bus.js';
import { EVENTS } from '../core/constants.js';
import { createElement } from '../utils/dom.js';
import { getItem, setItem } from '../storage/local-storage.js';

const SETTINGS_KEY = 'vscode-clone:settings';

/** @type {{[key: string]: string|number|boolean}} */
const DEFAULT_SETTINGS = {
  fontSize: 14,
  theme: 'theme-dark',
  wordWrap: false,
  tabSize: 2,
  renderWhitespace: 'none',
  minimap: true,
  lineNumbers: true,
  autoSave: false,
  'terminal.fontSize': 13,
};

const SETTING_FIELDS = [
  { key: 'fontSize', label: 'Font Size', type: 'range', min: 10, max: 30, step: 1 },
  { key: 'theme', label: 'Theme', type: 'select', options: ['theme-dark', 'theme-light', 'theme-dracula', 'theme-monokai'] },
  { key: 'wordWrap', label: 'Word Wrap', type: 'boolean' },
  { key: 'tabSize', label: 'Tab Size', type: 'select', options: [1, 2, 4, 8] },
  { key: 'renderWhitespace', label: 'Render Whitespace', type: 'select', options: ['none', 'boundary', 'all'] },
  { key: 'minimap', label: 'Show Minimap', type: 'boolean' },
  { key: 'lineNumbers', label: 'Line Numbers', type: 'boolean' },
  { key: 'autoSave', label: 'Auto Save', type: 'boolean' },
  { key: 'terminal.fontSize', label: 'Terminal Font Size', type: 'range', min: 10, max: 24, step: 1 },
];

let currentSettings = { ...DEFAULT_SETTINGS };

/**
 * @typedef {Object} SettingField
 * @property {string} key
 * @property {string} label
 * @property {'boolean'|'range'|'select'} type
 * @property {number} [min]
 * @property {number} [max]
 * @property {number} [step]
 * @property {Array<string|number>} [options]
 */

/**
 * @typedef {Object} SettingChange
 * @property {string} key
 * @property {string|number|boolean} value
 */

/**
 * @returns {{[key: string]: string|number|boolean}}
 */
function load() {
  const saved = getItem(SETTINGS_KEY, {});
  currentSettings = { ...DEFAULT_SETTINGS, ...saved };
  return currentSettings;
}

/**
 * @returns {void}
 */
function save() {
  setItem(SETTINGS_KEY, currentSettings);
}

/**
 * @param {SettingChange} setting
 * @returns {void}
 */
function apply(setting) {
  const root = document.documentElement;
  if (setting.key === 'fontSize') {
    root.style.setProperty('--font-size-md', `${setting.value}px`);
    root.style.setProperty('--font-size-sm', `${Math.max(10, Number(setting.value) - 2)}px`);
  } else if (setting.key === 'theme') {
    eventBus.emit(EVENTS.THEME_CHANGED, setting.value);
  } else if (setting.key === 'wordWrap') {
    root.style.setProperty('--editor-word-wrap', setting.value ? 'break-word' : 'normal');
  } else if (setting.key === 'tabSize') {
    root.style.setProperty('--editor-tab-size', String(setting.value));
  } else if (setting.key === 'minimap') {
    const minimap = document.getElementById('minimap');
    if (minimap) minimap.style.display = setting.value ? '' : 'none';
  } else if (setting.key === 'lineNumbers') {
    const gutter = document.getElementById('editor-gutter');
    if (gutter) gutter.style.display = setting.value ? '' : 'none';
  } else if (setting.key === 'autoSave') {
    // Placeholder for auto-save logic
  } else if (setting.key === 'terminal.fontSize') {
    root.style.setProperty('--terminal-font-size', `${setting.value}px`);
  }
}

/**
 * @returns {void}
 */
function applyAll() {
  Object.entries(currentSettings).forEach(([key, value]) => {
    apply({ key, value });
  });
}

/**
 * @param {string} key
 * @returns {HTMLElement|null}
 */
function renderSettingRow(key) {
  const field = SETTING_FIELDS.find((f) => f.key === key);
  if (!field) return null;

  const value = currentSettings[key];
  const row = createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 0', borderBottom: '1px solid var(--border-primary)' },
  });

  const label = createElement('label', {
    style: { flex: '1', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' },
    text: field.label,
  });
  row.appendChild(label);

  if (field.type === 'boolean') {
    const checkbox = createElement('input', {
      style: { width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' },
      attrs: { type: 'checkbox' },
      events: {
        change: (/** @type {Event} */ e) => {
          const target = /** @type {HTMLInputElement} */ (e.target);
          currentSettings[key] = target.checked;
          apply({ key, value: target.checked });
          save();
        },
      },
    });
    /** @type {HTMLInputElement} */ (checkbox).checked = !!value;
    row.appendChild(checkbox);
  } else if (field.type === 'range') {
    const rangeRow = createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } });
    const input = createElement('input', {
      style: { width: '120px', cursor: 'pointer' },
      attrs: { type: 'range', min: String(field.min), max: String(field.max), step: String(field.step), value: String(value) },
      events: {
        input: (/** @type {Event} */ e) => {
          const target = /** @type {HTMLInputElement} */ (e.target);
          currentSettings[key] = Number(target.value);
          apply({ key, value: currentSettings[key] });
          save();
          valueDisplay.textContent = target.value;
        },
      },
    });
    const valueDisplay = createElement('span', {
      style: { fontSize: '12px', color: 'var(--text-secondary)', minWidth: '24px', textAlign: 'right' },
      text: String(value),
    });
    rangeRow.append(input, valueDisplay);
    row.appendChild(rangeRow);
  } else if (field.type === 'select') {
    const select = createElement('select', {
      style: {
        background: 'var(--bg-input)', border: '1px solid var(--border-primary)',
        color: 'var(--text-primary)', padding: '3px 6px', fontSize: '12px', borderRadius: '3px',
      },
      events: {
        change: (/** @type {Event} */ e) => {
          const target = /** @type {HTMLSelectElement} */ (e.target);
          currentSettings[key] = target.value;
          apply({ key, value: target.value });
          save();
        },
      },
    });
    if (field.options) { field.options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = String(opt);
      option.textContent = String(opt);
      if (String(opt) === String(value)) option.selected = true;
      select.appendChild(option);
    }); }
    row.appendChild(select);
  }

  return row;
}

/**
 * @returns {void}
 */
function showDialog() {
  document.querySelector('.settings-editor')?.remove();

  const overlay = createElement('div', {
    className: 'settings-editor',
    style: {
      position: 'fixed', inset: '0', zIndex: '500',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    events: { click: (/** @type {MouseEvent} */ e) => { if (e.target === overlay) close(); } },
  });

  const dialog = createElement('div', {
    style: {
      backgroundColor: 'var(--bg-dropdown)', border: '1px solid var(--border-dropdown)',
      borderRadius: '8px', maxWidth: '520px', width: '90%', maxHeight: '80vh',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column',
    },
  });

  const header = createElement('div', {
    style: { padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    children: [
      createElement('h2', { style: { fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }, text: 'Settings' }),
      createElement('button', {
        style: { color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px', background: 'none', border: 'none' },
        text: '✕', events: { click: close },
      }),
    ],
  });
  dialog.appendChild(header);

  const list = createElement('div', { style: { overflowY: 'auto', padding: '8px 20px', flex: '1' } });

  SETTING_FIELDS.forEach((field) => {
    const row = renderSettingRow(field.key);
    if (row) list.appendChild(row);
  });

  // JSON preview
  const jsonSection = createElement('div', { style: { padding: '12px 20px', borderTop: '1px solid var(--border-primary)' } });
  jsonSection.appendChild(createElement('div', {
    style: { fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' },
    text: 'settings.json Preview',
  }));
  const pre = createElement('pre', {
    style: {
      background: 'var(--bg-input)', border: '1px solid var(--border-primary)',
      borderRadius: '4px', padding: '8px', fontSize: '11px', fontFamily: 'monospace',
      color: 'var(--text-primary)', overflowX: 'auto', whiteSpace: 'pre',
    },
    text: JSON.stringify(currentSettings, null, 2),
  });
  jsonSection.appendChild(pre);

  dialog.appendChild(list);
  dialog.appendChild(jsonSection);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}

/**
 * @returns {void}
 */
function close() {
  document.querySelector('.settings-editor')?.remove();
}

/**
 * @namespace
 */
export const SettingsEditor = {
  /**
   * Initialize the settings editor.
   * @returns {void}
   */
  init() {
    load();
    applyAll();

    eventBus.on(EVENTS.COMMAND_EXECUTED, (/** @type {string} */ cmd) => {
      if (cmd === 'settings') {
        load();
        showDialog();
      }
    });
  },

  /**
   * Get a setting value by key.
   * @param {string} key
   * @returns {string|number|boolean}
   */
  get(key) {
    return currentSettings[key];
  },

  /**
   * Set a setting value.
   * @param {string} key
   * @param {string|number|boolean} value
   * @returns {void}
   */
  set(key, value) {
    currentSettings[key] = value;
    apply({ key, value });
    save();
  },
};
