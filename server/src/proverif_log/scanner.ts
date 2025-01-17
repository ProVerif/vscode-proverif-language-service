import {TextDocument} from "vscode-languageserver-textdocument";
import {Position} from "vscode-languageserver";
import {Range} from "vscode-languageserver/node";

const WINDOW_SIZE = 100;

const scanDocument = (document: TextDocument, continueScan: (text: string, currentStart: Position) => boolean) => {
    let currentLine = 0;
    while (currentLine < document.lineCount) {
        const currentStart = {line: currentLine, character: 0};
        const text = document.getText(Range.create(currentStart, {
            line: currentStart.line + WINDOW_SIZE,
            character: 0
        }));

        const doContinue = continueScan(text, currentStart);
        if (!doContinue) {
            break;
        }

        currentLine += WINDOW_SIZE;
    }
};

const scanDocumentBackwards = (document: TextDocument, start: Position, continueScan: (text: string, currentStart: Position) => boolean) => {
    let currentEnd = start;
    while (currentEnd.line > 0 || currentEnd.character > 0) {
        const currentStart = {line: Math.max(0, currentEnd.line - WINDOW_SIZE), character: 0};
        const text = document.getText(Range.create(currentStart, currentEnd));

        const doContinue = continueScan(text, currentStart);
        if (!doContinue) {
            break;
        }

        currentEnd = currentStart;
    }
};

export const findFirstOccurrenceInDocument = (document: TextDocument, candidate: string): Position | undefined => {
    let result: Position | undefined = undefined;

    scanDocument(document, (text: string, currentStart: Position) => {
        const targetMatch = text.indexOf(candidate);
        if (targetMatch === -1) {
            return true;
        }

        const startOffset = document.offsetAt(currentStart);
        result = document.positionAt(startOffset + targetMatch);
        return false;
    });

    return result;
};

export const findFirstLineStartInDocumentBackwards = (document: TextDocument, candidate: string, start: Position): Position | undefined => {
    let result: Position | undefined = undefined;

    scanDocumentBackwards(document, start, (text: string, currentStart: Position) => {
        const targetMatch = text.lastIndexOf(candidate);
        if (targetMatch === -1) {
            return true;
        }

        const startOffset = document.offsetAt(currentStart);
        const candidatePosition = document.positionAt(startOffset + targetMatch);
        if (candidatePosition.character !== 0) {
            return true;
        }

        result = candidatePosition;
        return false;
    });

    return result;
};

export const findAllOccurrencesInDocument = (document: TextDocument, candidate: RegExp): Range[] => {
    const results: Range[] = [];

    scanDocument(document, (text: string, currentStart: Position) => {
        let match: RegExpExecArray | null;
        let currentStartOffset: number|undefined;
        while ((match = candidate.exec(text)) !== null) {
            if (currentStartOffset === undefined) {
                currentStartOffset = document.offsetAt(currentStart);
            }

            const startPosition= document.positionAt(currentStartOffset + match.index);
            const endPosition= document.positionAt(currentStartOffset + match.index + match[0].length);
            results.push(Range.create(startPosition, endPosition));
        }

        return true;
    });

    return results;
};