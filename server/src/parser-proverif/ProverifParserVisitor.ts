// Generated from grammar/ProverifParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
	 * Visit a parse tree produced by `ProverifParser.channelDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitChannelDeclaration?: (ctx: ChannelDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.freeDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFreeDeclaration?: (ctx: FreeDeclarationContext) => Result;

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
	 * Visit a parse tree produced by `ProverifParser.identifierSequence`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierSequence?: (ctx: IdentifierSequenceContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.identifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifier?: (ctx: IdentifierContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.typeId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeId?: (ctx: TypeIdContext) => Result;

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

