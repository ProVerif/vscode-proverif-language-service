import {TextDocumentIdentifier} from "vscode-languageserver";
import {TextDocument} from "vscode-languageserver-textdocument";
import {Connection} from "vscode-languageserver/node";
import {sendDiagnostics} from "../utils/diagnostics";
import {findFalseLemmas} from "./find_errors";


export type ProverifLogDocument = {
    identifier: TextDocumentIdentifier
    document: TextDocument
};

export class DocumentManager {
    constructor(private connection: Connection) {
    }

    public supports(identifier: TextDocumentIdentifier) {
        return identifier.uri.endsWith('.pv.log');
    }

    public getProverifLogDocument = async (identifier: TextDocument): Promise<ProverifLogDocument | undefined> => {
        return {identifier, document: identifier};
    };

    public markDocumentChanged = async (document: TextDocument) => {
        const diagnostics = await findFalseLemmas(document);
        await sendDiagnostics(this.connection, document, diagnostics);
    };
}