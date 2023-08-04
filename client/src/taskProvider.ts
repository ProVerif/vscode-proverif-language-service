import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { parseLibraryDependenciesNoValidate } from './proverif';
import {readFileSync} from "fs";

let customTaskProvider: vscode.Disposable | undefined;

export const startTaskProvider = async (context: ExtensionContext) => {
	customTaskProvider = vscode.tasks.registerTaskProvider(ProVerifTaskProvider.CustomBuildScriptType, new ProVerifTaskProvider());
};

export const stopTaskProvider = async () => {
	if (customTaskProvider) {
		customTaskProvider.dispose();
	}
};

class ProVerifTaskProvider implements vscode.TaskProvider {
	static CustomBuildScriptType = 'ProVerif';

	public async provideTasks(): Promise<vscode.Task[]> {
		return [this.getBuildTask()];
	}

	public resolveTask(_task: vscode.Task): vscode.Task | undefined {
		return undefined;
	}

	private getBuildTask(): vscode.Task {
		const currentFilepath = vscode.window.activeTextEditor?.document.uri.fsPath;
		const content = readFileSync(currentFilepath).toString();
		const libraryDependencies = parseLibraryDependenciesNoValidate(currentFilepath, content);

		const settings = vscode.workspace.getConfiguration('proverif', vscode.window.activeTextEditor?.document.uri);
		const proverifBinary = settings.proverifPath ? settings.proverifPath : 'proverif';

		const task = new vscode.Task({ type: ProVerifTaskProvider.CustomBuildScriptType }, vscode.TaskScope.Workspace, 'Build', ProVerifTaskProvider.CustomBuildScriptType, new vscode.ShellExecution(`${proverifBinary} ${libraryDependencies} ${currentFilepath}`));
		task.group = vscode.TaskGroup.Build;
		return task;
	}
}

