import {TextDocument} from "vscode-languageserver-textdocument";
import {parseLibraryDependencies, ParseLibraryDependenciesResult} from "./tasks/parse_library_dependencies";
import {getDocumentSettings, ProVerifSettings} from "./utils/settings";
import {invokeProverif, InvokeProverifResult} from "./tasks/invoke_proverif";
import {parseProverif, ParseProverifResult} from "./tasks/parse_proverif";
import {createSymbolTable, CreateSymbolTableResult} from "./tasks/create_symbol_table";
import {TextDocumentIdentifier} from "vscode-languageserver";
import {Connection} from "vscode-languageserver/node";
import {fileURLToPath, pathToFileURL} from 'url';
import {dirname, sep} from 'path';
import {readdir} from 'fs/promises';
import {readFile} from "./utils/files";

type DocumentCache = {
    settings?: ProVerifSettings,

    identifier: TextDocumentIdentifier,
    document?: TextDocument,
    filesystemContent?: string,

    parseLibraryDependenciesResult?: ParseLibraryDependenciesResult,
    consumers?: Set<TextDocumentIdentifier>,

    invokeProverifResult?: InvokeProverifResult,
    parseProverifResult?: ParseProverifResult,
    createSymbolTableResult?: CreateSymbolTableResult
}

export class CachedTaskExecutor {
    private documentCache: Map<string, DocumentCache> = new Map();
    private folderCache: Set<string> = new Set();

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

    public markSettingsChanged = (identifier: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(identifier.uri) ?? {identifier};
        cache.settings = undefined;
        this.documentCache.set(identifier.uri, cache);

        this.folderCache = new Set<string>
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
            cache.parseProverifResult = parseProverif(text, selfIsLibrary);
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.parseProverifResult};
    };

    public createSymbolTable = async (identifier: TextDocumentIdentifier) => {
        const {parserTree} = await this.parse(identifier);

        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        if (parserTree && !cache.createSymbolTableResult) {
            cache.createSymbolTableResult = createSymbolTable(parserTree);
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.createSymbolTableResult};
    };

    private readSettings = async (identifier: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        if (!cache.settings) {
            cache.settings = await getDocumentSettings(this.connection, this.hasConfigurationCapability, identifier);
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.settings};
    };

    public parseLibraryDependencies = async (identifier: TextDocumentIdentifier) => {
        const selfIsLibrary = identifier.uri.endsWith('.pvl');
        const {text} = await this.getDocumentText(identifier);

        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        if (!cache.parseLibraryDependenciesResult) {
            const parseLibraryDependenciesResult = await parseLibraryDependencies(identifier, text);
            parseLibraryDependenciesResult.libraryDependencyTokens.forEach(token => {
                const dependency = this.documentCache.get(token.uri) ?? {identifier};
                const consumers = dependency.consumers ?? new Set<TextDocumentIdentifier>();
                consumers.add(identifier);
                dependency.consumers = consumers;
                this.documentCache.set(token.uri, dependency);
            });
            cache.parseLibraryDependenciesResult = parseLibraryDependenciesResult;
        }

        this.documentCache.set(identifier.uri, cache);

        return {selfIsLibrary, ...cache.parseLibraryDependenciesResult};
    };

    public getDocumentText = async (identifier: TextDocumentIdentifier) => {
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

    public getConsumers = async (identifier: TextDocumentIdentifier) => {
        const path = fileURLToPath(identifier.uri)
        const folder = dirname(path)
        if (!this.folderCache.has(folder)) {
            const {parentFolderDiscoveryLimit} = await this.readSettings(identifier);

            await this.discoverFolder(folder, parentFolderDiscoveryLimit)
            this.folderCache.add(folder)
        }

        const cache = this.documentCache.get(identifier.uri) ?? {identifier};
        return cache.consumers ?? new Set<TextDocumentIdentifier>();
    };

    private discoveredFolders: Set<string> = new Set();
    private discoverFolder = async (folder: string, parentFolderDiscoveryLimit: number) => {
        const workspaceFolders = await this.connection.workspace.getWorkspaceFolders()
        if (!workspaceFolders) {
            return
        }

        const folderWhitelist = workspaceFolders.map(workspaceFolder => fileURLToPath(workspaceFolder.uri))

        // check folders
        let discoveredFolderCount = 0;
        let currentFolder = folder
        while (parentFolderDiscoveryLimit === -1 || discoveredFolderCount <= parentFolderDiscoveryLimit) {
            console.log("looking in " + currentFolder)
            if (!folderWhitelist.some(whitelistedFolder => currentFolder.startsWith(whitelistedFolder))) {
                console.log("ignoring folder not in whitelist")
                return
            }

            if (!this.discoveredFolders.has(currentFolder)) {
                const entries = await readdir(currentFolder, { withFileTypes: true })
                const fileUrls = entries.filter(entry => entry.isFile()).map(file => pathToFileURL(currentFolder + sep + file.name))
                await Promise.all(fileUrls.map(fileUrl => this.parseLibraryDependencies({ uri: fileUrl.toString()})))

                this.discoveredFolders.add(currentFolder)
            }

            currentFolder = dirname(currentFolder)
            discoveredFolderCount++
        }
    }
}