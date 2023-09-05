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
import {CachedTaskExecutor} from "./cached_task_executor";

export type ParseResult = ParseProverifResult & CreateSymbolTableResult;

export class DocumentManager {
    private taskExecutor: CachedTaskExecutor;

    constructor(
        private connection: Connection,
        hasConfigurationCapability: boolean) {
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

    public closeDocument = (document: TextDocumentIdentifier) => {
        this.taskExecutor.forget(document);
    };

    public markDocumentContentChanged = async (document: TextDocument) => {
        this.taskExecutor.markDocumentChanged(document, document);

        await this.checkParsingErrors(document);
    };

    private checkParsingErrors = async (document: TextDocumentIdentifier) => {
        const parseLibraryDependenciesResult = await this.taskExecutor.parseLibraryDependencies(document);
        const invokeProverifResult = await this.taskExecutor.invoke(document);

        const messages = joinOptionalLists(parseLibraryDependenciesResult?.messages, invokeProverifResult?.messages);
        logMessages(this.connection, messages);

        const diagnostics = joinOptionalLists(parseLibraryDependenciesResult?.diagnostics, invokeProverifResult?.diagnostics);
        await sendDiagnostics(this.connection, document, diagnostics);
    };

    public getParseResult = async (identification: TextDocumentIdentifier): Promise<ParseResult | undefined> => {
        const {parser, parserTree} = await this.taskExecutor.parse(identification);
        const {symbolTable} = await this.taskExecutor.createSymbolTable(identification);

        if (!parser || !parserTree || !symbolTable) {
            return undefined;
        }

        return {parser, parserTree, symbolTable};
    };
}
