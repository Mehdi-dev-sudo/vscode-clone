/**
 * @fileoverview
 * Global keyboard shortcut handler.
 * Registers key combinations and maps them to commands via the event bus.
 */

import { eventBus } from '../events/event-bus.js';
import { KEYBOARD_SHORTCUTS, EVENTS } from './constants.js';

/** @typedef {Function} ShortcutHandler */

/**
 * @typedef {Object} ShortcutBinding
 * @property {string} keys - Human-readable key combo (e.g. "Ctrl+Shift+P").
 * @property {string} event - Event to emit.
 * @property {*} [payload] - Optional data to pass with the event.
 * @property {string} [description] - Human-readable description.
 * @property {Function} [handler] - Direct callback (alternative to event).
 */

/** @type {Map<string, ShortcutBinding>} */
const bindings = new Map();

/** Registered shortcuts. */
const shortcuts = [
  { keys: 'Ctrl+Shift+P', event: EVENTS.COMMAND_EXECUTED, payload: 'command-palette', description: 'Show Command Palette' },
  { keys: 'Ctrl+P',        event: EVENTS.COMMAND_EXECUTED, payload: 'quick-open',      description: 'Quick Open' },
  { keys: 'Ctrl+B',        event: EVENTS.ZEN_MODE_TOGGLED, payload: 'toggle-sidebar',  description: 'Toggle Sidebar' },
  { keys: 'Ctrl+`',        event: EVENTS.PANEL_RESIZED,    payload: 'toggle-panel',    description: 'Toggle Terminal' },
  { keys: 'Ctrl+Shift+E',  event: EVENTS.VIEW_CHANGED,     payload: 'explorer',        description: 'Show Explorer' },
  { keys: 'Ctrl+Shift+F',  event: EVENTS.VIEW_CHANGED,     payload: 'search',          description: 'Show Search' },
  { keys: 'Ctrl+Shift+G',  event: EVENTS.VIEW_CHANGED,     payload: 'source-control',  description: 'Show Source Control' },
  { keys: 'Ctrl+Shift+D',  event: EVENTS.VIEW_CHANGED,     payload: 'run-debug',       description: 'Show Run & Debug' },
  { keys: 'Ctrl+Shift+X',  event: EVENTS.VIEW_CHANGED,     payload: 'extensions',      description: 'Show Extensions' },
  { keys: 'Ctrl+Shift+Up',event: EVENTS.COMMAND_EXECUTED, payload: 'multicursor-add-above', description: 'Add Cursor Above' },
  { keys: 'Ctrl+Shift+Down',event: EVENTS.COMMAND_EXECUTED, payload: 'multicursor-add-below',description: 'Add Cursor Below' },
  { keys: 'Ctrl+D',        event: EVENTS.COMMAND_EXECUTED, payload: 'multicursor-select-all',description: 'Select All Occurrences' },
  { keys: 'Escape',        event: EVENTS.COMMAND_EXECUTED, payload: 'multicursor-collapse',  description: 'Collapse Cursors' },
  { keys: 'Ctrl+W',        event: EVENTS.TAB_CLOSED,       payload: 'close-active',   description: 'Close Tab' },
  { keys: 'Ctrl+K W',      event: EVENTS.COMMAND_EXECUTED, payload: 'close-all-tabs', description: 'Close All Tabs' },
  { keys: 'Ctrl+Shift+Tab',event: EVENTS.COMMAND_EXECUTED, payload: 'previous-tab',    description: 'Previous Tab' },
  { keys: 'Ctrl+N',        event: EVENTS.COMMAND_EXECUTED, payload: 'new-file',        description: 'New File' },
  { keys: 'Ctrl+K Z',      event: EVENTS.ZEN_MODE_TOGGLED, payload: 'zen',             description: 'Toggle Zen Mode' },
  { keys: 'Ctrl+J',        event: EVENTS.PANEL_RESIZED,    payload: 'toggle-panel',    description: 'Toggle Panel' },
  { keys: 'Ctrl+\\',       event: EVENTS.COMMAND_EXECUTED, payload: 'split-editor',    description: 'Split Editor' },
  { keys: 'Ctrl+Shift+1',  event: EVENTS.COMMAND_EXECUTED, payload: 'split-focus-1', description: 'Focus Split 1' },
  { keys: 'Ctrl+Shift+2',  event: EVENTS.COMMAND_EXECUTED, payload: 'split-focus-2', description: 'Focus Split 2' },
  { keys: 'Ctrl+Shift+3',  event: EVENTS.COMMAND_EXECUTED, payload: 'split-focus-3', description: 'Focus Split 3' },
  { keys: 'F11',           event: EVENTS.FULLSCREEN_TOGGLED, description: 'Toggle Fullscreen' },
];

/**
 * Parse a key string into a normalized key combo object.
 * @param {string} str - e.g. "Ctrl+Shift+P"
 * @returns {{ ctrl: boolean, shift: boolean, alt: boolean, key: string }}
 */
function parseKeys(str) {
  const parts = str.split('+');
  const modifiers = { ctrl: false, shift: false, alt: false };
  const keys = [];

  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower === 'ctrl') modifiers.ctrl = true;
    else if (lower === 'shift') modifiers.shift = true;
    else if (lower === 'alt') modifiers.alt = true;
    else keys.push(part);
  }

  // Normalize key
  let key = keys[0] || '';
  if (key.toLowerCase() === '`') key = '`';
  if (key.toLowerCase() === 'escape') key = 'Escape';

  return { ...modifiers, key };
}

/**
 * Match a keyboard event against a binding.
 * @param {KeyboardEvent} e
 * @param {{ ctrl: boolean, shift: boolean, alt: boolean, key: string }} binding
 * @returns {boolean}
 */
function matches(e, binding) {
  const isCtrl = e.ctrlKey || e.metaKey;
  return (
    isCtrl === binding.ctrl &&
    e.shiftKey === binding.shift &&
    e.altKey === binding.alt &&
    e.key.toLowerCase() === binding.key.toLowerCase()
  );
}

/** Handle keydown events. */
function onKeyDown(e) {
  // Don't intercept when typing in inputs
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

  for (const shortcut of shortcuts) {
    const parsed = parseKeys(shortcut.keys);
    if (matches(e, parsed)) {
      e.preventDefault();
      e.stopPropagation();
      if (shortcut.handler) {
        shortcut.handler();
      } else if (shortcut.event) {
        eventBus.emit(shortcut.event, shortcut.payload);
      }
      return;
    }
  }
}

/**
 * KeyboardShortcuts module.
 * @namespace
 */
export const KeyboardShortcuts = {
  /** Initialize global keyboard listener. */
  init() {
    document.addEventListener('keydown', onKeyDown);
  },

  /** Destroy all listeners. */
  destroy() {
    document.removeEventListener('keydown', onKeyDown);
  },
};
