const fs = require('fs');
const path = require('path');

const stylesFolderPath = './05-merge-styles/styles';
const outputFilePath = './05-merge-styles/project-dist/bundle.css';

const cssFiles = fs.readdirSync(stylesFolderPath).filter(file => file.endsWith('.css'));

const combinedCssContent = cssFiles.map(cssFile => {
  const filePath = path.join(stylesFolderPath, cssFile);
  return fs.readFileSync(filePath, 'utf-8');
}).join('\n');

fs.writeFileSync(outputFilePath, combinedCssContent, 'utf-8');