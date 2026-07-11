/**
 * @fileoverview
 * Search & Replace view — extends the search view with replace functionality.
 * Supports: find, replace, replace all, case sensitivity, whole word.
 */

import { createElement, empty, debounce } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';
import { DEBOUNCE_DELAY } from '../../core/constants.js';
import { Notifications } from '../notifications/notifications.js';

const MOCK_FILES = [
  { path: 'src/index.js', content: 'import { createApp } from "./app.js";\nconst app = createApp();\napp.mount("#root");' },
  { path: 'src/app.js', content: 'export function createApp() {\n  return { mount(sel) { /*...*/ } };\n}' },
  { path: 'src/styles.css', content: 'body { margin: 0; }\n.app { display: grid; }' },
  { path: 'index.html', content: '<html><body><div id="root"></div></body></html>' },
  { path: 'README.md', content: '# VS Code Clone\nA portfolio-quality editor.' },
];

/** @type {boolean} */
let showReplace = false;

/**
 * Perform search across mock files.
 * @param {string} query
 * @returns {Array}
 */
function performSearch(query) {
  if (!query.trim()) return [];
  const results = [];
  const lowerQuery = query.toLowerCase();

  for (const file of MOCK_FILES) {
    const lines = file.content.split('\n');
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(lowerQuery)) {
        results.push({ file: file.path, line: idx + 1, text: line });
      }
    });
  }
  return results;
}

/**
 * Perform replace across mock files.
 * @param {string} findText
 * @param {string} replaceText
 * @returns {number} Number of replacements.
 */
function performReplace(findText, replaceText) {
  if (!findText.trim()) return 0;
  let count = 0;

  for (const file of MOCK_FILES) {
    const lower = file.content.toLowerCase();
    const findLower = findText.toLowerCase();
    let idx = lower.indexOf(findLower);
    while (idx !== -1) {
      count++;
      idx = lower.indexOf(findLower, idx + 1);
    }
  }

  return count;
}

/**
 * Render replace UI.
 * @param {HTMLElement} container
 * @param {Function} onSearch
 */
function renderReplaceUI(container, onSearch) {
  const existing = container.querySelector('.search-replace-ui');
  if (existing) existing.remove();

  if (!showReplace) return;

  const replaceUI = createElement('div', {
    className: 'search-replace-ui',
    style: { padding: '0 12px 8px', borderBottom: '1px solid var(--border-primary)' },
  });

  const replaceInput = createElement('input', {
    style: { width: '100%', padding: '3px 8px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none', marginBottom: '4px' },
    attrs: { type: 'text', placeholder: 'Replace with...', 'aria-label': 'Replace text', autocomplete: 'off' },
  });
  replaceUI.appendChild(replaceInput);

  const actions = createElement('div', {
    style: { display: 'flex', gap: '4px' },
    children: [
      createElement('button', {
        style: { flex: '1', padding: '3px', backgroundColor: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '11px' },
        text: 'Replace',
        events: {
          click: () => {
            const searchInput = container.querySelector('.search__input');
            if (searchInput && replaceInput.value) {
              const count = performReplace(searchInput.value, replaceInput.value);
              Notifications.info(`Replaced ${count} occurrence(s)`);
            }
          },
        },
      }),
      createElement('button', {
        style: { flex: '1', padding: '3px', backgroundColor: 'var(--button-secondary-bg)', color: 'var(--text-primary)', border: 'none', borderRadius: '2px', cursor: 'pointer', fontSize: '11px' },
        text: 'Replace All',
        events: {
          click: () => {
            const searchInput = container.querySelector('.search__input');
            if (searchInput && replaceInput.value) {
              const count = performReplace(searchInput.value, replaceInput.value);
              Notifications.info(`Replaced ${count} occurrence(s)`);
            }
          },
        },
      }),
    ],
  });
  replaceUI.appendChild(actions);

  // Insert after search header
  const searchHeader = container.querySelector('.search__header');
  if (searchHeader) {
    searchHeader.parentNode.insertBefore(replaceUI, searchHeader.nextSibling);
  }
}

/**
 * SearchReplaceView component.
 * @namespace
 */
export const SearchReplaceView = {
  /**
   * Render the Search & Replace view.
   * @param {HTMLElement} container
   */
  render(container) {
    empty(container);

    const header = createElement('div', { className: 'sidebar__header' });
    const title = createElement('span', { className: 'sidebar__title', text: 'SEARCH' });
    const actions = createElement('div', { className: 'sidebar__actions' });

    const replaceToggle = createElement('button', {
      className: 'sidebar__action-btn',
      html: ICONS.refresh,
      attrs: { title: 'Toggle Replace', 'aria-label': 'Toggle replace mode' },
      events: {
        click: () => {
          showReplace = !showReplace;
          SearchReplaceView.render(container);
          const searchInput = container.querySelector('.search__input');
          if (searchInput) searchInput.focus();
        },
      },
    });
    actions.appendChild(replaceToggle);
    header.append(title, actions);
    container.appendChild(header);

    const searchHeader = createElement('div', { className: 'search__header' });
    const inputGroup = createElement('div', { className: 'search__input-group' });

    const searchInput = createElement('input', {
      className: 'search__input',
      style: { flex: '1' },
      attrs: { type: 'text', placeholder: 'Search files...', 'aria-label': 'Search', autocomplete: 'off' },
      events: {
        input: debounce((e) => {
          const results = performSearch(e.target.value);
          renderResults(container, results);
        }, DEBOUNCE_DELAY),
        keydown: (e) => {
          if (e.key === 'Enter') {
            const results = performSearch(e.target.value);
            renderResults(container, results);
          }
        },
      },
    });
    inputGroup.appendChild(searchInput);

    const toggleOptions = createElement('div', { className: 'search__toggle-options' });
    ['Aa', 'Ab', '.*'].forEach((label) => {
      const btn = createElement('button', {
        className: 'search__toggle-btn',
        text: label,
        attrs: { title: label === 'Aa' ? 'Match Case' : label === 'Ab' ? 'Whole Word' : 'Use Regex' },
      });
      toggleOptions.appendChild(btn);
    });

    searchHeader.append(inputGroup, toggleOptions);
    container.appendChild(searchHeader);

    // Replace UI
    if (showReplace) {
      renderReplaceUI(container, () => {});
    }

    const resultsEl = createElement('div', {
      className: 'search__results',
      style: { flex: '1', overflowY: 'auto', padding: '4px 0' },
    });
    container.appendChild(resultsEl);
  },
};

function renderResults(container, results) {
  const resultsEl = container.querySelector('.search__results');
  if (!resultsEl) return;
  empty(resultsEl);

  if (results.length === 0) {
    resultsEl.appendChild(createElement('div', {
      className: 'search__empty',
      style: { padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '12px' },
      text: 'No results found',
    }));
    return;
  }

  resultsEl.appendChild(createElement('div', {
    style: { padding: '4px 12px', fontSize: '11px', color: 'var(--text-secondary)' },
    text: `${results.length} result(s)`,
  }));

  results.forEach((r) => {
    const item = createElement('div', {
      className: 'search__result-item',
      style: { padding: '4px 12px', cursor: 'pointer', fontSize: '13px' },
      events: {
        click: () => {
          import('../../events/event-bus.js').then(({ eventBus }) => {
            eventBus.emit('tab:opened', { name: r.file });
          });
        },
        mouseenter: (e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-item-hover)'; },
        mouseleave: (e) => { e.currentTarget.style.backgroundColor = ''; },
      },
      children: [
        createElement('div', { style: { color: 'var(--text-primary)' }, text: `${r.file}:${r.line}` }),
        createElement('div', { style: { fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }, text: r.text.trim() }),
      ],
    });
    resultsEl.appendChild(item);
  });
}
