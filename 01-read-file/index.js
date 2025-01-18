const fs = require('node:fs');
const path = require('node:path');

const fileText = path.join(__dirname, 'text.txt');

fs.createReadStream(fileText)
  .on('open', () => process.stdout.write('\n'))
  .on('data', (chunk) => process.stdout.write(chunk))
  .on('end', () => process.stdout.write('\n'));
