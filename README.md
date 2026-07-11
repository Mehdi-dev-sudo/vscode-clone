<div align="center">
  <br />
  <img src="https://img.shields.io/badge/status-active-success" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/build-vanilla-orange" alt="Build" />
  <br />
  <br />

  # VS Code Clone

  ### A portfolio-quality Visual Studio Code inspired web application

  <p align="center">
    Built with <strong>zero frameworks</strong> — pure HTML, CSS, and Vanilla JavaScript (ES Modules)
  </p>

  <br />

  ![VS Code Clone Preview](https://via.placeholder.com/800x450/1e1e1e/007acc?text=VS+Code+Clone)

  <br />
</div>

## ✨ Features

| Feature | Status |
|---------|--------|
| **Activity Bar** with view switching | ✅ |
| **Explorer** with file tree (CRUD, drag-drop, context menu) | ✅ |
| **Search** with live filtering | ✅ |
| **Source Control** (Git mock) | ✅ |
| **Run & Debug** (mock debugger) | ✅ |
| **Extensions Marketplace** | ✅ |
| **Editor Tabs** (open, close, pin, reorder) | ✅ |
| **Editor** with line numbers, breadcrumb, minimap | ✅ |
| **Terminal** with multiple tabs & command execution | ✅ |
| **Status Bar** (branch, problems, encoding, theme) | ✅ |
| **Command Palette** (Ctrl+Shift+P) | ✅ |
| **Quick Open** (Ctrl+P) | ✅ |
| **Theme Switching** (Dark+, Light+, Dracula, Monokai) | ✅ |
| **Context Menus** (right-click on files) | ✅ |
| **Toast Notifications** | ✅ |
| **Zen Mode** | ✅ |
| **Fullscreen Mode** | ✅ |
| **Resizable Panels** (sidebar + terminal) | ✅ |
| **Keyboard Shortcuts** | ✅ |
| **Persistence** (localStorage) | ✅ |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vscode-clone.git

# Open index.html in your browser
# That's it — no build tools, no dependencies
```

Or serve with any HTTP server:

```bash
npx serve .
# or
python -m http.server 8000
```

## 🏗 Architecture

```
ITCSS (CSS Architecture)      ES Modules (JS Architecture)
├── Settings (variables)      ├── Core (constants, bus)
├── Themes                    ├── Events (pub/sub)
├── Reset                     ├── Storage (localStorage)
├── Layout                    ├── Utils (DOM helpers)
└── Components (BEM)          └── Components (modules)
```

All components communicate through an **event bus** — no direct references, no global state.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command Palette |
| `Ctrl+P` | Quick Open |
| `Ctrl+B` | Toggle Sidebar |
| `Ctrl+\`` | Toggle Terminal |
| `Ctrl+Shift+E` | Explorer |
| `Ctrl+Shift+F` | Search |
| `Ctrl+Shift+G` | Source Control |
| `Ctrl+Shift+D` | Run & Debug |
| `Ctrl+Shift+X` | Extensions |
| `Ctrl+W` | Close Tab |
| `Ctrl+K Z` | Zen Mode |
| `F11` | Fullscreen |

## 🎨 Themes

- **Dark+** (default) — VS Code's iconic dark theme
- **Light+** — Clean light theme
- **Dracula** — Dark purple theme
- **Monokai** — Classic monokai

## 🗺 Roadmap

- [x] Core architecture & layout
- [x] Activity Bar & Sidebar views
- [x] File Explorer with CRUD
- [x] Editor with tabs
- [x] Terminal emulator
- [x] Command Palette & Quick Open
- [x] Themes & persistence
- [ ] **Split Editor** — Side-by-side editing
- [ ] **Syntax Highlighting** — Code tokenization
- [ ] **Settings Editor** — JSON settings UI
- [ ] **Multi Cursor Simulation**
- [ ] **Drag & Drop from OS**
- [ ] **Live Preview** — HTML/CSS live reload
- [ ] **Workspace Switching**
- [ ] **Keyboard Shortcuts Customization**

## 🤝 Contributing

Contributions are what make the open source community amazing.  
Check out [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>If this project helped you, consider giving it a ⭐</p>
  <p>Built with ❤️ and zero frameworks</p>
</div>
