import {Position, uinteger} from "vscode-languageserver";
import {TokenStream} from "antlr4ts/TokenStream";
import {Token} from "antlr4ts";
import {ProverifLexer} from "../parser-proverif/ProverifLexer";

export type SignaturePosition = {
    signatureToken: Token
    signatureTokenPosition: Position
    parameterPosition: uinteger
}

export const getSignaturePosition = (tokens: TokenStream, position: Position): SignaturePosition | undefined => {
    let currentSignatureToken: Token | undefined = undefined;
    let commasBeforePositionInCurrentSignature: uinteger = 0;
    for (let i = 1; i < tokens.size; i++) {
        const token = tokens.get(i); // lookup seems to be O(1)
        const previousToken = tokens.get(i - 1);

        if (token.line >= position.line + 1 && token.charPositionInLine >= position.character) {
            break;
        }

        if (token.type === ProverifLexer.LPAREN) {
            currentSignatureToken = previousToken;
            commasBeforePositionInCurrentSignature = 0;
        } else if (token.type === ProverifLexer.RPAREN) {
            currentSignatureToken = undefined;
        } else if (token.type === ProverifLexer.COMMA) {
            commasBeforePositionInCurrentSignature++;
        }
    }

    if (!currentSignatureToken) {
        return undefined;
    }

    return {
        signatureToken: currentSignatureToken,
        signatureTokenPosition: Position.create(currentSignatureToken.line - 1, currentSignatureToken.charPositionInLine),
        parameterPosition: commasBeforePositionInCurrentSignature
    };
};
