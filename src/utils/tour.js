/**
 * @fileoverview
 * First-time user tour — guides new visitors through the app's features.
 * Only shows once (persisted in localStorage).
 */

import { createElement, $ } from './dom.js';
import { getItem, setItem } from '../storage/local-storage.js';

const TOUR_KEY = 'vscode-clone:tour-shown';

const TOUR_STEPS = [
  {
    title: 'Welcome to VS Code Clone!',
    content: 'This is a portfolio-quality code editor built entirely with vanilla HTML, CSS, and JavaScript. Let us show you around.',
    position: 'center',
  },
  {
    title: 'Activity Bar',
    content: 'Use the icons on the left to switch between Explorer, Search, Source Control, Run & Debug, and Extensions.',
    selector: '#activity-bar',
    position: 'right',
  },
  {
    title: 'File Explorer',
    content: 'Browse, create, rename, and delete files and folders. Right-click for context menus. Drag and drop to reorganize.',
    selector: '#sidebar',
    position: 'right',
  },
  {
    title: 'Editor',
    content: 'Open files by clicking them in the Explorer. Tabs support pinning, reordering, and closing.',
    selector: '#editor-area',
    position: 'left',
  },
  {
    title: 'Command Palette',
    content: 'Press Ctrl+Shift+P to open the Command Palette and access all features. Press Ctrl+P for Quick Open.',
    selector: '#editor-area',
    position: 'top',
  },
  {
    title: 'Terminal',
    content: 'The bottom panel includes a terminal emulator with command history, ANSI colors, and multiple tabs.',
    selector: '#panel',
    position: 'top',
  },
  {
    title: 'Themes',
    content: 'Switch themes from the Command Palette. Try: Dark+, Light+, Dracula, or Monokai.',
    selector: '#status-bar',
    position: 'top',
  },
];

/** @type {number} */
let currentStep = 0;

/** @type {HTMLElement|null} */
let overlayEl = null;

/** @type {HTMLElement|null} */
let tooltipEl = null;

/** @type {boolean} */
let isActive = false;

/**
 * Create the tour overlay and tooltip elements.
 */
function createDOM() {
  overlayEl = createElement('div', {
    className: 'tour-overlay',
    attrs: { role: 'dialog', 'aria-label': 'Feature Tour', 'aria-modal': 'true' },
    style: {
      position: 'fixed', inset: '0', zIndex: '1000',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
  });

  tooltipEl = createElement('div', {
    className: 'tour-tooltip',
    style: {
      backgroundColor: 'var(--bg-dropdown)',
      border: '1px solid var(--border-dropdown)',
      borderRadius: '8px', padding: '24px',
      maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    },
  });

  overlayEl.appendChild(tooltipEl);
  document.body.appendChild(overlayEl);
}

/**
 * Show the current tour step.
 */
function showStep() {
  if (!tooltipEl || !overlayEl) return;
  const step = TOUR_STEPS[currentStep];
  if (!step) {
    endTour();
    return;
  }

  // Highlight target element
  document.querySelectorAll('.tour-highlight').forEach((el) => el.classList.remove('tour-highlight'));
  if (step.selector) {
    const target = document.querySelector(step.selector);
    if (target) target.classList.add('tour-highlight');
  }

  tooltipEl.innerHTML = '';

  const title = createElement('h2', {
    text: step.title,
    style: { fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)' },
  });
  tooltipEl.appendChild(title);

  const content = createElement('p', {
    text: step.content,
    style: { fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)', marginBottom: '20px' },
  });
  tooltipEl.appendChild(content);

  const footer = createElement('div', {
    style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  });

  const dots = createElement('div', { style: { display: 'flex', gap: '6px' } });
  TOUR_STEPS.forEach((_, i) => {
    const dot = createElement('div', {
      style: {
        width: '8px', height: '8px', borderRadius: '50%',
        backgroundColor: i === currentStep ? 'var(--accent-primary)' : 'var(--bg-badge)',
        transition: 'background-color 0.2s',
      },
    });
    dots.appendChild(dot);
  });
  footer.appendChild(dots);

  const btnGroup = createElement('div', { style: { display: 'flex', gap: '8px' } });

  if (currentStep < TOUR_STEPS.length - 1) {
    const nextBtn = createElement('button', {
      text: 'Next',
      style: {
        backgroundColor: 'var(--accent-primary)', color: '#fff',
        padding: '6px 16px', borderRadius: '4px', cursor: 'pointer',
        fontSize: '13px',
      },
      events: { click: () => { currentStep++; showStep(); } },
    });
    btnGroup.appendChild(nextBtn);
  } else {
    const doneBtn = createElement('button', {
      text: 'Get Started',
      style: {
        backgroundColor: 'var(--accent-primary)', color: '#fff',
        padding: '6px 16px', borderRadius: '4px', cursor: 'pointer',
        fontSize: '13px',
      },
      events: { click: () => endTour() },
    });
    btnGroup.appendChild(doneBtn);
  }

  footer.appendChild(btnGroup);
  tooltipEl.appendChild(footer);
}

/**
 * End the tour.
 */
function endTour() {
  isActive = false;
  if (overlayEl) { overlayEl.remove(); overlayEl = null; tooltipEl = null; }
  document.querySelectorAll('.tour-highlight').forEach((el) => el.classList.remove('tour-highlight'));
  setItem(TOUR_KEY, true);
}

/**
 * Start the tour.
 */
function startTour() {
  if (isActive) return;
  isActive = true;
  currentStep = 0;
  createDOM();
  showStep();
}

export const Tour = {
  /** Check if this is the first visit and show tour if needed. */
  init() {
    const shown = getItem(TOUR_KEY, false);
    if (!shown) {
      // Small delay to let the UI render first
      setTimeout(startTour, 800);
    }
  },

  /** Manually start the tour. */
  start() { startTour(); },
};
