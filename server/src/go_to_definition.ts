import {ParseResult} from "./document_manager";
import {DocumentLink, LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {getMatchingParseTree} from "./parseTree/get_matching_parse_tree";
import {getRange} from "./parseTree/get_range";
import {DefinitionLink} from "vscode-languageserver-protocol";
import {ParseTree} from "antlr4ts/tree";
import {ProverifSymbol} from "./tasks/create_symbol_table";

export const getDocumentLinks = async (parseResult: ParseResult): Promise<DocumentLink[]> => {
    return parseResult.dependencies
        .filter(dependency => dependency.exists)
        .map(dependency => DocumentLink.create(dependency.range, dependency.uri));
};

export type DefinitionSymbol = ProverifSymbol & { uri: TextDocumentIdentifier }

export const getDefinitionSymbol = async (uri: TextDocumentIdentifier, parseResult: ParseResult, matchingParseTree: ParseTree): Promise<DefinitionSymbol | undefined> => {
    const closestSymbol = parseResult.symbolTable.findClosestSymbol(matchingParseTree);
    if (closestSymbol) {
        return {...closestSymbol, uri};
    }

    for (let i = 0; i < parseResult.dependencies.length; i++) {
        const closestSymbol = parseResult.dependencies[i].symbolTable.findClosestSymbol(matchingParseTree);
        if (!closestSymbol) {
            continue;
        }

        return {...closestSymbol, uri: parseResult.dependencies[i]};
    }

    return undefined;
};

export const getDefinitionLink = async (uri: TextDocumentIdentifier, parseResult: ParseResult, position: Position): Promise<DefinitionLink | undefined> => {
    const matchingParseTree = getMatchingParseTree(parseResult.parserTree, parseResult.parser.inputStream, position);
    if (!matchingParseTree) {
        return undefined;
    }

    const definitionSymbol = await getDefinitionSymbol(uri, parseResult, matchingParseTree);
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