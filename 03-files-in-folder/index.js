const fs = require('node:fs/promises');
const path = require('node:path');

const pathToFolder = path.join(__dirname, 'secret-folder');

async function readFolder(pathToFolder) {
  const folderName = [];
  try {
    const files = await fs.readdir(pathToFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const pathToFile = path.join(pathToFolder, file.name);
        const fileExt = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, `.${fileExt}`);

        const stats = await fs.stat(pathToFile);
        const fileSize = (stats.size / 1024).toFixed(2);

        console.log(`${fileName} - ${fileExt} - ${fileSize} kb`);
      } else if (file.isDirectory()) {
        folderName.push(file.name);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
  // проверяем рекурсивно вложенные папки
  // if (folderName.length) {
  //   console.warn('Name folder:', folderName[0]);
  //   const folderPath = path.join(pathToFolder, folderName.shift());
  //   readFolder(folderPath);
  // }
}

readFolder(pathToFolder);
