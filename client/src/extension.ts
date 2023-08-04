/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { ExtensionContext } from 'vscode';
import { startLanguageServer, stopLanguageServer } from './languageServer';
import { startTaskProvider, stopTaskProvider } from './taskProvider';

export async function activate(context: ExtensionContext) {
	await startLanguageServer(context);
	await startTaskProvider(context);
}

export async function deactivate(): Promise<void> {
	await stopLanguageServer();
	await stopTaskProvider();
}
