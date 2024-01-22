const fs = require('fs').promises;
const path = require('path');


// CSS

const stylesFolder = './06-build-page/styles';
const outputFileCSS = './06-build-page/project-dist/bundle.css';

async function combineCSS(files) {
  const cssContents = await Promise.all(files.map(async (cssFile) => {
    const filePath = path.join(stylesFolder, cssFile);
    return await fs.readFile(filePath, 'utf-8');
  }));

  return cssContents.join('\n');
}

async function generateCSS() {
  try {

    const cssFiles = (await fs.readdir(stylesFolder)).filter(file => file.endsWith('.css'));

    const cssContent = await combineCSS(cssFiles);

    await fs.writeFile(outputFileCSS, cssContent, 'utf-8');

  } catch (error) {
    console.error('Error:', error);
  }
}

generateCSS();

// assets

async function copyFolder(sourceDir, destinationDir) {
  try {
    await fs.mkdir(destinationDir, { recursive: true });

    const files = await fs.readdir(sourceDir);

    await Promise.all(files.map(async (file) => {
      const sourcePath = path.join(sourceDir, file);
      const destinationPath = path.join(destinationDir, file);

      const isDir = (await fs.stat(sourcePath)).isDirectory();

      if (isDir) {
        await copyFolder(sourcePath, destinationPath);
      } else {
        await fs.copyFile(sourcePath, destinationPath);
      }
    }));

  } catch (error) {
    console.error('Error:', error);
  }
}

copyFolder('./06-build-page/assets', './06-build-page/project-dist/assets');