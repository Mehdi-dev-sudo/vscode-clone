/**
 * @fileoverview
 * Layout Presets — switch between predefined IDE layouts.
 * Each preset defines sidebar width, panel height, and
 * visibility of sidebar/panel/sidebar-views.
 */

import { createElement } from '../utils/dom.js';
import { eventBus } from '../events/event-bus.js';
import { EVENTS } from '../core/constants.js';

const PRESETS = {
  'Editor Focus': {
    sidebarWidth: '200px',
    panelHeight: '80px',
    sidebarVisible: false,
    panelVisible: false,
  },
  'Explorer + Terminal': {
    sidebarWidth: '260px',
    panelHeight: '200px',
    sidebarVisible: true,
    panelVisible: true,
  },
  'Terminal Max': {
    sidebarWidth: '200px',
    panelHeight: '400px',
    sidebarVisible: false,
    panelVisible: true,
  },
  'Split Layout': {
    sidebarWidth: '300px',
    panelHeight: '150px',
    sidebarVisible: true,
    panelVisible: true,
  },
  'Minimal': {
    sidebarWidth: '0px',
    panelHeight: '0px',
    sidebarVisible: false,
    panelVisible: false,
  },
  'Debug Mode': {
    sidebarWidth: '320px',
    panelHeight: '250px',
    sidebarVisible: true,
    panelVisible: true,
  },
};

function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;

  const sidebar = document.getElementById('sidebar');
  const panel = document.getElementById('panel');

  if (sidebar) {
    sidebar.style.width = preset.sidebarWidth;
    sidebar.classList.toggle('app__sidebar--hidden', !preset.sidebarVisible);
  }

  if (panel) {
    panel.style.height = preset.panelHeight;
    panel.classList.toggle('app__panel--hidden', !preset.panelVisible);
  }

  // Dispatch resize event
  window.dispatchEvent(new CustomEvent('layout:changed'));

  import('../components/notifications/notifications.js').then(({ Notifications }) => {
    Notifications.info(`Layout: ${name}`);
  });
}

function showDialog() {
  document.querySelector('.layout-presets')?.remove();

  const overlay = createElement('div', {
    className: 'layout-presets',
    style: {
      position: 'fixed', inset: '0', zIndex: '500',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    events: { click: (e) => { if (e.target === overlay) close(); } },
  });

  const dialog = createElement('div', {
    style: {
      backgroundColor: 'var(--bg-dropdown)', border: '1px solid var(--border-dropdown)',
      borderRadius: '8px', maxWidth: '400px', width: '90%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    },
  });

  const header = createElement('div', {
    style: { padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    children: [
      createElement('h2', { style: { fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }, text: 'Layout Presets' }),
      createElement('button', {
        style: { color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px', background: 'none', border: 'none' },
        text: '✕', events: { click: close },
      }),
    ],
  });
  dialog.appendChild(header);

  Object.keys(PRESETS).forEach((name) => {
    const preset = PRESETS[name];
    const desc = [];
    if (preset.sidebarVisible) desc.push(`sidebar ${preset.sidebarWidth}`);
    if (preset.panelVisible) desc.push(`panel ${preset.panelHeight}`);
    if (!preset.sidebarVisible && !preset.panelVisible) desc.push('clean slate');

    const item = createElement('div', {
      style: {
        padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border-primary)',
        display: 'flex', alignItems: 'center', gap: '12px',
      },
      events: {
        mouseenter: (e) => { e.currentTarget.style.backgroundColor = 'var(--sidebar-item-hover)'; },
        mouseleave: (e) => { e.currentTarget.style.backgroundColor = ''; },
        click: () => { applyPreset(name); close(); },
      },
      children: [
        createElement('div', { style: { flex: '1' },
          children: [
            createElement('div', { style: { fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }, text: name }),
            createElement('div', { style: { fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }, text: desc.join(', ') || 'empty workspace' }),
          ],
        }),
        createElement('div', { style: { color: 'var(--text-tertiary)', fontSize: '16px' }, text: '→' }),
      ],
    });
    dialog.appendChild(item);
  });

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
}

function close() {
  document.querySelector('.layout-presets')?.remove();
}

export const LayoutPresets = {
  init() {
    eventBus.on(EVENTS.COMMAND_EXECUTED, (cmd) => {
      if (cmd === 'layout-presets') showDialog();
    });
  },
};
