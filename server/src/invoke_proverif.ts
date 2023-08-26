import {Connection, Diagnostic, DiagnosticSeverity, Range, TextDocumentChangeEvent, _Connection} from "vscode-languageserver/node";
import {ExecException} from "child_process";
import {TextDocument} from "vscode-languageserver-textdocument";
import {sep} from "path";
import {existsSync} from "fs";
import {exec} from "child_process";
import {fileURLToPath} from "url";
import {asTempFile} from "./files";

const getRangeFromPositionString = (positionString: string): Range | undefined => {
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
        return Number(numberString) - 1;
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

const parseDiagnostic = (connection: Connection, content: string, libraryMode: boolean, libraryDependecies: LibraryDependency[], error: ExecException|null, stdout: string): Diagnostic[] => {
    if (!error) {
        return [];
    }

    // syntax errors in stdout
    const lines = stdout.split(/\n/);
    while (lines.length > 0 && !lines[0].startsWith('File "')) {
        lines.shift();
    }
    if (lines.length < 2) {
        connection.console.error('Unknown error: ' + error);
        return [];
    }

    const positionLine = lines[0];
    const errorLine = lines[1];

    // check if error in library (not in actual file)
    const matchFile = positionLine.match(/File "(.+)\.pvl"/);
    if (matchFile) {
        const matchingDependencies = libraryDependecies.filter(entry => entry.fullPath === matchFile[1]+LIB_FILE_ENDING);
        const diagnostics = [];
        for (const matchingDependency of matchingDependencies) {
            const range = libraryMatchToRange(content, matchingDependency.match);
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range,
                message: errorLine,
                source: 'ProVerif Language Service'
            });
        }

        return diagnostics;
    }

    const range = getRangeFromPositionString(positionLine);
    if (!range) {
        connection.console.error('Failed to parse error location: ' + positionLine);
        return [];
    }

    if (libraryMode && errorLine === 'Error: Lemma not used because there is no matching query.') {
        connection.console.info('Ignore error message which is not relevant in library: ' + errorLine);
        return [];
    }

    const severity = errorLine.startsWith("Warning:") ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error;

    const parsingError = {severity, range, message: errorLine, source: 'ProVerif'};
    return [parsingError];
};

const readDocument = (connection: Connection, textDocument: TextDocument) => {
    let content = textDocument.getText();
    let appendFileEnding: string | undefined = undefined;
    const libraryMode = textDocument.uri.endsWith('.pvl');
    if (libraryMode) {
        content += '\nprocess\n\t0';
        appendFileEnding = '.pv';

        connection.console.log('Transformed .pvl to standalone .pv.');
    }

    return {content, appendFileEnding, libraryMode};
};

const libraryMatchToRange = (content: string, match: RegExpMatchArray) => {
    const linesUntilError = content.substring(0, match.index).split(/\r?\n/);
    const matchingLine = linesUntilError.pop();
    const endError = (matchingLine?.length ?? 0) + match[0].length;
    return Range.create(linesUntilError.length, endError - match[1].length - LIB_FILE_ENDING.length, linesUntilError.length, endError);
};

const LIB_ARGUMENT_PREFIX = '-lib';
const LIB_FILE_ENDING = '.pvl';
const LIB_REGEX_MATCH = /\(\* +-lib (.+)\.pvl/g;
const parseLibraryDependencies = (connection: Connection, filePath: string, content: string) => {
    const diagnostics: Diagnostic[] = [];
    const libraryDependecies: LibraryDependency[] = [];

    const folder = filePath.split(sep).slice(0, -1).join(sep);
    const libs: Set<string> = new Set();
    const matches = content.matchAll(LIB_REGEX_MATCH);
    for (const match of matches) {
        const expectedFilename = match[1] + LIB_FILE_ENDING;
        const expectedLocation = folder + sep + expectedFilename;
        libraryDependecies.push({ match, fullPath: expectedLocation });
        if (existsSync(expectedLocation)) {
            libs.add(expectedLocation);
            connection.console.log(`Found library at ${expectedLocation}.`);
        } else {
            const range = libraryMatchToRange(content, match);
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range,
                message: 'Library not found at ' + expectedLocation,
                source: 'ProVerif Language Service'
            });
        }
    }

    const libArguments = Array.from(libs).map(lib => `${LIB_ARGUMENT_PREFIX} "${lib}"`).join(" ");

    return {libArguments, diagnostics, libraryDependecies};
};

export const invokeProverif = async (connection: _Connection, proverifBinary: string, change: TextDocumentChangeEvent<TextDocument>) => {
    const filePath = fileURLToPath(change.document.uri);
    connection.console.log('Processing ' + filePath);

    const {content, appendFileEnding, libraryMode} = readDocument(connection, change.document);
    const {libArguments, diagnostics: libraryDiagnostics, libraryDependecies} = parseLibraryDependencies(connection, filePath, content);

    const proverifDiagnostics = await asTempFile<Diagnostic[]>(change.document.uri, content, appendFileEnding, tempFilePath => new Promise((resolve) => {
        const proverifInvocation = `${proverifBinary} ${libArguments} "${tempFilePath}"`;
        connection.console.info('Invoking ' + proverifInvocation);

        exec(proverifInvocation, {timeout: 1000}, (error, stdout) => {
            const proverifDiagnostics = parseDiagnostic(connection, content, libraryMode, libraryDependecies, error, stdout);
            resolve(proverifDiagnostics);
        });
    }));


    const diagnostics = libraryDiagnostics.concat(proverifDiagnostics);
    await connection.sendDiagnostics({uri: change.document.uri, diagnostics});
};

type LibraryDependency = {
    match: RegExpMatchArray,
    fullPath: string,
}
