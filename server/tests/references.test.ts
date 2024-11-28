import {assert, expect} from "chai";

import {Location, Position, Range} from "vscode-languageserver";
import {MockDocumentManager} from "./mocks/mock_document_manager";
import {getReferences} from "../src/capabilities/references";

describe('references', function () {
    const assertSingleFileLocationsFoundAllReferences = (locations: Location[]|undefined, expectedReferences: Position[], targetCharacterLength: number, source: Position) => {
        assert.isDefined(locations);
        if (!locations) {
            return;
        }

        expect(locations.length).to.equal(expectedReferences.length + 1);

        const expectedLocations = [...expectedReferences, source].map(reference => {
            const endPosition = { ...reference, character: reference.character+targetCharacterLength};
            const range = Range.create(reference, endPosition);
            return Location.create(locations[0].uri, range);
        });
        expect(locations).to.have.deep.members(expectedLocations);
    };

    const assertLocationsFoundAllReferences = (locations: Location[]|undefined, uri: string, expectedReferences: Position[], targetCharacterLength: number) => {
        assert.isDefined(locations);
        if (!locations) {
            return;
        }

        const consideredLocations = locations.filter(location => location.uri === uri);
        expect(consideredLocations.length).to.equal(expectedReferences.length);

        const expectedLocations = [...expectedReferences].map(reference => {
            const endPosition = { ...reference, character: reference.character+targetCharacterLength};
            const range = Range.create(reference, endPosition);
            return Location.create(uri, range);
        });
        expect(consideredLocations).to.have.deep.members(expectedLocations);
    };

    const assertSingleFileReferences = async (code: string, click: Position, references: Position[], targetCharacterLength: number) => {
        const uri = 'main.pv';

        const documentManager = new MockDocumentManager();
        documentManager.addProverifDocument(uri, code);
        const locations = await getReferences({uri}, click, documentManager);

        assertSingleFileLocationsFoundAllReferences(locations, references, targetCharacterLength, click);
    };

    it("finds current scope variables", async () => {
        const code = `channel c.\nchannel d. process \nout(c, c)`;
        const click = {line: 0, character: 8};
        const reference1 = {line: 2, character: 4};
        const reference2 = {line: 2, character: 7};

        await assertSingleFileReferences(code, click, [reference1, reference2], 1);
    });

    it("finds local scope variables", async () => {
        const code = `channel c. process \nnew c:channel; \nout(c, c)`;
        const click = {line: 1, character: 4};
        const reference1 = {line: 2, character: 4};
        const reference2 = {line: 2, character: 7};

        await assertSingleFileReferences(code, click, [reference1, reference2], 1);
    });


    it("includes dependencies (down -> up)", async () => {
        const dependencyUri = 'dependency.pvl';
        const dependencyCode = `channel c.`;
        const click = {line: 0, character: 8};

        const uri = 'main.pv';
        const code = 'process \nout(c, c)';
        const reference1 = {line: 1, character: 4};
        const reference2 = {line: 1, character: 7};

        const documentManager = new MockDocumentManager();
        documentManager.addProverifDocument(uri, code, dependencyUri);
        documentManager.addProverifDocument(dependencyUri, dependencyCode);
        const definitionLink = await getReferences({uri: dependencyUri}, click, documentManager);

        assertLocationsFoundAllReferences(definitionLink, dependencyUri, [click], 1);
        assertLocationsFoundAllReferences(definitionLink, uri, [reference1, reference2], 1);
    });
});