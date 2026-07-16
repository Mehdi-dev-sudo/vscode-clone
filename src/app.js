// @ts-check

/**
 * @fileoverview
 * Main application entry point.
 * Initializes core services, loads persisted state, and boots all components.
 * This is the only place where component initialization order is defined.
 */

import { eventBus } from './events/event-bus.js';
import { getItem } from './storage/local-storage.js';
import { STORAGE_KEYS, EVENTS } from './core/constants.js';
import { ActivityBar } from './components/activity-bar/activity-bar.js';
import { Sidebar } from './components/sidebar/sidebar.js';
import { Explorer } from './components/explorer/explorer.js';
import { Editor } from './components/editor/editor.js';
import { Tabs } from './components/tabs/tabs.js';
import { Terminal } from './components/terminal/terminal.js';
import { StatusBar } from './components/status-bar/status-bar.js';
import { CommandPalette } from './components/command-palette/command-palette.js';
import { Notifications } from './components/notifications/notifications.js';
import { ThemeManager } from './components/themes/theme-manager.js';
import { LayoutManager } from './components/layout/layout-manager.js';
import { KeyboardShortcuts } from './core/keyboard-shortcuts.js';
import { ContextMenu } from './core/context-menu.js';
import { SplitEditor } from './components/editor/split-editor.js';
import { PanelManager } from './components/panel/panel-manager.js';
import { Tour } from './utils/tour.js';
import { initFocusManager } from './core/focus-manager.js';
import { AboutDialog } from './components/core/about-dialog.js';
import { ThemeCreator } from './components/themes/theme-creator.js';
import { WorkspaceSnapshots } from './features/workspace-snapshots.js';
import { LayoutPresets } from './features/layout-presets.js';
import { PluginAPI } from './features/plugin-api.js';
import { SettingsEditor } from './features/settings-editor.js';

/**
 * Bootstrap the application.
 * Order matters: layout and theme before components that depend on them.
 * @returns {void}
 */
function boot() {
  // Restore persisted theme before anything renders
  ThemeManager.restore();

  // Layout must be initialized early
  LayoutManager.init();

  // Initialize keyboard shortcut system
  KeyboardShortcuts.init();

  // Initialize context menu system
  ContextMenu.init();

  // Initialize focus manager for keyboard navigation
  initFocusManager();

  // Bootstrap all UI components
  /** @type {Array<{init?: () => void, name?: string}>} */
  const components = [
    ActivityBar,
    Sidebar,
    Explorer,
    Tabs,
    Editor,
    Terminal,
    StatusBar,
    CommandPalette,
    Notifications,
    ThemeManager,
    SplitEditor,
    PanelManager,
    AboutDialog,
    ThemeCreator,
    WorkspaceSnapshots,
    LayoutPresets,
    PluginAPI,
    SettingsEditor,
  ];

  // Initialize tour
  Tour.init();

  components.forEach((Component) => {
    try {
      Component.init?.();
    } catch (error) {
      console.error(`[App] Failed to initialize ${Component.name}:`, error);
    }
  });

  // Restore persisted sidebar / panel state after init
  LayoutManager.restore();

  // Apply initial view
  const savedView = getItem(STORAGE_KEYS.ACTIVE_VIEW, 'explorer');
  eventBus.emit(EVENTS.VIEW_CHANGED, savedView);

  // Remove skeleton loading screen
  const skeleton = document.getElementById('skeleton');
  if (skeleton) {
    skeleton.classList.add('skeleton--hidden');
    setTimeout(() => skeleton.remove(), 400);
  }

  console.log(`%c VS Code Clone v1.0.0 `, 'background:#007acc;color:#fff;font-size:14px;padding:4px;border-radius:2px;');
}

// Global error boundary — catch unhandled errors and display in-app
window.addEventListener('error', (/** @type {ErrorEvent} */ e) => {
  console.error('[App] Uncaught error:', e.error || e.message);
  // Show in-app notification for runtime errors
  import('./components/notifications/notifications.js').then(({ Notifications }) => {
    Notifications.error(`Runtime error: ${(e.error && e.error.message) || e.message || 'Unknown error'}`);
  }).catch(() => {});
  e.preventDefault();
});

window.addEventListener('unhandledrejection', (/** @type {PromiseRejectionEvent} */ e) => {
  console.error('[App] Unhandled rejection:', e.reason);
  import('./components/notifications/notifications.js').then(({ Notifications }) => {
    Notifications.error(`Promise error: ${(e.reason && e.reason.message) || 'Unknown'}`);
  }).catch(() => {});
  e.preventDefault();
});

document.addEventListener('DOMContentLoaded', boot);
