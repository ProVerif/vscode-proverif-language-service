// Generated from grammar/ProverifParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `ProverifParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface ProverifParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `ProverifParser.proverifFile`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProverifFile?: (ctx: ProverifFileContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.declaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclaration?: (ctx: DeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.process`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProcess?: (ctx: ProcessContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.pterm`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPterm?: (ctx: PtermContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.identifier_sequence`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifier_sequence?: (ctx: Identifier_sequenceContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.type_id`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitType_id?: (ctx: Type_idContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.parenthesizedExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParenthesizedExpression?: (ctx: ParenthesizedExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.literalConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteralConstant?: (ctx: LiteralConstantContext) => Result;
}

