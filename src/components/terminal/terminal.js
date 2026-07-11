/**
 * @fileoverview
 * Terminal component — a working terminal emulator embedded in the panel.
 * Supports: multiple tabs, command history, clear, resize.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { createElement, empty, $ } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';

/**
 * @typedef {Object} TerminalTab
 * @property {string} id
 * @property {string} name
 * @property {Array<string>} history
 * @property {string} currentInput
 */

/** @type {Array<TerminalTab>} */
let terminals = [];

/** Current terminal tab ID. */
let activeTerminalId = null;

/** Terminal counter for naming. */
let terminalCounter = 1;

/** @type {HTMLElement|null} */
let panelBodyEl = null;

/** @type {HTMLElement|null} */
let panelTabsEl = null;

/** @type {HTMLElement|null} */
let currentDisplayEl = null;

/**
 * Mock file system paths.
 * @type {Object<string, string>}
 */
const FS = {
  '~': '/home/user',
  '/': 'root',
};

let currentDir = '~';

/**
 * Commands that the terminal can process.
 */
const COMMANDS = {
  help() {
    return [
      'Available commands:',
      '  help      - Show this help message',
      '  clear     - Clear the terminal',
      '  echo      - Print text',
      '  ls        - List directory contents',
      '  pwd       - Print working directory',
      '  cd        - Change directory',
      '  date      - Show current date',
      '  whoami    - Show current user',
      '  node -v   - Show node version',
      '  npm -v    - Show npm version',
      `  exit      - Close terminal tab`,
    ];
  },
  clear() { return 'CLEAR'; },
  echo(args) { return args.join(' '); },
  ls() {
    return ['src/', 'index.html', 'README.md', '.gitignore', 'package.json'];
  },
  pwd() { return FS[currentDir] || currentDir; },
  cd(args) {
    if (!args[0] || args[0] === '~') currentDir = '~';
    else if (args[0] === '/') currentDir = '/';
    else if (args[0] === '..') currentDir = '~';
    else if (args[0] === 'src') currentDir = '~/src';
    else return `cd: ${args[0]}: No such directory`;
    return '';
  },
  date() { return new Date().toString(); },
  whoami() { return 'user'; },
  'node -v'() { return 'v20.11.0'; },
  'npm -v'() { return 'v10.2.4'; },
  exit() { return 'EXIT'; },
};

/**
 * Process a terminal command.
 * @param {string} input
 * @returns {string|Array<string>|null}
 */
function processCommand(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === 'clear') return 'CLEAR';
  if (cmd === 'exit') return 'EXIT';

  const handler = COMMANDS[cmd] || COMMANDS[parts.join(' ')];
  if (handler) return handler(args);
  return `zsh: command not found: ${cmd}`;
}

/**
 * Render the terminal display.
 */
function renderTerminal() {
  if (!panelBodyEl) return;

  const terminal = terminals.find((t) => t.id === activeTerminalId);
  if (!terminal) return;

  empty(panelBodyEl);

  currentDisplayEl = createElement('div', {
    className: 'terminal',
    attrs: { role: 'region', 'aria-label': `Terminal - ${terminal.name}` },
  });

  const body = createElement('div', {
    className: 'terminal__body',
    attrs: { tabindex: '0', 'aria-label': 'Terminal output' },
    events: {
      click: () => {
        const input = body.querySelector('.terminal__input');
        if (input) input.focus();
      },
    },
  });

  // Render history
  terminal.history.forEach((line) => {
    const lineEl = createElement('div', {
      className: 'terminal__line',
      text: line,
    });
    body.appendChild(lineEl);
  });

  // Input line
  const inputLine = createElement('div', { className: 'terminal__input-line' });
  const prompt = createElement('span', {
    className: 'terminal__prompt',
    text: `user@dev:${FS[currentDir] || currentDir}$ `,
  });
  const input = createElement('input', {
    className: 'terminal__input',
    attrs: {
      type: 'text',
      'aria-label': 'Terminal input',
      autocomplete: 'off',
      spellcheck: 'false',
    },
    events: {
      keydown: (e) => {
        if (e.key === 'Enter') {
          const value = input.value;
          input.value = '';
          executeCommand(value, terminal);
        }
      },
    },
  });

  inputLine.append(prompt, input);
  body.appendChild(inputLine);
  currentDisplayEl.appendChild(body);
  panelBodyEl.appendChild(currentDisplayEl);

  // Scroll to bottom
  body.scrollTop = body.scrollHeight;

  // Focus input
  input.focus();
}

/**
 * Execute a command in a terminal.
 * @param {string} cmd
 * @param {TerminalTab} terminal
 */
function executeCommand(cmd, terminal) {
  if (!cmd.trim()) return;

  terminal.history.push(`user@dev:${FS[currentDir] || currentDir}$ ${cmd}`);
  const result = processCommand(cmd);

  if (result === 'CLEAR') {
    terminal.history = [];
  } else if (result === 'EXIT') {
    terminal.history.push('exit');
    removeTerminal(terminal.id);
    return;
  } else if (result !== null && result !== undefined) {
    const lines = Array.isArray(result) ? result : [result];
    lines.forEach((line) => terminal.history.push(line));
  }

  renderTerminal();
}

/**
 * Create a new terminal tab.
 */
function addTerminal() {
  const id = `terminal-${Date.now()}`;
  const name = terminalCounter === 1 ? 'bash' : `bash (${terminalCounter})`;
  terminalCounter++;

  const tab = { id, name, history: [], currentInput: '' };
  terminals.push(tab);
  activeTerminalId = id;

  renderTerminalTabs();
  renderTerminal();
  eventBus.emit(EVENTS.TERMINAL_ADDED, { id, name });
}

/**
 * Remove a terminal tab.
 * @param {string} id
 */
function removeTerminal(id) {
  const idx = terminals.findIndex((t) => t.id === id);
  if (idx === -1) return;
  terminals.splice(idx, 1);

  if (terminals.length === 0) {
    activeTerminalId = null;
    if (panelBodyEl) empty(panelBodyEl);
    renderTerminalTabs();
    return;
  }

  activeTerminalId = terminals[Math.min(idx, terminals.length - 1)].id;
  renderTerminalTabs();
  renderTerminal();
  eventBus.emit(EVENTS.TERMINAL_REMOVED, { id });
}

/**
 * Render the terminal tab bar.
 */
function renderTerminalTabs() {
  if (!panelTabsEl) return;
  empty(panelTabsEl);

  terminals.forEach((t) => {
    const isActive = t.id === activeTerminalId;
    const tabEl = createElement('div', {
      className: `terminal__tab${isActive ? ' terminal__tab--active' : ''}`,
      attrs: { 'data-id': t.id, role: 'tab', 'aria-selected': isActive.toString() },
      events: {
        click: () => {
          activeTerminalId = t.id;
          renderTerminalTabs();
          renderTerminal();
        },
      },
      children: [
        createElement('span', { text: t.name }),
        createElement('button', {
          className: 'tab__close-btn',
          html: ICONS.close,
          attrs: { 'aria-label': `Close ${t.name}` },
          events: { click: (e) => { e.stopPropagation(); removeTerminal(t.id); } },
        }),
      ],
    });
    panelTabsEl.appendChild(tabEl);
  });

  const addBtn = createElement('button', {
    className: 'terminal__tab-add',
    html: ICONS.plus,
    attrs: { 'aria-label': 'New terminal', title: 'New Terminal' },
    events: { click: () => addTerminal() },
  });
  panelTabsEl.appendChild(addBtn);
}

/**
 * Terminal component module.
 * @namespace
 */
export const Terminal = {
  /** Initialize the Terminal component. */
  init() {
    panelBodyEl = document.getElementById('panel-body');
    panelTabsEl = document.getElementById('panel-tabs');

    if (!panelTabsEl) return;

    // Override panel tabs with our terminal tab system
    // Keep the original panel tab buttons for switching panel views
    const panelTabContainer = panelTabsEl;
    empty(panelTabContainer);

    // Create terminal-specific tabs container inside the panel body header
    const terminalTabsContainer = createElement('div', {
      className: 'terminal__tabs',
      attrs: { role: 'tablist', 'aria-label': 'Terminal tabs' },
    });
    panelTabsEl = terminalTabsContainer;

    // Insert before panel actions
    const panelActions = document.getElementById('panel-actions');
    if (panelActions && panelActions.parentNode) {
      panelActions.parentNode.insertBefore(terminalTabsContainer, panelActions);
    }

    // Create initial terminal
    addTerminal();

    // Listen for panel toggle
    eventBus.on(EVENTS.PANEL_RESIZED, (payload) => {
      if (payload === 'toggle-panel') {
        const panel = document.getElementById('panel');
        if (panel) {
          panel.classList.toggle('app__panel--hidden');
        }
      }
    });
  },
};
