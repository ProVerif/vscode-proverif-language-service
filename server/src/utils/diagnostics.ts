import {Connection, Diagnostic} from "vscode-languageserver/node";
import {TextDocumentIdentifier} from "vscode-languageserver";

export const sendDiagnostics = async (connection: Connection, document: TextDocumentIdentifier, diagnostics: Diagnostic[]) => {
    await connection.sendDiagnostics({uri: document.uri, diagnostics});
};