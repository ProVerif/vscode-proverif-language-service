import {assert, expect} from "chai";

import {createSymbolTable, DeclarationType} from "../src/proverif/symbol_table/create_symbol_table";
import {parseProverif} from "../src/proverif/parse_proverif";

describe('parser', function () {
    const getSymbolTable = (input: string) => {
        const { tokenStream, parserTree } = parseProverif(input, false);
        assert.isUndefined(parserTree.exception);

        const symbolTable = createSymbolTable(tokenStream, parserTree).symbolTable;

        return  { symbolTable, parserTree };
    };

    it("collects declaration symbols", () => {
        const code = `channel c. channel d. process out(c, c)`;

        const  {symbolTable } = getSymbolTable(code);

        const variables = symbolTable.getSymbols();
        expect(variables.length).to.equal(2);
        expect(variables.filter(v => v.declaration === DeclarationType.Channel).length).to.equal(2);
    });

    it("collects declaration & process symbols", () => {
        const code = `channel c. process new c: channel; out(c, c)`;

        const  {symbolTable } = getSymbolTable(code);

        const variables = symbolTable.getSymbols();
        expect(variables.length).to.equal(2);
    });

    it("collects comments", () => {
        const code = `(** hi **) let Fun() = 0. process Fun`;

        const  {symbolTable } = getSymbolTable(code);

        const variables = symbolTable.getSymbols();
        expect(variables.length).to.equal(1);
        expect(variables[0].docComment).to.equal("(** hi **)")
    });

    it("ignore unrelated comments", () => {
        const code = `(** hi **) (* block *) let Fun() = 0. process Fun`;

        const  {symbolTable } = getSymbolTable(code);

        const variables = symbolTable.getSymbols();
        expect(variables.length).to.equal(1);
        expect(variables[0].docComment).to.equal(undefined)
    });
});