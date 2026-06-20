import * as vscode from 'vscode';

export class TextDocumentManager {
    private readonly foldedLines = new Set<string>();

    isFolded(uri: string, line: number): boolean {
        return this.foldedLines.has(`${uri}:${line}`);
    }

    markFolded(uri: string, lines: number[]) {
        for (const line of lines) {
            this.foldedLines.add(`${uri}:${line}`);
        }
    }

    unmarkFolded(uri: string, lines: number[]) {
        for (const line of lines) {
            this.foldedLines.delete(`${uri}:${line}`);
        }
    }

    areAllFolded(uri: string, lines: number[]): boolean {
        return lines.length > 0 && lines.every(line => this.foldedLines.has(`${uri}:${line}`));
    }

    forget(uri: string) {
        const prefix = `${uri}:`;
        for (const key of this.foldedLines) {
            if (key.startsWith(prefix)) {
                this.foldedLines.delete(key);
            }
        }
    }

    syncFoldedLinesToEdits(event: vscode.TextDocumentChangeEvent) {
        const uri = event.document.uri.toString();
        const prefix = `${uri}:`;
        let lines: number[] = [];
        for (const key of this.foldedLines) {
            if (key.startsWith(prefix)) {
                lines.push(Number(key.slice(prefix.length)));
            }
        }
        if (lines.length === 0) return;

        for (const change of event.contentChanges) {
            const start = change.range.start.line;
            const end = change.range.end.line;
            const delta = change.text.split('\n').length - 1 - (end - start);
            lines = lines
                .filter(line => line <= start || line > end)
                .map(line => (line > end ? line + delta : line));
        }

        this.forget(uri);
        this.markFolded(uri, lines);
    }
}
