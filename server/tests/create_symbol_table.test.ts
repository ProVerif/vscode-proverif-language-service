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

    it("collects reduc", async () => {
        const code = `reduc forall M:bitstring; unpack(M) = M.\nprocess 0`;
        const  {symbolTable} = getSymbolTable(code);

        const variables = symbolTable.getSymbols();
        expect(variables.length).to.equal(2);
        expect(variables.filter(v => v.declaration === DeclarationType.Reduc).length).to.equal(1);
    });

    it.skip("collects type of data converter variable", async () => {
        const code = `fun reverse(bitstring): bitstring [data].\nchannel c.\nprocess\nnew var: bitstring;\nlet var2 = reverse(var) in\nlet reverse(var3) = var2 in\n0`;
        const  {symbolTable } = getSymbolTable(code);

        const variables = symbolTable.getSymbols();
        const var2Symbol = variables.find(v => v.node.text === 'var2');
        expect(var2Symbol.type?.text).to.equal('bitstring');

        const var3Symbol = variables.find(v => v.node.text === 'var3');
        expect(var3Symbol.type?.text).to.equal('bitstring');
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