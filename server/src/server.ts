/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	TextDocumentSyncKind,
	InitializeResult,
	Range
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import  { ExecException, exec } from "child_process";
import { fileURLToPath } from "url";

import { promises as fsPromises } from "fs";
import { tmpdir } from "os";
import { sep, join } from "path";

const asTempFile = async (textDocument: TextDocument, fn: (filePath: string) => Promise<void>) => {
	const path = fileURLToPath(textDocument.uri);
	const filename = path.split(sep).pop();

	const tempDirPath = await fsPromises.realpath(tmpdir()) + sep;
	const tempDir = await fsPromises.mkdtemp(tempDirPath);

	const tempFilePath = join(tempDir, filename || 'fallback.pv');
	await fsPromises.writeFile(tempFilePath, textDocument.getText());

	try {
		return await fn(tempFilePath);
	}finally {
		fsPromises.rm(tempDir, {recursive: true});
	}
};

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
documents.onDidChangeContent(change => {
	validateProverifDocument(change.document);
});

const getRangeFromPositionString = (positionString: string): Range|undefined => {
	// 
	/*
	Some error occurred; attempt to process syntax errors. These are of the form:

	File "hello_world.pv", line 12, character 9:
	Error: Variable, function, name, or predicate d not declared.

	or

	File "hello_world.pv", line 3, characters 9-14:
	Error: type channe not declared.

	or

	File "hello_world.pv", line 3, character 9 - line 5, character 5:
	Error: type channe not declared.

	see proverif/src/parsing_helper.ml
	*/
	const s2ns = (numberString: string): number => {
		return Number(numberString)-1;
	}; 
	const s2ne = (numberString: string): number => {
		return Number(numberString);
	}; 

	const matchMultiline = positionString.match(/.+line ([0-9]+), character ([0-9]+) - line ([0-9]+), character ([0-9]+)/);
	if (matchMultiline) {
		return Range.create(s2ns(matchMultiline[1]), s2ns(matchMultiline[2]), s2ne(matchMultiline[3]), s2ne(matchMultiline[4]));
	}
	
	const matchMultiCharacter = positionString.match(/.+line ([0-9]+), characters ([0-9]+)-([0-9]+)/);
	if (matchMultiCharacter) {
		return Range.create(s2ns(matchMultiCharacter[1]), s2ns(matchMultiCharacter[2]), s2ns(matchMultiCharacter[1]), s2ne(matchMultiCharacter[3]));
	}
	
	const matchSingleCharacter = positionString.match(/.+line ([0-9]+), character ([0-9]+)/);
	if (matchSingleCharacter) {
		return Range.create(s2ns(matchSingleCharacter[1]), s2ns(matchSingleCharacter[2]), s2ns(matchSingleCharacter[1]), s2ns(matchSingleCharacter[2]));
	}

	return undefined;
};

const parseDiagnostic = (error: ExecException, stdout: string): Diagnostic|undefined => {
	// syntax errors in stdout
	const lines = stdout.split(/\n/);
	while (lines.length > 0 && !lines[0].startsWith('File "')) {
		lines.shift();
	}
	if (lines.length < 2) {
		connection.console.error('Unknown error: ' + error);
		return;
	}

	const positionLine = lines[0];
	const errorLine = lines[1];
	const range = getRangeFromPositionString(positionLine);
	if (!range) {
		connection.console.error('Failed to parse error location: ' + positionLine);
		return;
	}

	return {
		severity: DiagnosticSeverity.Error,
		range,
		message: errorLine,
		source: 'ProVerif'
	};
};

const processProVerifOutput = (textDocument: TextDocument, error: ExecException | null, stdout: string): void => {
	const diagnostics: Diagnostic[] = [];
	if (error) {
		const diagnostic = parseDiagnostic(error, stdout);
		if (diagnostic) {
			diagnostics.push(diagnostic);
		}
	}

	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
};

async function validateProverifDocument(textDocument: TextDocument): Promise<void> {
	const filePath = fileURLToPath(textDocument.uri);
	connection.console.log('Running proverif on ' + filePath);

	asTempFile(textDocument, tempFilePath => new Promise((resolve) => {
		exec('proverif "' + tempFilePath + '"', { timeout: 1000 }, (error, stdout) => {
			connection.console.error('Parsing file content: ' + textDocument.getText());
			processProVerifOutput(textDocument, error, stdout);
			resolve();
		}); 
	}));
}

// functionality extension points:
// - override connection.onCompletion to return keywords, variables, ...; with onCompletionResolve item.data to show help
// - introduce refactoring for free c: channel to replace with channel c

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
