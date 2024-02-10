import {
    ParameterInformation,
    Position,
    SignatureHelp,
    SignatureInformation,
    TextDocumentIdentifier
} from "vscode-languageserver";
import {DocumentManagerInterface} from "./document_manager";
import {getDefinitionSymbolFromPosition} from "./go_to_definition";
import {getPositionOfTokenBefore} from "./parseTree/get_terminal_before_position";

export const getSignatureHelp = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<SignatureHelp | undefined> => {
    const parseResult = await documentManager.getParseResult(identifier);
    if (!parseResult) {
        return undefined;
    }

    const positionOfTokenBefore = getPositionOfTokenBefore(parseResult.parser.inputStream, position);
    if (!positionOfTokenBefore) {
        return undefined;
    }

    const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, positionOfTokenBefore, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    const parameters: ParameterInformation[] =  (definitionSymbol.symbol.parameters ?? []).map(parameter => ({ label: parameter?.text ?? "" }))
    const signature: SignatureInformation = { label: definitionSymbol.symbol.node.text, parameters, activeParameter: 0 }
    return { signatures: [signature], activeSignature: 0, activeParameter: 0 }
}