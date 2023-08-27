import {AbstractParseTreeVisitor, ParseTree} from "antlr4ts/tree";
import {ScopedSymbol, SymbolTable, VariableSymbol} from "antlr4-c3";
import {ProverifParserVisitor} from "../parser-proverif/ProverifParserVisitor";
import {DocumentUri} from "vscode-languageserver-textdocument";
import {ChannelDeclarationContext, IdentifierContext, ProverifFileContext} from "../parser-proverif/ProverifParser";
import {LocationLink, TextDocumentIdentifier} from "vscode-languageserver";
import {getRange} from "../parseTree/get_range";

export type CreateSymbolTableResult = {
    symbolTable: SymbolTable
}

export const createSymbolTable = (identifier: TextDocumentIdentifier, context: ProverifFileContext): CreateSymbolTableResult => {
    const symbolTableVisitor = new SymbolTableVisitor(identifier.uri);
    return { symbolTable: symbolTableVisitor.visit(context) };
};

class SymbolTableVisitor extends AbstractParseTreeVisitor<SymbolTable> implements ProverifParserVisitor<SymbolTable> {
    constructor(
        public documentUri: DocumentUri,
        protected readonly symbolTable = new SymbolTable("", {}),
        protected scope = symbolTable.addNewSymbolOfType(ScopedSymbol, undefined)) {
        super();
    }

    protected defaultResult(): SymbolTable {
        return this.symbolTable;
    }

    visitChannelDeclaration = (ctx: ChannelDeclarationContext) => {
        ctx.identifierSequence()?.children?.forEach(identifier => {
            if (identifier instanceof IdentifierContext) {
                const symbol = this.symbolTable.addNewSymbolOfType(VariableSymbol, this.scope, identifier.text, undefined);
                this.registerDefinition(symbol, identifier, identifier.Identifier());
            }
        });

        return this.defaultResult();
    };

    protected registerDefinition(symbol: any, tree: ParseTree, definitionName: ParseTree) {
        const targetRange = getRange(tree);
        const targetSelectionRange = getRange(definitionName);

        if (targetRange && targetSelectionRange) {
            symbol.location = LocationLink.create(this.documentUri, targetRange, targetSelectionRange);
        }
    }

    /**
     visitFunctionDeclaration = (ctx: FunctionDeclarationContext) => {
     return this.withScope(ctx, RoutineSymbol, [ctx.identifier().text], () => this.visitChildren(ctx));
     };

     protected withScope<T>(tree: ParseTree, type: new (...args: any[]) => ScopedSymbol, args: any[], action: () => T): T {
     const scope = this.symbolTable.addNewSymbolOfType(type, this.scope, ...args);
     scope.context = tree;
     this.scope = scope;
     try {
     this.registerDefinition(this.scope, definition, definitionName);
     return action();
     } finally {
     this.scope = scope.parent as ScopedSymbol;
     }
     }
     **/
}

