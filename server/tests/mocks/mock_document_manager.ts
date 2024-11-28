import {Position, Range, TextDocumentIdentifier} from "vscode-languageserver";
import {TextDocument} from "vscode-languageserver-textdocument";
import {DocumentManagerInterface, DocumentType} from "../../src/document_manager";
import {parseProverif} from "../../src/proverif/parse_proverif";
import {assert} from "chai";
import {createSymbolTable} from "../../src/proverif/symbol_table/create_symbol_table";
import {LibraryDependencyToken} from "../../src/proverif/parse_library_dependencies";
import {ProverifDocument} from "../../src/proverif/document_manager";
import {ProverifLogDocument} from "../../src/proverif_log/document_manager";

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

    public getDocumentType(identifier: TextDocumentIdentifier): DocumentType | undefined {
        if (this.proverifDocument.has(identifier.uri)) {
            return DocumentType.ProVerif;
        }

        if (this.proverifLogDocument.has(identifier.uri)) {
            return DocumentType.ProVerifLog;
        }

        return undefined;
    }

    public async getConsumers(identifier: TextDocumentIdentifier): Promise<TextDocumentIdentifier[]> {
        return this.consumers.get(identifier.uri) ?? []
    }

    private proverifDocument: Map<string, ProverifDocument> = new Map();
    private consumers: Map<string, TextDocumentIdentifier[]> = new Map();
    public addProverifDocument(uri: string, code: string, dependencyUri?: string, dependencyRange?: Range) {
        const {tokenStream, parser, parserTree} = parseProverif(code, uri.endsWith('.pvl'));
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

        this.proverifDocument.set(uri, parseResult);
    }

    public async getProverifDocument(identifier: TextDocumentIdentifier): Promise<ProverifDocument | undefined> {
        return this.proverifDocument.get(identifier.uri);
    }

    private proverifLogDocument: Map<string, ProverifLogDocument> = new Map();
    public addProverifLogDocument(uri: string, content: string) {
        this.proverifLogDocument.set(uri, {
            identifier: { uri },
            document: TextDocument.create(uri, "pv.log", 2, content)
        })
    }

    public async getProverifLogDocument(identifier: TextDocumentIdentifier): Promise<ProverifLogDocument | undefined> {
        return this.proverifLogDocument.get(identifier.uri);
    }
}
