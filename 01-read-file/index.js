const fs = require('fs');
const path = require('path');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf8');

stream.on('readable', () => {
    data = stream.read()
    if (data != null) console.log(data.toString());
});
