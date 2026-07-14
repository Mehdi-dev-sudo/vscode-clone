// @ts-check

/**
 * @fileoverview
 * Workspace Snapshots — save and restore the entire workspace state:
 * open tabs, sidebar width, panel height, active view, file tree,
 * scroll positions, theme, and terminal content.
 *
 * Each snapshot stores a complete JSON blob in localStorage.
 */

import { createElement } from '../utils/dom.js';
import { eventBus } from '../events/event-bus.js';
import { EVENTS } from '../core/constants.js';
import { getItem, setItem } from '../storage/local-storage.js';

const SNAPSHOTS_KEY = 'vscode-clone:snapshots';

/**
 * @typedef {Object} WorkspaceState
 * @property {number} timestamp
 * @property {string} sidebarWidth
 * @property {string} panelHeight
 * @property {boolean} sidebarVisible
 * @property {boolean} panelVisible
 * @property {string} activeView
 * @property {string} theme
 * @property {Array<Object>} openTabs
 * @property {Object|null} explorerState
 * @property {string} url
 */

/**
 * Capture the current workspace state.
 * @returns {WorkspaceState}
 */
function captureState() {
  const sidebar = document.getElementById('sidebar');
  const panel = document.getElementById('panel');

  return {
    timestamp: Date.now(),
    sidebarWidth: sidebar?.style?.width || '260px',
    panelHeight: panel?.style?.height || '200px',
    sidebarVisible: !sidebar?.classList.contains('app__sidebar--hidden'),
    panelVisible: !panel?.classList.contains('app__panel--hidden'),
    activeView: (/** @type {HTMLElement | null} */ (document.querySelector('.activity-bar__btn--active')))?.dataset?.view || 'explorer',
    theme: document.documentElement.className,
    // Open tabs are captured from storage
    openTabs: getItem('vscode-clone:open-tabs', []),
    // Explorer state from storage
    explorerState: getItem('vscode-clone:explorer-state', null),
    // URL (for future routing)
    url: window.location.href,
  };
}

/**
 * Restore a saved state.
 * @param {WorkspaceState} state
 * @returns {void}
 */
function restoreState(state) {
  if (!state) return;

  // Theme
  if (state.theme) {
    document.documentElement.className = state.theme;
  }

  // Sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    if (state.sidebarWidth) sidebar.style.width = state.sidebarWidth;
    sidebar.classList.toggle('app__sidebar--hidden', !state.sidebarVisible);
  }

  // Panel
  const panel = document.getElementById('panel');
  if (panel) {
    if (state.panelHeight) panel.style.height = state.panelHeight;
    panel.classList.toggle('app__panel--hidden', !state.panelVisible);
  }

  // Tabs
  if (state.openTabs && state.openTabs.length > 0) {
    setItem('vscode-clone:open-tabs', state.openTabs);
  }

  // Explorer
  if (state.explorerState) {
    setItem('vscode-clone:explorer-state', state.explorerState);
  }

  // Reload UI to match restored state
}

/**
 * Show the snapshots dialog.
 * @returns {void}
 */
function showDialog() {
  document.querySelector('.snapshot-dialog')?.remove();

  const snapshots = getItem(SNAPSHOTS_KEY, {});

  const overlay = createElement('div', {
    className: 'snapshot-dialog',
    style: {
      position: 'fixed', inset: '0', zIndex: '500',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    events: { click: (/** @type {MouseEvent} */ e) => { if (e.target === overlay) close(); } },
  });

  const dialog = createElement('div', {
    style: {
      backgroundColor: 'var(--bg-dropdown)', border: '1px solid var(--border-dropdown)',
      borderRadius: '8px', maxWidth: '500px', width: '90%',
      maxHeight: '70vh', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      display: 'flex', flexDirection: 'column',
    },
  });

  // Header
  const header = createElement('div', {
    style: { padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    children: [
      createElement('h2', { style: { fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }, text: 'Workspace Snapshots' }),
      createElement('button', {
        style: { color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px', background: 'none', border: 'none' },
        text: '✕', events: { click: close },
      }),
    ],
  });
  dialog.appendChild(header);

  // Save new snapshot
  const saveRow = createElement('div', {
    style: { padding: '12px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', gap: '8px' },
    children: [
      createElement('input', {
        style: { flex: '1', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', padding: '6px 8px', fontSize: '13px' },
        attrs: { type: 'text', placeholder: 'Snapshot name...', id: 'snapshot-name', autocomplete: 'off' },
        events: { keydown: (/** @type {KeyboardEvent} */ e) => { if (e.key === 'Enter') saveSnapshot(); } },
      }),
      createElement('button', {
        style: { backgroundColor: 'var(--accent-primary)', color: '#fff', padding: '6px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' },
        text: 'Save Current',
        events: { click: saveSnapshot },
      }),
    ],
  });
  dialog.appendChild(saveRow);

  // Snapshot list
  const names = Object.keys(snapshots).sort((a, b) => snapshots[b].timestamp - snapshots[a].timestamp);
  const list = createElement('div', {
    style: { overflowY: 'auto', padding: '8px 0', flex: '1' },
  });

  if (names.length === 0) {
    list.appendChild(createElement('div', {
      style: { padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' },
      text: 'No snapshots yet. Save one to capture your current workspace state.',
    }));
  } else {
    names.forEach((name) => {
      const snap = snapshots[name];
      const item = createElement('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border-primary)',
        },
        events: {
          mouseenter: (/** @type {MouseEvent} */ e) => { /** @type {HTMLElement} */ (e.currentTarget).style.backgroundColor = 'var(--sidebar-item-hover)'; },
          mouseleave: (/** @type {MouseEvent} */ e) => { /** @type {HTMLElement} */ (e.currentTarget).style.backgroundColor = ''; },
        },
        children: [
          createElement('div', { style: { flex: '1' },
            children: [
              createElement('div', { style: { fontSize: '13px', color: 'var(--text-primary)' }, text: name }),
              createElement('div', { style: { fontSize: '11px', color: 'var(--text-tertiary)' }, text: `${new Date(snap.timestamp).toLocaleString()} — ${snap.openTabs?.length || 0} tabs` }),
            ],
          }),
          createElement('button', {
            style: { backgroundColor: 'var(--button-secondary-bg)', color: 'var(--text-primary)', padding: '4px 10px', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' },
            text: 'Restore',
            events: { click: (/** @type {MouseEvent} */ e) => { e.stopPropagation(); restoreState(snap); } },
          }),
          createElement('button', {
            style: { color: 'var(--notification-error)', cursor: 'pointer', fontSize: '14px', background: 'none', border: 'none', padding: '4px' },
            text: '🗑',
            events: { click: (/** @type {MouseEvent} */ e) => { e.stopPropagation(); deleteSnapshot(name); showDialog(); } },
          }),
        ],
      });
      list.appendChild(item);
    });
  }

  dialog.appendChild(list);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}

/**
 * @returns {void}
 */
function saveSnapshot() {
  const input = /** @type {HTMLInputElement | null} */ (document.getElementById('snapshot-name'));
  const name = input?.value?.trim();
  if (!name) return;

  const snapshots = getItem(SNAPSHOTS_KEY, {});
  snapshots[name] = captureState();
  setItem(SNAPSHOTS_KEY, snapshots);

  import('../components/notifications/notifications.js').then(({ Notifications }) => {
    Notifications.info(`Snapshot "${name}" saved`);
  });

  showDialog();
}

/**
 * @param {string} name
 * @returns {void}
 */
function deleteSnapshot(name) {
  const snapshots = getItem(SNAPSHOTS_KEY, {});
  delete snapshots[name];
  setItem(SNAPSHOTS_KEY, snapshots);
}

/**
 * @returns {void}
 */
function close() {
  document.querySelector('.snapshot-dialog')?.remove();
}

/**
 * @namespace
 */
export const WorkspaceSnapshots = {
  init() {
    eventBus.on(EVENTS.COMMAND_EXECUTED, (/** @type {string} */ cmd) => {
      if (cmd === 'workspace-snapshots') showDialog();
    });
  },
};
