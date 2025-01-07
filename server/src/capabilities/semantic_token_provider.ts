import {SemanticTokens, SemanticTokensBuilder, TextDocumentIdentifier} from 'vscode-languageserver';
import {DocumentManagerInterface} from '../document_manager';
import {collectIdentTerminals} from "../proverif/collect_ident_terminals";
import {nonNullable} from "../utils/array";
import {DeclarationType, ProverifSymbol} from "../proverif/symbol_table/create_symbol_table";
import {getDefinitionSymbolFromMatch} from "../proverif/definition_symbol";

// It is unclear why an empty entry as first entry of tokenTypes is required, and why +1 for the index of the tokenModifiers needs to be added.
export const tokenModifier = ['readonly', 'dataConverter', 'typeConverter'];
export const tokenTypes = ['', 'function', 'variable', 'parameter', 'type'];

export const getSemanticTokens = async (identifier: TextDocumentIdentifier, documentManager: DocumentManagerInterface): Promise<SemanticTokens> => {
    const semanticTokensBuilder = await buildSemanticTokens(identifier, documentManager);
    return semanticTokensBuilder.build();
};

export const buildSemanticTokens = async (identifier: TextDocumentIdentifier, documentManager: DocumentManagerInterface): Promise<SemanticTokensBuilder> => {
    const proverifDocument = await documentManager.getProverifDocument(identifier);
    if (!proverifDocument || !proverifDocument.parserTree) {
        return new SemanticTokensBuilder();
    }

    // collect references
    const candidateTerminals = collectIdentTerminals(proverifDocument.parserTree);
    const terminalDefinitions = candidateTerminals
        .map(async terminal => getDefinitionSymbolFromMatch(proverifDocument, terminal, documentManager));

    const tokensBuilder = new SemanticTokensBuilder();
    (await Promise.all(terminalDefinitions))
        .filter(nonNullable)
        .forEach(terminalDefinition => {
            const tokenType = getTokenType(terminalDefinition.symbol.declaration);
            if (tokenType) {
                const line = terminalDefinition.origin.match.symbol.line - 1;
                const char = terminalDefinition.origin.match.symbol.charPositionInLine;
                const length = terminalDefinition.origin.match.symbol.stopIndex - terminalDefinition.origin.match.symbol.startIndex + 1;
                const tokenModifier = getTokenModifier(terminalDefinition.symbol);
                tokensBuilder.push(line, char, length, tokenType, tokenModifier);
            }
        });

    return tokensBuilder;
};

const getTokenModifier = (symbol: ProverifSymbol): number => {
    switch (symbol.declaration) {
        case DeclarationType.Channel:
        case DeclarationType.Free:
        case DeclarationType.Const:
        case DeclarationType.DefineParameter:
        case DeclarationType.ExpandParameter:
            return 1 << tokenModifier.indexOf("readonly");
    }

    if (symbol.declaration === DeclarationType.Fun) {
        if (symbol.options?.includes('data')) {
            return 1 << tokenModifier.indexOf("dataConverter");
        }
        if (symbol.options?.includes('typeConverter')) {
            return 1 << tokenModifier.indexOf("typeConverter");
        }
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
