import {Location, LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {ParseResult} from "./document_manager";
import {WorkspaceEdit} from "vscode-languageserver-protocol";

export const getReferences = async (uri: TextDocumentIdentifier, parseResult: ParseResult, position: Position): Promise<Location[] | undefined> => {
    return undefined
}
