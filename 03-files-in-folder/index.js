const fs = require('fs');
const path = require('path');

const secretPathFolder = path.join(__dirname, 'secret-folder');
console.log(secretPathFolder)

fs.readdir(secretPathFolder, { withFileTypes: true },
    (err, files) => {
        console.log(`\nCurrent directory files:${secretPathFolder}`);
        if (err) throw err
        else {
            files.forEach(file => {
                if (file.isFile()) {
                    const filePath = path.join(secretPathFolder, file.name);
                    const ext = path.parse(filePath).ext;
                    const name = path.parse(filePath).name;
                    fs.stat(filePath, (err, stats) => {
                        if (err) throw err
                        const fileSize = (stats.size / 1000).toFixed(3) + 'kb';
                        console.log(`${name} - ${ext.slice(1)} - ${fileSize}`)
                    })
                }
            })
        }
    })
