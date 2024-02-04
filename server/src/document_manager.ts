import {TextDocument} from "vscode-languageserver-textdocument";
import {LibraryDependencyToken} from "./tasks/parse_library_dependencies";
import {logMessages} from "./utils/log";
import {sendDiagnostics} from "./utils/diagnostics";
import {ParseProverifResult} from "./tasks/parse_proverif";
import {CreateSymbolTableResult} from "./tasks/create_symbol_table";
import {TextDocumentIdentifier} from "vscode-languageserver";
import {Connection} from "vscode-languageserver/node";
import {joinOptionalLists} from "./utils/array";
import {CachedTaskExecutor} from "./cached_task_executor";

export type ParseResult = ParseProverifResult & CreateSymbolTableResult & {
    identifier: TextDocumentIdentifier
    dependencyTokens: LibraryDependencyToken[]
};

export type DependencySymbolTable = TextDocumentIdentifier & CreateSymbolTableResult & LibraryDependencyToken;

export interface DocumentManagerInterface {
    markSettingsChanged(): Promise<void>
    closeDocument(identifier: TextDocumentIdentifier): void
    markDocumentContentChanged(document: TextDocument): Promise<void>
    markFilesystemDocumentContentChanged(document: TextDocument): Promise<void>
    getParseResult(identifier: TextDocumentIdentifier): Promise<ParseResult | undefined>
}

export class DocumentManager implements DocumentManagerInterface {
    private taskExecutor: CachedTaskExecutor;

    constructor(private connection: Connection, hasConfigurationCapability: boolean) {
        this.taskExecutor = new CachedTaskExecutor(connection, hasConfigurationCapability);
    }

    public markSettingsChanged = async () => {
        const processingDocuments = this.taskExecutor.allDocuments()
            .map(async document => {
                this.taskExecutor.markSettingsChanged(document);
                await this.checkParsingErrors(document);
            });
        await Promise.all(processingDocuments);
    };

    public closeDocument = (identifier: TextDocumentIdentifier) => {
        this.taskExecutor.forget(identifier);
    };

    public markDocumentContentChanged = async (document: TextDocument) => {
        this.taskExecutor.markDocumentChanged(document, document);

        await this.checkParsingErrors(document);
    };

    public markFilesystemDocumentContentChanged = async (document: TextDocument) => {
        const dependingDocuments = this.taskExecutor.findDependingDocuments(document);
        const tasks = dependingDocuments.map(dependingDocument => {
            this.taskExecutor.markDocumentDependencyChanged(dependingDocument);
            return this.checkParsingErrors(dependingDocument);
        });

        await Promise.all(tasks);
    };

    private checkParsingErrors = async (identifier: TextDocumentIdentifier) => {
        const parseLibraryDependenciesResult = await this.taskExecutor.parseLibraryDependencies(identifier);
        const invokeProverifResult = await this.taskExecutor.invoke(identifier);

        const messages = joinOptionalLists(parseLibraryDependenciesResult?.messages, invokeProverifResult?.messages);
        logMessages(this.connection, messages);

        const diagnostics = joinOptionalLists(parseLibraryDependenciesResult?.diagnostics, invokeProverifResult?.diagnostics);
        await sendDiagnostics(this.connection, identifier, diagnostics);
    };

    public getParseResult = async (identifier: TextDocumentIdentifier): Promise<ParseResult | undefined> => {
        const {parser, parserTree} = await this.taskExecutor.parse(identifier);
        const {symbolTable} = await this.taskExecutor.createSymbolTable(identifier);

        if (!parser || !parserTree || !symbolTable) {
            return undefined;
        }

        const {libraryDependencyTokens} = await this.taskExecutor.parseLibraryDependencies(identifier);

        return {identifier, parser, parserTree, symbolTable, dependencyTokens: libraryDependencyTokens};
    };
}