import {AbstractParseTreeVisitor, ParseTree} from "antlr4ts/tree";
import {ProverifParserVisitor} from "../parser-proverif/ProverifParserVisitor";
import {
    LibContext,
    NeidentseqContext,
    NevartypeContext,
    OnevartypeContext,
    TprocessContext
} from "../parser-proverif/ProverifParser";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";


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

    private collectNeidentseqIDENTs = (ctx?: NeidentseqContext): TerminalNode[] => {
        if (!ctx) {
            return [];
        }

        return [ctx.IDENT(), ...this.collectNeidentseqIDENTs(ctx.neidentseq())];
    };

    private collectNevartypeIDENTs = (ctx?: NevartypeContext): TerminalNode[] => {
        if (!ctx) {
            return [];
        }

        return [
            ...this.collectOnevartypeIDENTs(ctx.onevartype()),
            ...this.collectNevartypeIDENTs(ctx.nevartype())
        ];
    };

    private collectOnevartypeIDENTs = (ctx?: OnevartypeContext): TerminalNode[] => {
        if (!ctx) {
            return [];
        }

        return [ctx.IDENT(), ...this.collectNeidentseqIDENTs(ctx.neidentseq())];
    };

    public visitLib = (ctx: LibContext) => {
        const identifierList = ctx.neidentseq();
        if (identifierList && (ctx.CONST() || ctx.CHANNEL() || ctx.FREE())) {
            this.collectNeidentseqIDENTs(identifierList).forEach(identifier => {
                this.registerVariable(identifier);
            });
        }

        const identifier = ctx.IDENT();
        if (identifier && (ctx.TYPE() || ctx.FUN() || ctx.EVENT() || ctx.PREDICATE() || ctx.TABLE() || ctx.LET() || ctx.LETFUN())) {
            this.registerVariable(identifier);
        }

        return this.visitChildren(ctx);
    };

    public visitTprocess = (ctx: TprocessContext) => {
        return this.withContext(ctx, () => {
            const tpattern = ctx.tpattern();
            if (tpattern && (ctx.IN() || ctx.LET())) {
                // TODO parse patterns
            }

            const nevartype = ctx.nevartype();
            if (tpattern && (ctx.LET())) {
                this.collectNevartypeIDENTs(nevartype).forEach(identifier => {
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

    /**
     visitFunctionDeclaration = (ctx: FunctionDeclarationContext) => {
     return this.withScope(ctx, RoutineSymbol, [ctx.identifier().text], () => this.visitChildren(ctx));
     };
     */

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

class ProverifSymbolTable {
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

