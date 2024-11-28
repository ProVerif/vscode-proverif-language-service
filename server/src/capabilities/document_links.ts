import {DocumentManagerInterface} from "../document_manager";
import {DocumentLink, TextDocumentIdentifier} from "vscode-languageserver";

export const getDocumentLinks = async (identifier: TextDocumentIdentifier, documentManager: DocumentManagerInterface): Promise<DocumentLink[]|undefined> => {
    const proverifDocument = await documentManager.getProverifDocument(identifier);
    if (!proverifDocument) {
        return undefined;
    }

    return proverifDocument.dependencyTokens
        .filter(dependency => dependency.exists)
        .map(dependency => DocumentLink.create(dependency.range, dependency.uri));
};