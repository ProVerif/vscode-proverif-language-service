import {
    BasicpatternContext,
    Extended_equationContext,
    ForallmayfailvartypeContext,
    ForallvartypeContext,
    MayfailvartypeContext,
    MayfailvartypeseqContext,
    NeidentseqContext,
    NemayfailvartypeseqContext,
    NepatternseqContext,
    NetermseqContext,
    NetypeidseqContext,
    NevartypeContext,
    OnevartypeContext,
    Options_Context,
    OptionseqContext,
    SingleoptionContext,
    TermContext,
    TermseqContext,
    TpatternContext,
    TpatternseqContext,
    TreducContext,
    TypeidContext,
    TypeidseqContext
} from "../parser/ProverifParser";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";
import {ParseTree} from "antlr4ts/tree/ParseTree";
import {ParserRuleContext} from "antlr4ts/ParserRuleContext";
import {nonNullable} from "../../utils/array";

export type TypedTerminal = {
    terminal: TerminalNode
    type?: ParseTree
}

export type TypedParameterTerminal = {
    terminal: TerminalNode
    parameters: (ParseTree | undefined)[]
    type?: ParseTree
}

export const getType = (getContext: () => TypeidContext | undefined): TerminalNode | undefined => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return undefined;
    }

    const ident = tryGetTerminal(() => ctx.IDENT());
    const channel = tryGetTerminal(() => ctx.CHANNEL());
    return ident ?? channel;
};

export const collectNeidentseq = (getContext: () => NeidentseqContext | undefined): TerminalNode[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    const ident = tryGetTerminal(() => ctx.IDENT());
    return [
        ident,
        ...collectNeidentseq(() => ctx.neidentseq())
    ].filter(nonNullable);
};

export const collectTypeidseq = (getContext: () => TypeidseqContext | undefined): TerminalNode[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    return collectNetypeidseq(() => ctx.netypeidseq());
};

export const collectNetypeidseq = (getContext: () => NetypeidseqContext | undefined): TerminalNode[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    return [
        getType(() => ctx.typeid()),
        ...collectNetypeidseq(() => ctx.netypeidseq())
    ].filter(nonNullable);
};

export const collectNevartype = (getContext: () => NevartypeContext | undefined): TypedTerminal[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    return [
        ...collectOnevartype(() => ctx.onevartype()),
        ...collectNevartype(() => ctx.nevartype())
    ];
};

export const collectOnevartype = (getContext: () => OnevartypeContext | undefined): TypedTerminal[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    const ident = tryGetTerminal(() => ctx.IDENT());
    const identifiers = [
        ident,
        ...collectNeidentseq(() => ctx.neidentseq())
    ].filter(nonNullable);

    return createTypedTerminals(identifiers, () => ctx.typeid());
};


export const collectTPatternSeq = (getContext: () => TpatternseqContext | undefined): TypedTerminal[] => {
    return collectNepatternseq(() => getContext()?.nepatternseq());
};

export const collectTPattern = (getContext: () => TpatternContext | undefined): TypedTerminal[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    const tpatterns = tryGetContexts(() => ctx.tpattern()); // tpattern from choice or int statements
    return [
        ...collectBasicpattern(() => ctx.basicpattern()),
        ...collectTPatternSeq(() => ctx.tpatternseq()),
        ...tpatterns.map(tpattern => collectTPattern(() => tpattern)).flat()
    ].filter(nonNullable);
};

export const collectNepatternseq = (getContext: () => NepatternseqContext | undefined): TypedTerminal[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    return [
        ...collectTPattern(() => ctx.tpattern()),
        ...collectNepatternseq(() => ctx.nepatternseq())
    ];
};

export const collectBasicpattern = (getContext: () => BasicpatternContext | undefined): TypedTerminal[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    const ident = tryGetTerminal(() => ctx.IDENT());
    const identifiers = [ident].filter(nonNullable);

    return createTypedTerminals(identifiers, () => ctx.typeid());
};

export const collecMayfailvartypeseq = (getContext: () => MayfailvartypeseqContext | undefined): TypedTerminal[] => {
    return collectNemayfailvartypeseq(() => getContext()?.nemayfailvartypeseq());
};

export const collectMayfailvartype = (getContext: () => MayfailvartypeContext | undefined): TypedTerminal[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    const identifiers = collectNeidentseq(() => ctx.neidentseq());

    return createTypedTerminals(identifiers, () => ctx.typeid());
};

export const collectNemayfailvartypeseq = (getContext: () => NemayfailvartypeseqContext | undefined): TypedTerminal[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    return [
        ...collectMayfailvartype(() => ctx.mayfailvartype()),
        ...collectNemayfailvartypeseq(() => ctx.nemayfailvartypeseq())
    ];
};

export const collectForallvartype = (getContext: () => ForallvartypeContext | undefined): TypedTerminal[] => {
    return collectNevartype(() => getContext()?.nevartype());
};

export const collectForallmayfailvartype = (getContext: () => ForallmayfailvartypeContext | undefined): TypedTerminal[] => {
    return collectNemayfailvartypeseq(() => getContext()?.nemayfailvartypeseq());
};

const collectNetermSeqToTerms = (getContext: () => NetermseqContext | undefined): (TermContext | undefined)[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    const term = tryGetContext(() => ctx.term());
    return [term, ...collectNetermSeqToTerms(() => ctx.netermseq())];
};

const collectTermSeqToTerms = (getContext: () => TermseqContext | undefined): (TermContext | undefined)[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    return collectNetermSeqToTerms(() => ctx.netermseq());
};

export const collectExtendedEquation = (getContext: () => Extended_equationContext | undefined): TypedParameterTerminal[] => {
    const ctx = tryGetContext(getContext);
    if (!ctx) {
        return [];
    }

    const equations = collectExtendedEquation(() => ctx.extended_equation());
    const term = tryGetContext(() => ctx.term());
    if (!term) {
        return equations;
    }

    // must be of structure func(someargs) = result
    // hence (IDENT LPAREN termseq RPAREN) EQUAL term
    if (!term.EQUAL()) {
        return equations;
    }

    const leftAndRightTerm = tryGetContexts(() => term.term());
    const leftTerm = leftAndRightTerm[0];
    const rightTerm = leftAndRightTerm[1];
    if (!leftTerm || !rightTerm) {
        return equations;
    }

    // check left side is a function definition, else result nonsense
    const ident = leftTerm.IDENT();
    if (!ident || !leftTerm.LPAREN() || !leftTerm.RPAREN()) {
        return equations;
    }

    // this does not infer types (notably of the right term), although it would be nice!
    const terms = collectTermSeqToTerms(() => leftTerm.termseq());
    const terminal: TypedParameterTerminal = {terminal: ident, parameters: terms, type: rightTerm};

    return [terminal, ...equations];
};

export const collectIdentifier = (getIdentifer: () => TerminalNode | undefined): TerminalNode | undefined => {
    return tryGetTerminal(getIdentifer);
};

export const collectSingleIdentifiers = (getIdentifer: () => TerminalNode | undefined): TerminalNode[] => {
    const identifier = tryGetTerminal(getIdentifer);
    return [identifier].filter(nonNullable);
};

export const collectIdentifiers = (getIdentifer: () => TerminalNode[]): TerminalNode[] => {
    return tryGetTerminals(getIdentifer) ?? [];
};

const createTypedTerminals = (identifiers: TerminalNode[], getTypeId: () => TypeidContext | undefined) => {
    return identifiers.map(identifier => ({terminal: identifier, type: getType(getTypeId)}));
};


export const collectOptions = (getOptionsContext: () => Options_Context | undefined): string[] => {
    const ctx = tryGetContext(getOptionsContext);
    if (!ctx) {
        return [];
    }

    const optionSeqs = collectOptionsSeq(() => ctx.optionseq());
    return optionSeqs.map(seq => seq.text);
};


export const collectOptionsSeq = (getOptionsContext: () => OptionseqContext | undefined): SingleoptionContext[] => {
    const ctx = tryGetContext(getOptionsContext);
    if (!ctx) {
        return [];
    }

    const options = collectOptionsSeq(() => ctx.optionseq());
    return [ctx.singleoption(), ...options];
};

export const collectTreducEquations = (getTreducContext: () => TreducContext | undefined): TypedParameterTerminal[] => {
    const ctx = tryGetContext(getTreducContext);
    if (!ctx) {
        return [];
    }

    const extendedEquations = collectExtendedEquation(() => ctx.extended_equation());
    const treducEquations = collectTreducEquations(() => ctx.treduc());
    return [...extendedEquations, ...treducEquations];
};

/**
 * All context which cannot be undefined by the grammar but in fact are (because the user has a syntax error) instead throw at runtime if the corresponding entry is accessed
 * Therefore, when accessing such a context, it needs to be wrapped in try/catch.
 *
 * Strictly speaking, when the context can be undefined in the grammar, it needs not be wrapped in try/catch (Antrl handles this case by returning undefined).
 * However, this is hard to maintain, as the author needs to be aware of this subtlety, so we just wrap everything.
 *
 * The same holds when getting a terminal.
 *
 * @param getContext
 */
const tryGetContext = <T extends ParserRuleContext | undefined>(getContext: () => T): T | undefined => {
    try {
        return getContext();
    } catch (e) {
        // exceptions OK; just means the grammar cannot resolve parse tree
    }

    return undefined;
};

/**
 See description of tryGetContext
 */
const tryGetContexts = <T extends ParserRuleContext | undefined>(getContext: () => undefined | T[]): T[] => {
    try {
        return getContext() ?? [];
    } catch (e) {
        // exceptions OK; just means the grammar cannot resolve parse tree
    }

    return [];
};

/**
 See description of tryGetContext
 */
const tryGetTerminal = <T extends TerminalNode | undefined>(getTerminal: () => T): T | undefined => {
    try {
        return getTerminal();
    } catch (e) {
        // exceptions OK; just means the grammar cannot resolve parse tree
    }

    return undefined;
};

/**
 See description of tryGetContext
 */
const tryGetTerminals = <T extends TerminalNode | undefined>(getTerminal: () => T[]): T[] => {
    try {
        return getTerminal();
    } catch (e) {
        // exceptions OK; just means the grammar cannot resolve parse tree
    }

    return [];
};
