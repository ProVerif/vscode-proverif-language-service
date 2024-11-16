import * as path from 'path';
import {ExtensionContext, window} from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export const startLanguageServer = async (context: ExtensionContext) => {
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc }
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'pv' }],
	};

	client = new LanguageClient(
		'languageServerProVerif',
		'ProVerif Language Server',
		serverOptions,
		clientOptions
	);

	client.onNotification('custom/notifyUser', (params) => {
		window.showWarningMessage(params.message);
	});

	await client.start();
};


export const stopLanguageServer = async () => {
	await client?.stop();
};