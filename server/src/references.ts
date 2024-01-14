import {Location, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {ParseResult} from "./document_manager";

export const getReferences = async (uri: TextDocumentIdentifier, parseResult: ParseResult, position: Position): Promise<Location[] | undefined> => {
    return undefined;
};
