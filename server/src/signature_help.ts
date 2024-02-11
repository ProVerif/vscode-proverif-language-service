import {
    ParameterInformation,
    Position,
    SignatureHelp,
    SignatureInformation,
    TextDocumentIdentifier,
    uinteger
} from "vscode-languageserver";
import {DocumentManagerInterface} from "./document_manager";
import {DefinitionSymbol, getDefinitionSymbolFromPosition} from "./go_to_definition";
import {getSignaturePosition} from "./parseTree/get_signature_position";

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

    const {parameters, signatureLabel} = createOffsetLabels(definitionSymbol);

    const signature: SignatureInformation = {label: signatureLabel, parameters};
    return {signatures: [signature], activeSignature: 0, activeParameter: signaturePosition.parameterPosition};
};

const createOffsetLabels = (definitionSymbol: DefinitionSymbol) => {
    const parameterLabels = (definitionSymbol.symbol.parameters ?? []).map(parameter => {
        if (!parameter) {
            return ""
        }

        const typeSuffix = parameter.type ? ": " + parameter.type.text : "";
        return parameter.node.text + typeSuffix
    });


    const parameters: ParameterInformation[] = [];
    const signatureText = definitionSymbol.symbol.node.text;
    let currentOffset = signatureText.length + 1;
    for (let i = 0; i < parameterLabels.length; i++) {
        const parameterLabel = parameterLabels[i];
        parameters.push({label: [currentOffset, currentOffset + parameterLabel.length]});
        currentOffset += parameterLabel.length + 2;
    }

    return {
        parameters,
        signatureLabel: `${signatureText}(${parameterLabels.join(", ")})`
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
