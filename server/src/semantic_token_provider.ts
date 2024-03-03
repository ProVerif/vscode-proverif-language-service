import {integer, SemanticTokensBuilder} from 'vscode-languageserver';
import {DocumentManagerInterface, ParseResult} from './document_manager';
import {collectIdentTerminals, collectMatchingTerminals} from "./parseTree/collect_terminals";
import {definitionSymbolsEqual, getDefinitionSymbolFromMatch} from "./go_to_definition";
import {nonNullable} from "./utils/array";
import {notNull} from "antlr4ts/misc";
import {DeclarationType} from "./tasks/create_symbol_table";

export const tokenModifier = ['declaration', 'deprecated'];
export const tokenTypes = ['function', 'variable', 'parameter', 'event'];

export const getSemanticTokens = async (parseResult: ParseResult, documentManager: DocumentManagerInterface) => {
    // collect references
    const candidateTerminals = collectIdentTerminals(parseResult.parserTree);
    const terminalDefinitions = candidateTerminals
        .map(async terminal => getDefinitionSymbolFromMatch(parseResult, terminal, documentManager));

	const tokensBuilder = new SemanticTokensBuilder();
    (await Promise.all(terminalDefinitions))
		.filter(nonNullable)
        .forEach(terminalDefinition => {
			const tokenType = getTokenType(terminalDefinition.symbol.declaration)
			if (tokenType) {
				const line = terminalDefinition.origin.match.symbol.line - 1;
				const char = terminalDefinition.origin.match.symbol.charPositionInLine;
				const length = terminalDefinition.origin.match.symbol.stopIndex - terminalDefinition.origin.match.symbol.startIndex + 1;
				tokensBuilder.push(line, char, length, tokenType, [] as any)
			}
        });

    return tokensBuilder.build();
};

const getTokenType = (declarationType: DeclarationType): number|undefined => {
	switch (declarationType) {
		case DeclarationType.Channel:
		case DeclarationType.Free:
		case DeclarationType.Const:
			return tokenTypes.indexOf('variable')
	}

	return undefined
}