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
	public static readonly RULE_channelDeclaration = 2;
	public static readonly RULE_freeDeclaration = 3;
	public static readonly RULE_process = 4;
	public static readonly RULE_pterm = 5;
	public static readonly RULE_identifierSequence = 6;
	public static readonly RULE_identifier = 7;
	public static readonly RULE_typeId = 8;
	public static readonly RULE_expression = 9;
	public static readonly RULE_parenthesizedExpression = 10;
	public static readonly RULE_literalConstant = 11;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"proverifFile", "declaration", "channelDeclaration", "freeDeclaration", 
		"process", "pterm", "identifierSequence", "identifier", "typeId", "expression", 
		"parenthesizedExpression", "literalConstant",
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
			this.state = 27;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === ProverifParser.FREE || _la === ProverifParser.CHANNEL) {
				{
				{
				this.state = 24;
				this.declaration();
				}
				}
				this.state = 29;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 30;
			this.match(ProverifParser.PROCESS);
			this.state = 31;
			this.process();
			this.state = 32;
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
			this.state = 36;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ProverifParser.CHANNEL:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 34;
				this.channelDeclaration();
				}
				break;
			case ProverifParser.FREE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 35;
				this.freeDeclaration();
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
	public channelDeclaration(): ChannelDeclarationContext {
		let _localctx: ChannelDeclarationContext = new ChannelDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, ProverifParser.RULE_channelDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 38;
			this.match(ProverifParser.CHANNEL);
			this.state = 39;
			this.identifierSequence();
			this.state = 40;
			this.match(ProverifParser.DOT);
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
	public freeDeclaration(): FreeDeclarationContext {
		let _localctx: FreeDeclarationContext = new FreeDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, ProverifParser.RULE_freeDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 42;
			this.match(ProverifParser.FREE);
			this.state = 43;
			this.identifierSequence();
			this.state = 44;
			this.match(ProverifParser.COLON);
			this.state = 45;
			this.typeId();
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
		this.enterRule(_localctx, 8, ProverifParser.RULE_process);
		try {
			this.state = 61;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ProverifParser.IN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 47;
				this.match(ProverifParser.IN);
				this.state = 48;
				this.match(ProverifParser.LPAREN);
				this.state = 49;
				this.pterm();
				this.state = 50;
				this.match(ProverifParser.COMMA);
				this.state = 51;
				this.pterm();
				this.state = 52;
				this.match(ProverifParser.RPAREN);
				}
				break;
			case ProverifParser.OUT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 54;
				this.match(ProverifParser.OUT);
				this.state = 55;
				this.match(ProverifParser.LPAREN);
				this.state = 56;
				this.pterm();
				this.state = 57;
				this.match(ProverifParser.COMMA);
				this.state = 58;
				this.pterm();
				this.state = 59;
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
		this.enterRule(_localctx, 10, ProverifParser.RULE_pterm);
		let _la: number;
		try {
			this.state = 72;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ProverifParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 63;
				this.identifier();
				}
				break;
			case ProverifParser.LPAREN:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 64;
				this.match(ProverifParser.LPAREN);
				this.state = 68;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === ProverifParser.LPAREN || _la === ProverifParser.Identifier) {
					{
					{
					this.state = 65;
					this.pterm();
					}
					}
					this.state = 70;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 71;
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
	public identifierSequence(): IdentifierSequenceContext {
		let _localctx: IdentifierSequenceContext = new IdentifierSequenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, ProverifParser.RULE_identifierSequence);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 74;
			this.identifier();
			this.state = 79;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === ProverifParser.COMMA) {
				{
				{
				this.state = 75;
				this.match(ProverifParser.COMMA);
				this.state = 76;
				this.identifier();
				}
				}
				this.state = 81;
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
	public identifier(): IdentifierContext {
		let _localctx: IdentifierContext = new IdentifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, ProverifParser.RULE_identifier);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 82;
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
	public typeId(): TypeIdContext {
		let _localctx: TypeIdContext = new TypeIdContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, ProverifParser.RULE_typeId);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 84;
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
		this.enterRule(_localctx, 18, ProverifParser.RULE_expression);
		try {
			this.state = 88;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ProverifParser.LPAREN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 86;
				this.parenthesizedExpression();
				}
				break;
			case ProverifParser.Number:
			case ProverifParser.BooleanLiteral:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 87;
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
		this.enterRule(_localctx, 20, ProverifParser.RULE_parenthesizedExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 90;
			this.match(ProverifParser.LPAREN);
			this.state = 91;
			this.expression();
			this.state = 92;
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
		this.enterRule(_localctx, 22, ProverifParser.RULE_literalConstant);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 94;
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
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\"c\x04\x02\t" +
		"\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07\t" +
		"\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x03\x02" +
		"\x07\x02\x1C\n\x02\f\x02\x0E\x02\x1F\v\x02\x03\x02\x03\x02\x03\x02\x03" +
		"\x02\x03\x03\x03\x03\x05\x03\'\n\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03" +
		"\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03" +
		"\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03" +
		"\x06\x05\x06@\n\x06\x03\x07\x03\x07\x03\x07\x07\x07E\n\x07\f\x07\x0E\x07" +
		"H\v\x07\x03\x07\x05\x07K\n\x07\x03\b\x03\b\x03\b\x07\bP\n\b\f\b\x0E\b" +
		"S\v\b\x03\t\x03\t\x03\n\x03\n\x03\v\x03\v\x05\v[\n\v\x03\f\x03\f\x03\f" +
		"\x03\f\x03\r\x03\r\x03\r\x02\x02\x02\x0E\x02\x02\x04\x02\x06\x02\b\x02" +
		"\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x02\x03\x03" +
		"\x02 !\x02]\x02\x1D\x03\x02\x02\x02\x04&\x03\x02\x02\x02\x06(\x03\x02" +
		"\x02\x02\b,\x03\x02\x02\x02\n?\x03\x02\x02\x02\fJ\x03\x02\x02\x02\x0E" +
		"L\x03\x02\x02\x02\x10T\x03\x02\x02\x02\x12V\x03\x02\x02\x02\x14Z\x03\x02" +
		"\x02\x02\x16\\\x03\x02\x02\x02\x18`\x03\x02\x02\x02\x1A\x1C\x05\x04\x03" +
		"\x02\x1B\x1A\x03\x02\x02\x02\x1C\x1F\x03\x02\x02\x02\x1D\x1B\x03\x02\x02" +
		"\x02\x1D\x1E\x03\x02\x02\x02\x1E \x03\x02\x02\x02\x1F\x1D\x03\x02\x02" +
		"\x02 !\x07\x1D\x02\x02!\"\x05\n\x06\x02\"#\x07\x02\x02\x03#\x03\x03\x02" +
		"\x02\x02$\'\x05\x06\x04\x02%\'\x05\b\x05\x02&$\x03\x02\x02\x02&%\x03\x02" +
		"\x02\x02\'\x05\x03\x02\x02\x02()\x07\x1C\x02\x02)*\x05\x0E\b\x02*+\x07" +
		"\x05\x02\x02+\x07\x03\x02\x02\x02,-\x07\x1B\x02\x02-.\x05\x0E\b\x02./" +
		"\x07\x06\x02\x02/0\x05\x12\n\x020\t\x03\x02\x02\x0212\x07\x1F\x02\x02" +
		"23\x07\t\x02\x0234\x05\f\x07\x0245\x07\b\x02\x0256\x05\f\x07\x0267\x07" +
		"\n\x02\x027@\x03\x02\x02\x0289\x07\x1E\x02\x029:\x07\t\x02\x02:;\x05\f" +
		"\x07\x02;<\x07\b\x02\x02<=\x05\f\x07\x02=>\x07\n\x02\x02>@\x03\x02\x02" +
		"\x02?1\x03\x02\x02\x02?8\x03\x02\x02\x02@\v\x03\x02\x02\x02AK\x05\x10" +
		"\t\x02BF\x07\t\x02\x02CE\x05\f\x07\x02DC\x03\x02\x02\x02EH\x03\x02\x02" +
		"\x02FD\x03\x02\x02\x02FG\x03\x02\x02\x02GI\x03\x02\x02\x02HF\x03\x02\x02" +
		"\x02IK\x07\n\x02\x02JA\x03\x02\x02\x02JB\x03\x02\x02\x02K\r\x03\x02\x02" +
		"\x02LQ\x05\x10\t\x02MN\x07\b\x02\x02NP\x05\x10\t\x02OM\x03\x02\x02\x02" +
		"PS\x03\x02\x02\x02QO\x03\x02\x02\x02QR\x03\x02\x02\x02R\x0F\x03\x02\x02" +
		"\x02SQ\x03\x02\x02\x02TU\x07\"\x02\x02U\x11\x03\x02\x02\x02VW\x07\"\x02" +
		"\x02W\x13\x03\x02\x02\x02X[\x05\x16\f\x02Y[\x05\x18\r\x02ZX\x03\x02\x02" +
		"\x02ZY\x03\x02\x02\x02[\x15\x03\x02\x02\x02\\]\x07\t\x02\x02]^\x05\x14" +
		"\v\x02^_\x07\n\x02\x02_\x17\x03\x02\x02\x02`a\t\x02\x02\x02a\x19\x03\x02" +
		"\x02\x02\t\x1D&?FJQZ";
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
	public channelDeclaration(): ChannelDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ChannelDeclarationContext);
	}
	public freeDeclaration(): FreeDeclarationContext | undefined {
		return this.tryGetRuleContext(0, FreeDeclarationContext);
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


export class ChannelDeclarationContext extends ParserRuleContext {
	public CHANNEL(): TerminalNode { return this.getToken(ProverifParser.CHANNEL, 0); }
	public identifierSequence(): IdentifierSequenceContext {
		return this.getRuleContext(0, IdentifierSequenceContext);
	}
	public DOT(): TerminalNode { return this.getToken(ProverifParser.DOT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_channelDeclaration; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterChannelDeclaration) {
			listener.enterChannelDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitChannelDeclaration) {
			listener.exitChannelDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitChannelDeclaration) {
			return visitor.visitChannelDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FreeDeclarationContext extends ParserRuleContext {
	public FREE(): TerminalNode { return this.getToken(ProverifParser.FREE, 0); }
	public identifierSequence(): IdentifierSequenceContext {
		return this.getRuleContext(0, IdentifierSequenceContext);
	}
	public COLON(): TerminalNode { return this.getToken(ProverifParser.COLON, 0); }
	public typeId(): TypeIdContext {
		return this.getRuleContext(0, TypeIdContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_freeDeclaration; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterFreeDeclaration) {
			listener.enterFreeDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitFreeDeclaration) {
			listener.exitFreeDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitFreeDeclaration) {
			return visitor.visitFreeDeclaration(this);
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
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
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


export class IdentifierSequenceContext extends ParserRuleContext {
	public identifier(): IdentifierContext[];
	public identifier(i: number): IdentifierContext;
	public identifier(i?: number): IdentifierContext | IdentifierContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierContext);
		} else {
			return this.getRuleContext(i, IdentifierContext);
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
	public get ruleIndex(): number { return ProverifParser.RULE_identifierSequence; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterIdentifierSequence) {
			listener.enterIdentifierSequence(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitIdentifierSequence) {
			listener.exitIdentifierSequence(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitIdentifierSequence) {
			return visitor.visitIdentifierSequence(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(ProverifParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_identifier; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterIdentifier) {
			listener.enterIdentifier(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitIdentifier) {
			listener.exitIdentifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitIdentifier) {
			return visitor.visitIdentifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeIdContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(ProverifParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ProverifParser.RULE_typeId; }
	// @Override
	public enterRule(listener: ProverifParserListener): void {
		if (listener.enterTypeId) {
			listener.enterTypeId(this);
		}
	}
	// @Override
	public exitRule(listener: ProverifParserListener): void {
		if (listener.exitTypeId) {
			listener.exitTypeId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ProverifParserVisitor<Result>): Result {
		if (visitor.visitTypeId) {
			return visitor.visitTypeId(this);
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


