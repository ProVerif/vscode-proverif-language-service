import {Connection, Diagnostic} from "vscode-languageserver/node";
import {TextDocumentIdentifier} from "vscode-languageserver";

export const sendNotification = async (connection: Connection, message: string) => {
    await connection.sendNotification('custom/notifyUser', message);
};