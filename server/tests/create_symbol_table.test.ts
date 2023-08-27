import {expect} from "chai";

import {CharStreams, CommonTokenStream} from "antlr4ts";
import {ProverifLexer} from "../src/parser-proverif/ProverifLexer";
import {ProverifParser} from "../src/parser-proverif/ProverifParser";
import {createSymbolTable} from "../src/tasks/create_symbol_table";
import {VariableSymbol} from "antlr4-c3";

describe('parser', function () {
    const getSymbolTable = (input: string) => {
        const charStream = CharStreams.fromString(input);
        const lexer = new ProverifLexer(charStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ProverifParser(tokenStream);
        const proverifFileContext = parser.proverifFile();
        const symbolTable = createSymbolTable({ uri: "mock"}, proverifFileContext).symbolTable;

        return  { symbolTable, proverifFileContext };
    };

    it("creates appropriate symbols", async () => {
        const code = `channel c. channel d. process out(c, c)`;

        const  {symbolTable, proverifFileContext } = getSymbolTable(code);

        const variables = await symbolTable.getNestedSymbolsOfType(VariableSymbol);
        expect(variables.length).to.equal(2);
    });
});