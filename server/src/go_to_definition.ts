import {BaseSymbol, ScopedSymbol, SymbolTable} from "antlr4-c3";
import {ParseTree} from "antlr4ts/tree";
import {ParseResult} from "./tasks";
import {LocationLink, Position} from "vscode-languageserver";
import {getTokenPosition} from "./parseTree/compute_token_position";
import {getRange} from "./parseTree/get_range";
import {DefinitionLink} from "vscode-languageserver-protocol";

const getLocation = async (name: string, scope: BaseSymbol): Promise<LocationLink | undefined> => {
    if (scope instanceof ScopedSymbol) {
        const allSymbols = await scope.getSymbolsOfType(BaseSymbol);
        const symbol = allSymbols.find(s => s.name === name);
        if (symbol && "location" in symbol) {
            return symbol.location as LocationLink;
        }
    }

    return scope.parent ? getLocation(name, scope.parent) : undefined;
};

const getScope = async (context: ParseTree, symbolTable: SymbolTable): Promise<BaseSymbol | undefined> => {
    const scope = await symbolTable.symbolWithContext(context);
    if (scope) {
        return scope;
    }

    return context.parent ? getScope(context.parent, symbolTable) : undefined;
};

export const getDefinitionLink = async (parseResult: ParseResult, position: Position): Promise<DefinitionLink | undefined> => {
    const caretPosition = {line: position.line + 1, column: position.character};
    const tokenPosition = getTokenPosition(parseResult.proverifFileContext, parseResult.parser.inputStream, caretPosition);
    if (!tokenPosition) {
        return undefined;
    }

    const scope = await getScope(tokenPosition.context, parseResult.symbolTable);
    if (!scope) {
        return undefined;
    }

    const location = await getLocation(tokenPosition.context.text, scope);
    if (!location) {
        return undefined;
    }

    const originSelectionRange = getRange(tokenPosition.context);
    return {...location, originSelectionRange};
};