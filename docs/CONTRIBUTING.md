# Contributing

We love contributions! Here's how to help:

## Code Style

- **HTML** — Semantic elements, ARIA attributes
- **CSS** — BEM naming, ITCSS layers, CSS variables
- **JS** — ES Modules, JSDoc comments, no global state

## Architecture Rules

1. No frameworks (React, Vue, Angular, etc.)
2. No CSS frameworks (Bootstrap, Tailwind, etc.)
3. Components communicate via event bus only
4. Every file must have JSDoc
5. No magic numbers — use constants
6. No hardcoded strings — use constants

## PR Process

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Test in browser (open `index.html`)
5. Commit with conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`
6. Push and open a PR

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/vscode-clone.git
cd vscode-clone
# Open index.html in browser
```

No build tools required.
