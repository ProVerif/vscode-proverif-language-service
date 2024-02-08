import {Location, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {DocumentManagerInterface} from "./document_manager";
import {
    DefinitionSymbol,
    definitionSymbolsEqual,
    getDefinitionSymbolFromMatch,
    getDefinitionSymbolFromPosition
} from "./go_to_definition";
import {collectMatchingTerminals} from "./parseTree/collect_matching_terminals";
import {ParseTree} from "antlr4ts/tree";
import {getRange} from "./parseTree/get_range";
import {nonNullable} from "./utils/array";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";

type Reference = {
    uri: TextDocumentIdentifier,
    match: TerminalNode
}

export const getReferences = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<Location[] | undefined> => {
    const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, position, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    const references = await collectReferences(definitionSymbol.uri, definitionSymbol, documentManager);

    return references
        .map(reference => constructLocationLink(reference.uri, reference.match))
        .filter(nonNullable);
};

const collectReferences = async (identifier: TextDocumentIdentifier, definitionSymbol: DefinitionSymbol, documentManager: DocumentManagerInterface): Promise<Reference[]> => {
    const definitionParseResult = await documentManager.getParseResult(identifier);
    if (!definitionParseResult) {
        return [];
    }

    const candidateTerminals = collectMatchingTerminals(definitionParseResult.parserTree, definitionSymbol.origin.match.text);
    const collectMatchingReferences = candidateTerminals
        .map(async terminal => getDefinitionSymbolFromMatch(definitionParseResult, terminal, documentManager));
    const matchingReferences: Reference[] = (await Promise.all(collectMatchingReferences))
        .filter(nonNullable)
        .filter(symbol => definitionSymbolsEqual(symbol, definitionSymbol))
        .map(symbol => ({uri: identifier, match: symbol.origin.match}));

    const consumers = await documentManager.getConsumers(identifier);
    const collectDependencyReferences = Array.from(consumers).map(consumer => collectReferences(consumer, definitionSymbol, documentManager));
    const dependencyReferences = await Promise.all(collectDependencyReferences);

    return matchingReferences.concat(...dependencyReferences.flat());
};

const constructLocationLink = (identifier: TextDocumentIdentifier, target: ParseTree): Location | undefined => {
    const targetRange = getRange(target);
    if (!targetRange) {
        return undefined;
    }

    return Location.create(identifier.uri, targetRange);
};