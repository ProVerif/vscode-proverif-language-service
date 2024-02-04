import {DocumentManager, ParseResult} from "./document_manager";
import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {getMatchingParseTree} from "./parseTree/get_matching_parse_tree";
import {getRange} from "./parseTree/get_range";
import {DefinitionLink} from "vscode-languageserver-protocol";
import {ParseTree} from "antlr4ts/tree";
import {ProverifSymbol} from "./tasks/create_symbol_table";

export type DefinitionSymbol = ProverifSymbol & { uri: TextDocumentIdentifier }

export const getDefinitionSymbol = async (parseResult: ParseResult, matchingParseTree: ParseTree, documentManager: DocumentManager): Promise<DefinitionSymbol | undefined> => {
    const closestSymbol = parseResult.symbolTable.findClosestSymbol(matchingParseTree);
    if (closestSymbol) {
        return {...closestSymbol, uri: parseResult.identifier};
    }

    for (let i = 0; i < parseResult.dependencyTokens.length; i++) {
        const dependency = parseResult.dependencyTokens[i]
        if (!dependency.exists) {
            continue
        }

        const dependencyParseResult = await documentManager.getParseResult(dependency)
        if (!dependencyParseResult) {
            continue;
        }

        const closestSymbol = dependencyParseResult.symbolTable.findClosestSymbol(matchingParseTree);
        if (!closestSymbol) {
            continue;
        }

        return {...closestSymbol, uri: dependency};
    }

    return undefined;
};

export const getDefinitionLink = async (parseResult: ParseResult, position: Position, documentManager: DocumentManager): Promise<DefinitionLink | undefined> => {
    const matchingParseTree = getMatchingParseTree(parseResult.parserTree, parseResult.parser.inputStream, position);
    if (!matchingParseTree) {
        return undefined;
    }

    const definitionSymbol = await getDefinitionSymbol(parseResult, matchingParseTree, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    return constructLocationLink(definitionSymbol.uri, definitionSymbol.node, matchingParseTree);
};

const constructLocationLink = (identifier: TextDocumentIdentifier, target: ParseTree, source: ParseTree): LocationLink | undefined => {
    const targetRange = getRange(target);
    if (!targetRange) {
        return undefined;
    }

    const originSelectionRange = getRange(source);

    return LocationLink.create(identifier.uri, targetRange, targetRange, originSelectionRange);
};