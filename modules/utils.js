const { max } = require('lodash');
const Timer = require('./modules/timer');
const RollingAverage = require('./rolling-average');

const downloadAverage = new RollingAverage();
const cacheAverage = new RollingAverage();
const timer = new Timer();

let defaultHost = '';


function constructUrl(originalUrl) {
  const sliced = originalUrl.slice(1); // removes the leading /
  let url = '';

  /* Sometimes mwOffliner makes requests without the host. We must know who the host is
  in order to send requests. Thankfully, the first request always has it. So we save it.
  
  We also don't alway add this as a prefix, because requests outside of wikipedia are allowed */
  if (!defaultHost && /^https?:\/\//.test(sliced)) {
    defaultHost = sliced;
    printNextLine(`Set DefaultHost to ${defaultHost}`);
    printCurrentLine('');
  }

  // if URL is missing https, add the default_host as a prefix
  if (!/^https?:\/\//.test(sliced)) {
    url += defaultHost;
  }

  url += sliced;

  return url;
}

function spliceLongString(str, maxLength) {
  if (str.length < maxLength || maxLength <= 5 || !maxLength) return str;

  const halfLength = parseInt(maxLength / 2) - 2;
  const strA = str.slice(0, halfLength);
  const strB = str.slice(str.length - halfLength);

  return `${strA}...${strB}`;
}

function printCurrentLine(str) {
  const maxColumns = parseInt(process.stdout.columns) - 1;
  const avgDownload = parseInt(downloadAverage.getAverage());
  const avgCache = parseInt(cacheAverage.getAverage());
  const countTotal = downloadAverage.getCount() + cacheAverage.getCount();

  let finalString = `[dl: ${avgDownload}ms|ca: ${avgCache}ms|#${countTotal}] `;
  const remainingLength = maxColumns - finalString.length;
  finalString += spliceLongString(str, remainingLength);

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(finalString);
}

function printNextLine(str) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(str + '\n');
}

module.exports = {
  constructUrl,
  printCurrentLine,
  printNextLine,
  downloadAverage,
  cacheAverage,
  timer,
};
