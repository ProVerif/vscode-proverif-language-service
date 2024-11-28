import {Diagnostic, DiagnosticSeverity, Range} from "vscode-languageserver/node";
import {sep} from "path";
import {existsSync} from "fs";
import {Message} from "../utils/log";
import {TextDocumentIdentifier} from "vscode-languageserver";
import {fileURLToPath, pathToFileURL} from "url";

export type ParseLibraryDependenciesResult = {
    diagnostics: Diagnostic[]
    libraryDependencyTokens: LibraryDependencyToken[]
    messages?: Message[]
}

export type LibraryDependencyToken = {
    range: Range
    exists: boolean
} & TextDocumentIdentifier

const matchToRange = (content: string, match: RegExpMatchArray) => {
    const linesUntilError = content.substring(0, match.index).split(/\r?\n/);
    const matchingLine = linesUntilError.pop();
    const endError = (matchingLine?.length ?? 0) + match[0].length;
    return Range.create(linesUntilError.length, endError - match[1].length - LIB_FILE_ENDING.length, linesUntilError.length, endError);
};

const LIB_FILE_ENDING = '.pvl';
const LIB_REGEX_MATCH = /\(\* +-lib (.+)\.pvl/g;
export const parseLibraryDependencies = async (documentIdentifier: TextDocumentIdentifier, content: string): Promise<ParseLibraryDependenciesResult> => {
    const diagnostics: Diagnostic[] = [];
    const libraryDependencyTokens: LibraryDependencyToken[] = [];

    const path = fileURLToPath(documentIdentifier.uri);
    const folder = path.split(sep).slice(0, -1).join(sep);
    const matches = content.matchAll(LIB_REGEX_MATCH);
    for (const match of matches) {
        const expectedFilename = match[1] + LIB_FILE_ENDING;
        const absolutePath = expectedFilename.startsWith(sep) ? expectedFilename : folder + sep + expectedFilename;
        const exists = existsSync(absolutePath);

        const uri = pathToFileURL(absolutePath).toString();
        const range = matchToRange(content, match);
        const libraryDependencyToken: LibraryDependencyToken = {uri, exists, range};
        libraryDependencyTokens.push(libraryDependencyToken);

        if (!exists) {
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range: libraryDependencyToken.range,
                message: 'Library not found at ' + absolutePath,
                source: 'ProVerif Language Service'
            });
        }
    }

    const foundLibrariesMessage: Message = {
        severity: "info",
        content: "Found " + libraryDependencyTokens.length + " dependencies."
    };

    return {diagnostics, libraryDependencyTokens, messages: [foundLibrariesMessage]};
};
