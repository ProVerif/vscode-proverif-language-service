import {Position, TextDocumentIdentifier} from "vscode-languageserver";
import {Range} from "vscode-languageserver/node";
import {DocumentManagerInterface} from "../document_manager";

export const getReferenceLocationLink = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface)=> {
    const document = await documentManager.getProverifLogDocument(identifier);
    if (!document) {
        return undefined;
    }

    const offset = 6; // supports tokens with 4 numbers; e.g. {3121}
    const safePositionStart: Position = { line: position.line, character: position.character-offset };
    const safePositionEnd: Position = { line: position.line, character: position.character-offset };
    const textAroundPosition = document.document.getText(Range.create(safePositionStart, safePositionEnd));


    return undefined;
}