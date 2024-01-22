const fs = require('fs');
const path = require('path');

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

copyFolder('./04-copy-directory/files', './04-copy-directory/files-copy');