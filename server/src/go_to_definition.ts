import {DocumentManagerInterface, ParseResult} from "./document_manager";
import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {getMatchingParseTree} from "./parseTree/get_matching_parse_tree";
import {getRange} from "./parseTree/get_range";
import {DefinitionLink} from "vscode-languageserver-protocol";
import {ParseTree} from "antlr4ts/tree";
import {ProverifSymbol} from "./tasks/create_symbol_table";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";

type Origin = { uri: TextDocumentIdentifier, match: TerminalNode };
export type DefinitionSymbol = { uri: TextDocumentIdentifier, symbol: ProverifSymbol, origin: Origin }

export const getDefinitionSymbolFromPosition = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<DefinitionSymbol | undefined> => {
    const parseResult = await documentManager.getParseResult(identifier);
    if (!parseResult) {
        return undefined;
    }

    const matchingParseTree = getMatchingParseTree(parseResult.parserTree, position);
    if (!matchingParseTree) {
        return undefined;
    }

    return await getDefinitionSymbolFromMatch(parseResult, matchingParseTree, documentManager);
};


export const getDefinitionSymbolFromMatch = async (parseResult: ParseResult, matchingParseTree: TerminalNode, documentManager: DocumentManagerInterface): Promise<DefinitionSymbol | undefined> => {
    const definition = getDefinitionSymbolFromMatchMacroAware(parseResult, matchingParseTree, documentManager, false);
    if (definition) {
        return definition;
    }

    return getDefinitionSymbolFromMatchMacroAware(parseResult, matchingParseTree, documentManager, true);
};

export const getDefinitionSymbolFromMatchMacroAware = async (parseResult: ParseResult, matchingParseTree: TerminalNode, documentManager: DocumentManagerInterface, considerMacros: boolean): Promise<DefinitionSymbol | undefined> => {
    const origin = {uri: parseResult.identifier, match: matchingParseTree};

    const closestSymbol = parseResult.symbolTable.findClosestSymbol(matchingParseTree.text, matchingParseTree, considerMacros);
    if (closestSymbol) {
        return {uri: parseResult.identifier, symbol: closestSymbol, origin};
    }

    for (let i = 0; i < parseResult.dependencyTokens.length; i++) {
        const dependency = parseResult.dependencyTokens[i];
        if (!dependency.exists) {
            continue;
        }

        const dependencyParseResult = await documentManager.getParseResult(dependency);
        if (!dependencyParseResult) {
            continue;
        }

        const closestSymbol = dependencyParseResult.symbolTable.findClosestSymbol(matchingParseTree.text, undefined, considerMacros);
        if (!closestSymbol) {
            continue;
        }

        return {uri: dependency, symbol: closestSymbol, origin};
    }

    return undefined;
};

export const getDefinitionLink = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<DefinitionLink | undefined> => {
    const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, position, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    return constructLocationLink(definitionSymbol.uri, definitionSymbol.symbol.node, definitionSymbol.origin.match);
};

export const definitionSymbolsEqual = (a: DefinitionSymbol, b: DefinitionSymbol) => {
    return a && a.uri.uri === b.uri.uri && a.symbol === b.symbol;
};

const constructLocationLink = (identifier: TextDocumentIdentifier, target: ParseTree, source: ParseTree): LocationLink | undefined => {
    const targetRange = getRange(target);
    if (!targetRange) {
        return undefined;
    }

    const originSelectionRange = getRange(source);

    return LocationLink.create(identifier.uri, targetRange, targetRange, originSelectionRange);
};