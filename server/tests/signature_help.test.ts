import {assert, expect} from "chai";

import {Location, Position, Range} from "vscode-languageserver";
import {MockDocumentManager} from "./mocks/mock_document_manager";
import {getReferences} from "../src/references";
import {getSignatureHelp} from "../src/signature_help";

describe('references', function () {
    const assertSignatureDefinitionFound = async (code: string, signatureInvoked: Position, parameters: string[], activeParameter: number) => {
        const uri = 'main.pv';

        const documentManager = new MockDocumentManager();
        documentManager.parse(uri, code);
        const signatureHelp = await getSignatureHelp({uri}, signatureInvoked, documentManager);

        assert.isDefined(signatureHelp);
        if (!signatureHelp) {
            return;
        }

        expect(signatureHelp.signatures.length).to.equal(1)
        const signature = signatureHelp.signatures[0]

        expect(signature.parameters.length).to.equal(parameters.length);
        expect(signature.parameters.map(parameter => parameter.label)).deep.equal(parameters);

        expect(signature.activeParameter).to.equal(activeParameter);
    };

    it("finds table signature definition", async () => {
        const code = `table Ids(nat).\nprocess \nget Ids(`;
        const signatureInvoked = {line: 2, character: 8};

        await assertSignatureDefinitionFound(code, signatureInvoked, ['nat'], 0);
    });
});