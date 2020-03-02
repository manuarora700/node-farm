const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////////////////////////
// Files

// Read a text file - synchronous (blocking)
// const output = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(output);

// // Write to text file - synchronous (blocking)
// const textOut = `This is what we know about the avacados:  ${output}. \n Created on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File has been written - blocking");

// // Non-blocking, Asynchronous way -- callbacks

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("error 😎");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//         console.log("File has been written 🚗");
//       });
//     });
//   });
// });
// console.log("Will read file");

///////////////////////////////////
// SERVER
var port = process.env.PORT || 8080;
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Slugify
// ?id=0 hatake fresh-avacado jaisa url me dikhana
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  }

  //   Product page
  else if (pathname === '/product') {
    console.log(query);
    const product = dataObj[query.id];

    const output = replaceTemplate(tempProduct, product);

    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(output);
  }

  //   API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  //   Not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });

    res.end('<h1>404 Not found</h1>');
  }
});

server.listen(port, () => {
  console.log('Listening to requests on port 8000');
});
