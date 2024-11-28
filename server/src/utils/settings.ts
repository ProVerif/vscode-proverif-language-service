import {Connection} from "vscode-languageserver/node";
import {TextDocumentIdentifier} from "vscode-languageserver";

export type Settings = {
    proverifBinary: string;
    parentFolderDiscoveryLimit: number
}

type RawSettings = {
    proverifPath?: string;
    parentFolderDiscoveryLimit: number
}

const defaultSettings: Settings = {proverifBinary: 'proverif', parentFolderDiscoveryLimit: 1};
export const getDocumentSettings = async (connection: Connection, hasConfigurationCapability: boolean, document: TextDocumentIdentifier): Promise<Settings> => {
    if (!hasConfigurationCapability) {
        return defaultSettings;
    }

    const config = await connection.workspace.getConfiguration({
        scopeUri: document.uri,
        section: 'proverif'
    }) as RawSettings;

    return {
        proverifBinary: config.proverifPath ?? defaultSettings.proverifBinary,
        parentFolderDiscoveryLimit: config.parentFolderDiscoveryLimit
    };
};