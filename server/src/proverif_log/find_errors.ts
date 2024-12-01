import {DiagnosticSeverity, LocationLink, Position} from "vscode-languageserver";
import {Diagnostic, Range} from "vscode-languageserver/node";
import {TextDocument} from "vscode-languageserver-textdocument";
import {findAllOccurrencesInDocument} from "./scanner";

const UNPROVEN_LEMMA = /(PARTIAL RESULT.+(cannot be proved|false).+)/g;

export const findFalseLemmas = async (document: TextDocument): Promise<Diagnostic[]> => {
    const results = findAllOccurrencesInDocument(document, UNPROVEN_LEMMA);
    return results.map(match => {return Diagnostic.create(match, "Unproven lemma", DiagnosticSeverity.Error);});
};