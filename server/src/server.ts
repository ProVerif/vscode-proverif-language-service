import {
    createConnection,
    DidChangeConfigurationNotification,
    InitializeParams,
    InitializeResult,
    ProposedFeatures,
    TextDocuments,
    TextDocumentSyncKind
} from 'vscode-languageserver/node';
import {TextDocument} from 'vscode-languageserver-textdocument';
import {
    TaskExecutor,
} from "./tasks";
import {getDefinitionLink} from "./go_to_definition";

// Create a connection for the server, using Node's IPC as transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let taskExecutor: TaskExecutor|undefined = undefined;

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;
    hasConfigurationCapability = !!(
        capabilities.workspace && !!capabilities.workspace.configuration
    );
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);

    taskExecutor = new TaskExecutor(connection, hasConfigurationCapability);

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Full,
            // definitionProvider: true 
        },
    };

	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}

    return result;
});

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }
});

connection.onDidChangeConfiguration(async _ => taskExecutor?.markSettingsChanged());
documents.onDidClose(event => taskExecutor?.closeDocument(event.document));
documents.onDidChangeContent(async event => taskExecutor?.markDocumentContentChanged(event.document));

connection.onDefinition(async (params) => {
    const parseResult = await taskExecutor?.getParseResult(params.textDocument);
    if (!parseResult) {
        connection.console.error("Parsing failed.");
        return undefined;
    }

    const definitionLink = await getDefinitionLink(parseResult, params.position);
    if (!definitionLink) {
        connection.console.log("Definition not found.");
        return undefined;
    }
    return [definitionLink];
});

documents.listen(connection);
connection.listen();
