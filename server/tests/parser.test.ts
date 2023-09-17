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

        const parseTree = parser.all();

        expect(parseTree).not.to.be.undefined;
        expect(parseTree.children?.length).to.equal(4);
        expect(parser.numberOfSyntaxErrors).to.equal(0);
    });

    it("Ignores comments", () => {
        const code = `(* stuff *)\nchannel c. process out(c, c)`;

        const parser = getParser(code);

        const parseTree = parser.all();

        expect(parseTree).not.to.be.undefined;
        expect(parseTree.children?.length).to.equal(4);
        expect(parser.numberOfSyntaxErrors).to.equal(0);
    });

    it("Parses query", () => {
        const code = `free secr: bitstring.\nquery attacker(secr).\nprocess out(c, c)`;

        const parser = getParser(code);

        const parseTree = parser.all();

        expect(parseTree).not.to.be.undefined;
        expect(parser.numberOfSyntaxErrors).to.equal(0);
    });
});