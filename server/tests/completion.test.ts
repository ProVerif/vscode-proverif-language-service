import {expect} from "chai";

import {Position} from "vscode-languageserver";
import {MockDocumentManager} from "./mocks/mock_document_manager";
import {getCompletion} from "../src/capabilities/completion";

describe('completion', function () {
    const getCompletionsFrom = async (code: string, completionInvoked: Position) => {
        const uri = 'main.pv';

        const documentManager = new MockDocumentManager(true);
        documentManager.addProverifDocument(uri, code);
        return await getCompletion({uri}, completionInvoked, documentManager);
    }

    const setCompletions = [
        'verboseClauses',
        'verboseLemmas'
    ]

    const assertSomeCompletionsFound = async (code: string, completionInvoked: Position, expectedCompletionsCount: number) => {
        const completions = await getCompletionsFrom(code, completionInvoked)

        expect(completions.length).to.equal(expectedCompletionsCount)
    };

    const assertTextCompletionsFound = async (code: string, completionInvoked: Position, expectedCompletions: string[]) => {
        const completions = await getCompletionsFrom(code, completionInvoked)

        expect(completions.length).to.equal(expectedCompletions.length)
        expect(completions.map(entry => entry.label)).to.deep.equal(expectedCompletions)
    };

    it("completes set statements", async () => {
        const code = `set `;
        const completionInvoked = {line: 0, character: 4};

        await assertSomeCompletionsFound(code, completionInvoked, 59);
    });

    it("completes set values", async () => {
        const code = `set redundancyElim = `;
        const completionInvoked = {line: 0, character: 21};

        await assertTextCompletionsFound(code, completionInvoked, ["best", "simple", "no"]);
    });
});