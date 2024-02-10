import {
    ParameterInformation,
    Position,
    SignatureHelp,
    SignatureInformation,
    TextDocumentIdentifier,
    uinteger
} from "vscode-languageserver";
import {DocumentManagerInterface} from "./document_manager";
import {getDefinitionSymbolFromPosition} from "./go_to_definition";
import {
    countCommasAfterLParenButBeforeToken,
    getPositionOfTokenBeforeLastLParen
} from "./parseTree/get_terminal_before_position";

export const getSignatureHelp = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<SignatureHelp | undefined> => {
    const parseResult = await documentManager.getParseResult(identifier);
    if (!parseResult) {
        return undefined;
    }

    const positionOfTokenBefore = getPositionOfTokenBeforeLastLParen(parseResult.parser.inputStream, position);
    if (!positionOfTokenBefore) {
        return undefined;
    }

    const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, positionOfTokenBefore, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    const parameterLabels =  (definitionSymbol.symbol.parameters ?? []).map(parameter => parameter?.text ?? "");
    let signatureLabel = definitionSymbol.symbol.node.text + "(";

    const parameters: ParameterInformation[] = [];
    let currentOffset = signatureLabel.length;
    for (let i = 0; i < parameterLabels.length; i++) {
        const parameterLabel = parameterLabels[i];
        parameters.push({ label: [currentOffset, currentOffset + parameterLabel.length]});
        currentOffset += parameterLabel.length + 1;
    }
    signatureLabel += parameterLabels.join(",") + ")";

    const signature: SignatureInformation = { label: signatureLabel, parameters };
    return { signatures: [signature], activeSignature: 0, activeParameter: 0 };
};

export const getActiveParameter = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<uinteger | undefined> => {
    const parseResult = await documentManager.getParseResult(identifier);
    if (!parseResult) {
        return undefined;
    }

    const positionOfTokenBefore = countCommasAfterLParenButBeforeToken(parseResult.parser.inputStream, position);
    if (!positionOfTokenBefore) {
        return undefined;
    }

    return positionOfTokenBefore;
};
