import {Hover, MarkupContent, MarkupKind, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {DocumentManagerInterface} from "./document_manager";
import {getDefinitionSymbolFromPosition} from "./go_to_definition";
import {ParseTree} from "antlr4ts/tree";
import {getRange} from "./parseTree/get_range";
import {DeclarationType, ProverifSymbol, ProverifSymbolParameter} from "./tasks/create_symbol_table";

export const getHover = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<Hover | undefined> => {
    const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, position, documentManager);
    if (!definitionSymbol) {
        return undefined;
    }

    // prevent to show help over own definition
    if (definitionSymbol.symbol.node.symbol === definitionSymbol.origin.match.symbol) {
        return undefined;
    }

    return constructHover(definitionSymbol.symbol, definitionSymbol.origin.match);
};

const constructHover = (definitionSymbol: ProverifSymbol, source: ParseTree): Hover | undefined => {
    const range = getRange(source);
    const fullName = getFullName(definitionSymbol);
    const contents = createProverifMarkupContent(fullName);

    return {range, contents};
};

const createProverifMarkupContent = (proverifCode: string): MarkupContent => {
    return {
        kind: MarkupKind.Markdown,
        value: [
            '```pv',
            proverifCode,
            '```'
        ].join('\n')
    };
};

const getFullName = (definitionSymbol: ProverifSymbol): string => {
    const declarationPrefix = getDeclarationPrefix(definitionSymbol.declaration);
    const name = definitionSymbol.node.text;
    const parametersString = getParametersString(definitionSymbol.parameters);
    const typeSuffix = getTypeSuffix(definitionSymbol.type);

    return declarationPrefix + name + parametersString + typeSuffix;
};

const getDeclarationPrefix = (declarationType: DeclarationType): string => {
    switch (declarationType) {
        case DeclarationType.Parameter:
        case DeclarationType.DefineParameter:
        case DeclarationType.ExpandParameter:
            return "parameter ";
        case DeclarationType.Variable:
            return "(variable) ";
        default:
            return `${declarationType} `;
    }
};

const getParametersString = (parameters?: (ProverifSymbolParameter | undefined)[]): string => {
    if (!parameters) {
        return "";
    }

    const parameterListString = parameters
        .map(parameter => parameter ? parameter.node.text + getTypeSuffix(parameter.type) : "")
        .join(", ");

    return `(${parameterListString})`;
};

const getTypeSuffix = (type?: ParseTree) => {
    return type ? ": " + type.text : "";
};