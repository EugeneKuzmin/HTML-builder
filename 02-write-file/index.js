
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt(`Hi! Enter some text.`);
rl.prompt();

const fileName = './02-write-file/text.txt';
const writeStream = fs.createWriteStream(fileName, { flags: 'a' });

const writeToFile = (text) => {
    writeStream.write(text + '\n', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      }
    });
  };

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('File as written succesfully. See you later!');
    rl.close();
  } else {
    writeToFile(input);
  }
});

rl.on('SIGINT', () => {
    rl.setPrompt(`File as written succesfully. See you later!`);
rl.prompt();
  rl.close();
});

rl.on('close', () => {
  process.exit();
});
