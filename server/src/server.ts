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
import {invokeProverif, InvokeProverifResult} from "./invoke_proverif";
import {parseLibraryDependencies, ParseLibraryDependenciesResult} from "./parse_library_dependencies";
import doc = Mocha.reporters.doc;
import {fileURLToPath} from "url";
import {text} from "stream/consumers";
import {getDocumentSettings, ProVerifSettings} from "./settings";
import {logMessages} from "./log";
import {sendDiagnostics} from "./diagnostics";

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
            textDocumentSync: TextDocumentSyncKind.Full,
        },
        definitionProvider: true
    };

    return result;
});

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }
});

type DocumentCache = { settings?: ProVerifSettings, parseLibraryDependenciesResult?: ParseLibraryDependenciesResult, invokeProverifResult?: InvokeProverifResult }
const documentCache: Map<TextDocument, DocumentCache> = new Map();
connection.onDidChangeConfiguration(_ => {
    connection.console.log("Configuration has changed");
    Array.from(documentCache.keys()).forEach(document => {
        const cache = documentCache.get(document) ?? { };
        cache.settings = undefined;
        documentCache.set(document, cache);
        
        reparse(document);
    });
});

documents.onDidClose(e => {
    documentCache.delete(e.document);
});

documents.onDidChangeContent(async change => {
    const cache = documentCache.get(change.document) ?? { };
    cache.parseLibraryDependenciesResult = undefined;
    cache.invokeProverifResult = undefined;
    documentCache.set(change.document, cache);

    await reparse(change.document);
});

connection.onDefinition((params) => {
    return undefined;
});

const reparse = async (document: TextDocument) => {
    const content = document.getText();
    const path = fileURLToPath(document.uri);

    const cache = documentCache.get(document) ?? { };

    if (!cache.parseLibraryDependenciesResult) {
        cache.parseLibraryDependenciesResult = parseLibraryDependencies(path, content);
        connection.console.log("Found " + cache.parseLibraryDependenciesResult.libraryDependencyTokens.length + " dependencies.");
    }

    if (!cache.invokeProverifResult || !cache.settings) {
        if (!cache.settings) {
            cache.settings = await getDocumentSettings(connection, document, hasConfigurationCapability);
            cache.invokeProverifResult = undefined;
        }

        const proverifBinary = cache.settings.proverifPath ? cache.settings.proverifPath : 'proverif';
        cache.invokeProverifResult = await invokeProverif(path, content, cache.parseLibraryDependenciesResult.libraryDependencyTokens, proverifBinary);
        logMessages(connection, cache.invokeProverifResult.messages);
    }

    const diagnostics = cache.parseLibraryDependenciesResult.diagnostics.concat(cache.invokeProverifResult.diagnostics ?? []);
    await sendDiagnostics(connection, document, diagnostics);

    documentCache.set(document, cache);
};

// functionality extension points:
// - override connection.onCompletion to return keywords, variables, ...; with onCompletionResolve item.data to show help
// - introduce refactoring for free c: channel to replace with channel c

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
