import {Position, TextDocumentIdentifier} from "vscode-languageserver";
import {ParseResult} from "./document_manager";
import {WorkspaceEdit} from "vscode-languageserver-protocol";

export const rename = async (uri: TextDocumentIdentifier, parseResult: ParseResult, position: Position, newName: string): Promise<WorkspaceEdit | undefined> => {
    return undefined;
};
