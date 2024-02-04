import {ParseTree, TerminalNode} from "antlr4ts/tree";
import {ParserRuleContext, Token, TokenStream} from "antlr4ts";
import {Position} from "vscode-languageserver";

export const collectMatchingTerminals = (parseTree: ParseTree, text: string): TerminalNode[] => {
    if (parseTree instanceof TerminalNode) {
        const token = parseTree.symbol;
        if (token.text === text) {
            return [parseTree]
        }
    }

    const matchingTerminals: TerminalNode[] = [];
    if (parseTree instanceof ParserRuleContext) {
        // check if children match
        for (let i = 0; i < parseTree.childCount; i++) {
            const matchingTerminalsChild = collectMatchingTerminals(parseTree.getChild(i), text);
            matchingTerminals.push(...matchingTerminalsChild)
        }

        // TODO check if need to go through token stream manually
    }

    return matchingTerminals;
};
