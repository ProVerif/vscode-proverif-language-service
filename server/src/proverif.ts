import {Connection, Diagnostic, DiagnosticSeverity, Range} from "vscode-languageserver/node";
import {ExecException} from "child_process";
import {TextDocument} from "vscode-languageserver-textdocument";
import {sep} from "path";
import {existsSync} from "fs";

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

const parseDiagnostic = (connection: Connection, error: ExecException, stdout: string): Diagnostic | undefined => {
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

export const processOutput = (connection: Connection, error: ExecException | null, stdout: string) => {
    const diagnostics: Diagnostic[] = [];
    if (error) {
        const diagnostic = parseDiagnostic(connection, error, stdout);
        if (diagnostic) {
            diagnostics.push(diagnostic);
        }
    }

    return {diagnostics};
};

export const readDocument = (connection: Connection, textDocument: TextDocument) => {
    let content = textDocument.getText();
    let appendFileEnding: string | undefined = undefined;
    if (textDocument.uri.endsWith('.pvl')) {
        content += '\nprocess\n\t0';
        appendFileEnding = '.pv';

        connection.console.log('Transformed .pvl to standalone .pv.');
    }

    return {content, appendFileEnding};
};

export const parseLibraryDependencies = (connection: Connection, filePath: string, content: string) => {
    const diagnostics: Diagnostic[] = [];

    const folder = filePath.split(sep).slice(0, -1).join(sep);

    const libs: string[] = [];
    const matches = content.matchAll(/\(\* +-lib (.+)\.pvl/g);
    for (const match of matches) {
        const expectedFilename = match[1] + '.pvl';
        const expectedLocation = folder + sep + expectedFilename;
        if (existsSync(expectedLocation)) {
            libs.push(expectedLocation);
            connection.console.log(`Found library at ${expectedLocation}.`);
        } else {
            const linesUntilError = content.substring(0, match.index).split(/\r?\n/);
            const matchingLine = linesUntilError.pop();
            const endError = (matchingLine?.length ?? 0) + match[0].length;
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: Range.create(linesUntilError.length, endError - expectedFilename.length, linesUntilError.length, endError),
                message: 'Library not found at ' + expectedLocation,
                source: 'ProVerif Language Service'
            });
        }
    }

    const libArguments = libs.map(lib => '-lib ' + lib).join(" ");

    return {libArguments, diagnostics};
};