// @ts-check

/**
 * @fileoverview
 * Application-wide constants.
 * All magic numbers, strings, and configuration values live here.
 * Never hardcode values elsewhere; always reference these constants.
 */

/**
 * @typedef {Object} ViewKeys
 * @property {string} EXPLORER
 * @property {string} SEARCH
 * @property {string} SOURCE_CONTROL
 * @property {string} RUN_DEBUG
 * @property {string} EXTENSIONS
 */

/** @readonly @type {ViewKeys} */
export const VIEWS = {
  EXPLORER: 'explorer',
  SEARCH: 'search',
  SOURCE_CONTROL: 'source-control',
  RUN_DEBUG: 'run-debug',
  EXTENSIONS: 'extensions',
};

/**
 * @typedef {Object} ThemeKeys
 * @property {string} DARK
 * @property {string} LIGHT
 * @property {string} HIGH_CONTRAST
 * @property {string} DRACULA
 * @property {string} MONOKAI
 */

/** @readonly @type {ThemeKeys} */
export const THEMES = {
  DARK: 'theme-dark',
  LIGHT: 'theme-light',
  HIGH_CONTRAST: 'theme-high-contrast',
  DRACULA: 'theme-dracula',
  MONOKAI: 'theme-monokai',
};

/**
 * @typedef {Object} EventKeys
 * @property {string} VIEW_CHANGED
 * @property {string} THEME_CHANGED
 * @property {string} TAB_OPENED
 * @property {string} TAB_CLOSED
 * @property {string} TAB_PINNED
 * @property {string} TAB_REORDERED
 * @property {string} FILE_CREATED
 * @property {string} FILE_DELETED
 * @property {string} FILE_RENAMED
 * @property {string} FILE_SELECTED
 * @property {string} TERMINAL_ADDED
 * @property {string} TERMINAL_REMOVED
 * @property {string} TERMINAL_RESIZED
 * @property {string} TERMINAL_SHOW
 * @property {string} SIDEBAR_RESIZED
 * @property {string} PANEL_RESIZED
 * @property {string} COMMAND_EXECUTED
 * @property {string} NOTIFICATION_ADDED
 * @property {string} NOTIFICATION_REMOVED
 * @property {string} SEARCH_QUERIED
 * @property {string} ZEN_MODE_TOGGLED
 * @property {string} FULLSCREEN_TOGGLED
 * @property {string} SETTINGS_CHANGED
 * @property {string} WORKSPACE_SWITCHED
 * @property {string} DRAG_START
 * @property {string} DRAG_END
 */

/** @readonly @type {EventKeys} */
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
  TERMINAL_SHOW: 'terminal:show',
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

/**
 * @typedef {Object} StorageKeys
 * @property {string} THEME
 * @property {string} SIDEBAR_WIDTH
 * @property {string} PANEL_HEIGHT
 * @property {string} ACTIVE_VIEW
 * @property {string} SIDEBAR_VISIBLE
 * @property {string} PANEL_VISIBLE
 * @property {string} OPEN_TABS
 * @property {string} EXPLORER_STATE
 * @property {string} SETTINGS
 */

/** @readonly @type {StorageKeys} */
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

/**
 * @typedef {Object} Dimensions
 * @property {number} ACTIVITY_BAR_WIDTH
 * @property {number} SIDEBAR_MIN_WIDTH
 * @property {number} SIDEBAR_DEFAULT_WIDTH
 * @property {number} SIDEBAR_MAX_WIDTH
 * @property {number} PANEL_MIN_HEIGHT
 * @property {number} PANEL_DEFAULT_HEIGHT
 * @property {number} PANEL_MAX_HEIGHT
 * @property {number} TAB_HEIGHT
 * @property {number} STATUS_BAR_HEIGHT
 * @property {number} BREADCRUMB_HEIGHT
 * @property {number} MINIMAP_WIDTH
 */

/** @readonly @type {Dimensions} */
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

/**
 * @typedef {Object} KeyboardShortcutKeys
 * @property {string} COMMAND_PALETTE
 * @property {string} QUICK_OPEN
 * @property {string} TOGGLE_SIDEBAR
 * @property {string} TOGGLE_TERMINAL
 * @property {string} ZEN_MODE
 * @property {string} FULLSCREEN
 * @property {string} CLOSE_TAB
 * @property {string} NEW_FILE
 * @property {string} SAVE_FILE
 * @property {string} SEARCH
 * @property {string} EXPLORER
 * @property {string} EXTENSIONS
 * @property {string} SOURCE_CONTROL
 * @property {string} RUN_DEBUG
 */

/** @readonly @type {KeyboardShortcutKeys} */
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

/** @readonly @type {string} */
export const APP_NAME = 'VS Code Clone';

/** @readonly @type {string} */
export const APP_VERSION = '1.0.0';

/** @readonly @type {number} */
export const NOTIFICATION_DURATION = 4000;

/** @readonly @type {number} */
export const DEBOUNCE_DELAY = 150;

/** @readonly @type {number} */
export const CONTEXT_MENU_OFFSET = 2;
