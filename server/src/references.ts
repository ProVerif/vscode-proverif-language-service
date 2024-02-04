import {Location, LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {DocumentManagerInterface, ParseResult} from "./document_manager";
import {getMatchingParseTree} from "./parseTree/get_matching_parse_tree";
import {getDefinitionSymbol} from "./go_to_definition";
import {collectMatchingTerminals} from "./parseTree/collect_matching_terminals";
import {ParseTree} from "antlr4ts/tree";
import {getRange} from "./parseTree/get_range";
import {nonNullable} from "./utils/array";

export const getReferences = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<Location[] | undefined> => {
    const parseResult = await documentManager.getParseResult(identifier);
    if (!parseResult) {
        return undefined;
    }

    const matchingParseTree = getMatchingParseTree(parseResult.parserTree, parseResult.parser.inputStream, position);
    if (!matchingParseTree) {
        return undefined;
    }

    const definitionSymbol = await getDefinitionSymbol(parseResult, matchingParseTree, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    const definitionParseResult = await documentManager.getParseResult(definitionSymbol.uri);
    if (!definitionParseResult) {
        return undefined;
    }

    const matchingTerminals = collectMatchingTerminals(definitionParseResult.parserTree, matchingParseTree.text);
    return matchingTerminals
        .filter(terminal => {
            const matchDefinition = definitionParseResult.symbolTable.findClosestSymbol(terminal);
            return matchDefinition === definitionSymbol;
        }).map(match => constructLocationLink(definitionParseResult.identifier, match))
        .filter(nonNullable);

    // TODO implement
    // go to definition
    // collect references:
    // - filter tokens for text match (starting from definition of token)
    // - for each matching token check if go to definition matches
    // for each consumer of file, do the same
};


const constructLocationLink = (identifier: TextDocumentIdentifier, target: ParseTree): Location | undefined => {
    const targetRange = getRange(target);
    if (!targetRange) {
        return undefined;
    }

    return Location.create(identifier.uri, targetRange);
};