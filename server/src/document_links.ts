import {ParseResult} from "./document_manager";
import {DocumentLink} from "vscode-languageserver";

export const getDocumentLinks = async (parseResult: ParseResult): Promise<DocumentLink[]> => {
    return parseResult.dependencyTokens
        .filter(dependency => dependency.exists)
        .map(dependency => DocumentLink.create(dependency.range, dependency.uri));
};