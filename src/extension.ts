import * as vscode from 'vscode';
import { registerCollapseDocs } from './collapse_docs/register_collapse_docs';

export async function activate(context: vscode.ExtensionContext) {
    await registerCollapseDocs(context);
}

export function deactivate() {}
