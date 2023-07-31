/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
    createConnection,
    Diagnostic,
    InitializeResult,
    ProposedFeatures,
    TextDocuments,
    TextDocumentSyncKind
} from 'vscode-languageserver/node';

import {TextDocument} from 'vscode-languageserver-textdocument';

import {exec} from "child_process";
import {fileURLToPath} from "url";
import {asTempFile} from "./files";
import {parseLibraryDependencies, processOutput, readDocument} from "./proverif";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(() => {
    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
        }
    };
    return result;
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(async change => {
    const filePath = fileURLToPath(change.document.uri);
    connection.console.log('Processing ' + filePath);

    const {content, appendFileEnding} = readDocument(connection, change.document);
    const {libArguments, diagnostics: libraryDiagnostics} = parseLibraryDependencies(connection, filePath, content);


    const proverifDiagnostics = await asTempFile<Diagnostic[]>(change.document.uri, content, appendFileEnding, tempFilePath => new Promise((resolve) => {
        const proverifInvocation = `proverif ${libArguments} ${tempFilePath}`;
        connection.console.info('Invoking ' + proverifInvocation);

        exec(proverifInvocation, {timeout: 1000}, (error, stdout) => {
            const {diagnostics: proverifDiagnostics} = processOutput(connection, error, stdout);
            resolve(proverifDiagnostics);
        });
    }));


    const diagnostics = libraryDiagnostics.concat(proverifDiagnostics);
    await connection.sendDiagnostics({uri: change.document.uri, diagnostics});
});

// functionality extension points:
// - override connection.onCompletion to return keywords, variables, ...; with onCompletionResolve item.data to show help
// - introduce refactoring for free c: channel to replace with channel c

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
