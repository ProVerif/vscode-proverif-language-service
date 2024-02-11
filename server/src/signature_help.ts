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
import {getSignaturePosition} from "./parseTree/get_terminal_before_position";

export const getSignatureHelp = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<SignatureHelp | undefined> => {
    const parseResult = await documentManager.getParseResult(identifier);
    if (!parseResult) {
        return undefined;
    }

    const signaturePosition = getSignaturePosition(parseResult.parser.inputStream, position);
    if (!signaturePosition) {
        return undefined;
    }

    const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, signaturePosition.signatureTokenPosition, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    const parameterLabels = (definitionSymbol.symbol.parameters ?? []).map(parameter => parameter?.text ?? "");
    const {parameters, signatureLabel} = createOffsetLabels(parameterLabels, definitionSymbol.symbol.node.text);

    const signature: SignatureInformation = {label: signatureLabel, parameters};
    return {signatures: [signature], activeSignature: 0, activeParameter: signaturePosition.parameterPosition};
};

const createOffsetLabels = (parameterLabels: string[], signatureText: string) => {
    const parameters: ParameterInformation[] = [];
    let currentOffset = signatureText.length + 1;
    for (let i = 0; i < parameterLabels.length; i++) {
        const parameterLabel = parameterLabels[i];
        parameters.push({label: [currentOffset, currentOffset + parameterLabel.length]});
        currentOffset += parameterLabel.length + 1;
    }

    return {
        parameters,
        signatureLabel: `${signatureText}(${parameterLabels.join(",")})`
    };
};

export const getActiveParameter = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<uinteger | undefined> => {
    const parseResult = await documentManager.getParseResult(identifier);
    if (!parseResult) {
        return undefined;
    }

    const signaturePosition = getSignaturePosition(parseResult.parser.inputStream, position);
    if (!signaturePosition) {
        return undefined;
    }

    return signaturePosition.parameterPosition;
};
