/**
 * @fileoverview
 * Panel Manager — handles switching between panel tabs:
 * TERMINAL, OUTPUT, PROBLEMS, DEBUG CONSOLE.
 * Each tab shows different content while the terminal stays active.
 */

import { eventBus } from '../../events/event-bus.js';
import { createElement, empty } from '../../utils/dom.js';

/** @type {string} */
let activePanelTab = 'terminal';

/** @type {HTMLElement|null} */
let panelBodyEl = null;

/** @type {Object<string, Array<string>>} */
const panelContents = {
  output: [
    '[main] Extension host started successfully',
    '[main] Language features initialized',
    '[info] Git extension activated',
    '[warn] Deprecated API usage detected in settings',
  ],
  problems: [
    { type: 'error', file: 'src/index.js', line: 5, message: "'app' is assigned a value but never used" },
    { type: 'warning', file: 'src/styles.css', line: 12, message: "Property 'display' is redundant" },
    { type: 'info', file: 'index.html', line: 1, message: "File is not in workspace" },
  ],
  debug: [
    '\x1b[32mDebug session started\x1b[0m',
    'Breakpoint set at src/index.js:10',
    'Step 1: Initializing variables...',
    '→ app = { name: "VS Code Clone", version: "1.0.0" }',
    'Step 2: Mounting application...',
    '→ Target: #root',
    '\x1b[33mWaiting for breakpoint...\x1b[0m',
  ],
};

/**
 * Render the output panel content.
 */
function renderOutput() {
  if (!panelBodyEl) return;
  empty(panelBodyEl);

  const output = panelContents.output;
  const container = createElement('div', {
    style: { padding: '8px 16px', fontFamily: 'var(--font-family-monospace)', fontSize: '12px', lineHeight: '1.6', color: 'var(--terminal-text)' },
  });

  output.forEach((line) => {
    const el = createElement('div', {
      style: { color: line.startsWith('[warn]') ? 'var(--notification-warning)' : line.startsWith('[error]') ? 'var(--notification-error)' : 'var(--terminal-text)' },
      text: line,
    });
    container.appendChild(el);
  });

  panelBodyEl.appendChild(container);
}

/**
 * Render the problems panel.
 */
function renderProblems() {
  if (!panelBodyEl) return;
  empty(panelBodyEl);

  const container = createElement('div', {
    style: { padding: '8px 0', fontSize: '13px', lineHeight: '1.5' },
  });

  const problems = panelContents.problems;

  // Summary
  const errors = problems.filter((p) => p.type === 'error').length;
  const warnings = problems.filter((p) => p.type === 'warning').length;
  const info = problems.filter((p) => p.type === 'info').length;

  container.appendChild(createElement('div', {
    style: { padding: '4px 16px', fontSize: '11px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-primary)', marginBottom: '4px' },
    text: `${errors} error(s), ${warnings} warning(s), ${info} info`,
  }));

  problems.forEach((p) => {
    const icon = p.type === 'error' ? '✖' : p.type === 'warning' ? '⚠' : 'ℹ';
    const color = p.type === 'error' ? 'var(--notification-error)' : p.type === 'warning' ? 'var(--notification-warning)' : 'var(--notification-info)';

    const item = createElement('div', {
      style: { display: 'flex', gap: '8px', padding: '3px 16px', cursor: 'pointer' },
      events: {
        mouseenter: (e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-item-hover)'; },
        mouseleave: (e) => { e.currentTarget.style.backgroundColor = ''; },
      },
      children: [
        createElement('span', { style: { color, width: '16px', textAlign: 'center' }, text: icon }),
        createElement('div', { style: { flex: '1' },
          children: [
            createElement('div', { style: { color: 'var(--text-primary)' }, text: p.message }),
            createElement('div', { style: { fontSize: '11px', color: 'var(--text-tertiary)' }, text: `${p.file}:${p.line}` }),
          ],
        }),
      ],
    });
    container.appendChild(item);
  });

  panelBodyEl.appendChild(container);
}

/**
 * Render the debug console panel.
 */
function renderDebug() {
  if (!panelBodyEl) return;
  empty(panelBodyEl);

  const container = createElement('div', {
    style: { padding: '8px 16px', fontFamily: 'var(--font-family-monospace)', fontSize: '12px', lineHeight: '1.6', color: 'var(--terminal-text)' },
  });

  panelContents.debug.forEach((line) => {
    let color = 'var(--terminal-text)';
    if (line.includes('Debug session')) color = 'var(--color-green, #6a9955)';
    else if (line.includes('Waiting')) color = 'var(--notification-warning)';

    const el = createElement('div', { style: { color }, text: line });
    container.appendChild(el);
  });

  // Input line
  const inputLine = createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' },
    children: [
      createElement('span', { style: { color: 'var(--text-accent)' }, text: '›' }),
      createElement('input', {
        style: { flex: '1', background: 'transparent', border: 'none', color: 'var(--terminal-text)', fontFamily: 'inherit', fontSize: '12px', outline: 'none' },
        attrs: { type: 'text', placeholder: 'Type debug command...', 'aria-label': 'Debug console input' },
        events: { keydown: (e) => { if (e.key === 'Enter') e.target.value = ''; } },
      }),
    ],
  });
  container.appendChild(inputLine);

  panelBodyEl.appendChild(container);
}

/**
 * Switch the active panel tab.
 * @param {string} tab - 'terminal', 'output', 'problems', 'debug'
 */
function switchPanelTab(tab) {
  activePanelTab = tab;
  updatePanelTabUI();

  switch (tab) {
    case 'output':
      renderOutput();
      break;
    case 'problems':
      renderProblems();
      break;
    case 'debug':
      renderDebug();
      break;
    case 'terminal':
    default:
      // Terminal is handled by the Terminal component
      // We need to re-trigger terminal render
      empty(panelBodyEl);
      eventBus.emit('terminal:show', {});
      break;
  }
}

/**
 * Update the panel tab button styles.
 */
function updatePanelTabUI() {
  document.querySelectorAll('.panel__tab').forEach((tab) => {
    const isActive = tab.dataset.panel === activePanelTab;
    tab.classList.toggle('panel__tab--active', isActive);
    tab.setAttribute('aria-selected', isActive.toString());
  });
}

/**
 * PanelManager module.
 * @namespace
 */
export const PanelManager = {
  /** Initialize panel tab switching. */
  init() {
    panelBodyEl = document.getElementById('panel-body');

    document.querySelectorAll('.panel__tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const panel = tab.dataset.panel;
        if (panel) switchPanelTab(panel);
      });
    });

    // Listen for terminal show events
    eventBus.on('terminal:show', () => {
      // Trigger terminal component to re-render
      import('../terminal/terminal.js').then(({ Terminal }) => {
        // Terminal will re-render on next interaction
      });
    });
  },

  /**
   * Switch to a specific panel tab.
   * @param {string} tab
   */
  switchTo(tab) {
    switchPanelTab(tab);
  },
};
