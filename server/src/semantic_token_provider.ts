import {SemanticTokensBuilder, TextDocumentIdentifier} from 'vscode-languageserver';
import {DocumentManagerInterface} from './document_manager';
import {collectIdentTerminals} from "./parseTree/collect_terminals";
import {getDefinitionSymbolFromMatch} from "./go_to_definition";
import {nonNullable} from "./utils/array";
import {DeclarationType} from "./tasks/create_symbol_table";

// It is unclear why an empty entry as first entry of tokenTypes is required, and why +1 for the index of the tokenModifiers needs to be added.
export const tokenModifier = ['readonly'];
export const tokenTypes = ['', 'function', 'variable', 'parameter', 'type'];

export const getSemanticTokens = async (identifier: TextDocumentIdentifier, documentManager: DocumentManagerInterface) => {
    const parseResult = await documentManager.getParseResult(identifier);
    if (!parseResult.parserTree) {
        return undefined;
    }

    // collect references
    const candidateTerminals = collectIdentTerminals(parseResult.parserTree);
    const terminalDefinitions = candidateTerminals
        .map(async terminal => getDefinitionSymbolFromMatch(parseResult, terminal, documentManager));

    const tokensBuilder = new SemanticTokensBuilder();
    (await Promise.all(terminalDefinitions))
        .filter(nonNullable)
        .forEach(terminalDefinition => {
            const tokenType = getTokenType(terminalDefinition.symbol.declaration);
            if (tokenType) {
                const line = terminalDefinition.origin.match.symbol.line - 1;
                const char = terminalDefinition.origin.match.symbol.charPositionInLine;
                const length = terminalDefinition.origin.match.symbol.stopIndex - terminalDefinition.origin.match.symbol.startIndex + 1;
                const tokenModifier = getTokenModifier(terminalDefinition.symbol.declaration);
                tokensBuilder.push(line, char, length, tokenType, tokenModifier);
            }
        });

    return tokensBuilder.build();
};

const getTokenModifier = (declarationType: DeclarationType): number => {
    switch (declarationType) {
        case DeclarationType.Channel:
        case DeclarationType.Free:
        case DeclarationType.Const:
        case DeclarationType.DefineParameter:
        case DeclarationType.ExpandParameter:
            return tokenModifier.indexOf("readonly") + 1;
    }

    return 0;
};


const getTokenType = (declarationType: DeclarationType): number | undefined => {
    switch (declarationType) {
        case DeclarationType.Channel:
        case DeclarationType.Free:
        case DeclarationType.Const:
        case DeclarationType.Variable:
            return tokenTypes.indexOf('variable');
        case DeclarationType.Fun:
        case DeclarationType.Let:
        case DeclarationType.LetFun:
        case DeclarationType.Event:
        case DeclarationType.Table:
        case DeclarationType.Predicate:
            return tokenTypes.indexOf('function');
        case DeclarationType.Parameter:
        case DeclarationType.DefineParameter:
        case DeclarationType.ExpandParameter:
            return tokenTypes.indexOf('parameter');
        case DeclarationType.Type:
            return tokenTypes.indexOf('type');
    }

    return undefined;
};
