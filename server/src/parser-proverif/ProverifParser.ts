// Generated from grammar/ProverifParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { ProverifParserListener } from "./ProverifParserListener";
import { ProverifParserVisitor } from "./ProverifParserVisitor";


export class ProverifParser extends Parser {
	public static readonly DelimitedComment = 1;
	public static readonly WS = 2;
	public static readonly DOT = 3;
	public static readonly COLON = 4;
	public static readonly SEMICOLON = 5;
	public static readonly COMMA = 6;
	public static readonly LPAREN = 7;
	public static readonly RPAREN = 8;
	public static readonly LSQUARE = 9;
	public static readonly RSQUARE = 10;
	public static readonly ADD = 11;
	public static readonly SUB = 12;
	public static readonly STAR = 13;
	public static readonly HASH = 14;
	public static readonly AT = 15;
	public static readonly ARROW = 16;
	public static readonly CONJUNCTION = 17;
	public static readonly DISJUNCTION = 18;
	public static readonly LESS = 19;
	public static readonly GREATER = 20;
	public static readonly LESS_EQUAL = 21;
	public static readonly GREATER_EQUAL = 22;
	public static readonly NOT_EQ = 23;
	public static readonly EQ = 24;
	public static readonly FREE = 25;
	public static readonly CHANNEL = 26;
	public static readonly PROCESS = 27;
	public static readonly OUT = 28;
	public static readonly IN = 29;
	public static readonly Number = 30;
	public static readonly BooleanLiteral = 31;
	public static readonly Identifier = 32;
	public static readonly RULE_proverifFile = 0;
	public static readonly RULE_declaration = 1;
	public static readonly RULE_process = 2;
	public static readonly RULE_pterm = 3;
	public static readonly RULE_identifier_sequence = 4;
	public static readonly RULE_type_id = 5;
	public static readonly RULE_expression = 6;
	public static readonly RULE_parenthesizedExpression = 7;
	public static readonly RULE_literalConstant = 8;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"proverifFile", "declaration", "process", "pterm", "identifier_sequence", 
		"type_id", "expression", "parenthesizedExpression", "literalConstant",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, "'.'", "':'", "';'", "','", "'('", "')'", 
		"'['", "']'", "'+'", "'-'", "'*'", "'#'", "'@'", "'==>'", "'&&'", "'||'", 
		"'<'", "'>'", "'<='", "'>='", "'<>'", "'='", "'free'", "'channel'", "'process'", 
		"'out'", "'in'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "DelimitedComment", "WS", "DOT", "COLON", "SEMICOLON", "COMMA", 
		"LPAREN", "RPAREN", "LSQUARE", "RSQUARE", "ADD", "SUB", "STAR", "HASH", 
		"AT", "ARROW", "CONJUNCTION", "DISJUNCTION", "LESS", "GREATER", "LESS_EQUAL", 
		"GREATER_EQUAL", "NOT_EQ", "EQ", "FREE", "CHANNEL", "PROCESS", "OUT", 
		"IN", "Number", "BooleanLiteral", "Identifier",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(ProverifParser._LITERAL_NAMES, ProverifParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return ProverifParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "ProverifParser.g4"; }

	// @Override
	public get ruleNames(): string[] { return ProverifParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return ProverifParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(ProverifParser._ATN, this);
	}
	// @RuleVersion(0)
	public proverifFile(): ProverifFileContext {
		let _localctx: ProverifFileContext = new ProverifFileContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, ProverifParser.RULE_proverifFile);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 21;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === ProverifParser.FREE || _la === ProverifParser.CHANNEL) {
				{
				{
				this.state = 18;
				this.declaration();
				}
				}
				this.state = 23;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 24;
			this.match(ProverifParser.PROCESS);
			this.state = 25;
			this.process();
			this.state = 26;
			this.match(ProverifParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declaration(): DeclarationContext {
		let _localctx: DeclarationContext = new DeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, ProverifParser.RULE_declaration);
		try {
			this.state = 37;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ProverifParser.CHANNEL:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 28;
				this.match(ProverifParser.CHANNEL);
				this.state = 29;
				this.identifier_sequence();
				this.state = 30;
				this.match(ProverifParser.DOT);
				}
				break;
			case ProverifParser.FREE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 32;
				this.match(ProverifParser.FREE);
				this.state = 33;
				this.identifier_sequence();
				this.state = 34;
				this.match(ProverifParser.COLON);
				this.state = 35;
				this.type_id();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public process(): ProcessContext {
		let _localctx: ProcessContext = new ProcessContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, ProverifParser.RULE_process);
		try {
			this.state = 53;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ProverifParser.IN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 39;
				this.match(ProverifParser.IN);
				this.state = 40;
				this.match(ProverifParser.LPAREN);
				this.state = 41;
				this.pterm();
				this.state = 42;
				this.match(ProverifParser.COMMA);
				this.state = 43;
				this.pterm();
				this.state = 44;
				this.match(ProverifParser.RPAREN);
				}
				break;
			case ProverifParser.OUT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 46;
				this.match(ProverifParser.OUT);
				this.state = 47;
				this.match(ProverifParser.LPAREN);
				this.state = 48;
				this.pterm();
				this.state = 49;
				this.match(ProverifParser.COMMA);
				this.state = 50;
				this.pterm();
				this.state = 51;
				this.match(ProverifParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pterm(): PtermContext {
		let _localctx: PtermContext = new PtermContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, ProverifParser.RULE_pterm);
		let _la: number;
		try {
			this.state = 64;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ProverifParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 55;
				this.match(ProverifParser.Identifier);
				}
				break;
			case ProverifParser.LPAREN:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 56;
				this.match(ProverifParser.LPAREN);
				this.state = 60;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === ProverifParser.LPAREN || _la === ProverifParser.Identifier) {
					{
					{
					this.state = 57;
					this.pterm();
					}
					}
					this.state = 62;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 63;
				this.match(ProverifParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public identifier_sequence(): Identifier_sequenceContext {
		let _localctx: Identifier_sequenceContext = new Identifier_sequenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, ProverifParser.RULE_identifier_sequence);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 66;
			this.match(ProverifParser.Identifier);
			this.state = 71;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === ProverifParser.COMMA) {
				{
				{
				this.state = 67;
				this.match(ProverifParser.COMMA);
				this.state = 68;
				this.match(ProverifParser.Identifier);
				}
				}
				this.state = 73;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public type_id(): Type_idContext {
		let _localctx: Type_idContext = new Type_idContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, ProverifParser.RULE_type_id);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 74;
			this.match(ProverifParser.Identifier);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, ProverifParser.RULE_expression);
		try {
			this.state = 78;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ProverifParser.LPAREN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 76;
				this.parenthesizedExpression();
				}
				break;
			case ProverifParser.Number:
			case ProverifParser.BooleanLiteral:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 77;
				this.literalConstant();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parenthesizedExpression(): ParenthesizedExpressionContext {
		let _localctx: ParenthesizedExpressionContext = new ParenthesizedExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, ProverifParser.RULE_parenthesizedExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 80;
			this.match(ProverifParser.LPAREN);
			this.state = 81;
			this.expression();
			this.state = 82;
			this.match(ProverifParser.RPAREN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public literalConstant(): LiteralConstantContext {
		let _localctx: LiteralConstantContext = new LiteralConstantContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, ProverifParser.RULE_literalConstant);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 84;
			_la = this._input.LA(1);
			if (!(_la === ProverifParser.Number || _la === ProverifParser.BooleanLiteral)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\"Y\x04\x02\t" +
		"\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07\t" +
		"\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x03\x02\x07\x02\x16\n\x02\f\x02\x0E" +
		"\x02\x19\v\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03(\n\x03\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x05\x048\n\x04\x03\x05\x03\x05\x03\x05" +
		"\x07\x05=\n\x05\f\x05\x0E\x05@\v\x05\x03\x05\x05\x05C\n\x05\x03\x06\x03" +
		"\x06\x03\x06\x07\x06H\n\x06\f\x06\x0E\x06K\v\x06\x03\x07\x03\x07\x03\b" +
		"\x03\b\x05\bQ\n\b\x03\t\x03\t\x03\t\x03\t\x03\n\x03\n\x03\n\x02\x02\x02" +
		"\v\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x02" +
		"\x03\x03\x02 !\x02V\x02\x17\x03\x02\x02\x02\x04\'\x03\x02\x02\x02\x06" +
		"7\x03\x02\x02\x02\bB\x03\x02\x02\x02\nD\x03\x02\x02\x02\fL\x03\x02\x02" +
		"\x02\x0EP\x03\x02\x02\x02\x10R\x03\x02\x02\x02\x12V\x03\x02\x02\x02\x14" +
		"\x16\x05\x04\x03\x02\x15\x14\x03\x02\x02\x02\x16\x19\x03\x02\x02\x02\x17" +
		"\x15\x03\x02\x02\x02\x17\x18\x03\x02\x02\x02\x18\x1A\x03\x02\x02\x02\x19" +
		"\x17\x03\x02\x02\x02\x1A\x1B\x07\x1D\x02\x02\x1B\x1C\x05\x06\x04\x02\x1C" +
		"\x1D\x07\x02\x02\x03\x1D\x03\x03\x02\x02\x02\x1E\x1F\x07\x1C\x02\x02\x1F" +
		" \x05\n\x06\x02 !\x07\x05\x02\x02!(\x03\x02\x02\x02\"#\x07\x1B\x02\x02" +
		"#$\x05\n\x06\x02$%\x07\x06\x02\x02%&\x05\f\x07\x02&(\x03\x02\x02\x02\'" +
		"\x1E\x03\x02\x02\x02\'\"\x03\x02\x02\x02(\x05\x03\x02\x02\x02)*\x07\x1F" +
		"\x02\x02*+\x07\t\x02\x02+,\x05\b\x05\x02,-\x07\b\x02\x02-.\x05\b\x05\x02" +
		"./\x07\n\x02\x02/8\x03\x02\x02\x0201\x07\x1E\x02\x0212\x07\t\x02\x022" +
		"3\x05\b\x05\x0234\x07\b\x02\x0245\x05\b\x05\x0256\x07\n\x02\x0268\x03" +
		"\x02\x02\x027)\x03\x02\x02\x0270\x03\x02\x02\x028\x07\x03\x02\x02\x02" +
		"9C\x07\"\x02\x02:>\x07\t\x02\x02;=\x05\b\x05\x02<;\x03\x02\x02\x02=@\x03" +
		"\x02\x02\x02><\x03\x02\x02\x02>?\x03\x02\x02\x02?A\x03\x02\x02\x02@>\x03" +
		"\x02\x02\x02AC\x07\n\x02\x02B9\x03\x02\x02\x02B:\x03\x02\x02\x02C\t\x03" +
		"\x02\x02\x02DI\x07\"\x02\x02EF\x07\b\x02\x02FH\x07\"\x02\x02GE\x03\x02" +
		"\x02\x02HK\x03\x02\x02\x02IG\x03\x02\x02\x02IJ\x03\x02\x02\x02J\v\x03" +
		"\x02\x02\x02KI\x03\x02\x02\x02LM\x07\"\x02\x02M\r\x03\x02\x02\x02NQ\x05" +
		"\x10\t\x02OQ\x05\x12\n\x02PN\x03\x02\x02\x02PO\x03\x02\x02\x02Q\x0F\x03" +
		"\x02\x02\x02RS\x07\t\x02\x02ST\x05\x0E\b\x02TU\x07\n\x02\x02U\x11\x03" +
		"\x02\x02\x02VW\t\x02\x02\x02W\x13\x03\x02\x02\x02\t\x17\'7>BIP";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!ProverifParser.__ATN) {
			ProverifParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(ProverifParser._serializedATN));
		}

		return ProverifParser.__ATN;
	}

}

export class ProverifFileContext extends ParserRuleContext {
	public PROCESS(): TerminalNode { return this.getToken(ProverifParser.PROCESS, 0); }
	public process(): ProcessContext {
		return this.getRuleContext(0, ProcessContext);
	}
	public EOF(): TerminalNode { return this.getToken(ProverifParser.EOF, 0); }
	public declaration(): DeclarationContext[];
	public declaration(i: number): DeclarationContext;
	public declaration(i?: number): DeclarationContext | DeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclarationContext);
		} else {
			return this.getRuleContext(i, DeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_proverifFile; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterProverifFile) {
			listener.enterProverifFile(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitProverifFile) {
			listener.exitProverifFile(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitProverifFile) {
			return visitor.visitProverifFile(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationContext extends ParserRuleContext {
	public CHANNEL(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.CHANNEL, 0); }
	public identifier_sequence(): Identifier_sequenceContext {
		return this.getRuleContext(0, Identifier_sequenceContext);
	}
	public DOT(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.DOT, 0); }
	public FREE(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.FREE, 0); }
	public COLON(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.COLON, 0); }
	public type_id(): Type_idContext | undefined {
		return this.tryGetRuleContext(0, Type_idContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_declaration; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterDeclaration) {
			listener.enterDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitDeclaration) {
			listener.exitDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitDeclaration) {
			return visitor.visitDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ProcessContext extends ParserRuleContext {
	public IN(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.IN, 0); }
	public LPAREN(): TerminalNode { return this.getToken(ProverifParser.LPAREN, 0); }
	public pterm(): PtermContext[];
	public pterm(i: number): PtermContext;
	public pterm(i?: number): PtermContext | PtermContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PtermContext);
		} else {
			return this.getRuleContext(i, PtermContext);
		}
	}
	public COMMA(): TerminalNode { return this.getToken(ProverifParser.COMMA, 0); }
	public RPAREN(): TerminalNode { return this.getToken(ProverifParser.RPAREN, 0); }
	public OUT(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.OUT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_process; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterProcess) {
			listener.enterProcess(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitProcess) {
			listener.exitProcess(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitProcess) {
			return visitor.visitProcess(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PtermContext extends ParserRuleContext {
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.Identifier, 0); }
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.RPAREN, 0); }
	public pterm(): PtermContext[];
	public pterm(i: number): PtermContext;
	public pterm(i?: number): PtermContext | PtermContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PtermContext);
		} else {
			return this.getRuleContext(i, PtermContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_pterm; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterPterm) {
			listener.enterPterm(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitPterm) {
			listener.exitPterm(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitPterm) {
			return visitor.visitPterm(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Identifier_sequenceContext extends ParserRuleContext {
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(ProverifParser.Identifier);
		} else {
			return this.getToken(ProverifParser.Identifier, i);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(ProverifParser.COMMA);
		} else {
			return this.getToken(ProverifParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_identifier_sequence; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterIdentifier_sequence) {
			listener.enterIdentifier_sequence(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitIdentifier_sequence) {
			listener.exitIdentifier_sequence(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitIdentifier_sequence) {
			return visitor.visitIdentifier_sequence(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Type_idContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(ProverifParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_type_id; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterType_id) {
			listener.enterType_id(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitType_id) {
			listener.exitType_id(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitType_id) {
			return visitor.visitType_id(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public parenthesizedExpression(): ParenthesizedExpressionContext | undefined {
		return this.tryGetRuleContext(0, ParenthesizedExpressionContext);
	}
	public literalConstant(): LiteralConstantContext | undefined {
		return this.tryGetRuleContext(0, LiteralConstantContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_expression; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParenthesizedExpressionContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(ProverifParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(ProverifParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_parenthesizedExpression; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterParenthesizedExpression) {
			listener.enterParenthesizedExpression(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitParenthesizedExpression) {
			listener.exitParenthesizedExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitParenthesizedExpression) {
			return visitor.visitParenthesizedExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LiteralConstantContext extends ParserRuleContext {
	public BooleanLiteral(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.BooleanLiteral, 0); }
	public Number(): TerminalNode | undefined { return this.tryGetToken(ProverifParser.Number, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_literalConstant; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterLiteralConstant) {
			listener.enterLiteralConstant(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitLiteralConstant) {
			listener.exitLiteralConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitLiteralConstant) {
			return visitor.visitLiteralConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


