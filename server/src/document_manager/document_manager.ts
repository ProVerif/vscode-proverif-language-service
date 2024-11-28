import {TextDocument} from "vscode-languageserver-textdocument";
import {LibraryDependencyToken} from "../proverif/parse_library_dependencies";
import {logMessages} from "../utils/log";
import {sendDiagnostics} from "../utils/diagnostics";
import {ParseProverifResult} from "../proverif/parse_proverif";
import {CreateSymbolTableResult} from "../proverif/symbol_table/create_symbol_table";
import {TextDocumentIdentifier} from "vscode-languageserver";
import {Connection} from "vscode-languageserver/node";
import {joinOptionalLists} from "../utils/array";
import {DocumentManager as ProverifDocumentManager} from "../proverif/document_manager";

export type ProverifDocument = Partial<ParseProverifResult> & Partial<CreateSymbolTableResult> & {
    identifier: TextDocumentIdentifier
    dependencyTokens: LibraryDependencyToken[]
};

export interface DocumentManagerInterface {
    markSettingsChanged(): Promise<void>;

    closeDocument(identifier: TextDocumentIdentifier): void;

    markDocumentContentChanged(document: TextDocument): Promise<void>;

    markFilesystemDocumentContentChanged(document: TextDocument): Promise<void>;

    getProverifDocument(identifier: TextDocumentIdentifier): Promise<ProverifDocument|undefined>;

    getConsumers(identifier: TextDocumentIdentifier): Promise<TextDocumentIdentifier[]>;
}

export class DocumentManager implements DocumentManagerInterface {
    private proverifDocumentManager: ProverifDocumentManager;

    constructor(private connection: Connection, hasConfigurationCapability: boolean) {
        this.proverifDocumentManager = new ProverifDocumentManager(connection, hasConfigurationCapability);
    }

    public markSettingsChanged = async () => {
        // possible improvement: check what setting has changed, and which documents are impacted
        const processingDocuments = this.proverifDocumentManager.allDocuments()
            .map(document => {
                this.proverifDocumentManager.markSettingsChanged(document);
                return this.checkProverifParsingErrors(document);
            });
        await Promise.all(processingDocuments);
    };

    public closeDocument = (identifier: TextDocumentIdentifier) => {
        if (this.proverifDocumentManager.supports(identifier)) {
            this.proverifDocumentManager.forget(identifier);
        }
    };

    public markDocumentContentChanged = async (document: TextDocument) => {
        if (this.proverifDocumentManager.supports(document)) {
            this.proverifDocumentManager.markDocumentChanged(document, document);
            await this.checkProverifParsingErrors(document);
        }
    };

    public markFilesystemDocumentContentChanged = async (document: TextDocument) => {
        if (this.proverifDocumentManager.supports(document)) {
            const dependingDocuments = this.proverifDocumentManager.findDependingDocuments(document);
            const tasks = dependingDocuments.map(dependingDocument => {
                this.proverifDocumentManager.markDocumentDependencyChanged(dependingDocument);
                return this.checkProverifParsingErrors(dependingDocument);
            });

            await Promise.all(tasks);
        }
    };

    public getProverifDocument = async (identifier: TextDocumentIdentifier): Promise<ProverifDocument|undefined> => {
        if (!this.proverifDocumentManager.supports(identifier)) {
            return;
        }

        const {parser, parserTree} = await this.proverifDocumentManager.parse(identifier);
        const {symbolTable} = await this.proverifDocumentManager.createSymbolTable(identifier);
        const {libraryDependencyTokens} = await this.proverifDocumentManager.parseLibraryDependencies(identifier);

        return {identifier, parser, parserTree, symbolTable, dependencyTokens: libraryDependencyTokens};
    };

    public getConsumers = async (identifier: TextDocumentIdentifier): Promise<TextDocumentIdentifier[]> => {
        if (this.proverifDocumentManager.supports(identifier)) {
            return await this.proverifDocumentManager.getConsumers(identifier);
        }

        return [];
    };

    private checkProverifParsingErrors = async (identifier: TextDocumentIdentifier) => {
        const parseLibraryDependenciesResult = await this.proverifDocumentManager.parseLibraryDependencies(identifier);
        const invokeProverifResult = await this.proverifDocumentManager.invoke(identifier);

        const messages = joinOptionalLists(parseLibraryDependenciesResult?.messages, invokeProverifResult?.messages);
        logMessages(this.connection, messages);

        const diagnostics = joinOptionalLists(parseLibraryDependenciesResult?.diagnostics, invokeProverifResult?.diagnostics);
        await sendDiagnostics(this.connection, identifier, diagnostics);
    };
}