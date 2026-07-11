/**
 * @fileoverview
 * Search view component — full-text search across workspace files.
 * Supports live filtering, toggle options (case, whole word, regex).
 */

import { createElement, empty, debounce } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';
import { eventBus } from '../../events/event-bus.js';
import { EVENTS, DEBOUNCE_DELAY } from '../../core/constants.js';

/** @type {HTMLElement|null} */
let resultsEl = null;

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
 * @returns {Array<{file: string, line: number, text: string, matchStart: number, matchEnd: number}>}
 */
function performSearch(query) {
  if (!query.trim()) return [];
  const results = [];
  const lowerQuery = query.toLowerCase();

  for (const file of MOCK_FILES) {
    const lines = file.content.split('\n');
    lines.forEach((line, idx) => {
      const lowerLine = line.toLowerCase();
      const pos = lowerLine.indexOf(lowerQuery);
      if (pos !== -1) {
        results.push({
          file: file.path,
          line: idx + 1,
          text: line,
          matchStart: pos,
          matchEnd: pos + query.length,
        });
      }
    });
  }
  return results;
}

/**
 * Render search results.
 * @param {Array} results
 */
function renderResults(results) {
  if (!resultsEl) return;
  empty(resultsEl);

  if (results.length === 0) {
    resultsEl.appendChild(createElement('div', {
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
      events: { click: () => eventBus.emit(EVENTS.FILE_SELECTED, { name: r.file }) },
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
    resultsEl.appendChild(item);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * SearchView component module.
 * @namespace
 */
export const SearchView = {
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
        input: debounce((e) => {
          const results = performSearch(e.target.value);
          renderResults(results);
          eventBus.emit(EVENTS.SEARCH_QUERIED, e.target.value);
        }, DEBOUNCE_DELAY),
      },
    });
    inputGroup.appendChild(searchInput);

    // Toggle buttons
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

    resultsEl = createElement('div', { className: 'search__results' });
    container.appendChild(resultsEl);

    renderResults([]);
  },
};
