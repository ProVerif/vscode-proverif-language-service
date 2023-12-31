import {assert, expect} from "chai";

import {createSymbolTable} from "../src/tasks/create_symbol_table";
import {DependencySymbolTable, ParseResult} from "../src/document_manager";
import {getDefinitionLink} from "../src/go_to_definition";
import {parseProverif} from "../src/tasks/parse_proverif";
import {Position, Range} from "vscode-languageserver";
import {DefinitionLink} from "vscode-languageserver-protocol";
import {LibraryDependencyToken} from "../src/tasks/parse_library_dependencies";

describe('parser', function () {
    const getParserResult = (input: string, dependencyInput?: string, dependencyUri?: string, dependencyRange?: Range): ParseResult => {
        const {parser, parserTree} = parseProverif(input, false);
        assert.isUndefined(parserTree.exception);

        const symbolTable = createSymbolTable(parserTree).symbolTable;

        const dependencySymbolTables: DependencySymbolTable[] = [];
        if (dependencyInput) {
            const {parserTree} = parseProverif(dependencyInput, true);
            assert.isUndefined(parserTree.exception);

            const symbolTable = createSymbolTable(parserTree).symbolTable;
            const zeroPosition: Position = { line: 0, character: 0 };
            const zeroRange: Range = { start: zeroPosition, end: zeroPosition};
            dependencySymbolTables.push({symbolTable, uri: dependencyUri ?? "", range: dependencyRange ?? zeroRange, exists: true});
        }

        return {parser, parserTree, symbolTable, dependencies: dependencySymbolTables};
    };

    const assertDefinitionPointsToTarget = (definitionLink: DefinitionLink | undefined, targetUri: string, target: Position, targetCharacterLength: number, source: Position) => {
        assert.isDefined(definitionLink);
        if (!definitionLink) {
            return;
        }
        
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

    const assertSingleFileNavigation = async (code: string, click: Position, target: Position, targetCharacterLength: number) => {
        const uri = 'main';

        const parserResult = getParserResult(code);
        const definitionLink = await getDefinitionLink({uri}, parserResult, click);

        assertDefinitionPointsToTarget(definitionLink, uri, target, targetCharacterLength, click);
    };

    it("finds global scope variable", async () => {
        const code = `channel c. channel d. process \nout(c, c)`;
        const click = {line: 1, character: 5};
        const target = {line: 0, character: 8};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("override local scope variable", async () => {
        const code = `channel c. process \nnew c:channel; \nout(c, c)`;
        const click = {line: 2, character: 5};
        const target = {line: 1, character: 4};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("pattern variable", async () => {
        const code = `channel c. process \nin(c, b:bitstring); \nout(c, b)`;
        const click = {line: 2, character: 8};
        const target = {line: 1, character: 6};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("complex pattern variable", async () => {
        const code = `channel c. process \nin(c, (=2, b:bitstring)); \nout(c, b)`;
        const click = {line: 2, character: 8};
        const target = {line: 1, character: 11};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("override variable", async () => {
        const code = `channel c. free b: bitstring. process \nin(c, b:bitstring); \nout(c, b)`;
        const click = {line: 2, character: 8};
        const target = {line: 1, character: 6};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("do not override match variable", async () => {
        const code = `channel c. free b: bitstring. process \nin(c, =b); \nout(c, b)`;
        const click = {line: 2, character: 8};
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

        const click = {line: 2, character: 28};
        const target = {line: 1, character: 7};
        await assertSingleFileNavigation(code, click, target, 18);

        const click2 = {line: 5, character: 9};
        const target2 = {line: 4, character: 16};
        await assertSingleFileNavigation(code, click2, target2, 6);
    });

    it("consider query variables", async () => {
        const code = `free b: bitstring.\nquery x:bitstring; attacker(x). process 0`;
        const click = {line: 1, character: 29};
        const target = {line: 1, character: 6};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("consider let arguments", async () => {
        const code = `let Proc(c: channel) = \nin(c, b:bitstring).\nprocess 0`;
        const click = {line: 1, character: 4};
        const target = {line: 0, character: 9};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("consider multiple let arguments", async () => {
        const code = `let Proc() = 0.\nlet Proc2() = 0.\nprocess Proc2()`;
        const click = {line: 2, character: 9};
        const target = {line: 1, character: 4};

        await assertSingleFileNavigation(code, click, target, 5);
    });

    it("checks in dependencies if not found in main", async () => {
        const dependencyCode = `channel c.`;
        const dependencyUri = 'dependency';

        const code = 'process \nout(c, c)';
        const click = {line: 1, character: 5};
        const target = {line: 0, character: 8};

        const parserResult = getParserResult(code, dependencyCode, dependencyUri);
        const definitionLink = await getDefinitionLink({uri: 'dummy'}, parserResult, click);

        assertDefinitionPointsToTarget(definitionLink, dependencyUri, target, 1, click);
    });

    it("navigate to dependency when clicking on include", async () => {
        const dependencyCode = `channel c.`;
        const dependencyUri = 'dependency';

        const code = `(* -lib dependency.pvl *)\nprocess \n0`;
        const click = {line: 0, character: 9};
        const target = {line: 0, character: 0};

        const dependencyRange: Range = { start: {line: 0, character: 8}, end: {line: 0, character: 22}};
        const parserResult = getParserResult(code, dependencyUri, dependencyUri, dependencyRange);
        const definitionLink = await getDefinitionLink({uri: 'dummy'}, parserResult, click);

        assertDefinitionPointsToTarget(definitionLink, dependencyUri, target, 0, click);
    });
});