const fs = require('fs').promises;
const path = require('path');

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

copyFolder('./04-copy-directory/files', './04-copy-directory/files-copy');
