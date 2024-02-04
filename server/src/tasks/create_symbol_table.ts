import {AbstractParseTreeVisitor, ParseTree} from "antlr4ts/tree";
import {ProverifParserVisitor} from "../parser-proverif/ProverifParserVisitor";
import {LibContext, TprocessContext} from "../parser-proverif/ProverifParser";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";
import {
    collecMayfailvartypeseq,
    collectEqlist,
    collectNeidentseq,
    collectNemayfailvartypeseq,
    collectNevartype,
    collectTPattern,
    collectTPatternSeq,
    collectTreduc,
    collectTypeidseq
} from "./ident_collectors";


export type CreateSymbolTableResult = {
    symbolTable: ProverifSymbolTable
}

export const createSymbolTable = (context: ParseTree): CreateSymbolTableResult => {
    const symbolTableVisitor = new SymbolTableVisitor();
    return {symbolTable: symbolTableVisitor.visit(context)};
};

export enum SymbolType {
    External = 'external',
    Variable = 'variable',

    Const = 'const',
    Channel = 'channel',
    Free = 'free',

    Type = 'type',
    Fun = 'fun',
    Event = 'event',
    Predicate = 'predicate',
    Table = 'table',
    Let = 'let',
    LetFun = 'letfun',
    Define = 'define',
    DefineArgument = 'define_argument',
    ExpandArgument = 'expand_argument'
}

class SymbolTableVisitor extends AbstractParseTreeVisitor<ProverifSymbolTable> implements ProverifParserVisitor<ProverifSymbolTable> {
    constructor(
        private readonly symbolTable = new ProverifSymbolTable(),
        private context: undefined | ParseTree = undefined) {
        super();
    }

    protected defaultResult(): ProverifSymbolTable {
        return this.symbolTable;
    }

    public visitLib = (ctx: LibContext) => {
        const neidentseq = ctx.neidentseq();
        if (neidentseq && (ctx.CONST() || ctx.CHANNEL() || ctx.FREE())) {
            let type = SymbolType.Variable;
            if (ctx.CONST()) type = SymbolType.Const;
            else if (ctx.CHANNEL()) type = SymbolType.Channel;
            else if (ctx.FREE()) type = SymbolType.Free;

            collectNeidentseq(neidentseq).forEach(identifier => {
                this.registerVariable(identifier, type);
            });
        }

        const identifier = ctx.IDENT();
        if (identifier && (ctx.TYPE() || ctx.FUN() || ctx.EVENT() || ctx.PREDICATE() || ctx.TABLE() || ctx.LET() || ctx.LETFUN() || ctx.DEFINE())) {
            let type = SymbolType.Variable;
            if (ctx.TYPE()) type = SymbolType.Type;
            else if (ctx.FUN()) type = SymbolType.Fun;
            else if (ctx.EVENT()) type = SymbolType.Event;
            else if (ctx.PREDICATE()) type = SymbolType.Predicate;
            else if (ctx.TABLE()) type = SymbolType.Table;
            else if (ctx.LET()) type = SymbolType.Let;
            else if (ctx.LETFUN()) type = SymbolType.LetFun;
            else if (ctx.DEFINE()) type = SymbolType.Define;

            this.registerVariable(identifier, type);

            if (ctx.DEFINE()) {
                this.withContext(ctx, () => {
                    collectTypeidseq(ctx.typeidseq()).forEach(identifier => {
                        this.registerVariable(identifier, SymbolType.DefineArgument);
                    });
                });
            }

            const mayfailvartypeseq = ctx.mayfailvartypeseq();
            if (mayfailvartypeseq && (ctx.LET() || ctx.LETFUN())) {
                this.withContext(ctx, () => {
                    collecMayfailvartypeseq(mayfailvartypeseq).forEach(identifier => {
                        this.registerVariable(identifier, SymbolType.Variable);
                    });
                });
            }
        }

        if (ctx.EXPAND()) {
            collectTypeidseq(ctx.typeidseq()).forEach(identifier => {
                this.registerVariable(identifier, SymbolType.ExpandArgument);
            });
        }

        const treduc = ctx.treduc();
        if (treduc && (ctx.REDUCTION())) {
            this.withContext(ctx, () => {
                collectTreduc(treduc).forEach(identifier => {
                    this.registerVariable(identifier);
                });
            });
        }

        const eqlist = ctx.eqlist();
        if (eqlist && ctx.EQUATION()) {
            this.withContext(ctx, () => {
                collectEqlist(eqlist).forEach(identifier => {
                    this.registerVariable(identifier);
                });
            });
        }

        const nevartype = ctx.nevartype();
        if (nevartype && (ctx.NOUNIF() || ctx.SELECT() || ctx.QUERY() || ctx.NONINTERF() || ctx.NOT() || ctx.lemma())) {
            this.withContext(ctx, () => {
                collectNevartype(nevartype).forEach(identifier => {
                    this.registerVariable(identifier);
                });
            });
        }

        const nemayfailvartypeseq = ctx.nemayfailvartypeseq();
        if (nemayfailvartypeseq && (ctx.ELIMTRUE())) {
            this.withContext(ctx, () => {
                collectNemayfailvartypeseq(nemayfailvartypeseq).forEach(identifier => {
                    this.registerVariable(identifier);
                });
            });
        }

        return this.visitChildren(ctx);
    };

    public visitTprocess = (ctx: TprocessContext) => {
        return this.withContext(ctx, () => {
            const tpattern = ctx.tpattern();
            if (tpattern && (ctx.IN() || ctx.LET())) {
                collectTPattern(tpattern).forEach(identifier => {
                    this.registerVariable(identifier);
                });
            }

            const tpatternseq = ctx.tpatternseq();
            if (tpatternseq && (ctx.GET())) {
                collectTPatternSeq(tpatternseq).forEach(identifier => {
                    this.registerVariable(identifier);
                });
            }

            const nevartype = ctx.nevartype();
            if (tpattern && (ctx.LET())) {
                collectNevartype(nevartype).forEach(identifier => {
                    this.registerVariable(identifier);
                });
            }

            const identifier = ctx.IDENT();
            if (identifier.length === 1 && (ctx.NEW() || ctx.RANDOM())) {
                this.registerVariable(identifier[0]);
            }

            const basicPattern = ctx.basicpattern();
            const basicPatternIdent = basicPattern?.IDENT();
            if (ctx.LEFTARROW() && basicPatternIdent) {
                this.registerVariable(basicPatternIdent);
            }

            return this.visitChildren(ctx);
        });
    };

    private registerVariable(identifier: TerminalNode, type: SymbolType = SymbolType.Variable) {
        this.symbolTable.addSymbol(identifier, type, this.context);
    }

    private withContext<T>(context: undefined | ParseTree, action: () => T): T {
        const previous = this.context;
        this.context = context;
        try {
            return action();
        } finally {
            this.context = previous;
        }
    }
}

export type ProverifSymbol = {
    node: TerminalNode
    type: SymbolType
    context?: ParseTree
}

export class ProverifSymbolTable {
    private symbols: ProverifSymbol[] = [];

    public addSymbol(node: TerminalNode, type: SymbolType, context?: ParseTree) {
        this.symbols.push({node, type, context});
    }

    public findClosestSymbol(node: ParseTree): ProverifSymbol | undefined {
        return this.findClosestSymbolInternal(node.text, node);
    }

    public getSymbols(): ProverifSymbol[] {
        return this.symbols;
    }

    private findClosestSymbolInternal(name: string, context?: ParseTree): ProverifSymbol | undefined {
        const symbolsOfContext = this.symbols.filter(symbol => symbol.context === context);
        const matchingSymbol = symbolsOfContext.find(symbol => symbol.node.text === name);
        if (matchingSymbol) {
            return matchingSymbol;
        }

        return context ? this.findClosestSymbolInternal(name, context.parent) : undefined;
    }
}

