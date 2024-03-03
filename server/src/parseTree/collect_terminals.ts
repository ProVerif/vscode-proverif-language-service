import {ParseTree, TerminalNode} from "antlr4ts/tree";
import {ParserRuleContext} from "antlr4ts";
import {ProverifParser} from "../parser-proverif/ProverifParser";

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

export const collectIdentTerminals = (parseTree: ParseTree): TerminalNode[] => {
    if (parseTree instanceof TerminalNode) {
        const token = parseTree.symbol;
        if (token.type === ProverifParser.IDENT) {
            return [parseTree];
        }
    }

    const matchingTerminals: TerminalNode[] = [];
    if (parseTree instanceof ParserRuleContext) {
        // check if children match
        for (let i = 0; i < parseTree.childCount; i++) {
            const matchingTerminalsChild = collectIdentTerminals(parseTree.getChild(i));
            matchingTerminals.push(...matchingTerminalsChild);
        }
    }

    return matchingTerminals;
};
