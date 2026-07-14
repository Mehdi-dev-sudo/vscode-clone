// @ts-check

/**
 * @fileoverview
 * Git History view — displays commit history, branches, and changes.
 * Fully mock data with interactive timeline.
 */

import { createElement, empty } from '../../utils/dom.js';

const COMMITS = [
  { hash: 'a1b2c3d', message: 'feat: add syntax highlighting', author: 'user', date: '2 hours ago', branch: 'main' },
  { hash: 'e4f5g6h', message: 'fix: resolve tab reordering issue', author: 'user', date: '3 hours ago', branch: 'main' },
  { hash: 'i7j8k9l', message: 'refactor: extract event bus module', author: 'user', date: '5 hours ago', branch: 'main' },
  { hash: 'm0n1o2p', message: 'docs: update README with roadmap', author: 'user', date: '1 day ago', branch: 'main' },
  { hash: 'q3r4s5t', message: 'feat: add command palette', author: 'user', date: '2 days ago', branch: 'feature/cmd-palette' },
  { hash: 'u6v7w8x', message: 'style: improve CSS variable naming', author: 'user', date: '3 days ago', branch: 'main' },
  { hash: 'y9z0a1b', message: 'feat: initial explorer implementation', author: 'user', date: '5 days ago', branch: 'main' },
  { hash: 'c2d3e4f', message: 'chore: initialize project structure', author: 'user', date: '1 week ago', branch: 'main' },
];

/**
 * Render the Git History view.
 * @param {HTMLElement} container
 */
function render(container) {
  empty(container);

  const header = createElement('div', { className: 'sidebar__header' });
  header.appendChild(createElement('span', { className: 'sidebar__title', text: 'GIT HISTORY' }));
  container.appendChild(header);

  // Branch switcher
  const branchBar = createElement('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '8px 12px', borderBottom: '1px solid var(--border-primary)',
      fontSize: '12px',
    },
    children: [
      createElement('span', {
        style: { color: 'var(--accent-primary)', fontWeight: '600' },
        html: `<span class="icon" aria-hidden="true" style="margin-right:4px"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 1.5C4 .67 4.67 0 5.5 0S7 .67 7 1.5c0 .4-.16.77-.42 1.04l.91.91.54-.54a1.5 1.5 0 112.12 2.12l-.79.79A1.5 1.5 0 117.5 8h-.04l-.87.87c.07.2.12.42.12.63 0 .83-.67 1.5-1.5 1.5S4 10.33 4 9.5c0-.4.16-.77.42-1.04L3.5 7.54l-.54.54A1.5 1.5 0 11.84 5.96l.79-.79A1.5 1.5 0 114.5 2.5h.04l.87-.87A1.5 1.5 0 014 1.5z" fill="currentColor"/></svg></span> main`,
      }),
      createElement('span', { style: { color: 'var(--text-tertiary)' }, text: '8 commits' }),
    ],
  });
  container.appendChild(branchBar);

  // Commit timeline
  const timeline = createElement('div', {
    style: { flex: '1', overflowY: 'auto', padding: '8px 0' },
  });

  COMMITS.forEach((commit, i) => {
    const isLast = i === COMMITS.length - 1;
    const item = createElement('div', {
      style: {
        display: 'flex', gap: '12px', padding: '6px 12px',
        cursor: 'pointer', position: 'relative',
      },
      events: {
        mouseenter: (/** @type {MouseEvent} */ e) => { /** @type {HTMLElement} */ (e.currentTarget).style.backgroundColor = 'var(--sidebar-item-hover)'; },
        mouseleave: (/** @type {MouseEvent} */ e) => { /** @type {HTMLElement} */ (e.currentTarget).style.backgroundColor = ''; },
      },
    });

    // Timeline connector
    const connector = createElement('div', {
      style: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: '16px', flexShrink: '0',
      },
      children: [
        createElement('div', {
          style: {
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: commit.branch === 'main' ? 'var(--accent-primary)' : 'var(--color-yellow, #d7ba7d)',
            border: '2px solid var(--bg-primary)', flexShrink: '0',
            marginTop: '4px',
          },
        }),
        !isLast ? createElement('div', {
          style: {
            width: '1px', flex: '1',
            backgroundColor: 'var(--border-primary)', minHeight: '20px',
          },
        }) : null,
      ].filter((v) => v !== null),
    });

    // Content
    const content = createElement('div', {
      style: { flex: '1', minWidth: '0' },
      children: [
        createElement('div', {
          style: { fontSize: '13px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
          text: commit.message,
        }),
        createElement('div', {
          style: { fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px', display: 'flex', gap: '8px' },
          children: [
            createElement('span', { text: commit.hash.slice(0, 7) }),
            createElement('span', { text: commit.date }),
            commit.branch !== 'main' ? createElement('span', {
              style: { color: 'var(--color-yellow, #d7ba7d)' },
              text: commit.branch,
            }) : null,
      ].filter((v) => v !== null),
        }),
      ],
    });

    item.append(connector, content);
    timeline.appendChild(item);
  });

  container.appendChild(timeline);
}

export const GitView = {
  /** @param {HTMLElement} container */
  render(container) { render(container); },
};

