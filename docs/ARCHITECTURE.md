# Architecture

## Overview

VS Code Clone is built entirely with vanilla HTML, CSS, and JavaScript (ES Modules).  
No frameworks, no build tools, no external dependencies.

## Principles

- **Modularity** — Every feature is a self-contained ES module.
- **Decoupling** — Components communicate via an event bus.
- **ITCSS + BEM** — Scalable, maintainable CSS architecture.
- **Persistence** — User preferences stored in `localStorage`.
- **Accessibility** — Semantic HTML, ARIA attributes, keyboard navigation.

## Folder Structure

```
src/
  assets/          - Static assets (icons)
  components/      - UI components (activity-bar, sidebar, editor, terminal, etc.)
  core/            - Core systems (constants, keyboard shortcuts, context menu)
  events/          - Event bus (pub/sub)
  storage/         - localStorage abstraction
  styles/          - ITCSS layers (variables, themes, reset, layout, components)
  utils/           - Reusable DOM helpers
docs/              - Documentation
```

## Component Architecture

Each component is an ES module that exports an object with `init()` and optional lifecycle methods.

Components never reference each other directly. Instead, they:
1. Emit events via `eventBus.emit()`
2. Listen for events via `eventBus.on()`

## Data Flow

```
User Action → Keyboard/Click → Event Bus → Component Handlers → DOM Update
```

## CSS Architecture (ITCSS)

1. **Settings** — Variables, design tokens
2. **Themes** — Theme-specific overrides
3. **Reset** — Normalize browser defaults
4. **Layout** — Grid-based app layout
5. **Components** — BEM-scoped component styles
