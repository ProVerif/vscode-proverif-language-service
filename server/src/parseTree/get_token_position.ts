import {ParseTree, TerminalNode} from "antlr4ts/tree";
import {ParserRuleContext, Token, TokenStream} from "antlr4ts";
import {Position} from "vscode-languageserver";

export type CaretPosition = { line: number, column: number };
export type TokenPosition = { context: ParseTree };

export const getTokenPosition = (parseTree: ParseTree, tokens: TokenStream, position: Position): TokenPosition | undefined => {
    const caretPosition = {line: position.line + 1, column: position.character};
    return getTokenPositionInternal(parseTree, tokens, caretPosition);
};

const getTokenPositionInternal = (parseTree: ParseTree, tokens: TokenStream, caretPosition: CaretPosition): TokenPosition | undefined => {
    if (parseTree instanceof TerminalNode) {
        return getTokenPositionOfTerminal(parseTree, caretPosition);
    } else {
        return getTokenPositionOfChildNode(parseTree as ParserRuleContext, tokens, caretPosition);
    }
};

const getTokenPositionOfTerminal = (parseTree: TerminalNode, caretPosition: CaretPosition): TokenPosition | undefined => {
    const token = parseTree.symbol;
    const text = parseTree.text;
    return createTokenPosition(token, text, caretPosition, parseTree);
};

const getTokenPositionOfChildNode = (parseTree: ParserRuleContext, tokens: TokenStream, caretPosition: CaretPosition): TokenPosition | undefined => {
    if ((parseTree.start && parseTree.start.line > caretPosition.line) ||
        (parseTree.stop && parseTree.stop.line < caretPosition.line)) {
        return undefined;
    }
    for (let i = 0; i < parseTree.childCount; i++) {
        const position = getTokenPositionInternal(parseTree.getChild(i), tokens, caretPosition);
        if (position !== undefined) {
            return position;
        }
    }
    if (parseTree.start && parseTree.stop) {
        for (let i = parseTree.start.tokenIndex; i <= parseTree.stop.tokenIndex; i++) {
            const text = tokens.get(i).text;
            if (!text) {
                continue;
            }

            const position = createTokenPosition(tokens.get(i), text, caretPosition, parseTree);
            if (position) {
                return position;
            }
        }
    }
    return undefined;
};

const createTokenPosition = (token: Token, text: string, caretPosition: CaretPosition, parseTree: ParseTree): TokenPosition | undefined => {
    const start = token.charPositionInLine;
    const stop = token.charPositionInLine + text.length;
    if (token.line == caretPosition.line && start <= caretPosition.column && stop >= caretPosition.column) {
        return {
            context: parseTree,
        };
    } else {
        return undefined;
    }
};