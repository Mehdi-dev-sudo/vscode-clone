<div align="center">
  <br />
  <img src="https://img.shields.io/badge/status-active-success" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/stack-vanilla-orange" alt="Stack" />
  <img src="https://img.shields.io/badge/commits-200+-brightgreen" alt="Commits" />
  <img src="https://img.shields.io/badge/lines-~12K-ff69b4" alt="Lines of Code" />
  <img src="https://img.shields.io/badge/JS%20files-102-blue" alt="JavaScript Files" />
  <br />
  <br />

  # VS Code Clone

  ### A portfolio-quality Visual Studio Code clone — built from scratch with zero frameworks

  <p align="center">
    <a href="https://github.com/Mehdi-dev-sudo"><strong>Mehdi Khorshidi far</strong></a>
    &nbsp;·&nbsp;
    <a href="https://t.me/Mehdi-dev-sudo">Telegram</a>
    &nbsp;·&nbsp;
    <a href="mailto:mehdi.khorshidi9339@gmail.com">Email</a>
  </p>

  <br />
</div>

---

## Overview

**VS Code Clone** is a fully functional web-based code editor that replicates the core experience of Visual Studio Code. Built with **pure HTML, CSS, and Vanilla JavaScript (ES Modules)** — no frameworks, no build tools, no dependencies. Just open `index.html` and it works.

- **~12,000 lines of code** across **102 JavaScript modules**
- **200+ commits** with ITCSS + BEM architecture
- **Zero runtime dependencies** — not even a bundler
- **Persistent state** via localStorage

---

## Feature Status

| Category | Feature | Status |
|----------|---------|--------|
| **Core** | Activity Bar (6 views, icons, tooltips) | ✅ Real |
| | File Explorer (CRUD, rename, drag & drop, context menu) | ✅ Real |
| | Editor Tabs (open, close, pin, reorder) | ✅ Real |
| | Code Editor (line numbers, syntax highlighting, minimap, breadcrumb) | ✅ Real |
| | Minimap (retina, touch, slider, scroll sync, NaN guard) | ✅ Real |
| | Panel Manager (TERMINAL / OUTPUT / PROBLEMS / DEBUG CONSOLE) | ✅ Real |
| | Status Bar (branch, problems, encoding, theme, live info) | ✅ Real |
| **Terminal** | Multi-tab terminal with ANSI colors, command history, VFS | ✅ Real |
| **Productivity** | Command Palette (37 commands, fuzzy filter) | ✅ Real |
| | Quick Open (Ctrl+P, file search) | ✅ Real |
| | Keyboard Shortcuts (15+ shortcuts, event-bus integration) | ✅ Real |
| | Context Menus (files, folders, editor, tabs) | ✅ Real |
| | Toast Notifications (stacked, auto-dismiss, 3 levels) | ✅ Real |
| **Theming** | Theme Switching (Dark+, Light+, Dracula, Monokai) | ✅ Real |
| | Theme Creator (17 CSS variables, color picker, export/import) | ✅ Real |
| **Workspace** | Workspace Snapshots (save/restore full IDE state) | ✅ Real |
| | Layout Presets (6 presets with CSS transitions) | ✅ Real |
| | Layout Management (resizable sidebar + panel, toggles) | ✅ Real |
| **Advanced** | Settings Editor (9 settings, JSON preview, live CSS vars) | ✅ Real |
| | Plugin API (registerCommand, registerTheme, registerPanel, etc.) | ✅ Real |
| | Syntax Highlighting (two-pass tokenizer: JS, HTML, CSS) | ✅ Real |
| **Partial** | Search View (filtering is basic) | 🟡 Partial |
| | Source Control (mock UI with fake history) | 🟡 Partial |
| | Run & Debug (mock sidebar view) | 🟡 Partial |
| | Extensions View (mock marketplace cards) | 🟡 Partial |
| | Zen Mode (hides sidebar/panel) | 🟡 Partial |
| | Split Editor (interactive dividers, context menu, content sync, keyboard nav) | ✅ Real |

---

## Quick Start

```bash
git clone https://github.com/Mehdi-dev-sudo/vscode-clone.git
cd vscode-clone
# Open index.html in your browser — no build step needed
```

Or serve locally:

```bash
npx serve .
# or
python -m http.server 8000
# or
php -S localhost:8000
```

---

## Architecture

### CSS — ITCSS (Inverted Triangle)

```
Settings (variables) → Themes → Reset → Layout (grid) → Components (BEM)
```

### JS — ES Modules + Event Bus

```
app.js (boot) → Core (constants, config, shortcuts)
             → Events (EventBus pub/sub)
             → Storage (localStorage)
             → Utils (DOM, syntax, animations)
             → Features (snapshots, presets, plugin-api, settings)
             → Components (self-contained, event-driven)
```

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **Zero frameworks** | Proves deep understanding of vanilla web APIs |
| **Event Bus** | All components communicate via `eventBus.on/emit` — zero imports between components |
| **BEM + ITCSS** | Predictable specificity, scalable CSS |
| **CSS Custom Properties** | Runtime theme switching without re-render |
| **localStorage** | No backend — state persists across sessions |
| **ES Modules** | Native modularity — no bundler required |

### Project Structure

```
src/
├── app.js                    # Entry point — init sequence
├── assets/icons/             # SVG icon system (~120 icons)
├── core/                     # Constants, config, keyboard, context-menu
├── events/                   # EventBus implementation
├── storage/                  # localStorage wrapper
├── utils/                    # DOM helpers, syntax parser, animations, history
├── features/                 # Cross-cutting features
│   ├── workspace-snapshots.js
│   ├── layout-presets.js
│   ├── plugin-api.js
│   └── settings-editor.js
└── components/               # UI modules (self-contained, event-driven)
    ├── activity-bar/
    ├── sidebar/              # search, scm, debug, extensions
    ├── explorer/
    ├── tabs/
    ├── editor/               # editor, minimap, split-editor, breadcrumb, welcome
    ├── terminal/
    ├── panel/
    ├── status-bar/
    ├── command-palette/
    ├── notifications/
    ├── layout/
    ├── themes/               # theme-manager, theme-creator
    └── core/                 # about-dialog
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+P` | Quick Open |
| `Ctrl+B` | Toggle Sidebar |
| `` Ctrl+` `` | Toggle Terminal |
| `Ctrl+J` | Toggle Panel |
| `Ctrl+Shift+E` | Explorer |
| `Ctrl+Shift+F` | Search |
| `Ctrl+Shift+G` | Source Control |
| `Ctrl+Shift+D` | Run & Debug |
| `Ctrl+Shift+X` | Extensions |
| `Ctrl+W` | Close Tab |
| `Ctrl+Tab` / `Ctrl+Shift+Tab` | Next / Previous Tab |
| `Ctrl+K Z` | Zen Mode |
| `F11` | Fullscreen |
| `Ctrl+\` | Split Editor |
| `Ctrl+S` | Save (snapshot) |
| `Ctrl+Shift+S` | Save Snapshot |
| `Ctrl+Shift+R` | Restore Snapshot |

---

## Themes

| Theme | Description |
|-------|-------------|
| **Dark+** (default) | VS Code iconic dark theme |
| **Light+** | Clean light theme |
| **Dracula** | Dark purple theme |
| **Monokai** | Classic monokai |
| **Custom** | Create your own with Theme Creator |

Use the **Theme Creator** (`Ctrl+Shift+P` → "Theme Creator") to:
- Edit 17 CSS variables in real time
- Export/import `.theme` files
- Persist custom themes to localStorage

---

## Plugin API

The built-in Plugin API lets you extend the editor at runtime:

- `registerCommand(id, label, handler)` — Add commands to the palette
- `registerTheme(id, label, variables)` — Add custom themes
- `registerPanel(id, label, renderFn)` — Add panel tabs
- `registerSidebar(id, label, icon, renderFn)` — Add sidebar views
- `registerStatusItem(id, label, getText)` — Add status bar items

Sample plugins included in `src/plugins/`:
- **Hello World** — demonstrates all 5 API methods
- **Date Preview** — shows current date in status bar + command

---

## Roadmap

### Done ✅
- [x] Core architecture (ITCSS, Event Bus, ES Modules, localStorage)
- [x] Activity Bar with 6 views
- [x] File Explorer — full CRUD, drag & drop, rename
- [x] Code Editor — syntax highlighting, minimap, breadcrumb, line numbers
- [x] Terminal — multi-tab, ANSI colors, VFS commands
- [x] Panel Manager — OUTPUT, PROBLEMS, DEBUG CONSOLE
- [x] Command Palette (37 commands) + Quick Open
- [x] Theme Creator — real-time color editing, export/import
- [x] Workspace Snapshots — save/restore full IDE state
- [x] Layout Presets — 6 presets with smooth transitions
- [x] Settings Editor — 9 real settings, JSON preview
- [x] Plugin API — extend at runtime
- [x] Keyboard shortcuts + focus management
- [x] Toast Notifications + Context Menus

### In Progress 🔧
- [ ] Split Editor — independent pane content, drag-between-panes
- [ ] Multi Cursor — simultaneous editing at all cursors
- [ ] Search View — search across workspace files

### Planned 📋
- [ ] Live Preview — HTML/CSS live reload
- [ ] Drag & Drop from OS
- [ ] Keyboard Shortcuts Customization UI
- [ ] Workspace Switching
- [ ] File watcher simulation

---

## Connect

<p align="center">
  <a href="mailto:mehdi.khorshidi9339@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
  <a href="https://github.com/Mehdi-dev-sudo"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
  <a href="https://t.me/Mehdi-dev-sudo"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" /></a>
</p>

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>
    Built by <a href="https://github.com/Mehdi-dev-sudo">Mehdi Khorshidi far</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/Mehdi-dev-sudo/vscode-clone">GitHub</a>
    &nbsp;·&nbsp;
    Portfolio project — no frameworks, no shortcuts
  </p>
</div>
