import {CharStreams, CommonTokenStream} from "antlr4ts";
import {ProverifParser} from '../parser-proverif/ProverifParser';
import {ProverifLexer} from "../parser-proverif/ProverifLexer";
import {ParseTree} from "antlr4ts/tree";

export type ParseProverifResult = {
    parser: ProverifParser
    parserTree: ParseTree
}

export const parseProverif = (content: string, selfIsLibrary: boolean) => {
    const input = CharStreams.fromString(content);
    const lexer = new ProverifLexer(input);
    const commonTokenStream = new CommonTokenStream(lexer);
    const parser = new ProverifParser(commonTokenStream);
    const parserTree = selfIsLibrary ? parser.lib() : parser.all();

    return { parser, parserTree };
};
