const RollingAverage = require('./rolling-average');

const downloadAverage = new RollingAverage();
const cacheAverage = new RollingAverage();
let defaultHost = '';

function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
      var suffixes = ["", "k", "m", "b","t"];
      var suffixNum = Math.floor( (""+value).length/3 );
      var shortValue = '';
      for (var precision = 2; precision >= 1; precision--) {
          shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
          var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
          if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
      newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}

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

function printCurrentLine(str) {
  const avgDownload = parseInt(downloadAverage.getAverage());
  const avgCache = parseInt(cacheAverage.getAverage());
  const countTotal = downloadAverage.getCount() + cacheAverage.getCount();

  let string = `[dl: ${avgDownload}ms|ca: ${avgCache}ms|#${abbreviateNumber(countTotal)}] ${str}`;

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(string);
}

function printNextLine(str) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(str + '\n');
}

module.exports = {
  abbreviateNumber,
  constructUrl,
  printCurrentLine,
  printNextLine,
  downloadAverage,
  cacheAverage,
};
