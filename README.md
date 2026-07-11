<div align="center">
  <br />
  <img src="https://img.shields.io/badge/status-active-success" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/build-vanilla-orange" alt="Build" />
  <img src="https://img.shields.io/badge/commits-30+-brightgreen" alt="Commits" />
  <img src="https://img.shields.io/badge/lines-~10K-ff69b4" alt="Lines of Code" />
  <br />
  <br />

  # VS Code Clone

  ### A portfolio-quality Visual Studio Code inspired web application

  <p align="center">
    Built with <strong>zero frameworks</strong> — pure HTML, CSS, and Vanilla JavaScript (ES Modules) <br />
    <a href="https://github.com/Mehdi-dev-sudo"><strong>By Mehdi Khorshidi far</strong></a>
  </p>

  <br />

  ![VS Code Clone Preview](https://via.placeholder.com/800x450/1e1e1e/007acc?text=VS+Code+Clone)

  <br />
</div>

---

```javascript
const developer = {
  name: "Mehdi Khorshidi far",
  github: "Mehdi-dev-sudo",
  email: "mehdi.khorshidi9339@gmail.com",
  telegram: "@Mehdi-dev-sudo",

  skills: {
    frontend: ["HTML5", "CSS3", "JavaScript ES6+"],
    scripting: ["Bash"],
    tools: ["Git", "VS Code", "Kali Linux", "Figma"],
    learning: ["TypeScript", "React"],
  },

  currentFocus: "Building interactive web experiences",

  sayHi() {
    return "Always learning. Always building.";
  },
};

console.log(developer.sayHi());
```

---

## 📋 Honest Feature Status

| Feature | Status | Details |
|---------|--------|---------|
| **Activity Bar** with view switching | ✅ **Real** | 6 views with icons, active state, tooltips |
| **File Explorer** | ✅ **Real** | CRUD, rename, drag & drop, context menu, collapse/expand |
| **Editor Tabs** | ✅ **Real** | Open, close, pin, reorder, close others, close all |
| **Editor** | ✅ **Real** | Line numbers, minimap, breadcrumb, welcome screen |
| **Minimap** | ✅ **Real** | Retina support, touch, slider, scroll sync |
| **Syntax Highlighting** | ✅ **Real** | Two-pass tokenizer — JS, HTML, CSS keywords, strings, comments |
| **Terminal Emulator** | ✅ **Real** | Multi-tab, ANSI colors, command history, VFS (cd/ls/mkdir/cat/echo/clear) |
| **Panel Manager** | ✅ **Real** | TERMINAL / OUTPUT / PROBLEMS / DEBUG CONSOLE switching |
| **Command Palette** | ✅ **Real** | Ctrl+Shift+P, fuzzy filter, multi-action |
| **Status Bar** | ✅ **Real** | Branch, problems count, encoding, theme, live info |
| **Theme Switching** | ✅ **Real** | Dark+, Light+, Dracula, Monokai — CSS custom properties |
| **Context Menus** | ✅ **Real** | Right-click on files, folders, editor, tabs |
| **Toast Notifications** | ✅ **Real** | Stacked, auto-dismiss, info/warn/error |
| **Keyboard Shortcuts** | ✅ **Real** | 15+ shortcuts with event-bus integration |
| **Persistence** | ✅ **Real** | localStorage — tabs, themes, explorer state, layout |
| **Layout Management** | ✅ **Real** | Resizable sidebar + panel, show/hide toggles |
| **Search View** | 🟡 **Partial** | UI renders, filtering is basic |
| **Source Control** | 🟡 **Partial** | Mock UI with fake commit history |
| **Run & Debug** | 🟡 **Partial** | Mock sidebar view with debug controls |
| **Extensions View** | 🟡 **Partial** | Mock marketplace cards |
| **Quick Open** | 🟡 **Partial** | Ctrl+P, basic file search |
| **Zen Mode** | 🟡 **Partial** | Hides sidebar/panel, no animation |
| **Split Editor** | 🔵 **Mock** | Visual shell — no independent panes yet |
| **Theme Creator** | ✅ **Real** | Real-time color editor, 17 CSS variables, save/load |
| **Workspace Snapshots** | ✅ **Real** | Save/restore full IDE state (tabs, layout, theme) |
| **Layout Presets** | ✅ **Real** | 6 preset layouts (Editor Focus, Terminal Max, Minimal, etc.) |
| **Multi Cursor** | 🟡 **Partial** | Single key binding, no visual feedback |
| **Settings Editor** | 🔵 **Mock** | Not started |
| **Drag & Drop from OS** | 🔵 **Mock** | Not started |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Mehdi-dev-sudo/vscode-clone.git

# Open index.html in your browser
# That's it — no build tools, no dependencies
```

Or serve with any HTTP server:

```bash
npx serve .
# or
python -m http.server 8000
```

---

## 🏗 Architecture

```
ITCSS (CSS Architecture)      ES Modules (JS Architecture)
├── Settings (variables)      ├── Core (constants, event bus)
├── Themes                    ├── Events (EventBus pub/sub)
├── Reset                     ├── Storage (localStorage wrapper)
├── Layout (grid)             ├── Utils (DOM, syntax, animations)
└── Components (BEM)          └── Components (self-contained modules)
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Zero frameworks** | Portfolio proof — shows deep understanding of vanilla web APIs |
| **Event Bus** | All components communicate through `eventBus.on` / `eventBus.emit` — no imports between components |
| **BEM + ITCSS** | Scalable CSS architecture with predictable specificity |
| **CSS Custom Properties** | Theme system uses `--var-name` for instant runtime switching |
| **localStorage** | No backend needed — state persists across sessions |
| **ES Modules** | Native module system — no bundler required |

### Project Structure

```
src/
├── app.js                      # Entry point — boot order
├── assets/                     # Icons (SVG), images
├── core/                       # Constants, config, shortcuts, focus
├── events/                     # EventBus implementation
├── storage/                    # localStorage wrapper
├── utils/                      # DOM helpers, syntax parser, tour, etc.
├── features/                   # Cross-cutting features
│   ├── workspace-snapshots.js
│   └── layout-presets.js
└── components/                 # UI components
    ├── activity-bar/
    ├── sidebar/ (search, scm, debug, extensions)
    ├── explorer/
    ├── tabs/
    ├── editor/ (editor, minimap, split-editor)
    ├── terminal/
    ├── panel/
    ├── status-bar/
    ├── command-palette/
    ├── notifications/
    ├── layout/
    ├── themes/ (theme-manager, theme-creator)
    └── core/ (about-dialog)
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+P` | Quick Open |
| `Ctrl+B` | Toggle Sidebar |
| `Ctrl+`` ` | Toggle Terminal |
| `Ctrl+Shift+E` | Explorer |
| `Ctrl+Shift+F` | Search |
| `Ctrl+Shift+G` | Source Control |
| `Ctrl+Shift+D` | Run & Debug |
| `Ctrl+Shift+X` | Extensions |
| `Ctrl+W` | Close Tab |
| `Ctrl+Tab` | Next Tab |
| `Ctrl+Shift+Tab` | Previous Tab |
| `Ctrl+K Z` | Zen Mode |
| `F11` | Fullscreen |
| `Ctrl+J` | Toggle Panel |
| `Ctrl+\` | Split Editor |

---

## 🎨 Themes

| Theme | Preview |
|-------|---------|
| **Dark+** (default) | VS Code iconic dark theme |
| **Light+** | Clean light theme |
| **Dracula** | Dark purple theme |
| **Monokai** | Classic monokai |
| **Custom** | Create your own with Theme Creator |

---

## 🗺 Roadmap

### Done ✅
- [x] Core architecture & layout (ITCSS, Event Bus, ES Modules)
- [x] Activity Bar with 6 views
- [x] File Explorer with full CRUD + Drag & Drop
- [x] Editor with syntax highlighting, minimap, breadcrumb, line numbers
- [x] Terminal with multi-tab + VFS command execution
- [x] Panel Manager (OUTPUT, PROBLEMS, DEBUG CONSOLE)
- [x] Command Palette + Quick Open
- [x] 4 themes + Theme Creator (custom colors)
- [x] Workspace Snapshots + Layout Presets
- [x] Toast Notifications + Context Menus
- [x] Keyboard shortcuts + focus management
- [x] Persistence (localStorage)

### In Progress 🔧
- [ ] **Split Editor** — Independent pane content, divider resize, drag-between-panes
- [ ] **Settings Editor** — JSON settings UI
- [ ] **Multi Cursor** — Visual feedback, keyboard-driven

### Planned 📋
- [ ] **Live Preview** — HTML/CSS live reload
- [ ] **Drag & Drop from OS**
- [ ] **Keyboard Shortcuts Customization**
- [ ] **Plugin API mock**
- [ ] **Workspace Switching**

---

## 🏆 GitHub Achievements

This project is designed to help earn these GitHub achievements:

### Pull Shark 🦈
Merge **32+ PRs in a single day**. Strategy:
1. Create small branches for individual fixes
2. Open PRs sequentially using `gh pr create`
3. Merge each with `gh pr merge`
4. Each PR counts toward the 32 needed

### Pair Extraordinaire 👥
Add `Co-authored-by: Name <email>` in commit messages.
```
Co-authored-by: Mehdi Khorshidi far <mehdi.khorshidi9339@gmail.com>
```

### Quickdraw ⚡
Have a **PR merged within 5 minutes of opening**.
- Prepare a tiny fix branch
- Open PR and immediately merge

### YOLO 🚀
**Merge a PR without review** — use `gh pr merge --merge` without any review.
⚠️ Use on trivial changes only (typo fixes, readme updates).

---

## 📬 Connect

<p align="center">
  <a href="mailto:mehdi.khorshidi9339@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>
  <a href="https://github.com/Mehdi-dev-sudo"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
  <a href="https://t.me/Mehdi-dev-sudo"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" /></a>
</p>

---

## 🤝 Contributing

Contributions are what make the open source community amazing.
Check out [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>If this project helped you, consider giving it a ⭐</p>
  <p>
    Built with ❤️ and zero frameworks by
    <a href="https://github.com/Mehdi-dev-sudo">Mehdi Khorshidi far</a>
  </p>
  <p>
    <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer"/>
  </p>
</div>
