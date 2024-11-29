import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {Range} from "vscode-languageserver/node";
import {DocumentManagerInterface} from "../document_manager";
import {findFirstOccurrenceInDocument} from "./scanner";

const PROCESS_REFERENCE = /(\{\d+\})/;

export const getReferenceLocationLink = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface)=> {
    const document = await documentManager.getProverifLogDocument(identifier);
    if (!document) {
        return undefined;
    }

    const offset = 6; // supports tokens with 4 numbers; e.g. {3121}
    const safePositionStart: Position = { line: position.line, character: Math.max(position.character-offset, 0) };
    const safePositionEnd: Position = { line: position.line, character: position.character+offset };
    const textAroundPosition = document.document.getText(Range.create(safePositionStart, safePositionEnd));
    const processReferenceMatch = textAroundPosition.match(PROCESS_REFERENCE);
    if (!processReferenceMatch?.index) {
        return undefined;
    }

    // find origin selection range
    const matchStart: Position = { line: safePositionStart.line, character: safePositionStart.character + processReferenceMatch.index };
    const matchEnd: Position = { line: matchStart.line, character: matchStart.character + processReferenceMatch[1].length };
    const originSelectionRange = Range.create(matchStart, matchEnd);
    if (matchStart > position || position > matchEnd) {
        return undefined;
    }

    // find target range from the start of the file
    const targetStart = findFirstOccurrenceInDocument(document.document, processReferenceMatch[1]);
    if (!targetStart) {
        return undefined;
    }

    const targetRange = Range.create(targetStart, {line: targetStart.line, character: targetStart.character + processReferenceMatch[1].length});
    return LocationLink.create(identifier.uri, targetRange, targetRange, originSelectionRange);
};