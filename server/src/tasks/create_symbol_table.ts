import {AbstractParseTreeVisitor, ParseTree} from "antlr4ts/tree";
import {ProverifParserVisitor} from "../parser-proverif/ProverifParserVisitor";
import {
    LibContext,
    TprocessContext
} from "../parser-proverif/ProverifParser";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";
import {
    collectNeidentseqIDENTs, collectNemayfailvartypeseq,
    collectNevartypeIDENTs,
    collectTPatternIDENTs
} from "./collectors";


export type CreateSymbolTableResult = {
    symbolTable: ProverifSymbolTable
}

export const createSymbolTable = (context: ParseTree): CreateSymbolTableResult => {
    const symbolTableVisitor = new SymbolTableVisitor();
    return {symbolTable: symbolTableVisitor.visit(context)};
};

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
        const identifierList = ctx.neidentseq();
        if (identifierList && (ctx.CONST() || ctx.CHANNEL() || ctx.FREE())) {
            collectNeidentseqIDENTs(identifierList).forEach(identifier => {
                this.registerVariable(identifier);
            });
        }

        const identifier = ctx.IDENT();
        if (identifier && (ctx.TYPE() || ctx.FUN() || ctx.EVENT() || ctx.PREDICATE() || ctx.TABLE() || ctx.LET() || ctx.LETFUN())) {
            this.registerVariable(identifier);
        }

        const nevartype = ctx.nevartype();
        if (nevartype) {
            this.withContext(ctx, () => {
                collectNevartypeIDENTs(nevartype).forEach(identifier => {
                    this.registerVariable(identifier);
                });
            });
        }

        if (ctx.LET()) {
            return this.withContext(ctx, () => {
                const mayfailvartypeseq = ctx.mayfailvartypeseq();
                const nemayfailvartypeseq = mayfailvartypeseq?.nemayfailvartypeseq();
                if (nemayfailvartypeseq) {
                    collectNemayfailvartypeseq(nemayfailvartypeseq).forEach(identifier => {
                        this.registerVariable(identifier);
                    });
                }
                return this.visitChildren(ctx);
            });
        } else {
            return this.visitChildren(ctx);
        }
    };

    public visitTprocess = (ctx: TprocessContext) => {
        return this.withContext(ctx, () => {
            const tpattern = ctx.tpattern();
            if (tpattern && (ctx.IN() || ctx.LET())) {
                collectTPatternIDENTs(tpattern).forEach(identifier => {
                    this.registerVariable(identifier);
                });
            }

            const nevartype = ctx.nevartype();
            if (tpattern && (ctx.LET())) {
                collectNevartypeIDENTs(nevartype).forEach(identifier => {
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

    private registerVariable(identifier: TerminalNode) {
        this.symbolTable.addSymbol(identifier, this.context);
    }

    private withContext<T>(context: ParseTree, action: () => T): T {
        this.context = context;
        try {
            return action();
        } finally {
            this.context = context.parent;
        }
    }
}


type ProverifSymbol = {
    node: TerminalNode
    context?: ParseTree
}

export class ProverifSymbolTable {
    private symbols: ProverifSymbol[] = [];

    public addSymbol(node: TerminalNode, context?: ParseTree) {
        this.symbols.push({node, context});
    }

    public findClosestSymbol(node: ParseTree): ParseTree | undefined {
        return this.findClosestSymbolInternal(node.text, node);
    }

    public getSymbols(): ProverifSymbol[] {
        return this.symbols;
    }

    private findClosestSymbolInternal(name: string, context?: ParseTree): ParseTree | undefined {
        const symbolsOfContext = this.symbols.filter(symbol => symbol.context === context);
        const matchingSymbol = symbolsOfContext.find(symbol => symbol.node.text === name);
        if (matchingSymbol) {
            return matchingSymbol.node;
        }

        return context ? this.findClosestSymbolInternal(name, context.parent) : undefined;
    }
}

