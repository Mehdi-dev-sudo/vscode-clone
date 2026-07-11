/**
 * @fileoverview
 * Extension Detail view — shows detailed information about a marketplace extension.
 * Includes description, version, publisher, rating, and install button.
 */

import { createElement, empty } from '../../utils/dom.js';
import { ICONS } from '../../assets/icons/codicons.js';

/**
 * @param {HTMLElement} container
 * @param {Object} ext - Extension data object.
 * @param {Function} onBack - Callback to go back to extension list.
 */
export function renderExtensionDetail(container, ext, onBack) {
  empty(container);

  const header = createElement('div', { className: 'sidebar__header' });
  const backBtn = createElement('button', {
    className: 'sidebar__action-btn',
    html: ICONS.chevronRight,
    attrs: { 'aria-label': 'Back to extensions', title: 'Back' },
    style: { transform: 'rotate(180deg)' },
    events: { click: () => onBack() },
  });
  header.append(backBtn, createElement('span', { className: 'sidebar__title', text: 'EXTENSION' }));
  container.appendChild(header);

  const detail = createElement('div', {
    style: { padding: '16px', flex: '1', overflowY: 'auto' },
  });

  // Extension icon and name
  const topSection = createElement('div', {
    style: { display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' },
    children: [
      createElement('div', {
        style: { width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: '0' },
        text: ext.icon || '🔌',
      }),
      createElement('div', { style: { flex: '1' },
        children: [
          createElement('div', { style: { fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }, text: ext.name }),
          createElement('div', { style: { fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }, text: ext.publisher || 'Unknown' }),
          createElement('div', { style: { display: 'flex', gap: '4px', marginTop: '4px', alignItems: 'center', fontSize: '12px', color: 'var(--text-tertiary)' },
            children: [
              createElement('span', { text: `${ext.version || '1.0.0'}` }),
              createElement('span', { text: '•' }),
              createElement('span', { text: `${ext.installs || '10k'} installs` }),
            ],
          }),
        ],
      }),
      createElement('button', {
        style: {
          backgroundColor: ext.installed ? 'var(--button-secondary-bg)' : 'var(--accent-primary)',
          color: ext.installed ? 'var(--text-primary)' : '#fff',
          padding: '4px 12px', borderRadius: '4px', cursor: 'pointer',
          fontSize: '13px', border: 'none',
        },
        text: ext.installed ? 'Uninstall' : 'Install',
        events: {
          click: () => { ext.installed = !ext.installed; renderExtensionDetail(container, ext, onBack); },
        },
      }),
    ],
  });
  detail.appendChild(topSection);

  // Description
  detail.appendChild(createElement('div', {
    style: { fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '16px' },
    text: ext.description || 'No description available.',
  }));

  // Details section
  const detailsSection = createElement('div', {
    style: { backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', padding: '12px', fontSize: '12px' },
    children: [
      detailRow('Publisher', ext.publisher || 'Unknown'),
      detailRow('Version', ext.version || '1.0.0'),
      detailRow('Last Updated', ext.updated || 'Today'),
      detailRow('Category', ext.category || 'Other'),
      detailRow('License', ext.license || 'MIT'),
    ],
  });
  detail.appendChild(detailsSection);

  container.appendChild(detail);
}

function detailRow(label, value) {
  return createElement('div', {
    style: { display: 'flex', justifyContent: 'space-between', padding: '4px 0' },
    children: [
      createElement('span', { style: { color: 'var(--text-tertiary)' }, text: label }),
      createElement('span', { style: { color: 'var(--text-primary)' }, text: value }),
    ],
  });
}
