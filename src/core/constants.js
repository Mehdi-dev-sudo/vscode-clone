/**
 * @fileoverview
 * Application-wide constants.
 * All magic numbers, strings, and configuration values live here.
 * Never hardcode values elsewhere; always reference these constants.
 */

/** @enum {string} */
export const VIEWS = {
  EXPLORER: 'explorer',
  SEARCH: 'search',
  SOURCE_CONTROL: 'source-control',
  RUN_DEBUG: 'run-debug',
  EXTENSIONS: 'extensions',
};

/** @enum {string} */
export const THEMES = {
  DARK: 'theme-dark',
  LIGHT: 'theme-light',
  HIGH_CONTRAST: 'theme-high-contrast',
  DRACULA: 'theme-dracula',
  MONOKAI: 'theme-monokai',
};

/** @enum {string} */
export const EVENTS = {
  VIEW_CHANGED: 'view:changed',
  THEME_CHANGED: 'theme:changed',
  TAB_OPENED: 'tab:opened',
  TAB_CLOSED: 'tab:closed',
  TAB_PINNED: 'tab:pinned',
  TAB_REORDERED: 'tab:reordered',
  FILE_CREATED: 'file:created',
  FILE_DELETED: 'file:deleted',
  FILE_RENAMED: 'file:renamed',
  FILE_SELECTED: 'file:selected',
  TERMINAL_ADDED: 'terminal:added',
  TERMINAL_REMOVED: 'terminal:removed',
  TERMINAL_RESIZED: 'terminal:resized',
  SIDEBAR_RESIZED: 'sidebar:resized',
  PANEL_RESIZED: 'panel:resized',
  COMMAND_EXECUTED: 'command:executed',
  NOTIFICATION_ADDED: 'notification:added',
  NOTIFICATION_REMOVED: 'notification:removed',
  SEARCH_QUERIED: 'search:queried',
  ZEN_MODE_TOGGLED: 'zen:toggled',
  FULLSCREEN_TOGGLED: 'fullscreen:toggled',
  SETTINGS_CHANGED: 'settings:changed',
  WORKSPACE_SWITCHED: 'workspace:switched',
  DRAG_START: 'drag:start',
  DRAG_END: 'drag:end',
};

/** @enum {string} */
export const STORAGE_KEYS = {
  THEME: 'vscode-clone:theme',
  SIDEBAR_WIDTH: 'vscode-clone:sidebar-width',
  PANEL_HEIGHT: 'vscode-clone:panel-height',
  ACTIVE_VIEW: 'vscode-clone:active-view',
  SIDEBAR_VISIBLE: 'vscode-clone:sidebar-visible',
  PANEL_VISIBLE: 'vscode-clone:panel-visible',
  OPEN_TABS: 'vscode-clone:open-tabs',
  EXPLORER_STATE: 'vscode-clone:explorer-state',
  SETTINGS: 'vscode-clone:settings',
};

/** @enum {number} */
export const DIMENSIONS = {
  ACTIVITY_BAR_WIDTH: 48,
  SIDEBAR_MIN_WIDTH: 170,
  SIDEBAR_DEFAULT_WIDTH: 260,
  SIDEBAR_MAX_WIDTH: 500,
  PANEL_MIN_HEIGHT: 50,
  PANEL_DEFAULT_HEIGHT: 200,
  PANEL_MAX_HEIGHT: 500,
  TAB_HEIGHT: 35,
  STATUS_BAR_HEIGHT: 22,
  BREADCRUMB_HEIGHT: 22,
  MINIMAP_WIDTH: 60,
};

/** @enum {string} */
export const KEYBOARD_SHORTCUTS = {
  COMMAND_PALETTE: 'Ctrl+Shift+P',
  QUICK_OPEN: 'Ctrl+P',
  TOGGLE_SIDEBAR: 'Ctrl+B',
  TOGGLE_TERMINAL: 'Ctrl+`',
  ZEN_MODE: 'Ctrl+K Z',
  FULLSCREEN: 'F11',
  CLOSE_TAB: 'Ctrl+W',
  NEW_FILE: 'Ctrl+N',
  SAVE_FILE: 'Ctrl+S',
  SEARCH: 'Ctrl+Shift+F',
  EXPLORER: 'Ctrl+Shift+E',
  EXTENSIONS: 'Ctrl+Shift+X',
  SOURCE_CONTROL: 'Ctrl+Shift+G',
  RUN_DEBUG: 'Ctrl+Shift+D',
};

/** @type {string} */
export const APP_NAME = 'VS Code Clone';

/** @type {string} */
export const APP_VERSION = '1.0.0';

/** @type {number} */
export const NOTIFICATION_DURATION = 4000;

/** @type {number} */
export const DEBOUNCE_DELAY = 150;

/** @type {number} */
export const CONTEXT_MENU_OFFSET = 2;
