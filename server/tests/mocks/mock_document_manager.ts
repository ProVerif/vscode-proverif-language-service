import {Position, Range, TextDocumentIdentifier} from "vscode-languageserver";
import {TextDocument} from "vscode-languageserver-textdocument";
import {DocumentManagerInterface, ParseResult, RawParseResult} from "../../src/document_manager";
import {parseProverif} from "../../src/tasks/parse_proverif";
import {assert} from "chai";
import {createSymbolTable} from "../../src/tasks/create_symbol_table";
import {LibraryDependencyToken} from "../../src/tasks/parse_library_dependencies";

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

    private rawParseResults: Map<string, RawParseResult> = new Map();
    private parseResults: Map<string, ParseResult> = new Map();
    private consumers: Map<string, TextDocumentIdentifier[]> = new Map();
    public parse(uri: string, code: string, dependencyUri?: string, dependencyRange?: Range) {
        const rawParseResult = parseProverif(code, uri.endsWith('.pvl'));
        this.rawParseResults.set(uri, rawParseResult);

        const {parser, parserTree} = rawParseResult
        if (!this.allowParseFails) {
            assert.isUndefined(parserTree.exception);
        }

        const symbolTable = createSymbolTable(parserTree).symbolTable;

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

    public async getRawParseResult(identifier: TextDocumentIdentifier): Promise<RawParseResult> {
        return this.rawParseResults.get(identifier.uri);
    }

    public async getParseResult(identifier: TextDocumentIdentifier): Promise<ParseResult | undefined> {
        return this.parseResults.get(identifier.uri);
    }

    public async getConsumers(identifier: TextDocumentIdentifier): Promise<TextDocumentIdentifier[]> {
        return this.consumers.get(identifier.uri) ?? []
    }
}
