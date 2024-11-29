import {assert, expect} from "chai";

import {createSymbolTable, DeclarationType} from "../src/proverif/symbol_table/create_symbol_table";
import {parseProverif} from "../src/proverif/parse_proverif";
import {MockDocumentManager} from "./mocks/mock_document_manager";
import {getDefinitionLocations} from "../src/capabilities/go_to_definition";
import {findFalseLemmas} from "../src/proverif_log/find_errors";
import {DiagnosticSeverity, Position} from "vscode-languageserver";

describe('.log.pv', function () {
    const getSymbolTable = (input: string) => {
        const { tokenStream, parserTree } = parseProverif(input, false);
        assert.isUndefined(parserTree.exception);

        const symbolTable = createSymbolTable(tokenStream, parserTree).symbolTable;

        return  { symbolTable, parserTree };
    };

    it("finds .pv.log errors", async () => {
        const uri = 'test.pv.log';
        const content = `
PARTIAL RESULT mess(a, b) cannot be proved if the inductive queries can be proved.

invalid`;

        const documentManager = new MockDocumentManager();
        documentManager.addProverifLogDocument(uri, content);

        const document = await documentManager.getProverifLogDocument({uri});
        const errors = await findFalseLemmas(document.document);

        expect(errors.length).to.equal(1);
        expect(errors[0].range.start).to.deep.equal(Position.create(1, 0));
        expect(errors[0].range.end).to.deep.equal(Position.create(1, 82));
        expect(errors[0].severity).to.equal(DiagnosticSeverity.Error)
    });
});