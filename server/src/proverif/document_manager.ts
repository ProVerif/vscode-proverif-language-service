import {TextDocument} from "vscode-languageserver-textdocument";
import {parseLibraryDependencies, ParseLibraryDependenciesResult} from "./parse_library_dependencies";
import {getDocumentSettings, ProVerifSettings} from "../utils/settings";
import {invokeProverif, InvokeProverifResult} from "./invoke_proverif";
import {parseProverif, ParseProverifResult} from "./parse_proverif";
import {createSymbolTable, CreateSymbolTableResult} from "./symbol_table/create_symbol_table";
import {TextDocumentIdentifier} from "vscode-languageserver";
import {Connection} from "vscode-languageserver/node";
import {fileURLToPath, pathToFileURL} from 'url';
import {dirname, sep} from 'path';
import {readdir} from 'fs/promises';
import {readFile} from "../utils/files";

type DocumentCache = {
    settings?: ProVerifSettings,

    identifier: TextDocumentIdentifier,
    document?: TextDocument,
    filesystemContent?: string,

    parseLibraryDependenciesResult?: ParseLibraryDependenciesResult,
    consumers?: TextDocumentIdentifier[],

    invokeProverifResult?: InvokeProverifResult,
    parseProverifResult?: ParseProverifResult,
    createSymbolTableResult?: CreateSymbolTableResult
}

export class DocumentManager {
    private documentCache: Map<string, DocumentCache> = new Map();
    private folderCache: Set<string> = new Set();

    constructor(
        private connection: Connection,
        private hasConfigurationCapability: boolean) {
    }

    public supports = (document: TextDocumentIdentifier) => {
        return isProverifFile(document.uri);
    }

    public allDocuments = (): TextDocumentIdentifier[] => {
        return Array.from(this.documentCache.keys()).map(key => ({uri: key}));
    };

    public forget = (document: TextDocumentIdentifier) => {
        this.documentCache.delete(document.uri);
    };

    public markSettingsChanged = (identifier: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(identifier.uri) ?? {identifier};
        cache.settings = undefined;
        this.documentCache.set(identifier.uri, cache);

        this.folderCache = new Set<string>;
    };

    public markDocumentChanged = (identifier: TextDocumentIdentifier, document?: TextDocument) => {
        const cache = this.documentCache.get(identifier.uri) ?? {identifier};
        cache.document = document;
        cache.parseLibraryDependenciesResult = undefined;
        cache.invokeProverifResult = undefined;
        cache.parseProverifResult = undefined;
        cache.createSymbolTableResult = undefined;
        this.documentCache.set(identifier.uri, cache);
    };

    public markDocumentDependencyChanged = (identifier: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(identifier.uri) ?? {identifier};
        cache.invokeProverifResult = undefined;
        this.documentCache.set(identifier.uri, cache);
    };

    public findDependingDocuments = (documentIdentifier: TextDocumentIdentifier): TextDocumentIdentifier[] => {
        return Array.from(this.documentCache.keys())
            .filter(possibleConsumer =>
                this.documentCache.get(possibleConsumer)?.parseLibraryDependenciesResult?.libraryDependencyTokens
                    .find(token => token.uri === documentIdentifier.uri))
            .map(consumer => ({uri: consumer}));
    };

    public invoke = async (identifier: TextDocumentIdentifier) => {
        const {selfIsLibrary, libraryDependencyTokens} = await this.parseLibraryDependencies(identifier);
        const {proverifBinary} = await this.readSettings(identifier);
        const {text} = await this.getDocumentText(identifier);

        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        if (libraryDependencyTokens && (!cache.invokeProverifResult || cache.invokeProverifResult.proverifBinary !== proverifBinary)) {
            cache.invokeProverifResult = await invokeProverif(identifier, text, selfIsLibrary, libraryDependencyTokens, proverifBinary);
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.invokeProverifResult};
    };

    public parse = async (identifier: TextDocumentIdentifier) => {
        const {selfIsLibrary} = await this.parseLibraryDependencies(identifier);
        const {text} = await this.getDocumentText(identifier);

        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        if (!cache.parseProverifResult) {
            const parseResult = parseProverif(text, selfIsLibrary);
            if (parseResult) {
                cache.parseProverifResult = parseResult;
            }
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.parseProverifResult};
    };

    public createSymbolTable = async (identifier: TextDocumentIdentifier) => {
        const {tokenStream, parserTree} = await this.parse(identifier);

        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        if (tokenStream && parserTree && !cache.createSymbolTableResult) {
            cache.createSymbolTableResult = createSymbolTable(tokenStream, parserTree);
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.createSymbolTableResult};
    };

    public parseLibraryDependencies = async (identifier: TextDocumentIdentifier) => {
        const selfIsLibrary = identifier.uri.endsWith('.pvl');
        const {text} = await this.getDocumentText(identifier);

        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        if (!cache.parseLibraryDependenciesResult) {
            const parseLibraryDependenciesResult = await parseLibraryDependencies(identifier, text);
            parseLibraryDependenciesResult.libraryDependencyTokens.forEach(token => {
                const dependency = this.documentCache.get(token.uri) ?? {identifier};
                dependency.consumers = (dependency.consumers ?? [])
                    .filter(consumer => consumer.uri !== identifier.uri)
                    .concat(identifier);
                this.documentCache.set(token.uri, dependency);
            });
            cache.parseLibraryDependenciesResult = parseLibraryDependenciesResult;
        }

        this.documentCache.set(identifier.uri, cache);

        return {selfIsLibrary, ...cache.parseLibraryDependenciesResult};
    };

    public getConsumers = async (identifier: TextDocumentIdentifier) => {
        const path = fileURLToPath(identifier.uri);
        const folder = dirname(path);
        if (!this.folderCache.has(folder)) {
            const {parentFolderDiscoveryLimit} = await this.readSettings(identifier);

            await this.discoverFolder(folder, parentFolderDiscoveryLimit);
            this.folderCache.add(folder);
        }

        const cache = this.documentCache.get(identifier.uri) ?? {identifier};
        return cache.consumers ?? [];
    };

    private readSettings = async (identifier: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        if (!cache.settings) {
            cache.settings = await getDocumentSettings(this.connection, this.hasConfigurationCapability, identifier);
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.settings};
    };

    private getDocumentText = async (identifier: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        let text = cache.document?.getText();
        if (text === undefined) {
            if (!cache.filesystemContent) {
                const path = fileURLToPath(identifier.uri);
                cache.filesystemContent = await readFile(path);
            }

            text = cache.filesystemContent;
        }

        this.documentCache.set(identifier.uri, cache);

        return {text};
    };

    private discoveredFolders: Set<string> = new Set();
    private discoverFolder = async (folder: string, parentFolderDiscoveryLimit: number) => {
        const workspaceFolders = await this.connection.workspace.getWorkspaceFolders();
        if (!workspaceFolders) {
            return;
        }

        const folderWhitelist = workspaceFolders.map(workspaceFolder => fileURLToPath(workspaceFolder.uri));

        // check folders
        let discoveredFolderCount = 0;
        let currentFolder = folder;
        while (parentFolderDiscoveryLimit === -1 || discoveredFolderCount <= parentFolderDiscoveryLimit) {
            if (!folderWhitelist.some(whitelistedFolder => currentFolder.startsWith(whitelistedFolder))) {
                console.log("Ignoring folder not in Whitelist");
                break;
            }

            if (!this.discoveredFolders.has(currentFolder)) {
                const entries = await readdir(currentFolder, { withFileTypes: true });
                console.log("Discovering " + entries.length + " files in " + currentFolder);
                const fileUrls = entries
                    .filter(entry => entry.isFile())
                    .filter(entry => isProverifFile(entry.name))
                    .map(file => pathToFileURL(currentFolder + sep + file.name));
                await Promise.all(fileUrls.map(fileUrl => this.parseLibraryDependencies({ uri: fileUrl.toString()})));

                this.discoveredFolders.add(currentFolder);
            }

            currentFolder = dirname(currentFolder);
            discoveredFolderCount++;
        }
    };
}

const isProverifFile = (path: string) => {
    return path.endsWith(".pv") || path.endsWith(".pvl") || path.endsWith(".pvc");
};