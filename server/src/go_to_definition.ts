import {ParseResult} from "./document_manager";
import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {getTokenPosition} from "./parseTree/compute_token_position";
import {getRange} from "./parseTree/get_range";
import {DefinitionLink} from "vscode-languageserver-protocol";

export const getDefinitionLink = async (uri: TextDocumentIdentifier, parseResult: ParseResult, position: Position): Promise<DefinitionLink | undefined> => {
    const caretPosition = {line: position.line + 1, column: position.character};
    const tokenPosition = getTokenPosition(parseResult.parserTree, parseResult.parser.inputStream, caretPosition);
    if (!tokenPosition) {
        return undefined;
    }

    const node = parseResult.symbolTable.findClosestSymbol(tokenPosition.context);
    if (!node) {
        return undefined;
    }

    const targetRange = getRange(node);
    if (!targetRange) {
        return undefined;
    }

    const originSelectionRange = getRange(tokenPosition.context);
    return LocationLink.create(uri.uri, targetRange, targetRange, originSelectionRange);
};