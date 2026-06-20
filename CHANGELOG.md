# Changelog

All notable changes to this project will be documented in this file.

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
