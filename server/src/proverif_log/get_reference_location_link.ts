import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {Range} from "vscode-languageserver/node";
import {DocumentManagerInterface} from "../document_manager";

const PROCESS_REFERENCE = /(\{\d+\})/;

export const getReferenceLocationLink = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface)=> {
    const document = await documentManager.getProverifLogDocument(identifier);
    if (!document) {
        return undefined;
    }

    const offset = 6; // supports tokens with 4 numbers; e.g. {3121}
    const safePositionStart: Position = { line: position.line, character: position.character-offset };
    const safePositionEnd: Position = { line: position.line, character: position.character+offset };
    const textAroundPosition = document.document.getText(Range.create(safePositionStart, safePositionEnd));

    const processReferenceMatch = textAroundPosition.match(PROCESS_REFERENCE);
    if (!processReferenceMatch?.index) {
        return undefined;
    }

    // find origin selection range
    const matchStart: Position = { line: safePositionStart.line, character: safePositionStart.character + processReferenceMatch.index }
    const matchEnd: Position = { line: matchStart.line, character: matchStart.character + processReferenceMatch[1].length }
    const originSelectionRange = Range.create(matchStart, matchEnd);
    if (matchStart > position || position > matchEnd) {
        return undefined;
    }

    // find target range from the start of the file
    let targetStart: Position|undefined = undefined;
    let currentLine = 0;
    const linesPerIteration = 100;
    while (currentLine < document.document.lineCount) {
        const currentStart = { line: currentLine, character: 0};
        const text = document.document.getText(Range.create(currentStart, {line: currentStart.line+linesPerIteration, character: 0}));

        const targetMatch = text.indexOf(processReferenceMatch[1]);
        if (targetMatch >= 0) {
            const startOffset = document.document.offsetAt(currentStart)
            targetStart = document.document.positionAt(startOffset + targetMatch)

            break;
        }

        currentLine += linesPerIteration;
    }

    if (!targetStart) {
        return undefined;
    }

    const targetRange = Range.create(targetStart, {line: targetStart.line, character: processReferenceMatch[1].length});
    return LocationLink.create(identifier.uri, targetRange, targetRange, originSelectionRange);
}