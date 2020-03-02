const fs = require("fs");
const http = require("http");

/////////////////////////////////////////////////////
// Files

// Read a text file - synchronous (blocking)
const output = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(output);

// Write to text file - synchronous (blocking)
const textOut = `This is what we know about the avacados:  ${output}. \n Created on ${Date.now()}`;

fs.writeFileSync("./txt/output.txt", textOut);
console.log("File has been written - blocking");

// Non-blocking, Asynchronous way -- callbacks

fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("error 😎");
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
        console.log("File has been written 🚗");
      });
    });
  });
});
// console.log("Will read file");

///////////////////////////////////
// SERVER

const server = http.createServer((req, res) => {
  console.log(req);
  res.end("Helloooooooo from the server! 🤣");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
