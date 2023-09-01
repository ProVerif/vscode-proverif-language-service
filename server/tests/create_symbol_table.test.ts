import {assert, expect} from "chai";

import {CharStreams, CommonTokenStream} from "antlr4ts";
import {ProverifLexer} from "../src/parser-proverif/ProverifLexer";
import {ProverifParser} from "../src/parser-proverif/ProverifParser";
import {createSymbolTable} from "../src/tasks/create_symbol_table";

describe('parser', function () {
    const getSymbolTable = (input: string) => {
        const charStream = CharStreams.fromString(input);
        const lexer = new ProverifLexer(charStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ProverifParser(tokenStream);
        const parserTree = parser.all();
        const symbolTable = createSymbolTable(parserTree).symbolTable;
        assert.isUndefined(parserTree.exception);

        return  { symbolTable, parserTree };
    };

    it("collects declaration symbols", async () => {
        const code = `channel c. channel d. process out(c, c)`;

        const  {symbolTable } = getSymbolTable(code);

        const variables = await symbolTable.getSymbols();
        expect(variables.length).to.equal(2);
    });

    it("collects declaration & process symbols", async () => {
        const code = `channel c. process new c: channel; out(c, c)`;

        const  {symbolTable } = getSymbolTable(code);

        const variables = await symbolTable.getSymbols();
        expect(variables.length).to.equal(2);
    });
});