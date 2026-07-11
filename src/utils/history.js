/**
 * @fileoverview
 * Recent files and command history tracking.
 * Persists recently opened files and executed commands to localStorage.
 */

import { getItem, setItem } from '../storage/local-storage.js';
import { eventBus } from '../events/event-bus.js';
import { EVENTS } from '../core/constants.js';

const RECENT_FILES_KEY = 'vscode-clone:recent-files';
const MAX_RECENT_FILES = 15;

/** @type {Array<{name: string, path: string, openedAt: number}>} */
let recentFiles = [];

/**
 * Load recent files from storage.
 */
function load() {
  recentFiles = getItem(RECENT_FILES_KEY, []);
}

/**
 * Save recent files to storage.
 */
function save() {
  setItem(RECENT_FILES_KEY, recentFiles);
}

/**
 * Add a file to recent files.
 * @param {{name: string, path?: string}} file
 */
export function addRecentFile(file) {
  load();
  const existing = recentFiles.findIndex((f) => f.name === file.name);
  if (existing !== -1) {
    recentFiles[existing].openedAt = Date.now();
  } else {
    recentFiles.unshift({ name: file.name, path: file.path || file.name, openedAt: Date.now() });
    if (recentFiles.length > MAX_RECENT_FILES) {
      recentFiles = recentFiles.slice(0, MAX_RECENT_FILES);
    }
  }
  save();
}

/**
 * Get recent files sorted by most recent.
 * @param {number} [limit=10]
 * @returns {Array}
 */
export function getRecentFiles(limit = 10) {
  load();
  return recentFiles
    .sort((a, b) => b.openedAt - a.openedAt)
    .slice(0, limit);
}

/**
 * Clear recent files history.
 */
export function clearRecentFiles() {
  recentFiles = [];
  save();
}

// Auto-track file opens
eventBus.on(EVENTS.TAB_OPENED, (file) => {
  if (file?.name) {
    addRecentFile(file);
  }
});
