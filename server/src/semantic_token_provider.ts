import {SemanticTokensBuilder} from 'vscode-languageserver';
import {ParseResult} from './document_manager';

export const tokenModifier = ['declaration', 'deprecated'];
export const tokenTypes = ['function', 'variable', 'parameter', 'event'];

export const getSemanticTokens = (parseResult: ParseResult) => {
	// solely for demonstration purposes
    const tokensBuilder = new SemanticTokensBuilder();
	tokensBuilder.push(9, 8, 1, tokenTypes.indexOf('variable'), [tokenModifier.indexOf('deprecated')] as any);
	tokensBuilder.push(10, 8, 1, tokenTypes.indexOf('variable'), [] as any);
	tokensBuilder.push(10, 11, 1, tokenTypes.indexOf('variable'), tokenModifier.indexOf('deprecated'));
    return tokensBuilder.build();
};