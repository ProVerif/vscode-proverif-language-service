import {expect} from "chai";

import {CharStreams, CommonTokenStream} from "antlr4ts";
import {VariableSymbol} from "antlr4-c3";
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

        return  { symbolTable, parserTree };
    };

    it("creates appropriate symbols", async () => {
        const code = `channel c. channel d. process out(c, c)`;

        const  {symbolTable } = getSymbolTable(code);

        const variables = await symbolTable.getNestedSymbolsOfType(VariableSymbol);
        expect(variables.length).to.equal(2);
    });
});