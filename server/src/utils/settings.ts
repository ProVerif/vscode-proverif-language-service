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