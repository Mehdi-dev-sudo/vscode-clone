// @ts-check

/**
 * @fileoverview
 * Settings Editor view — JSON-inspired settings UI.
 * Lets users configure theme, font size, tab size, and more.
 * All settings are persisted to localStorage.
 */

import { createElement, empty } from '../../utils/dom.js';
import { getItem, setItem } from '../../storage/local-storage.js';
import { STORAGE_KEYS, THEMES } from '../../core/constants.js';
import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { Notifications } from '../notifications/notifications.js';

const DEFAULT_SETTINGS = {
  fontSize: 14,
  tabSize: 4,
  wordWrap: false,
  lineNumbers: true,
  minimap: true,
  smoothScrolling: true,
  cursorBlinking: 'blink',
  autoSave: false,
  formatOnSave: false,
  bracketPairColorization: true,
};

/**
 * Load settings from storage.
 * @returns {Object}
 */
function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...getItem(STORAGE_KEYS.SETTINGS, {}) };
}

/**
 * Save settings to storage.
 * @param {Object} settings
 */
function saveSettings(settings) {
  setItem(STORAGE_KEYS.SETTINGS, settings);
  eventBus.emit(EVENTS.SETTINGS_CHANGED, settings);
}

/**
 * Render the settings view.
 * @param {HTMLElement} container
 */
function render(container) {
  empty(container);

  const settings = loadSettings();

  const header = createElement('div', { className: 'sidebar__header' });
  header.appendChild(createElement('span', { className: 'sidebar__title', text: 'SETTINGS' }));
  container.appendChild(header);

  const editor = createElement('div', { className: 'settings-editor' });
  container.appendChild(editor);

  // Common Settings
  const commonSection = createSection('Common');
  commonSection.appendChild(field('Font Size', 'fontSize', 'number', settings, (v) => ({ ...loadSettings(), fontSize: parseInt(v) || 14 })));
  commonSection.appendChild(field('Tab Size', 'tabSize', 'number', settings, (v) => ({ ...loadSettings(), tabSize: parseInt(v) || 4 })));
  commonSection.appendChild(field('Word Wrap', 'wordWrap', 'checkbox', settings, (v) => ({ ...loadSettings(), wordWrap: v })));
  commonSection.appendChild(field('Line Numbers', 'lineNumbers', 'checkbox', settings, (v) => ({ ...loadSettings(), lineNumbers: v })));
  editor.appendChild(commonSection);

  // Editor Settings
  const editorSection = createSection('Editor');
  editorSection.appendChild(field('Minimap', 'minimap', 'checkbox', settings, (v) => ({ ...loadSettings(), minimap: v })));
  editorSection.appendChild(field('Smooth Scrolling', 'smoothScrolling', 'checkbox', settings, (v) => ({ ...loadSettings(), smoothScrolling: v })));
  editorSection.appendChild(field('Cursor Blinking', 'cursorBlinking', 'select', settings, (v) => ({ ...loadSettings(), cursorBlinking: v }), ['blink', 'smooth', 'phase', 'expand', 'solid']));
  editorSection.appendChild(field('Bracket Pair Colorization', 'bracketPairColorization', 'checkbox', settings, (v) => ({ ...loadSettings(), bracketPairColorization: v })));
  editor.appendChild(editorSection);

  // Files
  const filesSection = createSection('Files');
  filesSection.appendChild(field('Auto Save', 'autoSave', 'checkbox', settings, (v) => ({ ...loadSettings(), autoSave: v })));
  filesSection.appendChild(field('Format On Save', 'formatOnSave', 'checkbox', settings, (v) => ({ ...loadSettings(), formatOnSave: v })));
  editor.appendChild(filesSection);
}

/**
 * Create a settings section.
 * @param {string} title
 * @returns {HTMLElement}
 */
function createSection(title) {
  const section = createElement('div', { className: 'settings-editor__section' });
  section.appendChild(createElement('div', { className: 'settings-editor__section-title', text: title }));
  return section;
}

/**
 * Create a settings field.
 * @param {string} label
 * @param {string} key
 * @param {'text'|'number'|'checkbox'|'select'} type
 * @param {Object} settings
 * @param {Function} onChange
 * @param {Array<string>} [options]
 * @returns {HTMLElement}
 */
function field(label, key, type, settings, onChange, options) {
  const fieldEl = createElement('div', { className: 'settings-editor__field' });

  const labelGroup = createElement('div');
  labelGroup.appendChild(createElement('div', { className: 'settings-editor__label', text: label }));
  fieldEl.appendChild(labelGroup);

  if (type === 'checkbox') {
    const input = createElement('input', {
      className: 'settings-editor__checkbox',
      attrs: { type: 'checkbox', checked: settings[key] ? '' : undefined, 'aria-label': label },
      events: {
        change: (e) => {
          const newSettings = onChange(e.target.checked);
          saveSettings(newSettings);
          Notifications.info(`Setting updated: ${label}`);
        },
      },
    });
    fieldEl.appendChild(input);
  } else if (type === 'select') {
    const select = createElement('select', {
      className: 'settings-editor__select',
      attrs: { 'aria-label': label },
      events: {
        change: (e) => {
          const newSettings = onChange(e.target.value);
          saveSettings(newSettings);
        },
      },
    });
    options?.forEach((opt) => {
      const option = createElement('option', {
        text: opt,
        attrs: { value: opt, ...(settings[key] === opt ? { selected: '' } : {}) },
      });
      select.appendChild(option);
    });
    fieldEl.appendChild(select);
  } else {
    const input = createElement('input', {
      className: 'settings-editor__input',
      attrs: { type, value: settings[key], 'aria-label': label },
      events: {
        change: (e) => {
          const newSettings = onChange(e.target.value);
          saveSettings(newSettings);
        },
      },
    });
    fieldEl.appendChild(input);
  }

  return fieldEl;
}

/**
 * SettingsView component module.
 * @namespace
 */
export const SettingsView = {
  /**
   * Render the Settings view.
   * @param {HTMLElement} container
   */
  render(container) {
    render(container);
  },
};

