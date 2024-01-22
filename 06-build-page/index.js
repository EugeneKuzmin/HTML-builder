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