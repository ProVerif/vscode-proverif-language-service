import {AbstractParseTreeVisitor, ParseTree} from "antlr4ts/tree";
import {ProverifParserVisitor} from "../parser-proverif/ProverifParserVisitor";
import {
    EqlistContext,
    Extended_equationContext,
    GformatContext,
    GtermContext,
    LibContext,
    NevartypeContext,
    PtermContext,
    TclausesContext,
    TfnebindingseqContext,
    TprocessContext,
    TreducContext,
    TreducmayfailContext,
    TreducotherwiseContext
} from "../parser-proverif/ProverifParser";
import {TerminalNode} from "antlr4ts/tree/TerminalNode";
import {
    collecMayfailvartypeseq,
    collectBasicpattern,
    collectForallmayfailvartype,
    collectForallvartype,
    collectIdentifier,
    collectIdentifiers,
    collectNeidentseq,
    collectNemayfailvartypeseq,
    collectNevartype,
    collectSingleIdentifiers,
    collectTPattern,
    collectTPatternSeq,
    collectTypeidseq,
    getType,
    TypedTerminal
} from "./ident_collectors";
import {ParserRuleContext} from "antlr4ts/ParserRuleContext";


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
    Predicate = 'pred',
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
        return this.withContext(ctx, () => {
            const libs = ctx.lib();

            if (ctx.CONST() || ctx.FREE()) {
                const declarationType = ctx.CONST() ? DeclarationType.Const : DeclarationType.Free;
                const terminalNodes = collectNeidentseq(() => ctx.neidentseq());
                this.registerTerminals(terminalNodes, declarationType, getType(() => ctx.typeid()));
            } else if (ctx.CHANNEL()) {
                const terminalNodes = collectNeidentseq(() => ctx.neidentseq());
                this.registerTerminals(terminalNodes, DeclarationType.Channel);
            } else if (ctx.TYPE()) {
                const identifiers = collectSingleIdentifiers(() => ctx.IDENT());
                this.registerTerminals(identifiers, DeclarationType.Type);
            } else if (ctx.FUN()) {
                const parameters = collectTypeidseq(() => ctx.typeidseq());
                const identifier = collectIdentifier(() => ctx.IDENT());
                this.registerTerminalWithParameters(identifier, DeclarationType.Fun, parameters, getType(() => ctx.typeid()));
            } else if (ctx.EVENT() || ctx.PREDICATE() || ctx.TABLE()) {
                const identifier = collectIdentifier(() => ctx.IDENT());
                const declarationType =
                    ctx.EVENT() ? DeclarationType.Event :
                        (ctx.PREDICATE() ? DeclarationType.Predicate : DeclarationType.Table);
                const parameters = collectTypeidseq(() => ctx.typeidseq());
                this.registerTerminalWithParameters(identifier, declarationType, parameters);
            } else if (ctx.LET() || ctx.LETFUN()) {
                const declarationType = ctx.LET() ? DeclarationType.Let : DeclarationType.LetFun;
                const parameters = collecMayfailvartypeseq(() => ctx.mayfailvartypeseq());
                const identifier = collectIdentifier(() => ctx.IDENT());
                this.registerTerminalWithNamedParameters(identifier, declarationType, parameters);
                this.withContext(ctx, () => {
                    this.registerTypedTerminals(parameters, DeclarationType.Parameter);
                    const inner = ctx.LET() ? () => ctx.tprocess() : () => ctx.pterm();
                    return this.visitInner(inner);
                });
            } else if (ctx.REDUCTION()) {
                this.visitInner(() => ctx.treduc());
            } else if (ctx.EQUATION()) {
                this.visitInner(() => ctx.eqlist());
            } else if (ctx.NOUNIF() || ctx.SELECT()) {
                this.registerNevartypeParameters(() => ctx.nevartype());
                this.visitInner(() => ctx.tfnebindingseq());
            } else if (ctx.QUERY()) {
                this.registerNevartypeParameters(() => ctx.nevartype());
                this.visitInner(() => ctx.tqueryseq());
            } else if (ctx.NONINTERF() || ctx.NOT() || ctx.lemma()) {
                this.registerNevartypeParameters(() => ctx.nevartype());
                this.visitInner(() => ctx.niseq());
            } else if (ctx.NOT()) {
                this.registerNevartypeParameters(() => ctx.nevartype());
                this.visitInner(() => ctx.gterm());
            } else if (ctx.lemma()) {
                this.registerNevartypeParameters(() => ctx.nevartype());
                this.visitInner(() => ctx.tlemmaseq());
            } else if (ctx.ELIMTRUE()) {
                const typedTerminals = collectNemayfailvartypeseq(() => ctx.nemayfailvartypeseq());
                this.registerTypedTerminals(typedTerminals, DeclarationType.Parameter);
                this.visitInner(() => ctx.term());
            } else if (ctx.DEFINE()) {
                const identifier = collectIdentifier(() => ctx.IDENT());
                const declarationType = DeclarationType.Define;
                const parameters = collectTypeidseq(() => ctx.typeidseq());
                this.registerTerminalWithParameters(identifier, declarationType, parameters);

                this.withContext(ctx, () => {
                    this.registerTerminals(parameters, DeclarationType.DefineParameter);
                    return libs.length > 0 ? this.visitChildren(libs[0]) : this.defaultResult();
                });

                return libs.length > 1 ? this.visitChildren(libs[1]) : this.defaultResult();
            } else if (ctx.EXPAND()) {
                const parameters = collectTypeidseq(() => ctx.typeidseq());
                this.registerTerminals(parameters, DeclarationType.ExpandParameter);
            }

            return libs.length > 0 ? this.visitChildren(libs[0]) : this.defaultResult();
        });
    };

    private visitInner = (getInner: () => ParserRuleContext | undefined) => {
        const inner = getInner();
        return inner ? this.visitChildren(inner) : this.defaultResult();
    };

    public visitTclauses = (ctx: TclausesContext) => {
        this.withContext(ctx, () => {
            const typedTerminals = collectForallmayfailvartype(() => ctx.forallmayfailvartype());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Parameter);

            return this.visitChildren(ctx.tclause());
        });

        return this.visitInner(() => ctx.tclauses());
    };

    public visitTreducmayfail = (ctx: TreducmayfailContext) => {
        return this.collectMayFailExtendedEquation(ctx);
    };

    public visitTreducotherwise = (ctx: TreducotherwiseContext) => {
        return this.collectMayFailExtendedEquation(ctx);
    };

    private collectMayFailExtendedEquation = (ctx: TreducotherwiseContext | TreducmayfailContext) => {
        this.withContext(ctx, () => {
            const typedTerminals = collectForallmayfailvartype(() => ctx.forallmayfailvartype());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Parameter);

            return this.visitChildren(ctx.extended_equation());
        });

        return this.visitInner(() => ctx.treducotherwise())
    };

    public visitTreduc = (ctx: TreducContext) => {
        this.collectExtendedEquation(ctx);

        return this.visitInner(() => ctx.treduc())
    };

    public visitEqlist = (ctx: EqlistContext) => {
        this.collectExtendedEquation(ctx);

        return this.visitInner(() => ctx.eqlist())
    };

    private collectExtendedEquation = (ctx: TreducContext | EqlistContext) => {
        return this.withContext(ctx, () => {
            const typedTerminals = collectForallvartype(() => ctx.forallvartype());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Parameter);

            return this.visitChildren(ctx.extended_equation());
        });
    };

    public visitTfnebindingseq = (ctx: TfnebindingseqContext) => {
        return this.collectInlineDefinitions(ctx);
    };

    public visitExtended_equation = (ctx: Extended_equationContext) => {
        return this.collectInlineDefinitions(ctx);
    };

    private collectInlineDefinitions = (ctx: Extended_equationContext | TfnebindingseqContext) => {
        return this.withContext(ctx, () => {
            if (ctx.LET() || ctx.LEFTARROW()) {
                const identifiers = collectSingleIdentifiers(() => ctx.IDENT());
                this.registerTerminals(identifiers, DeclarationType.Variable);
            }

            return this.visitChildren(ctx);
        });
    };

    public visitTprocess = (ctx: TprocessContext) => {
        return this.withContext(ctx, () => {
            if (ctx.IN()) {
                const typedTerminals = collectTPattern(() => ctx.tpattern());
                this.registerTypedTerminals(typedTerminals, DeclarationType.Variable);
            }

            this.collectProcessStyleTerms(ctx, true);
            return this.visitChildren(ctx);
        });
    };

    public visitPterm = (ctx: PtermContext) => {
        return this.withContext(ctx, () => {
            this.collectProcessStyleTerms(ctx, false);
            return this.visitChildren(ctx);
        });
    };

    private collectProcessStyleTerms = <Variant extends boolean>(ctx: (Variant extends true ? TprocessContext : PtermContext), isTProcess: Variant) => {
        if (ctx.LET()) {
            const typedTerminals = collectTPattern(() => ctx.tpattern());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Variable);

            const nevartypeTerminals = collectNevartype(() => ctx.nevartype());
            this.registerTypedTerminals(nevartypeTerminals, DeclarationType.Variable);
        } else if (ctx.GET()) {
            const typedTerminals = collectTPatternSeq(() => ctx.tpatternseq());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Variable);
        } else if (ctx.NEW() || ctx.RANDOM()) {
            const identifiers = isTProcess ?
                collectIdentifiers(() => (ctx as TprocessContext).IDENT()) :
                collectSingleIdentifiers(() => (ctx as PtermContext).IDENT());
            const type = getType(() => ctx.typeid());
            this.registerTerminals(identifiers, DeclarationType.Variable, type);
        } else if (ctx.LEFTARROW()) {
            const typedTerminals = collectBasicpattern(() => ctx.basicpattern());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Variable);
        }
    };

    public visitGterm = (ctx: GtermContext) => {
        return this.withContext(ctx, () => {
            if (ctx.NEW() || ctx.LET() || ctx.LEFTARROW()) {
                const identifiers = collectSingleIdentifiers(() => ctx.IDENT());
                this.registerTerminals(identifiers, DeclarationType.Variable);
            }

            return this.visitChildren(ctx);
        });
    };

    public visitGformat = (ctx: GformatContext) => {
        return this.withContext(ctx, () => {
            if (ctx.NEW() || ctx.STAR() || ctx.LET() || ctx.LEFTARROW()) {
                const identifiers = collectSingleIdentifiers(() => ctx.IDENT());
                this.registerTerminals(identifiers, DeclarationType.Variable);
            }

            return this.visitChildren(ctx);
        });
    };

    private registerNevartypeParameters(getContext: () => NevartypeContext | undefined) {
        const typedTerminals = collectNevartype(getContext);
        this.registerTypedTerminals(typedTerminals, DeclarationType.Parameter);
    }

    private registerTerminals(identifiers: TerminalNode[], declaration: DeclarationType, type?: ParseTree) {
        identifiers.forEach(identifier => {
            this.symbolTable.addSymbol({
                node: identifier,
                declaration,
                type,
                context: this.context
            });
        });
    }

    private registerTypedTerminals(identifiers: TypedTerminal[], declaration: DeclarationType) {
        identifiers.forEach(identifier => {
            this.symbolTable.addSymbol({
                node: identifier.terminal,
                declaration,
                type: identifier.type,
                context: this.context
            });
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

    private registerTerminalWithNamedParameters(identifier: TerminalNode | undefined, declaration: DeclarationType, parameters: (TypedTerminal | undefined)[], type?: ParseTree) {
        if (!identifier) {
            return;
        }

        this.symbolTable.addSymbol({
            node: identifier,
            declaration,
            type,
            parameters: parameters.map(parameter => parameter ? ({
                node: parameter.terminal,
                type: parameter.type
            }) : undefined),
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

