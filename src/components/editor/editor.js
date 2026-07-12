/**
 * @fileoverview
 * Editor component — the main code editing area.
 * Manages welcome page, line numbers, syntax display, minimap,
 * and breadcrumb navigation.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { createElement, empty, $ } from '../../utils/dom.js';
import { highlight, detectLanguage } from '../../utils/syntax.js';
import { updateMinimap, initMinimap } from './minimap.js';

/** @type {HTMLElement|null} */
let editorContentEl = null;

/** @type {HTMLElement|null} */
let welcomeEl = null;

/** @type {HTMLElement|null} */
let breadcrumbEl = null;

/** @type {HTMLElement|null} */
let gutterEl = null;

/** @type {HTMLElement|null} */
let minimapEl = null;

/** Currently open file content lines. */
let currentLines = [''];

/** Currently open file name. */
let currentFileName = '';

/**
 * Mock file contents keyed by file name/ID.
 * @type {Object<string, string>}
 */
const MOCK_FILES = {
  'package.json': `{
  "name": "vscode-clone",
  "version": "1.0.0",
  "description": "A portfolio-quality VS Code clone built with vanilla HTML/CSS/JS",
  "private": true,
  "scripts": {
    "start": "npx serve .",
    "dev": "npx live-server --port=3000"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/Mehdi-dev-sudo/vscode-clone.git"
  },
  "keywords": ["vscode", "editor", "portfolio", "vanilla-js"],
  "author": "Mehdi Khorshidi far",
  "license": "MIT"
}`,

  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VS Code Clone</title>
  <link rel="stylesheet" href="src/styles/main.css">
</head>
<body>
  <div id="root">
    <div class="app__layout">
      <nav id="activity-bar" class="app__activity-bar"></nav>
      <aside id="sidebar" class="app__sidebar"></aside>
      <main class="app__editor-area">
        <div id="tabs-bar" class="app__tabs-bar"></div>
        <div id="editor" class="app__editor"></div>
      </main>
      <div id="panel" class="app__panel"></div>
      <footer id="status-bar" class="app__status-bar"></footer>
    </div>
  </div>
  <script type="module" src="src/app.js"></script>
</body>
</html>`,
  'index.js': `import { createApp } from './app.js';
import { defineComponent } from './component.js';

const app = createApp({
  name: 'VS Code Clone',
  version: '1.0.0',
  theme: 'dark'
});

app.component('file-tree', defineComponent({
  template: 'file-tree',
  state: {
    files: [],
    selected: null
  },
  methods: {
    openFile(file) {
      this.selected = file;
      this.emit('file:opened', file);
    },
    deleteFile(id) {
      this.files = this.files.filter(f => f.id !== id);
    }
  }
}));

app.mount('#root');`,

  'styles.css': `/* VS Code Clone Styles */
:root {
  --bg-primary: #1e1e1e;
  --bg-secondary: #252526;
  --text-primary: #cccccc;
  --accent: #007acc;
  --font-mono: 'Cascadia Code', monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

.app {
  display: grid;
  grid-template-rows: 30px 1fr 22px;
  height: 100vh;
  width: 100vw;
}

/* Layout Components */
.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid #3c3c3c;
}

.editor {
  flex: 1;
  position: relative;
  overflow: auto;
}

.status-bar {
  height: 22px;
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
}`,

  'README.md': `# VS Code Clone

A **portfolio-quality** Visual Studio Code inspired web application.

## Features

- File Explorer with full CRUD
- Editor with tabs
- Terminal emulation
- Command Palette
- Theme switching
- Search across files
- Extensions marketplace mock
- Fully resizable panels

## Architecture

This project uses:
- **Vanilla HTML/CSS/JS** — No frameworks
- **ITCSS + BEM** — Scalable CSS architecture
- **ES Modules** — Clean JavaScript modules
- **Event Bus** — Decoupled component communication

## Getting Started

Open \`index.html\` in any modern browser.

No build tools required.`,

  '.gitignore': `# Dependencies
node_modules/
package-lock.json

# Build
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db`,
};

/**
 * Render the editor with file content.
 * @param {string} fileName
 * @param {string} content
 * @returns {void}
 */
function renderEditorContent(fileName, content) {
  if (!editorContentEl) return;

  // Hide welcome, show editor
  if (welcomeEl) welcomeEl.style.display = 'none';

  const lines = content.split('\n');
  currentLines = lines;
  currentFileName = fileName;

  // Clear content
  const existingLines = editorContentEl.querySelector('.editor__lines');
  if (existingLines) existingLines.remove();

  // Create line number gutter
  if (gutterEl) {
    empty(gutterEl);
    lines.forEach((_, i) => {
      const lineNum = createElement('div', {
        text: String(i + 1),
        style: { lineHeight: '1.6', fontFamily: 'var(--font-family-monospace)', fontSize: 'var(--font-size-md)' },
      });
      gutterEl.appendChild(lineNum);
    });
  }

  // Create code lines
  const linesContainer = createElement('div', {
    className: 'editor__lines',
    attrs: {
      contenteditable: 'true',
      spellcheck: 'false',
      'aria-label': 'Editor content',
      role: 'textbox',
      tabindex: '0',
    },
  });

  const lang = detectLanguage(fileName);

  lines.forEach((line, i) => {
    const lineEl = createElement('div', {
      className: 'editor__line',
      attrs: { 'data-line': i + 1 },
    });
    if (line.trim()) {
      lineEl.innerHTML = highlight(line, lang) || ' ';
    } else {
      lineEl.innerHTML = '&nbsp;';
    }
    linesContainer.appendChild(lineEl);
  });

  editorContentEl.appendChild(linesContainer);

  // Update breadcrumb
  updateBreadcrumb(fileName);

  // Update minimap
  renderMinimap(content);

  // Focus editor
  linesContainer.focus();

  // Update minimap
  requestAnimationFrame(() => {
    const editorScroll = editorContentEl;
    updateMinimap(
      content,
      editorScroll.scrollTop,
      editorScroll.clientHeight,
      editorScroll.scrollHeight
    );
  });
}

/**
 * Show the welcome page.
 */
function showWelcome() {
  if (welcomeEl) welcomeEl.style.display = 'flex';
  if (gutterEl) empty(gutterEl);
  if (breadcrumbEl) empty(breadcrumbEl);
  if (minimapEl) empty(minimapEl);

  const existingLines = editorContentEl?.querySelector('.editor__lines');
  if (existingLines) existingLines.remove();

  currentFileName = '';
  currentLines = [''];
}

/**
 * Update the breadcrumb navigation.
 * @param {string} fileName
 * @returns {void}
 */
function updateBreadcrumb(fileName) {
  if (!breadcrumbEl) return;
  empty(breadcrumbEl);

  const parts = fileName.split('/');
  const rootItem = createElement('span', {
    className: 'breadcrumb__item',
    text: 'workspace',
    events: { click: () => eventBus.emit(EVENTS.VIEW_CHANGED, 'explorer') },
  });
  breadcrumbEl.appendChild(rootItem);

  // Separator
  const sep = createElement('span', {
    className: 'breadcrumb__separator',
    html: '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
    attrs: { 'aria-hidden': 'true' },
  });
  breadcrumbEl.appendChild(sep);

  const fileItem = createElement('span', {
    className: 'breadcrumb__item',
    text: parts[parts.length - 1],
  });
  breadcrumbEl.appendChild(fileItem);
}

/**
 * Render the minimap (simplified thumbnail of code).
 * @param {string} content
 * @returns {void}
 */
function renderMinimap(content) {
  if (!minimapEl) return;
  empty(minimapEl);

  const lines = content.split('\n');
  const scale = Math.min(1, 300 / lines.length);
  const charWidth = 3;
  const lineHeight = 2;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 60;
  canvas.height = Math.max(100, lines.length * lineHeight * scale);

  ctx.fillStyle = getComputedStyle(minimapEl).backgroundColor || '#1e1e1e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = getComputedStyle(minimapEl.parentElement || document.body).color || '#cccccc';
  ctx.font = `${8 * scale}px monospace`;

  lines.forEach((line, i) => {
    const y = (i + 1) * lineHeight * scale;
    const truncated = line.slice(0, Math.floor(canvas.width / charWidth));
    // Draw as colored dots instead of text for performance
    if (line.trim()) {
      ctx.fillRect(0, y - lineHeight * scale + 1, Math.min(truncated.length * charWidth, canvas.width), lineHeight * scale);
    }
  });

  minimapEl.appendChild(canvas);
}

/**
 * Editor component module.
 * @namespace
 */
export const Editor = {
  /** Initialize the Editor component. */
  init() {
    editorContentEl = document.getElementById('editor-content');
    welcomeEl = document.getElementById('editor-welcome');
    breadcrumbEl = document.getElementById('breadcrumb');
    gutterEl = document.getElementById('editor-gutter');
    minimapEl = document.getElementById('minimap');

    // Initialize minimap
    initMinimap();

    // Subscribe to file selection events
    eventBus.on(EVENTS.FILE_SELECTED, (file) => {
      if (!file) {
        showWelcome();
        return;
      }
      const name = file.name || file.id;
      // Strip directory prefix for MOCK_FILES lookup (e.g. 'src/index.js' -> 'index.js')
      const baseName = name.split('/').pop();
      const content = MOCK_FILES[baseName] || MOCK_FILES[name] || `// ${name}\n// No content available.\n`;
      renderEditorContent(name, content);
      // Auto-focus the editor content
      setTimeout(() => {
        const editorLines = document.querySelector('.editor__lines');
        if (editorLines) editorLines.focus();
      }, 50);
    });

    // Listen for focus-editor command
    eventBus.on(EVENTS.COMMAND_EXECUTED, (cmd) => {
      if (cmd === 'focus-editor') {
        const editorBody = document.getElementById('editor');
        if (editorBody) editorBody.focus();
      }
    });

    // Welcome page buttons
    if (welcomeEl) {
      welcomeEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        if (action === 'command-palette') {
          eventBus.emit(EVENTS.COMMAND_EXECUTED, 'command-palette');
        } else if (action === 'new-file') {
          eventBus.emit(EVENTS.COMMAND_EXECUTED, 'new-file');
        } else if (action === 'open-folder') {
          eventBus.emit(EVENTS.COMMAND_EXECUTED, 'open-folder');
        }
      });
    }
  },

  /**
   * Set editor content programmatically.
   * @param {string} fileName
   * @param {string} content
   * @returns {void}
   */
  setContent(fileName, content) {
    if (content) {
      renderEditorContent(fileName, content);
    } else {
      showWelcome();
    }
  },
};
