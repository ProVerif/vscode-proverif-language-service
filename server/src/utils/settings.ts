import {Connection} from "vscode-languageserver/node";
import {TextDocumentIdentifier} from "vscode-languageserver";

export type ProVerifSettings = {
    proverifBinary: string;
}

type RawProVerifSettings = {
    proverifPath?: string;
}

const defaultSettings: ProVerifSettings = {proverifBinary: 'proverif'};
export const getDocumentSettings = async (connection: Connection, hasConfigurationCapability: boolean, document: TextDocumentIdentifier): Promise<ProVerifSettings> => {
    if (!hasConfigurationCapability) {
        return defaultSettings;
    }

    const config = await connection.workspace.getConfiguration({
        scopeUri: document.uri,
        section: 'proverif'
    }) as RawProVerifSettings;

    return {
        proverifBinary: config.proverifPath ?? defaultSettings.proverifBinary
    };
};