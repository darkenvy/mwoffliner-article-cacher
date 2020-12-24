const axios = require('axios');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const {
  printCurrentLine,
  printNextLine,
  downloadAverage,
  timer,
} = require('./utils');

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

module.exports = request;
