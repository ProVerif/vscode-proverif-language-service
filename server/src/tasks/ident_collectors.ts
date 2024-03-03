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


export const getType = (ctx?: TypeidContext): TerminalNode|undefined => {
    return ctx?.IDENT() ?? ctx?.CHANNEL();
};

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

export const collectNevartype = (ctx?: NevartypeContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    return [
        ...collectOnevartype(ctx.onevartype()),
        ...collectNevartype(ctx.nevartype())
    ];
};

export const collectOnevartype = (ctx?: OnevartypeContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const identifiers = [ctx.IDENT(), ...collectNeidentseq(ctx.neidentseq())];
    const type = getType(ctx.typeid());
    return identifiers.map(identifier => ({terminal: identifier, type }));
};


export const collectTPatternSeq = (ctx?: TpatternseqContext): TypedTerminal[] => {
    if (!ctx) {
        return  [];
    }

    const nepatternseq = ctx.nepatternseq();
    if (nepatternseq) {
        return collectNepatternseq(nepatternseq);
    }

    return [];
};

export const collectTPattern = (ctx?: TpatternContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const basicPattern = ctx.basicpattern();
    if (basicPattern) {
        const typedTerminal = collectBasicpattern(basicPattern);
        return typedTerminal ? [typedTerminal] : [];
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

export const collectNepatternseq = (ctx: NepatternseqContext): TypedTerminal[] => {
    const tpatternIdents = collectTPattern(ctx.tpattern());
    const nepatternseq = ctx.nepatternseq();
    if (nepatternseq) {
        return [...tpatternIdents, ...collectNepatternseq(nepatternseq)];
    }

    return tpatternIdents;
};

export const collectBasicpattern = (ctx?: BasicpatternContext): TypedTerminal|undefined => {
    if (!ctx) {
        return undefined;
    }

    const ident = ctx.IDENT();
    if (ident) {
        const type = getType(ctx.typeid());
        return { terminal: ident, type: ctx.typeid()};
    }

    return undefined;
};

export const collecMayfailvartypeseq = (ctx?: MayfailvartypeseqContext): TypedTerminal[] => {
    const nemayfailvartypeseq = ctx?.nemayfailvartypeseq();

    if (nemayfailvartypeseq) {
        return collectNemayfailvartypeseq(nemayfailvartypeseq);
    }

    return [];
};

export type TypedTerminal = {
    terminal: TerminalNode
    type?: ParseTree
}

export const collectMayfailvartype = (ctx: MayfailvartypeContext): TypedTerminal[] => {
    const identifiers = collectNeidentseq(ctx.neidentseq());
    const type = getType(ctx.typeid());

    return identifiers.map(identifier => ({ terminal: identifier, type}));
};

export const collectNemayfailvartypeseq = (ctx?: NemayfailvartypeseqContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const identifiers = collectMayfailvartype(ctx.mayfailvartype());

    const nemayfailvartypeseq = ctx.nemayfailvartypeseq();
    if (nemayfailvartypeseq) {
        return [...identifiers, ...collectNemayfailvartypeseq(nemayfailvartypeseq)];
    }

    return [...identifiers];
};

export const collectForallvartype = (ctx: ForallvartypeContext): TypedTerminal[] => {
    const nevartype = ctx.nevartype();
    if (nevartype) {
        return collectNevartype(nevartype);
    }

    return [];
};

export const collectForallmayfailvartype = (ctx: ForallmayfailvartypeContext): TypedTerminal[] => {
    const nemayfailvartypeseq = ctx.nemayfailvartypeseq();
    if (nemayfailvartypeseq) {
        return collectNemayfailvartypeseq(nemayfailvartypeseq);
    }

    return [];
};

export const collectExtendedEquation = (ctx: Extended_equationContext): TypedTerminal[] => {
    const identifiers: TypedTerminal[] = [];
    const identifier = ctx.IDENT();
    if (identifier) {
        // this does not infer types, although it would be nice!
        identifiers.push({ terminal: identifier, type: ctx.term() });
    }

    const extended_equation = ctx.extended_equation();
    if (extended_equation) {
        return [...identifiers, ...collectExtendedEquation(extended_equation)];
    }

    return [...identifiers];
};

export const collectTreduc = (ctx?: TreducContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const identifiers = [...collectForallvartype(ctx.forallvartype()), ...collectExtendedEquation(ctx.extended_equation())];

    const nemayfailvartypeseq = ctx.treduc();
    if (nemayfailvartypeseq) {
        return [...identifiers, ...collectTreduc(nemayfailvartypeseq)];
    }

    return [...identifiers];
};

export const collectEqlist = (ctx?: EqlistContext): TypedTerminal[] => {
    if (!ctx) {
        return [];
    }

    const identifiers = [...collectForallvartype(ctx.forallvartype()), ...collectExtendedEquation(ctx.extended_equation())];

    const eqlist = ctx.eqlist();
    if (eqlist) {
        return [...identifiers, ...collectEqlist(eqlist)];
    }

    return [...identifiers];
};
