
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
import {TextDocument} from "vscode-languageserver-textdocument";
import {Connection} from "vscode-languageserver/node";

export type ProVerifSettings = {
    proverifPath?: string;
}

const defaultSettings: ProVerifSettings = {proverifPath: undefined};
export const getDocumentSettings = async (connection: Connection, hasConfigurationCapability: boolean, document: TextDocument): Promise<ProVerifSettings> => {
    if (!hasConfigurationCapability) {
        return defaultSettings;
    }

    return await connection.workspace.getConfiguration({
        scopeUri: document.uri,
        section: 'proverif'
    });
};