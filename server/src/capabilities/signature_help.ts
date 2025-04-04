import {
    ParameterInformation,
    Position,
    SignatureHelp,
    SignatureInformation,
    TextDocumentIdentifier
} from "vscode-languageserver";
import {DocumentManagerInterface} from "../document_manager";
import {getSignaturePosition} from "../proverif/get_signature_position";
import {DefinitionSymbol, getDefinitionSymbolFromPosition} from "../proverif/definition_symbol";

export const getSignatureHelp = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<SignatureHelp | undefined> => {
    const proverifDocument = await documentManager.getProverifDocument(identifier);
    if (!proverifDocument || !proverifDocument.parser) {
        return undefined;
    }

    const signaturePosition = getSignaturePosition(proverifDocument.parser.inputStream, position);
    if (!signaturePosition) {
        return undefined;
    }

    const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, signaturePosition.signatureTokenPosition, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    // prevent self to show help
    if (definitionSymbol.symbol.node.symbol === signaturePosition.signatureToken) {
        return undefined;
    }

    const {parameters, signatureLabel} = createOffsetLabels(definitionSymbol);

    const signature: SignatureInformation = {label: signatureLabel, parameters};
    return {signatures: [signature], activeSignature: 0, activeParameter: signaturePosition.parameterPosition};
};

const createOffsetLabels = (definitionSymbol: DefinitionSymbol) => {
    const parameterLabels = (definitionSymbol.symbol.parameters ?? []).map(parameter => {
        if (!parameter) {
            return "";
        }

        const typeSuffix = parameter.type ? ": " + parameter.type.text : "";
        return parameter.node.text + typeSuffix;
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
