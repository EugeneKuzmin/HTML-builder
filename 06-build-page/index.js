const fs = require('fs').promises;
const path = require('path');

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

  const distFolder = './06-build-page/project-dist';
  const templateFile = './06-build-page/template.html';
  const outputFile = './06-build-page/project-dist/index.html';
  const componentsFolder = './06-build-page/components';

  try {
    await createFolder(distFolder);

    const templateContent = await readContent(templateFile);

    const replacedContent = await Promise.all(
      templateContent.match(/\{\{([^}]+)\}\}/g).map(async (match) => {
        const componentName = match.slice(2, -2); 
        const componentFilePath = path.join(componentsFolder, `${componentName}.html`);

        try {
          const componentContent = await readContent(componentFilePath);
          return { match, componentContent };
        } catch (error) {
          console.warn(`Warning: Component file not found {{${componentName}}}`);
          return { match, componentContent: match }; 
        }
      })
    );

    let finalContent = templateContent;
    replacedContent.forEach(({ match, componentContent }) => {
      finalContent = finalContent.replace(match, componentContent);
    });

    await writeContent(outputFile, finalContent);

  } catch (error) {
    console.error('Error:', error);
  }
}

generateHTML();

// CSS

const stylesFolder = './06-build-page/styles';
const outputFileCSS = './06-build-page/project-dist/style.css';

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

    try {
      await fs.rm(destinationDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

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