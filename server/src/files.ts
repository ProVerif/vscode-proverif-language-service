import {DocumentUri} from "vscode-languageserver-textdocument";
import {fileURLToPath} from "url";
import {join, sep} from "path";
import {promises as fsPromises} from "fs";
import {tmpdir} from "os";

export const asTempFile = async <T>(uri: DocumentUri, content: string, appendFileEnding: undefined | string, fn: (filePath: string) => Promise<T>) => {
    const path = fileURLToPath(uri);
    const filename = (path.split(sep).pop() || 'fallback.pv') + (appendFileEnding ?? '');

    const tempDirPath = await fsPromises.realpath(tmpdir()) + sep;
    const tempDir = await fsPromises.mkdtemp(tempDirPath);

    const tempFilePath = join(tempDir, filename);
    await fsPromises.writeFile(tempFilePath, content);

    try {
        return await fn(tempFilePath);
    } finally {
        await fsPromises.rm(tempDir, {recursive: true});
    }
};
