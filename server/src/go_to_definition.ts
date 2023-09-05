import {ParseResult} from "./document_manager";
import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {getTokenPosition} from "./parseTree/compute_token_position";
import {getRange} from "./parseTree/get_range";
import {DefinitionLink} from "vscode-languageserver-protocol";
import {ParseTree} from "antlr4ts/tree";
import {Range} from "vscode-languageserver/node";

export const getDefinitionLink = async (uri: TextDocumentIdentifier, parseResult: ParseResult, position: Position): Promise<DefinitionLink | undefined> => {
    const caretPosition = {line: position.line + 1, column: position.character};
    const tokenPosition = getTokenPosition(parseResult.parserTree, parseResult.parser.inputStream, caretPosition);
    if (!tokenPosition) {
        return undefined;
    }

    const closestSymbol = parseResult.symbolTable.findClosestSymbol(tokenPosition.context);
    if (closestSymbol) {
        return constructLocationLink(uri, closestSymbol, tokenPosition.context);
    }

    for (let i = 0; i < parseResult.dependencies.length; i++) {
        const closestSymbol = parseResult.dependencies[i].symbolTable.findClosestSymbol(tokenPosition.context);
        if (!closestSymbol) {
            continue;
        }

        return constructLocationLink(parseResult.dependencies[i], closestSymbol, tokenPosition.context);
    }

    return undefined;
};

const constructLocationLink = (identifier: TextDocumentIdentifier, target: ParseTree, source: ParseTree): LocationLink | undefined => {
    const targetRange = getRange(target);
    if (!targetRange) {
        return undefined;
    }

    const originSelectionRange = getRange(source);

    return LocationLink.create(identifier.uri, targetRange, targetRange, originSelectionRange);
};