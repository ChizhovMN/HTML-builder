console.clear();
const fs = require('fs/promises');
const path = require('path');

const copyPath = path.join(__dirname, 'files');
const pathToCopy = path.join(__dirname, 'new-files')

const recursiveDelete = async (dirPath) => {
    try {
        await fs.rm(dirPath, { recursive: true });
    } catch (e) {
        return
    }
}

const recursiveCopy = async (pathToFile, pathToCopy) => {
    try {
        await fs.mkdir(pathToCopy, { recursive: true });
        const files = await fs.readdir(pathToFile, { withFileTypes: true });
        for (const file of files) {
            const newFilePath = path.join(pathToFile, file.name);
            const newCopyPath = path.join(pathToCopy, file.name);
            if (file.isFile()) {
                await fs.copyFile(newFilePath, newCopyPath);
            }
            if (file.isDirectory()) {
                await recursiveCopy(newFilePath, newCopyPath)
            }
        }
    } catch (e) {
        console.error(e)
    }
}

async function refresh() {
    await recursiveDelete(pathToCopy);
    await recursiveCopy(copyPath, pathToCopy);
}
refresh();
