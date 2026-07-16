// @ts-check

/**
 * @fileoverview
 * Search view component — full-text search across workspace files.
 * Supports live filtering, toggle options (case, whole word, regex).
 */

import { createElement, empty, debounce, escapeHtml } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';
import { eventBus } from '../../events/event-bus.js';
import { EVENTS, DEBOUNCE_DELAY } from '../../core/constants.js';

/** @type {HTMLElement|null} */
let resultsEl = null;

/** @type {{ [key: string]: boolean }} */
let searchOptions = { matchCase: false, wholeWord: false, useRegex: false };

/** Mock file data for search. */
const MOCK_FILES = [
  { path: 'src/index.js', content: 'import { createApp } from "./app.js";\nconst app = createApp();\napp.mount("#root");' },
  { path: 'src/app.js', content: 'export function createApp() {\n  return { mount(sel) { /*...*/ } };\n}' },
  { path: 'src/styles.css', content: 'body { margin: 0; }\n.app { display: grid; }' },
  { path: 'index.html', content: '<html><body><div id="root"></div></body></html>' },
  { path: 'README.md', content: '# VS Code Clone\nA portfolio-quality editor.' },
];

/**
 * Perform a search across mock files.
 * @param {string} query
 * @returns {SearchResult[]}
 */
/**
 * @param {string} query
 * @returns {{file: string, line: number, text: string, matchStart: number, matchEnd: number}[]}
 */
function performSearch(query) {
  if (!query.trim()) return [];
  /** @type {{file: string, line: number, text: string, matchStart: number, matchEnd: number}[]} */
  const results = [];

  let searchQuery = query;
  let flags = 'g';
  if (!searchOptions.matchCase) flags += 'i';
  if (searchOptions.useRegex) {
    try { new RegExp(searchQuery, flags); } catch { return []; }
  } else {
    searchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (searchOptions.wholeWord) searchQuery = `\\b${searchQuery}\\b`;
  }

  const regex = new RegExp(searchQuery, flags);

  for (const file of MOCK_FILES) {
    const lines = file.content.split('\n');
    lines.forEach((line, idx) => {
      let match;
      while ((match = regex.exec(line)) !== null) {
        results.push({
          file: file.path,
          line: idx + 1,
          text: line,
          matchStart: match.index,
          matchEnd: match.index + match[0].length,
        });
        if (!flags.includes('g')) break;
      }
    });
  }
  return results;
}

/**
 * @param {{file: string, line: number, text: string, matchStart: number, matchEnd: number}[]} results
 */
function renderResults(results) {
  if (!resultsEl) return;
  const container = resultsEl;
  empty(container);

  if (results.length === 0) {
    container.appendChild(createElement('div', {
      className: 'search__empty',
      text: 'No results found',
    }));
    return;
  }

  results.forEach((r) => {
    const before = r.text.slice(0, r.matchStart);
    const match = r.text.slice(r.matchStart, r.matchEnd);
    const after = r.text.slice(r.matchEnd);

    const item = createElement('div', {
      className: 'search__result-item',
      events: { click: () => {
        eventBus.emit(EVENTS.FILE_SELECTED, { name: r.file });
        eventBus.emit(EVENTS.TAB_OPENED, { name: r.file });
      } },
      children: [
        createElement('div', {
          className: 'search__result-file',
          text: `${r.file}:${r.line}`,
        }),
        createElement('div', {
          className: 'search__result-line',
          html: `${escapeHtml(before)}<span class="search__result-match">${escapeHtml(match)}</span>${escapeHtml(after)}`,
        }),
      ],
    });
    container.appendChild(item);
  });
}

/**
 * SearchView component module.
 * @namespace
 */
export const SearchView = {
/**
 * @typedef {Object} SearchResult
 * @property {string} file
 * @property {number} line
 * @property {string} text
 * @property {number} matchStart
 * @property {number} matchEnd
 */

/**
 * @typedef {Object} MockFile
 * @property {string} path
 * @property {string} content
 */

/**
   * Render the Search view.
   * @param {HTMLElement} container
   */
  render(container) {
    empty(container);

    const header = createElement('div', { className: 'sidebar__header' });
    header.appendChild(createElement('span', { className: 'sidebar__title', text: 'SEARCH' }));
    container.appendChild(header);

    const searchHeader = createElement('div', { className: 'search__header' });
    const inputGroup = createElement('div', { className: 'search__input-group' });

    const searchInput = createElement('input', {
      className: 'search__input',
      attrs: {
        type: 'text',
        placeholder: 'Search files...',
        'aria-label': 'Search files',
        autocomplete: 'off',
        spellcheck: 'false',
      },
      events: {
        input: debounce((/** @type {Event} */ e) => {
          const target = /** @type {HTMLInputElement} */ (e.target);
          const results = performSearch(target.value);
          renderResults(results);
          eventBus.emit(EVENTS.SEARCH_QUERIED, target.value);
        }, DEBOUNCE_DELAY),
      },
    });
    inputGroup.appendChild(searchInput);

    // Replace input
    const replaceInput = createElement('input', {
      className: 'search__replace-input',
      attrs: { type: 'text', placeholder: 'Replace...', 'aria-label': 'Replace text', autocomplete: 'off' },
    });
    inputGroup.appendChild(replaceInput);

    // Replace all button
    const replaceBtn = createElement('button', {
      className: 'search__replace-btn',
      html: ICONS.check || '&#10003;',
      attrs: { 'aria-label': 'Replace All', title: 'Replace All' },
      events: {
        click: () => {
          const query = /** @type {HTMLInputElement} */ (searchInput).value;
          const replace = /** @type {HTMLInputElement} */ (replaceInput).value;
          if (!query || !replace) return;
          eventBus.emit(EVENTS.COMMAND_EXECUTED, 'replace-all');
          renderResults([]);
        },
      },
    });
    inputGroup.appendChild(replaceBtn);

    // Toggle buttons
    const toggleOptions = createElement('div', { className: 'search__toggle-options' });
    const toggleConfig = [
      { label: 'Aa', prop: 'matchCase', title: 'Match Case' },
      { label: 'Ab', prop: 'wholeWord', title: 'Whole Word' },
      { label: '.*', prop: 'useRegex', title: 'Use Regex' },
    ];
    toggleConfig.forEach(({ label, prop, title }) => {
      const btn = createElement('button', {
        className: 'search__toggle-btn',
        text: label,
        attrs: { title },
        events: {
          click: () => {
            searchOptions[prop] = !searchOptions[prop];
            btn.classList.toggle('search__toggle-btn--active');
            const input = container.querySelector('.search__input');
            if (input) {
              const results = performSearch(/** @type {HTMLInputElement} */ (input).value);
              renderResults(results);
            }
          },
        },
      });
      toggleOptions.appendChild(btn);
    });

    searchHeader.append(inputGroup, toggleOptions);
    container.appendChild(searchHeader);

    resultsEl = createElement('div', { className: 'search__results' });
    container.appendChild(resultsEl);

    renderResults([]);
  },
};
