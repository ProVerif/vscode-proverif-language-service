import {DocumentManagerInterface} from "../document_manager/document_manager";
import {DocumentLink, TextDocumentIdentifier} from "vscode-languageserver";

export const getDocumentLinks = async (identifier: TextDocumentIdentifier, documentManager: DocumentManagerInterface): Promise<DocumentLink[]|undefined> => {
    const parseResult = await documentManager.getParseResult(identifier);

    return parseResult.dependencyTokens
        .filter(dependency => dependency.exists)
        .map(dependency => DocumentLink.create(dependency.range, dependency.uri));
};