// @ts-check

/**
 * @fileoverview
 * Notification Center — stores a history of all notifications
 * and provides a UI to view them in a list.
 */

import { getItem, setItem } from '../storage/local-storage.js';

const HISTORY_KEY = 'vscode-clone:notification-history';
const MAX_HISTORY = 50;

/** @type {Array<{id: string, type: string, title: string, message: string, timestamp: number}>} */
let history = [];

/**
 * Load notification history from storage.
 */
function load() {
  history = getItem(HISTORY_KEY, []);
}

/**
 * Save notification history to storage.
 */
function save() {
  setItem(HISTORY_KEY, history);
}

/**
 * Add a notification to the history.
 * @param {{type: string, title: string, message?: string}} notif
 * @returns {string} Notification ID.
 */
export function addToHistory(notif) {
  load();
  const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  history.unshift({ id, ...notif, timestamp: Date.now() });
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }
  save();
  return id;
}

/**
 * Get the full notification history.
 * @param {number} [limit]
 * @returns {Array}
 */
export function getHistory(limit) {
  load();
  return limit ? history.slice(0, limit) : history;
}

/**
 * Clear all notification history.
 */
export function clearHistory() {
  history = [];
  save();
}

/**
 * Remove a notification from history by ID.
 * @param {string} id
 */
export function removeFromHistory(id) {
  load();
  history = history.filter((n) => n.id !== id);
  save();
}

