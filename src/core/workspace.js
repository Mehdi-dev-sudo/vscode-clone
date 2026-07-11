/**
 * @fileoverview
 * Workspace management — handles switching between different workspaces,
 * tracking recently opened folders, and persisting workspace state.
 */

import { getItem, setItem } from '../storage/local-storage.js';
import { STORAGE_KEYS, EVENTS } from '../core/constants.js';
import { eventBus } from '../events/event-bus.js';
import { Notifications } from '../components/notifications/notifications.js';

/** @type {Array<{name: string, path: string, lastOpened: number}>} */
const DEFAULT_WORKSPACES = [
  { name: 'VS Code Clone', path: '/workspace/vscode-clone', lastOpened: Date.now() },
  { name: 'My Project', path: '/workspace/my-project', lastOpened: Date.now() - 86400000 },
  { name: 'Portfolio', path: '/workspace/portfolio', lastOpened: Date.now() - 172800000 },
];

/** Currently active workspace path. */
let currentWorkspace = '/workspace/vscode-clone';

/**
 * Load workspaces from storage.
 * @returns {Array}
 */
function loadWorkspaces() {
  return getItem('vscode-clone:workspaces', DEFAULT_WORKSPACES);
}

/**
 * Save workspaces to storage.
 * @param {Array} workspaces
 */
function saveWorkspaces(workspaces) {
  setItem('vscode-clone:workspaces', workspaces);
}

/**
 * Switch to a workspace.
 * @param {string} path
 */
function switchWorkspace(path) {
  currentWorkspace = path;
  const workspaces = loadWorkspaces();
  const ws = workspaces.find((w) => w.path === path);
  if (ws) {
    ws.lastOpened = Date.now();
    saveWorkspaces(workspaces);
  }
  eventBus.emit(EVENTS.WORKSPACE_SWITCHED, { path, name: ws?.name || path });
  Notifications.info(`Switched to workspace: ${ws?.name || path}`);
}

/**
 * Add a workspace to the recent list.
 * @param {string} name
 * @param {string} path
 */
function addWorkspace(name, path) {
  const workspaces = loadWorkspaces();
  const existing = workspaces.findIndex((w) => w.path === path);
  if (existing !== -1) {
    workspaces[existing].lastOpened = Date.now();
  } else {
    workspaces.push({ name, path, lastOpened: Date.now() });
  }
  saveWorkspaces(workspaces);
}

export const WorkspaceManager = {
  /** @returns {string} Current workspace path. */
  getCurrent() { return currentWorkspace; },

  /** @returns {Array} Recent workspaces sorted by last opened. */
  getRecent() {
    return loadWorkspaces().sort((a, b) => b.lastOpened - a.lastOpened);
  },

  /**
   * Switch to a workspace.
   * @param {string} path
   */
  switch(path) { switchWorkspace(path); },

  /**
   * Add workspace to history.
   * @param {string} name
   * @param {string} path
   */
  add(name, path) { addWorkspace(name, path); },
};
