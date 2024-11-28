import {DocumentManagerInterface, DocumentType} from "../document_manager";
import {LocationLink, Position, TextDocumentIdentifier} from "vscode-languageserver";
import {constructLocationLink, getDefinitionSymbolFromPosition} from "../proverif/definition_symbol";
import {getReferenceLocationLink} from "../proverif_log/get_reference_location_link";

export const getDefinitionLocations = async (identifier: TextDocumentIdentifier, position: Position, documentManager: DocumentManagerInterface): Promise<LocationLink[] | undefined> => {
    if (documentManager.getDocumentType(identifier) === DocumentType.ProVerif) {
        const definitionSymbol = await getDefinitionSymbolFromPosition(identifier, position, documentManager);
        if (!definitionSymbol) {
            return undefined;
        }

        const locationLink = constructLocationLink(definitionSymbol);
        if (!locationLink) {
            return undefined;
        }

        return [locationLink];
    }

    if (documentManager.getDocumentType(identifier) === DocumentType.ProVerifLog) {
        const locationLink = await getReferenceLocationLink(identifier, position, documentManager);
        if (!locationLink) {
            return undefined;
        }

        return [locationLink];
    }

    return undefined;
};

