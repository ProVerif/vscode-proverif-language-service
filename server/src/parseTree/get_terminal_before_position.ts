import {ParseTree, TerminalNode} from "antlr4ts/tree";
import {Position} from "vscode-languageserver";
import {TokenStream} from "antlr4ts/TokenStream";
import {Token} from "antlr4ts";

export const getPositionOfTokenBefore = (tokens: TokenStream, position: Position): Position | undefined => {
    let lastToken: Token|undefined = undefined;
    for (let i = 0; i < tokens.size; i++) {
        const token = tokens.get(i); // lookup seems to be O(1)
        if (token.line >= position.line + 1 && token.charPositionInLine >= position.character) {
            break;
        }

        lastToken = token;
    }

    return lastToken ? Position.create(lastToken.line-1, lastToken.charPositionInLine) : undefined;
};