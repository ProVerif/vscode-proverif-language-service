import {DocumentManagerInterface} from "../document_manager/document_manager";
import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {getMatchingParseTree, getRange} from "../utils/parse_tree";
import {ParseTree} from "antlr4ts/tree";
import {DeclarationType, ProverifSymbol} from "../proverif/symbol_table/create_symbol_table";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";
import {DocumentParser} from "../proverif_log/document_parser";
import {ProverifDocument} from "../proverif/document_manager";

type Origin = { uri: TextDocumentIdentifier, match: TerminalNode };
export type DefinitionSymbol = { uri: TextDocumentIdentifier, symbol: ProverifSymbol, origin: Origin }

export const getDefinitionSymbolFromPosition = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<DefinitionSymbol | undefined> => {
    const proverifDocument = await documentManager.getProverifDocument(identifier);
    if (!proverifDocument || !proverifDocument.parserTree) {
        return undefined;
    }

    const matchingParseTree = getMatchingParseTree(proverifDocument.parserTree, position);
    if (!matchingParseTree) {
        return undefined;
    }

    return await getDefinitionSymbolFromMatch(proverifDocument, matchingParseTree, documentManager);
};


export const getDefinitionSymbolFromMatch = async (proverifDocument: ProverifDocument, matchingParseTree: TerminalNode, documentManager: DocumentManagerInterface): Promise<DefinitionSymbol | undefined> => {
    const origin = {uri: proverifDocument.identifier, match: matchingParseTree};

    // collect relevant files in order
    const getProverifDocuments: (() => Promise<ProverifDocument|undefined>)[] = proverifDocument.dependencyTokens
        .filter(dependencyToken => dependencyToken.exists)
        .map(dependencyToken => () => documentManager.getProverifDocument(dependencyToken));
    getProverifDocuments.unshift(async () => proverifDocument);

    // look for best matching symbol
    let currentContext: ParseTree | undefined = matchingParseTree;
    let currentClosestSymbol: ProverifSymbol | undefined;
    let currentClosestSymbolDependency: TextDocumentIdentifier | undefined;
    while (getProverifDocuments.length > 0) {
        const getProverifDocument = getProverifDocuments.shift()!;
        const proverifDocument = await getProverifDocument();
        if (!proverifDocument || !proverifDocument.symbolTable) {
            continue;
        }

        const closestSymbol = proverifDocument.symbolTable.findClosestSymbol(matchingParseTree.text, currentContext);
        if (!closestSymbol) {
            currentContext = undefined;
            continue;
        }

        currentClosestSymbol = closestSymbol;
        currentClosestSymbolDependency = proverifDocument.identifier;

        // if defined by macro, try to find real definition
        if (closestSymbol.declaration === DeclarationType.ExpandParameter) {
            // 1st parent: the expand LibContext; 2nd parent: whatever is before
            currentContext = closestSymbol.context?.parent?.parent;
            if (currentContext) {
                // recheck in same file
                getProverifDocuments.unshift(async () => proverifDocument);
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

export const getDefinitionLocations = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<LocationLink[] | undefined> => {
    const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, position, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    const locationLink = constructLocationLink(definitionSymbol.uri, definitionSymbol.symbol.node, definitionSymbol.origin.match);
    if (!locationLink) {
        return undefined;
    }

    return [locationLink];
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