import {assert, expect, should} from "chai";

import {Position} from "vscode-languageserver";
import {MockDocumentManager} from "./mocks/mock_document_manager";
import {getSignatureHelp} from "../src/capabilities/signature_help";

describe('signature help', function () {
    const getSignatureHelpFrom = async (code: string, signatureInvoked: Position) => {
        const uri = 'main.pv';

        const documentManager = new MockDocumentManager();
        documentManager.addProverifDocument(uri, code);

        return await getSignatureHelp({uri}, signatureInvoked, documentManager);
    }

    const assertSignatureDefinitionFound = async (code: string, signatureInvoked: Position, definitionLabel: string, parameters: string[], activeParameter: number) => {
        const signatureHelp = await getSignatureHelpFrom(code, signatureInvoked)

        assert.isDefined(signatureHelp);
        if (!signatureHelp) {
            return;
        }

        expect(signatureHelp.signatures.length).to.equal(1)
        const signature = signatureHelp.signatures[0]

        expect(signature.label).to.contain(definitionLabel)
        expect(signature.label).to.contain(parameters.join(", "));
        expect(signature.parameters.length).to.equal(parameters.length);

        if (signature.parameters.length > 0) {
            const start = signature.parameters[0].label[0]
            expect(start).to.equal(definitionLabel.length + 1)

            let currentIndex = Number(start)
            signature.parameters.forEach((parameter, index) => {
                expect(parameter.label[0]).to.equal(currentIndex)
                expect(parameter.label[1]).to.equal(Number(currentIndex) + parameters[index].length)
                currentIndex += parameters[index].length + 2
            })
        }

        expect(signatureHelp.activeParameter).to.equal(activeParameter);
        should().equal(signature.activeParameter, undefined)
    };

    it("finds table signature definition", async () => {
        const code = `table Ids(nat).\nprocess \nget Ids(`;
        const signatureInvoked = {line: 2, character: 8};

        await assertSignatureDefinitionFound(code, signatureInvoked, 'Ids', ['nat'], 0);
    });

    it("finds let signature definition", async () => {
        const code = `let P(arg: nat) = 0.\nprocess \nP(`;
        const signatureInvoked = {line: 2, character: 2};

        await assertSignatureDefinitionFound(code, signatureInvoked, 'P', ['arg: nat'], 0);
    });

    it("finds second argument position", async () => {
        const code = `let P(arg: nat, arg2:nat) = 0.\nprocess \nP(0,`;
        const signatureInvoked = {line: 2, character: 4};

        await assertSignatureDefinitionFound(code, signatureInvoked, 'P', ['arg: nat', 'arg2: nat'], 1);
    });

    it.skip("ignores inner scopes", async () => {
        const code = `let P(arg: nat, arg2:nat) = 0.\nprocess \nP(diff[0,1],`;
        const signatureInvoked = {line: 2, character: 12};

        await assertSignatureDefinitionFound(code, signatureInvoked, 'P', ['arg: nat', 'arg2: nat'], 1);
    });

    it("finds within other brackets", async () => {
        const code = `fun hash(nat): bitstring.\nprocess \nout(c, (hash(`;
        const signatureInvoked = {line: 2, character: 13};

        await assertSignatureDefinitionFound(code, signatureInvoked, 'hash', ['nat'], 0);
    });

    it("finds not self", async () => {
        const code = `let P(arg: nat) = 0.\nprocess 0`;
        const signatureInvoked = {line: 0, character: 6};

        const signatureHelp = await getSignatureHelpFrom(code, signatureInvoked);
        should().equal(signatureHelp, undefined)
    });
});