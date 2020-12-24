const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Timer = require('./modules/timer');
const {
  constructUrl,
  printCurrentLine,
  printNextLine,
  downloadAverage,
  cacheAverage,
} = require('./modules/utils');

const app = express();
const timer = new Timer();
const CACHE_FOLDER = path.join(__dirname, 'cache');

app.use(bodyParser.urlencoded({ extended: true }));
if (!fs.existsSync(CACHE_FOLDER)) fs.mkdirSync(CACHE_FOLDER);

// -------------------------------------------------------------------------- //

function request(url, filename, req, res) {
  const { method } = req;

  axios({
    method,
    url,
    data: req.body,
    responseType: 'arraybuffer',
  })
  .then(axiosRes => {
    const url = _.get(axiosRes, 'config.url', '');
    const statusCode = _.get(axiosRes, 'status', 200);
    const data = _.get(axiosRes, 'data', '');
    const delta = timer.end(url);
    
    downloadAverage.add(delta);
    printCurrentLine(`200 - ${delta}ms : ${url}`);

    res.statusCode = statusCode;
    res.send(data);

    // dont save files if there are issues
    if (statusCode > 400 || !data) return;

    // save file
    fs.writeFile(path.join(CACHE_FOLDER, filename), data, (err) => {
      if (err) {
        printNextLine(`  - Error saving file: ${err}`);
        printCurrentLine('');
        const errorFileList = path.join(__dirname, 'error_files.lst');
        fs.appendFile(errorFileList, `${url}\n`, 'utf8');
      }
    });
  })
  .catch(error => {
    const url = _.get(error, 'config.url', '');
    const statusCode = _.get(error, 'response.status', 500);
    const statusText = _.get(error, 'response.statusText', 'Error in caching proxy');
    
    printNextLine(`500: ${url} - ${statusText}`);
    printCurrentLine('');
    
    res.statusCode = statusCode;
    res.send(statusText)
  });
}

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
      printCurrentLine(`200 + ${delta}ms : ${url}`);
    });
  } else {
    request(url, filename, req, res);
  }
});

console.log('listening on port 3000')
app.listen('3000');
