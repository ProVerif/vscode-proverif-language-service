import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {Range} from "vscode-languageserver/node";
import {DocumentManagerInterface} from "../document_manager";
import {findFirstOccurrenceInDocument, findFirstLineStartInDocumentBackwards} from "./scanner";
import {ProverifLogDocument} from "./document_manager";

const PROCESS_REFERENCE = /(\{\d+\})/;
const STEP_REFERENCE = /(by \d+)/;

export const getReferenceLocationLink = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface)=> {
    const document = await documentManager.getProverifLogDocument(identifier);
    if (!document) {
        return undefined;
    }

    const processReferenceMatch = matchProcessReference(document, position);
    if (processReferenceMatch) {
        return processReferenceMatch;
    }

    const stepReference = matchStepReference(document, position);
    if (stepReference) {
        return stepReference;
    }

    return undefined;
};

const matchProcessReference = (document: ProverifLogDocument, position: Position) => {
    const offset = 6; // supports tokens with 4 numbers; e.g. "{3121}"
    const result = matchAroundPosition(document, position, offset, PROCESS_REFERENCE);
    if (!result) {
        return undefined;
    }

    const { selectionRange, match } = result;

    // find target range from the start of the file
    const targetStart = findFirstOccurrenceInDocument(document.document, match);
    if (!targetStart) {
        return undefined;
    }

    const targetRange = Range.create(targetStart, {line: targetStart.line, character: targetStart.character + match.length});
    return LocationLink.create(document.document.uri, targetRange, targetRange, selectionRange);
};

const matchStepReference = (document: ProverifLogDocument, position: Position) => {
    const offset = 6; // supports tokens with 3 steps; e.g. "by 223"
    const result = matchAroundPosition(document, position, offset, STEP_REFERENCE);
    if (!result) {
        return undefined;
    }

    const { matchStart, selectionRange, match } = result;

    // find first match before the current position
    const matchedNumber = match.substring(3); // cut off "by " to just be left with the number
    const targetStart = findFirstLineStartInDocumentBackwards(document.document, matchedNumber + ". ", matchStart);
    if (!targetStart) {
        return undefined;
    }

    const targetRange = Range.create(targetStart, {line: targetStart.line, character: targetStart.character + matchedNumber.length});
    return LocationLink.create(document.document.uri, targetRange, targetRange, selectionRange);
};


const matchAroundPosition = (document: ProverifLogDocument, position: Position, offset: number, match: RegExp) => {
    const safePositionStart: Position = {line: position.line, character: Math.max(position.character - offset, 0)};
    const safePositionEnd: Position = {line: position.line, character: position.character + offset};
    const textAroundPosition = document.document.getText(Range.create(safePositionStart, safePositionEnd));
    const processReferenceMatch = textAroundPosition.match(STEP_REFERENCE);
    if (!processReferenceMatch?.index) {
        return undefined;
    }

    // find origin selection range
    const matchStart: Position = {        line: safePositionStart.line, character: safePositionStart.character + processReferenceMatch.index};
    const matchEnd: Position = {        line: matchStart.line, character: matchStart.character + processReferenceMatch[1].length };
    const selectionRange = Range.create(matchStart, matchEnd);
    if (matchStart > position || position > matchEnd) {
        return undefined;
    }

    return { matchStart, selectionRange, match: processReferenceMatch[1] };
};