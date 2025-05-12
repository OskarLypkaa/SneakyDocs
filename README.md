# Sneaky Docs

**Sneaky Docs** is a lightweight extension that adds right-click context menu options to collapse or uncollapse all Python docstrings and JavaScript/TypeScript JSDoc blocks in the editor.

## Features

- Adds two context menu entries in the editor:
  - `Collapse All Docstrings / JSDoc`
  - `Uncollapse All Docstrings / JSDoc`
- Automatically detects and folds:
  - Python docstrings using triple quotes (`'''` or `"""`)
  - JSDoc comments using `/** ... */` in JavaScript and TypeScript files
- Helps improve code readability by hiding large documentation blocks

## Supported Languages

- Python (`.py`)
- JavaScript (`.js`)
- TypeScript (`.ts`)

## How to Use

1. Open any `.py`, `.js`, or `.ts` file in the editor.
2. Right-click anywhere in the editor.
3. Choose either:
   - **Collapse All Docstrings / JSDoc**
   - **Uncollapse All Docstrings / JSDoc**

Alternatively, use the command palette (`Ctrl+Shift+P`) and run:
- `Collapse All Docstrings / JSDoc`
- `Uncollapse All Docstrings / JSDoc`

## Recommended Settings

To improve the visual appearance of folded regions (e.g., make them better match dark themes), consider adding this to your `settings.json`:

```json
{
  "workbench.colorCustomizations": {
      "editor.foldBackground": "#00000000" 
  }
}