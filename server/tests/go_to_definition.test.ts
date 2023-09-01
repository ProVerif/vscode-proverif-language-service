import {assert, expect} from "chai";

import {CharStreams, CommonTokenStream} from "antlr4ts";
import {ProverifLexer} from "../src/parser-proverif/ProverifLexer";
import {ProverifParser} from "../src/parser-proverif/ProverifParser";
import {createSymbolTable} from "../src/tasks/create_symbol_table";
import {ParseResult} from "../src/tasks";
import {getDefinitionLink} from "../src/go_to_definition";

describe('parser', function () {
    const getParserResult = (input: string): ParseResult => {
        const charStream = CharStreams.fromString(input);
        const lexer = new ProverifLexer(charStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ProverifParser(tokenStream);
        const parserTree = parser.all();

        const symbolTable = createSymbolTable(parserTree).symbolTable;

        return {
            parser,
            parserTree,
            symbolTable
        };
    };

    it("finds global scope variable", async () => {
        const code = `channel c. channel d. process \nout(c, c)`;

        const parserResult = getParserResult(code);
        const definitionLink = await getDefinitionLink({uri: 'dummy'}, parserResult, {line: 1, character: 5});

        assert.isDefined(definitionLink);
        if (definitionLink) {
            expect(definitionLink.targetRange.start).to.deep.equal({line: 0, character: 8});
            expect(definitionLink.targetRange.end).to.deep.equal({line: 0, character: 9});
            expect(definitionLink.targetSelectionRange.start).to.deep.equal({line: 0, character: 8});
            expect(definitionLink.targetSelectionRange.end).to.deep.equal({line: 0, character: 9});

            assert.isDefined(definitionLink.originSelectionRange);
            if (definitionLink.originSelectionRange) {
                expect(definitionLink.originSelectionRange.start).to.deep.equal({line: 1, character: 4});
                expect(definitionLink.originSelectionRange.end).to.deep.equal({line: 1, character: 5});
            }
        }
    });
});