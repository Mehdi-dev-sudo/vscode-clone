/**
 * @fileoverview
 * Theme Manager — handles theme switching, persistence, and application.
 * Themes are applied by setting a class on the document element.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS, THEMES, STORAGE_KEYS } from '../../core/constants.js';
import { getItem, setItem } from '../../storage/local-storage.js';
import { Notifications } from '../notifications/notifications.js';

/** @type {string} */
let currentTheme = THEMES.DARK;

/** Theme display names for the status bar and UI. */
export const THEME_NAMES = {
  [THEMES.DARK]: 'Dark+',
  [THEMES.LIGHT]: 'Light+',
  [THEMES.DRACULA]: 'Dracula',
  [THEMES.MONOKAI]: 'Monokai',
};

/**
 * Apply a theme by setting the class on the root <html> element.
 * @param {string} themeId - One of THEMES enum values.
 */
function applyTheme(themeId) {
  // Remove all theme classes
  Object.values(THEMES).forEach((t) => {
    document.documentElement.classList.remove(t);
  });

  document.documentElement.classList.add(themeId);
  currentTheme = themeId;

  // Persist
  setItem(STORAGE_KEYS.THEME, themeId);

  // Update status bar theme text
  const themeItem = document.querySelector('.status-bar__item:last-child');
  if (themeItem) {
    themeItem.textContent = THEME_NAMES[themeId] || themeId;
  }
}

/**
 * ThemeManager module.
 * @namespace
 */
export const ThemeManager = {
  /** Initialize theme system. */
  init() {
    // Listen for theme change events
    eventBus.on(EVENTS.THEME_CHANGED, (themeId) => {
      if (Object.values(THEMES).includes(themeId)) {
        applyTheme(themeId);
        Notifications.info(`Theme changed to ${THEME_NAMES[themeId] || themeId}`);
      }
    });

    // Also listen for theme commands from command palette
    eventBus.on(EVENTS.COMMAND_EXECUTED, (payload) => {
      if (typeof payload !== 'string') return;
      if (payload.startsWith('theme-')) {
        const themeMap = {
          'theme-dark': THEMES.DARK,
          'theme-light': THEMES.LIGHT,
          'theme-dracula': THEMES.DRACULA,
          'theme-monokai': THEMES.MONOKAI,
        };
        const themeId = themeMap[payload];
        if (themeId) {
          applyTheme(themeId);
          Notifications.info(`Theme: ${THEME_NAMES[themeId]}`);
        }
      }
    });
  },

  /**
   * Restore the persisted theme on startup.
   * Called before any component initialization.
   */
  restore() {
    const savedTheme = getItem(STORAGE_KEYS.THEME, THEMES.DARK);
    applyTheme(savedTheme);
  },

  /**
   * Get the current theme ID.
   * @returns {string}
   */
  getCurrentTheme() {
    return currentTheme;
  },

  /**
   * Get the current theme display name.
   * @returns {string}
   */
  getCurrentThemeName() {
    return THEME_NAMES[currentTheme] || currentTheme;
  },
};
