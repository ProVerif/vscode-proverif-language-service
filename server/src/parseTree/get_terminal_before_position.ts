import {Position, uinteger} from "vscode-languageserver";
import {TokenStream} from "antlr4ts/TokenStream";
import {Token} from "antlr4ts";
import {ProverifLexer} from "../parser-proverif/ProverifLexer";

export const getPositionOfTokenBeforeLastLParen = (tokens: TokenStream, position: Position): Position | undefined => {
    let lastToken: Token|undefined = undefined;
    let nextLastToken: Token|undefined = undefined;
    for (let i = 0; i < tokens.size; i++) {
        const token = tokens.get(i); // lookup seems to be O(1)
        if (token.line >= position.line + 1 && token.charPositionInLine >= position.character) {
            break;
        }

        if (token.type === ProverifLexer.LPAREN) {
            lastToken = nextLastToken;
        } else {
            nextLastToken = token;
        }
    }

    return lastToken ? Position.create(lastToken.line-1, lastToken.charPositionInLine) : undefined;
};

export const countCommasAfterLParenButBeforeToken = (tokens: TokenStream, position: Position): uinteger | undefined => {
    let commaCount: uinteger = 0;
    for (let i = 0; i < tokens.size; i++) {
        const token = tokens.get(i); // lookup seems to be O(1)
        if (token.line >= position.line + 1 && token.charPositionInLine >= position.character) {
            break;
        }

        if (token.type === ProverifLexer.COMMA) {
            commaCount++;
        } else if (token.type === ProverifLexer.LPAREN) {
            commaCount = 0;
        }
    }

    return commaCount;
};