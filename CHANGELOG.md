# Changelog

All notable changes to this project will be documented in this file.

## [1.7.0] - 2026-06-13
### Added
- C-style language support: comments now fold in C, C++, Java, C#, and Rust
  files, alongside the existing Python and JSDoc support. These languages share
  one comment grammar, so a single folding provider handles them all: it folds
  block comments (`/* ... */`, which covers doc variants `/** */` and `/*! */`)
  and runs of two or more consecutive line comments (`//`, including `///` and
  `//!`); single-line block comments, a lone line comment, or one trailing code
  on the same line are left alone. Added via activation events and
  context-menu/keybinding entries for the `c`, `cpp`, `java`, `csharp`, and
  `rust` languages.

## [1.6.1] - 2026-06-13
### Changed
- Modernized the development toolchain (no change to extension behavior):
  - Replaced the deprecated `vscode` dev dependency with `@types/vscode` and
    `@types/node`, removing the `postinstall` step and clearing all known
    `npm audit` vulnerabilities.
  - Added a `.vscodeignore` so the published package ships only the compiled
    extension, icon, and docs — no sources, fixtures, or configs.
  - Added `repository`, `bugs`, `homepage`, `license`, `categories`, and
    `keywords` to the manifest for the marketplace listing.
  - Added an ESLint flat config and a `lint` script, and a GitHub Actions
    workflow running lint and compile on pushes and pull requests.

## [1.6.0] - 2026-06-13
### Added
- New setting `collapseDocs.autoCollapseOnOpen` (default `false`), requested by
  users. When enabled, documentation blocks are collapsed automatically the
  first time a supported file is opened. Switching back to an already-open tab
  does not re-collapse, so manually expanded docs stay expanded.
  - Known limitation: the collapse happens a brief moment after the file appears
    and can feel slightly abrupt. VS Code renders the file first and computes its
    folding regions asynchronously afterwards; the extension waits for that model
    before folding, because folding earlier would collapse the wrong region (for
    example a whole function). There is no editor API to fold before the first
    paint, so this small delay is expected.

## [1.5.0] - 2026-06-07
### Added
- After collapsing, the editor keeps the line you were on centered in view, so
  the file no longer appears to jump as the hidden content shifts upward.
### Changed
- Hiding the fold highlight on collapsed doc lines is now opt-out and reversible.
  A new setting `collapseDocs.hideFoldingHighlight` (default `true`) controls it;
  while enabled the extension keeps `editor.foldingHighlight` off and restores
  your previous value when it is disabled. The write is guarded so it can never
  break activation. Set the setting to `false` to keep the highlight.
### Fixed
- The first **Toggle Collapse Docs** after opening a file now collapses every
  doc block. VS Code builds its folding model asynchronously, so the initial
  fold previously ran before the model existed and left some or all blocks
  expanded; only a second toggle worked. The folding provider now signals when
  VS Code has queried it, and folding waits for that signal instead of guessing.
  If the model never becomes ready, the toggle now does nothing rather than
  fold the wrong region.
- Toggling no longer folds into the wrong file if you switch tabs while the
  folding model is still being prepared.
- The toggle now only acts on regular files on disk, matching where the folding
  providers are registered; diff and preview editors no longer risk folding the
  wrong region.
- Fold tracking now follows the file as you edit, so toggling still collapses
  and expands correctly after changes above a collapsed block.
- Reopening a previously collapsed file no longer mis-toggles: remembered fold
  state is dropped when a document closes.

## [1.4.1] - 2026-06-01 
### Added
- Support for JSDoc folding in JSX (`.jsx`) and TSX (`.tsx`) files.
- New **Toggle Collapse Docs** command with a default `Ctrl+Shift+Alt+D` keybinding.
- No need to change in settings color of hided lines highlight. It's done automatically.
- Fixed several bugs.
- Improved performence.
- Removed unnecessary functionalities:
  - Collapse/uncollapse context menu buttons. <- With toggle functionlity those are not needed.
  - Generating JsDocs <- Not really needed, thousands of extensions will do it way better.
  - Generating function in module.export = {} <- Created only for one very specific legacy project, not needed anymore.

## [1.3.0] - 2025-05-20
### Added
- New context menu command: **Generate JSDoc for Function**
  - Automatically analyzes the function under the cursor
  - Inserts a well-formatted JSDoc block with `@param`, `@returns`, and `@example`
  - Supports destructured parameters with default values (e.g. `options = {}`)

- New context menu command: **Export Selected Function**
  - Automatically scans for functions in the file
  - Updates or appends missing entries to the `module.exports` block
  - Preserves comment formatting and export order

## [1.2.0] - 2025-05-12
### Added
- Initial support for **JavaScript** and **TypeScript** JSDoc folding
- Folding range providers for:
  - Python docstrings (`"""` / `'''`)
  - JSDoc comments (`/** */`)
- Context menu options to collapse or uncollapse all doc comments

## [1.1.0] - 2025-05-11
### Initial release
- Basic structure with Python docstring collapsing
- Command palette support
