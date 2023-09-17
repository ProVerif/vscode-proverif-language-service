import {
    BasicpatternContext, MayfailvartypeseqContext,
    NeidentseqContext, NemayfailvartypeseqContext, NepatternseqContext,
    NevartypeContext,
    OnevartypeContext,
    TpatternContext, TpatternseqContext
} from "../parser-proverif/ProverifParser";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";


export const collectNeidentseqIDENTs = (ctx?: NeidentseqContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    return [ctx.IDENT(), ...collectNeidentseqIDENTs(ctx.neidentseq())];
};

export const collectNevartypeIDENTs = (ctx?: NevartypeContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    return [
        ...collectOnevartypeIDENTs(ctx.onevartype()),
        ...collectNevartypeIDENTs(ctx.nevartype())
    ];
};

export const collectOnevartypeIDENTs = (ctx?: OnevartypeContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    return [ctx.IDENT(), ...collectNeidentseqIDENTs(ctx.neidentseq())];
};

export const collectTPatternIDENTs = (ctx: TpatternContext): TerminalNode[] => {
    const basicPattern = ctx.basicpattern();
    if (basicPattern) {
        return collectBasicpattern(basicPattern);
    }

    // either direct declaration or declaration with a wrapped data function
    const tpatternSeq = ctx.tpatternseq();
    if (tpatternSeq) {
        const nepatternsq = tpatternSeq.nepatternseq();
        return nepatternsq ? collectNepatternseq(nepatternsq): [];
    }

    // tpattern from choice or int statements
    const tpatterns = ctx.tpattern();
    return tpatterns.map(collectTPatternIDENTs).flat();
};

export const collectNepatternseq = (ctx: NepatternseqContext): TerminalNode[] => {
    const tpatternIdents = collectTPatternIDENTs(ctx.tpattern());
    const nepatternseq = ctx.nepatternseq();
    if (nepatternseq) {
        return [...tpatternIdents, ...collectNepatternseq(nepatternseq)];
    }

    return tpatternIdents;
};

export const collectBasicpattern = (ctx: BasicpatternContext): TerminalNode[] => {
    const ident = ctx.IDENT();
    if (ident) {
        return [ident];
    }

    return [];
};

export const collectNemayfailvartypeseq = (ctx: NemayfailvartypeseqContext) : TerminalNode[] => {
    const identifiers = collectNeidentseqIDENTs(ctx.mayfailvartype().neidentseq());

    const nemayfailvartypeseq = ctx.nemayfailvartypeseq();
    if (nemayfailvartypeseq) {
        return [...identifiers, ...collectNemayfailvartypeseq(nemayfailvartypeseq)];
    }
    
    return [...identifiers];
};