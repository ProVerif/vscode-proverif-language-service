import {Connection, Diagnostic} from "vscode-languageserver/node";
import {TextDocument} from "vscode-languageserver-textdocument";

export const sendDiagnostics = async (connection: Connection, document: TextDocument, diagnostics: Diagnostic[]) => {
    await connection.sendDiagnostics({uri: document.uri, diagnostics});
};