console.clear()
const path = require('path');
const fs = require('fs');

const projectPath = path.join(__dirname, 'project-dist');
const projectPathAssets = path.join(projectPath, 'assets');
const projectIndexPath = path.join(projectPath, 'index.html');
const componentsFolderPath = path.join(__dirname, 'components');
const assets = path.join(__dirname, 'assets');


async function main(inputFilePath, components) {
    try {
        const readStream = fs.createReadStream(inputFilePath,
            { encoding: 'utf8' });
        let index;
        for await (const chunk of readStream) {
            index = chunk;
        }
        const files = await fs.promises.readdir(components, { withFileTypes: true });
        for await (const file of files) {
            const filePath = path.join(components, file.name);
            const name = path.parse(filePath).name;
            const result = index.match(`{{${name}}}`)[0];
            if (result) {
                const components = fs.createReadStream(filePath, 'utf8')
                for await (const component of components) {
                    index = index.replace(result, component.toString());
                    await fs.promises.writeFile(projectIndexPath, index);
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}

const stylesPath = path.join(__dirname, 'styles');
const projectStylePath = path.join(projectPath, 'style.css');

const readStyles = async (pathToFile, newFolder) => {
    try {
        await fs.promises.writeFile(newFolder, '')
        const files = await fs.promises.readdir(pathToFile, { withFileTypes: true });
        for await (const file of files) {
            const filePath = path.join(pathToFile, file.name);
            const ext = path.parse(filePath).ext;
            if (ext.slice(1) === 'css') {
                const streams = fs.createReadStream(filePath, 'utf8');
                for await (const stream of streams) {
                    await fs.promises.appendFile(newFolder, stream)
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
}

const recursiveDelete = async (dirPath) => {
    try {
        await fs.promises.rm(dirPath, { recursive: true });
    } catch (e) {
        return
    }
}

const recursiveCopy = async (pathToFile, pathToCopy) => {
    try {
        await fs.promises.mkdir(pathToCopy, { recursive: true });
        const files = await fs.promises.readdir(pathToFile, { withFileTypes: true });
        for (const file of files) {
            const newFilePath = path.join(pathToFile, file.name);
            const newCopyPath = path.join(pathToCopy, file.name);
            if (file.isFile()) {
                await fs.promises.copyFile(newFilePath, newCopyPath);
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
    await recursiveDelete(projectPath);
    await fs.promises.mkdir(projectPath, { recursive: true });
    await main(path.join(__dirname, 'template.html'), componentsFolderPath)
    await readStyles(stylesPath, projectStylePath)
    await recursiveCopy(assets, projectPathAssets);
}
refresh();