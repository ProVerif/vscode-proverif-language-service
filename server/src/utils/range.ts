import {Position} from "vscode-languageserver";
import {Range} from "vscode-languageserver/node";

export const contains = (range: Range, position: Position) => {
    if (position.line < range.start.line || position.line > range.end.line) {
        return false;
    }
    if (position.line === range.start.line && position.character < range.start.character) {
        return false;
    }
    if (position.line === range.end.line && position.character > range.end.character) {
        return false;
    }
    return true;
};
