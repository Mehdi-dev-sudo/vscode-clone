/**
 * @fileoverview
 * Extensions view component — mock marketplace for installing extensions.
 * Displays a list of available extensions with install functionality.
 */

import { createElement, empty } from '../../utils/dom.js';

/** @type {Array<{id: string, name: string, desc: string, publisher: string, icon: string, installed: boolean}>} */
const EXTENSIONS = [
  { id: 'theme-dracula', name: 'Dracula Official', desc: 'Official Dracula theme for VS Code', publisher: 'Dracula Theme', icon: '🧛', installed: false },
  { id: 'prettier', name: 'Prettier', desc: 'Code formatter for multiple languages', publisher: 'Prettier', icon: '✨', installed: false },
  { id: 'eslint', name: 'ESLint', desc: 'Integrates ESLint into VS Code', publisher: 'Microsoft', icon: '🔍', installed: false },
  { id: 'gitlens', name: 'GitLens', desc: 'Git blame annotations and more', publisher: 'GitKraken', icon: '🔎', installed: false },
  { id: 'live-server', name: 'Live Server', desc: 'Launch a local development server', publisher: 'Ritwick Dey', icon: '🌐', installed: false },
  { id: 'material-icon', name: 'Material Icon Theme', desc: 'Material Design icons for VS Code', publisher: 'Philipp Kief', icon: '🎨', installed: false },
  { id: 'bracket-pair', name: 'Bracket Pair Colorizer', desc: 'Colorize matching brackets', publisher: 'CoenraadS', icon: '🌈', installed: false },
  { id: 'intellicode', name: 'IntelliCode', desc: 'AI-assisted development', publisher: 'Microsoft', icon: '🤖', installed: false },
];

/**
 * Toggle installed state for an extension.
 * @param {string} id
 */
function toggleInstall(id) {
  const ext = EXTENSIONS.find((e) => e.id === id);
  if (ext) ext.installed = !ext.installed;
}

/**
 * ExtensionsView component module.
 * @namespace
 */
export const ExtensionsView = {
  /**
   * Render the Extensions view.
   * @param {HTMLElement} container
   */
  render(container) {
    empty(container);

    const header = createElement('div', { className: 'sidebar__header' });
    header.appendChild(createElement('span', { className: 'sidebar__title', text: 'EXTENSIONS' }));
    container.appendChild(header);

    const extHeader = createElement('div', { className: 'extensions__header' });
    const searchInput = createElement('input', {
      className: 'extensions__search',
      attrs: {
        type: 'text',
        placeholder: 'Search extensions in Marketplace...',
        'aria-label': 'Search extensions',
        autocomplete: 'off',
      },
      events: {
        input: (e) => {
          const query = e.target.value.toLowerCase();
          const items = container.querySelectorAll('.extensions__item');
          items.forEach((item) => {
            const name = item.dataset.name?.toLowerCase() || '';
            item.style.display = name.includes(query) ? 'flex' : 'none';
          });
        },
      },
    });
    extHeader.appendChild(searchInput);
    container.appendChild(extHeader);

    const list = createElement('div', { className: 'extensions__list' });
    container.appendChild(list);

    EXTENSIONS.forEach((ext) => {
      const item = createElement('div', {
        className: `extensions__item${ext.installed ? ' extensions__item--installed' : ''}`,
        attrs: { 'data-name': ext.name, 'data-id': ext.id },
        children: [
          createElement('div', { className: 'extensions__item-icon', text: ext.icon }),
          createElement('div', {
            className: 'extensions__item-info',
            children: [
              createElement('div', { className: 'extensions__item-name', text: ext.name }),
              createElement('div', { className: 'extensions__item-desc', text: ext.desc }),
              createElement('div', { className: 'extensions__item-publisher', text: ext.publisher }),
              createElement('div', {
                className: 'extensions__item-install-btn',
                text: ext.installed ? 'Uninstall' : 'Install',
                events: {
                  click: (e) => {
                    e.stopPropagation();
                    toggleInstall(ext.id);
                    // Re-render just this item
                    const parent = item.parentElement;
                    if (parent) ExtensionsView.render(container);
                  },
                },
              }),
            ],
          }),
        ],
      });
      list.appendChild(item);
    });
  },
};
