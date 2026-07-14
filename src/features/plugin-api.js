// @ts-check

/**
 * @fileoverview
 * Plugin API — allows third-party plugins to extend the IDE.
 * Supported hooks:
 *   registerCommand(id, handler)     — add commands to palette
 *   registerTheme(name, colors)      — add custom themes
 *   registerPanel(id, label, renderFn) — add panel tabs
 *   registerSidebar(id, icon, label, renderFn) — add sidebar views
 *   registerStatusItem(id, renderFn) — add status bar items
 */

import { eventBus } from '../events/event-bus.js';
import { EVENTS } from '../core/constants.js';
import { Notifications } from '../components/notifications/notifications.js';

/** @type {Map<string, Function>} */
const commands = new Map();

/** @type {Array<{id: string, label: string, renderFn: Function}>} */
const panelPlugins = [];

/** @type {Array<{id: string, icon: string, label: string, renderFn: Function}>} */
const sidebarPlugins = [];

/** @type {Array<{id: string, renderFn: Function}>} */
const statusPlugins = [];

/**
 * Register a new command that appears in the Command Palette.
 * @param {string} id - Unique command ID (used in palette commands)
 * @param {Function} handler - Called when command is executed
 */
export function registerCommand(id, handler) {
  if (commands.has(id)) {
    console.warn(`[Plugin API] Command "${id}" already registered — overwriting`);
  }
  commands.set(id, handler);
  eventBus.emit('plugin:command-registered', { id });
}

/**
 * Register a custom theme.
 * @param {string} name - Theme name (e.g., 'My Theme')
 * @param {Object<string, string>} colors - CSS variable map
 */
export function registerTheme(name, colors) {
  if (!name || !colors) return;
  // Store in a registry that ThemeManager can pick up
  const themes = JSON.parse(localStorage.getItem('vscode-clone:plugin-themes') || '{}');
  themes[name] = colors;
  localStorage.setItem('vscode-clone:plugin-themes', JSON.stringify(themes));
  eventBus.emit('plugin:theme-registered', { name, colors });
  Notifications.info(`Plugin theme "${name}" registered`);
}

/**
 * Register a new panel tab (appears alongside TERMINAL, OUTPUT, etc.).
 * @param {string} id - Panel ID
 * @param {string} label - Display label
 * @param {Function} renderFn - (container: HTMLElement) => void
 */
export function registerPanel(id, label, renderFn) {
  panelPlugins.push({ id, label, renderFn });
  eventBus.emit('plugin:panel-registered', { id, label });
  Notifications.info(`Plugin panel "${label}" added`);
}

/**
 * Register a new sidebar view (appears alongside Explorer, Search, etc.).
 * @param {string} id - View ID
 * @param {string} icon - SVG icon string
 * @param {string} label - Display label for tooltip
 * @param {Function} renderFn - (container: HTMLElement) => void
 */
export function registerSidebar(id, icon, label, renderFn) {
  sidebarPlugins.push({ id, icon, label, renderFn });
  eventBus.emit('plugin:sidebar-registered', { id, label });
  Notifications.info(`Plugin sidebar "${label}" added`);
}

/**
 * Register a status bar item.
 * @param {string} id - Item ID
 * @param {Function} renderFn - () => string (HTML content)
 */
export function registerStatusItem(id, renderFn) {
  statusPlugins.push({ id, renderFn });
  eventBus.emit('plugin:status-registered', { id });
}

/**
 * Execute a plugin-registered command.
 * @param {string} id
 * @returns {boolean} Whether a handler was found
 */
export function executePluginCommand(id) {
  if (commands.has(id)) {
    try {
      commands.get(id)();
      return true;
    } catch (err) {
      console.error(`[Plugin API] Command "${id}" failed:`, err);
    }
  }
  return false;
}

/**
 * Get all registered panel plugins.
 * @returns {Array<{id: string, label: string, renderFn: Function}>}
 */
export function getPanelPlugins() { return panelPlugins; }

/**
 * Get all registered sidebar plugins.
 * @returns {Array<{id: string, icon: string, label: string, renderFn: Function}>}
 */
export function getSidebarPlugins() { return sidebarPlugins; }

/**
 * Get all registered status plugins.
 * @returns {Array<{id: string, renderFn: Function}>}
 */
export function getStatusPlugins() { return statusPlugins; }

/**
 * Load all known plugins from the plugins/ directory.
 * @returns {Promise<void>}
 */
async function loadKnownPlugins() {
  const pluginPaths = [
    '/plugins/hello-world.js',
    '/plugins/date-preview.js',
  ];

  for (const path of pluginPaths) {
    try {
      const mod = await import(path);
      if (mod.default?.init) {
        mod.default.init();
        console.log(`[Plugin API] Loaded: ${path}`);
      }
    } catch (err) {
      console.log(`[Plugin API] Skipped ${path}:`, err?.message || 'not found');
    }
  }
}

export const PluginAPI = {
  init() {
    // Listen for command execution that might be plugin-registered
    eventBus.on(EVENTS.COMMAND_EXECUTED, (cmd) => {
      if (cmd.startsWith('plugin:')) {
        executePluginCommand(cmd.slice(7));
      }
    });

    // Try loading plugins
    loadKnownPlugins().then(() => {
      const total = commands.size + panelPlugins.length + sidebarPlugins.length + statusPlugins.length;
      if (total > 0) {
        console.log(`[Plugin API] ${commands.size}cmds, ${panelPlugins.length}panels, ${sidebarPlugins.length}sidebars, ${statusPlugins.length}status`);
      }
    });
  },
};
