const fs = require('node:fs/promises');
const path = require('node:path');

const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToStyles = path.join(__dirname, 'styles');
const pathToAssets = path.join(__dirname, 'assets');
const pathToComp = path.join(__dirname, 'components');
const pathToTemplate = path.join(__dirname, 'template.html');

async function buildPage() {
  try {
    // Создаём папку проекта
    await fs.mkdir(pathToProjectDist, { recursive: true });

    // Выполняем шаги сборки
    await createTemplate();
    await mergeStyles();
    await copyDir(pathToAssets, path.join(pathToProjectDist, 'assets'));
  } catch (err) {
    console.error('Ошибка сборки:', err.message);
  }
}

async function createTemplate() {
  const templateContent = await fs.readFile(pathToTemplate, 'utf-8');
  const components = await fs.readdir(pathToComp, { withFileTypes: true });
  let finalContent = templateContent;

  for (const component of components) {
    if (component.isFile() && path.extname(component.name) === '.html') {
      const compName = path.basename(component.name, '.html');
      const componentPath = path.join(pathToComp, component.name);
      const compCont = await fs.readFile(componentPath, 'utf-8');
      finalContent = finalContent.replace(`{{${compName}}}`, compCont);
    }
  }

  await fs.writeFile(path.join(pathToProjectDist, 'index.html'), finalContent);
}

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

  await fs.writeFile(path.join(pathToProjectDist, 'style.css'), mergedStyles);
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

buildPage();
