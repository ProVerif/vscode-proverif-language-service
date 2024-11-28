import {Position, Range, TextDocumentIdentifier} from "vscode-languageserver";
import {TextDocument} from "vscode-languageserver-textdocument";
import {DocumentManagerInterface} from "../../src/document_manager/document_manager";
import {parseProverif, ParseProverifResult} from "../../src/proverif/parse_proverif";
import {assert} from "chai";
import {createSymbolTable} from "../../src/proverif/symbol_table/create_symbol_table";
import {LibraryDependencyToken} from "../../src/proverif/parse_library_dependencies";
import {ProverifDocument} from "../../src/proverif/document_manager";

export class MockDocumentManager implements DocumentManagerInterface {
    public constructor(private allowParseFails: boolean = false) {
    }

    public markSettingsChanged(): Promise<void> {
        return;
    }

    public closeDocument(identifier: TextDocumentIdentifier): void {
        return;
    }

    public markDocumentContentChanged(document: TextDocument): Promise<void> {
        return;
    }

    public markFilesystemDocumentContentChanged(document: TextDocument): Promise<void> {
        return;
    }

    private rawParseResults: Map<string, ParseProverifResult> = new Map();
    private parseResults: Map<string, ProverifDocument> = new Map();
    private consumers: Map<string, TextDocumentIdentifier[]> = new Map();
    public parse(uri: string, code: string, dependencyUri?: string, dependencyRange?: Range) {
        const rawParseResult = parseProverif(code, uri.endsWith('.pvl'));
        this.rawParseResults.set(uri, rawParseResult);

        const {tokenStream, parser, parserTree} = rawParseResult
        if (!this.allowParseFails) {
            assert.isUndefined(parserTree.exception);
        }

        const symbolTable = createSymbolTable(tokenStream, parserTree).symbolTable;

        const dependencyTokens: LibraryDependencyToken[] = [];
        if (dependencyUri) {
            const zeroPosition: Position = { line: 0, character: 0 };
            const zeroRange: Range = { start: zeroPosition, end: zeroPosition};
            dependencyTokens.push({uri: dependencyUri, range: dependencyRange ?? zeroRange, exists: true});

            const consumers = this.consumers.get(dependencyUri) ?? []
            consumers.push({uri})
            this.consumers.set(dependencyUri, consumers)
        }

        const parseResult = {identifier: {uri}, parser, parserTree, symbolTable, dependencyTokens: dependencyTokens};

        this.parseResults.set(uri, parseResult);
    }

    public async getProverifDocument(identifier: TextDocumentIdentifier): Promise<ProverifDocument | undefined> {
        return this.parseResults.get(identifier.uri);
    }

    public async getConsumers(identifier: TextDocumentIdentifier): Promise<TextDocumentIdentifier[]> {
        return this.consumers.get(identifier.uri) ?? []
    }
}
