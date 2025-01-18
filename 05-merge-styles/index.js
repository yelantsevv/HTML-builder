const fs = require('node:fs/promises');
const path = require('node:path');

const pathToStyles = path.join(__dirname, 'styles');
const pathWrite = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  const styleFiles = await fs.readdir(pathToStyles, { withFileTypes: true });
  const cssFiles = styleFiles.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );

  let mergedStyles = '';
  for (const file of cssFiles) {
    const filePath = path.join(pathToStyles, file.name);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    mergedStyles += fileContent + '\n';
  }
  await fs.writeFile(pathWrite, mergedStyles);
}

mergeStyles();
