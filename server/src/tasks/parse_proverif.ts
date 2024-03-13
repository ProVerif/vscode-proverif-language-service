import {CharStreams, CommonTokenStream} from "antlr4ts";
import {AllContext, LibContext, ProverifParser} from '../parser-proverif/ProverifParser';
import {ProverifLexer} from "../parser-proverif/ProverifLexer";
import {ParseTree} from "antlr4ts/tree";

export type ParseProverifResult = {
    parser: ProverifParser
    parserTree: LibContext|AllContext
}

export const parseProverif = <Context extends boolean>(content: string, selfIsLibrary: Context): {
    parser: ProverifParser,
    parserTree: (Context extends true ? LibContext : AllContext)
} | undefined => {
    try {
        const input = CharStreams.fromString(content);
        const lexer = new ProverifLexer(input);
        const commonTokenStream = new CommonTokenStream(lexer);
        const parser = new ProverifParser(commonTokenStream);
        const parserTree = (selfIsLibrary ? parser.lib() : parser.all()) as Context extends true ? LibContext : AllContext;
        return {parser, parserTree};
    } catch (e) {
        // parsing might fail because there is a syntax error in code
        return undefined;
    }
};
