import {ParseTree, TerminalNode} from "antlr4ts/tree";
import {ParserRuleContext} from "antlr4ts";

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
