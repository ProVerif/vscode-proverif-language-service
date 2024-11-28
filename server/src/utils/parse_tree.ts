import {ParseTree, TerminalNode} from "antlr4ts/tree";
import {ParserRuleContext, Token} from "antlr4ts";
import {Position} from "vscode-languageserver";
import {Range} from "vscode-languageserver/node";

export const collectMatchingTerminals = (parseTree: ParseTree, text: string): TerminalNode[] => {
    if (parseTree instanceof TerminalNode) {
        const token = parseTree.symbol;
        if (token.text === text) {
            return [parseTree];
        }
    }

    const matchingTerminals: TerminalNode[] = [];
    if (parseTree instanceof ParserRuleContext) {
        // check if children match
        for (let i = 0; i < parseTree.childCount; i++) {
            const matchingTerminalsChild = collectMatchingTerminals(parseTree.getChild(i), text);
            matchingTerminals.push(...matchingTerminalsChild);
        }
    }

    return matchingTerminals;
};

export const getRange = (parseTree: ParseTree): Range | undefined => {
    let start, stop;
    if (parseTree instanceof ParserRuleContext) {
        start = parseTree.start;
        stop = parseTree.stop;
    } else if (parseTree instanceof TerminalNode) {
        start = stop = parseTree.symbol;
    }

    if (!start || !stop || !stop.text) {
        return undefined;
    }

    const endCharacter = stop.charPositionInLine + stop.text.length;
    return {
        start: {line: start.line - 1, character: start.charPositionInLine},
        end: {
            line: stop.line - 1, character: endCharacter
        }
    };
};

export const getMatchingParseTree = (parseTree: ParseTree, position: Position): TerminalNode | undefined => {
    const caretPosition = {line: position.line + 1, column: position.character};
    return getMatchingParseTreeInternal(parseTree, caretPosition);
};

type CaretPosition = { line: number, column: number };
const getMatchingParseTreeInternal = (parseTree: ParseTree, caretPosition: CaretPosition): TerminalNode | undefined => {
    if (parseTree instanceof TerminalNode) {
        const token = parseTree.symbol;
        if (checkCaretPositionOverlapsToken(caretPosition, token)) {
            return parseTree;
        }
    }

    if (parseTree instanceof ParserRuleContext) {
        // early out
        if ((parseTree.start.line > caretPosition.line) ||
            (parseTree.stop && parseTree.stop.line < caretPosition.line)) {
            return undefined;
        }

        // check if children match
        for (let i = 0; i < parseTree.childCount; i++) {
            const matchingParseTree = getMatchingParseTreeInternal(parseTree.getChild(i), caretPosition);
            if (matchingParseTree) {
                return matchingParseTree;
            }
        }
    }

    return undefined;
};

const checkCaretPositionOverlapsToken = (caretPosition: CaretPosition, token: Token) => {
    return token.text &&
        token.line === caretPosition.line &&
        caretPosition.column >= token.charPositionInLine &&
        caretPosition.column < token.charPositionInLine + token.text.length;
};
