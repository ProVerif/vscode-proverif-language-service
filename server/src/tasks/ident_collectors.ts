import {
    BasicpatternContext,
    EqlistContext,
    Extended_equationContext,
    ForallvartypeContext,
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
    TypeidseqContext
} from "../parser-proverif/ProverifParser";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";


export const collectNeidentseq = (ctx?: NeidentseqContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    return [ctx.IDENT(), ...collectNeidentseq(ctx.neidentseq())];
};

export const collectTypeidseq = (ctx?: TypeidseqContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    const netypeidseq = ctx.netypeidseq();
    if (!netypeidseq) {
        return [];
    }

    return collectNetypeidseq(netypeidseq);
};

export const collectNetypeidseq = (ctx?: NetypeidseqContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    const ident = ctx.typeid().IDENT();
    const base = ident ? [ident] : [];

    const netypeidseq = ctx.netypeidseq();
    if (!netypeidseq) {
        return base;
    }

    return [...base, ...collectNetypeidseq(netypeidseq)];
};

export const collectNevartype = (ctx?: NevartypeContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    return [
        ...collectOnevartype(ctx.onevartype()),
        ...collectNevartype(ctx.nevartype())
    ];
};

export const collectOnevartype = (ctx?: OnevartypeContext): TerminalNode[] => {
    if (!ctx) {
        return [];
    }

    return [ctx.IDENT(), ...collectNeidentseq(ctx.neidentseq())];
};


export const collectTPatternSeq = (ctx: TpatternseqContext): TerminalNode[] => {
    const nepatternseq = ctx.nepatternseq();
    if (nepatternseq) {
        return collectNepatternseq(nepatternseq);
    }

    return [];
};

export const collectTPattern = (ctx: TpatternContext): TerminalNode[] => {
    const basicPattern = ctx.basicpattern();
    if (basicPattern) {
        return collectBasicpattern(basicPattern);
    }

    // either direct declaration or declaration with a wrapped data function
    const tpatternSeq = ctx.tpatternseq();
    if (tpatternSeq) {
        const nepatternsq = tpatternSeq.nepatternseq();
        return nepatternsq ? collectNepatternseq(nepatternsq) : [];
    }

    // tpattern from choice or int statements
    const tpatterns = ctx.tpattern();
    return tpatterns.map(collectTPattern).flat();
};

export const collectNepatternseq = (ctx: NepatternseqContext): TerminalNode[] => {
    const tpatternIdents = collectTPattern(ctx.tpattern());
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

export const collecMayfailvartypeseq = (ctx: MayfailvartypeseqContext): TerminalNode[] => {
    const nemayfailvartypeseq = ctx.nemayfailvartypeseq();

    if (nemayfailvartypeseq) {
        return collectNemayfailvartypeseq(nemayfailvartypeseq);
    }

    return [];
};

export const collectNemayfailvartypeseq = (ctx: NemayfailvartypeseqContext): TerminalNode[] => {
    const identifiers = collectNeidentseq(ctx.mayfailvartype().neidentseq());

    const nemayfailvartypeseq = ctx.nemayfailvartypeseq();
    if (nemayfailvartypeseq) {
        return [...identifiers, ...collectNemayfailvartypeseq(nemayfailvartypeseq)];
    }

    return [...identifiers];
};

export const collectForallvartype = (ctx: ForallvartypeContext): TerminalNode[] => {
    const nevartype = ctx.nevartype();
    if (nevartype) {
        return collectNevartype(nevartype);
    }

    return [];
};

export const collectExtendedEquation = (ctx: Extended_equationContext): TerminalNode[] => {
    const identifiers: TerminalNode[] = [];
    const identifier = ctx.IDENT();
    if (identifier) {
        identifiers.push(identifier);
    }

    const extended_equation = ctx.extended_equation();
    if (extended_equation) {
        return [...identifiers, ...collectExtendedEquation(extended_equation)];
    }

    return [...identifiers];
};

export const collectTreduc = (ctx: TreducContext): TerminalNode[] => {
    const identifiers = [...collectForallvartype(ctx.forallvartype()), ...collectExtendedEquation(ctx.extended_equation())];

    const nemayfailvartypeseq = ctx.treduc();
    if (nemayfailvartypeseq) {
        return [...identifiers, ...collectTreduc(nemayfailvartypeseq)];
    }

    return [...identifiers];
};

export const collectEqlist = (ctx: EqlistContext): TerminalNode[] => {
    const identifiers = [...collectForallvartype(ctx.forallvartype()), ...collectExtendedEquation(ctx.extended_equation())];

    const eqlist = ctx.eqlist();
    if (eqlist) {
        return [...identifiers, ...collectEqlist(eqlist)];
    }

    return [...identifiers];
};
