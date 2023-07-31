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
	DocumentUri,
	TextDocument
} from 'vscode-languageserver-textdocument';

import  { ExecException, exec } from "child_process";
import { fileURLToPath } from "url";

import { promises as fsPromises, existsSync } from "fs";
import { tmpdir } from "os";
import { sep, join } from "path";

const asTempFile = async <T>(uri: DocumentUri, content: string, appendFileEnding: undefined|string, fn: (filePath: string) => Promise<T>) => {
	const path = fileURLToPath(uri);
	const filename = (path.split(sep).pop() || 'fallback.pv') + (appendFileEnding ?? '');

	const tempDirPath = await fsPromises.realpath(tmpdir()) + sep;
	const tempDir = await fsPromises.mkdtemp(tempDirPath);

	const tempFilePath = join(tempDir, filename);
	await fsPromises.writeFile(tempFilePath, content);
	connection.console.info('Stored temporary file at ' + tempFilePath + ' with content\n' + content);

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

const processProVerifOutput = (error: ExecException | null, stdout: string) => {	
	const diagnostics: Diagnostic[] = [];
	if (error) {
		const diagnostic = parseDiagnostic(error, stdout);
		if (diagnostic) {
			diagnostics.push(diagnostic);
		}
	}

	return { diagnostics };
};

const readDocument = (textDocument: TextDocument) => {
	let content = textDocument.getText();
	let appendFileEnding: string|undefined = undefined;
	if (textDocument.uri.endsWith('.pvl')) {
		content += '\nprocess\n\t0';
		appendFileEnding = '.pv';
		
		connection.console.log('Transformed .pvl to standalone .pv.');
	}

	return { content, appendFileEnding };
};

const parseLibraryDependencies = (filePath: string, content: string) => {
	const diagnostics: Diagnostic[] = [];
	
	const folder = filePath.split(sep).slice(0, -1).join(sep);

	const libs: string[] = [];
	const matches = content.matchAll(/\(\* +-lib (.+)\.pvl/g);
	for (const match of matches) {
		const expectedFilename = match[1] + '.pvl';
		const expectedLocation = folder + sep + expectedFilename;
		if (existsSync(expectedLocation)) {
			libs.push(expectedLocation);
		} else {
			const linesUntilError = content.substring(0, match.index).split(/\r?\n/);
			const matchingLine = linesUntilError.pop();
			const endError = (matchingLine?.length ?? 0) + match[0].length;
			diagnostics.push({
				severity: DiagnosticSeverity.Warning,
				range: Range.create(linesUntilError.length, endError - expectedFilename.length, linesUntilError.length, endError),
				message: 'Library not found at '+expectedLocation,
				source: 'ProVerif Language Service'
			});
		}
	}

	const libArguments = libs.map(lib => '-lib ' + lib).join(" ");

	return { libArguments, diagnostics };
};

async function validateProverifDocument(textDocument: TextDocument): Promise<void> {
	const filePath = fileURLToPath(textDocument.uri);
	connection.console.log('Processing ' + filePath);

	const { content, appendFileEnding } = readDocument(textDocument);
	const { libArguments, diagnostics: libraryDiagnostics } = parseLibraryDependencies(filePath, content);


	const proverifDiagnostics = await asTempFile<Diagnostic[]>(textDocument.uri, content, appendFileEnding, tempFilePath => new Promise((resolve) => {
		const proverifInvocation = `proverif ${libArguments} ${tempFilePath}`;
		connection.console.info('Invoking ' + proverifInvocation);

		exec(proverifInvocation, { timeout: 1000 }, (error, stdout) => {
			const { diagnostics: proverifDiagnostics } = processProVerifOutput(error, stdout);
			resolve(proverifDiagnostics);
		}); 
	}));


	const diagnostics = libraryDiagnostics.concat(proverifDiagnostics);
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// functionality extension points:
// - override connection.onCompletion to return keywords, variables, ...; with onCompletionResolve item.data to show help
// - introduce refactoring for free c: channel to replace with channel c

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
