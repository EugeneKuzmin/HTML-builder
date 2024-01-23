const fs = require("fs");
const readableStream = fs.createReadStream("./01-read-file/text.txt","utf-8");

let txt = "";
readableStream.on("data", (chunk) => txt += chunk);
readableStream.on("end", () => console.log(txt));

readableStream.on("error", (error) => console.log("Error", error.message));