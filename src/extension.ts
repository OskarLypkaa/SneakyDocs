import * as vscode from 'vscode';

let foldedLines = new Set<string>();
const docstringCache = new Map<string, vscode.FoldingRange[]>();
let hideDecoration: vscode.TextEditorDecorationType;

export function activate(context: vscode.ExtensionContext) {
	console.log('CollapseDocs activated');

	hideDecoration = vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor('editor.background'),
		isWholeLine: true
	});

	// Python docstring folding provider
	const pythonProvider: vscode.FoldingRangeProvider = {
		provideFoldingRanges(document: vscode.TextDocument): vscode.FoldingRange[] {
			if (document.languageId !== 'python') return [];

			const text = document.getText();
			const ranges: vscode.FoldingRange[] = [];
			const docstringRegex = /("""|''')([\s\S]*?)(\1)/g;

			let match: RegExpExecArray | null;
			while ((match = docstringRegex.exec(text))) {
				const start = document.positionAt(match.index).line;
				const end = document.positionAt(match.index + match[0].length).line;
				if (end > start) {
					ranges.push(new vscode.FoldingRange(start, end));
				}
			}

			docstringCache.set(document.uri.toString(), ranges);
			return ranges;
		}
	};

	// JSDoc folding provider
	const jsdocProvider: vscode.FoldingRangeProvider = {
		provideFoldingRanges(document: vscode.TextDocument): vscode.FoldingRange[] {
			if (!['javascript', 'typescript'].includes(document.languageId)) return [];

			const text = document.getText();
			const ranges: vscode.FoldingRange[] = [];
			const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;

			let match: RegExpExecArray | null;
			while ((match = jsdocRegex.exec(text))) {
				const start = document.positionAt(match.index).line;
				const end = document.positionAt(match.index + match[0].length).line;
				if (end > start) {
					ranges.push(new vscode.FoldingRange(start, end));
				}
			}

			docstringCache.set(document.uri.toString(), ranges);
			return ranges;
		}
	};

	context.subscriptions.push(
		vscode.languages.registerFoldingRangeProvider({ language: 'python', scheme: 'file' }, pythonProvider),
		vscode.languages.registerFoldingRangeProvider(
			[{ language: 'javascript', scheme: 'file' }, { language: 'typescript', scheme: 'file' }],
			jsdocProvider
		)
	);

	// Collapse command
	const foldCommand = vscode.commands.registerCommand('collapseDocs.run', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const lang = editor.document.languageId;
		if (!['python', 'javascript', 'typescript'].includes(lang)) return;

		const docUri = editor.document.uri.toString();
		const ranges = docstringCache.get(docUri) ?? [];

		const decorations: vscode.DecorationOptions[] = [];

		for (const range of ranges) {
			const key = `${docUri}:${range.start}`;
			if (foldedLines.has(key)) continue;

			const pos = new vscode.Position(range.start, 0);
			editor.selection = new vscode.Selection(pos, pos);
			await vscode.commands.executeCommand('editor.fold');

			const lineText = editor.document.lineAt(range.start).text;
			decorations.push({
				range: new vscode.Range(range.start, 0, range.start, lineText.length)
			});

			foldedLines.add(key);
		}

		editor.setDecorations(hideDecoration, decorations);
	});

	// Unfold command
	const unfoldCommand = vscode.commands.registerCommand('collapseDocs.unfold', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const lang = editor.document.languageId;
		if (!['python', 'javascript', 'typescript'].includes(lang)) return;

		await vscode.commands.executeCommand('editor.unfoldAll');
		editor.setDecorations(hideDecoration, []);
		foldedLines.clear();
	});

	context.subscriptions.push(foldCommand, unfoldCommand);
}

export function deactivate() {
	if (hideDecoration) {
		hideDecoration.dispose();
	}
}
