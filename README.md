# Python Docstring Folder

**Python Docstring Folder** is a lightweight extension that adds right-click context menu options to collapse or uncollapse all docstrings in a Python file.

## Features

- Adds two context menu entries in the editor:
  - `Collapse All Docstrings`
  - `Uncollapse All Docstrings`
- Automatically detects and folds all Python docstrings using triple quotes (`'''` or `"""`).
- Useful for improving code readability by hiding docstring blocks when not needed.

## How to Use

1. Open any `.py` file in the editor.
2. Right-click anywhere inside the file.
3. Choose either:
   - **Collapse All Docstrings**
   - **Uncollapse All Docstrings**

## Recommended Settings

To improve the visual appearance of folded regions (e.g., make them less intrusive or better match dark themes), it's recommended to add the following to your `settings.json`:

```json
"workbench.colorCustomizations": {
    "editor.foldBackground": "#1e1e1e"
}
