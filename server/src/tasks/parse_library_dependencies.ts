import {Diagnostic, DiagnosticSeverity, Range} from "vscode-languageserver/node";
import {sep} from "path";
import {existsSync} from "fs";
import {Message} from "../utils/log";

export type ParseLibraryDependenciesResult = {
    diagnostics: Diagnostic[]
    libraryDependencyTokens: LibraryDependencyToken[]
    messages?: Message[]
}

export type LibraryDependencyToken = {
    match: RegExpMatchArray,
    path: string,
    exists: boolean
}

export const libraryDependencyTokenToRange = (content: string, token: LibraryDependencyToken) => {
    const linesUntilError = content.substring(0, token.match.index).split(/\r?\n/);
    const matchingLine = linesUntilError.pop();
    const endError = (matchingLine?.length ?? 0) + token.match[0].length;
    return Range.create(linesUntilError.length, endError - token.match[1].length - LIB_FILE_ENDING.length, linesUntilError.length, endError);
};

const LIB_FILE_ENDING = '.pvl';
const LIB_REGEX_MATCH = /\(\* +-lib (.+)\.pvl/g;
export const parseLibraryDependencies = (filePath: string, content: string): ParseLibraryDependenciesResult => {
    const diagnostics: Diagnostic[] = [];
    const libraryDependencyTokens: LibraryDependencyToken[] = [];

    const folder = filePath.split(sep).slice(0, -1).join(sep);
    const matches = content.matchAll(LIB_REGEX_MATCH);
    for (const match of matches) {
        const expectedFilename = match[1] + LIB_FILE_ENDING;
        const expectedLocation = folder + sep + expectedFilename;
        const exists = existsSync(expectedLocation);
        const libraryDependencyToken = {match, path: expectedLocation, exists};
        libraryDependencyTokens.push(libraryDependencyToken);

        if (!exists) {
            const range = libraryDependencyTokenToRange(content, libraryDependencyToken);
            diagnostics.push({
                severity: DiagnosticSeverity.Warning,
                range,
                message: 'Library not found at ' + expectedLocation,
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
