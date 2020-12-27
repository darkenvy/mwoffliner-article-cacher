const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { CACHE_FOLDER } = require('./modules/constants');
const request = require('./modules/request');
const {
  constructUrl,
  printCurrentLine,
  printNextLine,
  cacheAverage,
  timer,
} = require('./modules/utils');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
if (!fs.existsSync(CACHE_FOLDER)) fs.mkdirSync(CACHE_FOLDER);

// -------------------------------------------------------------------------- //

app.all('*', (req, res) => {
  const { originalUrl, method } = req;
  const url = constructUrl(originalUrl);
  const filename = crypto.createHash("sha1").update(url).digest("hex");
  const filepath = path.join(CACHE_FOLDER, filename);

  if (method === 'POST') {
    const errorFileList = path.join(__dirname, 'error.log');
    printNextLine(`mwOffliner doesnt do POSTs. ${url}`);
    printCurrentLine('');
    fs.appendFile(errorFileList, `Post occured on: ${url}\n`, 'utf8');
  }

  timer.start(url);

  if (!fs.existsSync(filepath)) { // averages less than 1ms time
    request(url, filename, req, res);
    return;
  }

  res.sendFile(filepath, (err) => { // sending the file takes the most time
    const delta = timer.end(url);
    cacheAverage.add(delta);
    printCurrentLine(`200 = ${delta}ms : ${url}`);
  });
});

console.log(`
  Ready & Listening on Port 1271
  How to use:
    * Always restart this server each time mwUrl changes
    * Prefix your mwUrl parameter with "http://localhost:1271/"
      --mwUrl="https://en.wikipedia.org/"
      becomes...
      --mwUrl="http://localhost:1271/https://en.wikipedia.org/"
`)
app.listen('1271');
