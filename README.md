# Collapse Docs

**Collapse Docs** is a lightweight extension that adds a right-click context menu option to toggle the visibility of all Python docstrings and JavaScript/TypeScript JSDoc blocks in the editor.

## Features

- Adds a context menu entry in the editor:
  - `Toggle Collapse Docs`
- Automatically detects and folds:
  - Python docstrings using triple quotes (`'''` or `"""`)
  - JSDoc comments using `/** ... */` in JavaScript, TypeScript, JSX, and TSX files
- Helps improve code readability by hiding large documentation blocks
- Toggles supported doc blocks between collapsed and expanded states with one command
- Keeps the line you were on centered after collapsing, so the view does not jump
- Optionally collapses docs automatically when you open a file (off by default — see [Settings](#settings))
- Hides VS Code's folding highlight on collapsed doc lines so they blend in (opt-out — see [Settings](#settings))

## What's New

### 1.6.0

- **Auto-collapse on open (opt-in)** — a user-requested option: enable `collapseDocs.autoCollapseOnOpen` to have docs collapse automatically the first time you open a supported file. Off by default; see [Settings](#settings) for the behavior and a note on timing.

### 1.5.0

- **Reliable first toggle** — collapsing now folds every doc block on the first command after a file opens. Previously the first toggle could leave some or all blocks expanded, and only a second toggle worked.
- **Stable viewport** — the line you were on stays centered after collapsing, so the file no longer appears to jump as hidden content shifts upward.

See [CHANGELOG.md](CHANGELOG.md) for the full history.

## Supported Languages

- Python (`.py`)
- JavaScript (`.js`, `.jsx`)
- TypeScript (`.ts`, `.tsx`)

## How to Use

1. Open any `.py`, `.js`, `.jsx`, `.ts`, or `.tsx` file in the editor.
2. Right-click anywhere in the editor.
3. Choose **Toggle Collapse Docs** - collapses docs when open and unfolds them when already collapsed.

The default keyboard shortcut for `Toggle Collapse Docs` is `Ctrl+Shift+Alt+D`.

Alternatively, use the command palette (`Ctrl+Shift+P`) and run:
- `Toggle Collapse Docs`

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `collapseDocs.hideFoldingHighlight` | `true` | Hide VS Code's folding highlight on collapsed lines so doc blocks blend in. While enabled, the extension keeps `editor.foldingHighlight` off and restores your previous value when it is disabled. Set to `false` to keep the highlight. |
| `collapseDocs.autoCollapseOnOpen` | `false` | Collapse documentation blocks automatically the first time a supported file is opened. Switching back to an already-open tab does not re-collapse, so docs you expand by hand stay expanded. |

> **Note:** with auto-collapse on, docs collapse a brief moment *after* the file
> appears, which can feel slightly abrupt. This is expected: VS Code renders the
> file first and computes its folding regions asynchronously afterwards, and the
> extension waits for that model before folding (folding earlier would collapse
> the wrong region, such as a whole function). No editor API allows folding
> before the first paint.

### Acknowledgments 🎉
A huge thank you to [Trishan Preet Singh](https://www.linkedin.com/in/007-tripi-wick/) for collaborating! This is the first open-source collaboration for this project, and I am extremely grateful. Trishan shed new light on the it with his excellent fixes and additions. Thank you! 🤜🤛