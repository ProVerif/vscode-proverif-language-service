import {assert, expect} from "chai";

import {CharStreams, CommonTokenStream} from "antlr4ts";
import {ProverifLexer} from "../src/parser-proverif/ProverifLexer";
import {ProverifParser} from "../src/parser-proverif/ProverifParser";
import {createSymbolTable} from "../src/tasks/create_symbol_table";
import {DependencySymbolTable, ParseResult} from "../src/document_manager";
import {getDefinitionLink} from "../src/go_to_definition";
import {parseProverif} from "../src/tasks/parse_proverif";

describe('parser', function () {
    const getParserResult = (input: string, dependencyUri?: string, dependencyInput?: string): ParseResult => {
        const {parser, parserTree} = parseProverif(input, false);
        assert.isUndefined(parserTree.exception);

        const symbolTable = createSymbolTable(parserTree).symbolTable;

        const dependencySymbolTables: DependencySymbolTable[] = [];
        if (dependencyInput) {
            const {parser, parserTree} = parseProverif(dependencyInput, true);
            assert.isUndefined(parserTree.exception);

            const symbolTable = createSymbolTable(parserTree).symbolTable;
            dependencySymbolTables.push({symbolTable, uri: dependencyUri});
        }

        return {parser, parserTree, symbolTable, dependencies: dependencySymbolTables};
    };

    it("finds global scope variable", async () => {
        const code = `channel c. channel d. process \nout(c, c)`;

        const parserResult = getParserResult(code);
        const definitionLink = await getDefinitionLink({uri: 'dummy'}, parserResult, {line: 1, character: 5});

        assert.isDefined(definitionLink);
        if (definitionLink) {
            expect(definitionLink.targetRange.start).to.deep.equal({line: 0, character: 8});
            expect(definitionLink.targetRange.end).to.deep.equal({line: 0, character: 9});
            expect(definitionLink.targetSelectionRange).to.deep.equal(definitionLink.targetRange);

            assert.isDefined(definitionLink.originSelectionRange);
            if (definitionLink.originSelectionRange) {
                expect(definitionLink.originSelectionRange.start).to.deep.equal({line: 1, character: 4});
                expect(definitionLink.originSelectionRange.end).to.deep.equal({line: 1, character: 5});
            }
        }
    });

    it("override local scope variable", async () => {
        const code = `channel c. process \nnew c:channel; \nout(c, c)`;

        const parserResult = getParserResult(code);
        const definitionLink = await getDefinitionLink({uri: 'dummy'}, parserResult, {line: 2, character: 5});

        assert.isDefined(definitionLink);
        if (definitionLink) {
            expect(definitionLink.targetRange.start).to.deep.equal({line: 1, character: 4});
            expect(definitionLink.targetRange.end).to.deep.equal({line: 1, character: 5});
            expect(definitionLink.targetSelectionRange).to.deep.equal(definitionLink.targetRange);

            assert.isDefined(definitionLink.originSelectionRange);
            if (definitionLink.originSelectionRange) {
                expect(definitionLink.originSelectionRange.start).to.deep.equal({line: 2, character: 4});
                expect(definitionLink.originSelectionRange.end).to.deep.equal({line: 2, character: 5});
            }
        }
    });

    it("checks in dependencies if not found in main", async () => {
        const dependencyCode = `channel c.`;
        const code = 'process \nout(c, c)';

        const parserResult = getParserResult(code, 'dependency', dependencyCode);
        const definitionLink = await getDefinitionLink({uri: 'dummy'}, parserResult, {line: 1, character: 5});

        assert.isDefined(definitionLink);
        if (definitionLink) {
            expect(definitionLink.targetUri).to.equal('dependency');
            expect(definitionLink.targetRange.start).to.deep.equal({line: 0, character: 8});
            expect(definitionLink.targetRange.end).to.deep.equal({line: 0, character: 9});
            expect(definitionLink.targetSelectionRange).to.deep.equal(definitionLink.targetRange);

            assert.isDefined(definitionLink.originSelectionRange);
            if (definitionLink.originSelectionRange) {
                expect(definitionLink.originSelectionRange.start).to.deep.equal({line: 1, character: 4});
                expect(definitionLink.originSelectionRange.end).to.deep.equal({line: 1, character: 5});
            }
        }
    });
});