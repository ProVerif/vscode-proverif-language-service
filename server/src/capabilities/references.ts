import {Location, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {DocumentManagerInterface} from "../document_manager";
import {ParseTree} from "antlr4ts/tree";
import {nonNullable} from "../utils/array";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";
import {collectMatchingTerminals, getRange} from "../utils/parse_tree";
import {
    getDefinitionSymbolFromMatch,
    getDefinitionSymbolFromPosition, DefinitionSymbol, definitionSymbolsEqual
} from "../proverif/definition_symbol";

type Reference = {
    uri: TextDocumentIdentifier,
    match: TerminalNode
}

export const getReferences = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<Location[] | undefined> => {
    const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, position, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    const referenceCollector = new ReferenceCollector(definitionSymbol, documentManager);
    await referenceCollector.collect(definitionSymbol.uri);
    const references = referenceCollector.getReferences();

    return references
        .map(reference => constructLocationLink(reference.uri, reference.match))
        .filter(nonNullable);
};

class ReferenceCollector {
    private collected = new Set<string>;
    private references: Reference[] = [];

    public constructor(private definitionSymbol: DefinitionSymbol, private documentManager: DocumentManagerInterface) {
    }

    public async collect(identifier: TextDocumentIdentifier): Promise<void> {
        if (this.collected.has(identifier.uri)) {
            return;
        }
        this.collected.add(identifier.uri);

        const definitionProvierfDocument = await this.documentManager.getProverifDocument(identifier);
        if (!definitionProvierfDocument || !definitionProvierfDocument.parserTree) {
            return;
        }

        // collect references
        const candidateTerminals = collectMatchingTerminals(definitionProvierfDocument.parserTree, this.definitionSymbol.origin.match.text);
        const collectMatchingReferences = candidateTerminals
            .map(async terminal => getDefinitionSymbolFromMatch(definitionProvierfDocument, terminal, this.documentManager));
        const matchingReferences: Reference[] = (await Promise.all(collectMatchingReferences))
            .filter(nonNullable)
            .filter(symbol => definitionSymbolsEqual(symbol, this.definitionSymbol))
            .map(symbol => ({uri: identifier, match: symbol.origin.match}));
        this.references = this.references.concat(...matchingReferences);

        // collect references of consumers
        const consumers = await this.documentManager.getConsumers(identifier);
        const collectDependencyReferences = consumers.map(consumer => this.collect(consumer));
        await Promise.all(collectDependencyReferences);
    }

    public getReferences(): Reference[] {
        return this.references;
    }
}

const constructLocationLink = (identifier: TextDocumentIdentifier, target: ParseTree): Location | undefined => {
    const targetRange = getRange(target);
    if (!targetRange) {
        return undefined;
    }

    return Location.create(identifier.uri, targetRange);
};