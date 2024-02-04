import {Position, TextDocumentIdentifier} from "vscode-languageserver";
import {DocumentManagerInterface, ParseResult} from "./document_manager";
import {WorkspaceEdit} from "vscode-languageserver-protocol";

export const rename = async (uri: TextDocumentIdentifier, position: Position, newName: string, documentManager: DocumentManagerInterface): Promise<WorkspaceEdit | undefined> => {
    // TODO implement. Use concept of references.
    return undefined;
};
