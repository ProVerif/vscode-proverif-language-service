/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
    createConnection,
    DidChangeConfigurationNotification,
    InitializeParams,
    InitializeResult,
    ProposedFeatures,
    TextDocuments,
    TextDocumentSyncKind
} from 'vscode-languageserver/node';
import {TextDocument} from 'vscode-languageserver-textdocument';
import {invokeProverif} from "./invoke_proverif";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
        }
    };

    return result;
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
});


interface ProVerifSettings {
	proverifPath?: string;
}

// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ProVerifSettings = { proverifPath: undefined };
let globalSettings: ProVerifSettings = defaultSettings;
const documentSettings: Map<string, Thenable<ProVerifSettings>> = new Map();
connection.onDidChangeConfiguration(change => {
	if (hasConfigurationCapability) {
		documentSettings.clear();
	} else {
		globalSettings = <ProVerifSettings>(
			(change.settings.proverif || defaultSettings)
		);
	}
});
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

const getDocumentSettings = (resource: string): Thenable<ProVerifSettings> => {
	if (!hasConfigurationCapability) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'proverif'
		});
		documentSettings.set(resource, result);
	}
	return result;
};

documents.onDidChangeContent(async change => {
	const settings = await getDocumentSettings(change.document.uri);
	const proverifBinary = settings.proverifPath ? settings.proverifPath : 'proverif';
	await invokeProverif(connection, proverifBinary, change);
});

// functionality extension points:
// - override connection.onCompletion to return keywords, variables, ...; with onCompletionResolve item.data to show help
// - introduce refactoring for free c: channel to replace with channel c

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
