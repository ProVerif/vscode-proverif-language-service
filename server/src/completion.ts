import {
    CompletionItem,
    Position,
    TextDocumentIdentifier
} from "vscode-languageserver";
import {DocumentManagerInterface} from "./document_manager";
import {getPreviousContextTokens} from "./parseTree/get_content_token";
import {ProverifParser} from "./parser-proverif/ProverifParser";
import {CompletionItemKind} from "vscode-languageserver-types";

export const getCompletion = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<CompletionItem[] | undefined> => {
    const parseResult = await documentManager.getParseResult(identifier);
    if (!parseResult.parser || !parseResult.parserTree) {
        return undefined;
    }

    const contextTokens = getPreviousContextTokens(parseResult.parser.inputStream, position);
    if (!contextTokens) {
        return undefined;
    }

    const tokensCount = contextTokens.length;
    if (contextTokens.length > 0 && contextTokens[tokensCount-1].type === ProverifParser.SET) {
        return Object.getOwnPropertyNames(setRules).map(label => ({ label, kind: CompletionItemKind.Keyword}));
    }

    if (contextTokens.length > 2 && contextTokens[tokensCount-3].type === ProverifParser.SET && contextTokens[tokensCount-1].type === ProverifParser.EQUAL) {
        const ruleName = contextTokens[tokensCount-2].text;
        if (ruleName && ruleName in setRules) {
            return setRules[ruleName].map(label => ({ label, kind: CompletionItemKind.Value }));
        }
    }

    return undefined;
};

const setRules: { [key in string]: string[] } = {
    /* Attacker configuration settings. */
    ignoreTypes: ["true", "false"],
    attacker: ["active", "passive"],
    keyCompromise: ["none", "approx", "strict"],
    privateCommOnPublicTerms: ["true", "false"],

    /* Simplification of processes */
    simplifyProcess: ["true", "false", "interactive"],
    rejectChoiceTrueFalse: ["true", "false"],
    rejectNoSimplif: ["true", "false"],

    /* Verification of predicate definitions */
    predicatesImplementable: ["check", "nocheck"],

    /* Patterns with diff or choice */
    allowDiffPatterns: ["false", "true"],

    /* Induction and lemma settings */
    inductionQueries: ["false", "true"],
    inductionLemmas: ["false", "true"],
    saturationApplication: ["instantiate", "full", "none", "discard"],
    verificationApplication: ["full", "none", "discard", "instantiate"],

    /* Precision, performance, and termination settings */
    preciseActions: ["false", "true", "trueWithoutArgsInNames"],
    movenew: ["false", "true"],
    movelet: ["true", "false"],
    maxDepth: ["none"],
    maxHyp: ["none"],
    selFun: ["TermMaxsize", "Term", "NounifsetMaxsize", "Nounifset"],
    stopTerm: ["true", "false"],
    redundancyElim: ["best", "simple", "no"],
    redundantHypElim: ["beginOnly", "false", "true"],
    removeEventsForLemma: ["false", "true"],
    simpEqAll: ["false", "true"],
    eqInNames: ["false", "true"],
    preciseLetExpand: ["true", "false"],
    expandSimplifyIfCst: ["true", "false"],
    nounifIgnoreAFewTimes: ["none", "auto", "all"],
    nounifIgnoreNtimes: [],
    symbOrder: [],
    featureFuns: ["true", "false"],
    featureNames: ["false", "true"],
    featurePredicates: ["true", "false"],
    featureEvents: ["true", "false"],
    featureTables: ["true", "false"],
    featureDepth: ["false", "true"],
    featureWidth: ["false", "true"],

    /* attack reconstruction settings */
    simplifyDerivation: ["true", "false"],
    abbreviateDerivation: ["true", "false"],
    explainDerivation: ["true", "false"],
    reconstructTrace: ["true", "false"],
    unifyDerivation: ["true", "false"],
    reconstructDerivation: ["true", "false"],
    displayDerivation: ["true", "false"],
    traceBacktracking: ["true", "false"],

    /* swapping settings */
    interactiveSwapping: ["false", "true"],
    swapping: [],

    /* display settings */
    verboseLemmas: ["false", "true"],
    abbreviateClauses: ["true", "false"],
    removeUselessClausesBeforeDisplay: ["true", "false"],
    verboseEq: ["true", "false"],
    verboseDestructors: ["true", "false"],
    verboseTerm: ["true", "false"],
    verboseStatistics: ["false", "true"],
    verboseRules: ["false", "true"],
    verboseBase: ["false", "true"],
    verboseRedundant: ["false", "true"],
    verboseCompleted: ["false", "true"],
    verboseGoalReachable: ["true", "false"],
};

const createCompletionItem = (text: string): CompletionItem => {
    return {
        label: text,
        kind:CompletionItemKind.Keyword
    };
};

