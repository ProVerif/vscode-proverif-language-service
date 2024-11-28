import {TextDocumentIdentifier} from "vscode-languageserver";
import {TextDocument} from "vscode-languageserver-textdocument";


export type ProverifLogDocument = {
    identifier: TextDocumentIdentifier
    document: TextDocument
};

export class DocumentManager {
    public supports(identifier: TextDocumentIdentifier) {
        return identifier.uri.endsWith('.pv.log');
    }

    public getProverifLogDocument = async (identifier: TextDocument): Promise<ProverifLogDocument | undefined> => {
        return {identifier, document: identifier};
    };
}