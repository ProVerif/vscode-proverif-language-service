// Generated from grammar/ProverifParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
import { OrderContext } from "./ProverifParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `ProverifParser`.
 */
export interface ProverifParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `ProverifParser.lib`.
	 * @param ctx the parse tree
	 */
	enterLib?: (ctx: LibContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.lib`.
	 * @param ctx the parse tree
	 */
	exitLib?: (ctx: LibContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.settings`.
	 * @param ctx the parse tree
	 */
	enterSettings?: (ctx: SettingsContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.settings`.
	 * @param ctx the parse tree
	 */
	exitSettings?: (ctx: SettingsContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.lemma`.
	 * @param ctx the parse tree
	 */
	enterLemma?: (ctx: LemmaContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.lemma`.
	 * @param ctx the parse tree
	 */
	exitLemma?: (ctx: LemmaContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.all`.
	 * @param ctx the parse tree
	 */
	enterAll?: (ctx: AllContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.all`.
	 * @param ctx the parse tree
	 */
	exitAll?: (ctx: AllContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.prooftoken`.
	 * @param ctx the parse tree
	 */
	enterProoftoken?: (ctx: ProoftokenContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.prooftoken`.
	 * @param ctx the parse tree
	 */
	exitProoftoken?: (ctx: ProoftokenContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.proofcommand`.
	 * @param ctx the parse tree
	 */
	enterProofcommand?: (ctx: ProofcommandContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.proofcommand`.
	 * @param ctx the parse tree
	 */
	exitProofcommand?: (ctx: ProofcommandContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.proof`.
	 * @param ctx the parse tree
	 */
	enterProof?: (ctx: ProofContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.proof`.
	 * @param ctx the parse tree
	 */
	exitProof?: (ctx: ProofContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.impllist`.
	 * @param ctx the parse tree
	 */
	enterImpllist?: (ctx: ImpllistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.impllist`.
	 * @param ctx the parse tree
	 */
	exitImpllist?: (ctx: ImpllistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.impl`.
	 * @param ctx the parse tree
	 */
	enterImpl?: (ctx: ImplContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.impl`.
	 * @param ctx the parse tree
	 */
	exitImpl?: (ctx: ImplContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.cvtypeid`.
	 * @param ctx the parse tree
	 */
	enterCvtypeid?: (ctx: CvtypeidContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.cvtypeid`.
	 * @param ctx the parse tree
	 */
	exitCvtypeid?: (ctx: CvtypeidContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.stringlistne`.
	 * @param ctx the parse tree
	 */
	enterStringlistne?: (ctx: StringlistneContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.stringlistne`.
	 * @param ctx the parse tree
	 */
	exitStringlistne?: (ctx: StringlistneContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.typeopt`.
	 * @param ctx the parse tree
	 */
	enterTypeopt?: (ctx: TypeoptContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.typeopt`.
	 * @param ctx the parse tree
	 */
	exitTypeopt?: (ctx: TypeoptContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.typeoptlist`.
	 * @param ctx the parse tree
	 */
	enterTypeoptlist?: (ctx: TypeoptlistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.typeoptlist`.
	 * @param ctx the parse tree
	 */
	exitTypeoptlist?: (ctx: TypeoptlistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.typeoptions`.
	 * @param ctx the parse tree
	 */
	enterTypeoptions?: (ctx: TypeoptionsContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.typeoptions`.
	 * @param ctx the parse tree
	 */
	exitTypeoptions?: (ctx: TypeoptionsContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.funopt`.
	 * @param ctx the parse tree
	 */
	enterFunopt?: (ctx: FunoptContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.funopt`.
	 * @param ctx the parse tree
	 */
	exitFunopt?: (ctx: FunoptContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.funoptlist`.
	 * @param ctx the parse tree
	 */
	enterFunoptlist?: (ctx: FunoptlistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.funoptlist`.
	 * @param ctx the parse tree
	 */
	exitFunoptlist?: (ctx: FunoptlistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.functionoptions`.
	 * @param ctx the parse tree
	 */
	enterFunctionoptions?: (ctx: FunctionoptionsContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.functionoptions`.
	 * @param ctx the parse tree
	 */
	exitFunctionoptions?: (ctx: FunctionoptionsContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.probaargs`.
	 * @param ctx the parse tree
	 */
	enterProbaargs?: (ctx: ProbaargsContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.probaargs`.
	 * @param ctx the parse tree
	 */
	exitProbaargs?: (ctx: ProbaargsContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.dimlist`.
	 * @param ctx the parse tree
	 */
	enterDimlist?: (ctx: DimlistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.dimlist`.
	 * @param ctx the parse tree
	 */
	exitDimlist?: (ctx: DimlistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.nedimlist`.
	 * @param ctx the parse tree
	 */
	enterNedimlist?: (ctx: NedimlistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.nedimlist`.
	 * @param ctx the parse tree
	 */
	exitNedimlist?: (ctx: NedimlistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.dimext`.
	 * @param ctx the parse tree
	 */
	enterDimext?: (ctx: DimextContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.dimext`.
	 * @param ctx the parse tree
	 */
	exitDimext?: (ctx: DimextContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.dim`.
	 * @param ctx the parse tree
	 */
	enterDim?: (ctx: DimContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.dim`.
	 * @param ctx the parse tree
	 */
	exitDim?: (ctx: DimContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.poweropt`.
	 * @param ctx the parse tree
	 */
	enterPoweropt?: (ctx: PoweroptContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.poweropt`.
	 * @param ctx the parse tree
	 */
	exitPoweropt?: (ctx: PoweroptContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.letprobaargs`.
	 * @param ctx the parse tree
	 */
	enterLetprobaargs?: (ctx: LetprobaargsContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.letprobaargs`.
	 * @param ctx the parse tree
	 */
	exitLetprobaargs?: (ctx: LetprobaargsContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.probaarglist`.
	 * @param ctx the parse tree
	 */
	enterProbaarglist?: (ctx: ProbaarglistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.probaarglist`.
	 * @param ctx the parse tree
	 */
	exitProbaarglist?: (ctx: ProbaarglistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.neprobaarglist`.
	 * @param ctx the parse tree
	 */
	enterNeprobaarglist?: (ctx: NeprobaarglistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.neprobaarglist`.
	 * @param ctx the parse tree
	 */
	exitNeprobaarglist?: (ctx: NeprobaarglistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.vardim`.
	 * @param ctx the parse tree
	 */
	enterVardim?: (ctx: VardimContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.vardim`.
	 * @param ctx the parse tree
	 */
	exitVardim?: (ctx: VardimContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.probaf`.
	 * @param ctx the parse tree
	 */
	enterProbaf?: (ctx: ProbafContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.probaf`.
	 * @param ctx the parse tree
	 */
	exitProbaf?: (ctx: ProbafContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.identlist`.
	 * @param ctx the parse tree
	 */
	enterIdentlist?: (ctx: IdentlistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.identlist`.
	 * @param ctx the parse tree
	 */
	exitIdentlist?: (ctx: IdentlistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.probaoptimcond`.
	 * @param ctx the parse tree
	 */
	enterProbaoptimcond?: (ctx: ProbaoptimcondContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.probaoptimcond`.
	 * @param ctx the parse tree
	 */
	exitProbaoptimcond?: (ctx: ProbaoptimcondContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.probaflistopt`.
	 * @param ctx the parse tree
	 */
	enterProbaflistopt?: (ctx: ProbaflistoptContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.probaflistopt`.
	 * @param ctx the parse tree
	 */
	exitProbaflistopt?: (ctx: ProbaflistoptContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.probaflist`.
	 * @param ctx the parse tree
	 */
	enterProbaflist?: (ctx: ProbaflistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.probaflist`.
	 * @param ctx the parse tree
	 */
	exitProbaflist?: (ctx: ProbaflistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.options_`.
	 * @param ctx the parse tree
	 */
	enterOptions_?: (ctx: Options_Context) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.options_`.
	 * @param ctx the parse tree
	 */
	exitOptions_?: (ctx: Options_Context) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.singleoption`.
	 * @param ctx the parse tree
	 */
	enterSingleoption?: (ctx: SingleoptionContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.singleoption`.
	 * @param ctx the parse tree
	 */
	exitSingleoption?: (ctx: SingleoptionContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.optionseq`.
	 * @param ctx the parse tree
	 */
	enterOptionseq?: (ctx: OptionseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optionseq`.
	 * @param ctx the parse tree
	 */
	exitOptionseq?: (ctx: OptionseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.neidentseq`.
	 * @param ctx the parse tree
	 */
	enterNeidentseq?: (ctx: NeidentseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.neidentseq`.
	 * @param ctx the parse tree
	 */
	exitNeidentseq?: (ctx: NeidentseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.newarg`.
	 * @param ctx the parse tree
	 */
	enterNewarg?: (ctx: NewargContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.newarg`.
	 * @param ctx the parse tree
	 */
	exitNewarg?: (ctx: NewargContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.onevartype`.
	 * @param ctx the parse tree
	 */
	enterOnevartype?: (ctx: OnevartypeContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.onevartype`.
	 * @param ctx the parse tree
	 */
	exitOnevartype?: (ctx: OnevartypeContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.nevartype`.
	 * @param ctx the parse tree
	 */
	enterNevartype?: (ctx: NevartypeContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.nevartype`.
	 * @param ctx the parse tree
	 */
	exitNevartype?: (ctx: NevartypeContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.forallvartype`.
	 * @param ctx the parse tree
	 */
	enterForallvartype?: (ctx: ForallvartypeContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.forallvartype`.
	 * @param ctx the parse tree
	 */
	exitForallvartype?: (ctx: ForallvartypeContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.typeid`.
	 * @param ctx the parse tree
	 */
	enterTypeid?: (ctx: TypeidContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.typeid`.
	 * @param ctx the parse tree
	 */
	exitTypeid?: (ctx: TypeidContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.typeidseq`.
	 * @param ctx the parse tree
	 */
	enterTypeidseq?: (ctx: TypeidseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.typeidseq`.
	 * @param ctx the parse tree
	 */
	exitTypeidseq?: (ctx: TypeidseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.netypeidseq`.
	 * @param ctx the parse tree
	 */
	enterNetypeidseq?: (ctx: NetypeidseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.netypeidseq`.
	 * @param ctx the parse tree
	 */
	exitNetypeidseq?: (ctx: NetypeidseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.term`.
	 * @param ctx the parse tree
	 */
	enterTerm?: (ctx: TermContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.term`.
	 * @param ctx the parse tree
	 */
	exitTerm?: (ctx: TermContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.netermseq`.
	 * @param ctx the parse tree
	 */
	enterNetermseq?: (ctx: NetermseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.netermseq`.
	 * @param ctx the parse tree
	 */
	exitNetermseq?: (ctx: NetermseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.termseq`.
	 * @param ctx the parse tree
	 */
	enterTermseq?: (ctx: TermseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.termseq`.
	 * @param ctx the parse tree
	 */
	exitTermseq?: (ctx: TermseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.niseq`.
	 * @param ctx the parse tree
	 */
	enterNiseq?: (ctx: NiseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.niseq`.
	 * @param ctx the parse tree
	 */
	exitNiseq?: (ctx: NiseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.opt_publivars_ror`.
	 * @param ctx the parse tree
	 */
	enterOpt_publivars_ror?: (ctx: Opt_publivars_rorContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.opt_publivars_ror`.
	 * @param ctx the parse tree
	 */
	exitOpt_publivars_ror?: (ctx: Opt_publivars_rorContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.tlemmaseq`.
	 * @param ctx the parse tree
	 */
	enterTlemmaseq?: (ctx: TlemmaseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.tlemmaseq`.
	 * @param ctx the parse tree
	 */
	exitTlemmaseq?: (ctx: TlemmaseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.tqueryseq`.
	 * @param ctx the parse tree
	 */
	enterTqueryseq?: (ctx: TqueryseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.tqueryseq`.
	 * @param ctx the parse tree
	 */
	exitTqueryseq?: (ctx: TqueryseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.tquery`.
	 * @param ctx the parse tree
	 */
	enterTquery?: (ctx: TqueryContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.tquery`.
	 * @param ctx the parse tree
	 */
	exitTquery?: (ctx: TqueryContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.optpublicvars`.
	 * @param ctx the parse tree
	 */
	enterOptpublicvars?: (ctx: OptpublicvarsContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optpublicvars`.
	 * @param ctx the parse tree
	 */
	exitOptpublicvars?: (ctx: OptpublicvarsContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.optatident`.
	 * @param ctx the parse tree
	 */
	enterOptatident?: (ctx: OptatidentContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optatident`.
	 * @param ctx the parse tree
	 */
	exitOptatident?: (ctx: OptatidentContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.gterm`.
	 * @param ctx the parse tree
	 */
	enterGterm?: (ctx: GtermContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.gterm`.
	 * @param ctx the parse tree
	 */
	exitGterm?: (ctx: GtermContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.negtermseq`.
	 * @param ctx the parse tree
	 */
	enterNegtermseq?: (ctx: NegtermseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.negtermseq`.
	 * @param ctx the parse tree
	 */
	exitNegtermseq?: (ctx: NegtermseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.gtermseq`.
	 * @param ctx the parse tree
	 */
	enterGtermseq?: (ctx: GtermseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.gtermseq`.
	 * @param ctx the parse tree
	 */
	exitGtermseq?: (ctx: GtermseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.nesbindingseq`.
	 * @param ctx the parse tree
	 */
	enterNesbindingseq?: (ctx: NesbindingseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.nesbindingseq`.
	 * @param ctx the parse tree
	 */
	exitNesbindingseq?: (ctx: NesbindingseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.bindingseq`.
	 * @param ctx the parse tree
	 */
	enterBindingseq?: (ctx: BindingseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.bindingseq`.
	 * @param ctx the parse tree
	 */
	exitBindingseq?: (ctx: BindingseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.tfnebindingseq`.
	 * @param ctx the parse tree
	 */
	enterTfnebindingseq?: (ctx: TfnebindingseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.tfnebindingseq`.
	 * @param ctx the parse tree
	 */
	exitTfnebindingseq?: (ctx: TfnebindingseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.optphase`.
	 * @param ctx the parse tree
	 */
	enterOptphase?: (ctx: OptphaseContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optphase`.
	 * @param ctx the parse tree
	 */
	exitOptphase?: (ctx: OptphaseContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.nounif_value`.
	 * @param ctx the parse tree
	 */
	enterNounif_value?: (ctx: Nounif_valueContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.nounif_value`.
	 * @param ctx the parse tree
	 */
	exitNounif_value?: (ctx: Nounif_valueContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.select_value`.
	 * @param ctx the parse tree
	 */
	enterSelect_value?: (ctx: Select_valueContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.select_value`.
	 * @param ctx the parse tree
	 */
	exitSelect_value?: (ctx: Select_valueContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.gformat`.
	 * @param ctx the parse tree
	 */
	enterGformat?: (ctx: GformatContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.gformat`.
	 * @param ctx the parse tree
	 */
	exitGformat?: (ctx: GformatContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.negformatseq`.
	 * @param ctx the parse tree
	 */
	enterNegformatseq?: (ctx: NegformatseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.negformatseq`.
	 * @param ctx the parse tree
	 */
	exitNegformatseq?: (ctx: NegformatseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.gformatseq`.
	 * @param ctx the parse tree
	 */
	enterGformatseq?: (ctx: GformatseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.gformatseq`.
	 * @param ctx the parse tree
	 */
	exitGformatseq?: (ctx: GformatseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.fnesbindingseq`.
	 * @param ctx the parse tree
	 */
	enterFnesbindingseq?: (ctx: FnesbindingseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.fnesbindingseq`.
	 * @param ctx the parse tree
	 */
	exitFnesbindingseq?: (ctx: FnesbindingseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.fbindingseq`.
	 * @param ctx the parse tree
	 */
	enterFbindingseq?: (ctx: FbindingseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.fbindingseq`.
	 * @param ctx the parse tree
	 */
	exitFbindingseq?: (ctx: FbindingseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.optorfail`.
	 * @param ctx the parse tree
	 */
	enterOptorfail?: (ctx: OptorfailContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optorfail`.
	 * @param ctx the parse tree
	 */
	exitOptorfail?: (ctx: OptorfailContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.mayfailvartype`.
	 * @param ctx the parse tree
	 */
	enterMayfailvartype?: (ctx: MayfailvartypeContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.mayfailvartype`.
	 * @param ctx the parse tree
	 */
	exitMayfailvartype?: (ctx: MayfailvartypeContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.nemayfailvartypeseq`.
	 * @param ctx the parse tree
	 */
	enterNemayfailvartypeseq?: (ctx: NemayfailvartypeseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.nemayfailvartypeseq`.
	 * @param ctx the parse tree
	 */
	exitNemayfailvartypeseq?: (ctx: NemayfailvartypeseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.mayfailvartypeseq`.
	 * @param ctx the parse tree
	 */
	enterMayfailvartypeseq?: (ctx: MayfailvartypeseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.mayfailvartypeseq`.
	 * @param ctx the parse tree
	 */
	exitMayfailvartypeseq?: (ctx: MayfailvartypeseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.forallmayfailvartype`.
	 * @param ctx the parse tree
	 */
	enterForallmayfailvartype?: (ctx: ForallmayfailvartypeContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.forallmayfailvartype`.
	 * @param ctx the parse tree
	 */
	exitForallmayfailvartype?: (ctx: ForallmayfailvartypeContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.extended_equation`.
	 * @param ctx the parse tree
	 */
	enterExtended_equation?: (ctx: Extended_equationContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.extended_equation`.
	 * @param ctx the parse tree
	 */
	exitExtended_equation?: (ctx: Extended_equationContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.treducotherwise`.
	 * @param ctx the parse tree
	 */
	enterTreducotherwise?: (ctx: TreducotherwiseContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.treducotherwise`.
	 * @param ctx the parse tree
	 */
	exitTreducotherwise?: (ctx: TreducotherwiseContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.treducmayfail`.
	 * @param ctx the parse tree
	 */
	enterTreducmayfail?: (ctx: TreducmayfailContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.treducmayfail`.
	 * @param ctx the parse tree
	 */
	exitTreducmayfail?: (ctx: TreducmayfailContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.treduc`.
	 * @param ctx the parse tree
	 */
	enterTreduc?: (ctx: TreducContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.treduc`.
	 * @param ctx the parse tree
	 */
	exitTreduc?: (ctx: TreducContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.eqlist`.
	 * @param ctx the parse tree
	 */
	enterEqlist?: (ctx: EqlistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.eqlist`.
	 * @param ctx the parse tree
	 */
	exitEqlist?: (ctx: EqlistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.tclause`.
	 * @param ctx the parse tree
	 */
	enterTclause?: (ctx: TclauseContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.tclause`.
	 * @param ctx the parse tree
	 */
	exitTclause?: (ctx: TclauseContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.tclauses`.
	 * @param ctx the parse tree
	 */
	enterTclauses?: (ctx: TclausesContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.tclauses`.
	 * @param ctx the parse tree
	 */
	exitTclauses?: (ctx: TclausesContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.programoptions`.
	 * @param ctx the parse tree
	 */
	enterProgramoptions?: (ctx: ProgramoptionsContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.programoptions`.
	 * @param ctx the parse tree
	 */
	exitProgramoptions?: (ctx: ProgramoptionsContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.progoptlist`.
	 * @param ctx the parse tree
	 */
	enterProgoptlist?: (ctx: ProgoptlistContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.progoptlist`.
	 * @param ctx the parse tree
	 */
	exitProgoptlist?: (ctx: ProgoptlistContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.progopt`.
	 * @param ctx the parse tree
	 */
	enterProgopt?: (ctx: ProgoptContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.progopt`.
	 * @param ctx the parse tree
	 */
	exitProgopt?: (ctx: ProgoptContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.progbegin`.
	 * @param ctx the parse tree
	 */
	enterProgbegin?: (ctx: ProgbeginContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.progbegin`.
	 * @param ctx the parse tree
	 */
	exitProgbegin?: (ctx: ProgbeginContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.progend`.
	 * @param ctx the parse tree
	 */
	enterProgend?: (ctx: ProgendContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.progend`.
	 * @param ctx the parse tree
	 */
	exitProgend?: (ctx: ProgendContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.syncopt`.
	 * @param ctx the parse tree
	 */
	enterSyncopt?: (ctx: SyncoptContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.syncopt`.
	 * @param ctx the parse tree
	 */
	exitSyncopt?: (ctx: SyncoptContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.tprocess`.
	 * @param ctx the parse tree
	 */
	enterTprocess?: (ctx: TprocessContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.tprocess`.
	 * @param ctx the parse tree
	 */
	exitTprocess?: (ctx: TprocessContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.opttprocess`.
	 * @param ctx the parse tree
	 */
	enterOpttprocess?: (ctx: OpttprocessContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.opttprocess`.
	 * @param ctx the parse tree
	 */
	exitOpttprocess?: (ctx: OpttprocessContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.optinprocess`.
	 * @param ctx the parse tree
	 */
	enterOptinprocess?: (ctx: OptinprocessContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optinprocess`.
	 * @param ctx the parse tree
	 */
	exitOptinprocess?: (ctx: OptinprocessContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.optelseprocess`.
	 * @param ctx the parse tree
	 */
	enterOptelseprocess?: (ctx: OptelseprocessContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optelseprocess`.
	 * @param ctx the parse tree
	 */
	exitOptelseprocess?: (ctx: OptelseprocessContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.basicpattern`.
	 * @param ctx the parse tree
	 */
	enterBasicpattern?: (ctx: BasicpatternContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.basicpattern`.
	 * @param ctx the parse tree
	 */
	exitBasicpattern?: (ctx: BasicpatternContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.tpattern`.
	 * @param ctx the parse tree
	 */
	enterTpattern?: (ctx: TpatternContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.tpattern`.
	 * @param ctx the parse tree
	 */
	exitTpattern?: (ctx: TpatternContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.nepatternseq`.
	 * @param ctx the parse tree
	 */
	enterNepatternseq?: (ctx: NepatternseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.nepatternseq`.
	 * @param ctx the parse tree
	 */
	exitNepatternseq?: (ctx: NepatternseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.tpatternseq`.
	 * @param ctx the parse tree
	 */
	enterTpatternseq?: (ctx: TpatternseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.tpatternseq`.
	 * @param ctx the parse tree
	 */
	exitTpatternseq?: (ctx: TpatternseqContext) => void;

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
	 * Enter a parse tree produced by `ProverifParser.optelseterm`.
	 * @param ctx the parse tree
	 */
	enterOptelseterm?: (ctx: OptelsetermContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optelseterm`.
	 * @param ctx the parse tree
	 */
	exitOptelseterm?: (ctx: OptelsetermContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.optsuchthat`.
	 * @param ctx the parse tree
	 */
	enterOptsuchthat?: (ctx: OptsuchthatContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optsuchthat`.
	 * @param ctx the parse tree
	 */
	exitOptsuchthat?: (ctx: OptsuchthatContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.optargs`.
	 * @param ctx the parse tree
	 */
	enterOptargs?: (ctx: OptargsContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.optargs`.
	 * @param ctx the parse tree
	 */
	exitOptargs?: (ctx: OptargsContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.neptermseq`.
	 * @param ctx the parse tree
	 */
	enterNeptermseq?: (ctx: NeptermseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.neptermseq`.
	 * @param ctx the parse tree
	 */
	exitNeptermseq?: (ctx: NeptermseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.ptermseq`.
	 * @param ctx the parse tree
	 */
	enterPtermseq?: (ctx: PtermseqContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.ptermseq`.
	 * @param ctx the parse tree
	 */
	exitPtermseq?: (ctx: PtermseqContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.onepermut`.
	 * @param ctx the parse tree
	 */
	enterOnepermut?: (ctx: OnepermutContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.onepermut`.
	 * @param ctx the parse tree
	 */
	exitOnepermut?: (ctx: OnepermutContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.permut`.
	 * @param ctx the parse tree
	 */
	enterPermut?: (ctx: PermutContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.permut`.
	 * @param ctx the parse tree
	 */
	exitPermut?: (ctx: PermutContext) => void;

	/**
	 * Enter a parse tree produced by `ProverifParser.order`.
	 * @param ctx the parse tree
	 */
	enterOrder?: (ctx: OrderContext) => void;
	/**
	 * Exit a parse tree produced by `ProverifParser.order`.
	 * @param ctx the parse tree
	 */
	exitOrder?: (ctx: OrderContext) => void;
}

