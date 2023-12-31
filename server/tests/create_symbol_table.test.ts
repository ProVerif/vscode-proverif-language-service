import {assert, expect} from "chai";

import {CharStreams, CommonTokenStream} from "antlr4ts";
import {ProverifLexer} from "../src/parser-proverif/ProverifLexer";
import {ProverifParser} from "../src/parser-proverif/ProverifParser";
import {createSymbolTable} from "../src/tasks/create_symbol_table";
import {parseProverif} from "../src/tasks/parse_proverif";

describe('parser', function () {
    const getSymbolTable = (input: string) => {
        const { parserTree } = parseProverif(input, false);
        assert.isUndefined(parserTree.exception);

        const symbolTable = createSymbolTable(parserTree).symbolTable;

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