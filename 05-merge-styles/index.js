console.clear();
const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const callback = (err) => { if (err) throw err };

fs.writeFile(bundlePath, '', callback)
fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err
    else {
        files.forEach(file => {
            if (file.isFile()) {
                const filePath = path.join(stylesPath, file.name);
                const ext = path.parse(filePath).ext;
                if (ext.slice(1) === 'css') {
                    const stream = fs.createReadStream(filePath, 'utf8');
                    stream.on('readable', () => {
                        data = stream.read()
                        if (data != null) {
                            fs.appendFile(bundlePath, data.toString(), callback)
                        }
                    });
                }
            } else {
                throw err;
            }
        });
    }
})
