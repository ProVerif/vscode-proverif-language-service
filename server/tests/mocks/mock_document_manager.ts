import {Range, TextDocumentIdentifier} from "vscode-languageserver";
import {TextDocument} from "vscode-languageserver-textdocument";
import {DocumentManager, DocumentManagerInterface, ParseResult} from "../../src/document_manager";
import {inflate} from "node:zlib";
import {getParserResult} from "./parser";

export class MockDocumentManager implements DocumentManagerInterface {

    public markSettingsChanged(): Promise<void> {
        return;
    }

    public closeDocument(identifier: TextDocumentIdentifier): void {
        return;
    }

    public markDocumentContentChanged(document: TextDocument): Promise<void> {
        return;
    }

    public markFilesystemDocumentContentChanged(document: TextDocument): Promise<void> {
        return;
    }

    private parseResults: Map<string, ParseResult> = new Map();
    public parse(uri: string, code: string, dependencyUri?: string, dependencyRange?: Range) {
        const parserResult = getParserResult(uri, code, dependencyUri, dependencyRange);
        this.parseResults.set(uri, parserResult);
    }


    public async getParseResult(identifier: TextDocumentIdentifier): Promise<ParseResult | undefined> {
        return this.parseResults.get(identifier.uri);
    }

}