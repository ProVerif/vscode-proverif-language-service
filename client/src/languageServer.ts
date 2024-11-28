import * as path from 'path';
import {ExtensionContext, window} from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import {NotificationType} from "vscode-languageclient";

let client: LanguageClient;
const NotifyUserNotification = new NotificationType<string>('custom/notifyUser');

export const startLanguageServer = async (context: ExtensionContext) => {
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc }
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'pv' }, { scheme: 'file', language: 'pv.log' }],
	};

	client = new LanguageClient(
		'languageServerProVerif',
		'ProVerif Language Server',
		serverOptions,
		clientOptions
	);

	client.onNotification(NotifyUserNotification, (params) => {
		window.showWarningMessage(params);
	});

	await client.start();
};


export const stopLanguageServer = async () => {
	await client?.stop();
};