import {assert, expect} from "chai";

import {createSymbolTable} from "../src/tasks/create_symbol_table";
import {DependencySymbolTable, ParseResult} from "../src/document_manager";
import {getDefinitionLink} from "../src/go_to_definition";
import {parseProverif} from "../src/tasks/parse_proverif";
import {Position} from "vscode-languageserver";
import {DefinitionLink} from "vscode-languageserver-protocol";

describe('parser', function () {
    const getParserResult = (input: string, dependencyUri?: string, dependencyInput?: string): ParseResult => {
        const {parser, parserTree} = parseProverif(input, false);
        assert.isUndefined(parserTree.exception);

        const symbolTable = createSymbolTable(parserTree).symbolTable;

        const dependencySymbolTables: DependencySymbolTable[] = [];
        if (dependencyUri && dependencyInput) {
            const {parserTree} = parseProverif(dependencyInput, true);
            assert.isUndefined(parserTree.exception);

            const symbolTable = createSymbolTable(parserTree).symbolTable;
            dependencySymbolTables.push({symbolTable, uri: dependencyUri});
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

    it("consider query variables", async () => {
        const code = `free b: bitstring.\nquery x:bitstring; attacker(x). process \nin(c, b)`;
        const click = {line: 1, character: 29};
        const target = {line: 1, character: 6};

        await assertSingleFileNavigation(code, click, target, 1);
    });

    it("checks in dependencies if not found in main", async () => {
        const dependencyCode = `channel c.`;
        const dependencyUri = 'dependency';

        const code = 'process \nout(c, c)';
        const click = {line: 1, character: 5};
        const target = {line: 0, character: 8};

        const parserResult = getParserResult(code, dependencyUri, dependencyCode);
        const definitionLink = await getDefinitionLink({uri: 'dummy'}, parserResult, click);

        assertDefinitionPointsToTarget(definitionLink, dependencyUri, target, 1, click);
    });
});