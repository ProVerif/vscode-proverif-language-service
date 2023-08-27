import {ParseTree, TerminalNode} from "antlr4ts/tree";
import {ParserRuleContext} from "antlr4ts";
import {Range} from "vscode-languageserver/node";

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