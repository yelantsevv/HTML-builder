const fs = require('node:fs');
const path = require('node:path');

const pathToFile = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(pathToFile, 'utf-8');

process.stdout.write('Type "exit" to exit.\nWrite your text:\n');

process.stdin.on('data', (data) => {
  const str = data.toString().trim();

  if (str === 'exit') {
    process.emit('SIGINT');
  }

  ws.write(str + '\n');
});

process.on('SIGINT', () => {
  process.stdout.write('Goodbye!\n');
  process.exit();
});
