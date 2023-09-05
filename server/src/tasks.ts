import {TextDocument} from "vscode-languageserver-textdocument";
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
import {joinOptionalLists} from "./utils/array";

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
    private documentCache: Map<string, DocumentCache> = new Map();

    constructor(
        private connection: Connection,
        private hasConfigurationCapability: boolean) {
    }

    public markSettingsChanged = async () => {
        const cachedDocuments = Array.from(this.documentCache.keys());
        const processingDocuments = cachedDocuments.map(document => this.markDocumentSettingsChanged(document));
        await Promise.all(processingDocuments);
    };

    private markDocumentSettingsChanged = async (documentUri: string) => {
        const cache = this.documentCache.get(documentUri) ?? {};
        cache.settings = undefined;
        this.documentCache.set(documentUri, cache);

        if (cache.document) {
            await this.invoke(cache.document);
        }
    };

    public closeDocument = async (document: TextDocumentIdentifier) => {
        this.documentCache.delete(document.uri);
    };

    public markDocumentContentChanged = async (document: TextDocument) => {
        let cache = this.documentCache.get(document.uri) ?? {};
        cache.parseLibraryDependenciesResult = undefined;
        cache.invokeProverifResult = undefined;
        cache.parseProverifResult = undefined;
        cache.createSymbolTableResult = undefined;
        this.documentCache.set(document.uri, cache);

        await this.invoke(document);

        cache = this.documentCache.get(document.uri) ?? {};

        const messages = joinOptionalLists(cache.parseLibraryDependenciesResult?.messages, cache.invokeProverifResult?.messages);
        logMessages(this.connection, messages);

        const diagnostics = joinOptionalLists(cache.parseLibraryDependenciesResult?.diagnostics, cache.invokeProverifResult?.diagnostics);
        await sendDiagnostics(this.connection, document, diagnostics);
    };

    public getParseResult = async (identification: TextDocumentIdentifier): Promise<ParseResult | undefined> => {
        const cache = this.documentCache.get(identification.uri) ?? {};

        if (!cache.document) {
            return undefined;
        }

        await this.parse(cache.document);

        if (!cache.parseProverifResult || !cache.createSymbolTableResult) {
            return undefined;
        }

        // TODO: Add symbol tables of dependencies
        return {
            parser: cache.parseProverifResult.parser,
            parserTree: cache.parseProverifResult.parserTree,
            symbolTable: cache.createSymbolTableResult.symbolTable
        };
    };

    private invoke = async (document: TextDocument) => {
        const {content, path, libraryMode, libraryDependencyTokens} = this.parseLibraryDependencies(document);
        const {proverifBinary} = await this.readSettings(document);

        const cache = this.documentCache.get(document.uri) ?? {};

        if (!cache.invokeProverifResult || cache.invokeProverifResult.proverifBinary !== proverifBinary) {
            cache.invokeProverifResult = await invokeProverif(path, content, libraryMode, libraryDependencyTokens, proverifBinary);
        }

        this.documentCache.set(document.uri, cache);
    };

    private parse = async (document: TextDocument) => {
        const {content, libraryMode} = this.parseLibraryDependencies(document);

        const cache = this.documentCache.get(document.uri) ?? {};

        if (!cache.parseProverifResult) {
            cache.parseProverifResult = parseProverif(content, libraryMode);
        }

        if (!cache.createSymbolTableResult) {
            cache.createSymbolTableResult = createSymbolTable(cache.parseProverifResult.parserTree);
        }

        this.documentCache.set(document.uri, cache);
    };

    private readSettings = async (document: TextDocument) => {
        const cache = this.documentCache.get(document.uri) ?? {};

        if (!cache.settings) {
            cache.settings = await getDocumentSettings(this.connection, this.hasConfigurationCapability, document);
        }

        this.documentCache.set(document.uri, cache);

        return {...cache.settings};
    };

    private parseLibraryDependencies = (document: TextDocument) => {
        const content = document.getText();
        const path = fileURLToPath(document.uri);
        const libraryMode = path.endsWith('.pvl');

        const cache = this.documentCache.get(document.uri) ?? {};
        cache.document = document;

        if (!cache.parseLibraryDependenciesResult) {
            cache.parseLibraryDependenciesResult = parseLibraryDependencies(path, content);
        }

        this.documentCache.set(document.uri, cache);

        return {content, path, libraryMode, ...cache.parseLibraryDependenciesResult};
    };
}