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
import {getDefinitionLink} from "./go_to_definition";
import {rename} from "./rename";
import {getReferences} from "./references";
import {getSemanticTokens, tokenModifier, tokenTypes} from './semantic_token_provider';
import {getDocumentLinks} from "./document_links";
import {getSignatureHelp} from "./signature_help";
import {getHover} from "./hover";
import {CompletionTriggerKind} from "vscode-languageserver";
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

connection.onDefinition(async (params) => {
    const definitionLink = await getDefinitionLink(params.textDocument, params.position, documentManager);
    if (!definitionLink) {
        return undefined;
    }

    return [definitionLink];
});

connection.onHover(async (params) => {
    const hover = await getHover(params.textDocument, params.position, documentManager);
    if (!hover) {
        return undefined;
    }

    return hover;
});

connection.onDocumentLinks(async params => {
    const parseResult = await documentManager.getParseResult(params.textDocument);
    if (!parseResult) {
        return undefined;
    }

    return await getDocumentLinks(parseResult);
});

connection.onSignatureHelp(async params => {
    const signatureHelp = await getSignatureHelp(params.textDocument, params.position, documentManager);
    if (!signatureHelp) {
        return undefined;
    }

    return signatureHelp;
});

connection.onCompletion(async params => {
    const completions = await getCompletion(params.textDocument, params.position, documentManager);
    if (!completions) {
        return undefined;
    }

    return completions;
})

connection.languages.semanticTokens.on(async params => {
    const parseResult = await documentManager.getParseResult(params.textDocument);
    if (!parseResult) {
        connection.console.error("Parsing failed.");
        return new ResponseError(2, 'Parsing failed', undefined);
    }

    const semanticTokens = await getSemanticTokens(parseResult, documentManager);
    if (!semanticTokens) {
        connection.console.error("Retrieving semantic tokens failed.");
        return new ResponseError(3, 'Semantic tokens extraction failed', undefined);
    }

    return semanticTokens;
});

connection.onRenameRequest(async params => {
    return rename(params.textDocument, params.position, params.newName, documentManager);
});

connection.onReferences(async params => {
    const references = await getReferences(params.textDocument, params.position, documentManager);
    if (!references) {
        return undefined;
    }

    return references;
});

documents.listen(connection);
connection.listen();
