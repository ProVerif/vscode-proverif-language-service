import {Location, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {ParseResult} from "./document_manager";

export const getReferences = async (uri: TextDocumentIdentifier, parseResult: ParseResult, position: Position): Promise<Location[] | undefined> => {
    // TODO implement
    // go to definition
    // collect references:
    // - filter tokens for text match (starting from definition of token)
    // - for each matching token check if go to definition matches
    // for each consumer of file, do the same
    return undefined;
};
