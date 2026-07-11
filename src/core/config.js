/**
 * @fileoverview
 * Application configuration — merges default settings with persisted user settings.
 * Provides a unified API for reading/writing configuration values.
 */

import { getItem, setItem } from '../storage/local-storage.js';
import { STORAGE_KEYS } from './constants.js';
import { eventBus } from '../events/event-bus.js';
import { EVENTS } from './constants.js';

/**
 * Default configuration values.
 * @type {Object}
 */
const DEFAULTS = {
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
  sidebarPosition: 'left',
  activityBarPosition: 'left',
  terminalClearOnNewCommand: false,
  confirmDelete: true,
  autoRevealExplorer: true,
  tabCloseButton: 'right',
  animationSpeed: 'normal',
};

/** Cached config state. */
let config = {};

/**
 * Load config from storage and merge with defaults.
 * @returns {Object}
 */
function load() {
  const saved = getItem(STORAGE_KEYS.SETTINGS, {});
  config = { ...DEFAULTS, ...saved };
  return config;
}

/**
 * Save config to storage.
 */
function save() {
  setItem(STORAGE_KEYS.SETTINGS, config);
}

/**
 * Config API.
 * @namespace
 */
export const Config = {
  /**
   * Get a config value by key.
   * @param {string} key
   * @param {*} [fallback]
   * @returns {*}
   */
  get(key, fallback) {
    if (Object.keys(config).length === 0) load();
    return key in config ? config[key] : (fallback ?? DEFAULTS[key]);
  },

  /**
   * Set a config value.
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    load();
    config[key] = value;
    save();
    eventBus.emit(EVENTS.SETTINGS_CHANGED, { key, value });
  },

  /**
   * Get all config values.
   * @returns {Object}
   */
  getAll() {
    if (Object.keys(config).length === 0) load();
    return { ...config };
  },

  /** Reset config to defaults. */
  reset() {
    config = { ...DEFAULTS };
    save();
    eventBus.emit(EVENTS.SETTINGS_CHANGED, config);
  },
};
