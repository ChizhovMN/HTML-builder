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

// const callback = (err) => { if (err) throw err }

//  function recursiveCopy(filePath, copyPath) {
//      fs.mkdir(copyPath, { recursive: true }, callback)
//      fs.readdir(filePath, { withFileTypes: true }, (err, files) => {
//         if (err) throw err
//         else {
//             files.forEach(file => {
//                 let newFilePath = path.join(filePath, file.name);
//                 let newCopyPath = path.join(copyPath, file.name);
//                 if (file.isFile()) {
//                     fs.copyFile(newFilePath, newCopyPath, callback);
//                 }
//                 if (file.isDirectory()) {
//                     recursiveCopy(newFilePath, newCopyPath)
//                 }
//             });
//         }
//     })
// }
//  function recursiveDelete() {
//      fs.rm(pathToCopy, { recursive: true }, (error) => {
//         if (error) {
//             console.error('обновляем');
//         }
//     })
// }



// fs.readdir(copyPath, { withFileTypes: true }, (err, files) => {
//     if (err) throw err
//     else {
//         fs.mkdir(pathToCopy, { recursive: true }, callback)
//         files.forEach(file => {
//             let filePath = path.join(copyPath, file.name);
//             let newPath = path.join(pathToCopy, file.name);
//             if (file.isFile()) {
//                 fs.copyFile(filePath, newPath, callback);
//             }
//             if (file.isDirectory()) {
//                 recursiveCopy(filePath, newPath)
//             }
//         });
//     }
// })