// Generated from grammar/ProverifParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { LibContext } from "./ProverifParser";
import { SettingsContext } from "./ProverifParser";
import { LemmaContext } from "./ProverifParser";
import { AllContext } from "./ProverifParser";
import { ProoftokenContext } from "./ProverifParser";
import { ProofcommandContext } from "./ProverifParser";
import { ProofContext } from "./ProverifParser";
import { ImpllistContext } from "./ProverifParser";
import { ImplContext } from "./ProverifParser";
import { CvtypeidContext } from "./ProverifParser";
import { StringlistneContext } from "./ProverifParser";
import { TypeoptContext } from "./ProverifParser";
import { TypeoptlistContext } from "./ProverifParser";
import { TypeoptionsContext } from "./ProverifParser";
import { FunoptContext } from "./ProverifParser";
import { FunoptlistContext } from "./ProverifParser";
import { FunctionoptionsContext } from "./ProverifParser";
import { ProbaargsContext } from "./ProverifParser";
import { DimlistContext } from "./ProverifParser";
import { NedimlistContext } from "./ProverifParser";
import { DimextContext } from "./ProverifParser";
import { DimContext } from "./ProverifParser";
import { PoweroptContext } from "./ProverifParser";
import { LetprobaargsContext } from "./ProverifParser";
import { ProbaarglistContext } from "./ProverifParser";
import { NeprobaarglistContext } from "./ProverifParser";
import { VardimContext } from "./ProverifParser";
import { ProbafContext } from "./ProverifParser";
import { IdentlistContext } from "./ProverifParser";
import { ProbaoptimcondContext } from "./ProverifParser";
import { ProbaflistoptContext } from "./ProverifParser";
import { ProbaflistContext } from "./ProverifParser";
import { Options_Context } from "./ProverifParser";
import { SingleoptionContext } from "./ProverifParser";
import { OptionseqContext } from "./ProverifParser";
import { NeidentseqContext } from "./ProverifParser";
import { NewargContext } from "./ProverifParser";
import { OnevartypeContext } from "./ProverifParser";
import { NevartypeContext } from "./ProverifParser";
import { ForallvartypeContext } from "./ProverifParser";
import { TypeidContext } from "./ProverifParser";
import { TypeidseqContext } from "./ProverifParser";
import { NetypeidseqContext } from "./ProverifParser";
import { TermContext } from "./ProverifParser";
import { NetermseqContext } from "./ProverifParser";
import { TermseqContext } from "./ProverifParser";
import { NiseqContext } from "./ProverifParser";
import { Opt_publivars_rorContext } from "./ProverifParser";
import { TlemmaseqContext } from "./ProverifParser";
import { TqueryseqContext } from "./ProverifParser";
import { TqueryContext } from "./ProverifParser";
import { OptpublicvarsContext } from "./ProverifParser";
import { OptatidentContext } from "./ProverifParser";
import { GtermContext } from "./ProverifParser";
import { NegtermseqContext } from "./ProverifParser";
import { GtermseqContext } from "./ProverifParser";
import { NesbindingseqContext } from "./ProverifParser";
import { BindingseqContext } from "./ProverifParser";
import { TfnebindingseqContext } from "./ProverifParser";
import { OptphaseContext } from "./ProverifParser";
import { Nounif_valueContext } from "./ProverifParser";
import { Select_valueContext } from "./ProverifParser";
import { GformatContext } from "./ProverifParser";
import { NegformatseqContext } from "./ProverifParser";
import { GformatseqContext } from "./ProverifParser";
import { FnesbindingseqContext } from "./ProverifParser";
import { FbindingseqContext } from "./ProverifParser";
import { OptorfailContext } from "./ProverifParser";
import { MayfailvartypeContext } from "./ProverifParser";
import { NemayfailvartypeseqContext } from "./ProverifParser";
import { MayfailvartypeseqContext } from "./ProverifParser";
import { ForallmayfailvartypeContext } from "./ProverifParser";
import { Extended_equationContext } from "./ProverifParser";
import { TreducotherwiseContext } from "./ProverifParser";
import { TreducmayfailContext } from "./ProverifParser";
import { TreducContext } from "./ProverifParser";
import { EqlistContext } from "./ProverifParser";
import { TclauseContext } from "./ProverifParser";
import { TclausesContext } from "./ProverifParser";
import { ProgramoptionsContext } from "./ProverifParser";
import { ProgoptlistContext } from "./ProverifParser";
import { ProgoptContext } from "./ProverifParser";
import { ProgbeginContext } from "./ProverifParser";
import { ProgendContext } from "./ProverifParser";
import { SyncoptContext } from "./ProverifParser";
import { TprocessContext } from "./ProverifParser";
import { OpttprocessContext } from "./ProverifParser";
import { OptinprocessContext } from "./ProverifParser";
import { OptelseprocessContext } from "./ProverifParser";
import { BasicpatternContext } from "./ProverifParser";
import { TpatternContext } from "./ProverifParser";
import { NepatternseqContext } from "./ProverifParser";
import { TpatternseqContext } from "./ProverifParser";
import { PtermContext } from "./ProverifParser";
import { OptelsetermContext } from "./ProverifParser";
import { OptsuchthatContext } from "./ProverifParser";
import { OptargsContext } from "./ProverifParser";
import { NeptermseqContext } from "./ProverifParser";
import { PtermseqContext } from "./ProverifParser";
import { OnepermutContext } from "./ProverifParser";
import { PermutContext } from "./ProverifParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `ProverifParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface ProverifParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `ProverifParser.lib`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLib?: (ctx: LibContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.settings`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSettings?: (ctx: SettingsContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.lemma`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLemma?: (ctx: LemmaContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.all`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAll?: (ctx: AllContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.prooftoken`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProoftoken?: (ctx: ProoftokenContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.proofcommand`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProofcommand?: (ctx: ProofcommandContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.proof`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProof?: (ctx: ProofContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.impllist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImpllist?: (ctx: ImpllistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.impl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImpl?: (ctx: ImplContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.cvtypeid`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCvtypeid?: (ctx: CvtypeidContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.stringlistne`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStringlistne?: (ctx: StringlistneContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.typeopt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeopt?: (ctx: TypeoptContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.typeoptlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeoptlist?: (ctx: TypeoptlistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.typeoptions`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeoptions?: (ctx: TypeoptionsContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.funopt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunopt?: (ctx: FunoptContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.funoptlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunoptlist?: (ctx: FunoptlistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.functionoptions`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionoptions?: (ctx: FunctionoptionsContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.probaargs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProbaargs?: (ctx: ProbaargsContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.dimlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDimlist?: (ctx: DimlistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.nedimlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNedimlist?: (ctx: NedimlistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.dimext`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDimext?: (ctx: DimextContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.dim`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDim?: (ctx: DimContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.poweropt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPoweropt?: (ctx: PoweroptContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.letprobaargs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLetprobaargs?: (ctx: LetprobaargsContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.probaarglist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProbaarglist?: (ctx: ProbaarglistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.neprobaarglist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNeprobaarglist?: (ctx: NeprobaarglistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.vardim`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVardim?: (ctx: VardimContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.probaf`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProbaf?: (ctx: ProbafContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.identlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentlist?: (ctx: IdentlistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.probaoptimcond`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProbaoptimcond?: (ctx: ProbaoptimcondContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.probaflistopt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProbaflistopt?: (ctx: ProbaflistoptContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.probaflist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProbaflist?: (ctx: ProbaflistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.options_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptions_?: (ctx: Options_Context) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.singleoption`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSingleoption?: (ctx: SingleoptionContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optionseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptionseq?: (ctx: OptionseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.neidentseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNeidentseq?: (ctx: NeidentseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.newarg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNewarg?: (ctx: NewargContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.onevartype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOnevartype?: (ctx: OnevartypeContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.nevartype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNevartype?: (ctx: NevartypeContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.forallvartype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForallvartype?: (ctx: ForallvartypeContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.typeid`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeid?: (ctx: TypeidContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.typeidseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeidseq?: (ctx: TypeidseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.netypeidseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNetypeidseq?: (ctx: NetypeidseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTerm?: (ctx: TermContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.netermseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNetermseq?: (ctx: NetermseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.termseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTermseq?: (ctx: TermseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.niseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNiseq?: (ctx: NiseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.opt_publivars_ror`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOpt_publivars_ror?: (ctx: Opt_publivars_rorContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.tlemmaseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTlemmaseq?: (ctx: TlemmaseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.tqueryseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTqueryseq?: (ctx: TqueryseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.tquery`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTquery?: (ctx: TqueryContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optpublicvars`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptpublicvars?: (ctx: OptpublicvarsContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optatident`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptatident?: (ctx: OptatidentContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.gterm`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGterm?: (ctx: GtermContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.negtermseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNegtermseq?: (ctx: NegtermseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.gtermseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGtermseq?: (ctx: GtermseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.nesbindingseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNesbindingseq?: (ctx: NesbindingseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.bindingseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBindingseq?: (ctx: BindingseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.tfnebindingseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTfnebindingseq?: (ctx: TfnebindingseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optphase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptphase?: (ctx: OptphaseContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.nounif_value`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNounif_value?: (ctx: Nounif_valueContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.select_value`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSelect_value?: (ctx: Select_valueContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.gformat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGformat?: (ctx: GformatContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.negformatseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNegformatseq?: (ctx: NegformatseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.gformatseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGformatseq?: (ctx: GformatseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.fnesbindingseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFnesbindingseq?: (ctx: FnesbindingseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.fbindingseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFbindingseq?: (ctx: FbindingseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optorfail`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptorfail?: (ctx: OptorfailContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.mayfailvartype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMayfailvartype?: (ctx: MayfailvartypeContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.nemayfailvartypeseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNemayfailvartypeseq?: (ctx: NemayfailvartypeseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.mayfailvartypeseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMayfailvartypeseq?: (ctx: MayfailvartypeseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.forallmayfailvartype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForallmayfailvartype?: (ctx: ForallmayfailvartypeContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.extended_equation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExtended_equation?: (ctx: Extended_equationContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.treducotherwise`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTreducotherwise?: (ctx: TreducotherwiseContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.treducmayfail`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTreducmayfail?: (ctx: TreducmayfailContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.treduc`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTreduc?: (ctx: TreducContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.eqlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEqlist?: (ctx: EqlistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.tclause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTclause?: (ctx: TclauseContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.tclauses`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTclauses?: (ctx: TclausesContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.programoptions`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgramoptions?: (ctx: ProgramoptionsContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.progoptlist`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgoptlist?: (ctx: ProgoptlistContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.progopt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgopt?: (ctx: ProgoptContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.progbegin`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgbegin?: (ctx: ProgbeginContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.progend`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgend?: (ctx: ProgendContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.syncopt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSyncopt?: (ctx: SyncoptContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.tprocess`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTprocess?: (ctx: TprocessContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.opttprocess`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOpttprocess?: (ctx: OpttprocessContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optinprocess`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptinprocess?: (ctx: OptinprocessContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optelseprocess`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptelseprocess?: (ctx: OptelseprocessContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.basicpattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBasicpattern?: (ctx: BasicpatternContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.tpattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTpattern?: (ctx: TpatternContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.nepatternseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNepatternseq?: (ctx: NepatternseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.tpatternseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTpatternseq?: (ctx: TpatternseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.pterm`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPterm?: (ctx: PtermContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optelseterm`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptelseterm?: (ctx: OptelsetermContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optsuchthat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptsuchthat?: (ctx: OptsuchthatContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.optargs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptargs?: (ctx: OptargsContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.neptermseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNeptermseq?: (ctx: NeptermseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.ptermseq`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPtermseq?: (ctx: PtermseqContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.onepermut`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOnepermut?: (ctx: OnepermutContext) => Result;

	/**
	 * Visit a parse tree produced by `ProverifParser.permut`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPermut?: (ctx: PermutContext) => Result;
}

