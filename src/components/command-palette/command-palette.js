/**
 * @fileoverview
 * Command Palette component (Ctrl+Shift+P) and Quick Open (Ctrl+P).
 * Provides a searchable list of commands and files.
 * Commands are executed via the event bus.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { createElement, empty, $, debounce } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';

/** @type {Array<{id: string, label: string, icon?: string, shortcut?: string, action?: Function}>} */
const COMMANDS = [
  { id: 'command-palette', label: 'Show All Commands', icon: ICONS.search, shortcut: 'Ctrl+Shift+P', action: null },
  { id: 'quick-open', label: 'Quick Open File', icon: ICONS.file, shortcut: 'Ctrl+P', action: null },
  { id: 'toggle-sidebar', label: 'Toggle Sidebar Visibility', icon: ICONS.files, shortcut: 'Ctrl+B', action: null },
  { id: 'toggle-panel', label: 'Toggle Panel Visibility', icon: ICONS.terminal, shortcut: 'Ctrl+`', action: null },
  { id: 'view-explorer', label: 'Focus: Explorer', icon: ICONS.files, shortcut: 'Ctrl+Shift+E', action: null },
  { id: 'view-search', label: 'Focus: Search', icon: ICONS.search, shortcut: 'Ctrl+Shift+F', action: null },
  { id: 'view-source-control', label: 'Focus: Source Control', icon: ICONS.gitBranch, shortcut: 'Ctrl+Shift+G', action: null },
  { id: 'view-debug', label: 'Focus: Run and Debug', icon: ICONS.debug, shortcut: 'Ctrl+Shift+D', action: null },
  { id: 'view-extensions', label: 'Focus: Extensions', icon: ICONS.extensions, shortcut: 'Ctrl+Shift+X', action: null },
  { id: 'new-file', label: 'New File', icon: ICONS.newFile, shortcut: 'Ctrl+N', action: null },
  { id: 'new-folder', label: 'New Folder', icon: ICONS.newFolder, action: null },
  { id: 'rename-file', label: 'Rename Current File', icon: ICONS.rename, action: null },
  { id: 'delete-file', label: 'Delete Current File', icon: ICONS.close, action: null },
  { id: 'theme-dark', label: 'Theme: Dark+', icon: ICONS.lightBulb, action: null },
  { id: 'theme-light', label: 'Theme: Light+', icon: ICONS.lightBulb, action: null },
  { id: 'theme-dracula', label: 'Theme: Dracula', icon: ICONS.lightBulb, action: null },
  { id: 'theme-monokai', label: 'Theme: Monokai', icon: ICONS.lightBulb, action: null },
  { id: 'theme-creator', label: 'Theme Creator: Customize Colors', icon: ICONS.lightBulb, action: null },
  { id: 'export-theme', label: 'Export Theme as JSON', icon: ICONS.copy, action: null },
  { id: 'import-theme', label: 'Import Theme from JSON', icon: ICONS.paste, action: null },
  { id: 'zen-mode', label: 'Toggle Zen Mode', icon: ICONS.unfold, shortcut: 'Ctrl+K Z', action: null },
  { id: 'fullscreen', label: 'Toggle Fullscreen', icon: ICONS.bracket, shortcut: 'F11', action: null },
  { id: 'settings', label: 'Open Settings', icon: ICONS.settings, action: null },
  { id: 'workspace-snapshots', label: 'Workspace Snapshots: Save/Restore', icon: ICONS.files, action: null },
  { id: 'snapshot-take', label: 'Snapshot: Save Current State', icon: ICONS.check, action: null },
  { id: 'snapshot-restore', label: 'Snapshot: Restore Last', icon: ICONS.refresh, action: null },
  { id: 'layout-presets', label: 'Layout Presets: Switch Layout', icon: ICONS.files, action: null },
  { id: 'layout-editor-focus', label: 'Layout: Editor Focus (Minimal)', icon: ICONS.unfold, action: null },
  { id: 'layout-terminal-max', label: 'Layout: Terminal Max', icon: ICONS.terminal, action: null },
  { id: 'layout-minimal', label: 'Layout: Minimal (Clean Slate)', icon: ICONS.bracket, action: null },
  { id: 'focus-explorer', label: 'Focus: Explorer Panel', icon: ICONS.files, action: null },
  { id: 'focus-terminal', label: 'Focus: Terminal', icon: ICONS.terminal, action: null },
  { id: 'focus-editor', label: 'Focus: Editor Area', icon: ICONS.rename, action: null },
  { id: 'close-all-tabs', label: 'Close All Tabs', icon: ICONS.close, action: null },
  { id: 'clear-notifications', label: 'Clear All Notifications', icon: ICONS.clearAll, action: null },
  { id: 'about', label: 'About VS Code Clone', icon: ICONS.info, action: null },
];

/** @type {HTMLElement|null} */
let paletteEl = null;

/** @type {HTMLElement|null} */
let resultsEl = null;

/** @type {HTMLElement|null} */
let inputEl = null;

/** @type {HTMLElement|null} */
let quickOpenEl = null;

/** @type {HTMLElement|null} */
let quickOpenResultsEl = null;

/** @type {HTMLElement|null} */
let quickOpenInputEl = null;

/** Whether the command palette is currently open. */
let isPaletteOpen = false;
let isQuickOpenOpen = false;

/**
 * Filter commands based on query.
 * @param {string} query
 * @returns {Array}
 */
function filterCommands(query) {
  if (!query.trim()) return COMMANDS;
  const lower = query.toLowerCase();
  return COMMANDS.filter((cmd) => cmd.label.toLowerCase().includes(lower));
}

/**
 * Execute a command.
 * @param {string} id
 * @returns {void}
 */
function executeCommand(id) {
  // Theme commands
  if (id.startsWith('theme-')) {
    eventBus.emit(EVENTS.THEME_CHANGED, id);
    hide();
    return;
  }

  switch (id) {
    case 'command-palette':
    case 'quick-open':
      break;
    case 'toggle-sidebar':
      eventBus.emit(EVENTS.VIEW_CHANGED, 'toggle-sidebar');
      break;
    case 'toggle-panel':
      eventBus.emit(EVENTS.PANEL_RESIZED, 'toggle-panel');
      break;
    case 'view-explorer':
      eventBus.emit(EVENTS.VIEW_CHANGED, 'explorer');
      break;
    case 'view-search':
      eventBus.emit(EVENTS.VIEW_CHANGED, 'search');
      break;
    case 'view-source-control':
      eventBus.emit(EVENTS.VIEW_CHANGED, 'source-control');
      break;
    case 'view-debug':
      eventBus.emit(EVENTS.VIEW_CHANGED, 'debug');
      break;
    case 'view-extensions':
      eventBus.emit(EVENTS.VIEW_CHANGED, 'extensions');
      break;
    case 'zen-mode':
      eventBus.emit(EVENTS.ZEN_MODE_TOGGLED, 'zen');
      break;
    case 'fullscreen':
      eventBus.emit(EVENTS.FULLSCREEN_TOGGLED);
      break;
    case 'new-file':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'new-file');
      eventBus.emit(EVENTS.VIEW_CHANGED, 'explorer');
      break;
    case 'new-folder':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'new-folder');
      eventBus.emit(EVENTS.VIEW_CHANGED, 'explorer');
      break;
    case 'rename-file':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'rename-file');
      break;
    case 'delete-file':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'delete-file');
      break;
    case 'export-theme':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'export-theme');
      break;
    case 'import-theme':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'import-theme');
      break;
    case 'snapshot-take':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'take-snapshot');
      break;
    case 'snapshot-restore':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'restore-snapshot');
      break;
    case 'layout-editor-focus':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'layout-editor-focus');
      break;
    case 'layout-terminal-max':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'layout-terminal-max');
      break;
    case 'layout-minimal':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'layout-minimal');
      break;
    case 'focus-explorer':
      eventBus.emit(EVENTS.VIEW_CHANGED, 'explorer');
      break;
    case 'focus-terminal':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'focus-terminal');
      break;
    case 'focus-editor':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'focus-editor');
      break;
    case 'close-all-tabs':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'close-all-tabs');
      break;
    case 'clear-notifications':
      eventBus.emit(EVENTS.COMMAND_EXECUTED, 'clear-notifications');
      break;
    case 'about':
      alert('VS Code Clone v1.0.0\nBuilt with zero frameworks by Mehdi Khorshidi far.\nRepo: https://github.com/Mehdi-dev-sudo');
      break;
    default:
      eventBus.emit(EVENTS.COMMAND_EXECUTED, id);
  }
  hide();
}

/**
 * Render command results.
 * @param {Array} items
 * @returns {void}
 */
function renderResults(items) {
  if (!resultsEl) return;
  empty(resultsEl);

  if (items.length === 0) {
    resultsEl.appendChild(createElement('div', {
      className: 'command-palette__empty',
      text: 'No matching commands found',
    }));
    return;
  }

  items.forEach((cmd) => {
    const item = createElement('div', {
      className: 'command-palette__item',
      attrs: { role: 'option', 'data-id': cmd.id },
      events: {
        click: () => executeCommand(cmd.id),
      },
      children: [
        cmd.icon ? createElement('span', { className: 'icon', html: cmd.icon, attrs: { 'aria-hidden': 'true' } }) : null,
        createElement('span', { className: 'command-palette__item-label', text: cmd.label }),
        cmd.shortcut ? createElement('span', { className: 'command-palette__item-shortcut', text: cmd.shortcut }) : null,
      ].filter(Boolean),
    });
    resultsEl.appendChild(item);
  });
}

/**
 * Show the command palette.
 */
function show() {
  if (!paletteEl) return;
  isPaletteOpen = true;
  paletteEl.hidden = false;
  renderResults(COMMANDS);
  if (inputEl) {
    inputEl.value = '';
    inputEl.focus();
  }
}

/**
 * Show the quick open dialog.
 */
function showQuickOpen() {
  if (!quickOpenEl) return;
  isQuickOpenOpen = true;
  quickOpenEl.hidden = false;
  // Show some files
  const mockFiles = [
    { name: 'src/index.js' },
    { name: 'src/app.js' },
    { name: 'src/styles.css' },
    { name: 'index.html' },
    { name: 'README.md' },
    { name: '.gitignore' },
  ];
  renderQuickOpenResults(mockFiles);
  if (quickOpenInputEl) {
    quickOpenInputEl.value = '';
    quickOpenInputEl.focus();
  }
}

/**
 * Render quick open results.
 * @param {Array} files
 * @returns {void}
 */
function renderQuickOpenResults(files) {
  if (!quickOpenResultsEl) return;
  empty(quickOpenResultsEl);

  files.forEach((file) => {
    const item = createElement('div', {
      className: 'quick-open__item',
      attrs: { role: 'option' },
      events: {
        click: () => {
          eventBus.emit(EVENTS.FILE_SELECTED, file);
          eventBus.emit(EVENTS.TAB_OPENED, file);
          hideQuickOpen();
        },
      },
      children: [
        createElement('span', { className: 'icon', html: ICONS.file, attrs: { 'aria-hidden': 'true' } }),
        createElement('span', { className: 'quick-open__item-label', text: file.name }),
      ],
    });
    quickOpenResultsEl.appendChild(item);
  });
}

/**
 * Hide the command palette.
 */
function hide() {
  if (paletteEl) {
    paletteEl.hidden = true;
    isPaletteOpen = false;
  }
  if (quickOpenEl) {
    quickOpenEl.hidden = true;
    isQuickOpenOpen = false;
  }
}

/**
 * CommandPalette component module.
 * @namespace
 */
export const CommandPalette = {
  /** Initialize the Command Palette. */
  init() {
    paletteEl = document.getElementById('command-palette');
    resultsEl = document.getElementById('command-palette-results');
    inputEl = document.getElementById('command-palette-input');
    quickOpenEl = document.getElementById('quick-open');
    quickOpenResultsEl = document.getElementById('quick-open-results');
    quickOpenInputEl = document.getElementById('quick-open-input');

    if (!paletteEl || !resultsEl || !inputEl) return;

    // Input filtering
    inputEl.addEventListener('input', debounce((e) => {
      const results = filterCommands(e.target.value);
      renderResults(results);
    }, 100));

    // Keyboard navigation
    inputEl.addEventListener('keydown', (e) => {
      const items = resultsEl.querySelectorAll('.command-palette__item');
      const active = resultsEl.querySelector('.command-palette__item--active');
      let idx = Array.from(items).indexOf(active);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        idx = Math.min(idx + 1, items.length - 1);
        items.forEach((el) => el.classList.remove('command-palette__item--active'));
        items[idx]?.classList.add('command-palette__item--active');
        items[idx]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        idx = Math.max(idx - 1, 0);
        items.forEach((el) => el.classList.remove('command-palette__item--active'));
        items[idx]?.classList.add('command-palette__item--active');
        items[idx]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = resultsEl.querySelector('.command-palette__item--active') ||
                          resultsEl.querySelector('.command-palette__item');
        if (activeItem) {
          const id = activeItem.dataset.id;
          if (id) executeCommand(id);
        }
      } else if (e.key === 'Escape') {
        hide();
      }
    });

    // Overlay click to close
    const overlay = document.getElementById('command-palette-overlay');
    overlay?.addEventListener('click', hide);

    // Quick Open
    if (quickOpenEl && quickOpenInputEl && quickOpenResultsEl) {
      quickOpenInputEl.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        const mockFiles = ['src/index.js', 'src/app.js', 'src/styles.css', 'index.html', 'README.md', '.gitignore'];
        const filtered = query ? mockFiles.filter((f) => f.includes(query)).map((name) => ({ name })) : mockFiles.map((name) => ({ name }));
        renderQuickOpenResults(filtered);
      }, 100));

      quickOpenInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideQuickOpen();
        if (e.key === 'Enter') {
          const item = quickOpenResultsEl.querySelector('.quick-open__item');
          if (item) item.click();
        }
      });

      const qoOverlay = document.getElementById('quick-open-overlay');
      qoOverlay?.addEventListener('click', hideQuickOpen);
    }

    // Listen for command execution events (from keyboard shortcuts)
    eventBus.on(EVENTS.COMMAND_EXECUTED, (payload) => {
      if (payload === 'command-palette') show();
      else if (payload === 'quick-open') showQuickOpen();
    });

    // Close on Escape globally
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isPaletteOpen) hide();
        if (isQuickOpenOpen) hideQuickOpen();
      }
    });
  },
};

function hideQuickOpen() {
  if (quickOpenEl) {
    quickOpenEl.hidden = true;
    isQuickOpenOpen = false;
  }
}
