import {sep} from "path";

const LIB_ARGUMENT_PREFIX = '-lib ';
const LIB_FILE_ENDING = '.pvl';
const LIB_REGEX_MATCH = /\(\* +-lib (.+)\.pvl/g;
export const parseLibraryDependenciesNoValidate = (filePath: string, content: string) => {
    const expectedLocations = [];
    
    const folder = filePath.split(sep).slice(0, -1).join(sep);
    const matches = content.matchAll(LIB_REGEX_MATCH);
    for (const match of matches) {
        const expectedFilename = match[1] + LIB_FILE_ENDING;
        expectedLocations.push(folder + sep + expectedFilename);
    }

    return expectedLocations.map(expectedLocation => LIB_ARGUMENT_PREFIX + expectedLocation).join(" ");
};