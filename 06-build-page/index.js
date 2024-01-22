const fs = require('fs').promises;
const path = require('path');

const distFolder = 'project-dist';
const templateFile = 'template.html';
const outputFile = 'index.html';
const componentsFolder = 'components';

const distFolderPath = path.join(__dirname, distFolder);
const templateFilePath = path.join(__dirname, templateFile);
const outputFilePath = path.join(distFolderPath, outputFile);
const componentsFolderPath = path.join(__dirname, componentsFolder);

async function createFolder(folderPath) {
  try {
    await fs.mkdir(folderPath);
  } catch (error) {
    
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function readContent(filePath) {
  return await fs.readFile(filePath, 'utf-8');
}

async function writeContent(filePath, content) {
  await fs.writeFile(filePath, content, 'utf-8');
}

async function generateHTML() {
  
  await createFolder(distFolderPath);

  
  const templateContent = await readContent(templateFilePath);

  
  const replacedContent = templateContent.replace(/\{\{([^}]+)\}\}/g, async (match, componentName) => {
    const componentFilePath = path.join(componentsFolderPath, `${componentName}.html`);

    try {
      
      const componentContent = await readContent(componentFilePath);
      return componentContent;
    } catch (error) {
      console.warn(`Warning: Component file not found for tag {{${componentName}}}`);
      return match; // Keep the original tag if the component file is not found
    }
  });

  await writeContent(outputFilePath, replacedContent);

  console.log(`Generated ${outputFilePath} by replacing template tags with component contents.`);
}

generateHTML();


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