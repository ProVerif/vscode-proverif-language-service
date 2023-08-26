// Generated from grammar/ProverifParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ProverifFileContext } from "./ProverifParser";
import { DeclarationContext } from "./ProverifParser";
import { ProcessContext } from "./ProverifParser";
import { PtermContext } from "./ProverifParser";
import { Identifier_sequenceContext } from "./ProverifParser";
import { Type_idContext } from "./ProverifParser";
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
	 * Enter a parse tree produced by `ProverifParser.identifier_sequence`.
	 * @param ctx the parse tree
	 */
	enterIdentifier_sequence?: (ctx: Identifier_sequenceContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.identifier_sequence`.
	 * @param ctx the parse tree
	 */
	exitIdentifier_sequence?: (ctx: Identifier_sequenceContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.type_id`.
	 * @param ctx the parse tree
	 */
	enterType_id?: (ctx: Type_idContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.type_id`.
	 * @param ctx the parse tree
	 */
	exitType_id?: (ctx: Type_idContext) => void;

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

