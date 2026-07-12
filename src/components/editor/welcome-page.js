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

  const welcome = createElement('div', {
    className: 'editor__welcome',
    style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '32px' },
  });

  const content = createElement('div', {
    className: 'welcome__content',
    style: { textAlign: 'center', maxWidth: '480px' },
  });

  // Logo
  const logo = createElement('span', {
    className: 'welcome__logo',
    style: { display: 'inline-flex', marginBottom: '24px', color: 'var(--accent-primary)', opacity: '0.4' },
    html: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M17.5 2L21 5.5v15a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 015 20.5v-17A1.5 1.5 0 016.5 2h11z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  });
  content.appendChild(logo);

  // Title
  content.appendChild(createElement('h1', {
    style: { fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' },
    text: 'VS Code Clone',
  }));
  content.appendChild(createElement('p', {
    style: { fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' },
    text: 'Portfolio-quality editor experience',
  }));

  // Quick actions
  const actions = createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' },
  });

  const actionButtons = [
    { label: 'New File', icon: ICONS.newFile, action: 'new-file' },
    { label: 'Open Folder', icon: ICONS.folder, action: 'open-folder' },
    { label: 'Command Palette', icon: ICONS.search, action: 'command-palette' },
  ];

  actionButtons.forEach((btn) => {
    const el = createElement('button', {
      style: {
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '8px 16px', backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-primary)', color: 'var(--text-primary)',
        fontSize: '13px', cursor: 'pointer', borderRadius: '4px',
        textAlign: 'left', transition: 'background-color 80ms',
      },
      events: {
        mouseenter: (e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; },
        mouseleave: (e) => { e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'; },
        click: () => {
          if (btn.action === 'command-palette') {
            eventBus.emit(EVENTS.COMMAND_EXECUTED, 'command-palette');
          } else if (btn.action === 'new-file') {
            eventBus.emit(EVENTS.VIEW_CHANGED, 'explorer');
            // Dispatch a delayed new-file event
            setTimeout(() => eventBus.emit(EVENTS.COMMAND_EXECUTED, 'new-file'), 100);
          } else if (btn.action === 'open-folder') {
            eventBus.emit(EVENTS.COMMAND_EXECUTED, 'open-folder');
          }
        },
      },
      children: [
        createElement('span', { className: 'icon', html: btn.icon, attrs: { 'aria-hidden': 'true' }, style: { color: 'var(--text-secondary)', display: 'flex' } }),
        createElement('span', { text: btn.label }),
      ],
    });
    actions.appendChild(el);
  });

  content.appendChild(actions);

  // Recent files
  if (recent.length > 0) {
    const recentSection = createElement('div', {
      style: { marginBottom: '24px', textAlign: 'left' },
    });
    recentSection.appendChild(createElement('div', {
      style: { fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' },
      text: 'Recent',
    }));

    recent.forEach((file) => {
      const fileEl = createElement('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '4px 8px', cursor: 'pointer', fontSize: '13px',
          color: 'var(--text-primary)', borderRadius: '3px',
        },
        events: {
          mouseenter: (e) => { e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; },
          mouseleave: (e) => { e.currentTarget.style.backgroundColor = ''; },
          click: () => {
            eventBus.emit(EVENTS.FILE_SELECTED, { name: file.name });
            eventBus.emit(EVENTS.TAB_OPENED, { name: file.name });
          },
        },
        children: [
          createElement('span', { className: 'icon', html: ICONS.file, style: { color: 'var(--text-secondary)', display: 'flex' } }),
          createElement('span', { text: file.name }),
        ],
      });
      recentSection.appendChild(fileEl);
    });

    content.appendChild(recentSection);
  }

  // Keyboard shortcuts
  const shortcuts = createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' },
  });

  const shortcutData = [
    { keys: 'Ctrl+Shift+P', desc: 'Command Palette' },
    { keys: 'Ctrl+P', desc: 'Quick Open' },
    { keys: 'Ctrl+B', desc: 'Toggle Sidebar' },
    { keys: 'Ctrl+`', desc: 'Toggle Terminal' },
  ];

  shortcutData.forEach((s) => {
    const el = createElement('div', {
      style: { fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '8px' },
      children: [
        createElement('kbd', {
          text: s.keys,
          style: {
            display: 'inline-block', padding: '1px 6px', minWidth: '20px', textAlign: 'center',
            backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
            borderRadius: '3px', fontFamily: 'inherit', fontSize: '11px', color: 'var(--text-tertiary)',
          },
        }),
        createElement('span', { text: s.desc }),
      ],
    });
    shortcuts.appendChild(el);
  });

  content.appendChild(shortcuts);
  welcome.appendChild(content);
  container.appendChild(welcome);
}
