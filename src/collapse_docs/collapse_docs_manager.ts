import * as vscode from 'vscode';
import { DocFoldingProvider } from './providers/doc_folding_provider';
import { TextDocumentManager } from './text_document_manager';

export class CollapseDocsManager implements vscode.Disposable {
    private readonly hideDecoration: vscode.TextEditorDecorationType;
    private readonly providers: DocFoldingProvider[];
    private readonly textDocs: TextDocumentManager;

    constructor(providers: DocFoldingProvider[], textDocs: TextDocumentManager) {
        this.providers = providers;
        this.textDocs = textDocs;
        this.hideDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: new vscode.ThemeColor('editor.background'),
            isWholeLine: true
        });
    }

    dispose() {
        this.hideDecoration.dispose();
    }

    async toggleDocs() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const provider = this.getActiveProvider(editor);
        if (!provider) return;

        const ranges = provider.provideFoldingRanges(editor.document);
        if (this.areDocsFolded(editor.document, ranges)) {
            await this.unfoldDocs(editor, ranges);
        } else {
            await this.collapseDocsRun(editor, provider, ranges);
        }
    }

    forgetDocument(document: vscode.TextDocument) {
        this.textDocs.forget(document.uri.toString());
        for (const provider of this.providers) {
            provider.forgetDocument(document);
        }
    }

    private async collapseDocsRun(editor: vscode.TextEditor, provider: DocFoldingProvider, ranges: vscode.FoldingRange[]) {
        const docUri = editor.document.uri.toString();
        const linesToFold = ranges
            .map(range => range.start)
            .filter(line => !this.textDocs.isFolded(docUri, line));

        if (linesToFold.length === 0) return;

        const anchorLine = editor.selection.active.line;
        if (!(await this.tryFoldLines(editor, provider, linesToFold))) return;

        this.textDocs.markFolded(docUri, linesToFold);
        this.applyHideDecorations(editor, ranges);
        this.keepLineCentered(editor, anchorLine);
    }

    private async tryFoldLines(editor: vscode.TextEditor, provider: DocFoldingProvider, linesToFold: number[]): Promise<boolean> {
        const ready = await Promise.race([
            provider.whenModelReady(editor.document).then(() => true),
            this.delay(2000).then(() => false)
        ]);
        await this.delay(50);

        if (!ready) {
            console.warn('Collapse Docs: folding model was not ready in time; skipping fold');
            return false;
        }
        if (vscode.window.activeTextEditor !== editor) return false;

        await vscode.commands.executeCommand('editor.unfold', { selectionLines: linesToFold });
        await vscode.commands.executeCommand('editor.fold', { selectionLines: linesToFold });
        return true;
    }

    private applyHideDecorations(editor: vscode.TextEditor, ranges: vscode.FoldingRange[]) {
        const docUri = editor.document.uri.toString();
        const decorations: vscode.DecorationOptions[] = [];

        for (const range of ranges) {
            if (!this.textDocs.isFolded(docUri, range.start)) continue;

            const lineLength = editor.document.lineAt(range.start).text.length;
            decorations.push({ range: new vscode.Range(range.start, 0, range.start, lineLength) });
        }

        editor.setDecorations(this.hideDecoration, decorations);
    }

    private keepLineCentered(editor: vscode.TextEditor, line: number) {
        editor.revealRange(new vscode.Range(line, 0, line, 0), vscode.TextEditorRevealType.InCenter);
    }

    private async unfoldDocs(editor: vscode.TextEditor, ranges: vscode.FoldingRange[]) {
        const docUri = editor.document.uri.toString();
        const linesToUnfold = ranges.map(range => range.start);

        this.textDocs.unmarkFolded(docUri, linesToUnfold);

        if (linesToUnfold.length > 0) {
            await vscode.commands.executeCommand('editor.unfold', { selectionLines: linesToUnfold });
        }

        editor.setDecorations(this.hideDecoration, []);
    }

    private areDocsFolded(document: vscode.TextDocument, ranges: vscode.FoldingRange[]): boolean {
        const lines = ranges.map(range => range.start);
        return this.textDocs.areAllFolded(document.uri.toString(), lines);
    }

    private getActiveProvider(editor: vscode.TextEditor): DocFoldingProvider | undefined {
        if (editor.document.uri.scheme !== 'file') return undefined;
        return this.providers.find(p => p.languageIds.includes(editor.document.languageId));
    }

    private delay(ms: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }
}
