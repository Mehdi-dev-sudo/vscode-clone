const fs = require('fs');
const path = require('path');
const files = [
  'src/app.js', 'src/core/constants.js', 'src/events/event-bus.js',
  'src/core/keyboard-shortcuts.js', 'src/storage/local-storage.js',
  'src/utils/dom.js', 'src/utils/tour.js', 'src/utils/syntax.js',
  'src/assets/icons/codicons.js',
  'src/components/activity-bar/activity-bar.js',
  'src/components/sidebar/sidebar.js', 'src/components/sidebar/search-view.js',
  'src/components/explorer/explorer.js',
  'src/components/editor/editor.js', 'src/components/editor/split-editor.js',
  'src/components/editor/multi-cursor.js', 'src/components/editor/welcome-page.js',
  'src/components/editor/minimap.js',
  'src/components/tabs/tabs.js', 'src/components/tabs/tabs-context-menu.js',
  'src/components/terminal/terminal.js', 'src/components/status-bar/status-bar.js',
  'src/components/command-palette/command-palette.js',
  'src/components/themes/theme-manager.js', 'src/components/themes/theme-creator.js',
  'src/components/notifications/notifications.js',
  'src/components/panel/panel-manager.js', 'src/components/core/about-dialog.js',
  'src/features/workspace-snapshots.js', 'src/features/layout-presets.js',
  'src/features/settings-editor.js', 'src/features/plugin-api.js',
  'src/components/layout/layout-manager.js', 'src/core/focus-manager.js',
  'src/core/context-menu.js',
];
const root = 'C:\\Users\\ASUS\\Desktop\\Code Editor';
let errors = [];
for (const f of files) {
  try {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) { errors.push({ file: f, error: 'NOT FOUND' }); continue; }
    const code = fs.readFileSync(p, 'utf-8');
    const stripped = code.replace(/import\s+.*?from\s+['"].*?['"];?/gs, '')
                         .replace(/export\s+(default\s+)?/g, '');
    try { new Function(stripped); } catch (e) {
      errors.push({ file: f, error: e.message });
    }
  } catch (e) {
    errors.push({ file: f, error: e.message });
  }
}
if (errors.length === 0) console.log('OK: NO SYNTAX ERRORS');
else errors.forEach(e => console.log('ERROR: ' + e.file + ' => ' + e.error));
