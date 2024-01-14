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
    DocumentManager,
} from "./document_manager";
import {getDefinitionLink, getDocumentLinks} from "./go_to_definition";
import {rename} from "./rename";
import {getReferences} from "./references";

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

let documentManager: DocumentManager|undefined = undefined;

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;
    hasConfigurationCapability = !!(
        capabilities.workspace && !!capabilities.workspace.configuration
    );
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);

    documentManager = new DocumentManager(connection, hasConfigurationCapability);

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Full,
            definitionProvider: true,
            documentLinkProvider: { },
            renameProvider: { },
            referencesProvider: { }
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

connection.onDidChangeConfiguration(async _ => documentManager?.markSettingsChanged());
documents.onDidClose(event => documentManager?.closeDocument(event.document));
documents.onDidChangeContent(async event => documentManager?.markDocumentContentChanged(event.document));
documents.onDidSave(async event => documentManager?.markFilesystemDocumentContentChanged(event.document));

connection.onDefinition(async (params) => {
    const parseResult = await documentManager?.getParseResult(params.textDocument);
    if (!parseResult) {
        connection.console.error("Parsing failed.");
        return undefined;
    }

    const definitionLink = await getDefinitionLink(params.textDocument, parseResult, params.position);
    if (!definitionLink) {
        connection.console.log("Definition not found.");
        return undefined;
    }
    return [definitionLink];
});

connection.onDocumentLinks(async params => {
    const parseResult = await documentManager?.getParseResult(params.textDocument);
    if (!parseResult) {
        connection.console.error("Parsing failed.");
        return undefined;
    }

    return await getDocumentLinks(parseResult);
});

connection.onRenameRequest(async params => {
    const parseResult = await documentManager?.getParseResult(params.textDocument);
    if (!parseResult) {
        connection.console.error("Parsing failed.");
        return undefined;
    }

    return rename(params.textDocument, parseResult, params.position, params.newName);
});

connection.onReferences(async params => {
    const parseResult = await documentManager?.getParseResult(params.textDocument);
    if (!parseResult) {
        connection.console.error("Parsing failed.");
        return undefined;
    }

    const references = await getReferences(params.textDocument, parseResult, params.position);
    if (!references) {
        connection.console.log("References not found.");
        return undefined;
    }

    return references;
});

documents.listen(connection);
connection.listen();
