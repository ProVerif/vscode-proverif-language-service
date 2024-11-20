import {assert, expect} from "chai";

import {getDefinitionLocations} from "../src/go_to_definition";
import {Position} from "vscode-languageserver";
import {DefinitionLink} from "vscode-languageserver-protocol";
import {MockDocumentManager} from "./mocks/mock_document_manager";

describe('go to definition', function () {
    const assertDefinitionPointsToTarget = (definitionLinks: DefinitionLink[] | undefined, targetUri: string, target: Position|undefined, targetCharacterLength: number, source: Position) => {
        if (!target) {
            assert.isUndefined(definitionLinks)
            return;
        }

        assert.isDefined(definitionLinks);
        if (!definitionLinks) {
            return;
        }
        
        assert.lengthOf(definitionLinks, 1);
        const definitionLink = definitionLinks[0]
        
        expect(definitionLink.targetUri).to.equal(targetUri);

        expect(definitionLink.targetRange.start).to.deep.equal(target);
        const targetEnd = {...target, character: target.character + targetCharacterLength};
        expect(definitionLink.targetRange.end).to.deep.equal(targetEnd);
        expect(definitionLink.targetSelectionRange).to.deep.equal(definitionLink.targetRange);

        assert.isDefined(definitionLink.originSelectionRange);
        if (!definitionLink.originSelectionRange) {
            return;
        }

        expect(definitionLink.originSelectionRange.start.line).to.equal(source.line);
        assert.isTrue(definitionLink.originSelectionRange.start.character <= source.character && source.character <= definitionLink.originSelectionRange.end.character);
    };

    const assertSingleFileNavigation = async (code: string, click: Position, target: Position|undefined, targetCharacterLength: number) => {
        const uri = 'main.pv';

        const documentManager = new MockDocumentManager();
        documentManager.parse(uri, code);
        const definitionLink = await getDefinitionLocations({uri}, click, documentManager);

        assertDefinitionPointsToTarget(definitionLink, uri, target, targetCharacterLength, click);
    };

    it("finds global scope variable", async () => {
        const code = `channel c. channel d. process \nout(c, c)`;
        const click = {line: 1, character: 4};
        const target = {line: 0, character: 8};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("override local scope variable", async () => {
        const code = `channel c. process \nnew c:channel; \nout(c, c)`;
        const click = {line: 2, character: 4};
        const target = {line: 1, character: 4};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("pattern variable", async () => {
        const code = `channel c. process \nin(c, b:bitstring); \nout(c, b)`;
        const click = {line: 2, character: 7};
        const target = {line: 1, character: 6};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("complex pattern variable", async () => {
        const code = `channel c. process \nin(c, (=2, b:bitstring)); \nout(c, b)`;
        const click = {line: 2, character: 7};
        const target = {line: 1, character: 11};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("override variable", async () => {
        const code = `channel c. free b: bitstring. process \nin(c, b:bitstring); \nout(c, b)`;
        const click = {line: 2, character: 7};
        const target = {line: 1, character: 6};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("do not override match variable", async () => {
        const code = `channel c. free b: bitstring. process \nin(c, =b); \nout(c, b)`;
        const click = {line: 2, character: 7};
        const target = {line: 0, character: 16};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("support macros", async () => {
        const code = `let Proc = 0.
def My(ProcImplementation,SystemInterface) { 
    let SystemInterface() = ProcImplementation(). 
}
expand My(Proc, System).
process System`;

        // ProcImplementation defined outside, hence this is the real definition
        const click = {line: 1, character: 7};
        const target = {line: 1, character: 7};
        await assertSingleFileNavigation(code, click, target, 'ProcImplementation'.length);

        /* TODO implement
        // SystemInterface defined inside macro
        const click1 = {line: 1, character: 25};
        const target1 = {line: 2, character: 12};
        await assertSingleFileNavigation(code, click1, target1, 'SystemInterface'.length);
        */

        // SystemInterface defined inside macro
        const click2 = {line: 2, character: 8};
        const target2 = {line: 2, character: 8};
        await assertSingleFileNavigation(code, click2, target2, 'SystemInterface'.length);

        // ProcImplementation defined outside, hence definition inside macro signature
        const click3 = {line: 2, character: 30};
        const target3 = {line: 1, character: 7};
        await assertSingleFileNavigation(code, click3, target3, 'ProcImplementation'.length);

        // Proc defined at start
        const click4 = {line: 4, character: 10};
        const target4 = {line: 0, character: 4};
        await assertSingleFileNavigation(code, click4, target4, 'Proc'.length);

        /* TODO implement
        // System defined by macro, hence navigate to macro signature
        const click5 = {line: 4, character: 18};
        const target5 = {line: 1, character: 23};
        await assertSingleFileNavigation(code, click5, target5, 'Proc'.length);
         */

        // System defined by macro
        const click6 = {line: 5, character: 9};
        const target6 = {line: 4, character: 16};
        await assertSingleFileNavigation(code, click6, target6, 'System'.length);
    });

    it("consider query variables", async () => {
        const code = `free b: bitstring.\nquery x:bitstring; attacker(x). process 0`;
        const click = {line: 1, character: 28};
        const target = {line: 1, character: 6};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("consider let arguments", async () => {
        const code = `let Proc(c: channel) = \nin(c, b:bitstring).\nprocess 0`;
        const click = {line: 1, character: 3};
        const target = {line: 0, character: 9};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("consider multiple let arguments", async () => {
        const code = `let Proc() = 0.\nlet Proc2() = 0.\nprocess Proc2()`;
        const click = {line: 2, character: 9};
        const target = {line: 1, character: 4};

        await assertSingleFileNavigation(code, click, target, 5);
    });

    it("consider reduc", async () => {
        const code = `fun redu(bitstring): bitstring\nreduc forall entry: bitstring;\nredu(entry) = entry.\nprocess 0`;
        const click = {line: 2, character: 6};
        const target = {line: 1, character: 13};

        await assertSingleFileNavigation(code, click, target, 5);
    });

    it("ignore otherwise clauses in reduc", async () => {
        const code = `fun redu(bitstring): bitstring\nreduc forall entry:bitstring;redu(entry) = entry\notherwise forall entry2: bitstring;\nredu(entry) = entry.\nprocess 0`;
        const click = {line: 3, character: 6};

        await assertSingleFileNavigation(code, click, undefined, 5);
    });

    it("consider clauses", async () => {
        const code = `pred p1.\nclauses forall entry: bitstring;\np1(entry).\nprocess 0`;
        const click = {line: 2, character: 4};
        const target = {line: 1, character: 15};

        await assertSingleFileNavigation(code, click, target, 5);
    });

    it("checks in dependencies if not found in main", async () => {
        const dependencyUri = 'dependency.pvl';
        const dependencyCode = `channel c.`;

        const uri = 'main.pv';
        const code = 'process \nout(c, c)';
        const click = {line: 1, character: 4};
        const target = {line: 0, character: 8};

        const documentManager = new MockDocumentManager();
        documentManager.parse(uri, code, dependencyUri);
        documentManager.parse(dependencyUri, dependencyCode);
        const definitionLink = await getDefinitionLocations({uri}, click, documentManager);

        assertDefinitionPointsToTarget(definitionLink, dependencyUri, target, 1, click);
    });
});