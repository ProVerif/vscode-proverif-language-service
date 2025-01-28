import {AbstractParseTreeVisitor, ParseTree} from "antlr4ts/tree";
import {ProverifParserVisitor} from "../parser/ProverifParserVisitor";
import {
    AllContext,
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
} from "../parser/ProverifParser";
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
    collectOptions,
    collectSingleIdentifiers,
    collectTPattern,
    collectTPatternSeq,
    collectTreducEquations,
    collectTypeidseq,
    getType,
    TypedTerminal
} from "./ident_collectors";
import {ParserRuleContext} from "antlr4ts/ParserRuleContext";
import {CommonTokenStream} from "antlr4ts";
import {ProverifLexer} from "../parser/ProverifLexer";


export type CreateSymbolTableResult = {
    symbolTable: ProverifSymbolTable
}

export const createSymbolTable = (tokenStream: CommonTokenStream, context: ParseTree): CreateSymbolTableResult => {
    const symbolTableVisitor = new SymbolTableVisitor(tokenStream);
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
    Reduc = 'reduc',
    Define = 'define',
    DefineParameter = 'define-parameter',
    Expand = 'expand',
    ExpandParameter = 'expand-parameter',
}

class SymbolTableVisitor extends AbstractParseTreeVisitor<ProverifSymbolTable> implements ProverifParserVisitor<ProverifSymbolTable> {
    private readonly symbolTable = new ProverifSymbolTable();
    private context: undefined | ParseTree = undefined;

    constructor(private tokenStream: CommonTokenStream) {
        super();
    }

    protected defaultResult(): ProverifSymbolTable {
        return this.symbolTable;
    }

    public visitLib = (ctx: LibContext) => {
        this.symbolTable.setPublicContext(ctx);

        return this.withContext(ctx, () => {
            const libs = ctx.lib();

            if (ctx.CONST() || ctx.FREE()) {
                const declarationType = ctx.CONST() ? DeclarationType.Const : DeclarationType.Free;
                const terminalNodes = collectNeidentseq(() => ctx.neidentseq());
                const type = getType(() => ctx.typeid());
                this.registerTerminals(terminalNodes, declarationType, type);
            } else if (ctx.CHANNEL()) {
                const terminalNodes = collectNeidentseq(() => ctx.neidentseq());
                this.registerTerminals(terminalNodes, DeclarationType.Channel);
            } else if (ctx.TYPE()) {
                const identifiers = collectSingleIdentifiers(() => ctx.IDENT());
                this.registerTerminals(identifiers, DeclarationType.Type);
            } else if (ctx.FUN()) {
                const parameters = collectTypeidseq(() => ctx.typeidseq());
                const identifier = collectIdentifier(() => ctx.IDENT());
                const type = getType(() => ctx.typeid());
                const options = collectOptions(() => ctx.options_());
                this.registerTerminalWithParameters(ctx.FUN(), identifier, DeclarationType.Fun, parameters, type, options);
                this.withContext(ctx, () => this.visitInner(() => ctx.treducmayfail()));
            } else if (ctx.EVENT() || ctx.PREDICATE() || ctx.TABLE()) {
                const identifier = collectIdentifier(() => ctx.IDENT());
                const declarationType =
                    ctx.EVENT() ? DeclarationType.Event :
                        (ctx.PREDICATE() ? DeclarationType.Predicate : DeclarationType.Table);
                const parameters = collectTypeidseq(() => ctx.typeidseq());
                this.registerTerminalWithParameters(ctx.EVENT() || ctx.PREDICATE() || ctx.TABLE(), identifier, declarationType, parameters);
            } else if (ctx.LET() || ctx.LETFUN()) {
                const declarationType = ctx.LET() ? DeclarationType.Let : DeclarationType.LetFun;
                const parameters = collecMayfailvartypeseq(() => ctx.mayfailvartypeseq());
                const identifier = collectIdentifier(() => ctx.IDENT());
                this.registerTerminalWithNamedParameters(ctx.LET() || ctx.LETFUN(), identifier, declarationType, parameters);
                this.withContext(ctx, () => {
                    this.registerTypedTerminals(parameters, DeclarationType.Parameter);
                    const inner = ctx.LET() ? () => ctx.tprocess() : () => ctx.pterm();
                    return this.visitInner(inner);
                });
            } else if (ctx.REDUCTION()) {
                this.visitInner(() => ctx.treduc());
                const equations = collectTreducEquations(() => ctx.treduc());
                const options = collectOptions(() => ctx.options_());
                equations.forEach(equation => {
                    this.registerTerminalWithParameters(ctx.FUN(), equation.terminal, DeclarationType.Reduc, equation.parameters, equation.type, options);
                })
            } else if (ctx.EQUATION()) {
                this.visitInner(() => ctx.eqlist());
            } else if (ctx.NOUNIF() || ctx.SELECT()) {
                this.registerNevartypeParameters(() => ctx.nevartype());
                this.visitInner(() => ctx.tfnebindingseq());
            } else if (ctx.QUERY()) {
                this.registerNevartypeParameters(() => ctx.nevartype());
                this.visitInner(() => ctx.tqueryseq());
            } else if (ctx.NONINTERF()) {
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
            }   else if (ctx.CLAUSES()) {
                this.visitInner(() => ctx.tclauses());
            } else if (ctx.DEFINE()) {
                const identifier = collectIdentifier(() => ctx.IDENT());
                const declarationType = DeclarationType.Define;
                const parameters = collectTypeidseq(() => ctx.typeidseq());
                this.registerTerminalWithParameters(ctx.DEFINE(), identifier, declarationType, parameters);

                this.withContext(ctx, () => {
                    this.registerTerminals(parameters, DeclarationType.DefineParameter);
                    return libs.length > 0 ? this.visit(libs[0]) : this.defaultResult();
                });

                return libs.length > 1 ? this.visit(libs[1]) : this.defaultResult();
            } else if (ctx.EXPAND()) {
                const parameters = collectTypeidseq(() => ctx.typeidseq());
                this.registerTerminals(parameters, DeclarationType.ExpandParameter);
            }

            return libs.length > 0 ? this.visit(libs[0]) : this.defaultResult();
        });
    };

    public visitTclauses = (ctx: TclausesContext) => {
        this.withContext(ctx, () => {
            const typedTerminals = collectForallmayfailvartype(() => ctx.forallmayfailvartype());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Parameter);

            return this.visit(ctx.tclause());
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

            return this.visit(ctx.extended_equation());
        });

        return this.visitInner(() => ctx.treducotherwise());
    };

    public visitTreduc = (ctx: TreducContext) => {
        this.collectExtendedEquation(ctx);

        return this.visitInner(() => ctx.treduc());
    };

    public visitEqlist = (ctx: EqlistContext) => {
        this.collectExtendedEquation(ctx);

        return this.visitInner(() => ctx.eqlist());
    };

    private collectExtendedEquation = (ctx: TreducContext | EqlistContext) => {
        return this.withContext(ctx, () => {
            const typedTerminals = collectForallvartype(() => ctx.forallvartype());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Parameter);

            return this.visit(ctx.extended_equation());
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

            this.visitInners(() => ctx.tprocess());
            this.visitInner(() => ctx.opttprocess());
            this.visitInner(() => ctx.optinprocess());
            this.visitInner(() => ctx.optelseprocess());

            return this.defaultResult();
        });
    };

    public visitPterm = (ctx: PtermContext) => {
        return this.withContext(ctx, () => {
            this.collectProcessStyleTerms(ctx, false);

            this.visitInners(() => ctx.pterm());
            this.visitInner(() => ctx.optelseterm());

            return this.defaultResult();
        });
    };

    private collectProcessStyleTerms = <Variant extends boolean>(ctx: (Variant extends true ? TprocessContext : PtermContext), isTProcess: Variant) => {
        if (ctx.LET() && ctx.EQUAL()) {
            // TODO: derive type from pterm
            // TODO: refactor from collecting identifiers to instead structurally parsing & resolving references
            const typedTerminals = collectTPattern(() => ctx.tpattern());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Variable);
        } else if (ctx.GET()) {
            // TODO: derive type depending on argument position of TPattern in table reference
            // TODO: refactor from collecting identifiers to instead structurally parsing & resolving references
            const typedTerminals = collectTPatternSeq(() => ctx.tpatternseq());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Variable);
        } else if (ctx.LEFTARROW()) {
            // TODO: see above, slightly easier case (see grammar)
            const typedTerminals = collectBasicpattern(() => ctx.basicpattern());
            this.registerTypedTerminals(typedTerminals, DeclarationType.Variable);
        } else if (ctx.LET() && ctx.SUCHTHAT()) {
            const nevartypeTerminals = collectNevartype(() => ctx.nevartype());
            this.registerTypedTerminals(nevartypeTerminals, DeclarationType.Variable);
        } else if (ctx.NEW() || ctx.RANDOM()) {
            const identifiers = isTProcess ?
                collectIdentifiers(() => (ctx as TprocessContext).IDENT()) :
                collectSingleIdentifiers(() => (ctx as PtermContext).IDENT());
            const type = getType(() => ctx.typeid());
            this.registerTerminals(identifiers, DeclarationType.Variable, type);
        }
    };

    public visitGterm = (ctx: GtermContext) => {
        return this.withContext(ctx, () => {
            if (ctx.NEW() || ctx.LET() || ctx.LEFTARROW()) {
                const identifiers = collectSingleIdentifiers(() => ctx.IDENT());
                this.registerTerminals(identifiers, DeclarationType.Variable);
            }

            return this.visitInners(() => ctx.gterm());
        });
    };

    public visitGformat = (ctx: GformatContext) => {
        return this.withContext(ctx, () => {
            if (ctx.NEW() || ctx.STAR() || ctx.LET() || ctx.LEFTARROW()) {
                const identifiers = collectSingleIdentifiers(() => ctx.IDENT());
                this.registerTerminals(identifiers, DeclarationType.Variable);
            }

            return this.visitInners(() => ctx.gformat());
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

    private registerTerminalWithParameters(root: TerminalNode | undefined, identifier: TerminalNode | undefined, declaration: DeclarationType, parameters: (ParseTree | undefined)[], type?: ParseTree, options?: string[]) {
        if (!identifier) {
            return;
        }

        const docComment = this.getDocComment(root);
        this.symbolTable.addSymbol({
            node: identifier,
            declaration,
            type,
            options,
            parameters: parameters.map(parameter => parameter ? ({node: parameter}) : undefined),
            docComment,
            context: this.context
        });
    }

    private registerTerminalWithNamedParameters(root: TerminalNode | undefined, identifier: TerminalNode | undefined, declaration: DeclarationType, parameters: (TypedTerminal | undefined)[], type?: ParseTree) {
        if (!identifier) {
            return;
        }

        const docComment = this.getDocComment(root);
        this.symbolTable.addSymbol({
            node: identifier,
            declaration,
            type,
            parameters: parameters.map(parameter => parameter ? ({
                node: parameter.terminal,
                type: parameter.type
            }) : undefined),
            docComment,
            context: this.context
        });
    }

    private getDocComment(root: TerminalNode | undefined) {
        if (!root) {
            return undefined;
        }

        const docCandidates = this.tokenStream.getHiddenTokensToLeft(root.symbol.tokenIndex);
        let docCandidate = docCandidates.pop();
        while (docCandidate) {
            if (docCandidate.type === ProverifLexer.DelimitedComment) {
                // check doccomment: (** **)
                if (docCandidate.text?.startsWith("(** ") && docCandidate.text.endsWith("**)")) {
                    break;
                }
            }

            if (docCandidate.type !== ProverifLexer.WS) {
                docCandidate = undefined;
                break;
            }

            docCandidate = docCandidates.pop();
        }

        return docCandidate?.text;
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

    private visitInner = (getInner: () => ParserRuleContext | undefined) => {
        const inner = getInner();
        return inner ? this.visit(inner) : this.defaultResult();
    };

    private visitInners = (getInner: () => ParserRuleContext[]) => {
        getInner().forEach(inner => this.visit(inner));
        return this.defaultResult();
    };
}

export type ProverifSymbolParameter = {
    node: ParseTree
    type?: ParseTree
}

export type ProverifSymbol = {
    node: TerminalNode
    declaration: DeclarationType
    type?: ParseTree
    options?: string[],
    parameters?: (ProverifSymbolParameter | undefined)[]
    docComment?: string
    context?: ParseTree
}

export class ProverifSymbolTable {
    private symbols: ProverifSymbol[] = [];
    private publicContext: LibContext | undefined;

    public addSymbol(symbol: ProverifSymbol) {
        this.symbols.push(symbol);
    }

    public setPublicContext(publicContext: LibContext) {
        this.publicContext = publicContext;
    }

    public findClosestSymbol(text: string, context: ParseTree|undefined): ProverifSymbol | undefined {
        return this.findClosestSymbolInternal(text, context ?? this.publicContext);
    }

    public getSymbols(): ProverifSymbol[] {
        return this.symbols;
    }

    private findClosestSymbolInternal(name: string, context: ParseTree|undefined): ProverifSymbol | undefined {
        if (!context) {
            return undefined;
        }

        const symbolsOfContext = this.symbols.filter(symbol => symbol.context === context);
        const matchingSymbol = symbolsOfContext.find(symbol => symbol.node.text === name);
        if (matchingSymbol) {
            return matchingSymbol;
        }

        // if in tprocess, check whether defined in library
        if (context instanceof TprocessContext && context.parent instanceof AllContext) {
            return this.findClosestSymbolInternal(name, this.publicContext);
        }

        // if in OTHERWISE, then jump directly to the real parent, not the previous clauses
        if (context instanceof TreducotherwiseContext) {
            let realParent = context.parent;
            while (realParent instanceof TreducotherwiseContext || realParent instanceof TreducmayfailContext) {
                realParent = realParent.parent;
            }

            return this.findClosestSymbolInternal(name, realParent);
        }

        return this.findClosestSymbolInternal(name, context.parent);
    }
}

