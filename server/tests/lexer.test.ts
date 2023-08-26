import {expect} from "chai";

import {CharStreams, CommonTokenStream} from "antlr4ts";
import {ProverifLexer} from "../src/parser-proverif/ProverifLexer";

describe('lexer', function () {
    const TOKEN_TYPE_EOF = -1;

    const getTokens = (input: string) => {
        const charStream = CharStreams.fromString(input);
        const lexer = new ProverifLexer(charStream);
        const tokenStream = new CommonTokenStream(lexer);
        tokenStream.fill();

        return tokenStream.getTokens().filter(token => token.channel === 0);
    };

    it("smoketest", () => {
        const code = `channel internet.`;

        const tokens = getTokens(code);

        expect(tokens.length).to.equal(4);
        expect(tokens[0].type).to.equal(ProverifLexer.CHANNEL);
        expect(tokens[1].type).to.equal(ProverifLexer.Identifier);
        expect(tokens[1].text).to.equal('internet');
        expect(tokens[2].type).to.equal(ProverifLexer.DOT);
        expect(tokens[3].type).to.equal(TOKEN_TYPE_EOF);
    });

    it("lex identifier supports full character set", () => {
        const startCharacters = 'adzAYZ';
        const characters = 'adzAQZ079';
        const specialCharacters = "_'";
        const range_192_214 = 'ÀÇÖ';
        const range_216_246 = 'ØÝðö';
        const range_248_255 = 'øûÿ';
        const validIdentifier = startCharacters + characters + specialCharacters + range_192_214 + range_216_246 + range_248_255;

        const tokens = getTokens(validIdentifier);

        expect(tokens.length).to.equal(2);
        expect(tokens[0].type).to.equal(ProverifLexer.Identifier);
        expect(tokens[0].text).to.equal(validIdentifier);
        expect(tokens[1].type).to.equal(TOKEN_TYPE_EOF);
    });

    it("lex identifier excludes ×", () => {
        const character_215 = '×';

        const tokens = getTokens(character_215);

        expect(tokens.length).to.equal(1);
        expect(tokens[0].type).to.equal(TOKEN_TYPE_EOF);
    });

    it("lex identifier excludes ÷", () => {
        const character_247 = '÷';

        const tokens = getTokens(character_247);

        expect(tokens.length).to.equal(1);
        expect(tokens[0].type).to.equal(TOKEN_TYPE_EOF);
    });
});