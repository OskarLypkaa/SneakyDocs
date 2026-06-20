import * as vscode from 'vscode';
import { CollapseDocsManager } from './collapse_docs_manager';
import { TextDocumentManager } from './text_document_manager';
import { PythonFoldingProvider } from './providers/python_provider';
import { JSDocFoldingProvider } from './providers/jsdoc_provider';

export async function registerCollapseDocs(context: vscode.ExtensionContext): Promise<void> {
    await hideFoldingHighlight(context);

    const pythonProvider = new PythonFoldingProvider();
    const jsdocProvider = new JSDocFoldingProvider();
    const textDocs = new TextDocumentManager();
    const manager = new CollapseDocsManager([pythonProvider, jsdocProvider], textDocs);

    context.subscriptions.push(
        manager,
        vscode.languages.registerFoldingRangeProvider(pythonProvider.getDocumentSelectorsMap(), pythonProvider),
        vscode.languages.registerFoldingRangeProvider(jsdocProvider.getDocumentSelectorsMap(), jsdocProvider),
        vscode.commands.registerCommand('collapseDocs.toggle', () => manager.toggleDocs()),
        vscode.workspace.onDidChangeTextDocument(event => textDocs.syncFoldedLinesToEdits(event)),
        vscode.workspace.onDidCloseTextDocument(document => manager.forgetDocument(document)),
        ...registerAutoCollapseOnOpen(manager)
    );
}

function registerAutoCollapseOnOpen(manager: CollapseDocsManager): vscode.Disposable[] {
    const autoCollapsed = new Set<string>();

    const run = (editor: vscode.TextEditor | undefined) => {
        if (!editor || !autoCollapseEnabled()) return;

        const uri = editor.document.uri.toString();
        if (autoCollapsed.has(uri)) return;

        autoCollapsed.add(uri);
        manager.collapseDocs(editor).catch(error =>
            console.error('Collapse Docs: auto-collapse on open failed', error));
    };

    run(vscode.window.activeTextEditor);
    return [
        vscode.window.onDidChangeActiveTextEditor(run),
        vscode.workspace.onDidCloseTextDocument(document => autoCollapsed.delete(document.uri.toString()))
    ];
}

function autoCollapseEnabled(): boolean {
    return vscode.workspace.getConfiguration('collapseDocs').get<boolean>('autoCollapseOnOpen', false);
}

const PREVIOUS_FOLDING_HIGHLIGHT = 'collapseDocs.previousFoldingHighlight';

async function hideFoldingHighlight(context: vscode.ExtensionContext): Promise<void> {
    const optedOut = !vscode.workspace.getConfiguration('collapseDocs').get<boolean>('hideFoldingHighlight', true);
    if (optedOut) return;

    const config = vscode.workspace.getConfiguration();
    const previous = config.inspect<boolean>('editor.foldingHighlight')?.globalValue;
    if (previous === false) return;

    try {
        await context.globalState.update(PREVIOUS_FOLDING_HIGHLIGHT, previous ?? null);
        await config.update('editor.foldingHighlight', false, vscode.ConfigurationTarget.Global);
        context.subscriptions.push({ dispose: () => restoreFoldingHighlight(context) });
    } catch (error) {
        console.warn('Collapse Docs: could not hide the folding highlight', error);
    }
}

// Restore the user's folding highlight on deactivate, but only if it is still the
// value we set, so we never clobber a change the user made in the meantime.
function restoreFoldingHighlight(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration();
    if (config.inspect<boolean>('editor.foldingHighlight')?.globalValue !== false) return;

    const previous = context.globalState.get<boolean | null>(PREVIOUS_FOLDING_HIGHLIGHT);
    config.update('editor.foldingHighlight', previous ?? undefined, vscode.ConfigurationTarget.Global);
}
