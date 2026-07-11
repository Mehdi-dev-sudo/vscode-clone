/**
 * @fileoverview
 * Main application entry point.
 * Initializes core services, loads persisted state, and boots all components.
 * This is the only place where component initialization order is defined.
 */

import { eventBus } from './events/event-bus.js';
import { getItem, setItem } from './storage/local-storage.js';
import { STORAGE_KEYS, THEMES } from './core/constants.js';
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
  eventBus.emit('view:changed', savedView);

  console.log(`%c VS Code Clone v1.0.0 `, 'background:#007acc;color:#fff;font-size:14px;padding:4px;border-radius:2px;');
}

document.addEventListener('DOMContentLoaded', boot);
