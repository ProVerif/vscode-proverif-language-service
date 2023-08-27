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

export type ParseResult = ParseProverifResult & CreateSymbolTableResult;

type DocumentCache = {
    settings?: ProVerifSettings,
    parseLibraryDependenciesResult?: ParseLibraryDependenciesResult,
    invokeProverifResult?: InvokeProverifResult,
    parseProverifResult?: ParseProverifResult,
    createSymbolTableResult?: CreateSymbolTableResult,
    document?: TextDocument
}
const documentCache: Map<TextDocumentIdentifier, DocumentCache> = new Map();

const parseLibraryDependenciesCached = (connection: Connection, document: TextDocument) => {
    const content = document.getText();
    const path = fileURLToPath(document.uri);

    const cache = documentCache.get(document) ?? {};
    cache.document = document;

    if (!cache.parseLibraryDependenciesResult) {
        cache.parseLibraryDependenciesResult = parseLibraryDependencies(path, content);
        connection.console.log("Found " + cache.parseLibraryDependenciesResult.libraryDependencyTokens.length + " dependencies.");
    }

    documentCache.set(document, cache);

    return { content, path, cache };
};

export const invalidateSettings = async (connection: Connection, hasConfigurationCapability: boolean) => {
    const cachedDocuments = Array.from(documentCache.keys());
    const processingDocuments = cachedDocuments.map(document => invalidateDocumentSettings(connection, hasConfigurationCapability, document));
    await Promise.all(processingDocuments);
};

const invalidateDocumentSettings = async (connection: Connection, hasConfigurationCapability: boolean, document: TextDocumentIdentifier) => {
    const cache = documentCache.get(document) ?? {};
    cache.settings = undefined;
    documentCache.set(document, cache);

    if (cache.document) {
        await invokeProverifCached(connection, hasConfigurationCapability, cache.document);
    }
};


export const invalidateDocument = async (document: TextDocumentIdentifier) => {
    documentCache.delete(document);
};

export const invalidateDocumentContent = async (connection: Connection, hasConfigurationCapability: boolean, document: TextDocument) => {
    const cache = documentCache.get(document) ?? {};
    cache.parseLibraryDependenciesResult = undefined;
    cache.invokeProverifResult = undefined;
    cache.parseProverifResult = undefined;
    cache.createSymbolTableResult = undefined;
    documentCache.set(document, cache);

    await invokeProverifCached(connection, hasConfigurationCapability, document);
};

export const invokeProverifCached = async (connection: Connection, hasConfigurationCapability: boolean, document: TextDocument) => {
    const { content, path, } = parseLibraryDependenciesCached(connection, document);
    const cache = documentCache.get(document) ?? {};

    if (!cache.invokeProverifResult || !cache.settings) {
        if (!cache.settings) {
            cache.settings = await getDocumentSettings(connection, document, hasConfigurationCapability);
            cache.invokeProverifResult = undefined;
        }

        const libraryDependencyTokens = cache.parseLibraryDependenciesResult?.libraryDependencyTokens ?? [];
        const proverifBinary = cache.settings.proverifPath ? cache.settings.proverifPath : 'proverif';
        cache.invokeProverifResult = await invokeProverif(path, content, libraryDependencyTokens, proverifBinary);
        logMessages(connection, cache.invokeProverifResult.messages);
    }

    const diagnostics = (cache.parseLibraryDependenciesResult?.diagnostics ?? []).concat(cache.invokeProverifResult.diagnostics ?? []);
    await sendDiagnostics(connection, document, diagnostics);

    documentCache.set(document, cache);
};

export const getParseResult = async (connection: Connection, identification: TextDocumentIdentifier): Promise<ParseResult|undefined> => {
    const cache = documentCache.get(identification) ?? {};
    if (cache.document) {
        await parseProverifCached(connection, cache.document);

        if (cache.createSymbolTableResult  && cache.parseProverifResult) {
            return {
                symbolTable: cache.createSymbolTableResult.symbolTable,
                parser: cache.parseProverifResult.parser,
                proverifFileContext: cache.parseProverifResult.proverifFileContext
            };
        }
    }

    return undefined;
};

const parseProverifCached = async (connection: Connection, document: TextDocument) => {
    const { content, path, } = parseLibraryDependenciesCached(connection, document);
    const cache = documentCache.get(document) ?? {};

    if (!cache.parseProverifResult) {
        cache.parseProverifResult = parseProverif(content);
    }

    if (!cache.createSymbolTableResult) {
        cache.createSymbolTableResult = createSymbolTable(document, cache.parseProverifResult.proverifFileContext);
    }

    documentCache.set(document, cache);
};