const fs = require('fs').promises;
const path = require('path');

const stylesFolder = './05-merge-styles/styles';
const outputFilePath = './05-merge-styles/project-dist/bundle.css';

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

    await fs.writeFile(outputFilePath, cssContent, 'utf-8');

  } catch (error) {
    console.error('Error:', error);
  }
}

generateCSS();
