import {
    BasicpatternContext,
    EqlistContext,
    Extended_equationContext,
    ForallmayfailvartypeContext,
    ForallvartypeContext,
    MayfailvartypeContext,
    MayfailvartypeseqContext,
    NeidentseqContext,
    NemayfailvartypeseqContext,
    NepatternseqContext,
    NetypeidseqContext,
    NevartypeContext,
    OnevartypeContext,
    TpatternContext,
    TpatternseqContext,
    TreducContext,
    TypeidContext,
    TypeidseqContext
} from "../parser-proverif/ProverifParser";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";
import {ParseTree} from "antlr4ts/tree/ParseTree";
import {ParserRuleContext} from "antlr4ts/ParserRuleContext";
import {nonNullable} from "../utils/array";

export type TypedTerminal = {
    terminal: TerminalNode
    type?: ParseTree
}

export const getType = (ctx?: TypeidContext): TerminalNode | undefined => {
    if (!ctx) {
        return undefined
    }

    const ident = tryGetTerminal(() => ctx.IDENT())
    const channel = tryGetTerminal(() => ctx.CHANNEL())
    return ident ?? channel;
};

export const collectNeidentseq = (ctx?: NeidentseqContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    const neidentseq = tryGetContext(() => ctx.neidentseq());
    const ident = tryGetTerminal(() => ctx.IDENT());
    return [
        ident,
        ...collectNeidentseq(neidentseq)
    ].filter(nonNullable);
};

export const collectTypeidseq = (ctx?: TypeidseqContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    const netypeidseq = tryGetContext(() => ctx.netypeidseq());
    return collectNetypeidseq(netypeidseq);
};

export const collectNetypeidseq = (ctx?: NetypeidseqContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    const typeid = tryGetContext(() => ctx.typeid());
    const netypeidseq = tryGetContext(() => ctx.netypeidseq());
    return [
        getType(typeid),
        ...collectNetypeidseq(netypeidseq)
    ].filter(nonNullable);
};

export const collectNevartype = (ctx?: NevartypeContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    let onevartype = tryGetContext(() => ctx.onevartype());
    let nevartype = tryGetContext(() => ctx.nevartype());
    return [
        ...collectOnevartype(onevartype),
        ...collectNevartype(nevartype)
    ];
};

export const collectOnevartype = (ctx?: OnevartypeContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const ident = tryGetTerminal(() => ctx.IDENT());
    const neidentseq = tryGetContext(() => ctx.neidentseq());
    const identifiers = [
        ident,
        ...collectNeidentseq(neidentseq)
    ].filter(nonNullable);

    const typeid = tryGetContext(() => ctx.typeid());
    return identifiers.map(identifier => ({terminal: identifier, type: getType(typeid)}));
};


export const collectTPatternSeq = (ctx?: TpatternseqContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const nepatternseq = tryGetContext(() => ctx.nepatternseq());
    return collectNepatternseq(nepatternseq);
};

export const collectTPattern = (ctx?: TpatternContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }


    const basicpattern = tryGetContext(() => ctx.basicpattern()); // identifier
    const tpatternseq = tryGetContext(() => ctx.tpatternseq()); // either direct declaration or declaration with a wrapped data function
    const tpatterns = tryGetContexts(() => ctx.tpattern()); // tpattern from choice or int statements
    return [
        collectBasicpattern(basicpattern),
        ...collectTPatternSeq(tpatternseq),
        ...tpatterns.map(collectTPattern).flat()
    ].filter(nonNullable);
};

export const collectNepatternseq = (ctx?: NepatternseqContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    let tpattern = tryGetContext(() => ctx.tpattern());
    const nepatternseq = tryGetContext(() => ctx.nepatternseq());
    return [
        ...collectTPattern(tpattern),
        ...collectNepatternseq(nepatternseq)
    ];
};

export const collectBasicpattern = (ctx?: BasicpatternContext): TypedTerminal | undefined => {
    if (!ctx) {
        return undefined;
    }

    const ident = tryGetTerminal(() => ctx.IDENT());
    if (ident) {
        const typeid = tryGetContext(() => ctx.typeid());
        return {terminal: ident, type: getType(typeid)};
    }

    return undefined;
};

export const collecMayfailvartypeseq = (ctx?: MayfailvartypeseqContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const nemayfailvartypeseq = tryGetContext(() => ctx.nemayfailvartypeseq());
    return collectNemayfailvartypeseq(nemayfailvartypeseq);
};

export const collectMayfailvartype = (ctx?: MayfailvartypeContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }


    const neidentseq = tryGetContext(() => ctx.neidentseq());
    const identifiers = collectNeidentseq(neidentseq);

    const typeid = tryGetContext(() => ctx.typeid());
    return identifiers.map(identifier => ({terminal: identifier, type: getType(typeid)}));
};

export const collectNemayfailvartypeseq = (ctx?: NemayfailvartypeseqContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const mayfailvartype = tryGetContext(() => ctx.mayfailvartype());
    const nemayfailvartypeseq = tryGetContext(() => ctx.nemayfailvartypeseq());
    return [
        ...collectMayfailvartype(mayfailvartype),
        ...collectNemayfailvartypeseq(nemayfailvartypeseq)
    ];
};

export const collectForallvartype = (ctx?: ForallvartypeContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const nevartype = tryGetContext(() => ctx.nevartype());
    return collectNevartype(nevartype);
};

export const collectForallmayfailvartype = (ctx?: ForallmayfailvartypeContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const nemayfailvartypeseq = tryGetContext(() => ctx.nemayfailvartypeseq());
    return collectNemayfailvartypeseq(nemayfailvartypeseq);
};

export const collectExtendedEquation = (ctx?: Extended_equationContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    let terminal: TypedTerminal|undefined = undefined;
    const identifier = tryGetTerminal(() => ctx.IDENT());
    if (identifier) {
        // this does not infer types, although it would be nice!
        const term = tryGetContext(() => ctx.term());
        terminal = {terminal: identifier, type: term};
    }

    const extended_equation = tryGetContext(() => ctx.extended_equation());
    return [
        terminal,
        ...collectExtendedEquation(extended_equation)
    ].filter(nonNullable);
};

export const collectTreduc = (ctx?: TreducContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const forallvartype = tryGetContext(() => ctx.forallvartype());
    const extendedEquation = tryGetContext(() => ctx.extended_equation());
    const nemayfailvartypeseq = tryGetContext(() => ctx.treduc());
    return [
        ...collectForallvartype(forallvartype),
        ...collectExtendedEquation(extendedEquation),
        ...collectTreduc(nemayfailvartypeseq)
    ];
};

export const collectEqlist = (ctx?: EqlistContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const forallvartype = tryGetContext(() => ctx.forallvartype());
    const extendedEquation = tryGetContext(() => ctx.extended_equation());
    const eqlist = tryGetContext(() => ctx.eqlist());
    return [
        ...collectForallvartype(forallvartype),
        ...collectExtendedEquation(extendedEquation),
        ...collectEqlist(eqlist)
    ];
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
    }

    return undefined;
};

const tryGetContexts = <T extends ParserRuleContext | undefined>(getContext: () => T[]): T[] => {
    try {
        return getContext();
    } catch (e) {
    }

    return [];
};

/**
 * See description of tryGetContext
 *
 * @param getTerminal
 */
const tryGetTerminal = <T extends TerminalNode | undefined>(getTerminal: () => T): T | undefined => {
    try {
        return getTerminal();
    } catch (e) {
    }

    return undefined;
};
