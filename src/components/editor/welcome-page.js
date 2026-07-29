// @ts-check

/**
 * @fileoverview
 * Enhanced Welcome Page — shows recent files, quick actions,
 * and keyboard shortcuts in a clean, interactive layout.
 */

import { createElement, empty } from '../../utils/dom.js';
import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { ICONS } from '../../assets/icons/codicons.js';
import { getRecentFiles } from '../../utils/history.js';

/**
 * Render the welcome page with recent files and actions.
 * @param {HTMLElement} container
 * @returns {void}
 */
export function renderWelcomePage(container) {
  if (!container) return;
  empty(container);

  const recent = getRecentFiles(5);

  const welcome = createElement('div', { className: 'editor__welcome' });

  const content = createElement('div', { className: 'welcome__content' });

  // Logo
  const logo = createElement('span', {
    className: 'welcome__logo',
    html: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M17.5 2L21 5.5v15a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 015 20.5v-17A1.5 1.5 0 016.5 2h11z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  });
  content.appendChild(logo);

  // Title
  content.appendChild(createElement('h1', { className: 'welcome__title', text: 'VS Code Clone' }));
  content.appendChild(createElement('p', { className: 'welcome__subtitle', text: 'Portfolio-quality editor experience' }));

  // Quick actions
  const actions = createElement('div', { className: 'welcome__actions' });

  const actionButtons = [
    { label: 'New File', icon: ICONS.newFile, action: 'new-file' },
    { label: 'Open Folder', icon: ICONS.folder, action: 'open-folder' },
    { label: 'Command Palette', icon: ICONS.search, action: 'command-palette' },
  ];

  actionButtons.forEach((btn) => {
    const el = createElement('button', {
      className: 'welcome__btn',
      events: {
        click: () => {
          if (btn.action === 'command-palette') {
            eventBus.emit(EVENTS.COMMAND_EXECUTED, 'command-palette');
          } else if (btn.action === 'new-file') {
            eventBus.emit(EVENTS.VIEW_CHANGED, 'explorer');
            setTimeout(() => eventBus.emit(EVENTS.COMMAND_EXECUTED, 'new-file'), 100);
          } else if (btn.action === 'open-folder') {
            eventBus.emit(EVENTS.COMMAND_EXECUTED, 'open-folder');
          }
        },
      },
      children: [
        createElement('span', { className: 'icon', html: btn.icon, attrs: { 'aria-hidden': 'true' } }),
        createElement('span', { text: btn.label }),
      ],
    });
    actions.appendChild(el);
  });

  content.appendChild(actions);

  // Recent files
  if (recent.length > 0) {
    const recentSection = createElement('div', { className: 'welcome__recent-list' });
    recentSection.appendChild(createElement('div', { className: 'welcome__recent-label', text: 'Recent' }));

    recent.forEach((file) => {
      const fileEl = createElement('div', {
        className: 'welcome__recent-item',
        events: {
          click: () => {
            eventBus.emit(EVENTS.FILE_SELECTED, { name: file.name });
            eventBus.emit(EVENTS.TAB_OPENED, { name: file.name });
          },
        },
        children: [
          createElement('span', { className: 'icon', html: ICONS.file, attrs: { 'aria-hidden': 'true' } }),
          createElement('span', { text: file.name }),
        ],
      });
      recentSection.appendChild(fileEl);
    });

    content.appendChild(recentSection);
  }

  // Keyboard shortcuts
  const shortcuts = createElement('div', { className: 'welcome__shortcuts' });

  const shortcutData = [
    { keys: 'Ctrl+Shift+P', desc: 'Command Palette' },
    { keys: 'Ctrl+P', desc: 'Quick Open' },
    { keys: 'Ctrl+B', desc: 'Toggle Sidebar' },
    { keys: 'Ctrl+`', desc: 'Toggle Terminal' },
  ];

  shortcutData.forEach((s) => {
    const el = createElement('div', { className: 'welcome__shortcut', children: [
      createElement('kbd', { text: s.keys }),
      createElement('span', { text: s.desc }),
    ]});
    shortcuts.appendChild(el);
  });

  content.appendChild(shortcuts);
  welcome.appendChild(content);
  container.appendChild(welcome);
}
