const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const request = require('./modules/request');
const {
  constructUrl,
  printCurrentLine,
  printNextLine,
  cacheAverage,
  timer,
} = require('./modules/utils');

const app = express();

const CACHE_FOLDER = path.join(__dirname, 'cache');

app.use(bodyParser.urlencoded({ extended: true }));
if (!fs.existsSync(CACHE_FOLDER)) fs.mkdirSync(CACHE_FOLDER);

// -------------------------------------------------------------------------- //

app.all('*', (req, res) => {
  const { originalUrl, method } = req;
  const url = constructUrl(originalUrl);
  const filename = crypto.createHash("sha1").update(url).digest("hex");
  const filepath = path.join(CACHE_FOLDER, filename);

  if (method === 'POST') {
    printNextLine(`mwOffliner doesnt do POSTs. ${url}`);
    printCurrentLine('');
    const errorFileList = path.join(__dirname, 'error.log');
    fs.appendFile(errorFileList, `Post occured on: ${url}\n`, 'utf8');
  }

  timer.start(url);

  if (fs.existsSync(filepath)) { // averages less than 1ms time
    res.sendFile(filepath, (err) => { // sending the file takes the most time
      const delta = timer.end(url);
      cacheAverage.add(delta);
      printCurrentLine(`200 = ${delta}ms : ${url}`);
    });
  } else {
    request(url, filename, req, res);
  }
});

console.log('listening on port 3000')
app.listen('3000');
