import {assert, expect, should} from "chai";

import {MockDocumentManager} from "./mocks/mock_document_manager";
import {buildSemanticTokens} from "../src/capabilities/semantic_token_provider";

describe('signature help', function () {
    const getSemanticTokensFrom = async (code: string) => {
        const uri = 'main.pv';

        const documentManager = new MockDocumentManager();
        documentManager.addProverifDocument(uri, code);
        return await buildSemanticTokens({uri}, documentManager);
    }

    const assertSemanticToken = async (code: string, expectedFirstTokenData: number[]) => {
        const semanticTokens = await getSemanticTokensFrom(code)

        /**
         * implementation is:
         * this._data[this._dataLen++] = pushLine;
         * this._data[this._dataLen++] = pushChar;
         * this._data[this._dataLen++] = length;
         * this._data[this._dataLen++] = tokenType;
         * this._data[this._dataLen++] = tokenModifiers;
         */
        // @ts-ignore
        const rawData = semanticTokens._data
        const firstTokenData = rawData.slice(0, 5);
        assert.deepStrictEqual(firstTokenData, expectedFirstTokenData)
    };

    it("considers data converter attribute", async () => {
        const code = `fun converter(nat): bitstring [data].\nprocess \nout(c, (converter(`;

        // 1 is function, 2 is data converter
        await assertSemanticToken(code, [0, 4, 9, 1, 2]);
    });

    it("does not crash on invalid letfun", async () => {
        // note that there is a syntax error in the let of the reduc
        const code = `fun converter(nat): nat \nreduc forall i: nat;\nlet i2 = i +  in\nconverter(i2) = 1.\nprocess \n0`;
        const uri = 'main.pvl';

        const documentManager = new MockDocumentManager(true);
        documentManager.addProverifDocument(uri, code);

        // operation should not crash
        const tokens = await buildSemanticTokens({uri}, documentManager);
        assert.isObject(tokens);
    });
});