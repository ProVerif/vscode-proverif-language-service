import {join, sep} from "path";
import {promises as fsPromises} from "fs";
import {tmpdir} from "os";

export const asTempFile = async <T>(path: string, content: string, appendFileEnding: undefined | string, fn: (filePath: string) => Promise<T>) => {
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

export const isProverifFile = (path: string) => {
    return path.endsWith(".pv") || path.endsWith(".pvl") || path.endsWith(".pvc");
};
export const readFile = async <T>(path: string) => {
    const buffer = await fsPromises.readFile(path);
    return buffer.toString();
};
