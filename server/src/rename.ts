import {Position, TextDocumentIdentifier} from "vscode-languageserver";
import {DocumentManagerInterface} from "./document_manager";
import {WorkspaceEdit} from "vscode-languageserver-protocol";
import {getReferences} from "./references";
import {DocumentUri, TextEdit} from "vscode-languageserver-types";

export const rename = async (identifier: TextDocumentIdentifier, position: Position, newText: string, documentManager: DocumentManagerInterface): Promise<WorkspaceEdit | undefined> => {
    const references = await getReferences(identifier, position, documentManager)
    if (!references) {
        return undefined
    }

    const changes: { [uri: DocumentUri]: TextEdit[] } = {}
    references.forEach(reference => {
        if (!changes[reference.uri]) {
            changes[reference.uri] = []
        }

        changes[reference.uri].push({range: reference.range, newText: newText})
    })

    console.log(changes, references)

    return {changes}
};
