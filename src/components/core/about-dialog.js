// @ts-check

/**
 * @fileoverview
 * About Dialog — displays application info, version, author, and credits.
 * Triggered from the command palette.
 */

import { createElement, $ } from '../../utils/dom.js';
import { eventBus } from '../../events/event-bus.js';
import { EVENTS, APP_NAME, APP_VERSION } from '../../core/constants.js';

/** @type {HTMLElement|null} */
let dialogEl = null;

/**
 * Create and show the about dialog.
 * @returns {void}
 */
function show() {
  // Remove existing dialog if any
  document.querySelector('.about-dialog')?.remove();

  const overlay = createElement('div', {
    className: 'about-dialog',
    style: {
      position: 'fixed', inset: '0', zIndex: '500',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    events: { click: (e) => { if (e.target === overlay) hide(); } },
  });

  dialogEl = createElement('div', {
    style: {
      backgroundColor: 'var(--bg-dropdown)',
      border: '1px solid var(--border-dropdown)',
      borderRadius: '8px', padding: '32px',
      maxWidth: '400px', width: '90%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      textAlign: 'center',
    },
  });

  // App icon
  const icon = createElement('div', {
    style: { fontSize: '48px', marginBottom: '16px', color: 'var(--accent-primary)', opacity: '0.6' },
    html: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M17.5 2L21 5.5v15a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 015 20.5v-17A1.5 1.5 0 016.5 2h11z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  });
  dialogEl.appendChild(icon);

  // Title
  dialogEl.appendChild(createElement('h2', {
    style: { fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' },
    text: APP_NAME,
  }));

  // Version
  dialogEl.appendChild(createElement('p', {
    style: { fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' },
    text: `Version ${APP_VERSION}`,
  }));

  // Info
  dialogEl.appendChild(createElement('p', {
    style: { fontSize: '12px', lineHeight: '1.6', color: 'var(--text-tertiary)', marginBottom: '24px' },
    text: 'A portfolio-quality Visual Studio Code inspired web application. Built entirely with vanilla HTML, CSS, and JavaScript. No frameworks. No build tools.',
  }));

  // Tech stack
  const stack = createElement('div', {
    style: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  });
  ['HTML', 'CSS', 'JavaScript', 'ES Modules'].forEach((tech) => {
    stack.appendChild(createElement('span', {
      style: {
        padding: '2px 8px', backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '4px', fontSize: '11px', color: 'var(--text-secondary)',
      },
      text: tech,
    }));
  });
  dialogEl.appendChild(stack);

  // Close button
  const closeBtn = createElement('button', {
    style: {
      backgroundColor: 'var(--accent-primary)', color: '#fff',
      padding: '8px 24px', borderRadius: '4px', cursor: 'pointer',
      fontSize: '13px', border: 'none',
    },
    text: 'Close',
    events: { click: hide },
  });
  dialogEl.appendChild(closeBtn);

  overlay.appendChild(dialogEl);
  document.body.appendChild(overlay);

  // Keyboard shortcut to close
  const onKeyDown = (e) => {
    if (e.key === 'Escape') { hide(); document.removeEventListener('keydown', onKeyDown); }
  };
  document.addEventListener('keydown', onKeyDown);
}

/**
 * @returns {void}
 */
function hide() {
  document.querySelector('.about-dialog')?.remove();
}

export const AboutDialog = {
  /** Initialize the about dialog. */
  init() {
    eventBus.on(EVENTS.COMMAND_EXECUTED, (cmd) => {
      if (cmd === 'about') show();
    });
  },
};
