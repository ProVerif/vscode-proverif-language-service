import {expect} from "chai";

import {CharStreams, CommonTokenStream} from "antlr4ts";
import {ProverifLexer} from "../src/parser-proverif/ProverifLexer";
import {ProverifParser} from "../src/parser-proverif/ProverifParser";

describe('parser', function () {

    const getParser = (input: string) => {
        const charStream = CharStreams.fromString(input);
        const lexer = new ProverifLexer(charStream);
        const tokenStream = new CommonTokenStream(lexer);
        return new ProverifParser(tokenStream);
    };

    it("parses simple file", () => {
        const code = `channel c. process out(c, c)`;

        const parser = getParser(code);

        const proverifFile = parser.proverifFile();

        expect(proverifFile).not.to.be.undefined;
        expect(proverifFile.children?.length).to.equal(4);
        expect(parser.numberOfSyntaxErrors).to.equal(0);
    });
});