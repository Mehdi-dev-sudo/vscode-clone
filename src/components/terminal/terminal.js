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
 * @property {Array<string>} [commandHistory]
 * @property {number} [historyIndex]
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
let currentDisplayEl = null;

/** ANSI color codes mapped to CSS classes. */
const ANSI_MAP = {
  '30': 'color-gray', '31': 'color-red', '32': 'color-green',
  '33': 'color-yellow', '34': 'color-blue', '35': 'color-magenta',
  '36': 'color-cyan', '37': 'color-white',
  '1': 'bold', '4': 'underline',
};

/**
 * Parse ANSI escape sequences into HTML.
 * Supports single codes (\x1b[31m) and combined codes (\x1b[1;34m).
 * @param {string} str
 * @returns {string}
 */
function parseAnsi(str) {
  return str.replace(/\x1b\[([\d;]+)m/g, (_, codes) => {
    const codeList = codes.split(';');
    if (codeList[0] === '0') return '</span>';

    let result = '';
    let hasSpan = false;
    for (const code of codeList) {
      const cls = ANSI_MAP[code];
      if (cls) {
        result += `<span class="terminal-${cls}">`;
        hasSpan = true;
      }
    }
    return hasSpan ? result : '';
  }).replace(/<\/span><span class="[^"]+">/g, '');
}

/**
 * Mock file system paths.
 * @type {Object<string, string>}
 */
const FS = {
  '~': '/home/user',
  '/': 'root',
};

/** Virtual file system. */
const VFS = {
  '/': { type: 'dir', children: ['home', 'usr', 'etc', 'var', 'tmp'] },
  '/home': { type: 'dir', children: ['user'] },
  '/home/user': { type: 'dir', children: ['src', 'index.html', 'README.md', '.gitignore', 'package.json', 'node_modules'] },
  '/home/user/src': { type: 'dir', children: ['index.js', 'app.js', 'styles.css', 'components'] },
  '/home/user/src/components': { type: 'dir', children: ['app.js', 'header.js'] },
};

let currentDir = '~';

/**
 * Resolve a path relative to current directory.
 * @param {string} p
 * @returns {string}
 */
function resolvePath(p) {
  const base = FS[currentDir];
  if (!p || p === '~') return '/home/user';
  if (p === '/') return '/';
  if (p.startsWith('/')) return p;
  if (p.startsWith('~')) return '/home/user' + p.slice(1);
  if (base === '/home/user') return `/home/user/${p}`;
  if (base === '/') return `/${p}`;
  return `${base}/${p}`;
}

/**
 * Get path display string.
 * @param {string} dir
 * @returns {string}
 */
function getPathDisplay(dir) {
  return dir === '/home/user' ? '~' : dir;
}

/**
 * Commands that the terminal can process.
 */
const INTERNAL_COMMANDS = {
  help() {
    return [
      '\x1b[1mAvailable commands:\x1b[0m',
      '  \x1b[32mhelp\x1b[0m      - Show this help message',
      '  \x1b[32mclear\x1b[0m     - Clear the terminal',
      '  \x1b[32mecho\x1b[0m      - Print text',
      '  \x1b[32mls\x1b[0m        - List directory contents',
      '  \x1b[32mpwd\x1b[0m       - Print working directory',
      '  \x1b[32mcd\x1b[0m        - Change directory',
      '  \x1b[32mmkdir\x1b[0m     - Create directory',
      '  \x1b[32mtouch\x1b[0m     - Create file',
      '  \x1b[32mcat\x1b[0m       - Display file contents',
      '  \x1b[32mdate\x1b[0m      - Show current date',
      '  \x1b[32mwhoami\x1b[0m    - Show current user',
      '  \x1b[32mnode -v\x1b[0m   - Show node version',
      '  \x1b[32mnpm -v\x1b[0m    - Show npm version',
      '  \x1b[32mexit\x1b[0m      - Close terminal tab',
      '  \x1b[32mneofetch\x1b[0m  - Show system info',
    ];
  },
  clear() { return 'CLEAR'; },
  echo(args) { return args.join(' '); },
  ls(args) {
    const target = args[0] ? resolvePath(args[0]) : resolvePath('.');
    const dir = VFS[target];
    if (!dir || dir.type !== 'dir') return `\x1b[31mls: ${args[0] || '.'}: No such directory\x1b[0m`;
    return dir.children.map((c) => {
      const fullPath = target === '/' ? `/${c}` : `${target}/${c}`;
      const entry = VFS[fullPath];
      return entry?.type === 'dir' ? `\x1b[1;34m${c}/\x1b[0m` : c;
    });
  },
  pwd() { return getPathDisplay(currentDir); },
  cd(args) {
    if (!args[0] || args[0] === '~' || args[0] === '') {
      currentDir = '~';
      return '';
    }
    if (args[0] === '/') { currentDir = '/'; return ''; }
    if (args[0] === '..') {
      const parts = currentDir.split('/').filter(Boolean);
      parts.pop();
      currentDir = parts.length === 0 ? '/' : `/${parts.join('/')}`;
      if (currentDir === '/home/user') currentDir = '~';
      return '';
    }
    const target = resolvePath(args[0]);
    const dir = VFS[target];
    if (!dir || dir.type !== 'dir') return `\x1b[31mcd: ${args[0]}: No such directory\x1b[0m`;
    currentDir = target === '/home/user' ? '~' : target;
    return '';
  },
  mkdir(args) {
    if (!args[0]) return '\x1b[31mmkdir: missing operand\x1b[0m';
    const parent = resolvePath('.');
    const dir = VFS[parent];
    if (dir && dir.type === 'dir') {
      const newPath = parent === '/' ? `/${args[0]}` : `${parent}/${args[0]}`;
      if (!VFS[newPath]) {
        VFS[newPath] = { type: 'dir', children: [] };
        dir.children.push(args[0]);
      }
    }
    return '';
  },
  touch(args) {
    if (!args[0]) return '\x1b[31mtouch: missing operand\x1b[0m';
    const parent = resolvePath('.');
    const dir = VFS[parent];
    if (dir && dir.type === 'dir' && !dir.children.includes(args[0])) {
      const newPath = parent === '/' ? `/${args[0]}` : `${parent}/${args[0]}`;
      VFS[newPath] = { type: 'file', content: '' };
      dir.children.push(args[0]);
    }
    return '';
  },
  cat(args) {
    if (!args[0]) return '\x1b[31mcat: missing operand\x1b[0m';
    const target = resolvePath(args[0]);
    const file = VFS[target];
    if (!file) return `\x1b[31mcat: ${args[0]}: No such file\x1b[0m`;
    if (file.type === 'dir') return `\x1b[31mcat: ${args[0]}: Is a directory\x1b[0m`;
    return file.content || '';
  },
  date() { return new Date().toString(); },
  whoami() { return 'user'; },
  'node -v'() { return 'v20.11.0'; },
  'npm -v'() { return 'v10.2.4'; },
  neofetch() {
    return [
      '\x1b[1;34m       _.สมติ\x1b[0m',
      '\x1b[1;34m   _.สมติ\x1b[0m    \x1b[1muser@dev\x1b[0m',
      '\x1b[1;34m สมติ\x1b[0m        \x1b[1mOS:\x1b[0m VS Code Clone OS',
      '\x1b[1;34m สมติ\x1b[0m        \x1b[1mHost:\x1b[0m Browser',
      '\x1b[1;34m   _.สมติ\x1b[0m    \x1b[1mKernel:\x1b[0m Vanilla JS',
      '\x1b[1;34m       _.สมติ\x1b[0m \x1b[1mShell:\x1b[0m bash 5.2',
      `                   \x1b[1mUptime:\x1b[0m ${Math.floor((Date.now() - performance.now()) / 1000)}s`,
      '                   \x1b[1mPackages:\x1b[0m 0 (no deps)',
      '                   \x1b[1mResolution:\x1b[0m 1920x1080',
      '                   \x1b[1mTerminal:\x1b[0m xterm-256color',
    ];
  },
  exit() { return 'EXIT'; },
};

/**
 * Process a terminal command.
 * References INTERNAL_COMMANDS (the block above).
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

  const handler = INTERNAL_COMMANDS[cmd] || INTERNAL_COMMANDS[parts.join(' ')];
  if (handler) {
    const result = handler(args);
    if (typeof result === 'string') return result;
    if (Array.isArray(result)) return result;
    return '';
  }
  return `\x1b[1;31mzsh: command not found: ${cmd}\x1b[0m`;
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

  // Terminal sub-tabs (bash, bash (2), etc.)
  const subTabs = renderTerminalSubTabs();
  currentDisplayEl.appendChild(subTabs);

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

  // Render history with ANSI support
  terminal.history.forEach((line) => {
    const lineEl = createElement('div', {
      className: 'terminal__line',
      html: parseAnsi(line),
    });
    body.appendChild(lineEl);
  });

  // Input line
  const inputLine = createElement('div', { className: 'terminal__input-line' });
  const prompt = createElement('span', {
    className: 'terminal__prompt',
    text: `user@dev:${getPathDisplay(currentDir)}$ `,
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
          // Save to command history
          terminal.commandHistory = terminal.commandHistory || [];
          if (value.trim()) {
            terminal.commandHistory.push(value);
            terminal.historyIndex = terminal.commandHistory.length;
          }
          input.value = '';
          executeCommand(value, terminal);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          terminal.commandHistory = terminal.commandHistory || [];
          terminal.historyIndex = terminal.historyIndex ?? terminal.commandHistory.length;
          if (terminal.historyIndex > 0) {
            terminal.historyIndex--;
            input.value = terminal.commandHistory[terminal.historyIndex] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          terminal.commandHistory = terminal.commandHistory || [];
          terminal.historyIndex = terminal.historyIndex ?? terminal.commandHistory.length;
          if (terminal.historyIndex < terminal.commandHistory.length - 1) {
            terminal.historyIndex++;
            input.value = terminal.commandHistory[terminal.historyIndex] || '';
          } else {
            terminal.historyIndex = terminal.commandHistory.length;
            input.value = '';
          }
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
 * Render terminal sub-tabs inside the terminal component.
 * @returns {HTMLElement}
 */
function renderTerminalSubTabs() {
  const tabBar = createElement('div', {
    className: 'terminal__tabs',
    attrs: { role: 'tablist', 'aria-label': 'Terminal tabs' },
  });

  terminals.forEach((t) => {
    const isActive = t.id === activeTerminalId;
    const tabEl = createElement('div', {
      className: `terminal__tab${isActive ? ' terminal__tab--active' : ''}`,
      attrs: { 'data-id': t.id, role: 'tab', 'aria-selected': isActive.toString() },
      events: {
        click: () => {
          activeTerminalId = t.id;
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
    tabBar.appendChild(tabEl);
  });

  const addBtn = createElement('button', {
    className: 'terminal__tab-add',
    html: ICONS.plus,
    attrs: { 'aria-label': 'New terminal', title: 'New Terminal' },
    events: { click: () => addTerminal() },
  });
  tabBar.appendChild(addBtn);

  return tabBar;
}

/**
 * Execute a command in a terminal.
 * @param {string} cmd
 * @param {TerminalTab} terminal
 */
function executeCommand(cmd, terminal) {
  if (!cmd.trim()) return;

  terminal.history.push(`\x1b[32muser@dev\x1b[0m:\x1b[34m${getPathDisplay(currentDir)}\x1b[0m$ ${cmd}`);
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
    return;
  }

    activeTerminalId = terminals[Math.min(idx, terminals.length - 1)].id;
  renderTerminal();
  eventBus.emit(EVENTS.TERMINAL_REMOVED, { id });
}



/**
 * Terminal component module.
 * @namespace
 */
export const Terminal = {
  /** Initialize the Terminal component. */
  init() {
    panelBodyEl = document.getElementById('panel-body');

    if (!panelBodyEl) return;

    // Create a terminal tab container inside the panel body header
    // (alongside the existing panel tab buttons)
    const panelHeader = document.getElementById('panel-header');
    if (panelHeader) {
      // The terminal tabs go inside the panel body, not the header
      // We'll render them inline with the terminal content
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

    // Listen for panel tab switch to terminal
    eventBus.on('terminal:show', () => {
      renderTerminal();
    });
  },
};
