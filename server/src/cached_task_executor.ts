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
import doc = Mocha.reporters.doc;

type DocumentCache = {
    settings?: ProVerifSettings,
    parseLibraryDependenciesResult?: ParseLibraryDependenciesResult,
    invokeProverifResult?: InvokeProverifResult,
    parseProverifResult?: ParseProverifResult,
    createSymbolTableResult?: CreateSymbolTableResult,
    document?: TextDocument
}

export class CachedTaskExecutor {
    private documentCache: Map<string, DocumentCache> = new Map();

    constructor(
        private connection: Connection,
        private hasConfigurationCapability: boolean) {
    }

    public allDocuments = (): TextDocumentIdentifier[] => {
        return Array.from(this.documentCache.keys()).map(key => ({uri: key}));
    };

    public forget = (document: TextDocumentIdentifier) => {
        this.documentCache.delete(document.uri);
    };

    public markSettingsChanged = (document: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(document.uri) ?? {};
        cache.settings = undefined;
        this.documentCache.set(document.uri, cache);
    };

    public markDocumentChanged = (documentIdentifier: TextDocumentIdentifier, document?: TextDocument) => {
        const cache = this.documentCache.get(documentIdentifier.uri) ?? {};
        cache.document = document;
        cache.parseLibraryDependenciesResult = undefined;
        cache.invokeProverifResult = undefined;
        cache.parseProverifResult = undefined;
        cache.createSymbolTableResult = undefined;
        this.documentCache.set(documentIdentifier.uri, cache);
    };

    public invoke = async (document: TextDocumentIdentifier) => {
        const {selfIsLibrary, libraryDependencyTokens} = await this.parseLibraryDependencies(document);
        const {proverifBinary} = await this.readSettings(document);

        const cache = this.documentCache.get(document.uri) ?? {};

        if (cache.document && libraryDependencyTokens && (!cache.invokeProverifResult || cache.invokeProverifResult.proverifBinary !== proverifBinary)) {
            cache.invokeProverifResult = await invokeProverif(document, cache.document.getText(), selfIsLibrary, libraryDependencyTokens, proverifBinary);
        }

        this.documentCache.set(document.uri, cache);

        return {...cache.invokeProverifResult};
    };

    public parse = async (identifier: TextDocumentIdentifier) => {
        const {selfIsLibrary} = await this.parseLibraryDependencies(identifier);

        const cache = this.documentCache.get(identifier.uri) ?? {};

        if (cache.document && !cache.parseProverifResult) {
            cache.parseProverifResult = parseProverif(cache.document.getText(), selfIsLibrary);
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.parseProverifResult};
    };

    public createSymbolTable = async (identifier: TextDocumentIdentifier) => {
        const {parserTree} = await this.parse(identifier);

        const cache = this.documentCache.get(identifier.uri) ?? {};

        if (parserTree && !cache.createSymbolTableResult) {
            cache.createSymbolTableResult = createSymbolTable(parserTree);
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.createSymbolTableResult};
    };

    private readSettings = async (document: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(document.uri) ?? {};

        if (!cache.settings) {
            cache.settings = await getDocumentSettings(this.connection, this.hasConfigurationCapability, document);
        }

        this.documentCache.set(document.uri, cache);

        return {...cache.settings};
    };

    public parseLibraryDependencies = async (identifier: TextDocumentIdentifier) => {
        const selfIsLibrary = identifier.uri.endsWith('.pvl');

        const cache = this.documentCache.get(identifier.uri) ?? {};
        const content = cache.document?.getText();

        if (content && !cache.parseLibraryDependenciesResult) {
            cache.parseLibraryDependenciesResult = await parseLibraryDependencies(identifier, content);
        }

        this.documentCache.set(identifier.uri, cache);

        return {selfIsLibrary, ...cache.parseLibraryDependenciesResult};
    };
}