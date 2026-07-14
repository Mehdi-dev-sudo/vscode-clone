// @ts-check

/**
 * @fileoverview
 * Notification system — toast-style notifications.
 * Supports: info, warning, error types, auto-dismiss, manual close.
 */

import { createElement } from '../../utils/dom.js';
import { eventBus } from '../../events/event-bus.js';
import { EVENTS, NOTIFICATION_DURATION } from '../../core/constants.js';
import { ICONS } from '../../assets/icons/codicons.js';

/** @type {HTMLElement|null} */
let containerEl = null;

/** @type {Map<string, HTMLElement>} */
const activeNotifications = new Map();

/** Counter for unique notification IDs. */
let counter = 0;

/** Maximum concurrent visible notifications. */
const MAX_VISIBLE = 5;

/**
 * Remove a notification by ID.
 * @param {string} id
 * @returns {void}
 */
function remove(id) {
  const el = activeNotifications.get(id);
  if (!el) return;

  el.classList.add('notification--removing');
  setTimeout(() => {
    el.remove();
    activeNotifications.delete(id);
    eventBus.emit(EVENTS.NOTIFICATION_REMOVED, { id });
  }, 250);
}

/**
 * Show a notification.
 * @param {'info'|'warning'|'error'} type
 * @param {string} title
 * @param {string} [message]
 * @param {number} [duration] - Auto-dismiss in ms. 0 means persist.
 * @returns {string} Notification ID.
 */
function show(type = 'info', title, message = '', duration = NOTIFICATION_DURATION) {
  if (!containerEl) return '';

  const id = `notif-${++counter}`;
  const iconMap = { info: ICONS.info, warning: ICONS.warning, error: ICONS.error };

  const notif = createElement('div', {
    className: `notification notification--${type}`,
    attrs: { 'data-id': id, role: 'alert' },
    children: [
      createElement('span', {
        className: 'notification__icon',
        html: iconMap[type] || ICONS.info,
        attrs: { 'aria-hidden': 'true' },
      }),
      createElement('div', {
        className: 'notification__content',
        children: [
          createElement('div', { className: 'notification__title', text: title }),
          message ? createElement('div', { className: 'notification__message', text: message }) : null,
        ].filter((v) => v !== null),
      }),
      createElement('button', {
        className: 'notification__close',
        html: ICONS.close,
        attrs: { 'aria-label': 'Dismiss notification' },
        events: { click: () => remove(id) },
      }),
    ],
  });

  // Enforce max visible limit
  if (activeNotifications.size >= MAX_VISIBLE) {
    const oldest = activeNotifications.keys().next().value;
    if (oldest) remove(oldest);
  }

  containerEl.appendChild(notif);
  activeNotifications.set(id, notif);

  eventBus.emit(EVENTS.NOTIFICATION_ADDED, { id, type, title, message });

  // Auto-dismiss
  if (duration > 0) {
    setTimeout(() => remove(id), duration);
  }

  return id;
}

/**
 * Notifications component module.
 * @namespace
 */
export const Notifications = {
  /** Initialize the notification system. */
  init() {
    containerEl = document.getElementById('notifications');
    if (!containerEl) return;

    // No subscription here — show() is the single entry point.
    // External modules should import Notifications and call
    // .info() / .warning() / .error() directly.
    // Re-emitting NOTIFICATION_ADDED inside show() + listening here
    // would cause infinite recursion.

    // Listen for clear-notifications command
    eventBus.on(EVENTS.COMMAND_EXECUTED, (/** @type {string} */ cmd) => {
      if (cmd === 'clear-notifications' && containerEl) {
        containerEl.innerHTML = '';
        activeNotifications.clear();
      }
    });
  },

  /**
   * Show an info notification.
   * @param {string} title
   * @param {string} [message]
   * @param {number} [duration]
   * @returns {string} Notification ID.
   */
  info(title, message = '', duration = NOTIFICATION_DURATION) {
    return show('info', title, message, duration);
  },

  /**
   * Show a warning notification.
   * @param {string} title
   * @param {string} [message]
   * @param {number} [duration]
   * @returns {string} Notification ID.
   */
  warning(title, message = '', duration = NOTIFICATION_DURATION) {
    return show('warning', title, message, duration);
  },

  /**
   * Show an error notification.
   * @param {string} title
   * @param {string} [message]
   * @param {number} [duration]
   * @returns {string} Notification ID.
   */
  error(title, message = '', duration = NOTIFICATION_DURATION) {
    return show('error', title, message, duration);
  },
};
