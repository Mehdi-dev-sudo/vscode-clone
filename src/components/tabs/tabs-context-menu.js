// @ts-check

/**
 * @fileoverview
 * Context menu actions for editor tabs: close, close others, close all,
 * pin/unpin, copy path, split right.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { ContextMenu } from '../../core/context-menu.js';
import { ICONS } from '../../assets/icons/codicons.js';
import { Notifications } from '../notifications/notifications.js';

/**
 * Build and show the tab context menu.
 * @param {MouseEvent} e
 * @param {Object} tab - The tab data object.
 * @param {Function} onClose - Close single tab callback.
 * @param {Function} onCloseOthers - Close other tabs callback.
 * @param {Function} onCloseAll - Close all tabs callback.
 * @param {Function} onTogglePin - Toggle pin callback.
 * @param {Object} tabData - All tabs data.
 */
export function showTabContextMenu(e, tab, { onClose, onCloseOthers, onCloseAll, onTogglePin }, tabData) {
  const items = [
    {
      label: 'Close',
      icon: ICONS.close,
      shortcut: 'Ctrl+W',
      action: () => onClose(tab.id),
    },
    {
      label: 'Close Others',
      action: () => onCloseOthers(tab.id),
    },
    {
      label: 'Close All',
      action: () => onCloseAll(),
    },
    { separator: true },
    {
      label: tab.pinned ? 'Unpin Tab' : 'Pin Tab',
      icon: ICONS.link,
      action: () => onTogglePin(tab.id),
    },
    { separator: true },
    {
      label: 'Copy Path',
      icon: ICONS.copy,
      action: () => {
        navigator.clipboard.writeText(tab.name).then(() => {
          Notifications.info('Path copied to clipboard');
        });
      },
    },
    {
      label: 'Split Right',
      icon: ICONS.files,
      action: () => {
        eventBus.emit(EVENTS.COMMAND_EXECUTED, 'split-editor');
      },
    },
  ];

  ContextMenu.show(e, items, tab);
}
