import {CharStreams, CommonTokenStream} from "antlr4ts";
import {
    ProverifFileContext, ProverifParser
} from '../parser-proverif/ProverifParser';
import {TextDocumentIdentifier} from "vscode-languageserver";
import {ProverifLexer} from "../parser-proverif/ProverifLexer";

export type ParseProverifResult = {
    parser: ProverifParser
    proverifFileContext: ProverifFileContext
}

export const parseProverif = (content: string) => {
    const input = CharStreams.fromString(content);
    const lexer = new ProverifLexer(input);
    const commonTokenStream = new CommonTokenStream(lexer);
    const parser = new ProverifParser(commonTokenStream);
    const proverifFileContext = parser.proverifFile();

    return { parser, proverifFileContext };
};
