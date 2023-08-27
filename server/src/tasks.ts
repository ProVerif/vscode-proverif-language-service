import {DocumentUri, TextDocument} from "vscode-languageserver-textdocument";
import {fileURLToPath} from "url";
import {parseLibraryDependencies, ParseLibraryDependenciesResult} from "./tasks/parse_library_dependencies";
import {getDocumentSettings, ProVerifSettings} from "./utils/settings";
import {invokeProverif, InvokeProverifResult} from "./tasks/invoke_proverif";
import {logMessages} from "./utils/log";
import {sendDiagnostics} from "./utils/diagnostics";
import {parseProverif, ParseProverifResult} from "./tasks/parse_proverif";
import {createSymbolTable, CreateSymbolTableResult} from "./tasks/create_symbol_table";
import {TextDocumentIdentifier} from "vscode-languageserver";
import {Connection} from "vscode-languageserver/node";
import {AbstractParseTreeVisitor} from "antlr4ts/tree";
import {ScopedSymbol, SymbolTable} from "antlr4-c3";
import {ProverifParserVisitor} from "./parser-proverif/ProverifParserVisitor";

export type ParseResult = ParseProverifResult & CreateSymbolTableResult;

type DocumentCache = {
    settings?: ProVerifSettings,
    parseLibraryDependenciesResult?: ParseLibraryDependenciesResult,
    invokeProverifResult?: InvokeProverifResult,
    parseProverifResult?: ParseProverifResult,
    createSymbolTableResult?: CreateSymbolTableResult,
    document?: TextDocument
}

export class TaskExecutor {
    private documentCache: Map<TextDocumentIdentifier, DocumentCache> = new Map();
    constructor(
        private connection: Connection,
        private hasConfigurationCapability: boolean) {
    }

    public markSettingsChanged = async () => {
        const cachedDocuments = Array.from(this.documentCache.keys());
        const processingDocuments = cachedDocuments.map(document => this.markDocumentSettingsChanged(document));
        await Promise.all(processingDocuments);
    };

    private markDocumentSettingsChanged = async (document: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(document) ?? {};
        cache.settings = undefined;
        this.documentCache.set(document, cache);

        if (cache.document) {
            await this.invoke(cache.document);
        }
    };

    public closeDocument = async (document: TextDocumentIdentifier) => {
        this.documentCache.delete(document);
    };

    public markDocumentContentChanged = async (document: TextDocument) => {
        const cache = this.documentCache.get(document) ?? {};
        cache.parseLibraryDependenciesResult = undefined;
        cache.invokeProverifResult = undefined;
        cache.parseProverifResult = undefined;
        cache.createSymbolTableResult = undefined;
        this.documentCache.set(document, cache);

        await this.invoke(document);
    };

    public getParseResult = async (identification: TextDocumentIdentifier): Promise<ParseResult | undefined> => {
        const cache = this.documentCache.get(identification) ?? {};
        if (cache.document) {
            await this.parse(cache.document);

            if (cache.createSymbolTableResult && cache.parseProverifResult) {
                return {
                    symbolTable: cache.createSymbolTableResult.symbolTable,
                    parser: cache.parseProverifResult.parser,
                    proverifFileContext: cache.parseProverifResult.proverifFileContext
                };
            }
        }

        return undefined;
    };

    private invoke = async (document: TextDocument) => {
        const {content, path,} = this.parseLibraryDependencies(document);
        const cache = this.documentCache.get(document) ?? {};

        if (!cache.invokeProverifResult || !cache.settings) {
            if (!cache.settings) {
                cache.settings = await getDocumentSettings(this.connection, this.hasConfigurationCapability, document);
                cache.invokeProverifResult = undefined;
            }

            const libraryDependencyTokens = cache.parseLibraryDependenciesResult?.libraryDependencyTokens ?? [];
            const proverifBinary = cache.settings.proverifPath ? cache.settings.proverifPath : 'proverif';
            cache.invokeProverifResult = await invokeProverif(path, content, libraryDependencyTokens, proverifBinary);
            logMessages(this.connection, cache.invokeProverifResult.messages);
        }

        const diagnostics = (cache.parseLibraryDependenciesResult?.diagnostics ?? []).concat(cache.invokeProverifResult.diagnostics ?? []);
        await sendDiagnostics(this.connection, document, diagnostics);

        this.documentCache.set(document, cache);
    };

    private parse = async (document: TextDocument) => {
        const {content, path,} = this.parseLibraryDependencies(document);
        const cache = this.documentCache.get(document) ?? {};

        if (!cache.parseProverifResult) {
            cache.parseProverifResult = parseProverif(content);
        }

        if (!cache.createSymbolTableResult) {
            cache.createSymbolTableResult = createSymbolTable(document, cache.parseProverifResult.proverifFileContext);
        }

        this.documentCache.set(document, cache);
    };

    private parseLibraryDependencies = (document: TextDocument) => {
        const content = document.getText();
        const path = fileURLToPath(document.uri);

        const cache = this.documentCache.get(document) ?? {};
        cache.document = document;

        if (!cache.parseLibraryDependenciesResult) {
            cache.parseLibraryDependenciesResult = parseLibraryDependencies(path, content);
            this.connection.console.log("Found " + cache.parseLibraryDependenciesResult.libraryDependencyTokens.length + " dependencies.");
        }

        this.documentCache.set(document, cache);

        return {content, path, cache};
    };
}