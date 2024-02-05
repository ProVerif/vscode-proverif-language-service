import {ParseTree, TerminalNode} from "antlr4ts/tree";
import {ParserRuleContext, Token, TokenStream} from "antlr4ts";
import {Position} from "vscode-languageserver";

export type CaretPosition = { line: number, column: number };

export const getMatchingParseTree = (parseTree: ParseTree, tokens: TokenStream, position: Position): ParseTree | undefined => {
    const caretPosition = {line: position.line + 1, column: position.character};
    return getMatchingParseTreeInternal(parseTree, tokens, caretPosition);
};

const getMatchingParseTreeInternal = (parseTree: ParseTree, tokens: TokenStream, caretPosition: CaretPosition): ParseTree | undefined => {
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
            const matchingParseTree = getMatchingParseTreeInternal(parseTree.getChild(i), tokens, caretPosition);
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
        token.charPositionInLine <= caretPosition.column &&
        token.charPositionInLine + (token.text?.length ?? 0) >= caretPosition.column;

};
