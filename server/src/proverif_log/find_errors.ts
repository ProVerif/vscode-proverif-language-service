import {DiagnosticSeverity} from "vscode-languageserver";
import {Diagnostic} from "vscode-languageserver/node";
import {TextDocument} from "vscode-languageserver-textdocument";
import {findAllOccurrencesInDocument} from "./scanner";

const UNPROVEN_LEMMA = /((PARTIAL )?RESULT.+(is false|cannot be proved).+)/g;

export const findFalseLemmas = async (document: TextDocument): Promise<Diagnostic[]> => {
    const results = findAllOccurrencesInDocument(document, UNPROVEN_LEMMA);
    return results.map(match => {return Diagnostic.create(match, "Unproven lemma", DiagnosticSeverity.Error);});
};