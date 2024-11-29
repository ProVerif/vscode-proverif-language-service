import {TextDocument} from "vscode-languageserver-textdocument";
import {TextDocumentIdentifier} from "vscode-languageserver";
import {Connection} from "vscode-languageserver/node";
import {DocumentManager as ProverifDocumentManager, ProverifDocument} from "./proverif/document_manager";
import {fileURLToPath} from "url";
import {readFile} from "./utils/files";
import {getDocumentSettings, Settings} from "./utils/settings";
import {DocumentManager as ProverifLogDocumentManager, ProverifLogDocument} from "./proverif_log/document_manager";

type DocumentCache = {
    identifier: TextDocumentIdentifier,

    settings?: Settings,
    document?: TextDocument,
    filesystemText?: string,
}

export enum DocumentType {
    ProVerif = 1,
    ProVerifLog = 2,
}

export interface DocumentManagerInterface {
    markSettingsChanged(): Promise<void>;

    closeDocument(identifier: TextDocumentIdentifier): void;

    markDocumentContentChanged(document: TextDocument): Promise<void>;

    markFilesystemDocumentContentChanged(document: TextDocument): Promise<void>;

    getDocumentType(identifier: TextDocumentIdentifier): DocumentType | undefined;

    getProverifLogDocument(identifier: TextDocumentIdentifier): Promise<ProverifLogDocument | undefined>;

    getProverifDocument(identifier: TextDocumentIdentifier): Promise<ProverifDocument | undefined>;

    getConsumers(identifier: TextDocumentIdentifier): Promise<TextDocumentIdentifier[]>;
}

export class DocumentManager implements DocumentManagerInterface {
    private documentCache: Map<string, DocumentCache> = new Map();
    private proverifDocumentManager: ProverifDocumentManager;
    private proverifLogDocumentManager: ProverifLogDocumentManager;

    constructor(private connection: Connection, private hasConfigurationCapability: boolean) {
        this.proverifDocumentManager = new ProverifDocumentManager(connection, this.getDocumentText, this.getDocumentSettings);
        this.proverifLogDocumentManager = new ProverifLogDocumentManager(connection);
    }

    public markSettingsChanged = async () => {
        const processingDocuments = Array.from(this.documentCache.keys())
            .map(key => ({uri: key}))
            .map(async document => {
                const cache: DocumentCache = this.documentCache.get(document.uri) ?? {identifier: document};
                cache.settings = undefined;
                this.documentCache.set(document.uri, cache);

                if (this.proverifDocumentManager.supports(document)) {
                    await this.proverifDocumentManager.markSettingsChanged(document);
                }
            });
        await Promise.all(processingDocuments);
    };

    public markDocumentContentChanged = async (document: TextDocument) => {
        const cache: DocumentCache = this.documentCache.get(document.uri) ?? {identifier: document};
        cache.document = document;
        this.documentCache.set(document.uri, cache);

        if (this.proverifDocumentManager.supports(document)) {
            await this.proverifDocumentManager.markDocumentChanged(document);
        }

        if (this.proverifLogDocumentManager.supports(document)) {
            await this.proverifLogDocumentManager.markDocumentChanged(document);
        }
    };

    public markFilesystemDocumentContentChanged = async (document: TextDocument) => {
        const cache: DocumentCache = this.documentCache.get(document.uri) ?? {identifier: document};
        cache.document = document;
        cache.filesystemText = undefined;
        this.documentCache.set(document.uri, cache);

        // we do not need to update out cache, as if it saved on the file system, then it is also open in VSCode (hence markDocumentContentChanged called)
        if (this.proverifDocumentManager.supports(document)) {
            const dependingDocuments = this.proverifDocumentManager.findDependingDocuments(document);
            const tasks = dependingDocuments.map(dependingDocument => this.proverifDocumentManager.markDocumentDependencyChanged(dependingDocument));

            await Promise.all(tasks);
        }
    };

    public closeDocument = (document: TextDocumentIdentifier) => {
        this.documentCache.delete(document.uri);

        if (this.proverifDocumentManager.supports(document)) {
            this.proverifDocumentManager.forget(document);
        }
    };

    public getDocumentType = (document: TextDocumentIdentifier): DocumentType | undefined => {
        if (this.proverifDocumentManager.supports(document)) {
            return DocumentType.ProVerif;
        }

        if (this.proverifLogDocumentManager.supports(document)) {
            return DocumentType.ProVerifLog;
        }

        return undefined;
    };

    public getProverifDocument = async (identifier: TextDocumentIdentifier): Promise<ProverifDocument | undefined> => {
        if (this.proverifDocumentManager.supports(identifier)) {
            return this.proverifDocumentManager.getProverifDocument(identifier);
        }

        return undefined;
    };

    public getConsumers = async (identifier: TextDocumentIdentifier): Promise<TextDocumentIdentifier[]> => {
        if (this.proverifDocumentManager.supports(identifier)) {
            return await this.proverifDocumentManager.getConsumers(identifier);
        }

        return [];
    };

    public getProverifLogDocument = async (identifier: TextDocumentIdentifier): Promise<ProverifLogDocument | undefined> => {
        const cache = this.documentCache.get(identifier.uri);

        if (cache?.document && this.proverifLogDocumentManager.supports(identifier)) {
            return this.proverifLogDocumentManager.getProverifLogDocument(cache.document);
        }

        return undefined;
    };

    private getDocumentText = async (identifier: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        let text = cache.document?.getText();
        if (text === undefined) {
            if (!cache.filesystemText) {
                const path = fileURLToPath(identifier.uri);
                cache.filesystemText = await readFile(path);
            }

            text = cache.filesystemText;
        }

        this.documentCache.set(identifier.uri, cache);

        return text;
    };

    private getDocumentSettings = async (identifier: TextDocumentIdentifier) => {
        const cache = this.documentCache.get(identifier.uri) ?? {identifier};

        if (!cache.settings) {
            cache.settings = await getDocumentSettings(this.connection, this.hasConfigurationCapability, identifier);
        }

        this.documentCache.set(identifier.uri, cache);

        return {...cache.settings};
    };
}