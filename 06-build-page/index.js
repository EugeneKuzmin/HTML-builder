const fs = require('fs');
const path = require('path');

const distFolderPath = path.join(__dirname, 'project-dist');
const templateFilePath = path.join(__dirname, 'template.html');
const outputFilePath = path.join(distFolderPath, 'index.html');
const componentsFolderPath = path.join(__dirname, 'components');

if (!fs.existsSync(distFolderPath)) {
  fs.mkdirSync(distFolderPath);
}

const templateContent = fs.readFileSync(templateFilePath, 'utf-8');

const replacedContent = templateContent.replace(/\{\{([^}]+)\}\}/g, (match, componentName) => {
  const componentFilePath = path.join(componentsFolderPath, `${componentName}.html`);

  if (fs.existsSync(componentFilePath)) {
    return fs.readFileSync(componentFilePath, 'utf-8');
  } else {
    console.warn(`Warning: Component file not found for tag {{${componentName}}}`);
    return match; 
  }
});

fs.writeFileSync(outputFilePath, replacedContent, 'utf-8');

// CSS

const stylesFolderPath = './06-build-page/styles';
const styleFile = './06-build-page/project-dist/style.css';

const cssFiles = fs.readdirSync(stylesFolderPath).filter(file => file.endsWith('.css'));

const combinedStyle = cssFiles.map(cssFile => {
  const filePath = path.join(stylesFolderPath, cssFile);
  return fs.readFileSync(filePath, 'utf-8');
}).join('\n');

fs.writeFileSync(styleFile, combinedStyle, 'utf-8');

// assets

function copyFolder(fromDir, toDir) {

    if (!fs.existsSync(toDir)) {
      fs.mkdirSync(toDir);
    }
    const files = fs.readdirSync(fromDir);
    files.forEach((file) => {
      const sourcePath = path.join(fromDir, file);
      const destinationPath = path.join(toDir, file);
      const isDir = fs.statSync(sourcePath).isDirectory();
      if (isDir) {
          copyFolder(sourcePath, destinationPath);
      } else {
        fs.copyFileSync(sourcePath, destinationPath);
      }
    });
  }
  copyFolder('./06-build-page/assets', './06-build-page/project-dist/assets');


