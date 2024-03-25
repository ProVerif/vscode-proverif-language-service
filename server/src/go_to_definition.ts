import {DocumentManagerInterface, ParseResult} from "./document_manager";
import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {getMatchingParseTree} from "./parseTree/get_matching_parse_tree";
import {getRange} from "./parseTree/get_range";
import {DefinitionLink} from "vscode-languageserver-protocol";
import {ParseTree} from "antlr4ts/tree";
import {DeclarationType, ProverifSymbol} from "./tasks/create_symbol_table";
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
    const origin = {uri: parseResult.identifier, match: matchingParseTree};

    // collect relevant files in order
    const getParseResults: (() => Promise<ParseResult | undefined>)[] = parseResult.dependencyTokens
        .filter(dependencyToken => dependencyToken.exists)
        .map(dependencyToken => () => documentManager.getParseResult(dependencyToken));
    getParseResults.unshift(async () => parseResult);

    // look for best matching symbol
    let currentContext: ParseTree | undefined = matchingParseTree;
    let currentClosestSymbol: ProverifSymbol | undefined;
    let currentClosestSymbolDependency: TextDocumentIdentifier | undefined;
    while (getParseResults.length > 0) {
        const getParseResult = getParseResults.shift()!;
        const parseResult = await getParseResult();
        const symbolTable = parseResult?.symbolTable;
        if (!parseResult || !symbolTable) {
            continue;
        }

        const closestSymbol = symbolTable.findClosestSymbol(matchingParseTree.text, currentContext);
        if (!closestSymbol) {
            currentContext = undefined;
            continue;
        }

        currentClosestSymbol = closestSymbol;
        currentClosestSymbolDependency = parseResult.identifier;

        // if defined by macro, try to find real definition
        if (closestSymbol.declaration === DeclarationType.ExpandParameter) {
            // 1st parent: the expand LibContext; 2nd parent: whatever is before
            currentContext = closestSymbol.context?.parent?.parent;
            if (currentContext) {
                // recheck in same file
                getParseResults.unshift(async () => parseResult);
            }
            continue;
        }

        break;
    }

    if (currentClosestSymbol && currentClosestSymbolDependency) {
        return {uri: currentClosestSymbolDependency, symbol: currentClosestSymbol, origin};
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