const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;
const filePath = path.join(__dirname, 'notes.txt');

const exit = 'exit';
const goodbye = () => {
    stdout.write('SEE YOUR LATER!');
    process.exit();
}
stdout.write('TIME TO  WRITE\n')
stdin.on('data', data => {
    const newWord = data.toString().toLowerCase().replace(/\r?\n|\r/g, "");
    if (newWord === exit) {
        goodbye()
    }
    fs.appendFile(
        filePath,
        data,
        err => {
            if (err) throw err;
        }
    );
})
process.on('SIGINT', goodbye);
