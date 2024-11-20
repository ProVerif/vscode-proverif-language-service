import {
    createConnection,
    DidChangeConfigurationNotification,
    InitializeParams,
    InitializeResult,
    ProposedFeatures,
    ResponseError,
    TextDocuments,
    TextDocumentSyncKind
} from 'vscode-languageserver/node';
import {TextDocument} from 'vscode-languageserver-textdocument';
import {DocumentManager, DocumentManagerInterface,} from "./document_manager";
import {getDefinitionLocations} from "./go_to_definition";
import {rename} from "./rename";
import {getReferences} from "./references";
import {getSemanticTokens, tokenModifier, tokenTypes} from './semantic_token_provider';
import {getDocumentLinks} from "./document_links";
import {getSignatureHelp} from "./signature_help";
import {getHover} from "./hover";
import {getCompletion} from "./completion";

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

let documentManager: DocumentManagerInterface = new DocumentManager(connection, false);

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
            documentLinkProvider: {},
            referencesProvider: true,
            renameProvider: true,
            signatureHelpProvider: { triggerCharacters: ['('], retriggerCharacters: [',', ', '] },
            hoverProvider: true,
            completionProvider: { },
            semanticTokensProvider: {
                documentSelector: null, // use client-side definition
                legend: {tokenModifiers: tokenModifier, tokenTypes: tokenTypes},
                full: true,
                range: false
            },
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

connection.onDidChangeConfiguration(async _ => documentManager.markSettingsChanged());
documents.onDidClose(event => documentManager.closeDocument(event.document));
documents.onDidChangeContent(async event => documentManager.markDocumentContentChanged(event.document));
documents.onDidSave(async event => documentManager.markFilesystemDocumentContentChanged(event.document));

connection.onDefinition(async (params) => getDefinitionLocations(params.textDocument, params.position, documentManager));
connection.onHover(async (params) => getHover(params.textDocument, params.position, documentManager));
connection.onDocumentLinks(async params => getDocumentLinks(params.textDocument, documentManager));
connection.onSignatureHelp(async params => getSignatureHelp(params.textDocument, params.position, documentManager));
connection.onCompletion(async params => getCompletion(params.textDocument, params.position, documentManager));
connection.onRenameRequest(async params => rename(params.textDocument, params.position, params.newName, documentManager));
connection.onReferences(async params => getReferences(params.textDocument, params.position, documentManager));

connection.languages.semanticTokens.on(async params => {
    const semanticTokens = await getSemanticTokens(params.textDocument, documentManager);
    if (!semanticTokens) {
        connection.console.error("Retrieving semantic tokens failed.");
        return new ResponseError(3, 'Semantic tokens extraction failed', undefined);
    }

    return semanticTokens;
});

documents.listen(connection);
connection.listen();
