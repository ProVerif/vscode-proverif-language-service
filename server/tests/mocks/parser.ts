import {Position, Range} from "vscode-languageserver";
import {ParseResult} from "../../src/document_manager";
import {parseProverif} from "../../src/tasks/parse_proverif";
import {assert} from "chai";
import {createSymbolTable} from "../../src/tasks/create_symbol_table";
import {LibraryDependencyToken} from "../../src/tasks/parse_library_dependencies";

export const getParserResult = (uri: string, input: string, dependencyUri?: string, dependencyRange?: Range): ParseResult => {
    const {parser, parserTree} = parseProverif(input, uri.endsWith('.pvl'));
    assert.isUndefined(parserTree.exception);

    const symbolTable = createSymbolTable(parserTree).symbolTable;

    const dependencyTokens: LibraryDependencyToken[] = [];
    if (dependencyUri) {
        const zeroPosition: Position = { line: 0, character: 0 };
        const zeroRange: Range = { start: zeroPosition, end: zeroPosition};
        dependencyTokens.push({uri: dependencyUri, range: dependencyRange ?? zeroRange, exists: true});
    }

    return {identifier: {uri}, parser, parserTree, symbolTable, dependencyTokens: dependencyTokens};
};