import {CharStreams, CommonTokenStream} from "antlr4ts";
import {AllContext, LibContext, ProverifParser} from './parser/ProverifParser';
import {ProverifLexer} from "./parser/ProverifLexer";

export type ParseProverifResult = {
    tokenStream: CommonTokenStream
    parser: ProverifParser
    parserTree: LibContext|AllContext
}

export const parseProverif = <Context extends boolean>(content: string, selfIsLibrary: Context): {
    parser: ProverifParser,
    parserTree: (Context extends true ? LibContext : AllContext),
    tokenStream: CommonTokenStream
} | undefined => {
    try {
        const input = CharStreams.fromString(content);
        const lexer = new ProverifLexer(input);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ProverifParser(tokenStream);
        const parserTree = (selfIsLibrary ? parser.lib() : parser.all()) as Context extends true ? LibContext : AllContext;
        return {parser, parserTree, tokenStream};
    } catch (e) {
        // parsing might fail because there is a syntax error in code
        return undefined;
    }
};
