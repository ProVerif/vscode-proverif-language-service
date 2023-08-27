// Generated from grammar/ProverifParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ProverifFileContext } from "./ProverifParser";
import { DeclarationContext } from "./ProverifParser";
import { ChannelDeclarationContext } from "./ProverifParser";
import { FreeDeclarationContext } from "./ProverifParser";
import { ProcessContext } from "./ProverifParser";
import { PtermContext } from "./ProverifParser";
import { IdentifierSequenceContext } from "./ProverifParser";
import { IdentifierContext } from "./ProverifParser";
import { TypeIdContext } from "./ProverifParser";
import { ExpressionContext } from "./ProverifParser";
import { ParenthesizedExpressionContext } from "./ProverifParser";
import { LiteralConstantContext } from "./ProverifParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `ProverifParser`.
 */
export interface ProverifParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `ProverifParser.proverifFile`.
	 * @param ctx the parse tree
	 */
	enterProverifFile?: (ctx: ProverifFileContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.proverifFile`.
	 * @param ctx the parse tree
	 */
	exitProverifFile?: (ctx: ProverifFileContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.declaration`.
	 * @param ctx the parse tree
	 */
	enterDeclaration?: (ctx: DeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.declaration`.
	 * @param ctx the parse tree
	 */
	exitDeclaration?: (ctx: DeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.channelDeclaration`.
	 * @param ctx the parse tree
	 */
	enterChannelDeclaration?: (ctx: ChannelDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.channelDeclaration`.
	 * @param ctx the parse tree
	 */
	exitChannelDeclaration?: (ctx: ChannelDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.freeDeclaration`.
	 * @param ctx the parse tree
	 */
	enterFreeDeclaration?: (ctx: FreeDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.freeDeclaration`.
	 * @param ctx the parse tree
	 */
	exitFreeDeclaration?: (ctx: FreeDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.process`.
	 * @param ctx the parse tree
	 */
	enterProcess?: (ctx: ProcessContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.process`.
	 * @param ctx the parse tree
	 */
	exitProcess?: (ctx: ProcessContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.pterm`.
	 * @param ctx the parse tree
	 */
	enterPterm?: (ctx: PtermContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.pterm`.
	 * @param ctx the parse tree
	 */
	exitPterm?: (ctx: PtermContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.identifierSequence`.
	 * @param ctx the parse tree
	 */
	enterIdentifierSequence?: (ctx: IdentifierSequenceContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.identifierSequence`.
	 * @param ctx the parse tree
	 */
	exitIdentifierSequence?: (ctx: IdentifierSequenceContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.identifier`.
	 * @param ctx the parse tree
	 */
	enterIdentifier?: (ctx: IdentifierContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.identifier`.
	 * @param ctx the parse tree
	 */
	exitIdentifier?: (ctx: IdentifierContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.typeId`.
	 * @param ctx the parse tree
	 */
	enterTypeId?: (ctx: TypeIdContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.typeId`.
	 * @param ctx the parse tree
	 */
	exitTypeId?: (ctx: TypeIdContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.parenthesizedExpression`.
	 * @param ctx the parse tree
	 */
	enterParenthesizedExpression?: (ctx: ParenthesizedExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.parenthesizedExpression`.
	 * @param ctx the parse tree
	 */
	exitParenthesizedExpression?: (ctx: ParenthesizedExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.literalConstant`.
	 * @param ctx the parse tree
	 */
	enterLiteralConstant?: (ctx: LiteralConstantContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.literalConstant`.
	 * @param ctx the parse tree
	 */
	exitLiteralConstant?: (ctx: LiteralConstantContext) => void;
}

