const fs = require('fs');
const path = require('path');

const folderPath = './03-files-in-folder/secret-folder';

function processFolder(folderPath) {
  fs.readdir(folderPath, (err, entries) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    entries.forEach((entry) => {
      const entryPath = path.join(folderPath, entry);

      fs.stat(entryPath, (err, stats) => {
        if (err) {
          console.error(`Error getting information for ${entry}:`, err);
          return;
        }

        if (stats.isDirectory()) {
          processFolder(entryPath);
        } else {
          console.log(`${path.parse(entry).name} - ${path.parse(entry).ext.slice(1)} - ${stats.size} byte`);
        }
      });
    });
  });
}

processFolder(folderPath);