import {assert, expect} from "chai";

import {Location, Position, Range} from "vscode-languageserver";
import {MockDocumentManager} from "./mocks/mock_document_manager";
import {getReferences} from "../src/references";

describe('references', function () {
    const assertDefinitionPointsToTarget = (locations: Location[]|undefined, targetUri: string, references: Position[], targetCharacterLength: number, source: Position) => {
        assert.isDefined(locations);
        if (!locations) {
            return;
        }

        expect(locations.length).to.equal(references.length + 1);

        const expectedLocations = [...references, source].map(reference => {
            const endPosition = { ...reference, character: reference.character+targetCharacterLength};
            const range = Range.create(reference, endPosition);
            return Location.create(targetUri, range);
        });
        expect(locations).to.have.deep.members(expectedLocations);
    };

    const assertSingleFileReferences = async (code: string, click: Position, references: Position[], targetCharacterLength: number) => {
        const uri = 'main.pv';

        const documentManager = new MockDocumentManager();
        documentManager.parse(uri, code);
        const locations = await getReferences({uri}, click, documentManager);

        assertDefinitionPointsToTarget(locations, uri, references, targetCharacterLength, click);
    };

    it("finds global scope variable", async () => {
        const code = `channel c.\nchannel d. process \nout(c, c)`;
        const click = {line: 0, character: 8};
        const reference1 = {line: 2, character: 4};
        const reference2 = {line: 2, character: 7};

        await assertSingleFileReferences(code, click, [reference1, reference2], 1);
    });
});