import {AbstractParseTreeVisitor, ParseTree} from "antlr4ts/tree";
import {ProverifParserVisitor} from "../parser-proverif/ProverifParserVisitor";
import {LibContext, TprocessContext, TreducmayfailContext} from "../parser-proverif/ProverifParser";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";
import {
    collecMayfailvartypeseq,
    collectBasicpattern,
    collectEqlist,
    collectForallmayfailvartype,
    collectNeidentseq,
    collectNemayfailvartypeseq,
    collectNevartype,
    collectTPattern,
    collectTPatternSeq,
    collectTreduc,
    collectTypeidseq,
    getType,
    TypedTerminal
} from "./ident_collectors";


export type CreateSymbolTableResult = {
    symbolTable: ProverifSymbolTable
}

export const createSymbolTable = (context: ParseTree): CreateSymbolTableResult => {
    const symbolTableVisitor = new SymbolTableVisitor();
    return {symbolTable: symbolTableVisitor.visit(context)};
};

export enum DeclarationType {
    Parameter = 'parameter',
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
    DefineParameter = 'define-parameter',
    Expand = 'expand',
    ExpandParameter = 'expand-parameter',
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
        if (ctx.CONST() || ctx.FREE()) {
            const declarationType = ctx.CONST() ? DeclarationType.Const : DeclarationType.Free;
            collectNeidentseq(ctx.neidentseq()).forEach(identifier => {
                this.registerTerminal(identifier, declarationType, getType(ctx.typeid()));
            });
        } else if (ctx.CHANNEL()) {
            collectNeidentseq(ctx.neidentseq()).forEach(identifier => {
                this.registerTerminal(identifier, DeclarationType.Channel);
            });
        } else if (ctx.TYPE()) {
            this.registerTerminal(ctx.IDENT(), DeclarationType.Type);
        } else if (ctx.FUN()) {
            const parameters = collectTypeidseq(ctx.typeidseq());
            this.registerTerminalWithParameters(ctx.IDENT(), DeclarationType.Fun, parameters, getType(ctx.typeid()));
        } else if (ctx.EVENT() || ctx.PREDICATE() || ctx.TABLE() || ctx.DEFINE()) {
            const declarationType =
                ctx.EVENT() ? DeclarationType.Event :
                    (ctx.PREDICATE() ? DeclarationType.Predicate :
                        (ctx.TABLE() ? DeclarationType.Table : DeclarationType.Define));
            const parameters = collectTypeidseq(ctx.typeidseq());
            this.registerTerminalWithParameters(ctx.IDENT(), declarationType, parameters);

            if (ctx.DEFINE()) {
                this.withContext(ctx, () => {
                    parameters.forEach(identifier => {
                        this.registerTerminal(identifier, DeclarationType.DefineParameter);
                    });
                });
            }
        } else if (ctx.EXPAND()) {
            const parameters = collectTypeidseq(ctx.typeidseq());
            parameters.forEach(identifier => {
                this.registerTerminal(identifier, DeclarationType.ExpandParameter);
            });
        } else if (ctx.LET() || ctx.LETFUN()) {
            const declarationType = ctx.LET() ? DeclarationType.Let : DeclarationType.LetFun;
            const parameters = collecMayfailvartypeseq(ctx.mayfailvartypeseq());
            this.registerTerminalWithNamedParameters(ctx.IDENT(), declarationType, parameters);
            this.withContext(ctx, () => {
                parameters.forEach(typedTerminal => {
                    this.registerTypedTerminal(typedTerminal, DeclarationType.Parameter);
                });
            });
        } else if (ctx.REDUCTION()) {
            this.withContext(ctx, () => {
                collectTreduc(ctx.treduc()).forEach(typedTerminal => {
                    this.registerTypedTerminal(typedTerminal, DeclarationType.Parameter);
                });
            });
        } else if (ctx.EQUATION()) {
            this.withContext(ctx, () => {
                collectEqlist(ctx.eqlist()).forEach(typedTerminal => {
                    this.registerTypedTerminal(typedTerminal, DeclarationType.Parameter);
                });
            });
        } else if (ctx.NOUNIF() || ctx.SELECT() || ctx.QUERY() || ctx.NONINTERF() || ctx.NOT() || ctx.lemma()) {
            this.withContext(ctx, () => {
                collectNevartype(ctx.nevartype()).forEach(typedTerminal => {
                    this.registerTypedTerminal(typedTerminal, DeclarationType.Parameter);
                });
            });
        } else if (ctx.ELIMTRUE()) {
            this.withContext(ctx, () => {
                collectNemayfailvartypeseq(ctx.nemayfailvartypeseq()).forEach(typedTerminal => {
                    this.registerTypedTerminal(typedTerminal, DeclarationType.Parameter);
                });
            });
        }

        return this.visitChildren(ctx);
    };

    public visitTreducmayfail = (ctx: TreducmayfailContext) => {
        this.withContext(ctx, () => {
            collectForallmayfailvartype(ctx.forallmayfailvartype()).forEach(typedTerminal => {
                this.registerTypedTerminal(typedTerminal, DeclarationType.Parameter);
            });
        });

        return this.visitChildren(ctx);
    };

    public visitTprocess = (ctx: TprocessContext) => {
        return this.withContext(ctx, () => {
            if (ctx.LET() || ctx.IN()) {
                collectTPattern(ctx.tpattern()).forEach(typedTerminal => {
                    this.registerTypedTerminal(typedTerminal, DeclarationType.Variable);
                });

                if (ctx.LET()) {
                    collectNevartype(ctx.nevartype()).forEach(typedTerminal => {
                        this.registerTypedTerminal(typedTerminal, DeclarationType.Variable);
                    });
                }
            } else if (ctx.GET()) {
                collectTPatternSeq(ctx.tpatternseq()).forEach(typedTerminal => {
                    this.registerTypedTerminal(typedTerminal, DeclarationType.Variable);
                });
            } else if (ctx.NEW() || ctx.RANDOM()) {
                const type = getType(ctx.typeid());
                this.registerTerminal(ctx.IDENT()[0], DeclarationType.Variable, type);
            } else if (ctx.LEFTARROW()) {
                const typedTerminal = collectBasicpattern(ctx.basicpattern());
                this.registerTypedTerminal(typedTerminal, DeclarationType.Variable);
            }

            return this.visitChildren(ctx);
        });
    };

    private registerTerminal(identifier: TerminalNode | undefined, declaration: DeclarationType, type?: ParseTree) {
        if (!identifier) {
            return;
        }

        this.symbolTable.addSymbol({
            node: identifier,
            declaration,
            type,
            context: this.context
        });
    }

    private registerTypedTerminal(identifier: TypedTerminal | undefined, declaration: DeclarationType) {
        if (!identifier) {
            return;
        }

        this.symbolTable.addSymbol({
            node: identifier.terminal,
            declaration,
            type: identifier.type,
            context: this.context
        });
    }

    private registerTerminalWithParameters(identifier: TerminalNode | undefined, declaration: DeclarationType, parameters: (ParseTree | undefined)[], type?: ParseTree) {
        if (!identifier) {
            return;
        }

        this.symbolTable.addSymbol({
            node: identifier,
            declaration,
            type,
            parameters: parameters.map(parameter => parameter ? ({node: parameter}) : undefined),
            context: this.context
        });
    }

    private registerTerminalWithNamedParameters(identifier: TerminalNode | undefined, declaration: DeclarationType, parameters: (TypedTerminal|undefined)[], type?: ParseTree) {
        if (!identifier) {
            return;
        }

        this.symbolTable.addSymbol({
            node: identifier,
            declaration,
            type,
            parameters: parameters.map(parameter => parameter ? ({node: parameter.terminal, type: parameter.type}) : undefined),
            context: this.context
        });
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

export type ProverifSymbolParameter = {
    node: ParseTree
    type?: ParseTree
}

export type ProverifSymbol = {
    node: TerminalNode
    declaration: DeclarationType
    type?: ParseTree
    parameters?: (ProverifSymbolParameter | undefined)[]
    context?: ParseTree
}

export class ProverifSymbolTable {
    private symbols: ProverifSymbol[] = [];

    public addSymbol(symbol: ProverifSymbol) {
        this.symbols.push(symbol);
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

